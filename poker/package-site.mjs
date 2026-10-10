import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
const root=new URL('./site-dist/',import.meta.url);
await rm(root,{recursive:true,force:true});
await mkdir(new URL('poker/',root),{recursive:true});
await mkdir(new URL('assets/',root),{recursive:true});
for(const file of ['index.html','style.css','app.bundle.js']) await cp(new URL(file,import.meta.url),new URL(`poker/${file}`,root));
await cp(new URL('../assets/cards/',import.meta.url),new URL('assets/cards/',root),{recursive:true});
await writeFile(new URL('index.html',root),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=https://www.animeshmishra.us/"><title>Animesh Mishra</title><p>Taking you to <a href="https://www.animeshmishra.us/">Animesh’s website</a>. <a href="./poker/">Watch the live poker table</a>.</p>\n');
console.log('Packaged profile site and endless poker table for Pages.');
