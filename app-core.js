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



let pts = 0;
let totalPts = 0;
let streak = 0;

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

function confetti(){
  const c=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff','#ff9a5c'];
  for(let i=0;i<40;i++){
    const p=document.createElement('div'); p.className='confetti-piece';
    p.style.cssText=`left:${rand(10,90)}vw;top:${rand(5,30)}vh;background:${c[rand(0,c.length-1)]};--dur:${rand(8,16)/10}s;animation-delay:${rand(0,4)/10}s;width:${rand(8,14)}px;height:${rand(8,14)}px;border-radius:${Math.random()>.5?'50%':'3px'};`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),2200);
  }
}