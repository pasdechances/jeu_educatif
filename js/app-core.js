const WORDS = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix',
  'onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf',
  'vingt','vingt et un','vingt-deux','vingt-trois','vingt-quatre','vingt-cinq',
  'vingt-six','vingt-sept','vingt-huit','vingt-neuf','trente','trente et un',
  'trente-deux','trente-trois','trente-quatre','trente-cinq','trente-six',
  'trente-sept','trente-huit','trente-neuf','quarante','quarante et un',
  'quarante-deux','quarante-trois','quarante-quatre','quarante-cinq',
  'quarante-six','quarante-sept','quarante-huit','quarante-neuf','cinquante',
  'cinquante et un','cinquante-deux','cinquante-trois','cinquante-quatre',
  'cinquante-cinq','cinquante-six','cinquante-sept','cinquante-huit','cinquante-neuf',
  'soixante','soixante et un','soixante-deux','soixante-trois','soixante-quatre',
  'soixante-cinq','soixante-six','soixante-sept','soixante-huit','soixante-neuf',
  'soixante-dix','soixante et onze','soixante-douze','soixante-treize',
  'soixante-quatorze','soixante-quinze','soixante-seize','soixante-dix-sept',
  'soixante-dix-huit','soixante-dix-neuf','quatre-vingts','quatre-vingt-un',
  'quatre-vingt-deux','quatre-vingt-trois','quatre-vingt-quatre','quatre-vingt-cinq',
  'quatre-vingt-six','quatre-vingt-sept','quatre-vingt-huit','quatre-vingt-neuf',
  'quatre-vingt-dix','quatre-vingt-onze','quatre-vingt-douze','quatre-vingt-treize',
  'quatre-vingt-quatorze','quatre-vingt-quinze','quatre-vingt-seize',
  'quatre-vingt-dix-sept','quatre-vingt-dix-huit','quatre-vingt-dix-neuf','cent'];

const DIZ_BG=['#fff0f0','#fff7e0','#f0fff3','#edf6ff','#f6f0ff','#fff0fa','#f0ffff','#fff4e8','#f4fff0'];
const DIZ_BORDER=['#ffb3b3','#ffd97d','#9de0ab','#90c8ff','#cca5ff','#ffb3e6','#80dde8','#ffc085','#a8e880'];
const DIZ_CLR=['#e05555','#c8860a','#2e8b57','#1a6fbf','#7b2fd4','#c4178e','#1a8c9b','#bf5e0f','#3b8012'];
const DIZ_NAMES=['dix','vingt','trente','quarante','cinquante','soixante','soixante-dix','quatre-vingts','quatre-vingt-dix'];
const UNIT_BG=['#e8e8e8','#ffb3b3','#ffd97d','#9de0ab','#90c8ff','#cca5ff','#ffb3e6','#80dde8','#ffc085','#a8e880'];

let pts = 0;
let totalPts = 0;
let streak = 0;
let udNum = 34;
let multA = 3;
let multB = 4;
let memoFlipped = [], memoMatched = 0, memoLock = false, memoMoves = 0;

const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const shuffle = a => [...a].sort(()=>Math.random()-.5);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));


function speak(text){
  if(!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang='fr-FR'; u.rate=0.82; u.pitch=1.05;
  speechSynthesis.speak(u);
}

function updateHUD(earnedPts = 0, x, y){
  document.getElementById('ptsVal').textContent = pts;
  document.getElementById('totalVal').textContent = totalPts;
  document.getElementById('strVal').textContent = streak;
  const b = document.getElementById('ptsVal').closest('.badge');
  b.classList.remove('pts-pop');
  void b.offsetWidth;
  if(earnedPts !== 0) b.classList.add('pts-pop');
  if(earnedPts > 0 && x !== undefined){
    const fl = document.createElement('div');
    fl.className = 'pts-float';
    fl.textContent = '+'+earnedPts+' 🪙';
    fl.style.cssText = `left:${x}px;top:${y}px;`;
    document.body.appendChild(fl);
    setTimeout(()=>fl.remove(), 950);
  }
}

function earnPoints(n, x, y){
  pts += n;
  totalPts += n;
  saveProgress();
  updateHUD(n, x, y);
}

function losePoints(n){
  pts = Math.max(0, pts - n);
  saveProgress();
  updateHUD(-n);
}

function spendPoints(n){
  if(pts >= n){ pts -= n; saveProgress(); updateHUD(); return true; }
  return false;
}


function loadProgress(){
  try {
    const savedPts = Number(localStorage.getItem('jeu-educatif-points') || 0);
    const savedTotalPts = Number(localStorage.getItem('jeu-educatif-total-points') || 0);
    const savedStreak = Number(localStorage.getItem('jeu-educatif-streak') || 0);

    pts = Number.isFinite(savedPts) ? savedPts : 0;
    totalPts = Number.isFinite(savedTotalPts) ? savedTotalPts : 0;
    streak = Number.isFinite(savedStreak) ? savedStreak : 0;
  } catch {
    pts = 0;
    totalPts = 0;
    streak = 0;
  }
}

function saveProgress(){
  localStorage.setItem('jeu-educatif-points', String(pts));
  localStorage.setItem('jeu-educatif-total-points', String(totalPts));
  localStorage.setItem('jeu-educatif-streak', String(streak));
}


function showToast(msg){
  const t = document.getElementById('unlockToast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 3200);
}

function renderDecomp(){
  const tens=Math.floor(udNum/10), units=udNum%10;
  const area=document.getElementById('blocksArea'); area.innerHTML='';
  if(tens>0){
    const g=document.createElement('div'); g.className='block-group';
    const row=document.createElement('div'); row.className='tens-col';
    for(let i=0;i<tens;i++){ const b=document.createElement('div'); b.className='ten-bar pop-in'; b.style.animationDelay=(i*.07)+'s'; row.appendChild(b); }
    g.appendChild(row);
    const lbl=document.createElement('label'); lbl.textContent=tens+' dizaine'+(tens>1?'s':''); g.appendChild(lbl); area.appendChild(g);
  }
  if(units>0){
    const g=document.createElement('div'); g.className='block-group';
    const row=document.createElement('div'); row.className='units-row';
    for(let i=0;i<units;i++){ const c=document.createElement('div'); c.className='unit-cube pop-in'; c.style.animationDelay=(tens*.07+i*.07)+'s'; row.appendChild(c); }
    g.appendChild(row);
    const lbl=document.createElement('label'); lbl.textContent=units+' unité'+(units>1?'s':''); g.appendChild(lbl); area.appendChild(g);
  }
  let eq = tens>0&&units>0 ? `<span class="diz">${tens}×10</span> + <span class="uni">${units}</span> = <strong>${udNum}</strong>`
         : tens>0 ? `<span class="diz">${tens}×10</span> = <strong>${udNum}</strong>`
         : `<span class="uni">${units}</span> unité${units>1?'s':''} = <strong>${udNum}</strong>`;
  document.getElementById('decompEq').innerHTML=eq;
  document.getElementById('decompWord').textContent=WORDS[udNum];
}

function renderDizaines(){
  const g=document.getElementById('dizGrid'); g.innerHTML='';
  for(let d=1;d<=9;d++){
    const n=d*10, card=document.createElement('div');
    card.className='diz-card';
    card.style.cssText=`background:${DIZ_BG[d-1]};border:3px solid ${DIZ_BORDER[d-1]};`;
    const bars=[...Array(d)].map(()=>`<div class="diz-mini-bar" style="background:${DIZ_CLR[d-1]};"></div>`).join('');
    card.innerHTML=`<div class="diz-num" style="color:${DIZ_CLR[d-1]};">${n}</div><div class="diz-word">${DIZ_NAMES[d-1]}</div><div class="diz-bars">${bars}</div>`;
    card.addEventListener('click',()=>{
      speak(n+' : '+DIZ_NAMES[d-1]+'. '+d+' dizaines.');
      document.getElementById('dizDetail').innerHTML=`<span style="color:${DIZ_CLR[d-1]};font-size:1.4rem;">${n}</span> = <strong>${d}</strong> dizaine${d>1?'s':''} de <strong>10</strong><br><small style="color:#aaa;">${DIZ_NAMES[d-1]}</small>`;
    });
    g.appendChild(card);
  }
}

function renderUnites(){
  const g=document.getElementById('unitGrid'); g.innerHTML='';
  for(let u=0;u<=9;u++){
    const card=document.createElement('div'); card.className='unit-card';
    card.style.background=UNIT_BG[u];
    card.innerHTML=`<div class="u-num">${u}</div><div class="u-word">${WORDS[u]}</div>`;
    card.addEventListener('click',()=>showUnitExample(u));
    g.appendChild(card);
  }
}


function switchTab(id, btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  if(btn) btn.classList.add('active');
  if(id==='quiz')         { buildDiffSelector(); nextQuestion(); showQuizSubtab('quiz'); }
  if(id==='ud')           renderDecomp();
  if(id==='multiplication') renderMultiplication();
  if(id==='detente')      { document.getElementById('detNotif').classList.remove('show'); }
}

function renderMultiplication(){
  const aVal = document.getElementById('multAVal');
  const bVal = document.getElementById('multBVal');
  const eq = document.getElementById('multEquation');
  const table = document.getElementById('multTable');

  if(aVal) aVal.textContent = multA;
  if(bVal) bVal.textContent = multB;
  if(eq) eq.textContent = `${multA} × ${multB} = ${multA * multB}`;

  if(table){
    table.innerHTML = '';
    const header = document.createElement('div'); header.className = 'mult-head'; header.textContent = '×'; table.appendChild(header);
    for(let c = 1; c <= 10; c++){
      const headCell = document.createElement('div');
      headCell.className = 'mult-head';
      headCell.textContent = c;
      table.appendChild(headCell);
    }

    for(let r = 1; r <= 10; r++){
      const rowLabel = document.createElement('div');
      rowLabel.className = 'mult-head';
      rowLabel.textContent = r;
      table.appendChild(rowLabel);

      for(let c = 1; c <= 10; c++){
        const cell = document.createElement('div');
        const product = r * c;
        cell.className = 'mult-cell';
        if(r === multA || c === multB) cell.classList.add('highlight');
        cell.textContent = product;
        table.appendChild(cell);
      }
    }
  }
}

function buildGrid(){
  const g=document.getElementById('numGrid');
  for(let n=1;n<=100;n++){
    const c=document.createElement('div');
    c.className='num-cell c'+Math.ceil(n/10);
    c.dataset.n=n;
    c.innerHTML=n+'<span class="tip">'+WORDS[n]+'</span>';
    c.addEventListener('click',()=>{ selectCell(c); speak(WORDS[n]); });
    g.appendChild(c);
  }
}

function selectCell(el){
  document.querySelectorAll('.num-cell.selected').forEach(x=>x.classList.remove('selected'));
  el.classList.add('selected');
}

function highlightMultiples(m,cls){
  resetGrid();
  document.querySelectorAll('.num-cell').forEach(c=>{ if(+c.dataset.n%m===0) c.className='num-cell '+cls+' selected'; });
}

function resetGrid(){
  document.querySelectorAll('.num-cell').forEach(c=>c.className='num-cell c'+Math.ceil(+c.dataset.n/10));
}

function confetti(){
  const c=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a5c'];
  for(let i=0;i<40;i++){
    const p=document.createElement('div'); p.className='confetti-piece';
    p.style.cssText=`left:${rand(10,90)}vw;top:${rand(5,30)}vh;background:${c[rand(0,c.length-1)]};--dur:${rand(8,16)/10}s;animation-delay:${rand(0,4)/10}s;width:${rand(8,14)}px;height:${rand(8,14)}px;border-radius:${Math.random()>.5?'50%':'3px'};`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),2200);
  }
}

function changeMultValue(which, delta){
  if(which === 'a') multA = clamp(multA + delta, 1, 10);
  if(which === 'b') multB = clamp(multB + delta, 1, 10);
  renderMultiplication();
}

function switchUdTab(id,btn){
  document.querySelectorAll('.ud-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ud-tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('ud-'+id).classList.add('active'); btn.classList.add('active');
  if(id==='decomp') renderDecomp();
  if(id==='dizaines') renderDizaines();
  if(id==='unites') renderUnites();
}

function changeUd(d){
  udNum=clamp(udNum+d,1,99); document.getElementById('udDisplay').textContent=udNum; renderDecomp(); speak(WORDS[udNum]);
}

function showUnitExample(u){
  speak(WORDS[u]);
  const chips=[10,20,30,40,50,60,70,80,90].map(d=>{ const n=d+u; if(n>100) return ''; return `<span class="ex-chip"><span class="ex-diz">${Math.floor(n/10)}</span><span class="ex-uni">${u}</span><small style="font-family:'Nunito';font-size:.65rem;color:#aaa;display:block;">${WORDS[n]}</small></span>`; }).filter(Boolean).join('');
  document.getElementById('unitExample').innerHTML=`<p>Le chiffre <strong style="color:#e05555;">${u}</strong> en unité :</p>${chips}`;
}


buildGrid();
buildDiffSelector();
nextQuestion();
newCountRound();
newOrderRound();
renderDecomp();
renderDizaines();
renderUnites();
loadProgress();