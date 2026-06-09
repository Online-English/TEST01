// --- BASE DE DONNÉES CONSOLIDÉE (60 Fruits sur 3 Niveaux) ---
const fruitsData = [
    // NIVEAU 1
    { en: "Apple", fr: "Pomme", emoji: "🍎", level: 1 },
    { en: "Banana", fr: "Banane", emoji: "🍌", level: 1 },
    { en: "Orange", fr: "Orange", emoji: "🍊", level: 1 },
    { en: "Strawberry", fr: "Fraise", emoji: "🍓", level: 1 },
    { en: "Grape", fr: "Raisin", emoji: "🍇", level: 1 },
    { en: "Watermelon", fr: "Pastèque", emoji: "🍉", level: 1 },
    { en: "Lemon", fr: "Citron", emoji: "🍋", level: 1 },
    { en: "Peach", fr: "Pêche", emoji: "🍑", level: 1 },
    { en: "Cherry", fr: "Cerise", emoji: "🍒", level: 1 },
    { en: "Pineapple", fr: "Ananas", emoji: "🍍", level: 1 },
    { en: "Mango", fr: "Mangue", emoji: "🥭", level: 1 },
    { en: "Pear", fr: "Poire", emoji: "🍐", level: 1 },
    { en: "Raspberry", fr: "Framboise", emoji: "🔴", level: 1 },
    { en: "Blueberry", fr: "Myrtille", emoji: "🫐", level: 1 },
    { en: "Kiwi", fr: "Kiwi", emoji: "🥝", level: 1 },
    { en: "Plum", fr: "Prune", emoji: "🟣", level: 1 }, 
    { en: "Avocado", fr: "Avocat", emoji: "🥑", level: 1 },
    { en: "Coconut", fr: "Noix de coco", emoji: "🥥", level: 1 },
    { en: "Melon", fr: "Melon", emoji: "🍈", level: 1 },
    { en: "Fig", fr: "Figue", emoji: "🟤", level: 1 },

    // NIVEAU 2
    { en: "Blackberry", fr: "Mûre", emoji: "🫐", level: 2 },
    { en: "Apricot", fr: "Abricot", emoji: "🍑", level: 2 },
    { en: "Grapefruit", fr: "Pamplemousse", emoji: "🍊", level: 2 },
    { en: "Lime", fr: "Citron vert", emoji: "🍋", level: 2 },
    { en: "Cranberry", fr: "Canneberge", emoji: "🍒", level: 2 },
    { en: "Passion fruit", fr: "Fruit de la passion", emoji: "🟣", level: 2 },
    { en: "Pomegranate", fr: "Grenade", emoji: "🍎", level: 2 },
    { en: "Lychee", fr: "Litchi", emoji: "🔴", level: 2 },
    { en: "Papaya", fr: "Papaye", emoji: "🥭", level: 2 },
    { en: "Guava", fr: "Goyave", emoji: "🍏", level: 2 },
    { en: "Date", fr: "Datte", emoji: "🟤", level: 2 },
    { en: "Blackcurrant", fr: "Cassis", emoji: "🟤", level: 2 },
    { en: "Redcurrant", fr: "Groseille", emoji: "🔴", level: 2 },
    { en: "Tangerine", fr: "Mandarine", emoji: "🍊", level: 2 },
    { en: "Clementine", fr: "Clémentine", emoji: "🍊", level: 2 },
    { en: "Persimmon", fr: "Kaki", emoji: "🍅", level: 2 },
    { en: "Gooseberry", fr: "Groseille à maquereau", emoji: "🟢", level: 2 },
    { en: "Dragon fruit", fr: "Fruit du dragon", emoji: "🐲", level: 2 },
    { en: "Rhubarb", fr: "Rhubarbe", emoji: "🌿", level: 2 },
    { en: "Quince", fr: "Coing", emoji: "🍏", level: 2 },

    // NIVEAU 3
    { en: "Starfruit", fr: "Carambole", emoji: "⭐", level: 3 },
    { en: "Jackfruit", fr: "Jacquier", emoji: "🍏", level: 3 },
    { en: "Durian", fr: "Durian", emoji: "🦔", level: 3 },
    { en: "Rambutan", fr: "Ramboutan", emoji: "🔴", level: 3 },
    { en: "Mangosteen", fr: "Mangoustan", emoji: "🟣", level: 3 },
    { en: "Kumquat", fr: "Kumquat", emoji: "🍊", level: 3 },
    { en: "Elderberry", fr: "Baie de sureau", emoji: "🍇", level: 3 },
    { en: "Mulberry", fr: "Mûre de ronce", emoji: "🫐", level: 3 },
    { en: "Jujube", fr: "Datte chinoise", emoji: "🟤", level: 3 },
    { en: "Tamarind", fr: "Tamarin", emoji: "🟤", level: 3 },
    { en: "Plantain", fr: "Banane plantain", emoji: "🍌", level: 3 },
    { en: "Blood orange", fr: "Orange sanguine", emoji: "🍊", level: 3 },
    { en: "Pomelo", fr: "Pomélo", emoji: "🟢", level: 3 },
    { en: "Boysenberry", fr: "Mûroise", emoji: "🍇", level: 3 },
    { en: "Feijoa", fr: "Goyave du Brésil", emoji: "🟢", level: 3 },
    { en: "Longan", fr: "Longane", emoji: "🟤", level: 3 },
    { en: "Salak", fr: "Fruit serpent", emoji: "🟤", level: 3 },
    { en: "Breadfruit", fr: "Fruit à pain", emoji: "🟢", level: 3 },
    { en: "Medlar", fr: "Nèfle", emoji: "🟤", level: 3 },
    { en: "Prickly pear", fr: "Figue de Barbarie", emoji: "🌵", level: 3 }
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
let globalAudioCtx = null; 
let selectedVocabularyLevel = 1; 

// --- CONFIGURATION DES BADGES ---
const badgesDatabase = [
    { id: "first_perfect", title: "Perfect Score !", desc: "Décrocher un 10/10 impérial en QCM", icon: "👑", color: "bg-gradient-to-r from-amber-400 to-amber-600" },
    { id: "streak_15", title: "En Feu 🔥", desc: "Aligner une série folle de 15 bonnes réponses", icon: "⚡", color: "bg-gradient-to-r from-brandOrange to-red-600" },
    { id: "time_20", title: "Speedrunner", desc: "Valider 20 points en Contre-la-montre", icon: "⏱️", color: "bg-gradient-to-r from-cyan-400 to-blue-600" },
    { id: "polyglotte", title: "Hyper-Grand Master", desc: "Atteindre le niveau 5 de joueur", icon: "🧠", color: "bg-gradient-to-r from-cyberPurple to-indigo-600" }
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
        localStorage.setItem('oe_unlocked_badges', JSON.stringify(unlockedBadges));
        triggerConfetti();
        if(typeof renderBadgesUI === 'function') renderBadgesUI();
    }
}

// --- MODULE AUDIO ---
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
        bestVoice = voices.find(voice => voice.lang.toLowerCase().startsWith('en') && !voice.name.includes('Desktop'));
    }
    if (!bestVoice) {
        bestVoice = voices.find(voice => voice.lang.toLowerCase().startsWith('en'));
    }

    if (bestVoice) preferredVoice = bestVoice;
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
            btnNormal.className = "px-3 py-1.5 bg-gradient-to-r from-brandBlue to-cyberPurple text-white rounded-xl font-extrabold shadow-md shadow-brandBlue/20 transform scale-105 transition duration-150";
            btnSlow.className = "px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-1 font-bold transition duration-150";
        } else {
            btnNormal.className = "px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition duration-150";
            btnSlow.className = "px-3 py-1.5 bg-gradient-to-r from-brandBlue to-cyberPurple text-white rounded-xl flex items-center gap-1 font-extrabold shadow-md shadow-brandBlue/20 transform scale-105 transition duration-150";
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
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    } else {
        const encodedText = encodeURIComponent(text.toLowerCase());
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;
        const audio = new Audio(audioUrl);
        audio.playbackRate = audioSpeed;
        audio.play().catch(e => console.log("Audio failure:", e));
    }
}

function playSoundEffect(type) {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!globalAudioCtx) globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (globalAudioCtx.state === 'suspended') globalAudioCtx.resume();

    const osc = globalAudioCtx.createOscillator();
    const gain = globalAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(globalAudioCtx.destination);

    if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, globalAudioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, globalAudioCtx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.12, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.35);
        osc.start(); osc.stop(globalAudioCtx.currentTime + 0.35);
    } else if (type === 'fail') {
        osc.frequency.setValueAtTime(220.00, globalAudioCtx.currentTime); 
        osc.frequency.setValueAtTime(164.81, globalAudioCtx.currentTime + 0.12); 
        gain.gain.setValueAtTime(0.15, globalAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.45);
        osc.start(); osc.stop(globalAudioCtx.currentTime + 0.45);
    }
}

function triggerConfetti() {
    for (let i = 0; i < 45; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = ['#6366F1', '#FF2A7A', '#10B981', '#FFD166', '#A855F7'][Math.floor(Math.random() * 5)];
        confetti.style.transform = `scale(${Math.random() * 0.9 + 0.5})`;
        confetti.style.animationDelay = Math.random() * 1.0 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

// --- CARNET DE RÉVISIONS ---
function registerError(fruitObj) {
    if (!errorHistory.some(f => f.en === fruitObj.en)) {
        errorHistory.push(fruitObj);
        localStorage.setItem('oe_error_history', JSON.stringify(errorHistory));
    }
}

function removeError(englishName) {
    errorHistory = errorHistory.filter(f => f.en !== englishName);
    localStorage.setItem('oe_error_history', JSON.stringify(errorHistory));
}

// --- GESTION DE LA PROGRESSION ---
function getUserPlayerLevel() {
    return Math.floor(totalPoints / 150) + 1;
}

function updateLevelAndTitle() {
    const pLevel = getUserPlayerLevel();
    const levelEl = document.getElementById('user-level');
    const titleEl = document.getElementById('user-title');
    
    if (levelEl) levelEl.innerText = pLevel;

    let title = "Novice des Fruits 🟢";
    if (pLevel >= 2) title = "Apprenti Fruitier 🎯";
    if (pLevel >= 3) title = "Verger Connaisseur 💎";
    if (pLevel >= 5) {
        title = "Expert Botanique 🧠";
        checkAndUnlockBadge("polyglotte"); 
    }
    if (pLevel >= 10) title = "Maître des Vergers 🔥";

    if (titleEl) titleEl.innerText = title;
    if (typeof updateLevelLockUI === 'function') updateLevelLockUI();
}

// --- MODULE DARK MODE ---
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('oe_dark_mode', isDark);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = isDark ? "fa-solid fa-sun text-yellow-300" : "fa-solid fa-moon text-yellow-300";
    }
}

// --- RÉINITIALISATION DES STATISTIQUES ---
function resetStats() {
    if (confirm("🚨 Tu es sûr de vouloir effacer tes scores, tes XP et tes badges pour tout recommencer à zéro ?")) {
        const keysToRemove = ['oe_total_points', 'oe_high_quiz', 'oe_high_speak', 'oe_high_timeattack', 'oe_max_streak', 'oe_fav_fruits', 'oe_error_history', 'oe_unlocked_badges'];
        keysToRemove.forEach(key => localStorage.removeItem(key));

        totalPoints = 0; highScores = { quiz: 0, speak: 0, timeattack: 0 };
        maxStreak = 0; currentStreak = 0;
        errorHistory = []; unlockedBadges = []; favoriteFruits = [];

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

        alert("Compte remis à zéro ! C'est reparti pour le grind ! 🦾");
    }
}

// --- PERSISTENCE ---
function saveStats() {
    localStorage.setItem('oe_total_points', totalPoints);
    localStorage.setItem('oe_high_quiz', highScores.quiz);
    localStorage.setItem('oe_high_speak', highScores.speak); 
    localStorage.setItem('oe_high_timeattack', highScores.timeattack);
    localStorage.setItem('oe_max_streak', maxStreak);
}

function loadStats() {
    totalPoints = parseInt(localStorage.getItem('oe_total_points')) || 0;
    highScores.quiz = parseInt(localStorage.getItem('oe_high_quiz')) || 0;
    highScores.speak = parseInt(localStorage.getItem('oe_high_speak')) || 0; 
    highScores.timeattack = parseInt(localStorage.getItem('oe_high_timeattack')) || 0;
    maxStreak = parseInt(localStorage.getItem('oe_max_streak')) || 0;
    favoriteFruits = JSON.parse(localStorage.getItem('oe_fav_fruits')) || [];
    errorHistory = JSON.parse(localStorage.getItem('oe_error_history')) || [];
    unlockedBadges = JSON.parse(localStorage.getItem('oe_unlocked_badges')) || [];
    
    if (localStorage.getItem('oe_dark_mode') === 'true') {
        document.documentElement.classList.add('dark');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.className = "fa-solid fa-sun text-yellow-300";
    }

    const totalPointsEl = document.getElementById('total-points');
    if (totalPointsEl) totalPointsEl.innerText = totalPoints;
    
    updateLevelAndTitle();
}