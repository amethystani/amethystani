import {mkdir,writeFile} from 'node:fs/promises';
import {createTable,playHand} from './simulation.mjs';

const handCount=7;
const table=createTable();
const hands=Array.from({length:handCount},(_,i)=>playHand(table,i+1));
const selected=[];
for(const frames of hands){
  const seenByStreet=new Map();
  for(const frame of frames){
    if(frame.kind==='street'){
      selected.push(frame);
      continue;
    }
    if(frame.kind==='action'){
      const seen=(seenByStreet.get(frame.street)||0)+1;
      seenByStreet.set(frame.street,seen);
      if(seen<=2||seen%3===0)selected.push(frame);
      continue;
    }
    if(frame.kind==='result')selected.push(frame);
  }
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const suitGlyph={S:'♠',H:'♥',D:'♦',C:'♣'};
const isRed=code=>/[HD]$/.test(code||'');
const views=selected.map((frame,index)=>({frame,index,start:0,len:frame.duration/1000}));
let elapsed=0;
for(const view of views){view.start=elapsed;elapsed+=view.len;}
const boardCards=frame=>frame.board.map((code,index)=>{
  const rowWidth=(frame.board.length-1)*53+43;
  const x=Math.round(520-rowWidth/2+index*53);
  const red=isRed(code);
  return `<g transform="translate(${x} 203)"><rect width="43" height="58" rx="5" fill="#f3eddf"/><text x="7" y="23" font-size="17" font-weight="700" fill="${red?'#c54e35':'#1e2922'}">${esc(code.slice(0,-1))}</text><text x="7" y="44" font-size="17" fill="${red?'#c54e35':'#1e2922'}">${suitGlyph[code.slice(-1)]}</text></g>`;
}).join('');
function miniCard(code,x,y){
  if(!code){
    return `<g transform="translate(${x} ${y})"><rect width="24" height="35" rx="3" fill="#9a462b" stroke="#ecd7b8" stroke-width="1"/><path d="M4 30L20 6M2 20L14 2M10 33L22 15" stroke="#f5d9b5" stroke-opacity=".42" stroke-width="1"/><circle cx="12" cy="17.5" r="5" fill="none" stroke="#f5d9b5" stroke-opacity=".75"/><text x="12" y="21" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#f5d9b5">✳</text></g>`;
  }
  const color=isRed(code)?'#c54e35':'#1e2922';
  return `<g transform="translate(${x} ${y})"><rect width="24" height="35" rx="3" fill="#f3eddf"/><text x="5" y="15" font-size="13" font-weight="700" fill="${color}">${esc(code.slice(0,-1))}</text><text x="5" y="29" font-size="12" fill="${color}">${suitGlyph[code.slice(-1)]}</text></g>`;
}
const positions=[[433,328],[64,192],[433,78],[802,192]];
const seats=frame=>frame.seats.map((player,index)=>{
  const [x,y]=positions[index];
  const active=frame.active===index;
  const winner=frame.winners.includes(index);
  const dealer=index===frame.dealer;
  const revealed=frame.street==='result'&&!player.folded;
  const cards=(player.cards||[]).slice(0,2).map((code,i)=>miniCard(revealed?code:null,x+111+i*28,y+49)).join('');
  const outline=winner?'#f6c36c':active?'#ff963d':'#e6dcc326';
  const outlineWidth=winner||active?2:1;
  const chip=dealer?`<circle cx="${x+159}" cy="${y+15}" r="9" fill="#ff7628"/><text x="${x+159}" y="${y+19}" text-anchor="middle" font-family="monospace" font-size="9" font-weight="bold" fill="#211509">D</text>`:'';
  return `<g><rect x="${x}" y="${y}" width="174" height="94" rx="10" fill="#11130ff2" stroke="${outline}" stroke-width="${outlineWidth}"/><text x="${x+12}" y="${y+24}" font-weight="700" font-size="12" letter-spacing="1.4" fill="#f5efe2">${player.name}</text>${chip}<text x="${x+148}" y="${y+25}" text-anchor="end" font-family="monospace" font-size="10" fill="#dfcca9">${(player.stack||0).toLocaleString()} ◉</text><text x="${x+12}" y="${y+43}" font-family="monospace" font-size="9" fill="#b9aa8d">${esc(player.status||'AT THE TABLE')}</text>${cards}</g>`;
}).join('');
const scene=frame=>`<rect width="1040" height="500" fill="#11120f"/><text x="48" y="43" font-family="monospace" font-size="11" letter-spacing="2" fill="#ff7628">HAND ${String(frame.hand).padStart(3,'0')} — THE LONG GAME</text><text x="992" y="43" text-anchor="end" font-family="monospace" font-size="10" letter-spacing="1" fill="#aaa391">LIVE · NO-LIMIT HOLD’EM</text><ellipse cx="520" cy="251" rx="474" ry="175" fill="#704d2e"/><ellipse cx="520" cy="244" rx="456" ry="164" fill="#15513a" stroke="#81ad8155" stroke-width="2"/><ellipse cx="520" cy="244" rx="433" ry="145" fill="none" stroke="#b8d1a226" stroke-width="1"/><text x="520" y="177" text-anchor="middle" font-family="monospace" font-size="9" letter-spacing="2" fill="#c8b994">POT</text><text x="520" y="196" text-anchor="middle" font-family="monospace" font-size="15" fill="#fff">${frame.pot.toLocaleString()} ◉</text>${boardCards(frame)}<text x="520" y="284" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing="1.4" fill="#d9c7a482">ANIMESH · THE LONG GAME</text><text x="520" y="301" text-anchor="middle" font-family="monospace" font-size="8" letter-spacing="1.8" fill="#d9c7a45a">NO LIMIT · TEXAS HOLD’EM</text>${seats(frame)}<rect x="385" y="434" width="270" height="34" rx="17" fill="#10130fee" stroke="#ffffff2d"/><text x="520" y="456" text-anchor="middle" font-family="monospace" font-size="10" letter-spacing=".4" fill="#f5efe2">${esc(frame.message.toUpperCase().slice(0,40))}</text><text x="48" y="487" font-family="monospace" font-size="9" letter-spacing="1" fill="#b7ad98">ROTATING SEATS · FRESH DEALS · PLAY CHIPS ONLY</text><text x="992" y="487" text-anchor="end" font-family="monospace" font-size="9" fill="#ff985c">CLICK TO WATCH THE LIVE TABLE ↗</text>`;
const key=(time,total)=>(time/total).toFixed(6);
const anim=views.map((view,index)=>{
  const start=key(view.start,elapsed);
  const end=key(view.start+view.len-.025,elapsed);
  const first=index===0;
  const values=first?'1;0;0':'0;1;0;0';
  const keyTimes=first?`0;${end};1`:`0;${start};${end};1`;
  return `<g opacity="${first?1:0}"><animate attributeName="opacity" dur="${elapsed.toFixed(2)}s" repeatCount="indefinite" calcMode="discrete" values="${values}" keyTimes="${keyTimes}"/>${scene(view.frame)}</g>`;
}).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1040" height="500" viewBox="0 0 1040 500" role="img" aria-labelledby="title desc"><title id="title">The Long Game: Animesh Mishra’s animated Texas Hold’em table</title><desc id="desc">A slowly unfolding multi-hand Hold’em replay with unique hole cards, private hands until showdown, rotating dealers and a clickable link to the live table.</desc><style>svg{font-family:Arial,sans-serif}</style><a xlink:href="https://amethystani.github.io/amethystani/poker/" target="_blank"><rect width="1040" height="500" fill="#11120f"/>${anim}<rect width="1040" height="500" fill="transparent"/></a></svg>`;
await mkdir('../assets',{recursive:true});
await writeFile('../assets/the-long-game.svg',svg);
console.log(`Generated ${views.length} table moments from ${hands.length} complete Hold’em hands (${Math.round(elapsed)}s loop).`);
