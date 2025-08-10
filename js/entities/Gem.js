class Gem extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Create the actual treasure texture first (but don't use 'this' yet)
        const treasureTexture = Gem.createTreasureTexture(scene);
        
        // Call super constructor with the treasure texture
        super(scene, x, y, treasureTexture);
        
        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set physics properties
        this.setSize(16, 16);
        this.setOffset(4, 4);
        
        // Treasure properties
        this.value = 10;
        this.collected = false;
        
        // Add subtle glow effect for magical treasure
        this.setTint(0xFFD700); // Golden tint
        
        // Add floating animation
        this.startFloatingAnimation(scene);
    }
    
    static createTreasureTexture(scene) {
        // Create graphics object for medieval treasure
        const graphics = scene.add.graphics();
        
        // Randomly choose treasure type
        const treasureType = Phaser.Math.Between(1, 3);
        
        if (treasureType === 1) {
            // Gold coin
            graphics.fillStyle(0xFFD700); // Gold
            graphics.fillCircle(12, 12, 8);
            graphics.fillStyle(0xFFA500); // Darker gold for inner circle
            graphics.fillCircle(12, 12, 6);
            graphics.fillStyle(0xFFD700); // Bright gold center
            graphics.fillCircle(12, 12, 3);
        } else if (treasureType === 2) {
            // Ruby gem
            graphics.fillStyle(0xE74C3C); // Ruby red
            graphics.fillRect(8, 6, 8, 12);
            graphics.fillStyle(0xC0392B); // Darker red
            graphics.fillRect(10, 8, 4, 8);
            graphics.fillStyle(0xFF6B6B); // Bright red highlight
            graphics.fillRect(11, 9, 2, 2);
        } else {
            // Magical crystal
            graphics.fillStyle(0x9B59B6); // Purple crystal
            graphics.fillRect(10, 4, 4, 16);
            graphics.fillStyle(0x8E44AD); // Darker purple
            graphics.fillRect(11, 6, 2, 12);
            graphics.fillStyle(0xD2B4DE); // Light purple glow
            graphics.fillRect(12, 8, 1, 8);
        }
        
        // Generate texture with unique key
        const textureKey = `treasure_${Date.now()}_${Math.random()}`;
        graphics.generateTexture(textureKey, 24, 24);
        
        // Clean up graphics
        graphics.destroy();
        
        return textureKey;
    }
    
    startFloatingAnimation(scene) {
        // Add gentle floating animation
        scene.tweens.add({
            targets: this,
            y: this.y - 3,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add rotation for magical effect
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    collect() {
        if (this.collected) return;
        
        this.collected = true;
        
        // Create collection effect
        this.createCollectionEffect();
        
        // Destroy the gem
        this.destroy();
    }

    createCollectionEffect() {
        // Create magical sparkle effect
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 25;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            // Create golden sparkle
            const sparkle = this.scene.add.circle(x, y, 3, 0xFFD700);
            
            this.scene.tweens.add({
                targets: sparkle,
                x: x + Math.cos(angle) * 40,
                y: y + Math.sin(angle) * 40,
                alpha: 0,
                scale: 0,
                duration: 800,
                onComplete: () => {
                    sparkle.destroy();
                }
            });
        }
        
        // Create magical burst effect
        const burst = this.scene.add.circle(this.x, this.y, 5, 0xFFF700);
        this.scene.tweens.add({
            targets: burst,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 400,
            onComplete: () => {
                burst.destroy();
            }
        });
        
        // Create medieval-style score text effect
        const scoreText = this.scene.add.text(this.x, this.y - 20, '+' + this.value + ' Gold', {
            fontSize: '14px',
            fill: '#FFD700',
            stroke: '#8B4513',
            strokeThickness: 2,
            fontFamily: 'serif',
            fontWeight: 'bold'
        });
        scoreText.setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: scoreText,
            y: scoreText.y - 40,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => {
                scoreText.destroy();
            }
        });
    }
}
