

import { Hono } from 'hono';

const route = new Hono();
route.get('/',(c)=>{
  return c.text('game')
})

export default route;