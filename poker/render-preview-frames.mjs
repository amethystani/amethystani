import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {availableParallelism} from 'node:os';
import {isMainThread,parentPort,Worker,workerData} from 'node:worker_threads';

if(!isMainThread){
  const {Resvg}=await import('@resvg/resvg-js');
  for(const task of workerData.tasks){
    const png=new Resvg(task.svg,{fitTo:{mode:'width',value:1040}}).render().asPng();
    await writeFile(task.path,png);
  }
  parentPort.postMessage('done');
}

export async function renderPreviewFrames(svgs,directory){
  const paths=svgs.map((_,index)=>join(directory,`frame-${String(index).padStart(4,'0')}.png`));
  const workerCount=Math.min(8,availableParallelism(),svgs.length);
  const workers=Array.from({length:workerCount},(_,workerIndex)=>{
    const tasks=svgs.map((svg,index)=>({svg,path:paths[index]})).filter((_,index)=>index%workerCount===workerIndex);
    return new Promise((resolve,reject)=>{
      const worker=new Worker(new URL(import.meta.url),{workerData:{tasks}});
      worker.once('message',resolve);
      worker.once('error',reject);
      worker.once('exit',code=>code===0?resolve():reject(new Error(`Preview renderer worker exited with ${code}`)));
    });
  });
  await Promise.all(workers);
  return paths;
}
