import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
const root=new URL('./site-dist/',import.meta.url);
await rm(root,{recursive:true,force:true});
await mkdir(new URL('poker/',root),{recursive:true});
await mkdir(new URL('assets/',root),{recursive:true});
for(const file of ['index.html','style.css','app.bundle.js']) await cp(new URL(file,import.meta.url),new URL(`poker/${file}`,root));
await cp(new URL('../assets/cards/',import.meta.url),new URL('assets/cards/',root),{recursive:true});
await writeFile(new URL('index.html',root),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=./poker/"><link rel="canonical" href="./poker/"><title>The Long Game — Live Hold’em</title><a href="./poker/">Open the live table</a></html>\n');
console.log('Packaged a direct-to-table Pages entry and endless poker table.');
