// --- VARIABLES LOCALES DE GESTION DES JEUX ---
let slideshowTimeout = null;
let isSlideshowActive = false;
let currentFlashIndex = 0;
let quizTimeout = null;  
let speakTimeout = null; 

let quizStep = 1, quizScore = 0, currentQuizItem = null;
let currentSpeakItem = null, speakScore = 0; 
let selectedEnglishNode = null, selectedFrenchNode = null;
let isProcessingMatch = false; 

let taTimerInterval = null;
let taTimeout = null;
let taTimeLeft = 60;
let taScore = 0;
let currentTAItem = null;

window.onload = () => {
    loadStats(); 
    
    document.getElementById('stat-high-quiz').innerText = highScores.quiz;
    document.getElementById('stat-high-speak').innerText = highScores.speak || 0;
    document.getElementById('stat-high-timeattack').innerText = highScores.timeattack || 0;
    document.getElementById('stat-max-streak').innerText = maxStreak;
    
    updateLevelLockUI();
    renderDict();
    updateFlashcard();
    renderBadgesUI();
    renderErrorHistory();
};

function setVocabLevel(level) {
    selectedVocabularyLevel = parseInt(level);
    
    document.querySelectorAll('#vocab-level-selector button').forEach(btn => {
        if (!btn.disabled) {
            btn.className = "p-3 rounded-xl font-extrabold text-xs bg-slate-900/60 text-slate-300 border border-slate-700 hover:border-brandPurple transition-all";
        }
    });
    
    const activeBtn = document.getElementById(`btn-vlevel-${level}`);
    activeBtn.className = "p-3 rounded-xl font-extrabold text-xs bg-brandPurple text-white shadow-md shadow-brandPurple/20 border border-brandPurple transition-all";
    
    renderDict();
    updateFlashcard();
    resetQuizToMenu();
}

function updateLevelLockUI() {
    const playerLevel = getUserPlayerLevel(); 
    const btn2 = document.getElementById('btn-vlevel-2');
    const btn3 = document.getElementById('btn-vlevel-3');
    const hint = document.getElementById('vocab-unlock-hint');

    if (!btn2 || !btn3 || !hint) return; 

    if (playerLevel >= 5) {
        btn2.disabled = false;
        btn2.innerHTML = "🔒 Débloqué ! Niv.2";
        if (selectedVocabularyLevel !== 2) {
            btn2.className = "p-3 rounded-xl font-extrabold text-xs bg-slate-900/60 text-slate-300 border border-slate-700 hover:border-brandPurple transition-all";
        }
    } else {
        btn2.disabled = true;
        btn2.innerHTML = '<i class="fa-solid fa-lock text-[10px]"></i> Niv.2 (40)';
        btn2.className = "p-3 rounded-xl font-extrabold text-xs bg-slate-900/30 text-slate-600 border border-slate-800/80 cursor-not-allowed flex items-center justify-center gap-1 transition-all";
        if (selectedVocabularyLevel === 2) selectedVocabularyLevel = 1; 
    }
    
    if (playerLevel >= 10) {
        btn3.disabled = false;
        btn3.innerHTML = "⚡ Élite ! Niv.3";
        if (selectedVocabularyLevel !== 3) {
            btn3.className = "p-3 rounded-xl font-extrabold text-xs bg-slate-900/60 text-slate-300 border border-slate-700 hover:border-brandPurple transition-all";
        }
    } else {
        btn3.disabled = true;
        btn3.innerHTML = '<i class="fa-solid fa-lock text-[10px]"></i> Niv.3 (60)';
        btn3.className = "p-3 rounded-xl font-extrabold text-xs bg-slate-900/30 text-slate-600 border border-slate-800/80 cursor-not-allowed flex items-center justify-center gap-1 transition-all";
        if (selectedVocabularyLevel === 3) selectedVocabularyLevel = 1; 
    }

    if (playerLevel >= 10) {
        hint.innerHTML = "🎉 <span class='text-brandGreen font-bold'>GG ! Tout le pack émotionnel est débloqué !</span>";
    } else if (playerLevel >= 5) {
        hint.innerText = "🚀 Objectif : Atteins le niveau de compte 10 pour le pack Ultime !";
    } else {
        hint.innerText = "🔒 Bloqué : Passe niveau 5 pour le Pack Intermédiaire (Niv.2)";
    }
}

function switchTab(event, tabName) {
    stopSlideshow();
    stopTimeAttack();
    
    if (quizTimeout) clearTimeout(quizTimeout);
    if (speakTimeout) clearTimeout(speakTimeout);
    
    resetQuizToMenu();

    document.querySelectorAll('.tab-content').forEach(el => { el.classList.add('hidden'); el.classList.remove('active'); });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-slate-700 hover:text-white";
    });

    const targetTab = document.getElementById(`tab-${tabName}`);
    targetTab.classList.remove('hidden'); targetTab.classList.add('active');
    event.currentTarget.className = "tab-btn bg-brandPurple text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brandPurple/20 hover:scale-105 active:scale-95";

    document.getElementById('autoplay-container').className = tabName === 'flash' ? "flex items-center gap-2" : "hidden";

    if (tabName === 'speak') initSpeak();
    if (tabName === 'match') initMatching();
    if (tabName === 'stats') {
        renderBadgesUI();
        renderErrorHistory();
    }
}

function processAnswerResult(isCorrect) {
    if (isCorrect) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        playSoundEffect('success');
        totalPoints += 10;
        document.getElementById('total-points').innerText = totalPoints;
        updateLevelAndTitle();
        if (currentStreak >= 15) checkAndUnlockBadge("streak_15");
    } else {
        currentStreak = 0;
        playSoundEffect('fail');
    }
    document.getElementById('streak-count').innerText = currentStreak;
    document.getElementById('stat-max-streak').innerText = maxStreak;
    saveStats();
}

function toggleDirectionDico() {
    searchDirection = (searchDirection === 'EN_FR') ? 'FR_EN' : 'EN_FR';
    document.getElementById('direction-label').innerText = (searchDirection === 'EN_FR') ? 'FR ➔ EN' : 'EN ➔ FR';
    document.getElementById('search-input').placeholder = (searchDirection === 'EN_FR') ? 'Rechercher un sentiment...' : 'Search for a feeling...';
    filterWords();
}

function renderDict(data = null) {
    const container = document.getElementById('dict-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (data === null) {
        data = fruitsData.filter(f => f.level === selectedVocabularyLevel);
    }

    if(data.length === 0) {
        container.innerHTML = `<p class="text-center text-sm py-8 text-slate-500 font-bold italic">Aucun sentiment trouvé avec ces filtres.</p>`;
        return;
    }

    data.forEach(item => {
        const isFav = favoriteFruits.includes(item.en);
        const div = document.createElement('div');
        div.className = "bg-slate-800 border border-slate-700/60 p-4 rounded-2xl shadow-md flex justify-between items-center cursor-pointer hover:border-brandPurple/60 hover:bg-slate-700/50 transition-all duration-200 group";
        div.onclick = () => playAudio(item.en);
        
        const primaryText = (searchDirection === 'EN_FR') ? item.en : item.fr;
        const secondaryText = (searchDirection === 'EN_FR') ? item.fr : item.en;

        div.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-4xl group-hover:scale-110 transition-transform duration-200">${item.emoji}</span>
                <div>
                    <p class="font-extrabold text-base text-slate-100">${primaryText}</p>
                    <p class="text-xs text-slate-400 font-medium font-mono">${secondaryText}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="toggleFavorite('${item.en}', event)" class="p-2 text-xl transition-all text-slate-600 hover:text-amber-400">
                    <i class="${isFav ? 'fa-solid text-amber-400' : 'fa-regular'} fa-star"></i>
                </button>
                <span class="text-brandPurple bg-brandPurple/10 border border-brandPurple/20 rounded-xl p-2.5 text-base shadow-sm group-hover:bg-brandPurple group-hover:text-white transition-all"><i class="fa-solid fa-volume-high"></i></span>
            </div>
        `;
        container.appendChild(div);
    });
}

function filterWords() {
    const query = document.getElementById('search-input').value.toLowerCase();
    let sourceData = fruitsData.filter(f => f.level === selectedVocabularyLevel);
    if(filterOnlyFavs) {
        sourceData = sourceData.filter(f => favoriteFruits.includes(f.en));
    }
    const filtered = sourceData.filter(f => f.en.toLowerCase().includes(query) || f.fr.toLowerCase().includes(query));
    renderDict(filtered);
}

function toggleFavorite(englishName, event) {
    if(event) event.stopPropagation();
    const index = favoriteFruits.indexOf(englishName);
    if (index > -1) favoriteFruits.splice(index, 1);
    else favoriteFruits.push(englishName);
    localStorage.setItem('oe_fav_feel', JSON.stringify(favoriteFruits)); 
    filterWords();
}

function toggleFavFilter() {
    filterOnlyFavs = !filterOnlyFavs;
    document.getElementById('fav-filter-btn').className = filterOnlyFavs 
        ? "px-4 bg-amber-400 border-2 border-amber-400 text-slate-950 rounded-2xl transition shadow-lg shadow-amber-400/20"
        : "px-4 bg-slate-800 border-2 border-slate-700/80 rounded-2xl text-slate-500 hover:text-amber-400 hover:border-amber-400/50 transition-all shadow-sm";
    filterWords();
}

function updateFlashcard() {
    const card = document.getElementById('main-flashcard');
    if (!card) return;
    card.classList.remove('flipped');
    
    const activeLevelWords = fruitsData.filter(f => f.level === selectedVocabularyLevel);
    if(activeLevelWords.length === 0) return;
    
    if (currentFlashIndex >= activeLevelWords.length) currentFlashIndex = 0;

    setTimeout(() => {
        const item = activeLevelWords[currentFlashIndex];
        document.getElementById('flash-emoji').innerText = item.emoji;
        document.getElementById('flash-en').innerText = item.en;
        document.getElementById('flash-fr').innerText = item.fr;
        if(document.getElementById('autoplay-checkbox').checked && !isSlideshowActive) playAudio(item.en);
    }, 150);
}

function nextFlashcard() { 
    const maxLen = fruitsData.filter(f => f.level === selectedVocabularyLevel).length;
    currentFlashIndex = (currentFlashIndex + 1) % maxLen; 
    updateFlashcard(); 
}
function prevFlashcard() { 
    const maxLen = fruitsData.filter(f => f.level === selectedVocabularyLevel).length;
    currentFlashIndex = (currentFlashIndex - 1 + maxLen) % maxLen; 
    updateFlashcard(); 
}

function toggleSlideshow() { if (isSlideshowActive) stopSlideshow(); else startSlideshow(); }
function startSlideshow() {
    isSlideshowActive = true;
    document.getElementById('slideshow-btn').className = "bg-brandPink text-white px-5 py-2.5 rounded-2xl text-sm font-extrabold shadow-lg shadow-brandPink/30 transition-all hover:scale-105 active:scale-95 border border-brandPink";
    document.getElementById('slideshow-btn').innerHTML = `<i class="fa-solid fa-square mr-1.5"></i> Stop Diaporama`;
    document.getElementById('flash-prev-btn').disabled = true;
    document.getElementById('flash-next-btn').disabled = true;
    document.getElementById('flash-prev-btn').classList.add('opacity-30');
    document.getElementById('flash-next-btn').classList.add('opacity-30');
    runSlideshowLoop();
}

function stopSlideshow() {
    isSlideshowActive = false;
    clearTimeout(slideshowTimeout);
    const btn = document.getElementById('slideshow-btn');
    if (btn) {
        btn.className = "bg-brandGreen text-slate-950 px-5 py-2.5 rounded-2xl text-sm font-extrabold shadow-lg shadow-brandGreen/20 transition-all hover:scale-105 active:scale-95";
        btn.innerHTML = `<i class="fa-solid fa-play mr-1.5"></i> Lancer le Mode Diaporama`;
    }
    const pB = document.getElementById('flash-prev-btn');
    if(pB) {
        pB.disabled = false; pB.classList.remove('opacity-30');
        document.getElementById('flash-next-btn').disabled = false; document.getElementById('flash-next-btn').classList.remove('opacity-30');
    }
    const card = document.getElementById('main-flashcard');
    if (card) card.classList.remove('flipped');
}

function runSlideshowLoop() {
    if (!isSlideshowActive) return;
    const activeLevelWords = fruitsData.filter(f => f.level === selectedVocabularyLevel);
    const card = document.getElementById('main-flashcard');
    card.classList.remove('flipped');
    playAudio(activeLevelWords[currentFlashIndex].en);

    slideshowTimeout = setTimeout(() => {
        if (!isSlideshowActive) return;
        card.classList.add('flipped');
        slideshowTimeout = setTimeout(() => {
            if (!isSlideshowActive) return;
            currentFlashIndex = (currentFlashIndex + 1) % activeLevelWords.length;
            updateFlashcard();
            runSlideshowLoop();
        }, 3200);
    }, 2500);
}

function resetQuizToMenu() {
    document.getElementById('quiz-mode-menu').classList.remove('hidden');
    document.getElementById('quiz-classic-zone').classList.add('hidden');
    document.getElementById('quiz-timeattack-zone').classList.add('hidden');
}

function launchStandardQuiz() {
    document.getElementById('quiz-mode-menu').classList.add('hidden');
    document.getElementById('quiz-classic-zone').classList.remove('hidden');
    quizStep = 1; quizScore = 0; 
    document.getElementById('quiz-score').innerText = quizScore; 
    generateQuizQuestion();
}

function generateQuizQuestion() {
    if (quizStep > 10) {
        if (quizScore > highScores.quiz) { highScores.quiz = quizScore; saveStats(); }
        if (quizScore === 10) {
            triggerConfetti();
            checkAndUnlockBadge("first_perfect"); 
        }
        alert(`🏆 Quiz terminé ! Score final : ${quizScore}/10.`);
        document.getElementById('stat-high-quiz').innerText = highScores.quiz;
        resetQuizToMenu();
        return;
    }
    document.getElementById('quiz-current').innerText = quizStep;
    
    currentQuizItem = getNextExerciseWord(); 
    document.getElementById('quiz-question').innerText = currentQuizItem.en;

    const activePack = fruitsData.filter(f => f.level === selectedVocabularyLevel);
    let choices = [currentQuizItem.fr];
    while (choices.length < Math.min(4, activePack.length)) {
        let randomFr = activePack[Math.floor(Math.random() * activePack.length)].fr;
        if (!choices.includes(randomFr)) choices.push(randomFr);
    }
    choices.sort(() => Math.random() - 0.5);

    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "w-full bg-slate-800 border-2 border-slate-700/80 text-slate-100 p-4 rounded-2xl font-bold text-left transition-all hover:border-brandPurple hover:bg-slate-700/40";
        btn.innerText = choice;
        btn.onclick = () => checkQuizAnswer(btn, choice);
        container.appendChild(btn);
    });
}

function checkQuizAnswer(button, selected) {
    document.querySelectorAll('#quiz-options button').forEach(b => b.disabled = true);
    if (selected === currentQuizItem.fr) {
        button.className = "w-full bg-brandGreen text-slate-950 border border-brandGreen p-4 rounded-2xl font-extrabold text-left transition-all shadow-lg shadow-brandGreen/20";
        quizScore++;
        document.getElementById('quiz-score').innerText = quizScore;
        removeError(currentQuizItem.en); 
        processAnswerResult(true);
    } else {
        button.className = "w-full bg-brandPink text-white border border-brandPink p-4 rounded-2xl font-extrabold text-left transition-all shadow-lg shadow-brandPink/20";
        registerError(currentQuizItem); 
        processAnswerResult(false);
        document.querySelectorAll('#quiz-options button').forEach(b => {
            if(b.innerText === currentQuizItem.fr) b.className = "w-full bg-brandGreen text-slate-950 border border-brandGreen p-4 rounded-2xl font-extrabold text-left transition-all";
        });
    }
    quizTimeout = setTimeout(() => { quizStep++; generateQuizQuestion(); }, 1400);
}

function launchTimeAttack() {
    document.getElementById('quiz-mode-menu').classList.add('hidden');
    document.getElementById('quiz-timeattack-zone').classList.remove('hidden');
    
    taScore = 0;
    taTimeLeft = 60;
    document.getElementById('ta-score').innerText = taScore;
    document.getElementById('ta-timer').innerText = taTimeLeft;
    
    generateTAQuestion();

    clearInterval(taTimerInterval);
    taTimerInterval = setInterval(() => {
        taTimeLeft--;
        document.getElementById('ta-timer').innerText = taTimeLeft;
        if (taTimeLeft <= 0) {
            stopTimeAttack(true); 
        }
    }, 1000);
}

function generateTAQuestion() {
    currentTAItem = getNextExerciseWord(); 
    document.getElementById('ta-question').innerText = currentTAItem.en;

    const activePack = fruitsData.filter(f => f.level === selectedVocabularyLevel);
    let choices = [currentTAItem.fr];
    while (choices.length < Math.min(4, activePack.length)) {
        let randomFr = activePack[Math.floor(Math.random() * activePack.length)].fr;
        if (!choices.includes(randomFr)) choices.push(randomFr);
    }
    choices.sort(() => Math.random() - 0.5);

    const container = document.getElementById('ta-options');
    container.innerHTML = '';
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "w-full bg-slate-800 border-2 border-slate-700/80 text-slate-100 p-4 rounded-2xl font-bold text-left transition-all hover:border-brandPink hover:bg-slate-700/40";
        btn.innerText = choice;
        btn.onclick = () => checkTAAnswer(btn, choice);
        container.appendChild(btn);
    });
}

function checkTAAnswer(button, selected) {
    document.querySelectorAll('#ta-options button').forEach(b => b.disabled = true);
    
    if (selected === currentTAItem.fr) {
        taScore++;
        document.getElementById('ta-score').innerText = taScore;
        removeError(currentTAItem.en);
        processAnswerResult(true);
        generateTAQuestion(); 
    } else {
        button.className = "w-full bg-brandPink text-white border border-brandPink p-4 rounded-2xl font-extrabold text-left transition-all";
        registerError(currentTAItem);
        processAnswerResult(false);
        taTimeout = setTimeout(() => { generateTAQuestion(); }, 500);
    }
}

function stopTimeAttack(isFinishedFinished = false) {
    clearInterval(taTimerInterval);
    if (taTimeout) clearTimeout(taTimeout); 
    
    if (isFinishedFinished) {
        alert(`⏱️ Fin du Chrono ! Score : ${taScore} bonnes réponses !`);
        
        if (taScore >= 20) {
            checkAndUnlockBadge("time_20");
        }

        if (taScore > highScores.timeattack) {
            highScores.timeattack = taScore;
            document.getElementById('stat-high-timeattack').innerText = taScore;
            saveStats();
        }
        resetQuizToMenu();
    }
}

function initSpeak() {
    speakScore = 0;
    document.getElementById('speak-score').innerText = speakScore;
    generateSpeakQuestion();
}

function generateSpeakQuestion() {
    currentSpeakItem = getNextExerciseWord(); 
    
    document.getElementById('speak-emoji').innerText = currentSpeakItem.emoji;
    document.getElementById('speak-prompt-fr').innerText = currentSpeakItem.fr;
    
    const resultBox = document.getElementById('speech-result');
    resultBox.className = "hidden text-base font-bold p-4 rounded-2xl border transition-all duration-300";
    document.getElementById('speech-status').innerText = "Clique sur le micro rouge pour parler";
    document.getElementById('mic-pulse').classList.add('hidden');
}

function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Microphone non disponible sur ce navigateur. Utilise Chrome ou Safari.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const pulse = document.getElementById('mic-pulse');
    const statusText = document.getElementById('speech-status');
    const resultBox = document.getElementById('speech-result');

    pulse.classList.remove('hidden');
    statusText.innerText = "🎙️ Écoute active... Parle maintenant !";
    resultBox.className = "hidden text-base font-bold p-4 rounded-2xl border transition-all duration-300";

    recognition.start();

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim().toLowerCase();
        const targetWord = currentSpeakItem.en.toLowerCase();
        
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `Reconnu : <span class="text-white font-mono bg-black/30 px-2 py-1 rounded border border-slate-700">"${speechResult}"</span>`;

        if (speechResult === targetWord) {
            resultBox.classList.add('bg-brandGreen/20', 'text-brandGreen', 'border-brandGreen/30');
            statusText.innerHTML = "🎯 <span class='text-brandGreen font-bold'>Parfait ! +10 XP</span>";
            
            speakScore++;
            document.getElementById('speak-score').innerText = speakScore;
            
            if (speakScore > highScores.speak) {
                highScores.speak = speakScore;
                document.getElementById('stat-high-speak').innerText = speakScore;
                saveStats();
            }

            removeError(currentSpeakItem.en); 
            processAnswerResult(true);
            speakTimeout = setTimeout(() => generateSpeakQuestion(), 2000);

        } else {
            resultBox.classList.add('bg-brandPink/20', 'text-brandPink', 'border-brandPink/30');
            statusText.innerText = "Essaye encore ! Focalise sur la bonne prononciation.";
            
            registerError(currentSpeakItem); 
            processAnswerResult(false);
        }
    };

    recognition.onspeechend = () => {
        recognition.stop();
        pulse.classList.add('hidden');
    };

    recognition.onerror = () => {
        pulse.classList.add('hidden');
        statusText.innerText = "Zut ! Aucun son détecté. Recommence.";
    };
}

function initMatching() {
    isProcessingMatch = false; 
    const grid = document.getElementById('matching-grid'); 
    if(!grid) return;
    grid.innerHTML = '';
    
    const activePack = fruitsData.filter(f => f.level === selectedVocabularyLevel);
    let shuffled = [...activePack].sort(() => Math.random() - 0.5).slice(0, 4);
    
    let englishCards = shuffled.map(f => ({ text: f.en, type: 'en', id: f.en }));
    let frenchCards = shuffled.map(f => ({ text: f.fr, type: 'fr', id: f.en }));
    englishCards.sort(() => Math.random() - 0.5); 
    frenchCards.sort(() => Math.random() - 0.5);

    const mergedCards = [];
    for(let i=0; i < 4; i++) {
        mergedCards.push(englishCards[i]);
        mergedCards.push(frenchCards[i]);
    }
    // Mélange total de la grille pour le côté puzzle addictif
    mergedCards.sort(() => Math.random() - 0.5);

    mergedCards.forEach(card => {
        const btn = document.createElement('button');
        if (card.type === 'en') {
            btn.className = "bg-slate-800 border-2 border-brandPurple text-brandPurple p-4 rounded-2xl font-black transition-all text-center text-xs sm:text-sm hover:bg-brandPurple/10 shadow-md";
        } else {
            btn.className = "bg-slate-800 border-2 border-brandPink text-brandPink p-4 rounded-2xl font-black transition-all text-center text-xs sm:text-sm hover:bg-brandPink/10 shadow-md";
        }
        btn.innerText = card.text;
        btn.onclick = () => { 
            btn.dataset.id = card.id; 
            btn.dataset.type = card.type; 
            handleMatchSelect(btn); 
        };
        grid.appendChild(btn);
    });
}

function handleMatchSelect(node) {
    if (isProcessingMatch) return;

    if (node.dataset.type === 'en') {
        if (selectedEnglishNode) selectedEnglishNode.classList.remove('bg-brandPurple/30', 'scale-105');
        selectedEnglishNode = node; 
        selectedEnglishNode.classList.add('bg-brandPurple/30', 'scale-105');
    } else {
        if (selectedFrenchNode) selectedFrenchNode.classList.remove('bg-brandPink/30', 'scale-105');
        selectedFrenchNode = node; 
        selectedFrenchNode.classList.add('bg-brandPink/30', 'scale-105');
    }

    if (selectedEnglishNode && selectedFrenchNode) {
        if (selectedEnglishNode.dataset.id === selectedFrenchNode.dataset.id) {
            selectedEnglishNode.className = "bg-brandGreen text-slate-950 border border-brandGreen p-4 rounded-2xl font-black text-center pointer-events-none transition-all text-xs sm:text-sm matched-card shadow-lg shadow-brandGreen/20";
            selectedFrenchNode.className = "bg-brandGreen text-slate-950 border border-brandGreen p-4 rounded-2xl font-black text-center pointer-events-none transition-all text-xs sm:text-sm matched-card shadow-lg shadow-brandGreen/20";
            removeError(selectedEnglishNode.dataset.id);
            processAnswerResult(true);
            selectedEnglishNode = null; selectedFrenchNode = null;

            const totalMatched = document.querySelectorAll('.matched-card').length;
            if (totalMatched === 8) {
                setTimeout(() => {
                    triggerConfetti();
                    alert("🎉 Incroyable ! Grille complétée avec succès !");
                    initMatching(); 
                }, 500);
            }
        } else {
            isProcessingMatch = true; 
            const eNode = selectedEnglishNode, fNode = selectedFrenchNode;
            eNode.className = "bg-brandPink text-white border border-brandPink p-4 rounded-2xl font-black text-center transition-all text-xs sm:text-sm shadow-lg shadow-brandPink/20 animate-shake";
            fNode.className = "bg-brandPink text-white border border-brandPink p-4 rounded-2xl font-black text-center transition-all text-xs sm:text-sm shadow-lg shadow-brandPink/20 animate-shake";
            
            const failFruit = fruitsData.find(f => f.en === eNode.dataset.id);
            if(failFruit) registerError(failFruit);
            
            processAnswerResult(false);
            setTimeout(() => {
                eNode.className = "bg-slate-800 border-2 border-brandPurple text-brandPurple p-4 rounded-2xl font-black transition-all text-center text-xs sm:text-sm hover:bg-brandPurple/10";
                fNode.className = "bg-slate-800 border-2 border-brandPink text-brandPink p-4 rounded-2xl font-black transition-all text-center text-xs sm:text-sm hover:bg-brandPink/10";
                isProcessingMatch = false; 
            }, 900);
            selectedEnglishNode = null; selectedFrenchNode = null;
        }
    }
}

function renderBadgesUI() {
    const container = document.getElementById('badges-list');
    if(!container) return;
    container.innerHTML = '';
    
    badgesDatabase.forEach(badge => {
        const isUnlocked = unlockedBadges.includes(badge.id);
        const div = document.createElement('div');
        div.className = `p-4 rounded-2xl border transition-all ${isUnlocked ? 'bg-slate-900 border-slate-700/80 opacity-100 shadow-xl' : 'bg-slate-950/40 border-slate-800/80 opacity-40 select-none'}`;
        
        div.innerHTML = `
            <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isUnlocked ? badge.color + ' text-white shadow-lg' : 'bg-slate-800 text-slate-600'}">
                    ${badge.icon}
                </div>
                <div class="text-left flex-grow">
                    <h4 class="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                        ${badge.title} 
                        ${isUnlocked ? '<i class="fa-solid fa-circle-check text-brandGreen text-xs"></i>' : ''}
                    </h4>
                    <p class="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">${badge.desc}</p>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderErrorHistory() {
    const container = document.getElementById('error-history-list');
    if (!container) return;
    container.innerHTML = '';

    if (errorHistory.length === 0) {
        container.innerHTML = `<p class="text-slate-500 italic text-center text-xs py-6 font-bold">✨ Aucune erreur en cours, tu gères grave !</p>`;
        return;
    }

    errorHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold shadow-inner";
        div.innerHTML = `
            <div class="flex items-center gap-2.5">
                <span class="text-lg">${item.emoji}</span>
                <span class="font-black text-brandPink">${item.en}</span>
                <span class="text-slate-400 font-normal">(${item.fr})</span>
            </div>
            <button onclick="clearWordFromRevision('${item.en}')" class="text-brandGreen bg-brandGreen/10 border border-brandGreen/20 px-2 py-1 rounded-lg font-bold hover:bg-brandGreen hover:text-slate-950 transition-all text-[11px]">
                <i class="fa-solid fa-check"></i> Acquis
            </button>
        `;
        container.appendChild(div);
    });
}

function clearWordFromRevision(englishName) {
    removeError(englishName);
    renderErrorHistory();
}