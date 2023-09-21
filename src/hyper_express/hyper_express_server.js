// note static folder set up is trouble
//
import van from "mini-van-plate/van-plate";
import HyperExpress from 'hyper-express';
import LiveDirectory from 'live-directory';
import * as url from 'url';
import path from 'node:path';
import Database from 'better-sqlite3';
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
//console.log("__filename: ", __filename)
//console.log("__dirname: ", __dirname)

const {script,a,label, body, button, input, li, p, ul} = van.tags;

//const db = new Database('foobar.db', options);
const db = new Database('database.sqlite', { verbose: console.log });
// https://stackoverflow.com/questions/200309/how-to-create-timestamp-column-with-default-value-now
async function create_tables(){
  //await db.exec('CREATE TABLE IF NOT EXISTS tbl (col TEXT);');
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alias varchar(255) NOT NULL,
    passphrase varchar(255) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
}

async function drop_tables(){
  await db.exec(`DROP TABLE users;`);
}

//drop_tables();
create_tables();

//SERVER
const app = new HyperExpress.Server();

// Create a LiveDirectory instance to virtualize directory with our assets
//console.log("path.join(__dirname,'assets'): ", path.join(__dirname,'assets'))
let staticFiles = path.join(__dirname,'assets');
staticFiles = "./assets";
const LiveAssets = new LiveDirectory(staticFiles, {
  //static:false,
  //static: true,
  filter: {
    keep: {
      extensions: ['js'] // We only want to load .js files
    }
  }
});

// Create GET route to serve 'Hello World'
app.get('/', (request, response) => {
  //response.send('Hello World');
  response.send((van.html(
    body(
      script({type:"module",src:'/assets/client.js'}),
    ),
  )));
})

app.post('/api/auth/signup', async(request, response) => {
  const data = await request.json();
  console.log(data)
  if(data){
    if((data.alias !=null)&&(data.passphrase !=null)){
      if((!data.alias)||(!data.passphrase)){
        return response.send(JSON.stringify({api:"EMPTY"}));      
      }
      //db.exec(`DROP TABLE users;`)
      let stmt = db.prepare(`SELECT * FROM users WHERE alias = ?`)
      const userExist = stmt.get(data.alias);
      console.log("userExist: ",userExist);
      if(userExist){
        //exist return
        return response.send(JSON.stringify({api:"EXIST"}));
      }else{
        //create user
        stmt = db.prepare('INSERT INTO users (alias, passphrase) VALUES (?, ?)');
        stmt.run(data.alias, data.passphrase);
        return response.send(JSON.stringify({api:"CREATED"}));
      }

    }
  }
  //response.send('Hello World');
  response.send(JSON.stringify({api:"ERROR"}));
});

app.post('/api/auth/signin', async(request, response) => {
  const data = await request.json();
  console.log(data)
  if(data){
    if((data.alias !=null)&&(data.passphrase !=null)){
      if((!data.alias)||(!data.passphrase)){
        return response.send(JSON.stringify({api:"EMPTY"}));      
      }
      //db.exec(`DROP TABLE users;`)
      let stmt = db.prepare(`SELECT * FROM users WHERE alias = ?`)
      const userExist = stmt.get(data.alias);
      console.log("userExist: ",userExist);
      if(userExist){
        //exist return
        if(data.passphrase == userExist.passphrase){

          return response.send(JSON.stringify({api:"PASS"}));
        }else{
          return response.send(JSON.stringify({api:"DENIED"}));
        }
        
      }else{
        return response.send(JSON.stringify({api:"NONEXIST"}));
      }

    }
  }
  response.send(JSON.stringify({api:"ERROR"}));
});

//TEST
app.get('/setcookie',(request, response)=>{
  return response
    .cookie(
      'testcookie',
      'TESTCOOKIE',
      new Date(Date.now() + 60*60*24 ),
      false)
    //.type('javascript')
    //.header('content-type',"application/javascript")
    .send('cookie');
})
//TEST
app.get('/clearcookie',(request, response)=>{
  return response
    .cookie(
      'testcookie',
      'TESTCOOKIE',
      0,//clear by expire date
      false)
    //.type('javascript')
    //.header('content-type',"application/javascript")
    .send('cookie');
})

// Create static serve route to serve frontend assets
app.get('/assets/*', (request, response) => {
  // Strip away '/assets' from the request path to get asset relative path
  // Lookup LiveFile instance from our LiveDirectory instance.
  const path = request.path.replace('/assets/', '');
  const asset = LiveAssets.get(path);
  if (!asset) return response.status(404).send('Not Found');

  if (asset.cached) {//need to fix this
    console.log(asset)
    return response
      //.type('javascript')
      .header('content-type',"application/javascript")
      .send(asset.content);
  }else{
    const readable = asset.stream();
    return readable.pipe(response);
  }
});

// Activate webserver by calling .listen(port, callback);
app.listen(80)
  .then((socket) => console.log('Webserver started on port http://localhost:80'))
  .catch((error) => console.log('Failed to start webserver on port 80'));

