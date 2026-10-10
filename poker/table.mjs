import {createTable,playHand} from './simulation.mjs';
const table=createTable();let hand=0;let speed=1;let timer=0;let paused=false;let sequence=0;let current=null;
const $=s=>document.querySelector(s),seats=$('#seats'),board=$('#board'),feed=$('#feed'),toast=$('#toast');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const suit=s=>({S:'♠',H:'♥',D:'♦',C:'♣'}[s]||'');const red=c=>c.endsWith('H')||c.endsWith('D');
function card(code,down=false){if(down)return '<div class="card back-card" aria-label="Face down card"></div>';return `<div class="card" aria-label="${esc(code)}"><img src="../assets/cards/${encodeURIComponent(code)}.svg" alt="${esc(code)}" onerror="this.parentElement.innerHTML='<b style=&quot;color:${red(code)?'#bf402d':'#20251e'}&quot;>${esc(code.slice(0,-1))}<br>${suit(code.slice(-1))}</b>'"></div>`;}
function render(f){$('#hand-id').textContent=`HAND ${String(f.hand).padStart(3,'0')}`;$('#round-label').textContent=`${f.street==='result'?'SHOWDOWN':f.street.toUpperCase()} · BLINDS 5 / 10`;
 $('#pot').textContent=f.pot.toLocaleString('en-US');board.innerHTML=Array.from({length:5},(_,i)=>f.board[i]?card(f.board[i]):'<div class="empty-card"></div>').join('');
 const spot=['seat-bottom','seat-left','seat-top','seat-right'];seats.innerHTML=f.seats.map((p,i)=>`<article class="seat ${spot[i]} ${i===f.active?'active':''} ${f.winners.includes(i)?'winner':''}" data-seat="${i}"><div class="seat-head"><b class="seat-name">${p.name}</b><span class="seat-stack">${(p?.stack??0).toLocaleString()} ◉</span></div><div class="seat-sub">${esc(p.status||((i===f.dealer)?'DEALER BUTTON':'AT THE TABLE'))}</div><div class="seat-cards">${(p.cards||[]).slice(0,2).map(c=>card(c,p.folded||f.street!=='result')).join('')}</div></article>`).join('');
 const pos=['bottom','left','top','right'][f.dealer];$('#dealer-track').innerHTML=`<div class="button-chip seat-${pos}" aria-label="Dealer button">D</div>`;
 toast.textContent=f.message.toUpperCase();toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),f.kind==='result'?5200:f.kind==='street'?3800:2400);
 feed.innerHTML=`<span>H${String(f.hand).padStart(3,'0')}</span> &nbsp;·&nbsp; ${esc(f.message)} &nbsp;·&nbsp; ${f.seats.map(p=>`${p.name} ${p.stack}`).join(' / ')}`;}
function runHand(){if(paused)return;hand++;current=playHand(table,hand);sequence=0;step();}
function step(){if(paused)return;const frames=current;if(!frames||sequence>=frames.length){setTimeout(runHand,2200/speed);return;}const f=frames[sequence++];render(f);setTimeout(step,f.duration/speed);}
$('#speed').addEventListener('click',()=>{speed=speed===1?0.7:1;$('#speed b').textContent=speed===1?'1×':'0.7×';});
// Visibility pauses the visual clock; the state machine resumes at the next frame.
document.addEventListener('visibilitychange',()=>{if(document.hidden){paused=true;}else if(paused){paused=false;step();}});
runHand();
