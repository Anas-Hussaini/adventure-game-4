class Player2 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Create a temporary texture for the sprite
        super(scene, x, y, null);
        
        // Create human-like shape
        this.createHumanShape(scene);
        
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set physics properties
        this.setCollideWorldBounds(true);
        this.setSize(24, 36); // Larger collision box to match visual bounds
        this.setOffset(4, 4); // Adjusted offset for better centering
        
        // Player properties
        this.playerId = null; // Will be set by GameScene
        this.speed = 150; // Will be set by difficulty
        this.isMoving = false;
        this.lastDirection = 'down';
        
        // Store original colors for effects
        this.normalColor = 0x9B59B6; // Purple color for player 2
        this.movingColor = 0xBB7DE6; // Lighter purple when moving
        this.damageColor = 0xFF4444; // Red when taking damage
        
        // Set initial tint to preserve original colors
        this.setTint(0xffffff);
    }
    
    createHumanShape(scene) {
        // Create graphics object for the purple knight
        const graphics = scene.add.graphics();
        
        // Knight's helmet (metallic purple)
        graphics.fillStyle(0x5B2C6F); // Dark purple metallic base
        graphics.fillCircle(16, 8, 8);
        
        // Helmet visor/face opening
        graphics.fillStyle(0x6C3483); // Purple-tinted metal
        graphics.fillRect(12, 6, 8, 4);
        
        // Helmet plume/crest (royal purple)
        graphics.fillStyle(0x8E44AD); // Bright purple plume
        graphics.fillRect(15, 2, 2, 6);
        
        // Knight's armor body (purple surcoat over chainmail)
        graphics.fillStyle(0x7D3C98); // Royal purple surcoat
        graphics.fillRect(9, 14, 14, 18);
        
        // Chainmail showing at edges
        graphics.fillStyle(0x85929E); // Silver chainmail
        graphics.fillRect(8, 16, 2, 14);
        graphics.fillRect(22, 16, 2, 14);
        
        // Arms in armor (metallic with purple accents)
        graphics.fillStyle(0x5B2C6F); // Dark purple metal armor
        graphics.fillRect(5, 16, 4, 12);
        graphics.fillRect(23, 16, 4, 12);
        
        // Purple armor accents on arms
        graphics.fillStyle(0x9B59B6);
        graphics.fillRect(6, 18, 2, 3);
        graphics.fillRect(24, 18, 2, 3);
        
        // Armored legs
        graphics.fillStyle(0x5B2C6F); // Dark purple metal
        graphics.fillRect(11, 32, 5, 12);
        graphics.fillRect(16, 32, 5, 12);
        
        // Knight's belt with mace
        graphics.fillStyle(0x8B4513); // Brown leather belt
        graphics.fillRect(9, 28, 14, 2);
        
        // Mace handle on belt
        graphics.fillStyle(0x654321); // Wooden handle
        graphics.fillRect(20, 26, 2, 6);
        
        // Mace head
        graphics.fillStyle(0x95A5A6); // Steel mace head
        graphics.fillCircle(21, 25, 2);
        
        // Eye slits in helmet
        graphics.fillStyle(0x9B59B6); // Purple glowing eyes
        graphics.fillCircle(13, 7, 1);
        graphics.fillCircle(19, 7, 1);
        
        // Generate texture from graphics with unique key to avoid conflicts
        const textureKey = `player2_human_${Date.now()}_${Math.random()}`;
        graphics.generateTexture(textureKey, 32, 44);
        
        // Set the texture to this sprite
        this.setTexture(textureKey);
        
        // Clean up the temporary graphics object
        graphics.destroy();
    }

    update(cursors) {
        // Reset velocity
        this.setVelocity(0);
        this.isMoving = false;

        // Handle movement - Arrow keys only
        let horizontalMovement = 0;
        let verticalMovement = 0;

        if (cursors.left.isDown) {
            horizontalMovement = -1;
        } else if (cursors.right.isDown) {
            horizontalMovement = 1;
        }

        if (cursors.up.isDown) {
            verticalMovement = -1;
        } else if (cursors.down.isDown) {
            verticalMovement = 1;
        }

        // Normalize diagonal movement
        if (horizontalMovement !== 0 && verticalMovement !== 0) {
            horizontalMovement *= 0.707;
            verticalMovement *= 0.707;
        }

        // Set velocity
        if (horizontalMovement !== 0 || verticalMovement !== 0) {
            this.setVelocity(horizontalMovement * this.speed, verticalMovement * this.speed);
            this.isMoving = true;
        }

        // Add some visual feedback
        this.updateVisualEffects();
    }

    updateVisualEffects() {
        // Add a subtle glow effect when moving
        if (this.isMoving) {
            this.setTint(this.movingColor);
        } else {
            this.setTint(0xffffff); // Normal white tint to show original colors
        }
    }

    takeDamage() {
        // Flash red when taking damage
        this.setTint(this.damageColor);
        
        // Create a small explosion effect
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.setTint(0xffffff); // Reset to normal
            }
        });
    }

    collectItem() {
        // Visual feedback for collecting items
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 150,
            yoyo: true
        });
        
        // Add sparkle effect
        this.createSparkleEffect();
    }

    createSparkleEffect() {
        // Create sparkles around the player
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const distance = 25;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            const sparkle = this.scene.add.circle(x, y, 2, 0x9b59b6);
            
            this.scene.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 1.5,
                duration: 400,
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        }
    }
}
