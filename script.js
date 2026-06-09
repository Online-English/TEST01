// --- BASE DE DONNÉES CONSOLIDÉE (60 Vêtements & Accessoires sur 3 Niveaux) ---
const fruitsData = [
    // NIVEAU 1 (20 vêtements de base - Accessible immédiatement)
    { en: "Shirt", fr: "Chemise", emoji: "👔", level: 1 },
    { en: "T-shirt", fr: "T-shirt", emoji: "👕", level: 1 },
    { en: "Jeans", fr: "Jean", emoji: "👖", level: 1 },
    { en: "Dress", fr: "Robe", emoji: "👗", level: 1 },
    { en: "Skirt", fr: "Jupe", emoji: "👗", level: 1 },
    { en: "Socks", fr: "Chaussettes", emoji: "🧦", level: 1 },
    { en: "Shoes", fr: "Chaussures", emoji: "👟", level: 1 },
    { en: "Coat", fr: "Manteau", emoji: "🧥", level: 1 },
    { en: "Jacket", fr: "Veste", emoji: "🧥", level: 1 },
    { en: "Shorts", fr: "Short", emoji: "🩳", level: 1 },
    { en: "Hat", fr: "Chapeau", emoji: "🎩", level: 1 },
    { en: "Cap", fr: "Casquette", emoji: "Cap", level: 1 }, // 🧢
    { en: "Gloves", fr: "Gants", emoji: "🧤", level: 1 },
    { en: "Scarf", fr: "Écharpe", emoji: "🧣", level: 1 },
    { en: "Boots", fr: "Bottes", emoji: "🥾", level: 1 },
    { en: "Tie", fr: "Cravate", emoji: "👔", level: 1 },
    { en: "Belt", fr: "Ceinture", emoji: "🎗️", level: 1 },
    { en: "Glasses", fr: "Lunettes", emoji: "👓", level: 1 },
    { en: "Sweater", fr: "Pull / Candigan", emoji: "🧶", level: 1 },
    { en: "Swimsuit", fr: "Maillot de bain", emoji: "👙", level: 1 },

    // NIVEAU 2 (20 vêtements intermédiaires - Débloqué au Niveau joueur 5)
    { en: "Blouse", fr: "Blouse / Chemisier", emoji: "👚", level: 2 },
    { en: "Suit", fr: "Costume", emoji: "👔", level: 2 },
    { en: "Sneakers", fr: "Baskets", emoji: "👟", level: 2 },
    { en: "Sandals", fr: "Sandales", emoji: "👡", level: 2 },
    { en: "Slippers", fr: "Pantoufles", emoji: "🥿", level: 2 },
    { en: "High heels", fr: "Talons hauts", emoji: "👠", level: 2 },
    { en: "Underwear", fr: "Sous-vêtements", emoji: "🩲", level: 2 },
    { en: "Sunglasses", fr: "Lunettes de soleil", emoji: "🕶️", level: 2 },
    { en: "Umbrella", fr: "Parapluie", emoji: "☂️", level: 2 },
    { en: "Watch", fr: "Montre", emoji: "⌚", level: 2 },
    { en: "Backpack", fr: "Sac à dos", emoji: "🎒", level: 2 },
    { en: "Handbag", fr: "Sac à main", emoji: "👜", level: 2 },
    { en: "Wallet", fr: "Portefeuille", emoji: "👛", level: 2 },
    { en: "Ring", fr: "Bague", emoji: "💍", level: 2 },
    { en: "Bycicle", fr: "Gilet", emoji: "🦺", level: 2 }, // Vest
    { en: "Bathrobe", fr: "Peignoir", emoji: "🥋", level: 2 },
    { en: "Apron", fr: "Tablier", emoji: "🎽", level: 2 },
    { en: "Raincoat", fr: "Imperméable", emoji: "🧥", level: 2 },
    { en: "Necklace", fr: "Collier", emoji: "📿", level: 2 },
    { en: "Earrings", fr: "Boucles d'oreilles", emoji: "💎", level: 2 },

    // NIVEAU 3 (20 vêtements avancés/spécifiques - Débloqué au Niveau joueur 10)
    { en: "Tuxedo", fr: "Smoking", emoji: "🤵", level: 3 },
    { en: "Wedding dress", fr: "Robe de mariée", emoji: "👰", level: 3 },
    { en: "Overalls", fr: "Salopette", emoji: "👖", level: 3 },
    { en: "Hoodie", fr: "Sweat à capuche", emoji: "👕", level: 3 },
    { en: "Tracksuit", fr: "Survêtement", emoji: "🎽", level: 3 },
    { en: "Bow tie", fr: "Noeud papillon", emoji: "🎀", level: 3 },
    { en: "Cufflinks", fr: "Boutons de manchette", emoji: "💎", level: 3 },
    { en: "Beret", fr: "Béret", emoji: "👒", level: 3 },
    { en: "Beanie", fr: "Bonnet", emoji: "🧢", level: 3 },
    { en: "Mittens", fr: "Moufles", emoji: "🧤", level: 3 },
    { en: "Cloak", fr: "Cape", emoji: "🦸", level: 3 },
    { en: "Kimono", fr: "Kimono", emoji: "👘", level: 3 },
    { en: "Sari", fr: "Sari", emoji: "🥻", level: 3 },
    { en: "Turban", fr: "Turban", emoji: "👳", level: 3 },
    { en: "Veil", fr: "Voile", emoji: "👰", level: 3 },
    { en: "Handkerchief", fr: "Mouchoir", emoji: "⬜", level: 3 },
    { en: "Flip-flops", fr: "Tongs", emoji: "🩴", level: 3 },
    { en: "Uniform", fr: "Uniforme", emoji: "🥼", level: 3 },
    { en: "Brooch", fr: "Broche", emoji: "📌", level: 3 },
    { en: "Braces", fr: "Bretelles", emoji: "🎗️", level: 3 }
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
        localStorage.setItem('oe_unlocked_badges_cloth', JSON.stringify(unlockedBadges));
        triggerConfetti();
        if(typeof renderBadgesUI === 'function') renderBadgesUI();
    }
}

// --- MODULE AUDIO DE HAUTE PRÉCISION (CORRIGÉ) ---
let preferredVoice = null;

// Fonction de sélection de la meilleure voix disponible sur l'appareil
function initVoices() {
    if (!('speechSynthesis' in window)) return;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return; // Le navigateur n'est pas encore prêt

    // Stratégie de sélection en 3 étapes :
    // 1. On cherche une voix anglaise moderne (Google, Natural, Neural ou Premium)
    let bestVoice = voices.find(voice => 
        voice.lang.toLowerCase().startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Neural') || voice.name.includes('Premium'))
    );

    // 2. Si pas trouvé, on cherche une voix anglaise qui n'est PAS une vieille voix "Desktop" de Microsoft
    if (!bestVoice) {
        bestVoice = voices.find(voice => 
            voice.lang.toLowerCase().startsWith('en') && !voice.name.includes('Desktop')
        );
    }

    // 3. En dernier recours, on prend la première voix anglaise standard qui vient
    if (!bestVoice) {
        bestVoice = voices.find(voice => voice.lang.toLowerCase().startsWith('en'));
    }

    // On mémorise la voix pour éviter de refaire la recherche à chaque clic
    if (bestVoice) {
        preferredVoice = bestVoice;
    }
}

// Écouteur crucial : déclenché dès que le navigateur a fini de charger sa base de données vocales
if ('speechSynthesis' in window) {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = initVoices;
    }
    initVoices(); // Premier essai immédiat au cas où elles seraient déjà prêtes
}

function setAudioSpeed(speed) {
    audioSpeed = speed;
    const btnNormal = document.getElementById('speed-normal');
    const btnSlow = document.getElementById('speed-slow');
    if (btnNormal && btnSlow) {
        if (speed === 1.0) {
            btnNormal.className = "px-2 py-1 bg-brandBlue text-white rounded font-bold";
            btnSlow.className = "px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded flex items-center gap-1";
        } else {
            btnNormal.className = "px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-bold";
            btnSlow.className = "px-2 py-1 bg-brandBlue text-white rounded flex items-center gap-1";
        }
    }
}

function playAudio(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stoppe net toute lecture en cours
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = audioSpeed;

        // Si la voix n'a pas pu être choisie au démarrage, on fait une tentative de secours
        if (!preferredVoice) initVoices();

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);
    } else {
        // Fallback ultime si l'appareil ne supporte aucune synthèse vocale native
        const encodedText = encodeURIComponent(text.toLowerCase());
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;
        const audio = new Audio(audioUrl);
        audio.playbackRate = audioSpeed;
        audio.play().catch(e => console.log("Audio playback failed:", e));
    }
}


function playSoundEffect(type) {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    
    // Initialisation paresseuse au premier clic utilisateur
    if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Sort de la mise en veille si le navigateur avait bloqué le flux audio
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
        confetti.style.backgroundColor = ['#F58634', '#52B788', '#1C3D5A', '#FFD166'][Math.floor(Math.random() * 4)];
        confetti.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
        confetti.style.animationDelay = Math.random() * 1.2 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// --- CARNET DE RÉVISIONS ---
function registerError(fruitObj) {
    if (!errorHistory.some(f => f.en === fruitObj.en)) {
        errorHistory.push(fruitObj);
        localStorage.setItem('oe_error_history_cloth', JSON.stringify(errorHistory));
    }
}
function removeError(englishName) {
    errorHistory = errorHistory.filter(f => f.en !== englishName);
    localStorage.setItem('oe_error_history_cloth', JSON.stringify(errorHistory));
}

// --- GESTION DE LA PROGRESSION ---
function getUserPlayerLevel() {
    return Math.floor(totalPoints / 150) + 1;
}

// --- ADAPTATION DES TITRES (Mode & Style) ---
function updateLevelAndTitle() {
    const pLevel = getUserPlayerLevel();
    const levelEl = document.getElementById('user-level');
    const titleEl = document.getElementById('user-title');
    
    if (levelEl) levelEl.innerText = pLevel;

    let title = "Novice des Vêtements";
    if (pLevel >= 2) title = "Styliste en Herbe";
    if (pLevel >= 3) title = "Passionné de Mode";
    if (pLevel >= 5) {
        title = "Créateur de Tendances";
        checkAndUnlockBadge("polyglotte"); 
    }
    if (pLevel >= 10) title = "Maître de la Haute Couture";

    if (titleEl) titleEl.innerText = title;
    if (typeof updateLevelLockUI === 'function') updateLevelLockUI();
}

// --- MODULE DARK MODE (AJOUTÉ) ---
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('oe_dark_mode', isDark);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = isDark ? "fa-solid fa-sun text-yellow-300" : "fa-solid fa-moon text-yellow-300";
    }
}

// --- RÉINITIALISATION DES STATISTIQUES (AJOUTÉ) ---
function resetStats() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes vos statistiques et votre progression Mode ?")) {
        const keysToRemove = ['oe_total_points_cloth', 'oe_high_quiz_cloth', 'oe_high_speak_cloth', 'oe_high_timeattack_cloth', 'oe_max_streak_cloth', 'oe_fav_cloth', 'oe_error_history_cloth', 'oe_unlocked_badges_cloth'];
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
        alert("Statistiques Mode réinitialisées !");
    }
}

// --- PERSISTENCE ---
function saveStats() {
    localStorage.setItem('oe_total_points_cloth', totalPoints);
    localStorage.setItem('oe_high_quiz_cloth', highScores.quiz);
    localStorage.setItem('oe_high_speak_cloth', highScores.speak); 
    localStorage.setItem('oe_high_timeattack_cloth', highScores.timeattack);
    localStorage.setItem('oe_max_streak_cloth', maxStreak);
}

function loadStats() {
    totalPoints = parseInt(localStorage.getItem('oe_total_points_cloth')) || 0;
    highScores.quiz = parseInt(localStorage.getItem('oe_high_quiz_cloth')) || 0;
    highScores.speak = parseInt(localStorage.getItem('oe_high_speak_cloth')) || 0; 
    highScores.timeattack = parseInt(localStorage.getItem('oe_high_timeattack_cloth')) || 0;
    maxStreak = parseInt(localStorage.getItem('oe_max_streak_cloth')) || 0;
    favoriteFruits = JSON.parse(localStorage.getItem('oe_fav_cloth')) || [];
    errorHistory = JSON.parse(localStorage.getItem('oe_error_history_cloth')) || [];
    unlockedBadges = JSON.parse(localStorage.getItem('oe_unlocked_badges_cloth')) || [];
    
    if (localStorage.getItem('oe_dark_mode') === 'true') {
        document.documentElement.classList.add('dark');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.className = "fa-solid fa-sun text-yellow-300";
    }
    const totalPointsEl = document.getElementById('total-points');
    if (totalPointsEl) totalPointsEl.innerText = totalPoints;
    updateLevelAndTitle();
}