// ====================================
// GAME DATA & CONFIGURATION
// ====================================
const gameObjects = {
    easy: [
        { name: '🌈 Rainbow', sense: 'sight', emoji: '🌈', description: 'Beautiful colors in the sky' },
        { name: '🔔 Bell', sense: 'hearing', emoji: '🔔', description: 'Makes a ringing sound' },
        { name: '🌹 Rose', sense: 'smell', emoji: '🌹', description: 'Sweet fragrant flower' },
        { name: '🍎 Apple', sense: 'taste', emoji: '🍎', description: 'Crisp and delicious' },
        { name: '🧊 Ice Cube', sense: 'touch', emoji: '🧊', description: 'Cold and solid' }
    ],
    normal: [
        { name: '🌈 Rainbow', sense: 'sight', emoji: '🌈', description: 'Beautiful colors in the sky' },
        { name: '🔔 Bell', sense: 'hearing', emoji: '🔔', description: 'Makes a ringing sound' },
        { name: '🌹 Rose', sense: 'smell', emoji: '🌹', description: 'Sweet fragrant flower' },
        { name: '🍎 Apple', sense: 'taste', emoji: '🍎', description: 'Crisp and delicious' },
        { name: '🧊 Ice Cube', sense: 'touch', emoji: '🧊', description: 'Cold and solid' },
        { name: '⭐ Stars', sense: 'sight', emoji: '⭐', description: 'Twinkling lights above' },
        { name: '🎵 Music', sense: 'hearing', emoji: '🎵', description: 'Pleasant melodies' },
        { name: '☕ Coffee', sense: 'smell', emoji: '☕', description: 'Rich aroma' },
        { name: '🍋 Lemon', sense: 'taste', emoji: '🍋', description: 'Sour citrus fruit' },
        { name: '🔥 Warm Fire', sense: 'touch', emoji: '🔥', description: 'Heat and warmth' }
    ],
    hard: [
        { name: '🌈 Rainbow', sense: 'sight', emoji: '🌈', description: 'Beautiful colors in the sky' },
        { name: '🔔 Bell', sense: 'hearing', emoji: '🔔', description: 'Makes a ringing sound' },
        { name: '🌹 Rose', sense: 'smell', emoji: '🌹', description: 'Sweet fragrant flower' },
        { name: '🍎 Apple', sense: 'taste', emoji: '🍎', description: 'Crisp and delicious' },
        { name: '🧊 Ice Cube', sense: 'touch', emoji: '🧊', description: 'Cold and solid' },
        { name: '⭐ Stars', sense: 'sight', emoji: '⭐', description: 'Twinkling lights above' },
        { name: '🎵 Music', sense: 'hearing', emoji: '🎵', description: 'Pleasant melodies' },
        { name: '☕ Coffee', sense: 'smell', emoji: '☕', description: 'Rich aroma' },
        { name: '🍋 Lemon', sense: 'taste', emoji: '🍋', description: 'Sour citrus fruit' },
        { name: '🔥 Warm Fire', sense: 'touch', emoji: '🔥', description: 'Heat and warmth' },
        { name: '🎨 Painting', sense: 'sight', emoji: '🎨', description: 'Visual artwork' },
        { name: '🚨 Siren', sense: 'hearing', emoji: '🚨', description: 'Loud warning sound' },
        { name: '🍿 Popcorn', sense: 'smell', emoji: '🍿', description: 'Buttery scent' },
        { name: '🍫 Chocolate', sense: 'taste', emoji: '🍫', description: 'Sweet and rich' },
        { name: '❄️ Snow', sense: 'touch', emoji: '❄️', description: 'Cold and soft' }
    ]
};

const achievements = [
    { id: 'first_match', name: 'First Step', description: 'Complete your first match', icon: '🎯' },
    { id: 'combo_3', name: 'Combo Starter', description: 'Get a 3x combo', icon: '🔥' },
    { id: 'combo_5', name: 'Combo Master', description: 'Get a 5x combo', icon: '⚡' },
    { id: 'perfect_game', name: 'Perfectionist', description: 'Complete with 100% accuracy', icon: '💎' },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Finish in under 30 seconds', icon: '⚡' },
    { id: 'all_senses', name: 'Sense Master', description: 'Use all 5 senses in one game', icon: '🌟' }
];

// ====================================
// GAME STATE
// ====================================
let difficulty = 'normal';
let currentObjects = [];
let selectedObject = null;
let score = 0;
let correctAnswers = 0;
let totalAttempts = 0;
let timerInterval;
let seconds = 0;
let combo = 0;
let bestCombo = 0;
let highScore = parseInt(localStorage.getItem('highScore') || '0');
let bestComboEver = parseInt(localStorage.getItem('bestCombo') || '0');
let sensesUsed = new Set();
let unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
let soundEnabled = true;

// Power-ups
let powerUps = {
    time: 3,
    hint: 2,
    skip: 1
};

// ====================================
// INITIALIZATION
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    updateHighScoreDisplay();
});

function initBackground() {
    createParticles();
    createStars();
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 3;
        const startX = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 8;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// ====================================
// SOUND SYSTEM (Visual Feedback)
// ====================================
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    btn.classList.toggle('muted');
}

function playSound(type) {
    if (!soundEnabled) return;
    
    // Visual feedback for "sound"
    const colors = {
        correct: '#26de81',
        wrong: '#fc5c65',
        click: '#667eea',
        combo: '#feca57',
        powerup: '#48dbfb'
    };
    
    createSoundWave(colors[type] || '#667eea');
}

function createSoundWave(color) {
    const wave = document.createElement('div');
    wave.style.position = 'fixed';
    wave.style.top = '50%';
    wave.style.left = '50%';
    wave.style.width = '20px';
    wave.style.height = '20px';
    wave.style.borderRadius = '50%';
    wave.style.border = `3px solid ${color}`;
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.pointerEvents = 'none';
    wave.style.zIndex = '9999';
    wave.style.animation = 'soundWaveExpand 0.6s ease-out';
    
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
}

// Add soundwave animation
const soundWaveStyle = document.createElement('style');
soundWaveStyle.textContent = `
    @keyframes soundWaveExpand {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(soundWaveStyle);

// ====================================
// GAME FLOW
// ====================================
function selectDifficulty(level) {
    difficulty = level;
    playSound('click');
    
    // Visual feedback
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.style.transform = 'scale(0.95)';
    });
    
    setTimeout(() => {
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.style.transform = '';
        });
    }, 200);
}

function startGame() {
    playSound('click');
    
    // Transition screens
    document.querySelector('.start-screen').classList.remove('active');
    document.querySelector('.game-screen').classList.add('active');
    
    // Get objects based on difficulty
    currentObjects = [...gameObjects[difficulty]].sort(() => Math.random() - 0.5);
    
    // Reset game state
    score = 0;
    correctAnswers = 0;
    totalAttempts = 0;
    seconds = 0;
    selectedObject = null;
    combo = 0;
    bestCombo = 0;
    sensesUsed = new Set();
    
    // Reset power-ups based on difficulty
    powerUps = {
        time: difficulty === 'easy' ? 5 : difficulty === 'normal' ? 3 : 2,
        hint: difficulty === 'easy' ? 3 : difficulty === 'normal' ? 2 : 1,
        skip: difficulty === 'easy' ? 2 : 1
    };
    
    updatePowerUpButtons();
    
    // Display objects
    displayObjects();
    createMilestones();
    
    // Start timer
    timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
        updateStars();
        updateTimerBar();
    }, 1000);
    
    // Update UI
    updateScore();
    updateProgress();
    updateCombo();
    clearFeedback();
}

function displayObjects() {
    const container = document.getElementById('objectCards');
    container.innerHTML = '';
    
    currentObjects.forEach((obj, index) => {
        const card = document.createElement('div');
        card.className = 'object-card';
        card.id = `object-${index}`;
        card.textContent = obj.name;
        card.onclick = () => selectObject(index);
        card.style.animationDelay = `${index * 0.05}s`;
        container.appendChild(card);
    });
    
    updateObjectsRemaining();
}

function selectObject(index) {
    const obj = currentObjects[index];
    const card = document.getElementById(`object-${index}`);
    
    if (card.classList.contains('disabled')) return;
    
    playSound('click');
    
    // Deselect previous
    document.querySelectorAll('.object-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Select new
    card.classList.add('selected');
    selectedObject = index;
    
    showFeedback(`Perfect! Now which sense helps you observe the ${obj.emoji}?`, 'neutral');
}

function checkAnswer(sense) {
    if (selectedObject === null) {
        showFeedback('⚠️ Please select an object first!', 'neutral');
        playSound('wrong');
        return;
    }

    const obj = currentObjects[selectedObject];
    const card = document.getElementById(`object-${selectedObject}`);
    totalAttempts++;
    
    if (obj.sense === sense) {
        handleCorrectAnswer(obj, card, sense);
    } else {
        handleWrongAnswer(obj, card, sense);
    }
    
    selectedObject = null;
    updateObjectsRemaining();
}

function handleCorrectAnswer(obj, card, sense) {
    playSound('correct');
    
    // Calculate points
    const basePoints = 10;
    const comboBonus = combo * 2;
    const speedBonus = seconds < 20 ? 5 : seconds < 40 ? 3 : 0;
    const points = basePoints + comboBonus + speedBonus;
    
    score += points;
    correctAnswers++;
    combo++;
    bestCombo = Math.max(bestCombo, combo);
    sensesUsed.add(sense);
    
    // Visual feedback
    card.classList.add('disabled');
    card.classList.remove('selected');
    
    const rect = card.getBoundingClientRect();
    createFloatingText(`+${points}`, rect.left + rect.width / 2, rect.top, true);
    
    // Check for combo achievement
    if (combo === 3) unlockAchievement('combo_3');
    if (combo === 5) unlockAchievement('combo_5');
    
    // Check for first match
    if (correctAnswers === 1) unlockAchievement('first_match');
    
    // Success messages
    const messages = [
        `✨ Perfect! ${obj.description}`,
        `🎯 Excellent! You use ${sense} to observe ${obj.emoji}`,
        `🌟 Amazing work! That's exactly right!`,
        `💫 Brilliant! ${sense} it is!`,
        `🎊 Outstanding! You're a natural!`
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    showFeedback(message + (combo > 1 ? ` | 🔥 ${combo}x COMBO!` : ''), 'correct');
    
    // Show combo display
    if (combo > 1) {
        document.getElementById('comboDisplay').textContent = `${combo}x COMBO!`;
        setTimeout(() => {
            document.getElementById('comboDisplay').textContent = '';
        }, 2000);
    }
    
    updateScore();
    updateProgress();
    updateCombo();
    
    // Check if game complete
    if (correctAnswers === currentObjects.length) {
        setTimeout(endGame, 1500);
    }
}

function handleWrongAnswer(obj, card, sense) {
    playSound('wrong');
    
    combo = 0;
    score = Math.max(0, score - 2);
    
    const senseOption = document.querySelector(`[data-sense="${sense}"]`);
    const rect = senseOption.getBoundingClientRect();
    createFloatingText('-2', rect.left + rect.width / 2, rect.top, false);
    
    const hints = [
        `❌ Not quite! Think about how you ${obj.sense === 'sight' ? 'see' : obj.sense === 'hearing' ? 'hear' : obj.sense === 'smell' ? 'smell' : obj.sense === 'taste' ? 'taste' : 'feel'} ${obj.emoji}`,
        `🤔 Try again! What sense do you use for ${obj.emoji}?`,
        `💭 Close! Remember: ${obj.description}`
    ];
    const hint = hints[Math.floor(Math.random() * hints.length)];
    showFeedback(hint, 'wrong');
    
    // Shake animation
    card.style.animation = 'shake 0.5s';
    setTimeout(() => {
        card.style.animation = '';
    }, 500);
    
    updateScore();
    updateCombo();
}

// ====================================
// POWER-UPS
// ====================================
function usePowerUp(type) {
    if (powerUps[type] <= 0) return;
    
    playSound('powerup');
    powerUps[type]--;
    
    switch(type) {
        case 'time':
            seconds = Math.max(0, seconds - 10);
            showFeedback('⏱️ +10 seconds added!', 'neutral');
            createFloatingText('+10s', window.innerWidth / 2, 200, true);
            break;
            
        case 'hint':
            if (selectedObject !== null) {
                const obj = currentObjects[selectedObject];
                const correctSense = document.querySelector(`[data-sense="${obj.sense}"]`);
                correctSense.classList.add('hint-active');
                document.getElementById('hintIndicator').textContent = '💡';
                
                setTimeout(() => {
                    correctSense.classList.remove('hint-active');
                    document.getElementById('hintIndicator').textContent = '';
                }, 3000);
                
                showFeedback('💡 Look for the glowing sense!', 'neutral');
            } else {
                showFeedback('⚠️ Select an object first!', 'neutral');
                powerUps[type]++; // Refund
            }
            break;
            
        case 'skip':
            if (selectedObject !== null) {
                const card = document.getElementById(`object-${selectedObject}`);
                card.classList.add('disabled');
                card.classList.remove('selected');
                correctAnswers++;
                selectedObject = null;
                updateProgress();
                updateObjectsRemaining();
                showFeedback('❌ Object skipped!', 'neutral');
                
                if (correctAnswers === currentObjects.length) {
                    setTimeout(endGame, 1000);
                }
            } else {
                showFeedback('⚠️ Select an object first!', 'neutral');
                powerUps[type]++; // Refund
            }
            break;
    }
    
    updatePowerUpButtons();
}

function updatePowerUpButtons() {
    document.getElementById('timeCount').textContent = powerUps.time;
    document.getElementById('hintCount').textContent = powerUps.hint;
    document.getElementById('skipCount').textContent = powerUps.skip;
    
    document.getElementById('timeBoost').disabled = powerUps.time <= 0;
    document.getElementById('hintBtn').disabled = powerUps.hint <= 0;
    document.getElementById('skipBtn').disabled = powerUps.skip <= 0;
}

// ====================================
// UI UPDATES
// ====================================
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

function clearFeedback() {
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateCombo() {
    const comboEl = document.getElementById('combo');
    comboEl.textContent = `${combo}x`;
    
    if (combo > 0) {
        comboEl.style.animation = 'none';
        setTimeout(() => {
            comboEl.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
    }
}

function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = minutes > 0 
        ? `${minutes}:${secs.toString().padStart(2, '0')}`
        : `${secs}s`;
    document.getElementById('timer').textContent = timeStr;
}

function updateTimerBar() {
    const maxTime = difficulty === 'easy' ? 120 : difficulty === 'normal' ? 90 : 60;
    const percentage = Math.min((seconds / maxTime) * 100, 100);
    document.getElementById('timerBar').style.width = percentage + '%';
}

function updateProgress() {
    const progress = (correctAnswers / currentObjects.length) * 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    document.getElementById('progressText').textContent = `${correctAnswers}/${currentObjects.length}`;
    
    updateMilestones();
}

function updateObjectsRemaining() {
    const remaining = currentObjects.length - correctAnswers;
    document.getElementById('objectsRemaining').textContent = `${remaining} left`;
}

function createMilestones() {
    const container = document.getElementById('milestones');
    container.innerHTML = '';
    
    const milestoneCount = currentObjects.length;
    for (let i = 0; i < milestoneCount; i++) {
        const milestone = document.createElement('div');
        milestone.className = 'milestone';
        milestone.id = `milestone-${i}`;
        container.appendChild(milestone);
    }
}

function updateMilestones() {
    for (let i = 0; i < correctAnswers; i++) {
        const milestone = document.getElementById(`milestone-${i}`);
        if (milestone) {
            milestone.classList.add('completed');
        }
    }
}

function updateStars() {
    const maxTime = difficulty === 'easy' ? 60 : difficulty === 'normal' ? 45 : 30;
    let starDisplay = '★★★';
    
    if (seconds > maxTime * 1.5) starDisplay = '★★☆';
    if (seconds > maxTime * 2) starDisplay = '★☆☆';
    
    document.getElementById('stars').textContent = starDisplay;
}

function updateHighScoreDisplay() {
    document.getElementById('highScore').textContent = highScore;
    document.getElementById('bestComboEver').textContent = bestComboEver;
}

// ====================================
// VISUAL EFFECTS
// ====================================
function createFloatingText(text, x, y, isCorrect) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'fixed';
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    floatingText.style.fontSize = '32px';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontFamily = "'Fredoka', cursive";
    floatingText.style.color = isCorrect ? '#26de81' : '#fc5c65';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.style.textShadow = '0 2px 8px rgba(0,0,0,0.2)';
    floatingText.style.animation = 'floatUp 1s ease-out forwards';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 1000);
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#FF6B9D', '#FFA500', '#4ECDC4', '#95E1D3', '#FFE66D', '#667eea', '#f093fb'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const delay = Math.random() * 1;
        const duration = Math.random() * 2 + 2;
        const rotation = Math.random() * 720;
        
        confetti.style.left = `${startX}%`;
        confetti.style.backgroundColor = color;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.setProperty('--rotation', `${rotation}deg`);
        
        confettiContainer.appendChild(confetti);
    }
}

function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#FF6B9D', '#FFA500', '#4ECDC4', '#FFE66D', '#667eea'];
    const fireworkCount = 5;
    
    for (let f = 0; f < fireworkCount; f++) {
        setTimeout(() => {
            const centerX = Math.random() * 80 + 10;
            const centerY = Math.random() * 60 + 20;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            for (let i = 0; i < 20; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = `${centerX}%`;
                firework.style.top = `${centerY}%`;
                firework.style.backgroundColor = color;
                
                const angle = (Math.PI * 2 * i) / 20;
                const distance = Math.random() * 100 + 50;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                firework.style.setProperty('--x', `${x}px`);
                firework.style.setProperty('--y', `${y}px`);
                
                fireworksContainer.appendChild(firework);
                
                setTimeout(() => firework.remove(), 1000);
            }
        }, f * 600);
    }
}

// ====================================
// ACHIEVEMENTS
// ====================================
function unlockAchievement(id) {
    if (unlockedAchievements.includes(id)) return;
    
    unlockedAchievements.push(id);
    localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
    
    const achievement = achievements.find(a => a.id === id);
    if (achievement) {
        showAchievementPopup(achievement);
    }
}

function showAchievementPopup(achievement) {
    const popup = document.getElementById('achievementPopup');
    document.getElementById('popupIcon').textContent = achievement.icon;
    document.getElementById('popupName').textContent = achievement.name;
    document.getElementById('popupDesc').textContent = achievement.description;
    
    popup.classList.add('show');
    playSound('powerup');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

function displayAchievements() {
    const container = document.getElementById('achievementsList');
    container.innerHTML = '';
    
    achievements.forEach((achievement, index) => {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        
        if (unlockedAchievements.includes(achievement.id)) {
            item.classList.add('unlocked');
        }
        
        item.style.animationDelay = `${index * 0.1}s`;
        
        item.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;
        
        container.appendChild(item);
    });
}

// ====================================
// END GAME
// ====================================
function endGame() {
    clearInterval(timerInterval);
    playSound('correct');
    
    // Check achievements
    const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
    if (accuracy === 100) unlockAchievement('perfect_game');
    if (seconds < 30) unlockAchievement('speed_demon');
    if (sensesUsed.size === 5) unlockAchievement('all_senses');
    
    // Calculate score breakdown
    const baseScore = correctAnswers * 10;
    const comboBonus = Math.floor(score * 0.2);
    const speedBonus = seconds < 30 ? 50 : seconds < 60 ? 25 : 0;
    const finalScore = score + speedBonus;
    
    // Update high scores
    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('highScore', highScore);
    }
    
    if (bestCombo > bestComboEver) {
        bestComboEver = bestCombo;
        localStorage.setItem('bestCombo', bestComboEver);
    }
    
    // Transition screens
    document.querySelector('.game-screen').classList.remove('active');
    document.querySelector('.end-screen').classList.add('active');
    
    // Create effects
    createConfetti();
    createFireworks();
    
    // Calculate stars and rank
    let finalStars = '★★★';
    let rank = 'S Rank';
    let achievementTitle = '🏆 Legendary Senses Master!';
    let achievementMessage = 'You have achieved perfection in observation! Your senses are incredibly sharp!';
    let trophyEmoji = '🏆';
    
    if (seconds > 60 || accuracy < 95) {
        finalStars = '★★☆';
        rank = 'A Rank';
        achievementTitle = '🌟 Exceptional Senses Expert!';
        achievementMessage = 'Excellent work! You have mastered most of your senses with great skill!';
        trophyEmoji = '🎉';
    }
    if (seconds > 90 || accuracy < 80) {
        finalStars = '★☆☆';
        rank = 'B Rank';
        achievementTitle = '⭐ Growing Senses Explorer!';
        achievementMessage = 'Good effort! Keep practicing to sharpen all your senses even more!';
        trophyEmoji = '👍';
    }
    
    // Update end screen
    document.getElementById('finalScore').textContent = finalScore;
    document.getElementById('finalTime').textContent = seconds;
    document.getElementById('accuracy').textContent = accuracy;
    document.getElementById('bestCombo').textContent = bestCombo;
    document.getElementById('perfectMatches').textContent = correctAnswers;
    document.getElementById('finalStars').textContent = finalStars;
    document.getElementById('rankBadge').textContent = rank;
    document.getElementById('achievementTitle').textContent = achievementTitle;
    document.getElementById('achievementMessage').textContent = achievementMessage;
    document.getElementById('trophyIcon').textContent = trophyEmoji;
    
    // Score breakdown
    document.getElementById('baseScore').textContent = baseScore;
    document.getElementById('comboBonus').textContent = comboBonus;
    document.getElementById('speedBonus').textContent = speedBonus;
    
    // Display achievements
    displayAchievements();
}

function viewStats() {
    alert(`📊 Your Statistics:\n\n🏆 High Score: ${highScore}\n🔥 Best Combo: ${bestComboEver}x\n🏅 Achievements: ${unlockedAchievements.length}/${achievements.length}`);
}

function restartGame() {
    playSound('click');
    
    // Clear effects
    document.getElementById('confetti').innerHTML = '';
    document.getElementById('fireworks').innerHTML = '';
    
    // Transition screens
    document.querySelector('.end-screen').classList.remove('active');
    document.querySelector('.start-screen').classList.add('active');
    
    updateHighScoreDisplay();
}

// ====================================
// KEYBOARD SHORTCUTS
// ====================================
document.addEventListener('keydown', (e) => {
    if (document.querySelector('.game-screen').classList.contains('active')) {
        const senseMap = {
            '1': 'sight',
            '2': 'hearing',
            '3': 'smell',
            '4': 'taste',
            '5': 'touch'
        };
        
        if (senseMap[e.key]) {
            checkAnswer(senseMap[e.key]);
        }
        
        // Power-up shortcuts
        if (e.key === 't' || e.key === 'T') usePowerUp('time');
        if (e.key === 'h' || e.key === 'H') usePowerUp('hint');
        if (e.key === 's' || e.key === 'S') usePowerUp('skip');
    }
    
    if (e.key === ' ' || e.key === 'Enter') {
        if (document.querySelector('.start-screen').classList.contains('active')) {
            e.preventDefault();
            startGame();
        } else if (document.querySelector('.end-screen').classList.contains('active')) {
            e.preventDefault();
            restartGame();
        }
    }
});

// ====================================
// ADDITIONAL ANIMATIONS
// ====================================
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-120px) scale(1.5);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
`;
document.head.appendChild(additionalStyles);
