// Main game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, DifficultyScene, GameScene, GameOverScene]
};

// Global game state will be initialized by DifficultyScene
// window.gameState is created dynamically with proper structure

// Create game instance with error handling
try {
    window.game = new Phaser.Game(config);
    console.log('Game started successfully!');
    
    // Add event listener for when game is ready
    window.game.events.once('ready', function() {
        console.log('Game is ready!');
        const loading = document.getElementById('loading');
        const instructions = document.getElementById('instructions');
        if (loading) loading.style.display = 'none';
        if (instructions) instructions.style.display = 'none';
    });
    
} catch (error) {
    console.error('Error starting game:', error);
    const gameContainer = document.getElementById('game-container');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    
    if (gameContainer) {
        gameContainer.innerHTML = '<p style="color: red;">Error loading game. Please refresh the page.</p>';
    }
    if (loading) {
        loading.innerHTML = 'Game failed to load. Please refresh the page.';
    }
    if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = 'Error: ' + error.message;
    }
}
