const DIFFICULTIES = [
  {
    id: 1,
    label: "Facile",
    icon: "🌱",
    description: "Reconnais le nombre",
    ptsOk: 5,
    ptsBad: 0,
    streakEvery: 5,
    streakBonus: 10,
    color: "var(--d1)",
    generate: genEasyQ
  },
  {
    id: 2,
    label: "Moyen",
    icon: "⭐",
    description: "Avant / Après",
    ptsOk: 10,
    ptsBad: 0,
    streakEvery: 5,
    streakBonus: 20,
    color: "var(--d2)",
    generate: genMediumQ
  },
  {
    id: 3,
    label: "Addition N1",
    icon: "➕",
    description: "Addition : petits nombres",
    ptsOk: 15,
    ptsBad: 2,
    streakEvery: 4,
    streakBonus: 30,
    color: "var(--d3)",
    generate: genAddQ1
  },
  {
    id: 4,
    label: "Soustraction N1",
    icon: "➖",
    description: "Soustraction : petits nombres",
    ptsOk: 18,
    ptsBad: 2,
    streakEvery: 4,
    streakBonus: 35,
    color: "var(--d4)",
    generate: genSubQ1
  },
  {
    id: 5,
    label: "Addition N2",
    icon: "➕",
    description: "Addition : nombres plus grands",
    ptsOk: 20,
    ptsBad: 3,
    streakEvery: 4,
    streakBonus: 40,
    color: "var(--d3)",
    generate: genAddQ2
  },
  {
    id: 6,
    label: "Soustraction N2",
    icon: "➖",
    description: "Soustraction : nombres plus grands",
    ptsOk: 25,
    ptsBad: 4,
    streakEvery: 4,
    streakBonus: 50,
    color: "var(--d4)",
    generate: genSubQ2
  },
  {
    id: 7,
    label: "Multiplication",
    icon: "✖️",
    description: "Calcul : multiplication (+30 pts)",
    ptsOk: 30,
    ptsBad: 5,
    streakEvery: 3,
    streakBonus: 60,
    color: "var(--d5)",
    generate: genMulQ
  },
  {
    id: 8,
    label: "Expert",
    icon: "🧠",
    description: "Mix tout niveaux (+40 pts)",
    ptsOk: 40,
    ptsBad: 8,
    streakEvery: 3,
    streakBonus: 80,
    color: "var(--d6)",
    generate: genExpertQ
  }
];
const OBJECTS=['🍎','🍌','🍓','🍊','🍇','⭐','🌟','🎈','🎲','🌸','🦋','🐣','🍭','🎀','🎁'];
const OCOLS=['#ffb3b3','#ffd97d','#a8e880','#90c8ff','#cca5ff','#ffb3e6'];


let currentDiff = DIFFICULTIES[0];
let currentAnswer = null;
let pickedBtn = null; 
let pickedVal = null; 
let answered = false;
let countAnswer = 0;
let orderNumbers = [];
let orderPlaced = [];
let tvDrag = null;



function genEasyQ(){
  const n = rand(1,100);
  return {
    prompt: `Quel est ce nombre ?<button class="speak-q-btn" onclick="speak('${n}')">🔊</button><span class="big-num">${n}</span>`,
    answer: WORDS[n],
    choices: makeWordChoices(WORDS[n]),
    display: v => v
  };
}

function genMediumQ(){
  const n = rand(2,99);
  const ask = Math.random()<.5 ? 'suivant' : 'précédent';
  const good = ask==='suivant' ? n+1 : n-1;
  return {
    prompt: `Quel est le nombre <strong>${ask}</strong> ?<button class="speak-q-btn" onclick="speak('${n}')">🔊</button><span class="big-num">${n}</span>`,
    answer: good,
    choices: makeNumChoices(good, 1, 100),
    display: v => v
  };
}

function genAddQ1(){
  const a = rand(1,10), b = rand(1,10);
  const good = a+b;
  return {
    prompt: `Combien font <span class="big-num">${a} + ${b} = ?</span>`,
    answer: good,
    choices: makeNumChoices(good, 2, 20),
    display: v => v
  };
}

function genAddQ2(){
  const a = rand(10,49), b = rand(10,49);
  const good = a+b;
  return {
    prompt: `Combien font <span class="big-num">${a} + ${b} = ?</span>`,
    answer: good,
    choices: makeNumChoices(good, 20, 100),
    display: v => v
  };
}

function genSubQ1(){
  const b = rand(1,10), a = rand(b,20);
  const good = a-b;
  return {
    prompt: `Combien font <span class="big-num">${a} − ${b} = ?</span>`,
    answer: good,
    choices: makeNumChoices(good, 0, 20),
    display: v => v
  };
}

function genSubQ2(){
  const b = rand(10,49), a = rand(b,99);
  const good = a-b;
  return {
    prompt: `Combien font <span class="big-num">${a} − ${b} = ?</span>`,
    answer: good,
    choices: makeNumChoices(good, 0, 99),
    display: v => v
  };
}

function genMulQ(){
  const a = rand(2,10), b = rand(2,10);
  const good = a*b;
  return {
    prompt: `Combien font <span class="big-num">${a} × ${b} = ?</span>`,
    answer: good,
    choices: makeNumChoices(good, 4, 100),
    display: v => v
  };
}

function genExpertQ(){
  const generators = [genAddQ1, genAddQ2, genSubQ1, genSubQ2, genMulQ, genMediumQ];
  return generators[rand(0, generators.length-1)]();
}

function makeWordChoices(correct){
  const ch = [correct];
  while(ch.length < 4){ const w=WORDS[rand(1,100)]; if(!ch.includes(w)) ch.push(w); }
  return shuffle(ch);
}

function makeNumChoices(correct, min, max){
  const ch = [correct];
  let attempts = 0;
  while(ch.length < 4 && attempts < 100){
    const r = clamp(correct + rand(-15,15), min, max);
    if(!ch.includes(r) && r!==correct) ch.push(r);
    attempts++;
  }
  while(ch.length < 4){ const r=rand(min,max); if(!ch.includes(r)) ch.push(r); }
  return shuffle(ch);
}

function buildDiffSelector(){
  const sel = document.getElementById('diffSelector');
  sel.innerHTML = '';

  const levels = [
    DIFFICULTIES[0],
    {
      id: 'compter',
      label: 'Compter',
      icon: '🍎',
      description: 'Compte les objets visibles',
      ptsOk: 7,
      color: 'var(--d1)'
    },
    DIFFICULTIES[1],
    {
      id: 'ordre',
      label: 'Ordonner',
      icon: '📶',
      description: 'Range les nombres dans l’ordre',
      ptsOk: 12,
      color: 'var(--d2)'
    },
    ...DIFFICULTIES.slice(2)
  ];

  levels.forEach(d => {
    const btn = document.createElement('button');
    const isActive = d.id === currentDiff.id || (d.id === 'compter' && currentDiff && currentDiff.id === 'compter') || (d.id === 'ordre' && currentDiff && currentDiff.id === 'ordre');
    btn.className = 'diff-btn' + (isActive ? ' active' : '');
    btn.dataset.d = d.id;
    btn.innerHTML = `<span class="d-icon">${d.icon}</span><span class="d-label">${d.label}</span><span class="d-pts">+${d.ptsOk} 🪙</span>`;
    btn.title = d.description;
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      if(d.id === 'compter'){
        currentDiff = { id: 'compter', label: 'Compter', ptsOk: 7 };
        showQuizSubtab('compter');
        return;
      }

      if(d.id === 'ordre'){
        currentDiff = { id: 'ordre', label: 'Ordonner', ptsOk: 12 };
        showQuizSubtab('ordre');
        return;
      }

      currentDiff = d;
      showQuizSubtab('quiz');
    });
    sel.appendChild(btn);
  });
}

function showQuizSubtab(name){
  document.querySelectorAll('.quiz-subpanel').forEach(panel => panel.classList.remove('active'));
  const target = document.getElementById('quiz-sub-' + name);
  if(target) target.classList.add('active');

  if(name === 'compter') newCountRound();
  if(name === 'ordre') newOrderRound();
  if(name === 'quiz') { nextQuestion(); }
}

function nextQuestion(){
  answered=false; pickedBtn=null; pickedVal=null;
  document.getElementById('validateBtn').classList.remove('ready');
  document.getElementById('nextBtn').classList.remove('show');
  document.getElementById('quizFeedback').textContent='';
  document.getElementById('quizFeedback').className='quiz-feedback';
  document.getElementById('streakBanner').classList.remove('show');

  const q = currentDiff.generate();
  currentAnswer = q.answer;
  document.getElementById('quizPrompt').innerHTML = q.prompt;
  renderChoices(q.choices, q.answer, q.display);
}

function renderChoices(choices, correct, display){
  const box = document.getElementById('quizChoices'); box.innerHTML='';
  choices.forEach(v => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `${display(v)}<span class="sp-icon">🔊</span>`;
    btn.addEventListener('click',()=>selectChoice(btn,v));
    box.appendChild(btn);
  });
}

function selectChoice(btn, val){
  if(answered) return;
  const txt = typeof val==='number' ? val+' : '+WORDS[Math.min(val,100)] : val;
  speak(txt);
  document.querySelectorAll('.choice-btn').forEach(b=>b.classList.remove('picked'));
  btn.classList.add('picked');
  pickedBtn=btn; pickedVal=val;
  document.getElementById('validateBtn').classList.add('ready');
}

function validateAnswer(){
  if(!pickedBtn || answered) return;
  answered = true;
  document.querySelectorAll('.choice-btn').forEach(b=>b.disabled=true);
  const ok = pickedVal == currentAnswer;
  pickedBtn.classList.remove('picked');
  pickedBtn.classList.add(ok?'correct':'wrong');

  const fb = document.getElementById('quizFeedback');
  const rect = pickedBtn.getBoundingClientRect();

  if(ok){
    streak++;
    let earned = currentDiff.ptsOk;
    let bonusMsg = '';

    if(streak % currentDiff.streakEvery === 0){
      earned += currentDiff.streakBonus;
      bonusMsg = ` + ${currentDiff.streakBonus} 🔥 bonus série !`;
      const sb = document.getElementById('streakBanner');
      sb.textContent = `🔥 ${streak} bonnes réponses ! +${currentDiff.streakBonus} 🪙 bonus !`;
      sb.classList.add('show');
    }

    earnPoints(earned, rect.left + rect.width/2, rect.top);
    fb.textContent = '🎉 Bravo ! +'+earned+' 🪙'+bonusMsg;
    fb.className = 'quiz-feedback ok';
    speak('Bravo ! Correct !');
    if(streak % 5 === 0) confetti();

  } else {
    document.querySelectorAll('.choice-btn').forEach(b=>{
      const t = b.textContent.trim();
      if(t==currentAnswer || +t===currentAnswer) b.classList.add('correct');
    });
    streak = 0;
    const lost = currentDiff.ptsBad;
    if(lost > 0) losePoints(lost);
    fb.textContent = '😅 Pas tout à fait...' + (lost>0?' −'+lost+' 🪙':'');
    fb.className = 'quiz-feedback bad';
    speak('Non, la bonne réponse était : '+currentAnswer);
    updateHUD();
  }

  document.getElementById('validateBtn').classList.remove('ready');
  document.getElementById('nextBtn').classList.add('show');
}

function newCountRound(){
  countAnswer=rand(1,20);
  const obj=OBJECTS[rand(0,OBJECTS.length-1)];
  const box=document.getElementById('countObjects'); box.innerHTML='';
  for(let i=0;i<countAnswer;i++){ const sp=document.createElement('span'); sp.className='obj-icon'; sp.textContent=obj; box.appendChild(sp); }
  document.getElementById('countInput').value='';
  const fb=document.getElementById('countFeedback'); fb.textContent=''; fb.style.color='';
}

function checkCount(){
  const val=+document.getElementById('countInput').value;
  const fb=document.getElementById('countFeedback');
  if(!val){ fb.textContent='Entre un nombre !'; return; }
  if(val===countAnswer){ fb.textContent=`🎉 Oui ! ${countAnswer} objet${countAnswer>1?'s':''} !`; fb.style.color='var(--accent)'; earnPoints(7); confetti(); speak('Bravo ! Il y avait '+countAnswer+' objets.'); }
  else { fb.textContent=`😅 Non, c'était ${countAnswer}.`; fb.style.color='var(--primary)'; speak('Non, il y avait '+countAnswer+' objets.'); }
}

function newOrderRound(){
  const count=4; const start=rand(1,95);
  const sorted=[]; for(let i=0;i<count;i++) sorted.push(start+i);
  orderNumbers=shuffle(sorted); orderPlaced=Array(count).fill(null);
  renderOrder(sorted,count); document.getElementById('orderFeedback').textContent='';
}

function renderOrder(sorted,count){
  const nd=document.getElementById('orderNums'), sd=document.getElementById('orderSlots');
  nd.innerHTML=''; sd.innerHTML='';
  orderNumbers.forEach((n,i)=>{
    const t=document.createElement('div'); t.className='order-tile'; t.style.background=OCOLS[i%OCOLS.length]; t.textContent=n; t.draggable=true; t.dataset.val=n;
    t.addEventListener('dragstart',e=>{ e.dataTransfer.setData('text',n); t.classList.add('dragging'); speak(n+''); });
    t.addEventListener('dragend',()=>t.classList.remove('dragging'));
    addTouchDrag(t); nd.appendChild(t);
  });
  for(let i=0;i<count;i++){
    const s=document.createElement('div'); s.className='order-slot'; s.textContent=i===0?'1er':`${i+1}e`; s.dataset.idx=i;
    s.addEventListener('dragover',e=>{ e.preventDefault(); s.classList.add('over'); });
    s.addEventListener('dragleave',()=>s.classList.remove('over'));
    s.addEventListener('drop',e=>{ e.preventDefault(); const v=+e.dataTransfer.getData('text'); s.classList.remove('over'); dropSlot(s,v,i); });
    sd.appendChild(s);
  }
}

function dropSlot(slot,val,idx){
  orderPlaced[idx]=val; slot.textContent=val; slot.classList.add('filled'); document.querySelectorAll('.order-tile').forEach(t=>{ if(+t.dataset.val===val) t.style.visibility='hidden'; });
}

function addTouchDrag(tile){
  tile.addEventListener('touchstart',e=>{ tvDrag=+tile.dataset.val; tile.style.opacity='.5'; speak(tvDrag+''); },{passive:true});
  tile.addEventListener('touchend',e=>{ const t=e.changedTouches[0]; const el=document.elementFromPoint(t.clientX,t.clientY); if(el&&el.classList.contains('order-slot')&&!el.classList.contains('filled')) dropSlot(el,tvDrag,+el.dataset.idx); tile.style.opacity='1'; tvDrag=null; },{passive:true});
}

function checkOrder(){
  const sorted=[...orderNumbers].sort((a,b)=>a-b);
  const fb=document.getElementById('orderFeedback');
  if(!orderPlaced.every(v=>v!==null)){ fb.textContent='⚠️ Place tous les nombres !'; fb.style.color='var(--secondary)'; return; }
  const ok=orderPlaced.every((v,i)=>v===sorted[i]);
  if(ok){ fb.textContent='🎉 Parfait !'; fb.style.color='var(--accent)'; earnPoints(12); confetti(); speak('Parfait ! Bravo !'); setTimeout(newOrderRound,2000); }
  else  { fb.textContent='😅 Ordre correct : '+sorted.join(' → '); fb.style.color='var(--primary)'; speak('L\'ordre correct était : '+sorted.join(', ')); setTimeout(newOrderRound,2600); }
}