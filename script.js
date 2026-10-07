

const ARTICLES = [
  {
    id: "memo",
    icon: "🃏",
    title: "Jeu de Mémoire",
    desc: "Retrouve les paires de nombres cachées. Entraîne ta mémoire !",
    costPts: 0,
    unlockPts: 0,
    btnLabel: "Jouer !",
    btnColor: "linear-gradient(135deg,var(--purple),var(--blue))",
    type: "memo"
  },
  {
    id: "snake",
    icon: "🐍",
    title: "Snake",
    desc: "Un mini-jeu simple à débloquer : mange les fruits, évite les murs et gagne des points.",
    costPts: 100,
    unlockPts: 0,
    btnLabel: "100 points",
    btnColor: "linear-gradient(135deg,#10b981,#22c55e)",
    type: "page",
    pageUrl: "snake.html"
  }
];



const FALLBACK_VIDEO_DATA = {
  series: [
    {
      id: 'serie-fallback',
      title: 'Découverte rapide',
      description: 'Séries de démonstration pour garder l’espace détente visible.',
      episodes: [
        {
          id: 'ep-fallback-1',
          title: 'Épisode 1',
          cost: 10,
          embedUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE'
        }
      ]
    }
  ]
};

const DIZ_BG=['#fff0f0','#fff7e0','#f0fff3','#edf6ff','#f6f0ff','#fff0fa','#f0ffff','#fff4e8','#f4fff0'];
const DIZ_BORDER=['#ffb3b3','#ffd97d','#9de0ab','#90c8ff','#cca5ff','#ffb3e6','#80dde8','#ffc085','#a8e880'];
const DIZ_CLR=['#e05555','#c8860a','#2e8b57','#1a6fbf','#7b2fd4','#c4178e','#1a8c9b','#bf5e0f','#3b8012'];
const DIZ_NAMES=['dix','vingt','trente','quarante','cinquante','soixante','soixante-dix','quatre-vingts','quatre-vingt-dix'];
const UNIT_BG=['#e8e8e8','#ffb3b3','#ffd97d','#9de0ab','#90c8ff','#cca5ff','#ffb3e6','#80dde8','#ffc085','#a8e880'];


let unlockedArticles = {};
let videoSeries = [];
let watchedEpisodes = {};
let udNum = 34;
let multA = 3;
let multB = 4;
let memoFlipped = [], memoMatched = 0, memoLock = false, memoMoves = 0;


function checkUnlocks(){
  let newUnlock = false;
  ARTICLES.forEach(art => {
    if(!unlockedArticles[art.id] && art.costPts === 0 && totalPts >= art.unlockPts){
      unlockedArticles[art.id] = true;
      newUnlock = true;
    }
  });
  if(newUnlock) {
    saveProgress();
    refreshArticles();
  }
  const hasLocked = ARTICLES.some(a => !unlockedArticles[a.id] && totalPts >= a.unlockPts);
  document.getElementById('detNotif').classList.toggle('show', hasLocked);
}

function showUnlockConfirm(art){
  const existing = document.getElementById('unlock-confirm-modal');
  if(existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'unlock-confirm-modal';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(18, 24, 38, 0.7)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  const panel = document.createElement('div');
  panel.style.width = 'min(92vw,500px)';
  panel.style.background = 'linear-gradient(135deg,#fff,#f4f7ff)';
  panel.style.borderRadius = '20px';
  panel.style.padding = '24px 22px';
  panel.style.boxShadow = '0 18px 50px rgba(0,0,0,.18)';
  panel.style.textAlign = 'center';

  const icon = document.createElement('div');
  icon.textContent = '💰';
  icon.style.fontSize = '2rem';
  icon.style.marginBottom = '10px';

  const title = document.createElement('div');
  title.textContent = art.title;
  title.style.fontFamily = "'Fredoka One',cursive";
  title.style.fontSize = '1.35rem';
  title.style.color = 'var(--purple)';
  title.style.marginBottom = '12px';

  const msg = document.createElement('div');
  msg.textContent = `Es-tu sûr de vouloir investir ${art.costPts} points pour débloquer ${art.title} ?`;
  msg.style.color = '#4d4d4d';
  msg.style.fontSize = '1rem';
  msg.style.lineHeight = '1.5';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.justifyContent = 'center';
  actions.style.gap = '12px';
  actions.style.marginTop = '18px';
  actions.style.flexWrap = 'wrap';

  const confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  confirmBtn.textContent = 'Oui';
  confirmBtn.style.background = '#22c55e';
  confirmBtn.style.color = '#fff';
  confirmBtn.style.border = 'none';
  confirmBtn.style.borderRadius = '999px';
  confirmBtn.style.padding = '12px 18px';
  confirmBtn.style.fontWeight = '900';
  confirmBtn.style.cursor = 'pointer';
  confirmBtn.style.boxShadow = '0 8px 20px rgba(34,197,94,.26)';
  confirmBtn.addEventListener('click', () => {
    if(!spendPoints(art.costPts)){
      showToast(`🪙 Tu n'as pas assez de points pour ${art.title}.`);
      modal.remove();
      return;
    }
    unlockedArticles[art.id] = true;
    saveProgress();
    modal.remove();
    showToast(`🎉 "${art.title}" débloqué !`);
    confetti();
    refreshArticles();

    if (art.pageUrl) {
      setTimeout(() => {
        window.open(art.pageUrl, '_blank', 'noopener,noreferrer');
      }, 250);
    }
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Non';
  cancelBtn.style.background = '#edf1ff';
  cancelBtn.style.color = '#495a7e';
  cancelBtn.style.border = 'none';
  cancelBtn.style.borderRadius = '999px';
  cancelBtn.style.padding = '12px 18px';
  cancelBtn.style.fontWeight = '800';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.addEventListener('click', () => modal.remove());

  actions.appendChild(confirmBtn);
  actions.appendChild(cancelBtn);
  panel.appendChild(icon);
  panel.appendChild(title);
  panel.appendChild(msg);
  panel.appendChild(actions);
  modal.appendChild(panel);
  document.body.appendChild(modal);
}

function tryUnlock(artId){
  const art = ARTICLES.find(a=>a.id===artId);
  if(!art) return;
  if(unlockedArticles[artId]){ openArticle(art); return; }

  if(art.costPts > 0){
    showUnlockConfirm(art);
    return;
  }

  if(totalPts < art.unlockPts){
    showToast(`⭐ Il te faut ${art.unlockPts} points cumulés pour débloquer !`); return;
  }

  unlockedArticles[artId] = true;
  saveProgress();
  showToast(`🎉 "${art.title}" débloqué !`);
  confetti();
  refreshArticles();
  openArticle(art);
}

function openArticle(art){
  if(art.pageUrl)            { window.open(art.pageUrl, '_blank', 'noopener,noreferrer'); return; }
  if(art.type === 'memo')    { startMemo(art.id); return; }
  if(art.type === 'snake')   { startSnakeGame(art.id); return; }
  if(art.type === 'external'){ window.open(art.playUrl,'_blank'); return; }
  if(art.type === 'info')    { showToast(art.playContent || 'Contenu à venir !'); return; }
}

function buildArticles(){
  const grid = document.getElementById('articlesGrid');
  grid.innerHTML = '';
  ARTICLES.forEach(art => {
    const card = document.createElement('div');
    const locked = !unlockedArticles[art.id];
    card.className = 'article-card ' + (locked ? 'locked' : 'unlocked');
    card.id = 'art-card-'+art.id;

    const needTotal = art.unlockPts > 0;
    const lockMsg = art.costPts > 0
      ? `Coût : ${art.costPts} 🪙`+(needTotal ? `\nRequis : ${art.unlockPts} pts cumulés` : '')
      : needTotal ? `Requiert ${art.unlockPts} points cumulés` : '';

    card.innerHTML = `
      <div class="lock-overlay">
        <div class="lock-icon">🔒</div>
        <div class="lock-cost">${lockMsg}</div>
      </div>
      <div class="art-header">
        <span class="art-icon">${art.icon}</span>
        <span class="art-title">${art.title}</span>
        ${locked ? '' : '<span class="art-status-check" aria-label="Débloqué">✓</span>'}
      </div>
      <div class="art-desc">${art.desc}</div>
      <button class="art-play ${locked ? '' : 'ready'}" style="background:${art.btnColor};color:#fff;font-weight:800;"
        onclick="tryUnlock('${art.id}')">
        ${locked ? art.btnLabel : '▶ Jouer'}
      </button>
      <div id="art-content-${art.id}"></div>`;
    grid.appendChild(card);
  });
}

function getEpisodeCacheKey(seriesId, episodeId){
  return `${String(seriesId || '')}::${String(episodeId || '')}`;
}

function isEpisodeWatched(seriesId, episodeId){
  const key = getEpisodeCacheKey(seriesId, episodeId);
  if (watchedEpisodes[key]) return true;

  if (seriesId && !episodeId && watchedEpisodes[seriesId]) return true;
  if (!seriesId && watchedEpisodes[episodeId]) return true;

  return false;
}

function createVideoPrompt(series, episode){
  const text = `Veux-tu dépenser ${episode.cost} points pour regarder ${episode.title} ?`;
  speak(text);

  const existing = document.getElementById('video-confirm-modal');
  if(existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'video-confirm-modal';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(18, 24, 38, 0.7)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '9999';

  const panel = document.createElement('div');
  panel.style.width = 'min(92vw,520px)';
  panel.style.background = 'linear-gradient(135deg,#fff,#f4f7ff)';
  panel.style.borderRadius = '22px';
  panel.style.padding = '26px 22px';
  panel.style.boxShadow = '0 18px 50px rgba(0,0,0,.18)';
  panel.style.textAlign = 'center';

  const icon = document.createElement('div');
  icon.textContent = '🎧';
  icon.style.fontSize = '2rem';
  icon.style.marginBottom = '10px';

  const title = document.createElement('div');
  title.textContent = series.title;
  title.style.fontFamily = "'Fredoka One',cursive";
  title.style.fontSize = '1.35rem';
  title.style.color = 'var(--purple)';
  title.style.marginBottom = '10px';

  const msg = document.createElement('div');
  msg.textContent = text;
  msg.style.fontSize = '1rem';
  msg.style.color = '#4d4d4d';
  msg.style.lineHeight = '1.5';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.justifyContent = 'center';
  actions.style.gap = '12px';
  actions.style.marginTop = '20px';
  actions.style.flexWrap = 'wrap';

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Oui, regarder';
  confirmBtn.type = 'button';
  confirmBtn.style.background = '#22c55e';
  confirmBtn.style.color = '#ffffff';
  confirmBtn.style.border = 'none';
  confirmBtn.style.borderRadius = '999px';
  confirmBtn.style.padding = '12px 18px';
  confirmBtn.style.fontWeight = '900';
  confirmBtn.style.cursor = 'pointer';
  confirmBtn.style.boxShadow = '0 8px 20px rgba(34,197,94,.26)';
  confirmBtn.addEventListener('click', () => confirmEpisodeWatch(series.id, episode.id));

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Non';
  cancelBtn.type = 'button';
  cancelBtn.style.background = '#edf1ff';
  cancelBtn.style.color = '#495a7e';
  cancelBtn.style.border = 'none';
  cancelBtn.style.borderRadius = '999px';
  cancelBtn.style.padding = '12px 18px';
  cancelBtn.style.fontWeight = '800';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.addEventListener('click', closeVideoPrompt);

  actions.appendChild(confirmBtn);
  actions.appendChild(cancelBtn);
  panel.appendChild(icon);
  panel.appendChild(title);
  panel.appendChild(msg);
  panel.appendChild(actions);
  modal.appendChild(panel);
  document.body.appendChild(modal);
}

function closeVideoPrompt(){
  const existing = document.getElementById('video-confirm-modal');
  if(existing) existing.remove();
}

function confirmEpisodeWatch(seriesId, episodeId){
  const series = videoSeries.find(s => s.id === seriesId);
  const episode = series && series.episodes.find(e => e.id === episodeId);
  if(!series || !episode){ closeVideoPrompt(); return; }

  const watchedKey = getEpisodeCacheKey(series.id, episode.id);
  if(isEpisodeWatched(series.id, episode.id)){
    closeVideoPrompt();
    openEpisodeVideo(series, episode);
    return;
  }

  if(pts < episode.cost){
    showToast(`💰 Il te faut ${episode.cost} points pour regarder cet épisode.`);
    closeVideoPrompt();
    return;
  }

  pts -= episode.cost;
  watchedEpisodes[watchedKey] = true;
  saveProgress();
  updateHUD();
  closeVideoPrompt();
  openEpisodeVideo(series, episode);
  showToast(`✅ Épisode débloqué : ${episode.title}`);
  speak(`Tu as débloqué ${episode.title}.`);
  renderVideoLibrary();
}

function openEpisodeVideo(series, episode){
  const modal = document.getElementById('video-player-modal');
  if(modal) modal.remove();

  const player = document.createElement('div');
  player.id = 'video-player-modal';
  player.style.position = 'fixed';
  player.style.inset = '0';
  player.style.background = 'rgba(9, 11, 18, 0.76)';
  player.style.display = 'flex';
  player.style.alignItems = 'center';
  player.style.justifyContent = 'center';
  player.style.zIndex = '10000';
  player.style.padding = '20px';

  const shell = document.createElement('div');
  shell.style.width = 'min(96vw,960px)';
  shell.style.background = '#fff';
  shell.style.borderRadius = '20px';
  shell.style.padding = '16px';
  shell.style.boxShadow = '0 20px 50px rgba(0,0,0,.22)';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.gap = '12px';
  header.style.marginBottom = '12px';

  const label = document.createElement('div');
  label.textContent = `${series.title} — ${episode.title}`;
  label.style.fontFamily = "'Fredoka One',cursive";
  label.style.fontSize = '1.2rem';
  label.style.color = 'var(--purple)';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = '✕';
  closeBtn.style.background = '#eef2ff';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.width = '38px';
  closeBtn.style.height = '38px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '1.2rem';
  closeBtn.addEventListener('click', () => player.remove());

  const iframe = document.createElement('iframe');
  iframe.src = episode.embedUrl;
  iframe.title = episode.title;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.style.width = '100%';
  iframe.style.height = '54vh';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '14px';
  iframe.style.background = '#000';

  header.appendChild(label);
  header.appendChild(closeBtn);
  shell.appendChild(header);
  shell.appendChild(iframe);
  player.appendChild(shell);
  document.body.appendChild(player);
}

function renderVideoLibrary(){
  const grid = document.getElementById('articlesGrid');
  if(!grid) return;

  const existing = grid.querySelector('.video-series-block');
  if(existing) existing.remove();

  const section = document.createElement('div');
  section.className = 'video-series-block';
  section.style.cssText = 'width:100%;margin-top:18px;display:flex;flex-direction:column;gap:16px;';

  const heading = document.createElement('div');
  heading.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:0;flex-wrap:wrap;';
  heading.innerHTML = '<div style="font-family:\'Fredoka One\',cursive;font-size:1.2rem;color:var(--purple);">📺 Séries & épisodes</div>';
  section.appendChild(heading);

  if(!videoSeries.length){
    const empty = document.createElement('div');
    empty.style.cssText = 'background:#f3f6ff;border-radius:16px;padding:16px;color:#666;';
    empty.textContent = 'Aucune série disponible pour le moment. Ajoute-les dans detente-videos.json.';
    section.appendChild(empty);
    grid.appendChild(section);
    return;
  }

  const seriesWrap = document.createElement('div');
  seriesWrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:16px;align-items:stretch;';

  videoSeries.forEach(series => {
    const seriesCard = document.createElement('div');
    seriesCard.style.cssText = 'flex:1 1 260px;max-width:100%;background:linear-gradient(135deg,#fff,#f5f7ff);border:2px solid rgba(122,102,255,.12);border-radius:18px;padding:18px;';

    const title = document.createElement('div');
    title.style.cssText = 'font-family:\'Fredoka One\',cursive;font-size:1.08rem;color:#3c4b74;margin-bottom:8px;';
    title.textContent = series.title;
    seriesCard.appendChild(title);

    const desc = document.createElement('div');
    desc.style.cssText = 'color:#666;margin-bottom:12px;font-size:.9rem;';
    desc.textContent = series.description || 'Découvrez les épisodes de cette série.';
    seriesCard.appendChild(desc);

    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:10px;';

    series.episodes.forEach(episode => {
      const episodeBtn = document.createElement('button');
      const watched = isEpisodeWatched(series.id, episode.id);
      episodeBtn.style.cssText = `border:none;border-radius:12px;padding:12px 14px;text-align:left;cursor:pointer;background:${watched ? 'linear-gradient(135deg,#dff8ec,#ecfff4)' : 'linear-gradient(135deg,#eef3ff,#f4f7ff)'};color:${watched ? '#1f7c4a' : '#3a456e'};font-weight:700;display:flex;align-items:center;justify-content:space-between;gap:12px;`;
      episodeBtn.innerHTML = `<span>${watched ? '✅' : '▶'} ${episode.title}</span><span>${watched ? 'Débloqué' : `${episode.cost} pts`}</span>`;
      episodeBtn.addEventListener('click', () => {
        if(watched){
          openEpisodeVideo(series, episode);
          return;
        }
        createVideoPrompt(series, episode);
      });
      list.appendChild(episodeBtn);
    });

    seriesCard.appendChild(list);
    seriesWrap.appendChild(seriesCard);
  });

  section.appendChild(seriesWrap);
  grid.appendChild(section);
}

function loadVideoSeries(){
  loadWatchedEpisodes();

  window.__DETENTE_VIDEO_DATA__ = window.__DETENTE_VIDEO_DATA__ || FALLBACK_VIDEO_DATA;
  const data = window.__DETENTE_VIDEO_DATA__;

  if(data && Array.isArray(data.series) && data.series.length) {
    videoSeries = data.series
      .filter(s => s && typeof s === 'object' && Array.isArray(s.episodes))
      .map(series => ({
        ...series,
        episodes: (series.episodes || []).filter(ep => ep && typeof ep === 'object')
      }));
    renderVideoLibrary();
    return;
  }

  videoSeries = FALLBACK_VIDEO_DATA.series;
  renderVideoLibrary();
}

function refreshArticles(){
  ARTICLES.forEach(art => {
    const card = document.getElementById('art-card-'+art.id);
    if(!card) return;
    const locked = !unlockedArticles[art.id];
    card.className = 'article-card ' + (locked ? 'locked' : 'unlocked');

    const btn = card.querySelector('.art-play');
    if(btn) {
      btn.textContent = locked ? art.btnLabel : '▶ Jouer';
      btn.classList.toggle('ready', !locked);
    }

    const check = card.querySelector('.art-status-check');
    if(!locked && !check){
      const badge = document.createElement('span');
      badge.className = 'art-status-check';
      badge.textContent = '✓';
      const header = card.querySelector('.art-header');
      if(header) header.appendChild(badge);
    }
    if(check && locked) check.remove();
  });
}

function startMemo(artId){
  const container = document.getElementById('art-content-'+artId);
  const nums = shuffle([...Array(20).keys()].map(i=>i+1)).slice(0,8);
  const cards = shuffle([...nums,...nums]);
  memoMatched = 0; memoMoves = 0; memoFlipped = [];

  container.innerHTML = `
    <div class="memo-wrapper">
      <div class="memo-grid" id="memoGrid-${artId}"></div>
      <div class="memo-status" id="memoStatus-${artId}">Trouve les paires ! 🃏</div>
      <button class="memo-restart" onclick="startMemo('${artId}')">🔄 Recommencer</button>
    </div>`;

  const grid = document.getElementById('memoGrid-'+artId);
  cards.forEach((num,i) => {
    const card = document.createElement('div');
    card.className = 'memo-card';
    card.dataset.val = num;
    card.dataset.idx = i;
    card.innerHTML = `<div class="memo-inner"><div class="memo-face">?</div><div class="memo-back">${num}</div></div>`;
    card.addEventListener('click',()=>flipMemo(card, artId, cards.length));
    grid.appendChild(card);
  });
}

function flipMemo(card, artId, total){
  if(memoLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  memoFlipped.push(card);
  if(memoFlipped.length === 2){
    memoLock = true; memoMoves++;
    const [a,b] = memoFlipped;
    if(a.dataset.val === b.dataset.val){
      a.classList.add('matched'); b.classList.add('matched');
      memoMatched += 2; memoFlipped = []; memoLock = false;
      const status = document.getElementById('memoStatus-'+artId);
      if(memoMatched === total){
        status.textContent = `🎉 Bravo ! Terminé en ${memoMoves} coups !`;
        earnPoints(20);
        confetti();
        speak('Bravo ! Tu as trouvé toutes les paires !');
      } else {
        status.textContent = `✅ Paire trouvée ! ${memoMatched/2}/${total/2}`;
      }
    } else {
      setTimeout(()=>{
        a.classList.remove('flipped'); b.classList.remove('flipped');
        memoFlipped = []; memoLock = false;
      }, 900);
    }
  }
}

function changeMultValue(which, delta){
  if(which === 'a') multA = clamp(multA + delta, 1, 10);
  if(which === 'b') multB = clamp(multB + delta, 1, 10);
  renderMultiplication();
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
    c.addEventListener('click',()=>{ selectCell(c); speak(n+' : '+WORDS[n]); });
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

function switchUdTab(id,btn){
  document.querySelectorAll('.ud-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ud-tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('ud-'+id).classList.add('active'); btn.classList.add('active');
  if(id==='decomp') renderDecomp();
  if(id==='dizaines') renderDizaines();
  if(id==='unites') renderUnites();
}

function changeUd(d){
  udNum=clamp(udNum+d,1,99); document.getElementById('udDisplay').textContent=udNum; renderDecomp(); speak(udNum+' : '+WORDS[udNum]);
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
buildArticles();
loadVideoSeries();
checkUnlocks();
