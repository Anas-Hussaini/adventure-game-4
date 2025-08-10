class Enemy extends Phaser.Physics.Arcade.Sprite {
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
        
        // Enemy properties
        this.speed = 80; // Slower speed for better gameplay
        this.direction = Phaser.Math.Between(0, 3); // 0: up, 1: right, 2: down, 3: left
        this.changeDirectionTimer = 0;
        this.changeDirectionInterval = 3000; // Change direction every 3 seconds
        this.frozen = true; // Start frozen
        
        // Store original colors for effects
        this.normalColor = 0xE74C3C; // Red color for enemies
        this.movingColor = 0xF7665A; // Lighter red when moving
        this.frozenColor = 0x666666; // Gray when frozen
        
        // Set initial tint - start frozen
        this.setTint(this.frozenColor);
    }
    
    createHumanShape(scene) {
        // Create graphics object for the dragon
        const graphics = scene.add.graphics();
        
        // Dragon head (larger, more menacing)
        graphics.fillStyle(0x8B0000); // Dark red dragon head
        graphics.fillEllipse(16, 8, 12, 10);
        
        // Dragon snout
        graphics.fillStyle(0xA0001A); // Slightly lighter red
        graphics.fillEllipse(20, 8, 6, 4);
        
        // Dragon horns
        graphics.fillStyle(0x2C3E50); // Dark gray horns
        graphics.fillRect(12, 2, 2, 6);
        graphics.fillRect(18, 2, 2, 6);
        
        // Dragon body (serpentine, powerful)
        graphics.fillStyle(0xC0392B); // Red dragon body
        graphics.fillEllipse(16, 20, 16, 20);
        
        // Dragon scales pattern
        graphics.fillStyle(0x922B21); // Darker red for scales
        graphics.fillRect(10, 16, 2, 2);
        graphics.fillRect(14, 18, 2, 2);
        graphics.fillRect(18, 16, 2, 2);
        graphics.fillRect(22, 18, 2, 2);
        graphics.fillRect(12, 22, 2, 2);
        graphics.fillRect(20, 22, 2, 2);
        
        // Dragon wings (folded)
        graphics.fillStyle(0x641E16); // Dark wing membrane
        graphics.fillEllipse(8, 18, 6, 12);
        graphics.fillEllipse(24, 18, 6, 12);
        
        // Wing bones
        graphics.fillStyle(0x2C3E50); // Dark gray wing bones
        graphics.fillRect(6, 16, 1, 8);
        graphics.fillRect(25, 16, 1, 8);
        
        // Dragon tail
        graphics.fillStyle(0xC0392B); // Red tail
        graphics.fillEllipse(16, 32, 8, 12);
        
        // Dragon claws/feet
        graphics.fillStyle(0x1C2833); // Black claws
        graphics.fillRect(10, 30, 3, 4);
        graphics.fillRect(19, 30, 3, 4);
        
        // Fierce dragon eyes
        graphics.fillStyle(0xFF4500); // Fiery orange eyes
        graphics.fillCircle(13, 6, 2);
        graphics.fillCircle(19, 6, 2);
        
        // Eye pupils
        graphics.fillStyle(0x000000); // Black pupils
        graphics.fillCircle(13, 6, 1);
        graphics.fillCircle(19, 6, 1);
        
        // Dragon nostrils
        graphics.fillStyle(0x000000); // Black nostrils
        graphics.fillCircle(21, 7, 1);
        graphics.fillCircle(21, 9, 1);
        
        // Generate texture from graphics with unique key to avoid conflicts
        const textureKey = `enemy_human_${Date.now()}_${Math.random()}`;
        graphics.generateTexture(textureKey, 32, 44);
        
        // Set the texture to this sprite
        this.setTexture(textureKey);
        
        // Clean up the temporary graphics object
        graphics.destroy();
    }

    update() {
        // Don't update if frozen
        if (this.frozen) return;
        
        // Update direction timer
        this.changeDirectionTimer += this.scene.game.loop.delta;
        
        // Change direction periodically
        if (this.changeDirectionTimer >= this.changeDirectionInterval) {
            this.changeDirection();
            this.changeDirectionTimer = 0;
        }
        
        // Move in current direction
        this.moveInDirection();
        
        // Add some visual effects
        this.updateVisualEffects();
    }

    moveInDirection() {
        // Reset velocity
        this.setVelocity(0);
        
        // Move based on direction
        switch (this.direction) {
            case 0: // Up
                this.setVelocityY(-this.speed);
                break;
            case 1: // Right
                this.setVelocityX(this.speed);
                break;
            case 2: // Down
                this.setVelocityY(this.speed);
                break;
            case 3: // Left
                this.setVelocityX(-this.speed);
                break;
        }
    }

    changeDirection() {
        // Randomly change direction
        this.direction = Phaser.Math.Between(0, 3);
        
        // Add a small visual effect when changing direction
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 100,
            yoyo: true
        });
    }

    updateVisualEffects() {
        // Change tint based on movement
        if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            this.setTint(this.movingColor);
        } else {
            this.setTint(0xffffff); // White tint to preserve original colors
        }
    }

    // Called when enemy hits a wall
    onWallHit() {
        // Change direction when hitting a wall
        this.changeDirection();
        
        // Add a bounce effect
        this.scene.tweens.add({
            targets: this,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 100,
            yoyo: true
        });
    }

    // Freeze the enemy (stop movement)
    freeze() {
        this.frozen = true;
        this.setVelocity(0);
        this.setTint(this.frozenColor); // Gray tint when frozen
    }

    // Unfreeze the enemy (start movement)
    unfreeze() {
        this.frozen = false;
        this.setTint(0xffffff); // White tint to preserve original colors
    }

    // Called when enemy is destroyed
    destroy() {
        // Simply call parent destroy method - no explosion effects
        super.destroy();
    }
}
