/**
 * Animated "How It Works" Diagram - MOVIE STYLE
 * Enhancement #5 - Cinematic animation with moving characters
 */

const MOVIE_SCENES = [
    {
        character: '👤',
        action: 'browsing',
        dialogue: 'Let me find this command online...',
        position: 'left',
        background: '🌐'
    },
    {
        character: '👤',
        action: 'selecting',
        dialogue: 'Perfect! I\'ll copy this command.',
        position: 'center',
        background: '📄'
    },
    {
        character: '�️',
        action: 'detecting',
        dialogue: 'Aha! A command is being copied...',
        position: 'right',
        background: '🎯'
    },
    {
        character: '🕵️',
        action: 'analyzing',
        dialogue: 'Let me check if it\'s a shell command...',
        position: 'center',
        background: '🔍'
    },
    {
        character: '😈',
        action: 'hijacking',
        dialogue: 'Time to inject my malicious code!',
        position: 'center',
        background: '⚠️'
    },
    {
        character: '�',
        action: 'pasting',
        dialogue: 'Now I\'ll paste it into the terminal...',
        position: 'left',
        background: '💻'
    },
    {
        character: '�',
        action: 'shocked',
        dialogue: 'Wait... this isn\'t what I copied! 😱',
        position: 'center',
        background: '💥'
    }
];

let currentScene = 0;
let movieInterval = null;
let isPaused = false;

/**
 * Create movie-style diagram
 */
function createAnimatedDiagram() {
    const container = document.createElement('div');
    container.className = 'card mb-lg';
    container.id = 'animatedDiagram';
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h2 style="margin: 0;">🎬 The Clipboard Hijacking Movie</h2>
            <button class="btn btn-secondary" id="toggleDiagramBtn" onclick="toggleDiagram()">▶️ Watch Movie</button>
        </div>
        
        <div id="diagramContent" style="display: none; margin-top: 1rem;">
            <p class="text-muted mb-md">🍿 Sit back and watch the attack unfold like a mini movie!</p>
            
            <!-- Movie Screen -->
            <div class="movie-screen">
                <div class="movie-scene" id="movieScene">
                    <div class="scene-background" id="sceneBackground">🌐</div>
                    <div class="character-container" id="characterContainer">
                        <div class="character" id="mainCharacter">👤</div>
                    </div>
                    <div class="dialogue-box" id="dialogueBox">
                        <p id="dialogueText">Click play to start the movie!</p>
                    </div>
                    <div class="scene-number" id="sceneNumber">Scene 1/7</div>
                </div>
                <div class="movie-progress-bar">
                    <div class="movie-progress-fill" id="movieProgress"></div>
                </div>
            </div>
            
            <!-- Movie Controls -->
            <div class="movie-controls">
                <button id="playBtn" class="btn btn-primary">▶️ Play Movie</button>
                <button id="pauseBtn" class="btn btn-secondary hidden">⏸️ Pause</button>
                <button id="restartBtn" class="btn btn-secondary">🔄 Restart</button>
                <button id="skipBtn" class="btn btn-secondary">⏭️ Next Scene</button>
            </div>
            
            <div class="alert alert-info mt-md" style="font-size: 0.9rem;">
                🎭 <strong>Movie Guide:</strong> Watch as our character (👤) encounters a malicious script (😈) that hijacks their clipboard!
            </div>
        </div>
    `;
    
    return container;
}

/**
 * Insert diagram into page
 */
function insertDiagram() {
    const instructionsCard = document.querySelector('.card');
    if (instructionsCard) {
        const diagram = createAnimatedDiagram();
        instructionsCard.after(diagram);
        
        // Set up event listeners
        document.getElementById('playBtn').addEventListener('click', playMovie);
        document.getElementById('pauseBtn').addEventListener('click', pauseMovie);
        document.getElementById('restartBtn').addEventListener('click', restartMovie);
        document.getElementById('skipBtn').addEventListener('click', nextScene);
        
        console.log('✅ Movie-style diagram inserted!');
    }
}

/**
 * Toggle diagram visibility
 */
function toggleDiagram() {
    const content = document.getElementById('diagramContent');
    const btn = document.getElementById('toggleDiagramBtn');
    
    if (content && btn) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        btn.textContent = isHidden ? '⏹️ Close Movie' : '▶️ Watch Movie';
    }
}

/**
 * Play the movie
 */
function playMovie() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (playBtn) playBtn.classList.add('hidden');
    if (pauseBtn) pauseBtn.classList.remove('hidden');
    
    if (isPaused) {
        isPaused = false;
        continueMovie();
    } else {
        currentScene = 0;
        startMovie();
    }
}

/**
 * Start movie from beginning
 */
function startMovie() {
    currentScene = 0;
    showScene(currentScene);
    
    movieInterval = setInterval(() => {
        if (currentScene < MOVIE_SCENES.length - 1) {
            currentScene++;
            showScene(currentScene);
        } else {
            endMovie();
        }
    }, 3500); // 3.5 seconds per scene
}

/**
 * Continue movie after pause
 */
function continueMovie() {
    movieInterval = setInterval(() => {
        if (currentScene < MOVIE_SCENES.length - 1) {
            currentScene++;
            showScene(currentScene);
        } else {
            endMovie();
        }
    }, 3500);
}

/**
 * Show a specific scene
 */
function showScene(sceneIndex) {
    const scene = MOVIE_SCENES[sceneIndex];
    const character = document.getElementById('mainCharacter');
    const background = document.getElementById('sceneBackground');
    const dialogue = document.getElementById('dialogueText');
    const sceneNum = document.getElementById('sceneNumber');
    const progress = document.getElementById('movieProgress');
    const container = document.getElementById('characterContainer');
    
    // Update scene number
    if (sceneNum) sceneNum.textContent = `Scene ${sceneIndex + 1}/${MOVIE_SCENES.length}`;
    
    // Update progress bar
    if (progress) {
        const progressPercent = ((sceneIndex + 1) / MOVIE_SCENES.length) * 100;
        progress.style.width = `${progressPercent}%`;
    }
    
    // Fade out
    if (character) character.style.opacity = '0';
    if (dialogue) dialogue.style.opacity = '0';
    
    setTimeout(() => {
        // Update character
        if (character) {
            character.textContent = scene.character;
            character.className = 'character ' + scene.action;
            
            // Position character
            container.className = 'character-container position-' + scene.position;
        }
        
        // Update background
        if (background) {
            background.textContent = scene.background;
            background.className = 'scene-background ' + scene.action;
        }
        
        // Update dialogue
        if (dialogue) {
            dialogue.textContent = scene.dialogue;
        }
        
        // Fade in
        setTimeout(() => {
            if (character) character.style.opacity = '1';
            if (dialogue) dialogue.style.opacity = '1';
        }, 100);
        
    }, 500);
}

/**
 * Pause the movie
 */
function pauseMovie() {
    isPaused = true;
    if (movieInterval) {
        clearInterval(movieInterval);
        movieInterval = null;
    }
    
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (playBtn) {
        playBtn.textContent = '▶️ Resume';
        playBtn.classList.remove('hidden');
    }
    if (pauseBtn) pauseBtn.classList.add('hidden');
}

/**
 * Restart the movie
 */
function restartMovie() {
    if (movieInterval) {
        clearInterval(movieInterval);
        movieInterval = null;
    }
    
    isPaused = false;
    currentScene = 0;
    
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (playBtn) {
        playBtn.textContent = '▶️ Play Movie';
        playBtn.classList.add('hidden');
    }
    if (pauseBtn) pauseBtn.classList.remove('hidden');
    
    startMovie();
}

/**
 * Skip to next scene
 */
function nextScene() {
    if (currentScene < MOVIE_SCENES.length - 1) {
        currentScene++;
        showScene(currentScene);
    }
}

/**
 * End the movie
 */
function endMovie() {
    if (movieInterval) {
        clearInterval(movieInterval);
        movieInterval = null;
    }
    
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (playBtn) {
        playBtn.textContent = '🔄 Watch Again';
        playBtn.classList.remove('hidden');
    }
    if (pauseBtn) pauseBtn.classList.add('hidden');
    
    setTimeout(() => {
        alert('🎬 Movie Complete! Remember: Always verify commands before pasting them into your terminal!');
    }, 500);
}

// Make toggle function global
window.toggleDiagram = toggleDiagram;

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertDiagram);
} else {
    insertDiagram();
}
