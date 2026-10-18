import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,join,normalize} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
http.createServer(async(req,res)=>{try{const raw=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(raw==='/'){res.writeHead(302,{location:'/poker/','cache-control':'no-store'});res.end();return;}const path=normalize(join(root,raw));if(!path.startsWith(root))throw Error('bad path');const info=await stat(path);const target=info.isDirectory()?join(path,'index.html'):path;res.writeHead(200,{'content-type':mime[extname(target)]||'application/octet-stream','cache-control':'no-store'});res.end(await readFile(target));}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT||4173),'0.0.0.0',()=>console.log(`The Long Game at http://localhost:${process.env.PORT||4173}/`));
