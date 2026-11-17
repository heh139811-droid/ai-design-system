import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const file=fileURLToPath(new URL('../dist/hub/index.html',import.meta.url));
const port=Number(process.env.PORT||4175);
const server=http.createServer(async(req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(!['/','/index.html','/START.html'].includes(pathname)){res.writeHead(404);res.end('Not found');return;}
  try{const html=await readFile(file);res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:html);}catch{res.writeHead(503);res.end('Build first: npm run build');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Brand hub: http://127.0.0.1:${port}`));
