
// 
// https://github.com/orgs/honojs/discussions/1355
// 
// 
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { html } from 'hono/html';
//import { logger } from 'hono/logger';
//import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
//import { jwt } from 'hono/jwt'
// https://hono.dev/helpers/cookie

import SQLDB from '../database/node_sql_database.js';
import game from './game.js';
import auth from './auth.js';
import blog from './blog.js';

//middleware for db
//note it reload for every request
export function useDB(options){
  //console.log('config db???')
  //console.log(options);
  let _db;
  if(options){
    if(options.db){
      _db = options.db;
    }
  }
  //layer by layer
  return async (c, next) => {
    //console.log('set db???')
    c.set('db',_db)
    await next();
  }
}
// DATABASE
const db = new SQLDB();

const PORT = process.env.PORT || 3000;

// Web Fetch Server
const app = new Hono({ 
  //strict: false 
});

//middleware
//note this will request every action if set to '*' to aollow all url
app.use('*',useDB({
  db:db,
}));

//app.use(
  //'/auth/*',
  //jwt({
    //secret: 'it-is-very-secret',
    //cookie:'token',
  //})
//)
//app.use('*', logger())
//app.use('*', async (c, next) => {
  //console.log(`[${c.req.method}] ${c.req.url}`)
  //await next()
//})

app.route('/game', game);
app.route('/', auth);
app.route('/', blog);

//<script type="module" src="/client.js"></script>
//<script type="module" src="/vanjs_client.js"></script>
//<script type="module" src="/solid_client.js"></script>
//<script type="module" src="/preact_client.js"></script>
//<script type="module" src="/vanjs_client.js"></script>
app.get('/', (c) => {
  const db = c.get('db');
  //console.log('db', db);
  //return c.text('Hono!')
  const pageHtml = html`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>hono js</title>
      <style>
        body{
          background:gray;
        }
      </style>
    </head>
    <body>
      <script type="module" src="/van_three.js"></script>
    </body>
  </html>
  `;
  return c.html(pageHtml);
})

//set up static folder for public access
app.use('/*', serveStatic({ root: './assets' }));

//https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
let typeServer = 'none';
if((typeof process !== 'undefined') && (process.release.name === 'node')){
  typeServer='node';
}
if(typeof Bun == 'object'){
  typeServer='bun';
}

//server base on bun api by fetch
if(typeServer=='node'){
  serve({
    fetch: app.fetch,
    port:PORT
  });
  console.log('Process Type:',typeServer)
  console.log(`hono server  http://localhost:${PORT}`)
}

export default app