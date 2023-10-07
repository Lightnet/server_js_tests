//only work in bun.sh
//

import { Elysia } from 'elysia';
//import Database from 'better-sqlite3';//does not work windows sub linux
//const db = new Database('foobar.db', { 
  //verbose: console.log 
//});

const app = new Elysia();
app.get('/', () => 'Hello Elysia');


app.listen({
  port:3000,
  hostname: '0.0.0.0',
},()=>{
  //console.log(`Elysia is running http://locahost:3000`);
  console.log(`Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
});


//console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)