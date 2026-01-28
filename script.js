// ====================================
// GAME DATA & CONFIGURATION
// ====================================
const gameObjects = [
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
];

const senseColors = {
    sight: '#667eea',
    hearing: '#f093fb',
    smell: '#26de81',
    taste: '#feca57',
    touch: '#fa709a'
};

// ====================================
// GAME STATE
// ====================================
let currentObjects = [];
let selectedObject = null;
let score = 0;
let correctAnswers = 0;
let totalAttempts = 0;
let timerInterval;
let seconds = 0;
let combo = 0;
let bestCombo = 0;

// ====================================
// PARTICLE SYSTEM
// ====================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        const startX = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ====================================
// CONFETTI SYSTEM
// ====================================
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#FF6B9D', '#FFA500', '#4ECDC4', '#95E1D3', '#FFE66D', '#667eea', '#f093fb'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 2 + 2;
        
        confetti.style.left = `${startX}%`;
        confetti.style.backgroundColor = color;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${duration}s`;
        
        confettiContainer.appendChild(confetti);
    }
}

// ====================================
// VISUAL FEEDBACK
// ====================================
function createFloatingText(text, x, y, isCorrect) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'fixed';
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    floatingText.style.fontSize = '24px';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.color = isCorrect ? '#26de81' : '#fc5c65';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.style.animation = 'floatUp 1s ease-out forwards';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 1000);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px);
        }
    }
`;
document.head.appendChild(style);

// ====================================
// GAME FUNCTIONS
// ====================================
function startGame() {
    // Transition screens
    document.querySelector('.start-screen').classList.remove('active');
    document.querySelector('.game-screen').classList.add('active');
    
    // Shuffle and prepare objects
    currentObjects = [...gameObjects].sort(() => Math.random() - 0.5);
    
    // Reset game state
    score = 0;
    correctAnswers = 0;
    totalAttempts = 0;
    seconds = 0;
    selectedObject = null;
    combo = 0;
    bestCombo = 0;
    
    // Display objects with staggered animation
    displayObjects();
    
    // Start timer
    timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
        updateStars();
    }, 1000);
    
    // Update UI
    updateScore();
    updateProgress();
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
        card.style.animation = 'slideIn 0.4s ease-out forwards';
        container.appendChild(card);
    });
}

function selectObject(index) {
    const obj = currentObjects[index];
    const card = document.getElementById(`object-${index}`);
    
    // Don't select disabled cards
    if (card.classList.contains('disabled')) return;
    
    // Deselect previous
    document.querySelectorAll('.object-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Select new
    card.classList.add('selected');
    selectedObject = index;
    
    // Update feedback
    showFeedback(`Great! Now which sense helps you observe the ${obj.emoji}?`, 'neutral');
}

function checkAnswer(sense) {
    if (selectedObject === null) {
        showFeedback('⚠️ Please select an object first!', 'neutral');
        return;
    }

    const obj = currentObjects[selectedObject];
    const card = document.getElementById(`object-${selectedObject}`);
    totalAttempts++;
    
    if (obj.sense === sense) {
        // CORRECT ANSWER
        const points = 10 + (combo * 2); // Bonus points for combo
        score += points;
        correctAnswers++;
        combo++;
        bestCombo = Math.max(bestCombo, combo);
        
        // Visual feedback
        card.classList.add('disabled');
        card.classList.remove('selected');
        
        // Get card position for floating text
        const rect = card.getBoundingClientRect();
        createFloatingText(`+${points}`, rect.left + rect.width / 2, rect.top, true);
        
        // Show success message
        const messages = [
            `✨ Perfect! ${obj.description}`,
            `🎯 Excellent! You use ${sense} to observe ${obj.emoji}`,
            `🌟 Amazing! That's right!`,
            `💫 Brilliant! ${sense} it is!`
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        showFeedback(message + (combo > 1 ? ` | 🔥 ${combo}x Combo!` : ''), 'correct');
        
        updateScore();
        updateProgress();
        
        // Check if game complete
        if (correctAnswers === currentObjects.length) {
            setTimeout(endGame, 1500);
        }
        
    } else {
        // WRONG ANSWER
        combo = 0; // Reset combo
        score = Math.max(0, score - 2);
        
        // Get sense option position for floating text
        const senseOption = document.querySelector(`[data-sense="${sense}"]`);
        const rect = senseOption.getBoundingClientRect();
        createFloatingText('-2', rect.left + rect.width / 2, rect.top, false);
        
        // Show error message
        const hints = [
            `❌ Not quite! Think about how you observe ${obj.emoji}`,
            `🤔 Try again! What do you use to notice ${obj.emoji}?`,
            `💭 Close! Consider how you experience ${obj.emoji}`
        ];
        const hint = hints[Math.floor(Math.random() * hints.length)];
        showFeedback(hint, 'wrong');
        
        // Shake animation
        card.style.animation = 'shake 0.5s';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
        
        updateScore();
    }
    
    selectedObject = null;
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

function clearFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = minutes > 0 
        ? `${minutes}:${secs.toString().padStart(2, '0')}`
        : `${secs}s`;
    document.getElementById('timer').textContent = timeStr;
}

function updateProgress() {
    const progress = (correctAnswers / currentObjects.length) * 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    document.getElementById('progressText').textContent = `${correctAnswers}/${currentObjects.length}`;
}

function updateStars() {
    let starDisplay = '★★★';
    if (seconds > 60) starDisplay = '★★☆';
    if (seconds > 90) starDisplay = '★☆☆';
    document.getElementById('stars').textContent = starDisplay;
}

function endGame() {
    clearInterval(timerInterval);
    
    // Transition screens
    document.querySelector('.game-screen').classList.remove('active');
    document.querySelector('.end-screen').classList.add('active');
    
    // Create confetti
    createConfetti();
    
    // Calculate accuracy
    const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
    
    // Calculate final stars and achievement
    let finalStars = '★★★';
    let achievementTitle = '🏆 Legendary Senses Master!';
    let achievementMessage = 'Absolutely incredible! You have perfect observation skills!';
    let trophyEmoji = '🏆';
    
    if (seconds > 60 || accuracy < 95) {
        finalStars = '★★☆';
        achievementTitle = '🌟 Senses Expert!';
        achievementMessage = 'Great work! You have excellent observation skills!';
        trophyEmoji = '🎉';
    }
    if (seconds > 90 || accuracy < 80) {
        finalStars = '★☆☆';
        achievementTitle = '⭐ Senses Explorer!';
        achievementMessage = 'Good effort! Keep practicing to sharpen your senses!';
        trophyEmoji = '👍';
    }
    
    // Update end screen
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalTime').textContent = seconds;
    document.getElementById('accuracy').textContent = accuracy;
    document.getElementById('finalStars').textContent = finalStars;
    document.getElementById('achievementTitle').textContent = achievementTitle;
    document.getElementById('achievementMessage').textContent = achievementMessage;
    document.getElementById('trophyIcon').textContent = trophyEmoji;
}

function restartGame() {
    // Clear confetti
    document.getElementById('confetti').innerHTML = '';
    
    // Transition screens
    document.querySelector('.end-screen').classList.remove('active');
    document.querySelector('.start-screen').classList.add('active');
}

// ====================================
// INITIALIZATION
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
});

// ====================================
// KEYBOARD SHORTCUTS
// ====================================
document.addEventListener('keydown', (e) => {
    // Number keys 1-5 for selecting senses during gameplay
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
    }
    
    // Space or Enter to start/restart
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
// ACCESSIBILITY IMPROVEMENTS
// ====================================
// Add hover sound effect simulation (visual only, no actual sound)
document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('sense-option') || 
        e.target.classList.contains('object-card') ||
        e.target.classList.contains('btn-primary')) {
        // Visual feedback only - could add Web Audio API sounds here
    }
});
