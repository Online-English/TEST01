// ==========================================================================
// VARIABLES D'ÉTAT GLOBALES
// ==========================================================================
let verbs = []; // Chargé dynamiquement depuis verbs.json
let currentScore = parseInt(localStorage.getItem('verbScore')) || 0;
let currentStreak = 0;
let currentVerb = null;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;

let playerXp = parseInt(localStorage.getItem('playerXp')) || 0;
let playerLevel = parseInt(localStorage.getItem('playerLevel')) || 1;
let currentDifficulty = parseInt(localStorage.getItem('currentDifficulty')) || 20;

let speechRate = 1.0;
let isAutoplayFlashcard = false;
let slideshowInterval = null;
let isTimeAttack = false;
let timeAttackTimer = null;
let timeAttackSecondsLeft = 30;
let timeAttackScore = 0;
let quizTimeout = null;

let activeVisualTheme = localStorage.getItem('visualTheme') || 'classic';
const difficultyLevels = [20, 40, 60, 80, 100, 120, 150, 200];

// Variables pour les fonctionnalités avancées
let currentCombo = 0;
let isReviewMode = false;
let isErrorReviewMode = false;
let recentErrors = JSON.parse(localStorage.getItem('recentErrors')) || [];
let dailyQuests = JSON.parse(localStorage.getItem('dailyQuests')) || [];
let questDate = localStorage.getItem('questDate') || "";
let dailyStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;
let lastActiveDate = localStorage.getItem('lastActiveDate') || "";
let xpHistory = JSON.parse(localStorage.getItem('xpHistory')) || {};

// ==========================================================================
// CHARGEMENT DES DONNÉES & MOTEUR PROGRESSION
// ==========================================================================
async function loadVerbsFromJSON() {
  try {
    const response = await fetch('verbs.json');
    verbs = await response.json();
    
    // Synchroniser avec les niveaux de maîtrise sauvegardés
    const savedVerbs = localStorage.getItem('verbsData');
    if (savedVerbs) {
      const parsed = JSON.parse(savedVerbs);
      parsed.forEach(sv => {
        const v = verbs.find(v => v.base === sv.base);
        if (v) v.mastery = sv.mastery;
      });
    }
  } catch (e) {
    console.error("Erreur critique lors du chargement de verbs.json :", e);
  }
}

// 2000 XP requis par palier de niveau pour ralentir la progression
function getXpNeededForNextLevel(level) {
  return level * 2000; 
}

// Algorithme de filtrage des pools de verbes
function getFilteredVerbs() {
  if (isErrorReviewMode) {
    return verbs.filter(v => recentErrors.includes(v.base));
  }
  if (isReviewMode) {
    return verbs.slice(0, currentDifficulty).filter(v => (v.mastery || 0) < 3);
  }
  return verbs.slice(0, currentDifficulty);
}

// Système de Répétition Espacée (SRS) : 65% de chances de cibler les verbes faibles
function pickSRSVerb(pool) {
  if (!pool.length) return null;
  if (Math.random() < 0.65) {
    const sorted = [...pool].sort((a, b) => (a.mastery || 0) - (b.mastery || 0));
    const worstHalf = sorted.slice(0, Math.max(1, Math.floor(sorted.length / 2)));
    return worstHalf[Math.floor(Math.random() * worstHalf.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// Système Duolingo de Série Quotidienne (Daily Streak)
function checkDailyStreak() {
  const today = new Date().toISOString().split('T')[0];
  if (lastActiveDate) {
    const lastDate = new Date(lastActiveDate);
    const currentDate = new Date(today);
    const diffDays = Math.ceil(Math.abs(currentDate - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) dailyStreak = 0; // Jauge brisée si un jour est sauté
  }
  document.getElementById('streak').textContent = dailyStreak;
}

function updateDailyStreakOnWin() {
  const today = new Date().toISOString().split('T')[0];
  if (lastActiveDate !== today) {
    if (lastActiveDate) {
      const lastDate = new Date(lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.ceil(Math.abs(currentDate - lastDate) / (1000 * 60 * 60 * 24));
      dailyStreak = (diffDays === 1) ? (dailyStreak + 1) : 1;
    } else {
      dailyStreak = 1;
    }
    lastActiveDate = today;
    localStorage.setItem('dailyStreak', dailyStreak);
    localStorage.setItem('lastActiveDate', lastActiveDate);
    document.getElementById('streak').textContent = dailyStreak;
  }
}

// Initialisation des Défis du Jour (Daily Quests)
function initDailyQuests() {
  const today = new Date().toISOString().split('T')[0];
  if (questDate !== today) {
    dailyQuests = [
      { id: 1, text: "Atteindre un Combo de x5", target: 5, current: 0, done: false },
      { id: 2, text: "Valider 5 verbes en Hard Mode", target: 5, current: 0, done: false },
      { id: 3, text: "Compléter un jeu de Matching", target: 1, current: 0, done: false }
    ];
    questDate = today;
    localStorage.setItem('questDate', questDate);
    localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
  }
}

function progressQuest(id, amount = 1) {
  const quest = dailyQuests.find(q => q.id === id);
  if (quest && !quest.done) {
    quest.current = Math.min(quest.target, quest.current + amount);
    if (quest.current >= quest.target) {
      quest.done = true;
      gainXp(250); // Gros bonus pour l'accomplissement d'un défi
      alert(`🎯 Défi du jour réussi : ${quest.text} ! (+250 XP)`);
    }
    localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
  }
}

function saveData() {
  localStorage.setItem('verbsData', JSON.stringify(verbs));
  localStorage.setItem('verbScore', currentScore);
  localStorage.setItem('playerXp', playerXp);
  localStorage.setItem('playerLevel', playerLevel);
  localStorage.setItem('currentDifficulty', currentDifficulty);
  localStorage.setItem('visualTheme', activeVisualTheme);
  localStorage.setItem('recentErrors', JSON.stringify(recentErrors));
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
    localStorage.setItem('bestStreak', bestStreak);
  }
}

function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); 
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

// Micro-animations de Game Feel (Secousse physique de l'interface)
function triggerGameFeelEffect(isCorrect) {
  const container = document.querySelector('.container');
  if (!container) return;
  const effect = isCorrect ? 'animation-success' : 'animation-error';
  container.classList.add(effect);
  setTimeout(() => container.classList.remove(effect), 400);
}

function gainXp(amount) {
  playerXp += amount;
  
  // Enregistrement temporel pour la Timeline
  const today = new Date().toISOString().split('T')[0];
  xpHistory[today] = (xpHistory[today] || 0) + amount;
  localStorage.setItem('xpHistory', JSON.stringify(xpHistory));

  let xpNeeded = getXpNeededForNextLevel(playerLevel);
  while (playerXp >= xpNeeded) {
    playerXp -= xpNeeded;
    playerLevel++;
    xpNeeded = getXpNeededForNextLevel(playerLevel);
    alert(`🎉 Félicitations ! Vous passez au Niveau Joueur ${playerLevel} !`);
  }
  updateStats();
  updateDifficultySelect();
  updateVisualThemeSelect();
  saveData();
}

function updateDifficultySelect() {
  const select = document.getElementById('difficultySelect');
  if (!select) return;
  difficultyLevels.forEach((numVerbs, index) => {
    const option = select.options[index];
    const requiredPlayerLevel = index + 1; 
    if (playerLevel >= requiredPlayerLevel) {
      option.disabled = false;
      option.textContent = `Level ${index + 1} (${numVerbs} verbes)`;
    } else {
      option.disabled = true;
      option.textContent = `Level ${index + 1} (${numVerbs} verbes) 🔒 (Niv ${requiredPlayerLevel})`;
    }
  });
  select.value = currentDifficulty;
}

function updateVisualThemeSelect() {
  const select = document.getElementById('visualThemeSelect');
  if (!select) return;
  select.options[1].disabled = playerLevel < 3;  
  select.options[2].disabled = playerLevel < 6;  
  select.options[3].disabled = playerLevel < 8;  
  select.value = activeVisualTheme;
}

function changeVisualTheme(themeName) {
  activeVisualTheme = themeName;
  document.documentElement.setAttribute('data-visual-theme', themeName);
  saveData();
}

function changeDifficulty(value) {
  currentDifficulty = parseInt(value);
  saveData();
  const activeSection = document.querySelector('.section.active').id;
  showSection(activeSection);
}

function changeSpeed(value) {
  speechRate = parseFloat(value);
}

function updateMastery(base, correct) {
  if (isErrorReviewMode) return; // Pas de mise à jour de maîtrise sur l'entraînement d'erreurs pures
  const verb = verbs.find(v => v.base === base);
  if (!verb) return;
  verb.mastery = correct ? Math.min(5, (verb.mastery || 0) + 1) : Math.max(0, (verb.mastery || 0) - 1);
  saveData();
}

function updateStats() {
  const xpNeeded = getXpNeededForNextLevel(playerLevel);
  document.getElementById('totalScore').textContent = currentScore;
  document.getElementById('streak').textContent = dailyStreak;
  document.getElementById('playerXp').textContent = playerXp;
  document.getElementById('playerLevel').textContent = playerLevel;
  document.getElementById('xpNeeded').textContent = xpNeeded;

  const pct = Math.min(100, (playerXp / xpNeeded) * 100);
  document.getElementById('xpProgressBar').style.width = `${pct}%`;
}

function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = speechRate;
    speechSynthesis.speak(utterance);
  }
}

// ==========================================================================
// SECTIONS / MODES DE JEU
// ==========================================================================

// --- LISTE ---
function searchVerbs() {
  const term = document.getElementById('search').value.toLowerCase();
  const familyFilter = document.getElementById('familySelect').value;
  const container = document.getElementById('listContent');
  if (!container) return;
  container.innerHTML = '';

  const filtered = verbs.slice(0, currentDifficulty).filter(v => {
    const matchesSearch = v.base.toLowerCase().includes(term) || v.fr.toLowerCase().includes(term);
    const matchesFamily = familyFilter === 'all' || v.family === familyFilter;
    return matchesSearch && matchesFamily;
  });

  filtered.forEach(v => {
    const div = document.createElement('div');
    div.className = 'verb-card';
    const m = v.mastery || 0;
    const starsHtml = `<span class="mastery-stars">${'★'.repeat(m)}${'☆'.repeat(5 - m)}</span>`;

    div.innerHTML = `
      <div>
        <strong>${v.base}</strong> → ${v.past} / ${v.pp}<br>
        <small>${v.fr}</small>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        ${starsHtml}
        <button onclick="event.stopImmediatePropagation(); speakAll('${v.base}', '${v.past}', '${v.pp}')">🔊</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function speakAll(base, past, pp) {
  speak(base);
  setTimeout(() => speak(past), 700 / speechRate);
  setTimeout(() => speak(pp), 1400 / speechRate);
}

// --- FLASHCARDS ---
function toggleAutoplay() {
  isAutoplayFlashcard = !isAutoplayFlashcard;
  const btn = document.getElementById('autoplayToggle');
  btn.textContent = `Lecture Auto : ${isAutoplayFlashcard ? 'ON 🔊' : 'OFF'}`;
  btn.classList.toggle('active', isAutoplayFlashcard);
}

function toggleSlideshow() {
  const btn = document.getElementById('slideshowToggle');
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    btn.textContent = "Mode Diaporama : OFF 🎞️";
    btn.classList.remove('active');
  } else {
    showFlashcard();
    slideshowInterval = setInterval(showFlashcard, 4500);
    btn.textContent = "Mode Diaporama : ON 🎬";
    btn.classList.add('active');
  }
}

function showFlashcard() {
  const activePool = getFilteredVerbs();
  if(!activePool.length) return;
  currentVerb = pickSRSVerb(activePool); 
  
  document.getElementById('flashcard').className = 'card';
  document.getElementById('flashcard').innerHTML = `
    <div class="card-inner" onclick="this.parentElement.classList.toggle('flipped')">
      <div class="front">
        <h2>${currentVerb.base}</h2>
        <p>Cliquez ou Espace pour retourner</p>
      </div>
      <div class="back">
        <h2>${currentVerb.past} / ${currentVerb.pp}</h2>
        <p>${currentVerb.fr}</p>
        <button class="btn-primary" onclick="event.stopImmediatePropagation(); speakAll('${currentVerb.base}', '${currentVerb.past}', '${currentVerb.pp}')">
          🔊 Prononcer
        </button>
      </div>
    </div>
  `;

  if (isAutoplayFlashcard) speakAll(currentVerb.base, currentVerb.past, currentVerb.pp);
}

// --- QUIZ STANDARD ---
function startTimeAttackMode() {
  if (timeAttackTimer) clearInterval(timeAttackTimer);
  if (quizTimeout) clearTimeout(quizTimeout);
  isTimeAttack = true;
  timeAttackSecondsLeft = 30;
  timeAttackScore = 0;
  
  document.getElementById('quizModeContainer').style.display = 'none';
  document.getElementById('nextQuizBtn').style.display = 'none';
  document.getElementById('quizTimerDisplay').style.display = 'block';
  document.getElementById('timerScore').textContent = timeAttackScore;
  document.getElementById('timerCount').textContent = timeAttackSecondsLeft;
  
  startQuiz();
  timeAttackTimer = setInterval(() => {
    timeAttackSecondsLeft--;
    document.getElementById('timerCount').textContent = timeAttackSecondsLeft;
    if (timeAttackSecondsLeft <= 0) {
      clearInterval(timeAttackTimer);
      timeAttackTimer = null;
      isTimeAttack = false;
      if (quizTimeout) clearTimeout(quizTimeout);
      alert(`⏱️ Fin ! Vous avez trouvé ${timeAttackScore} verbes.\nBonus : +${timeAttackScore * 5} XP !`);
      gainXp(timeAttackScore * 5);
      document.getElementById('quizModeContainer').style.display = 'block';
      document.getElementById('nextQuizBtn').style.display = 'block';
      document.getElementById('quizTimerDisplay').style.display = 'none';
      startQuiz();
    }
  }, 1000);
}

function startQuiz() {
  if (quizTimeout) clearTimeout(quizTimeout);
  const activePool = getFilteredVerbs();
  if(!activePool.length) return;
  currentVerb = pickSRSVerb(activePool); 

  const correct = `${currentVerb.past} / ${currentVerb.pp}`;
  let options = [correct];
  while (options.length < 4) {
    const rand = verbs[Math.floor(Math.random() * verbs.length)];
    const wrong = `${rand.past} / ${rand.pp}`;
    if (!options.includes(wrong)) options.push(wrong);
  }
  options.sort(() => Math.random() - 0.5);

  let html = `<h3>${currentVerb.base} (${currentVerb.fr})</h3>`;
  options.forEach(opt => {
    html += `<button class="option" onclick="checkQuiz(this, '${opt}', '${correct}')">${opt}</button>`;
  });
  document.getElementById('quizContent').innerHTML = html;
}

function checkQuiz(btn, selected, correct) {
  document.querySelectorAll('#quizContent .option').forEach(b => b.disabled = true);
  const isCorrect = selected === correct;
  btn.style.background = isCorrect ? '#10b981' : '#ef4444';
  btn.style.color = 'white';
  handleQuizResult(isCorrect, false);
  quizTimeout = setTimeout(startQuiz, 1000);
}

// --- HARD MODE DÉDIÉ (SAISIE TEXTE) ---
function startHardMode() {
  if (quizTimeout) clearTimeout(quizTimeout);
  const activePool = getFilteredVerbs();
  
  if(!activePool.length) {
    document.getElementById('hardModeContent').innerHTML = `
      <div class="status-message" style="color: #10b981; font-weight: bold; padding: 20px;">
        🎉 Le carnet d'entraînement sélectionné est actuellement vide !
      </div>`;
    return;
  }
  
  currentVerb = pickSRSVerb(activePool);

  let html = isErrorReviewMode ? `
    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #e14444; color: #ef4444; padding: 8px; border-radius: 6px; margin-bottom: 15px; font-weight: bold; font-size: 0.9rem;">
      🛠️ Mode Historique : Correction de vos fautes récentes (Zéro XP)
    </div>` : (isReviewMode ? `
    <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; color: #3b82f6; padding: 8px; border-radius: 6px; margin-bottom: 15px; font-weight: bold; font-size: 0.9rem;">
      🎯 Mode Révision : Entraînement ciblé sur vos verbes faibles
    </div>` : '');

  html += `<h3>${currentVerb.base} (${currentVerb.fr})</h3>`;
  html += `
    <div class="hard-mode-container">
      <input type="text" id="inputPast" placeholder="Prétérit (Past)" autocomplete="off" autofocus>
      <input type="text" id="inputPP" placeholder="Participe Passé (Past Participle)" autocomplete="off">
      <button class="btn-primary" style="width:100%; margin-top:10px;" onclick="checkHardModeQuiz()">Valider la saisie</button>
      <div id="correctionBox"></div>
    </div>
  `;
  document.getElementById('hardModeContent').innerHTML = html;
  document.getElementById('inputPast').focus();

  document.getElementById('inputPP').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkHardModeQuiz();
  });
}

function checkHardModeQuiz() {
  const inputPast = document.getElementById('inputPast');
  const inputPP = document.getElementById('inputPP');
  if (!inputPast || !inputPP || inputPast.disabled) return;
  
  const userPast = inputPast.value.trim().toLowerCase();
  const userPP = inputPP.value.trim().toLowerCase();
  
  const validPasts = currentVerb.past.split('/').map(s => s.trim().toLowerCase());
  const validPPs = currentVerb.pp.split('/').map(s => s.trim().toLowerCase());
  
  const isPastCorrect = validPasts.includes(userPast);
  const isPPCorrect = validPPs.includes(userPP);
  const isCorrect = isPastCorrect && isPPCorrect;

  inputPast.disabled = true;
  inputPP.disabled = true;
  inputPast.className = isPastCorrect ? 'input-success' : 'input-error';
  inputPP.className = isPPCorrect ? 'input-success' : 'input-error';

  handleQuizResult(isCorrect, true);

  if(!isCorrect) {
    document.getElementById('correctionBox').innerHTML = `
      <p style="color:#ef4444; font-weight:600; margin-top:10px;">
        Correction : <strong>${currentVerb.past} / ${currentVerb.pp}</strong>
      </p>
    `;
    if (!recentErrors.includes(currentVerb.base)) {
      recentErrors.push(currentVerb.base);
      if (recentErrors.length > 10) recentErrors.shift(); // Conserve les 10 dernières fautes
    }
  }

  if (isCorrect && !isErrorReviewMode) progressQuest(2); 
  quizTimeout = setTimeout(startHardMode, isCorrect ? 1200 : 3000);
}

function handleQuizResult(isCorrect, bonusPoints = false) {
  triggerGameFeelEffect(isCorrect);
  updateMastery(currentVerb.base, isCorrect);
  
  const badge = document.getElementById('comboBadge');

  if (isCorrect) {
    playSuccessSound();
    updateDailyStreakOnWin();
    
    currentCombo++;
    const multiplier = currentCombo >= 5 ? 2 : 1; 
    
    if (multiplier > 1 && badge) {
      badge.style.display = 'inline-block';
      badge.textContent = `Combo x${currentCombo} 🔥`;
    }

    if (!isErrorReviewMode) {
      const baseScore = bonusPoints ? 15 : 10;
      const baseXp = bonusPoints ? 30 : 20;
      currentScore += baseScore * multiplier;
      gainXp(baseXp * multiplier);
    }
    
    currentStreak++;
    progressQuest(1, currentCombo); 
    if (isTimeAttack) {
      timeAttackScore++;
      document.getElementById('timerScore').textContent = timeAttackScore;
    }
  } else {
    currentCombo = 0;
    currentStreak = 0;
    if (badge) badge.style.display = 'none';
  }
  updateStats();
  saveData();
}

// --- MATCHING ---
let selectedBaseItem = null;
let selectedFrItem = null;
let matchingPairsLeft = 0;

function startMatching() {
  selectedBaseItem = null; selectedFrItem = null;
  const activePool = getFilteredVerbs();
  if(!activePool.length) return;
  const shuffledVerbs = [...activePool].sort(() => Math.random() - 0.5);
  const selectedVerbs = shuffledVerbs.slice(0, 5);
  matchingPairsLeft = selectedVerbs.length;

  const bases = selectedVerbs.map(v => ({ text: v.base, id: v.base }));
  const frs = selectedVerbs.map(v => ({ text: v.fr, id: v.base }));
  bases.sort(() => Math.random() - 0.5);
  frs.sort(() => Math.random() - 0.5);

  let html = `<div class="matching-board"><div class="matching-column" id="matchingBases"></div><div class="matching-column" id="matchingFrs"></div></div>`;
  document.getElementById('matchingContent').innerHTML = html;

  const basesCol = document.getElementById('matchingBases');
  const frsCol = document.getElementById('matchingFrs');

  bases.forEach(b => {
    const div = document.createElement('div'); div.className = 'matching-item'; div.textContent = b.text; div.dataset.id = b.id;
    div.onclick = () => selectMatchingItem(div, 'base'); basesCol.appendChild(div);
  });
  frs.forEach(f => {
    const div = document.createElement('div'); div.className = 'matching-item'; div.textContent = f.text; div.dataset.id = f.id;
    div.onclick = () => selectMatchingItem(div, 'fr'); frsCol.appendChild(div);
  });
}

function selectMatchingItem(element, type) {
  if (element.classList.contains('matched')) return;
  if (type === 'base') {
    if (selectedBaseItem) selectedBaseItem.classList.remove('selected');
    selectedBaseItem = element; selectedBaseItem.classList.add('selected');
  } else {
    if (selectedFrItem) selectedFrItem.classList.remove('selected');
    selectedFrItem = element; selectedFrItem.classList.add('selected');
  }

  if (selectedBaseItem && selectedFrItem) {
    const baseId = selectedBaseItem.dataset.id;
    const frId = selectedFrItem.dataset.id;

    if (baseId === frId) {
      playSuccessSound();
      selectedBaseItem.className = 'matching-item matched';
      selectedFrItem.className = 'matching-item matched';
      updateMastery(baseId, true);
      if(!isErrorReviewMode) { currentScore += 5; gainXp(10); }
      selectedBaseItem = null; selectedFrItem = null; matchingPairsLeft--;

      if (matchingPairsLeft === 0) {
        setTimeout(() => {
          document.getElementById('matchingContent').innerHTML = `<div class="status-message">🎉 Tableau complété !</div>`;
          if(!isErrorReviewMode) { currentScore += 25; gainXp(50); progressQuest(3); }
          updateStats(); saveData();
        }, 1000);
      }
    } else {
      const item1 = selectedBaseItem; const item2 = selectedFrItem;
      item1.className = 'matching-item error'; item2.className = 'matching-item error';
      updateMastery(baseId, false); currentCombo = 0; 
      const badge = document.getElementById('comboBadge');
      if (badge) badge.style.display = 'none';
      selectedBaseItem = null; selectedFrItem = null;
      setTimeout(() => {
        if (item1.className.includes('error')) item1.className = 'matching-item';
        if (item2.className.includes('error')) item2.className = 'matching-item';
      }, 1000);
    }
    saveData();
  }
}

// ==========================================================================
// ACTIONS DE CONTRÔLE ET STATS AVANCÉES (TIMELINE SVG & PDF)
// ==========================================================================
function startReviewPractice() {
  const weakVerbs = verbs.slice(0, currentDifficulty).filter(v => (v.mastery || 0) < 3);
  if (weakVerbs.length === 0) {
    alert("🎉 Aucun verbe faible à travailler !");
    return;
  }
  isReviewMode = true;
  isErrorReviewMode = false;
  showSection('hardmode');
}

function startErrorReviewPractice() {
  if (recentErrors.length === 0) {
    alert("🎉 Votre historique d'erreurs récentes est vierge !");
    return;
  }
  isErrorReviewMode = true;
  isReviewMode = false;
  showSection('hardmode');
}

function resetAllStats() {
  if (confirm("⚠️ Réinitialiser l'INTEGRALITÉ de votre progression ?")) {
    localStorage.clear();
    currentScore = 0; currentStreak = 0; bestStreak = 0; playerXp = 0; playerLevel = 1; currentDifficulty = 20;
    isHardMode = false; isReviewMode = false; isErrorReviewMode = false; currentCombo = 0; recentErrors = []; dailyStreak = 0; lastActiveDate = "";
    activeVisualTheme = 'classic'; xpHistory = {};
    verbs.forEach(v => v.mastery = 0);
    changeVisualTheme('classic');
    initDailyQuests();
    updateStats();
    updateDifficultySelect();
    updateVisualThemeSelect();
    showSection('list');
  }
}

function showStats() {
  if(!verbs.length) return;
  const total = verbs.length;
  const mastered = verbs.filter(v => (v.mastery || 0) >= 4).length;
  const percentage = Math.round(mastered / total * 100);
  const avg = (verbs.reduce((s, v) => s + (v.mastery || 0), 0) / total).toFixed(1);

  // 1. Calcul de l'activité sur les 7 derniers jours
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last7Days.push({
      date: dateStr,
      label: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      xp: xpHistory[dateStr] || 0
    });
  }

  // Configuration graphique SVG Timeline
  const maxXp = Math.max(...last7Days.map(d => d.xp), 100);
  const svgWidth = 600, svgHeight = 180;
  const paddingLeft = 45, paddingRight = 20, paddingTop = 25, paddingBottom = 25;
  const graphWidth = svgWidth - paddingLeft - paddingRight;
  const graphHeight = svgHeight - paddingTop - paddingBottom;

  let pointsStr = "";
  let dotsHtml = "";
  let gridLinesHtml = `
    <line x1="${paddingLeft}" y1="${paddingTop}" x2="${svgWidth - paddingRight}" y2="${paddingTop}" stroke="var(--border)" stroke-dasharray="4" />
    <line x1="${paddingLeft}" y1="${paddingTop + graphHeight/2}" x2="${svgWidth - paddingRight}" y2="${paddingTop + graphHeight/2}" stroke="var(--border)" stroke-dasharray="4" />
    <line x1="${paddingLeft}" y1="${paddingTop + graphHeight}" x2="${svgWidth - paddingRight}" y2="${paddingTop + graphHeight}" stroke="var(--border)" />
    <text x="${paddingLeft - 8}" y="${paddingTop + 4}" font-size="10" fill="var(--text)" text-anchor="end">${maxXp} XP</text>
    <text x="${paddingLeft - 8}" y="${paddingTop + graphHeight/2 + 4}" font-size="10" fill="var(--text)" text-anchor="end">${Math.round(maxXp/2)}</text>
    <text x="${paddingLeft - 8}" y="${paddingTop + graphHeight + 4}" font-size="10" fill="var(--text)" text-anchor="end">0</text>
  `;

  last7Days.forEach((day, i) => {
    const x = paddingLeft + (i * (graphWidth / 6));
    const y = paddingTop + graphHeight - ((day.xp / maxXp) * graphHeight);
    pointsStr += `${x},${y} `;
    dotsHtml += `
      <circle cx="${x}" cy="${y}" r="4" fill="var(--accent)" />
      ${day.xp > 0 ? `<text x="${x}" y="${y - 8}" font-size="10" font-weight="bold" fill="var(--accent)" text-anchor="middle">${day.xp}</text>` : ''}
      <text x="${x}" y="${paddingTop + graphHeight + 16}" font-size="10" fill="var(--text)" text-anchor="middle">${day.label}</text>
    `;
  });

  document.getElementById('statsContent').innerHTML = `
    <p>Verbes maîtrisés (Niveau 4+) : <strong>${mastered}/${total}</strong> (${percentage}%)</p>
    <div class="progress-bar-container"><div class="progress-bar" style="width: ${percentage}%;"></div></div>
    
    <div class="stats-grid">
      <div class="stat-box"><span>Niveau moyen</span><strong>${avg} / 5</strong></div>
      <div class="stat-box"><span>Score global</span><strong>${currentScore}</strong></div>
      <div class="stat-box"><span>Meilleure série</span><strong>${bestStreak} 🔥</strong></div>
    </div>

    <h3 style="margin-top: 25px; margin-bottom: 10px;">📈 Activité & Évolution XP (7 derniers jours)</h3>
    <div class="chart-wrapper" style="background: var(--card); border: 1px solid var(--border); padding: 15px; border-radius: 8px; margin-bottom: 25px; overflow-x: auto;">
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" style="min-width: 500px; display: block; overflow: visible;">
        ${gridLinesHtml}
        <polyline points="${pointsStr.trim()}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${dotsHtml}
      </svg>
    </div>
  `;

  // Rendu des Défis Quotidiens
  let questsHtml = '<div class="quests-container">';
  dailyQuests.forEach(q => {
    questsHtml += `
      <div class="quest-line ${q.done ? 'quest-done' : ''}">
        <span>${q.done ? '✅' : '🎯'} <strong>${q.text}</strong> (${q.current}/${q.target})</span>
        <div class="quest-mini-bar-container"><div class="quest-mini-bar" style="width:${(q.current/q.target)*100}%"></div></div>
      </div>`;
  });
  document.getElementById('questsContent').innerHTML = questsHtml + '</div>';

  // Rendu des Trophées
  const badgeList = [
    { name: "Aventurier (Lvl 1)", desc: "20 verbes accessibles", unlocked: playerLevel >= 1 },
    { name: "Apprenti (Lvl 2)", desc: "40 verbes accessibles", unlocked: playerLevel >= 2 },
    { name: "Voyageur (Lvl 3)", desc: "60 verbes accessibles", unlocked: playerLevel >= 3 },
    { name: "Chasseur (Lvl 4)", desc: "80 verbes accessibles", unlocked: playerLevel >= 4 },
    { name: "Champion (Lvl 5)", desc: "100 verbes accessibles", unlocked: playerLevel >= 5 },
    { name: "Expert (Lvl 6)", desc: "120 verbes accessibles", unlocked: playerLevel >= 6 },
    { name: "Maître (Lvl 7)", desc: "150 verbes accessibles", unlocked: playerLevel >= 7 },
    { name: "Légende (Lvl 8)", desc: "200 verbes accessibles", unlocked: playerLevel >= 8 }
  ];

  let badgesHtml = '<div class="badges-container">';
  badgeList.forEach(b => {
    badgesHtml += `
      <div class="badge-box ${b.unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-status">${b.unlocked ? '⭐ Débloqué' : '🔒 Verrouillé'}</div>
        <h4>${b.name}</h4><p>${b.desc}</p>
      </div>`;
  });
  document.getElementById('badgesContent').innerHTML = badgesHtml + '</div>';

  // Rendu Carnet de Révision
  const weakVerbs = verbs.slice(0, currentDifficulty).filter(v => (v.mastery || 0) < 3);
  let reviewHtml = weakVerbs.length === 0 ? '<p class="status-message" style="color: #10b981;">🎉 Tout est maîtrisé !</p>' : '<div class="review-grid">';
  if (weakVerbs.length > 0) {
    weakVerbs.forEach(v => {
      reviewHtml += `<div class="review-notebook-card"><div class="review-card-header"><strong>${v.base}</strong> <small>(${v.fr})</small></div><div class="review-card-footer">Maîtrise : ${v.mastery || 0}/5</div></div>`;
    });
    reviewHtml += '</div>';
  }
  document.getElementById('reviewNotebookContent').innerHTML = reviewHtml;

  // Rendu Carnet des erreurs récentes
  let errorHtml = recentErrors.length === 0 ? '<p class="status-message" style="color:#10b981;">🎉 Aucune erreur récente !</p>' : '<div class="review-grid">';
  if (recentErrors.length > 0) {
    recentErrors.forEach(errBase => {
      const v = verbs.find(v => v.base === errBase);
      if (v) errorHtml += `<div class="review-notebook-card" style="border-color:#ef4444;"><div class="review-card-header"><strong>${v.base}</strong> → ${v.past} / ${v.pp}</div></div>`;
    });
    errorHtml += '</div>';
  }
  document.getElementById('errorNotebookContent').innerHTML = errorHtml;
}

// Fiche de révision d'exercice propre imprimable en PDF via moteur natif
function exportReviewPDF() {
  const weakVerbs = verbs.slice(0, currentDifficulty).filter(v => (v.mastery || 0) < 3);
  if (weakVerbs.length === 0) {
    alert("Votre carnet de révision est vide ! Aucun verbe à exporter.");
    return;
  }
  
  const printWindow = window.open('', '_blank');
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Mon Carnet de Révision - English Irregular Verbs</title>
      <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 30px; line-height: 1.4; }
        header { border-bottom: 2px solid #1c3d5a; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        h1 { margin: 0; color: #1c3d5a; font-size: 1.8rem; }
        .meta-info { font-size: 0.85rem; color: #64748b; text-align: right; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .verb-card { border: 1px dashed #f58634; padding: 14px; border-radius: 8px; background: #fafafa; page-break-inside: avoid; }
        .verb-title { font-size: 1.15rem; color: #1c3d5a; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
        .forms { font-size: 1rem; margin: 3px 0; }
        .mastery-tag { font-size: 0.75rem; color: #ef4444; font-weight: bold; margin-top: 8px; text-transform: uppercase; }
        @media print { body { padding: 0; } .verb-card { border-color: #cbd5e1; background: #fff; } }
      </style>
    </head>
    <body>
      <header>
        <div>
          <h1>Mon Carnet de Révision</h1>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.95rem;">Fiche d'étude personnelle générée dynamiquement.</p>
        </div>
        <div class="meta-info">Généré le ${new Date().toLocaleDateString('fr-FR')}<br>Pool : <strong>${currentDifficulty} verbes</strong></div>
      </header>
      <div class="grid">`;

  weakVerbs.forEach(v => {
    htmlContent += `
        <div class="verb-card">
          <div class="verb-title">${v.base.toUpperCase()} <span style="font-weight: normal; font-size: 0.85rem; color: #64748b;">(${v.fr})</span></div>
          <div class="forms">Prétérit : <strong style="color: #1c3d5a;">${v.past}</strong></div>
          <div class="forms">Participe Passé : <strong style="color: #1c3d5a;">${v.pp}</strong></div>
          <div class="mastery-tag">Maîtrise : ${v.mastery || 0} / 5 ★</div>
        </div>`;
  });

  htmlContent += `</div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      <\/script>
    </body>
    </html>`;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

// ==========================================================================
// NAVIGATION ET RACCOURCIS GLOBAUX
// ==========================================================================
function showSection(section) {
  if (section !== 'flashcards' && slideshowInterval) toggleSlideshow();
  if (section !== 'quiz' && timeAttackTimer) {
    clearInterval(timeAttackTimer); timeAttackTimer = null; isTimeAttack = false;
    document.getElementById('quizModeContainer').style.display = 'block'; 
    document.getElementById('quizTimerDisplay').style.display = 'none';
  }
  if (section !== 'hardmode') { isReviewMode = false; isErrorReviewMode = false; }
  if (quizTimeout) clearTimeout(quizTimeout);

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');
  document.getElementById('familyFilterContainer').style.display = (section === 'list') ? 'block' : 'none';

  // Fix exact de surbrillance
  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('active');
    if(btn.getAttribute('onclick') === `showSection('${section}')`) btn.classList.add('active');
  });

  if (section === 'list') searchVerbs();
  if (section === 'flashcards') showFlashcard();
  if (section === 'quiz') startQuiz();
  if (section === 'matching') startMatching();
  if (section === 'hardmode') startHardMode();
  if (section === 'stats') showStats();
}

// Gestion des raccourcis clavier
window.addEventListener('keydown', (e) => {
  const activeSection = document.querySelector('.section.active').id;
  if (activeSection === 'quiz') {
    if (['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      const options = document.querySelectorAll('#quizContent .option');
      const idx = parseInt(e.key) - 1;
      if (options[idx] && !options[idx].disabled) options[idx].click();
    }
  } else if (activeSection === 'flashcards') {
    if (e.key === ' ') { 
      e.preventDefault(); 
      const inner = document.querySelector('.card-inner'); 
      if (inner) inner.click(); 
    }
    if (e.key === 'ArrowRight') { 
      e.preventDefault(); 
      showFlashcard(); 
    }
  }
});

// ==========================================================================
// INITIALISATION & PWA
// ==========================================================================
window.onload = async () => {
  await loadVerbsFromJSON();
  checkDailyStreak();
  initDailyQuests();
  updateStats();
  updateDifficultySelect();
  updateVisualThemeSelect();
  changeVisualTheme(activeVisualTheme);
  showSection('list');

  document.getElementById('themeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
  });
};

// Enregistrement PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(err => console.log("SW Fail", err));
}