class DifficultyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyScene' });
        this.selectedDifficulty = 'normal';
        this.selectedPlayerCount = 1;
        this.difficultyButtons = [];
        this.playerCountButtons = [];
    }

    create() {
        // Create medieval castle background
        this.createMedievalBackground();
        
        // Create atmospheric elements
        this.createAtmosphericElements();
        
        // ===== HEADER SECTION =====
        // Add crown embellishment
        this.createTitleEmbellishments();
        
        // Main title with medieval styling
        const title = this.add.text(400, 55, 'Knights of the Realm', {
            fontSize: '32px',
            fill: '#F1C40F',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#8B4513',
            strokeThickness: 3
        });
        title.setOrigin(0.5);
        
        // Subtitle with royal styling
        const subtitle = this.add.text(400, 85, '⚔️ Choose Your Noble Quest ⚔️', {
            fontSize: '14px',
            fill: '#ECF0F1',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#2C3E50',
            strokeThickness: 1
        });
        subtitle.setOrigin(0.5);
        
        // ===== LEFT SECTION: KNIGHT SELECTION =====
        // Create refined shield background with proper margins
        this.createRefinedShieldBackground(180, 270, 280, 200);
        
        // Player count title with better positioning
        const playerCountTitle = this.add.text(180, 180, 'Select Knights', {
            fontSize: '16px',
            fill: '#F1C40F',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#8B4513',
            strokeThickness: 2
        });
        playerCountTitle.setOrigin(0.5);
        
        // Knight selection buttons with better spacing
        const playerCounts = [1, 2, 3];
        playerCounts.forEach((count, index) => {
            const x = 120 + (index * 60);
            const y = 220;
            
            // Create refined heraldic button
            this.createRefinedHeraldicButton(x, y, count, index);
        });
        
        // Controls info with better formatting
        const controlsInfo = this.add.text(180, 300, 'Controls:\n🛡️ Blue: WASD\n🛡️ Purple: Arrows\n🛡️ Green: IJKL', {
            fontSize: '11px',
            fill: '#ECF0F1',
            fontFamily: 'serif',
            lineSpacing: 3,
            align: 'center',
            stroke: '#2C3E50',
            strokeThickness: 1
        });
        controlsInfo.setOrigin(0.5);
        
        // ===== RIGHT SECTION: DIFFICULTY SELECTION =====
        // Create refined scroll background with proper margins
        this.createRefinedScrollBackground(560, 310, 320, 280);
        
        // Difficulty title with better positioning
        const difficultyTitle = this.add.text(560, 180, 'Quest Difficulty', {
            fontSize: '16px',
            fill: '#F1C40F',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#8B4513',
            strokeThickness: 2
        });
        difficultyTitle.setOrigin(0.5);
        
        // Difficulty levels configuration
        const difficulties = [
            {
                key: 'easy',
                name: 'Easy',
                description: 'Peaceful quest - 2 slow dragons, 5 lives, abundant treasures',
                color: 0x27ae60,
                textColor: '#27ae60'
            },
            {
                key: 'normal',
                name: 'Normal',
                description: 'Balanced quest - 4 dragons, 3 lives, moderate treasures',
                color: 0x3498db,
                textColor: '#3498db'
            },
            {
                key: 'hard',
                name: 'Hard',
                description: 'Perilous quest - 6 swift dragons, 2 lives, scarce treasures',
                color: 0xe67e22,
                textColor: '#e67e22'
            },
            {
                key: 'extreme',
                name: 'Extreme',
                description: 'Heroic ordeal - 8 lightning-fast dragons, 1 life!',
                color: 0xe74c3c,
                textColor: '#e74c3c'
            },
            {
                key: 'nightmare',
                name: 'Nightmare',
                description: 'LEGENDARY TRIAL - 10 ancient dragons, 1 life, rare treasures!',
                color: 0x8e44ad,
                textColor: '#8e44ad'
            }
        ];

        // Create refined difficulty buttons with proper margins and spacing
        const startY = 215;
        const spacing = 40;
        
        difficulties.forEach((diff, index) => {
            const y = startY + (index * spacing);
            
            // Button background with proper margins
            const button = this.add.rectangle(560, y, 300, 35, diff.color);
            button.setStrokeStyle(2, 0xffffff);
            button.setInteractive();
            button.setAlpha(this.selectedDifficulty === diff.key ? 1.0 : 0.85);
            
            // Difficulty name with better positioning
            const nameText = this.add.text(425, y - 3, diff.name, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: 'serif',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeThickness: 1
            });
            nameText.setOrigin(0, 0.5);
            
            // Difficulty description with better margins
            const descText = this.add.text(425, y + 10, diff.description, {
                fontSize: '9px',
                fill: '#ecf0f1',
                fontFamily: 'serif',
                wordWrap: { width: 260 }
            });
            descText.setOrigin(0, 0.5);
            
            // Store references
            const buttonData = {
                key: diff.key,
                button: button,
                nameText: nameText,
                descText: descText,
                color: diff.color
            };
            
            this.difficultyButtons.push(buttonData);
            
            // Enhanced button interactions
            button.on('pointerover', () => {
                button.setAlpha(1.0);
                button.setScale(1.03);
                // Store original color for restoration
                button.originalColor = diff.color;
                button.setFillStyle(0xffffff);
                nameText.setStyle({ fill: '#2C3E50' });
                descText.setStyle({ fill: '#34495E' });
            });
            
            button.on('pointerout', () => {
                if (this.selectedDifficulty !== diff.key) {
                    button.setAlpha(0.85);
                }
                button.setScale(1.0);
                // Restore original color
                button.setFillStyle(button.originalColor || diff.color);
                nameText.setStyle({ fill: '#ffffff' });
                descText.setStyle({ fill: '#ecf0f1' });
            });
            
            button.on('pointerdown', () => {
                this.selectDifficulty(diff.key);
            });
        });
        
        // ===== BOTTOM SECTION: START BUTTON =====
        // Create refined start button with proper spacing
        this.createRefinedStartButton(400, 485);
        
        // Instructions with better positioning
        const instructions = this.add.text(400, 535, '🏰 Select your party and difficulty, then embark on your quest 🏰', {
            fontSize: '12px',
            fill: '#F39C12',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#2C3E50',
            strokeThickness: 1
        });
        instructions.setOrigin(0.5);
        
        // Initialize selection
        this.selectDifficulty('normal');
        this.selectPlayerCount(1);
    }
    
    createMedievalBackground() {
        // Dark stone castle background
        this.add.rectangle(400, 300, 800, 600, 0x1C2833);
        
        // Add subtle castle stone texture
        this.createStoneTexture();
        
        // Create simple medieval border frame
        this.createMedievalFrame();
    }
    
    createStoneTexture() {
        // Create stone blocks across the background
        const stoneColors = [0x2C3E50, 0x34495E, 0x273746, 0x1C2833];
        
        for (let x = 0; x < 800; x += 80) {
            for (let y = 0; y < 600; y += 60) {
                const stoneWidth = Phaser.Math.Between(70, 90);
                const stoneHeight = Phaser.Math.Between(50, 70);
                const offsetX = Phaser.Math.Between(-5, 5);
                const offsetY = Phaser.Math.Between(-5, 5);
                const stoneColor = Phaser.Utils.Array.GetRandom(stoneColors);
                
                const stone = this.add.rectangle(x + 40 + offsetX, y + 30 + offsetY, stoneWidth, stoneHeight, stoneColor);
                stone.setStrokeStyle(1, 0x1A252F);
                stone.setAlpha(0.3);
                
                // Add occasional wear marks
                if (Phaser.Math.Between(1, 8) === 1) {
                    const wear = this.add.circle(stone.x + Phaser.Math.Between(-20, 20), stone.y + Phaser.Math.Between(-15, 15), 
                                               Phaser.Math.Between(3, 8), 0x1C2833);
                    wear.setAlpha(0.5);
                }
            }
        }
    }
    
    createMedievalFrame() {
        // Ornate castle border frame
        const frameThickness = 20;
        const frameColor = 0x8B4513; // Brown wood/stone
        const metalColor = 0xC0C0C0; // Silver metal accents
        
        // Main frame borders
        const topFrame = this.add.rectangle(400, 10, 800, frameThickness, frameColor);
        topFrame.setStrokeStyle(3, metalColor);
        
        const bottomFrame = this.add.rectangle(400, 590, 800, frameThickness, frameColor);
        bottomFrame.setStrokeStyle(3, metalColor);
        
        const leftFrame = this.add.rectangle(10, 300, frameThickness, 600, frameColor);
        leftFrame.setStrokeStyle(3, metalColor);
        
        const rightFrame = this.add.rectangle(790, 300, frameThickness, 600, frameColor);
        rightFrame.setStrokeStyle(3, metalColor);
        
        // Corner decorations (castle-style)
        [
            { x: 10, y: 10 }, { x: 790, y: 10 },    // Top corners
            { x: 10, y: 590 }, { x: 790, y: 590 }   // Bottom corners
        ].forEach(pos => {
            const corner = this.add.rectangle(pos.x, pos.y, 25, 25, metalColor);
            corner.setStrokeStyle(2, 0xFFD700); // Gold accent
            
            // Corner ornament
            const ornament = this.add.circle(pos.x, pos.y, 8, 0xFFD700);
            ornament.setStrokeStyle(1, frameColor);
        });
    }
    
    createAtmosphericElements() {
        // Add subtle corner ambiance (reduced)
        [
            { x: 50, y: 50 }, { x: 750, y: 50 },     // Top corners
            { x: 50, y: 550 }, { x: 750, y: 550 }    // Bottom corners
        ].forEach(pos => {
            const glow = this.add.circle(pos.x, pos.y, 8, 0xFF8C00);
            glow.setAlpha(0.2);
            
            // Gentle pulsing
            this.tweens.add({
                targets: glow,
                alpha: 0.1,
                scale: 0.8,
                duration: 3000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Add minimal floating particles
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(150, 450),
                Phaser.Math.Between(1, 2),
                0xFFD700
            );
            particle.setAlpha(0.3);
            
            // Floating animation
            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(50, 100),
                x: particle.x + Phaser.Math.Between(-20, 20),
                alpha: 0,
                duration: Phaser.Math.Between(6000, 10000),
                delay: Phaser.Math.Between(0, 5000),
                repeat: -1,
                yoyo: false,
                ease: 'Sine.easeOut'
            });
        }
    }
    
    createTitleEmbellishments() {
        // Simple royal crown above title
        const crown = this.add.polygon(400, 40, [
            0, 8,    // bottom center
            -12, 0,  // left point
            -8, -6,  // left peak
            0, -3,   // center dip
            8, -6,   // right peak  
            12, 0    // right point
        ], 0xFFD700);
        crown.setStrokeStyle(1, 0xFFA500);
        
        // Simple crown jewel
        const jewel = this.add.circle(400, 34, 2, 0xFF0000);
        jewel.setAlpha(0.9);
    }
    
    createDecorativeSword(x, y, orientation) {
        const graphics = this.add.graphics();
        
        // Sword blade
        graphics.fillStyle(0xC0C0C0);
        if (orientation === 'left') {
            graphics.fillRect(x, y - 15, 80, 4);
        } else {
            graphics.fillRect(x - 80, y - 15, 80, 4);
        }
        
        // Sword handle
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(x - 2, y - 17, 4, 8);
        
        // Sword guard
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(x - 8, y - 15, 16, 2);
        
        // Sword pommel
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(x, y - 25, 3);
        
        graphics.setAlpha(0.7);
    }
    
    createRefinedShieldBackground(x, y, width, height) {
        // Main shield background with gradient effect
        const shieldBg = this.add.rectangle(x, y, width, height, 0x2C3E50);
        shieldBg.setStrokeStyle(3, 0x8B4513);
        shieldBg.setAlpha(0.95);
        
        // Inner border for depth
        const innerBorder = this.add.rectangle(x, y, width - 20, height - 20, 0x34495E);
        innerBorder.setStrokeStyle(2, 0xFFD700);
        innerBorder.setAlpha(0.3);
        
        // Top accent
        const topAccent = this.add.rectangle(x, y - height/2 + 10, width - 30, 6, 0xFFD700);
        topAccent.setAlpha(0.8);
        
        // Bottom accent
        const bottomAccent = this.add.rectangle(x, y + height/2 - 10, width - 30, 6, 0xFFD700);
        bottomAccent.setAlpha(0.8);
    }
    
    createRefinedScrollBackground(x, y, width, height) {
        // Main parchment background
        const scrollBg = this.add.rectangle(x, y, width, height, 0xF4E4BC);
        scrollBg.setStrokeStyle(3, 0x8B4513);
        scrollBg.setAlpha(0.98);
        
        // Inner shadow effect
        const innerShadow = this.add.rectangle(x, y, width - 15, height - 15, 0xE6D3A3);
        innerShadow.setAlpha(0.4);
        
        // Decorative borders
        const topBorder = this.add.rectangle(x, y - height/2 + 15, width - 30, 4, 0x8B4513);
        topBorder.setAlpha(0.7);
        
        const bottomBorder = this.add.rectangle(x, y + height/2 - 15, width - 30, 4, 0x8B4513);
        bottomBorder.setAlpha(0.7);
        
        // Corner decorations
        [-width/2 + 20, width/2 - 20].forEach(xOffset => {
            [-height/2 + 20, height/2 - 20].forEach(yOffset => {
                const corner = this.add.circle(x + xOffset, y + yOffset, 3, 0x8B4513);
                corner.setAlpha(0.6);
            });
        });
    }
    
    createRefinedHeraldicButton(x, y, count, index) {
        const knightColors = [0x2980B9, 0x7D3C98, 0x229954]; // Blue, Purple, Green
        const color = knightColors[index];
        
        // Main button circle with better proportions
        const button = this.add.circle(x, y, 22, color);
        button.setStrokeStyle(3, 0xFFD700);
        button.setInteractive();
        button.setAlpha(this.selectedPlayerCount === count ? 1.0 : 0.8);
        
        // Inner glow effect
        const innerGlow = this.add.circle(x, y, 18, 0xFFFFFF);
        innerGlow.setAlpha(0.2);
        
        // Knight number with better styling
        const text = this.add.text(x, y, count.toString(), {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#2C3E50',
            strokeThickness: 2
        });
        text.setOrigin(0.5);
        
        // Small decorative crown
        const crown = this.add.polygon(x, y - 10, [
            0, 4, -4, 0, -2, -3, 0, -2, 2, -3, 4, 0
        ], 0xFFD700);
        crown.setScale(0.7);
        
        const buttonData = { count: count, button: button, text: text, crown: crown, innerGlow: innerGlow };
        this.playerCountButtons.push(buttonData);
        
        // Enhanced button interactions
        button.on('pointerover', () => {
            button.setAlpha(1.0);
            button.setScale(1.15);
            innerGlow.setAlpha(0.4);
            
            // Rotation effect
            this.tweens.add({
                targets: crown,
                angle: 10,
                duration: 200,
                yoyo: true
            });
        });
        
        button.on('pointerout', () => {
            if (this.selectedPlayerCount !== count) {
                button.setAlpha(0.8);
                innerGlow.setAlpha(0.2);
            }
            button.setScale(1.0);
            crown.setAngle(0);
        });
        
        button.on('pointerdown', () => {
            this.selectPlayerCount(count);
        });
    }
    
    createRefinedStartButton(x, y) {
        // Multi-layered button design
        const buttonShadow = this.add.rectangle(x + 2, y + 2, 220, 45, 0x000000);
        buttonShadow.setAlpha(0.3);
        
        const buttonBase = this.add.rectangle(x, y, 220, 45, 0x8B4513);
        buttonBase.setStrokeStyle(3, 0xFFD700);
        buttonBase.setInteractive();
        
        // Gradient effect layers
        const gradientTop = this.add.rectangle(x, y - 10, 210, 10, 0xA0522D);
        gradientTop.setAlpha(0.6);
        
        const gradientBottom = this.add.rectangle(x, y + 10, 210, 10, 0x654321);
        gradientBottom.setAlpha(0.4);
        
        // Inner highlight
        const innerHighlight = this.add.rectangle(x, y, 200, 25, 0xD4AC0D);
        innerHighlight.setAlpha(0.3);
        
        // Button text with enhanced styling
        const startText = this.add.text(x, y, '⚔️ BEGIN QUEST ⚔️', {
            fontSize: '16px',
            fill: '#FFFFFF',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#8B4513',
            strokeThickness: 2
        });
        startText.setOrigin(0.5);
        
        // Side decorative gems
        [-70, 70].forEach(xOffset => {
            const gem = this.add.circle(x + xOffset, y, 5, 0xFF0000);
            gem.setAlpha(0.9);
            gem.setStrokeStyle(1, 0xFFD700);
            
            // Subtle sparkle effect
            this.tweens.add({
                targets: gem,
                scaleX: 1.3,
                scaleY: 1.3,
                alpha: 0.6,
                duration: 2500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Enhanced button interactions
        buttonBase.on('pointerover', () => {
            buttonBase.setScale(1.05);
            buttonBase.setFillStyle(0xA0522D);
            innerHighlight.setAlpha(0.5);
            
            // Glow effect
            this.tweens.add({
                targets: [buttonBase, gradientTop, gradientBottom],
                scaleX: 1.08,
                scaleY: 1.08,
                duration: 300,
                ease: 'Power2'
            });
        });
        
        buttonBase.on('pointerout', () => {
            buttonBase.setScale(1.0);
            buttonBase.setFillStyle(0x8B4513);
            innerHighlight.setAlpha(0.3);
            gradientTop.setScale(1.0);
            gradientBottom.setScale(1.0);
        });
        
        buttonBase.on('pointerdown', () => {
            // Satisfying press effect
            this.tweens.add({
                targets: [buttonBase, gradientTop, gradientBottom, innerHighlight],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.startGame();
                }
            });
        });
    }
    
    createShieldBackground(x, y, width, height) {
        // Main shield body
        const shield = this.add.polygon(x, y, [
            0, -height/2 + 20,      // top center
            -width/2 + 20, -height/2 + 40,  // top left
            -width/2, -10,           // left middle
            -width/2, height/2 - 30,  // left bottom
            0, height/2,             // bottom point
            width/2, height/2 - 30,   // right bottom
            width/2, -10,            // right middle
            width/2 - 20, -height/2 + 40,   // top right
        ], 0x8B4513);
        shield.setStrokeStyle(4, 0xFFD700);
        shield.setAlpha(0.9);
        
        // Shield decorations
        const emblem = this.add.circle(x, y - 20, 25, 0x2C3E50);
        emblem.setStrokeStyle(3, 0xFFD700);
        
        // Heraldic cross
        const cross1 = this.add.rectangle(x, y - 20, 4, 30, 0xFFD700);
        const cross2 = this.add.rectangle(x, y - 20, 20, 4, 0xFFD700);
    }
    
    createScrollBackground(x, y, width, height) {
        // Main scroll parchment
        const scroll = this.add.rectangle(x, y, width, height, 0xF4E4BC);
        scroll.setStrokeStyle(3, 0x8B4513);
        scroll.setAlpha(0.95);
        
        // Scroll aging effects
        for (let i = 0; i < 8; i++) {
            const stain = this.add.circle(
                x + Phaser.Math.Between(-width/2 + 20, width/2 - 20),
                y + Phaser.Math.Between(-height/2 + 20, height/2 - 20),
                Phaser.Math.Between(8, 15),
                0xD4AC0D
            );
            stain.setAlpha(0.2);
        }
        
        // Scroll edges
        const leftEdge = this.add.rectangle(x - width/2, y, 8, height, 0xE6D3A3);
        leftEdge.setStrokeStyle(2, 0x8B4513);
        const rightEdge = this.add.rectangle(x + width/2, y, 8, height, 0xE6D3A3);
        rightEdge.setStrokeStyle(2, 0x8B4513);
        
        // Ornate borders
        const topBorder = this.add.rectangle(x, y - height/2 + 15, width - 40, 6, 0x8B4513);
        topBorder.setAlpha(0.8);
        const bottomBorder = this.add.rectangle(x, y + height/2 - 15, width - 40, 6, 0x8B4513);
        bottomBorder.setAlpha(0.8);
    }
    
    createHeraldicButton(x, y, count, index) {
        const knightColors = [0x2980B9, 0x7D3C98, 0x229954]; // Blue, Purple, Green
        const color = knightColors[index];
        
        // Knight shield button
        const button = this.add.polygon(x, y, [
            0, -25,      // top
            -20, -15,    // top left
            -25, 10,     // left
            -15, 30,     // bottom left
            0, 35,       // bottom point
            15, 30,      // bottom right
            25, 10,      // right
            20, -15      // top right
        ], color);
        button.setStrokeStyle(3, 0xFFD700);
        button.setInteractive();
        button.setAlpha(this.selectedPlayerCount === count ? 1.0 : 0.7);
        
        // Knight number in the center
        const text = this.add.text(x, y, count.toString(), {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#2C3E50',
            strokeThickness: 2
        });
        text.setOrigin(0.5);
        
        // Small knight helmet decoration
        const helmet = this.add.circle(x, y - 12, 5, 0xC0C0C0);
        helmet.setStrokeStyle(1, 0x85929E);
        
        const buttonData = { count: count, button: button, text: text, helmet: helmet };
        this.playerCountButtons.push(buttonData);
        
        // Button interactions
        button.on('pointerover', () => {
            button.setAlpha(1.0);
            button.setScale(1.1);
            this.tweens.add({
                targets: button,
                angle: 5,
                duration: 200,
                yoyo: true
            });
        });
        
        button.on('pointerout', () => {
            if (this.selectedPlayerCount !== count) {
                button.setAlpha(0.7);
            }
            button.setScale(1.0);
            button.setAngle(0);
        });
        
        button.on('pointerdown', () => {
            this.selectPlayerCount(count);
        });
    }
    
    createEpicStartButton(x = 400, y = 525) {
        
        // Compact button base
        const buttonBase = this.add.rectangle(x, y, 240, 50, 0x8B4513);
        buttonBase.setStrokeStyle(3, 0xFFD700);
        buttonBase.setInteractive();
        
        // Button inner glow
        const innerGlow = this.add.rectangle(x, y, 230, 40, 0xD4AC0D);
        innerGlow.setAlpha(0.3);
        
        // Button text with royal styling
        const startText = this.add.text(x, y, '⚔️ BEGIN QUEST ⚔️', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'serif',
            fontWeight: 'bold',
            stroke: '#8B4513',
            strokeThickness: 2
        });
        startText.setOrigin(0.5);
        
        // Decorative gems on button (smaller and closer)
        [-60, 60].forEach(xOffset => {
            const gem = this.add.circle(x + xOffset, y, 6, 0xFF0000);
            gem.setAlpha(0.9);
            gem.setStrokeStyle(1, 0xFFD700);
            
            // Gem sparkle effect
            this.tweens.add({
                targets: gem,
                scaleX: 1.2,
                scaleY: 1.2,
                alpha: 0.6,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Button interactions
        buttonBase.on('pointerover', () => {
            buttonBase.setScale(1.05);
            buttonBase.setFillStyle(0xA0522D);
            innerGlow.setAlpha(0.5);
            
            // Epic glow effect
            this.tweens.add({
                targets: [buttonBase, innerGlow],
                scaleX: 1.08,
                scaleY: 1.08,
                duration: 300,
                ease: 'Power2'
            });
        });
        
        buttonBase.on('pointerout', () => {
            buttonBase.setScale(1.0);
            buttonBase.setFillStyle(0x8B4513);
            innerGlow.setAlpha(0.3);
            innerGlow.setScale(1.0);
        });
        
        buttonBase.on('pointerdown', () => {
            // Epic button press effect
            this.tweens.add({
                targets: buttonBase,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.startGame();
                }
            });
        });
    }
    
    selectDifficulty(difficultyKey) {
        this.selectedDifficulty = difficultyKey;
        
        // Update button appearances
        this.difficultyButtons.forEach(buttonData => {
            if (buttonData.key === difficultyKey) {
                buttonData.button.setAlpha(1.0);
                buttonData.button.setStrokeStyle(4, 0xffff00); // Yellow border for selected
            } else {
                buttonData.button.setAlpha(0.7);
                buttonData.button.setStrokeStyle(4, 0xffffff); // White border for unselected
            }
        });
        
        // Store difficulty settings
        this.setGameParameters();
    }
    
    selectPlayerCount(playerCount) {
        this.selectedPlayerCount = playerCount;
        
        // Update button appearances with refined styling
        this.playerCountButtons.forEach(buttonData => {
            if (buttonData.count === playerCount) {
                buttonData.button.setAlpha(1.0);
                buttonData.button.setStrokeStyle(3, 0xffff00); // Yellow border for selected
                if (buttonData.innerGlow) buttonData.innerGlow.setAlpha(0.4);
            } else {
                buttonData.button.setAlpha(0.8);
                buttonData.button.setStrokeStyle(3, 0xFFD700); // Gold border for unselected
                if (buttonData.innerGlow) buttonData.innerGlow.setAlpha(0.2);
            }
        });
        
        // Update game parameters
        this.setGameParameters();
    }
    
    setGameParameters() {
        const difficulty = this.selectedDifficulty;
        const playerCount = this.selectedPlayerCount;
        // Initialize game state with difficulty settings
        window.gameState = window.gameState || {};
        
        const difficultySettings = {
            easy: {
                playerSpeed: 180,
                enemySpeed: 50,
                enemyCount: 2,
                lives: 5,
                gemsCount: { min: 15, max: 20 },
                enemyDirectionChangeInterval: 5000,
                scoreMultiplier: 0.5
            },
            normal: {
                playerSpeed: 150,
                enemySpeed: 80,
                enemyCount: 4,
                lives: 3,
                gemsCount: { min: 8, max: 12 },
                enemyDirectionChangeInterval: 3000,
                scoreMultiplier: 1.0
            },
            hard: {
                playerSpeed: 120,
                enemySpeed: 130,
                enemyCount: 6,
                lives: 2,
                gemsCount: { min: 5, max: 8 },
                enemyDirectionChangeInterval: 1800,
                scoreMultiplier: 2.0
            },
            extreme: {
                playerSpeed: 100,
                enemySpeed: 170,
                enemyCount: 8,
                lives: 1,
                gemsCount: { min: 4, max: 6 },
                enemyDirectionChangeInterval: 1200,
                scoreMultiplier: 3.5
            },
            nightmare: {
                playerSpeed: 80,
                enemySpeed: 220,
                enemyCount: 10,
                lives: 1,
                gemsCount: { min: 3, max: 4 },
                enemyDirectionChangeInterval: 800,
                scoreMultiplier: 5.0
            }
        };
        
        // Set game parameters
        window.gameState.difficulty = difficulty;
        window.gameState.playerCount = playerCount;
        window.gameState.difficultySettings = difficultySettings[difficulty];
        
        // Initialize player data for multiplayer
        window.gameState.players = [];
        console.log('Difficulty settings:', difficultySettings[difficulty]);
        console.log('Lives from difficulty:', difficultySettings[difficulty].lives);
        
        for (let i = 0; i < playerCount; i++) {
            const livesValue = difficultySettings[difficulty].lives;
            console.log(`Setting lives for Player ${i}: ${livesValue} (from difficulty ${difficulty})`);
            
            const playerData = {
                id: i,
                score: 0,
                gemsCollected: 0,
                lives: livesValue,
                name: `Player ${i + 1}`
            };
            console.log(`Initial creation - Player ${i}:`, playerData);
            
            // Verify lives is set correctly
            if (playerData.lives <= 0) {
                console.error(`🚨 BAD LIVES AT CREATION: Player ${i} created with ${playerData.lives} lives!`);
                playerData.lives = 3; // Emergency fallback
            }
            
            window.gameState.players.push(playerData);
        }
        
        console.log('All players created:', window.gameState.players);
    }
    
    startGame() {
        // Add transition effect
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
}
