

import { Hono } from 'hono';

const route = new Hono();
route.get('/',(c)=>{
  return c.text('app')
})

export default route;