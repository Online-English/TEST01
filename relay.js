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
            btn.className = "p-2.5 rounded-xl font-black text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-gray-200 border border-transparent transition hover:border-brandPurple";
        }
    });
    
    const activeBtn = document.getElementById(`btn-vlevel-${level}`);
    activeBtn.className = "p-2.5 rounded-xl font-black text-xs bg-brandPurple text-white border-b-4 border-indigo-700 transition";
    
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
        btn2.innerHTML = "⚡ Niveau 2 (40)";
        if (selectedVocabularyLevel !== 2) {
            btn2.className = "p-2.5 rounded-xl font-black text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-gray-200 border border-transparent transition hover:border-brandPurple";
        }
    } else {
        btn2.disabled = true;
        btn2.innerHTML = '<i class="fa-solid fa-lock text-[10px]"></i>🔒 Niveau 2';
        btn2.className = "p-2.5 rounded-xl font-black text-xs bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border cursor-not-allowed flex items-center justify-center gap-1 transition opacity-60";
        if (selectedVocabularyLevel === 2) selectedVocabularyLevel = 1; 
    }
    
    if (playerLevel >= 10) {
        btn3.disabled = false;
        btn3.innerHTML = "👑 Niveau 3 (60)";
        if (selectedVocabularyLevel !== 3) {
            btn3.className = "p-2.5 rounded-xl font-black text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-gray-200 border border-transparent transition hover:border-brandPurple";
        }
    } else {
        btn3.disabled = true;
        btn3.innerHTML = '<i class="fa-solid fa-lock text-[10px]"></i>🔒 Niveau 3';
        btn3.className = "p-2.5 rounded-xl font-black text-xs bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border cursor-not-allowed flex items-center justify-center gap-1 transition opacity-60";
        if (selectedVocabularyLevel === 3) selectedVocabularyLevel = 1; 
    }

    if (playerLevel >= 10) {
        hint.innerHTML = "🔥 <span class='text-brandGreen font-black'>INCROYABLE !</span> Tu as débloqué toutes les arènes de jeu !";
    } else if (playerLevel >= 5) {
        hint.innerText = "Objectif : Atteins le niveau joueur 10 pour débloquer le Niveau Ultime (3) !";
    } else {
        hint.innerText = "Astuce : Atteins le niveau joueur 5 pour débloquer la liste Niveau 2 !";
    }
    if (selectedVocabularyLevel === 1) {
        const btn1 = document.getElementById('btn-vlevel-1');
        if (btn1) btn1.className = "p-2.5 rounded-xl font-black text-xs bg-brandPurple text-white border-b-4 border-indigo-700 transition";
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
        btn.className = "tab-btn bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm transition hover:bg-slate-200";
    });

    const targetTab = document.getElementById(`tab-${tabName}`);
    targetTab.classList.remove('hidden'); targetTab.classList.add('active');
    event.currentTarget.className = "tab-btn bg-brandPurple text-white px-5 py-2.5 rounded-xl font-black text-sm transition shadow-md";

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
    document.getElementById('search-input').placeholder = (searchDirection === 'EN_FR') ? 'Rechercher un vêtement...' : 'Search for a clothing item...';
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
        container.innerHTML = `<p class="text-center text-sm py-4 text-slate-400 font-bold">Aucun vêtement trouvé dans cette zone.</p>`;
        return;
    }

    data.forEach(item => {
        const isFav = favoriteFruits.includes(item.en);
        const div = document.createElement('div');
        div.className = "pop-card bg-white dark:bg-slate-800 p-3.5 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer active:scale-95 transition-all duration-150";
        div.onclick = () => playAudio(item.en);
        
        const primaryText = (searchDirection === 'EN_FR') ? item.en : item.fr;
        const secondaryText = (searchDirection === 'EN_FR') ? item.fr : item.en;

        div.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-4xl drop-shadow-sm">${item.emoji}</span>
                <div>
                    <p class="font-black text-sm sm:text-base text-brandPurple dark:text-white tracking-wide">${primaryText}</p>
                    <p class="text-xs font-bold text-slate-400 dark:text-slate-400">${secondaryText}</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="toggleFavorite('${item.en}', event)" class="p-2 text-base sm:text-xl transition text-slate-300 dark:text-slate-600 hover:text-yellow-400">
                    <i class="${isFav ? 'fa-solid text-yellow-400' : 'fa-regular'} fa-star"></i>
                </button>
                <span class="text-brandPurple dark:text-indigo-400 p-2 text-base sm:text-lg"><i class="fa-solid fa-volume-high"></i></span>
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
    localStorage.setItem('oe_fav_cloth', JSON.stringify(favoriteFruits)); 
    filterWords();
}

function toggleFavFilter() {
    filterOnlyFavs = !filterOnlyFavs;
    document.getElementById('fav-filter-btn').className = filterOnlyFavs 
        ? "px-4 bg-yellow-400 text-white border-2 border-yellow-400 rounded-2xl transition shadow-md"
        : "px-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-300 hover:text-yellow-400 transition shadow-sm";
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
    document.getElementById('slideshow-btn').className = "bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow transition active:scale-95";
    document.getElementById('slideshow-btn').innerHTML = `<i class="fa-solid fa-square mr-1.5"></i> Arrêter le Diaporama`;
    document.getElementById('flash-prev-btn').disabled = true;
    document.getElementById('flash-next-btn').disabled = true;
    document.getElementById('flash-prev-btn').classList.add('opacity-40');
    document.getElementById('flash-next-btn').classList.add('opacity-40');
    runSlideshowLoop();
}

function stopSlideshow() {
    isSlideshowActive = false;
    clearTimeout(slideshowTimeout);
    const btn = document.getElementById('slideshow-btn');
    if (btn) {
        btn.className = "bg-brandGreen text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md border-b-4 border-emerald-600 transition active:scale-95";
        btn.innerHTML = `<i class="fa-solid fa-play mr-1.5"></i> Mode Diaporama`;
    }
    const pB = document.getElementById('flash-prev-btn');
    if(pB) {
        pB.disabled = false; pB.classList.remove('opacity-40');
        document.getElementById('flash-next-btn').disabled = false; document.getElementById('flash-next-btn').classList.remove('opacity-40');
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
        }, 3000);
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
        btn.className = "w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white p-3.5 rounded-2xl font-bold text-left transition shadow-sm hover:border-brandPurple active:scale-[0.99]";
        btn.innerText = choice;
        btn.onclick = () => checkQuizAnswer(btn, choice);
        container.appendChild(btn);
    });
}

function checkQuizAnswer(button, selected) {
    document.querySelectorAll('#quiz-options button').forEach(b => b.disabled = true);
    if (selected === currentQuizItem.fr) {
        button.className = "w-full bg-brandGreen border-b-4 border-emerald-600 text-white p-3.5 rounded-2xl font-black text-left transition";
        quizScore++;
        document.getElementById('quiz-score').innerText = quizScore;
        removeError(currentQuizItem.en); 
        processAnswerResult(true);
    } else {
        button.className = "w-full bg-rose-500 border-b-4 border-rose-700 text-white p-3.5 rounded-2xl font-black text-left transition";
        registerError(currentQuizItem); 
        processAnswerResult(false);
        document.querySelectorAll('#quiz-options button').forEach(b => {
            if(b.innerText === currentQuizItem.fr) b.className = "w-full bg-brandGreen border-b-4 border-emerald-600 text-white p-3.5 rounded-2xl font-black text-left transition";
        });
    }
    quizTimeout = setTimeout(() => { quizStep++; generateQuizQuestion(); }, 1200);
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
        btn.className = "w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white p-3.5 rounded-2xl font-bold text-left shadow-sm transition hover:border-brandPink active:scale-[0.99]";
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
        button.className = "w-full bg-rose-500 border-b-4 border-rose-700 text-white p-3.5 rounded-2xl font-black text-left transition";
        registerError(currentTAItem);
        processAnswerResult(false);
        taTimeout = setTimeout(() => { generateTAQuestion(); }, 400);
    }
}

function stopTimeAttack(isFinishedFinished = false) {
    clearInterval(taTimerInterval);
    if (taTimeout) clearTimeout(taTimeout); 
    
    if (isFinishedFinished) {
        alert(`🏁 Fin du Chrono ! Tu as validé ${taScore} mots !`);
        
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
    resultBox.className = "hidden text-sm font-bold p-3 rounded-xl border";
    document.getElementById('speech-status').innerText = "Clique sur le micro pour parler";
    document.getElementById('mic-pulse').classList.add('hidden');
}

function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("La reconnaissance vocale n'est pas supportée par ton navigateur. Utilise Chrome ou Safari.");
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
    statusText.innerText = "ÉCOUTE ACTIVE... PARLE MAINTENANT !";
    resultBox.className = "hidden text-sm font-bold p-3 rounded-xl border";

    recognition.start();

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim().toLowerCase();
        const targetWord = currentSpeakItem.en.toLowerCase();
        
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `Tu as dit : <span class="italic font-black text-base">"${speechResult}"</span>`;

        if (speechResult === targetWord) {
            resultBox.className = "text-sm font-bold p-3 rounded-xl border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
            statusText.innerText = "EXCELLENTE PRONONCIATION ! +10 XP 🌟";
            
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
            resultBox.className = "text-sm font-bold p-3 rounded-xl border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40";
            statusText.innerText = "ESSAYE ENCORE ! (Vérifie le mot attendu)";
            
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
        statusText.innerText = "Le micro n'a rien détecté. Réessaye.";
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

    for(let i=0; i < englishCards.length; i++) {
        const btnEn = document.createElement('button');
        btnEn.className = "bg-white dark:bg-slate-800 border-2 border-brandPurple text-brandPurple dark:text-indigo-400 p-3.5 rounded-2xl font-black transition text-center text-xs sm:text-sm shadow-sm active:scale-95";
        btnEn.innerText = englishCards[i].text; btnEn.onclick = () => { btnEn.dataset.id = englishCards[i].id; btnEn.dataset.type = 'en'; handleMatchSelect(btnEn); };

        const btnFr = document.createElement('button');
        btnFr.className = "bg-white dark:bg-slate-800 border-2 border-brandPink text-brandPink p-3.5 rounded-2xl font-black transition text-center text-xs sm:text-sm shadow-sm active:scale-95";
        btnFr.innerText = frenchCards[i].text; btnFr.onclick = () => { btnFr.dataset.id = frenchCards[i].id; btnFr.dataset.type = 'fr'; handleMatchSelect(btnFr); };

        grid.appendChild(btnEn); grid.appendChild(btnFr);
    }
}

function handleMatchSelect(node) {
    if (isProcessingMatch) return;

    if (node.dataset.type === 'en') {
        if (selectedEnglishNode) selectedEnglishNode.classList.remove('bg-indigo-100', 'dark:bg-indigo-950');
        selectedEnglishNode = node; selectedEnglishNode.classList.add('bg-indigo-100', 'dark:bg-indigo-950');
    } else {
        if (selectedFrenchNode) selectedFrenchNode.classList.remove('bg-rose-100', 'dark:bg-rose-950');
        selectedFrenchNode = node; selectedFrenchNode.classList.add('bg-rose-100', 'dark:bg-rose-950');
    }

    if (selectedEnglishNode && selectedFrenchNode) {
        if (selectedEnglishNode.dataset.id === selectedFrenchNode.dataset.id) {
            selectedEnglishNode.className = "bg-brandGreen border-b-4 border-emerald-600 text-white p-3.5 rounded-2xl font-black text-center pointer-events-none transition text-xs sm:text-sm matched-card";
            selectedFrenchNode.className = "bg-brandGreen border-b-4 border-emerald-600 text-white p-3.5 rounded-2xl font-black text-center pointer-events-none transition text-xs sm:text-sm matched-card";
            removeError(selectedEnglishNode.dataset.id);
            processAnswerResult(true);
            selectedEnglishNode = null; selectedFrenchNode = null;

            const totalMatched = document.querySelectorAll('.matched-card').length;
            if (totalMatched === 8) {
                setTimeout(() => {
                    triggerConfetti();
                    alert("🎉 Incroyable ! Tu as complété la grille de paires !");
                    initMatching(); 
                }, 500);
            }
        } else {
            isProcessingMatch = true; 
            const eNode = selectedEnglishNode, fNode = selectedFrenchNode;
            eNode.className = "bg-rose-500 border-b-4 border-rose-700 text-white p-3.5 rounded-2xl font-black text-center transition text-xs sm:text-sm";
            fNode.className = "bg-rose-500 border-b-4 border-rose-700 text-white p-3.5 rounded-2xl font-black text-center transition text-xs sm:text-sm";
            
            const failFruit = fruitsData.find(f => f.en === eNode.dataset.id);
            if(failFruit) registerError(failFruit);
            
            processAnswerResult(false);
            setTimeout(() => {
                eNode.className = "bg-white dark:bg-slate-800 border-2 border-brandPurple text-brandPurple dark:text-indigo-400 p-3.5 rounded-2xl font-black transition text-center text-xs sm:text-sm shadow-sm";
                fNode.className = "bg-white dark:bg-slate-800 border-2 border-brandPink text-brandPink p-3.5 rounded-2xl font-black transition text-center text-xs sm:text-sm shadow-sm";
                isProcessingMatch = false; 
            }, 800);
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
        div.className = `p-3 rounded-2xl border-2 flex items-center gap-3 transition ${isUnlocked ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-900/40 opacity-100 shadow-sm' : 'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-50'}`;
        
        div.innerHTML = `
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner ${isUnlocked ? badge.color + ' text-white' : 'bg-slate-300 text-slate-500 dark:bg-slate-700'}">
                ${badge.icon}
            </div>
            <div class="text-left">
                <h4 class="font-black text-xs text-slate-700 dark:text-white flex items-center gap-1 uppercase tracking-wide">
                    ${badge.title} 
                    ${isUnlocked ? '<i class="fa-solid fa-circle-check text-brandGreen text-[11px]"></i>' : ''}
                </h4>
                <p class="text-[11px] text-slate-400 font-bold leading-tight mt-0.5">${badge.desc}</p>
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
        container.innerHTML = `<p class="text-slate-400 font-bold text-center text-xs py-4">Pas de mots à réviser, tu maîtrises ! 😎</p>`;
        return;
    }

    errorHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between p-2.5 bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-100 dark:border-rose-900/40 rounded-xl text-xs font-bold";
        div.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-lg">${item.emoji}</span>
                <span class="font-black text-brandPurple dark:text-rose-300">${item.en}</span>
                <span class="text-slate-400">(${item.fr})</span>
            </div>
            <button onclick="clearWordFromRevision('${item.en}')" class="bg-brandGreen text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition hover:scale-105" title="Marquer comme validé">
                🎯 OK
            </button>
        `;
        container.appendChild(div);
    });
}

function clearWordFromRevision(englishName) {
    removeError(englishName);
    renderErrorHistory();
}