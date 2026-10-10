import Poker from 'poker-ts';
export const names=['ANIMESH','ATLAS','NOVA','EMBER'];
export const ranks=['High card','Pair','Two pair','Three of a kind','Straight','Flush','Full house','Four of a kind','Straight flush','Royal flush'];
export const cardCode=c=>c.rank+c.suit[0].toUpperCase();
export function createTable(){const t=new Poker.Table({smallBlind:5,bigBlind:10},4);for(let i=0;i<4;i++)t.sitDown(i,1000);return t;}
export function playHand(table,number,random=Math.random){
 const refills=[];
 table.seats().forEach((p,i)=>{if(!p||p.stack<1000){if(p)table.standUp(i);table.sitDown(i,1000);refills.push(names[i]);}});
 const startingTotal=table.seats().reduce((s,p)=>s+(p?.stack||0),0);
 table.startHand((number-1)%4);
 const hole=table.holeCards().slice(0,4).map(cards=>(cards||[]).map(cardCode));
 const dealer=table.button();let statuses=['','','',''];const folded=new Set();let frames=[];let count=0;let streetRaises=0;let street=table.roundOfBetting();
 function snapshot(message,kind='action',winnerSeats=[]){
  const inHand=table.isHandInProgress();
  const seats=table.seats().map((p,i)=>({...p,name:names[i],cards:hole[i],folded:folded.has(i),status:statuses[i]}));
  const board=inHand?table.communityCards().map(cardCode):(frames.at(-1)?.board||[]);
  const pots=inHand?table.pots():[];
  const pot=inHand?pots.reduce((s,p)=>s+p.size,0)+seats.reduce((s,p)=>s+(p.betSize||0),0):(frames.at(-1)?.pot||0);
  frames.push({hand:number,dealer,board,seats,pot,message,kind,winners:winnerSeats,street:inHand?table.roundOfBetting():'result',active:inHand&&table.isBettingRoundInProgress()?table.playerToAct():-1,duration:kind==='result'?4000:kind==='street'?1800:1100,startingTotal});
 }
 snapshot(refills.length?`${refills.join(', ')} rebuy · 1,000 chips`:'Cards dealt · blinds 5 / 10','street');
 while(table.isHandInProgress()){
  while(table.isBettingRoundInProgress()){
   if(++count>160)throw Error('Betting failed to terminate');
   const seat=table.playerToAct(),legal=table.legalActions(),p=table.seats()[seat],r=random();
   const biggestBet=table._table._dealer._bettingRound._biggestBet;const callGap=Math.max(0,biggestBet-p.betSize);
   const cards=hole[seat],strong=cards?.length===2&&(cards[0][0]===cards[1][0]||cards.every(c=>'TJQKA'.includes(c[0])));
   let action=legal.actions.includes('check')?'check':'call',amount;
   if(legal.actions.includes('fold')&&!legal.actions.includes('check')&&(p.stack<=callGap||r<(strong?.04:.18))){action='fold';folded.add(seat);}
   else if(legal.chipRange&&streetRaises<2&&r>(strong?.55:.78)){
    const {min,max}=legal.chipRange;const safeMax=p.stack+p.betSize-1;
    if(min<=safeMax){action=legal.actions.includes('raise')?'raise':legal.actions.includes('bet')?'bet':action;
     if(action==='raise'||action==='bet'){amount=Math.min(max,safeMax,Math.max(min,Math.ceil((min+random()*60)/5)*5));streetRaises++;}
    }
   }
   if(!legal.actions.includes(action))action=legal.actions[0];
   const before=p.stack;table.actionTaken(action,amount);const after=table.seats()[seat];const paid=before-after.stack;
   statuses[seat]=!after.stack?'ALL-IN':action.toUpperCase()+(paid?` ${paid}`:'');snapshot(`${names[seat]} ${statuses[seat].toLowerCase()}`);
  }
  table.endBettingRound();
  if(table.areBettingRoundsCompleted()){
   const pots=table.pots();snapshot(pots.every(p=>p.eligiblePlayers.length===1)?'Everyone else folded':'Showdown · best five-card hand wins','street');
   table.showdown();const wins=table.winners();
   const winners=[...new Set(wins.length?wins.flat().map(w=>w[0]):pots.flatMap(p=>p.eligiblePlayers))];
   const labels=wins.length?[...new Set(wins.flat().map(w=>ranks[w[1].ranking]))].join(' / '):'Uncontested';
   statuses=statuses.map((s,i)=>winners.includes(i)?'WINNER':s);
   snapshot(`${winners.map(i=>names[i]).join(' + ')} ${winners.length>1?'split the pot':'takes the pot'} · ${labels}`,'result',winners);
  }else{
   const next=table.roundOfBetting();if(next!==street){street=next;streetRaises=0;statuses=statuses.map((s,i)=>folded.has(i)?'FOLDED':'');snapshot(`${street.toUpperCase()} · betting resumes`,'street');}
  }
 }
 const endTotal=table.seats().reduce((s,p)=>s+(p?.stack||0),0);if(endTotal!==startingTotal)throw Error(`Chip conservation: ${startingTotal} -> ${endTotal}`);
 return frames;
}
