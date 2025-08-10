class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.won = data.won;
        this.multiplayer = data.multiplayer || false;
        this.restarting = false;
    }

    create() {
        console.log('GameOverScene create() called');
        console.log('Scene input enabled:', this.input ? 'Yes' : 'No');
        console.log('Won:', this.won, 'Multiplayer:', this.multiplayer);
        
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Background
        this.add.rectangle(0, 0, 800, 600, 0x000000, 0.8)
            .setOrigin(0, 0);

        if (this.multiplayer) {
            this.createMultiplayerResults(centerX, centerY);
        } else {
            this.createSinglePlayerResults(centerX, centerY);
        }
        
        // Create buttons for both single and multiplayer
        this.createButtons(centerX, centerY);
        
        // Setup keyboard handlers
        this.setupKeyboardHandlers();
        
        // Add some particle effects for celebration if won
        if (this.won) {
            this.createCelebrationEffects();
        }
        
        console.log('GameOverScene create() completed');
    }
    
    createSinglePlayerResults(centerX, centerY) {
        // Game over text - show different messages for win vs lose
        let titleText = 'YOU WIN!';
        let titleColor = '#00ff00';
        
        if (!this.won) {
            titleText = 'GAME OVER';
            titleColor = '#ff0000';
        }
        
        const gameOverText = this.add.text(centerX, centerY - 120, titleText, {
            fontSize: '48px',
            fill: titleColor,
            stroke: '#000',
            strokeThickness: 6
        });
        gameOverText.setOrigin(0.5);

        // Show specific loss message if player lost
        if (!this.won) {
            const loseReasonText = this.add.text(centerX, centerY - 80, 
                'You lost all your lives!', {
                fontSize: '24px',
                fill: '#ff6666',
                stroke: '#000',
                strokeThickness: 3
            });
            loseReasonText.setOrigin(0.5);
        }

        // Difficulty level
        const difficulty = window.gameState?.difficulty || 'normal';
        const difficultyText = this.add.text(centerX, centerY - 40, 
            'Difficulty: ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1), {
            fontSize: '20px',
            fill: '#ffff00',
            stroke: '#000',
            strokeThickness: 3
        });
        difficultyText.setOrigin(0.5);

        // Gems collected vs total
        const player = window.gameState.players?.[0];
        const gemsCollected = player?.gemsCollected || 0;
        const gameResults = window.gameState.gameResults;
        
        // Get actual total gems from game results
        let totalGems = 'Unknown';
        if (gameResults && gameResults.singlePlayer && gameResults.totalGems) {
            totalGems = gameResults.totalGems;
        } else if (gameResults && gameResults.singlePlayer) {
            // Fallback: estimate from difficulty settings
            const gemsSettings = window.gameState?.difficultySettings?.gemsCount;
            if (gemsSettings) {
                totalGems = Math.round((gemsSettings.min + gemsSettings.max) / 2);
            }
        }
        
        console.log(`GameOver display: ${gemsCollected}/${totalGems} gems (from gameResults:`, gameResults, ')');
        
        const gemsText = this.add.text(centerX, centerY, 
            `Gems Collected: ${gemsCollected}` + (totalGems !== 'Unknown' ? ` / ${totalGems}` : ''), {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000',
            strokeThickness: 3
        });
        gemsText.setOrigin(0.5);

        // Final score
        const scoreText = this.add.text(centerX, centerY + 30, 
            'Final Score: ' + (player?.score || 0), {
            fontSize: '28px',
            fill: '#ffffff',
            stroke: '#000',
            strokeThickness: 4
        });
        scoreText.setOrigin(0.5);

        // Lives remaining (only show if player won or if they have lives left)
        const livesRemaining = player?.lives || 0;
        if (this.won || livesRemaining > 0) {
            const livesText = this.add.text(centerX, centerY + 60, 
                'Lives Remaining: ' + livesRemaining, {
                fontSize: '20px',
                fill: '#ffffff',
                stroke: '#000',
                strokeThickness: 3
            });
            livesText.setOrigin(0.5);
        }
    }
    
    createMultiplayerResults(centerX, centerY) {
        const results = window.gameState.gameResults;
        const difficulty = window.gameState?.difficulty || 'normal';
        
        // Title
        let titleText = 'GAME OVER';
        let titleColor = '#ff0000';
        
        if (results.allPlayersLost) {
            titleText = 'ALL PLAYERS LOST!';
            titleColor = '#ff4444';
        } else if (results.tie) {
            titleText = "IT'S A TIE!";
            titleColor = '#ffff00';
        } else if (results.winner) {
            titleText = `${results.winner.name.toUpperCase()} WINS!`;
            titleColor = '#00ff00';
        }
        
        const gameOverText = this.add.text(centerX, centerY - 150, titleText, {
            fontSize: '36px',
            fill: titleColor,
            stroke: '#000',
            strokeThickness: 6
        });
        gameOverText.setOrigin(0.5);

        // Difficulty level
        const difficultyText = this.add.text(centerX, centerY - 110, 
            'Difficulty: ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1), {
            fontSize: '20px',
            fill: '#ffff00',
            stroke: '#000',
            strokeThickness: 3
        });
        difficultyText.setOrigin(0.5);
        
        // Player results
        const playerColors = ['#4A90E2', '#9B59B6', '#27AE60']; // Blue, Purple, Green
        const startY = centerY - 60;
        
        window.gameState.players.forEach((player, index) => {
            const yPos = startY + (index * 30);
            const color = playerColors[index];
            
            const resultText = this.add.text(centerX, yPos, 
                `${player.name}: ${player.gemsCollected} gems, ${player.score} points`, {
                fontSize: '18px',
                fill: color,
                stroke: '#000',
                strokeThickness: 2,
                fontWeight: player === results.winner ? 'bold' : 'normal'
            });
            resultText.setOrigin(0.5);
            
            // Add crown for winner
            if (player === results.winner && !results.tie) {
                const crown = this.add.text(centerX - 150, yPos, '👑', {
                    fontSize: '18px'
                });
                crown.setOrigin(0.5);
            }
        });
    }
    
    createButtons(centerX, centerY) {
        // Adjust button position based on whether it's single or multiplayer
        const buttonY = this.multiplayer ? centerY + 80 : centerY + 100;
        
        console.log('Creating buttons at position:', centerX, buttonY);
        
        // Simple approach - just make text interactive
        this.restartButton = this.add.text(centerX - 120, buttonY, 'Play Again', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000',
            strokeThickness: 4,
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        });
        this.restartButton.setOrigin(0.5);
        this.restartButton.setInteractive({ useHandCursor: true });
        
        this.difficultyButton = this.add.text(centerX + 120, buttonY, 'Change Difficulty', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000',
            strokeThickness: 4,
            backgroundColor: '#2196F3',
            padding: { x: 20, y: 10 }
        });
        this.difficultyButton.setOrigin(0.5);
        this.difficultyButton.setInteractive({ useHandCursor: true });
        
        console.log('Buttons created, setting up event listeners...');

        // Simple event handlers for restart button
        this.restartButton.on('pointerover', () => {
            console.log('Restart button hover');
            this.restartButton.setStyle({ fill: '#ffff00' });
        });

        this.restartButton.on('pointerout', () => {
            console.log('Restart button out');
            this.restartButton.setStyle({ fill: '#ffffff' });
        });

        this.restartButton.on('pointerdown', () => {
            console.log('Restart button clicked!');
            this.restartGame();
        });

        // Also add alternative click event for restart button
        this.restartButton.on('pointerup', () => {
            console.log('Restart button pointerup!');
        });

        // Simple event handlers for difficulty button
        this.difficultyButton.on('pointerover', () => {
            console.log('Difficulty button hover');
            this.difficultyButton.setStyle({ fill: '#ffff00' });
        });

        this.difficultyButton.on('pointerout', () => {
            console.log('Difficulty button out');
            this.difficultyButton.setStyle({ fill: '#ffffff' });
        });

        this.difficultyButton.on('pointerdown', () => {
            console.log('Difficulty button clicked!');
            this.changeDifficulty();
        });

        // Also add alternative click event for difficulty button
        this.difficultyButton.on('pointerup', () => {
            console.log('Difficulty button pointerup!');
        });
        
        console.log('Event listeners attached successfully');

        // Add a global click listener to test if input is working at all
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            console.log('Global click detected at:', pointer.x, pointer.y);
            console.log('Objects under pointer:', currentlyOver.length);
            if (currentlyOver.length > 0) {
                currentlyOver.forEach((obj, index) => {
                    console.log(`Object ${index}:`, obj.constructor.name);
                });
            }
        });

        // Instructions
        const instructionY = this.multiplayer ? centerY + 140 : centerY + 160;
        const instructionText = this.add.text(centerX, instructionY, 
            'Press SPACE to restart or click buttons above', {
            fontSize: '18px',
            fill: '#cccccc'
        });
        instructionText.setOrigin(0.5);

    }
    
    setupKeyboardHandlers() {
        // Multiple keyboard input options for better reliability
        this.input.keyboard.on('keydown-SPACE', () => {
            this.restartGame();
        });
        
        this.input.keyboard.on('keydown-ENTER', () => {
            this.restartGame();
        });
        
        this.input.keyboard.on('keydown-R', () => {
            this.restartGame();
        });
    }

    createCelebrationEffects() {
        // Create confetti-like particles
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const particle = this.add.circle(x, y, 3, 
                Phaser.Math.Between(0, 0xffffff));
            
            this.tweens.add({
                targets: particle,
                y: 600,
                alpha: 0,
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Power2',
                delay: Phaser.Math.Between(0, 1000)
            });
        }
    }

    restartGame() {
        console.log('restartGame() called');
        // Prevent multiple restarts
        if (this.restarting) {
            console.log('Already restarting, returning');
            return;
        }
        this.restarting = true;
        
        // Reset game state but keep difficulty and player settings
        console.log('Current gameState:', window.gameState);
        console.log('Players before reset:', window.gameState.players);
        
        // Ensure players array is properly initialized
        // Preserve the original playerCount - don't default to 1 if it exists
        const playerCount = window.gameState?.playerCount;
        const lives = window.gameState?.difficultySettings?.lives || 3;
        
        console.log('Current playerCount:', playerCount);
        console.log('Reinitializing players array for playerCount:', playerCount);
        
        if (!playerCount) {
            console.error('PlayerCount is missing! This should not happen.');
            return; // Don't restart if we don't know how many players
        }
        
        // Always reinitialize to ensure consistency
        window.gameState.players = [];
        for (let i = 0; i < playerCount; i++) {
            console.log(`Setting lives for restart Player ${i}: ${lives}`);
            
            const playerData = {
                id: i,
                score: 0,
                gemsCollected: 0,
                lives: lives,
                name: `Player ${i + 1}`
            };
            console.log(`Creating player ${i} with data:`, playerData);
            
            // Verify lives is set correctly during restart
            if (playerData.lives <= 0) {
                console.error(`🚨 BAD LIVES AT RESTART: Player ${i} created with ${playerData.lives} lives!`);
                playerData.lives = 3; // Emergency fallback
            }
            
            window.gameState.players.push(playerData);
        }
        
        console.log('Players after reset:', window.gameState.players);
        
        // SAFETY CHECK: Ensure no negative lives after reset
        window.gameState.players.forEach((player, index) => {
            if (player.lives < 0) {
                console.error(`🚨 NEGATIVE LIVES AFTER RESET: Player ${index} has ${player.lives}, fixing to ${lives}`);
                player.lives = lives;
            }
        });
        
        // Stop all tweens and clear input
        this.tweens.killAll();
        this.input.keyboard.removeAllListeners();
        
        console.log('Starting GameScene...');
        // Start the game scene and stop this scene
        this.scene.start('GameScene');
        this.scene.stop();
    }
    
    changeDifficulty() {
        console.log('changeDifficulty() called');
        // Prevent multiple actions
        if (this.restarting) {
            console.log('Already restarting, returning');
            return;
        }
        this.restarting = true;
        
        // Stop all tweens and clear input
        this.tweens.killAll();
        this.input.keyboard.removeAllListeners();
        
        console.log('Starting DifficultyScene...');
        // Go back to difficulty selection
        this.scene.start('DifficultyScene');
        this.scene.stop();
    }
}
