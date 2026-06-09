// --- BASE DE DONNÉES CONSOLIDÉE (60 Légumes sur 3 Niveaux) ---
const fruitsData = [
    // NIVEAU 1 (20 légumes de base - Accessible immédiatement)
    { en: "Carrot", fr: "Carotte", emoji: "🥕", level: 1 },
    { en: "Potato", fr: "Pomme de terre", emoji: "🥔", level: 1 },
    { en: "Tomato", fr: "Tomate", emoji: "🍅", level: 1 },
    { en: "Broccoli", fr: "Brocoli", emoji: "🥦", level: 1 },
    { en: "Lettuce", fr: "Salade / Laitue", emoji: "🥬", level: 1 },
    { en: "Cucumber", fr: "Concombre", emoji: "🥒", level: 1 },
    { en: "Onion", fr: "Oignon", emoji: "🧅", level: 1 },
    { en: "Garlic", fr: "Ail", emoji: "🧄", level: 1 },
    { en: "Corn", fr: "Maïs", emoji: "🌽", level: 1 },
    { en: "Pea", fr: "Petit pois", emoji: "🫛", level: 1 },
    { en: "Pumpkin", fr: "Potiron", emoji: "🎃", level: 1 },
    { en: "Spinach", fr: "Épinard", emoji: "🍃", level: 1 },
    { en: "Mushroom", fr: "Champignon", emoji: "🍄", level: 1 },
    { en: "Pepper", fr: "Poivron", emoji: "🫑", level: 1 },
    { en: "Cabbage", fr: "Chou", emoji: "🥬", level: 1 },
    { en: "Radish", fr: "Radis", emoji: "🔴", level: 1 },
    { en: "Leek", fr: "Poireau", emoji: "🌿", level: 1 },
    { en: "Zucchini", fr: "Courgette", emoji: "🥒", level: 1 },
    { en: "Eggplant", fr: "Aubergine", emoji: "🍆", level: 1 },
    { en: "Sweet potato", fr: "Patate douce", emoji: "🍠", level: 1 },

    // NIVEAU 2 (20 légumes intermédiaires - Débloqué au Niveau joueur 5)
    { en: "Asparagus", fr: "Asperge", emoji: "🎋", level: 2 },
    { en: "Artichoke", fr: "Artichaut", emoji: "🍏", level: 2 },
    { en: "Beetroot", fr: "Betterave", emoji: "🔴", level: 2 },
    { en: "Cauliflower", fr: "Chou-fleur", emoji: "🥦", level: 2 },
    { en: "Celery", fr: "Céleri", emoji: "🌿", level: 2 },
    { en: "Brussels sprout", fr: "Chou de Bruxelles", emoji: "🟢", level: 2 },
    { en: "Fennel", fr: "Fenouil", emoji: "🌿", level: 2 },
    { en: "Ginger", fr: "Gingembre", emoji: "🟤", level: 2 },
    { en: "Turnip", fr: "Navet", emoji: "🟣", level: 2 },
    { en: "Parsnip", fr: "Panais", emoji: "🥕", level: 2 },
    { en: "Kale", fr: "Chou frisé", emoji: "🥬", level: 2 },
    { en: "Shallot", fr: "Échalote", emoji: "🧅", level: 2 },
    { en: "Watercress", fr: "Cresson", emoji: "🌿", level: 2 },
    { en: "Radicchio", fr: "Chicorée rouge", emoji: "🥬", level: 2 },
    { en: "Okra", fr: "Gombo", emoji: "🌾", level: 2 },
    { en: "Swiss chard", fr: "Blette", emoji: "🥬", level: 2 },
    { en: "Endive", fr: "Endive", emoji: "🥬", level: 2 },
    { en: "Squash", fr: "Courge", emoji: "🎃", level: 2 },
    { en: "Bean", fr: "Haricot", emoji: "🫘", level: 2 },
    { en: "Chickpea", fr: "Pois chiche", emoji: "🟤", level: 2 },

    // NIVEAU 3 (20 légumes avancés/exotiques - Débloqué au Niveau joueur 10)
    { en: "Daikon", fr: "Radis blanc", emoji: "🥕", level: 3 },
    { en: "Taro", fr: "Taro", emoji: "🍠", level: 3 },
    { en: "Cassava", fr: "Manioc", emoji: "🟤", level: 3 },
    { en: "Lotus root", fr: "Racine de lotus", emoji: "☸️", level: 3 },
    { en: "Bok choy", fr: "Chou chinois", emoji: "🥬", level: 3 },
    { en: "Kohlrabi", fr: "Chou-rave", emoji: "🍏", level: 3 },
    { en: "Jerusalem artichoke", fr: "Topinambour", emoji: "🟤", level: 3 },
    { en: "Jicama", fr: "Jicama", emoji: "🥔", level: 3 },
    { en: "Bitter melon", fr: "Melon amer", emoji: "🥒", level: 3 },
    { en: "Fiddlehead", fr: "Crosse de fougère", emoji: "🌀", level: 3 },
    { en: "Samphire", fr: "Salicorne", emoji: "🌿", level: 3 },
    { en: "Romanesco", fr: "Chou romanesco", emoji: "🥦", level: 3 },
    { en: "Chayote", fr: "Chayote", emoji: "🍏", level: 3 },
    { en: "Edamame", fr: "Edamame", emoji: "🫛", level: 3 },
    { en: "Horseradish", fr: "Raifort", emoji: "🥕", level: 3 },
    { en: "Bamboo shoot", fr: "Pousse de bambou", emoji: "🎋", level: 3 },
    { en: "Burdock root", fr: "Racine de bardane", emoji: "🥢", level: 3 },
    { en: "Tomatillo", fr: "Tomatillo", emoji: "🟢", level: 3 },
    { en: "Water chestnut", fr: "Châtaigne d'eau", emoji: "🟤", level: 3 },
    { en: "Rutabaga", fr: "Rutabaga", emoji: "🟣", level: 3 }
];

// --- ÉTATS GÉNÉRAUX & STATISTIQUES ---
let currentStreak = 0, maxStreak = 0, totalPoints = 0;
let highScores = { quiz: 0, speak: 0, timeattack: 0 };
let favoriteFruits = [];
let errorHistory = []; 
let unlockedBadges = []; 
let audioSpeed = 1.0;
let filterOnlyFavs = false;
let searchDirection = 'EN_FR';
let globalAudioCtx = null; // Instance unique partagée 
let selectedVocabularyLevel = 1; 

// --- CONFIGURATION DES BADGES ---
const badgesDatabase = [
    { id: "first_perfect", title: "Sans Faute !", desc: "Faire un 10/10 en QCM", icon: "🏅", color: "bg-yellow-400" },
    { id: "streak_15", title: "Inarrêtable", desc: "Atteindre 15 bonnes réponses de suite", icon: "🔥", color: "bg-brandPink" },
    { id: "time_20", title: "Chrono Master", desc: "Marquer 20 points en Time Attack", icon: "⚡", color: "bg-cyan-400" },
    { id: "polyglotte", title: "Styliste Pro", desc: "Débloquer la ligue Niveau 2", icon: "👑", color: "bg-brandPurple" }
];

// --- ALGORITHME DE RÉPÉTITION ESPACÉE ---
function getNextExerciseWord() {
    const currentLevelWords = fruitsData.filter(f => f.level === parseInt(selectedVocabularyLevel));
    const currentLevelErrors = errorHistory.filter(err => err.level === parseInt(selectedVocabularyLevel));

    if (currentLevelErrors.length > 0 && Math.random() < 0.35) {
        return currentLevelErrors[Math.floor(Math.random() * currentLevelErrors.length)];
    }
    return currentLevelWords[Math.floor(Math.random() * currentLevelWords.length)];
}

// --- LOGIQUE DES BADGES ---
function checkAndUnlockBadge(badgeId) {
    if (!unlockedBadges.includes(badgeId)) {
        unlockedBadges.push(badgeId);
        localStorage.setItem('oe_unlocked_badges_veg', JSON.stringify(unlockedBadges));
        triggerConfetti();
        if(typeof renderBadgesUI === 'function') renderBadgesUI();
    }
}

// --- MODULE AUDIO DE HAUTE PRÉCISION ---
let preferredVoice = null;

function initVoices() {
    if (!('speechSynthesis' in window)) return;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;

    let bestVoice = voices.find(voice => 
        voice.lang.toLowerCase().startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Neural') || voice.name.includes('Premium'))
    );

    if (!bestVoice) {
        bestVoice = voices.find(voice => 
            voice.lang.toLowerCase().startsWith('en') && !voice.name.includes('Desktop')
        );
    }

    if (!bestVoice) {
        bestVoice = voices.find(voice => voice.lang.toLowerCase().startsWith('en'));
    }

    if (bestVoice) {
        preferredVoice = bestVoice;
    }
}

if ('speechSynthesis' in window) {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = initVoices;
    }
    initVoices(); 
}

function setAudioSpeed(speed) {
    audioSpeed = speed;
    const btnNormal = document.getElementById('speed-normal');
    const btnSlow = document.getElementById('speed-slow');
    if (btnNormal && btnSlow) {
        if (speed === 1.0) {
            btnNormal.className = "px-2.5 py-1 bg-brandBlue text-white rounded-lg font-black transition-all transform active:scale-95 shadow-md shadow-brandBlue/20";
            btnSlow.className = "px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 rounded-lg font-bold flex items-center gap-1 transition-all";
        } else {
            btnNormal.className = "px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 rounded-lg font-bold transition-all";
            btnSlow.className = "px-2.5 py-1 bg-brandBlue text-white rounded-lg font-black flex items-center gap-1 transition-all transform active:scale-95 shadow-md shadow-brandBlue/20";
        }
    }
}

function playAudio(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = audioSpeed;

        if (!preferredVoice) initVoices();

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
    } else {
        const encodedText = encodeURIComponent(text.toLowerCase());
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;
        const audio = new Audio(audioUrl);
        audio.playbackRate = audioSpeed;
        audio.play().catch(e => console.log("Audio play error:", e));
    }
}

function playSoundEffect(type) {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    
    if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }

    const osc = globalAudioCtx.createOscillator();
    const gain = globalAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(globalAudioCtx.destination);

    if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, globalAudioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, globalAudioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.3);
        osc.start(); osc.stop(globalAudioCtx.currentTime + 0.3);
    } else if (type === 'fail') {
        osc.frequency.setValueAtTime(196.00, globalAudioCtx.currentTime);
        osc.frequency.setValueAtTime(146.83, globalAudioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.4);
        osc.start(); osc.stop(globalAudioCtx.currentTime + 0.4);
    }
}

function triggerConfetti() {
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = ['#FF5A36', '#10B981', '#6366F1', '#FBBF24', '#EC4899'][Math.floor(Math.random() * 5)];
        confetti.style.transform = `scale(${Math.random() * 0.8 + 0.6})`;
        confetti.style.animationDelay = Math.random() * 1.0 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

// --- CARNET DE RÉVISIONS ---
function registerError(fruitObj) {
    if (!errorHistory.some(f => f.en === fruitObj.en)) {
        errorHistory.push(fruitObj);
        localStorage.setItem('oe_error_history_veg', JSON.stringify(errorHistory));
    }
}
function removeError(englishName) {
    errorHistory = errorHistory.filter(f => f.en !== englishName);
    localStorage.setItem('oe_error_history_veg', JSON.stringify(errorHistory));
}

// --- GESTION DE LA PROGRESSION ---
function getUserPlayerLevel() {
    return Math.floor(totalPoints / 150) + 1;
}

// --- ADAPTATION DES TITRES (Potager Gamifié) ---
function updateLevelAndTitle() {
    const pLevel = getUserPlayerLevel();
    const levelEl = document.getElementById('user-level');
    const titleEl = document.getElementById('user-title');
    
    if (levelEl) levelEl.innerText = pLevel;

    let title = "Novice du Jardin 🎯";
    if (pLevel >= 2) title = "Apprenti Potager 🌿";
    if (pLevel >= 3) title = "Jardinier Elite 🛡️";
    if (pLevel >= 5) {
        title = "Expert Maraîcher 👑";
        checkAndUnlockBadge("polyglotte"); 
    }
    if (pLevel >= 10) title = "Maître Suprême 👾";

    if (titleEl) titleEl.innerText = title;
    if (typeof updateLevelLockUI === 'function') updateLevelLockUI();
}

// --- MODULE DARK MODE ---
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('oe_dark_mode', isDark);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = isDark ? "fa-solid fa-sun text-yellow-300 text-base" : "fa-solid fa-moon text-yellow-300 text-base";
    }
}

// --- RÉINITIALISATION DES STATISTIQUES ---
function resetStats() {
    if (confirm("Es-tu sûr de vouloir réinitialiser toute ta progression et tes trophées ? 🔥")) {
        const keysToRemove = ['oe_total_points_veg', 'oe_high_quiz_veg', 'oe_high_speak_veg', 'oe_high_timeattack_veg', 'oe_max_streak_veg', 'oe_fav_veg', 'oe_error_history_veg', 'oe_unlocked_badges_veg'];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        totalPoints = 0; highScores = { quiz: 0, speak: 0, timeattack: 0 }; maxStreak = 0; currentStreak = 0; errorHistory = []; unlockedBadges = []; favoriteFruits = [];
        document.getElementById('total-points').innerText = totalPoints;
        document.getElementById('streak-count').innerText = currentStreak;
        document.getElementById('stat-high-quiz').innerText = 0;
        document.getElementById('stat-high-speak').innerText = 0;
        document.getElementById('stat-high-timeattack').innerText = 0;
        document.getElementById('stat-max-streak').innerText = 0;
        updateLevelAndTitle();
        if (typeof renderDict === 'function') renderDict();
        if (typeof updateFlashcard === 'function') updateFlashcard();
        if (typeof renderBadgesUI === 'function') renderBadgesUI();
        if (typeof renderErrorHistory === 'function') renderErrorHistory();
        alert("Reset effectué ! Prêt à repartir à zéro ? 😉");
    }
}

// --- PERSISTENCE ---
function saveStats() {
    localStorage.setItem('oe_total_points_veg', totalPoints);
    localStorage.setItem('oe_high_quiz_veg', highScores.quiz);
    localStorage.setItem('oe_high_speak_veg', highScores.speak); 
    localStorage.setItem('oe_high_timeattack_veg', highScores.timeattack);
    localStorage.setItem('oe_max_streak_veg', maxStreak);
}

function loadStats() {
    totalPoints = parseInt(localStorage.getItem('oe_total_points_veg')) || 0;
    highScores.quiz = parseInt(localStorage.getItem('oe_high_quiz_veg')) || 0;
    highScores.speak = parseInt(localStorage.getItem('oe_high_speak_veg')) || 0; 
    highScores.timeattack = parseInt(localStorage.getItem('oe_high_timeattack_veg')) || 0;
    maxStreak = parseInt(localStorage.getItem('oe_max_streak_veg')) || 0;
    favoriteFruits = JSON.parse(localStorage.getItem('oe_fav_veg')) || [];
    errorHistory = JSON.parse(localStorage.getItem('oe_error_history_veg')) || [];
    unlockedBadges = JSON.parse(localStorage.getItem('oe_unlocked_badges_veg')) || [];
    
    if (localStorage.getItem('oe_dark_mode') === 'true') {
        document.documentElement.classList.add('dark');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.className = "fa-solid fa-sun text-yellow-300 text-base";
    }
    const totalPointsEl = document.getElementById('total-points');
    if (totalPointsEl) totalPointsEl.innerText = totalPoints;
    updateLevelAndTitle();
}