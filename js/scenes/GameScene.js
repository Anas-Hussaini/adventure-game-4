class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        console.log('GameScene: constructor called');
        this.players = []; // Array of players
        this.enemies = null;
        this.gems = null;
        this.walls = null;
        this.trees = null; // New: track trees for collisions
        this.playerTexts = []; // Array of score/lives texts for each player
        this.cursors = null;
        this.wasd = null;
        this.ijkl = null;
        this.gameOver = false;
        this.gameStarted = false; // New: track if game has started
    }

    create() {
        console.log('GameScene: create started');
        // Reset game state
        this.gameOver = false;
        this.gameStarted = false; // Game starts frozen
        
        // Clear any existing players array to prevent corruption
        this.players = [];
        
        // Debug: Log initial game state
        console.log('Initial gameState on create:', window.gameState);
        if (window.gameState.players) {
            window.gameState.players.forEach((player, index) => {
                console.log(`Initial player ${index}:`, player);
                if (player.lives < 0) {
                    console.error(`🚨 NEGATIVE LIVES DETECTED AT START: Player ${index} has ${player.lives} lives`);
                    console.trace('Stack trace for negative lives');
                }
            });
        }
        
        // Add watchers for lives changes
        this.setupLivesWatchers();
        
        // TEMPORARY FIX: Reset any negative lives to positive values
        this.fixNegativeLives();
        
        // Create the world
        this.createWorld();
        
        // Create players based on player count
        this.createPlayers();
        
        // Create temporary spawn barriers for players
        this.createSpawnBarriers();
        
        // Create groups
        this.enemies = this.physics.add.group();
        this.gems = this.physics.add.group();
        this.trees = this.physics.add.staticGroup(); // New: trees group
        
        // Create trees first (needed for gem placement collision detection)
        this.createTrees();
        
        // Create enemies
        this.createEnemies();
        
        // Create gems (after trees and walls are created)
        this.createGems();
        
        // Setup collisions
        this.setupCollisions();
        
        // Create UI
        this.createUI();
        
        // Setup camera - smaller bounds for better gameplay
        this.cameras.main.setBounds(0, 0, 800, 600);
        // Follow first player in multiplayer
        if (this.players.length > 0) {
            this.cameras.main.startFollow(this.players[0], true, 0.1, 0.1);
        }
        
        // Setup input - ensure clean initialization
        this.setupInput();
        
        // Add start instruction
        this.startText = this.add.text(400, 300, 'Press any movement key to start!', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000',
            strokeThickness: 4
        });
        this.startText.setOrigin(0.5);
        this.startText.setScrollFactor(0);
        
        console.log('GameScene: create completed successfully');
    }
    
    setupLivesWatchers() {
        // Store original lives values for comparison
        if (window.gameState.players) {
            this.originalLives = window.gameState.players.map(p => p.lives);
            console.log('Original lives stored:', this.originalLives);
        }
    }
    
    fixNegativeLives() {
        if (window.gameState.players) {
            const correctLives = window.gameState?.difficultySettings?.lives || 3;
            let fixedAny = false;
            
            window.gameState.players.forEach((player, index) => {
                if (player.lives < 0) {
                    console.warn(`🔧 FIXING: Player ${index} had ${player.lives} lives, setting to ${correctLives}`);
                    player.lives = correctLives;
                    fixedAny = true;
                }
            });
            
            if (fixedAny) {
                console.log('Fixed players:', window.gameState.players);
            }
        }
    }

    setupInput() {
        // Clear any existing input handlers
        if (this.cursors) {
            this.input.keyboard.removeAllListeners();
        }
        
        // Create fresh input handlers for all players
        this.cursors = this.input.keyboard.createCursorKeys(); // Player 2 (Arrow keys)
        this.wasd = this.input.keyboard.addKeys('W,S,A,D'); // Player 1 (WASD)
        this.ijkl = this.input.keyboard.addKeys('I,J,K,L'); // Player 3 (IJKL)
    }

    createWorld() {
        // Create medieval castle interior background with gradient
        const bg = this.add.rectangle(400, 300, 800, 600, 0x1C2833);
        
        // Add atmospheric depth with gradient overlay
        const gradient = this.add.rectangle(400, 300, 800, 600, 0x273746);
        gradient.setAlpha(0.6);
        
        // Create detailed stone floor
        this.createCastleFloor();
        
        // Create castle walls and obstacles using detailed graphics
        this.walls = this.physics.add.staticGroup();
        
        // Create detailed castle border walls
        this.createCastleBorderWalls();
        
        // Add decorative castle elements
        this.addCastleDecorations();
        
        // Random interior walls - different layout each game (now detailed castle structures)
        this.createRandomWalls();
    }

    createCastleFloor() {
        // Create realistic stone floor with irregular patterns
        const stoneColors = [0x34495E, 0x2C3E50, 0x3F5A6C, 0x273746];
        
        for (let x = 0; x < 800; x += 30) {
            for (let y = 0; y < 600; y += 30) {
                // Vary stone sizes for realism
                const stoneWidth = Phaser.Math.Between(25, 35);
                const stoneHeight = Phaser.Math.Between(25, 35);
                const offsetX = Phaser.Math.Between(-3, 3);
                const offsetY = Phaser.Math.Between(-3, 3);
                
                const stoneColor = Phaser.Utils.Array.GetRandom(stoneColors);
                const stone = this.add.rectangle(x + 15 + offsetX, y + 15 + offsetY, stoneWidth, stoneHeight, stoneColor);
                
                // Add mortar lines (darker edges)
                stone.setStrokeStyle(2, 0x1C2833);
                stone.setAlpha(0.8);
                
                // Add subtle wear patterns
                if (Phaser.Math.Between(1, 10) === 1) {
                    const wear = this.add.circle(stone.x + Phaser.Math.Between(-10, 10), 
                                                stone.y + Phaser.Math.Between(-10, 10), 
                                                Phaser.Math.Between(3, 8), 0x1C2833);
                    wear.setAlpha(0.3);
                }
            }
        }
    }

    createCastleBorderWalls() {
        // Create detailed castle border walls with stone block patterns
        
        // Top wall
        const topWall = this.createDetailedWall(400, 16, 800, 32, 'horizontal');
        this.walls.add(topWall);
        
        // Bottom wall  
        const bottomWall = this.createDetailedWall(400, 584, 800, 32, 'horizontal');
        this.walls.add(bottomWall);
        
        // Left wall
        const leftWall = this.createDetailedWall(16, 300, 32, 600, 'vertical');
        this.walls.add(leftWall);
        
        // Right wall
        const rightWall = this.createDetailedWall(784, 300, 32, 600, 'vertical');
        this.walls.add(rightWall);
    }

    createDetailedWall(x, y, width, height, orientation) {
        // Create the main collision rectangle with physics first (at world coordinates)
        const baseWall = this.add.rectangle(x, y, width, height, 0x566573);
        baseWall.setStrokeStyle(3, 0x34495E);
        this.physics.add.existing(baseWall, true);
        
        // Add stone block pattern - visual only
        const blockSize = orientation === 'horizontal' ? 60 : 40;
        
        if (orientation === 'horizontal') {
            // Horizontal wall - create stone blocks along the length
            for (let i = -width/2; i < width/2; i += blockSize) {
                for (let j = -height/2; j < height/2; j += 20) {
                    const block = this.add.rectangle(x + i + blockSize/2, y + j + 10, blockSize - 2, 18, 0x5D6D7E);
                    block.setStrokeStyle(1, 0x34495E);
                    block.setAlpha(0.9);
                    
                    // Add stone texture details
                    if (Phaser.Math.Between(1, 3) === 1) {
                        const detail = this.add.rectangle(x + i + blockSize/2 + Phaser.Math.Between(-15, 15), 
                                                        y + j + 10, 
                                                        Phaser.Math.Between(3, 8), 
                                                        Phaser.Math.Between(2, 6), 
                                                        0x4A5A6C);
                        detail.setAlpha(0.6);
                    }
                }
            }
        } else {
            // Vertical wall - create stone blocks along the height
            for (let i = -width/2; i < width/2; i += 20) {
                for (let j = -height/2; j < height/2; j += blockSize) {
                    const block = this.add.rectangle(x + i + 10, y + j + blockSize/2, 18, blockSize - 2, 0x5D6D7E);
                    block.setStrokeStyle(1, 0x34495E);
                    block.setAlpha(0.9);
                    
                    // Add stone texture details
                    if (Phaser.Math.Between(1, 3) === 1) {
                        const detail = this.add.rectangle(x + i + 10, 
                                                        y + j + blockSize/2 + Phaser.Math.Between(-15, 15), 
                                                        Phaser.Math.Between(2, 6), 
                                                        Phaser.Math.Between(3, 8), 
                                                        0x4A5A6C);
                        detail.setAlpha(0.6);
                    }
                }
            }
        }
        
        // Add lighting effects
        const highlight = this.add.rectangle(x - 2, y - 2, width, height, 0x85929E);
        highlight.setAlpha(0.1);
        
        const shadow = this.add.rectangle(x + 2, y + 2, width, height, 0x1C2833);
        shadow.setAlpha(0.3);
        
        return baseWall;
    }

    addCastleDecorations() {
        // Add subtle wall sconces (much less intrusive than torches)
        const sconcePositions = [
            { x: 150, y: 60 }, { x: 650, y: 60 },    // Top wall sconces
            { x: 150, y: 540 }, { x: 650, y: 540 },  // Bottom wall sconces
            { x: 60, y: 200 }, { x: 60, y: 400 },    // Left wall sconces
            { x: 740, y: 200 }, { x: 740, y: 400 }   // Right wall sconces
        ];
        
        sconcePositions.forEach(pos => {
            // Subtle stone sconce base
            const sconceBase = this.add.circle(pos.x, pos.y, 8, 0x566573);
            sconceBase.setAlpha(0.6);
            sconceBase.setStrokeStyle(1, 0x34495E);
            
            // Small gentle glow (no annoying animation)
            const glow = this.add.circle(pos.x, pos.y - 3, 4, 0xFF8C00);
            glow.setAlpha(0.4);
            
            // Very subtle gentle pulse (much slower and less noticeable)
            this.tweens.add({
                targets: glow,
                alpha: 0.2,
                duration: 3000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Add heraldic banners (representing the three knight orders)
        const bannerPositions = [
            { x: 200, y: 80 }, { x: 400, y: 80 }, { x: 600, y: 80 }
        ];
        
        bannerPositions.forEach((pos, index) => {
            const colors = [0x2980B9, 0x7D3C98, 0x229954]; // Blue, Purple, Green (matching knight colors)
            
            // Banner pole
            const pole = this.add.rectangle(pos.x - 18, pos.y, 4, 60, 0x8B4513);
            pole.setAlpha(0.8);
            
            // Banner fabric
            const banner = this.add.rectangle(pos.x, pos.y, 30, 50, colors[index]);
            banner.setAlpha(0.7);
            banner.setStrokeStyle(2, 0xF1C40F); // Gold trim
            
            // Heraldic symbol on banner
            const symbol = this.add.circle(pos.x, pos.y, 8, 0xF1C40F);
            symbol.setAlpha(0.9);
            
            // Very subtle banner movement
            this.tweens.add({
                targets: banner,
                x: pos.x + 2,
                duration: 4000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Add decorative stone carvings on walls (purely visual)
        const carvingPositions = [
            { x: 400, y: 40 }, { x: 400, y: 560 }, // Top and bottom center
            { x: 40, y: 300 }, { x: 760, y: 300 }  // Left and right center
        ];
        
        carvingPositions.forEach(pos => {
            // Stone carving background
            const carvingBg = this.add.rectangle(pos.x, pos.y, 20, 20, 0x4A5A6C);
            carvingBg.setAlpha(0.6);
            
            // Carved detail
            const detail = this.add.circle(pos.x, pos.y, 6, 0x34495E);
            detail.setAlpha(0.8);
        });
    }

    createRandomWalls() {
        // Define possible castle interior configurations
        const castleConfigs = [
            // Configuration 1: Castle pillars
            [
                { x: 200, y: 200, width: 40, height: 40, type: 'pillar' },
                { x: 600, y: 200, width: 40, height: 40, type: 'pillar' },
                { x: 400, y: 350, width: 40, height: 40, type: 'pillar' }
            ],
            // Configuration 2: Castle columns
            [
                { x: 150, y: 250, width: 50, height: 120, type: 'column' },
                { x: 400, y: 150, width: 50, height: 120, type: 'column' },
                { x: 650, y: 300, width: 50, height: 120, type: 'column' }
            ],
            // Configuration 3: Mixed castle structures
            [
                { x: 250, y: 180, width: 60, height: 60, type: 'pillar' },
                { x: 500, y: 250, width: 40, height: 100, type: 'column' },
                { x: 350, y: 400, width: 80, height: 40, type: 'wall' }
            ],
            // Configuration 4: Castle chamber layout
            [
                { x: 200, y: 150, width: 80, height: 40, type: 'wall' },
                { x: 200, y: 200, width: 40, height: 80, type: 'column' },
                { x: 500, y: 350, width: 80, height: 40, type: 'wall' },
                { x: 580, y: 350, width: 40, height: 80, type: 'column' }
            ],
            // Configuration 5: Central throne room
            [
                { x: 350, y: 150, width: 100, height: 40, type: 'wall' },
                { x: 350, y: 450, width: 100, height: 40, type: 'wall' },
                { x: 300, y: 300, width: 50, height: 50, type: 'pillar' },
                { x: 500, y: 300, width: 50, height: 50, type: 'pillar' }
            ],
            // Configuration 6: Castle courtyard
            [
                { x: 150, y: 150, width: 60, height: 40, type: 'wall' },
                { x: 150, y: 170, width: 40, height: 60, type: 'column' },
                { x: 600, y: 150, width: 60, height: 40, type: 'wall' },
                { x: 640, y: 170, width: 40, height: 60, type: 'column' },
                { x: 150, y: 420, width: 60, height: 40, type: 'wall' },
                { x: 150, y: 440, width: 40, height: 60, type: 'column' },
                { x: 600, y: 420, width: 60, height: 40, type: 'wall' },
                { x: 640, y: 440, width: 40, height: 60, type: 'column' }
            ]
        ];
        
        // Pick a random castle configuration
        const selectedConfig = castleConfigs[Phaser.Math.Between(0, castleConfigs.length - 1)];
        
        // Create detailed castle structures from the selected configuration
        selectedConfig.forEach(structureData => {
            const structure = this.createDetailedStructure(structureData);
            this.walls.add(structure);
        });
    }

    createDetailedStructure(structureData) {
        const { x, y, width, height, type } = structureData;
        
        if (type === 'pillar') {
            return this.createDetailedPillar(x, y, width, height);
        } else if (type === 'column') {
            return this.createDetailedColumn(x, y, width, height);
        } else {
            return this.createDetailedWallSegment(x, y, width, height);
        }
    }

    createDetailedPillar(x, y, width, height) {
        // Create the main collision rectangle with physics first
        const basePillar = this.add.rectangle(x, y, width, height, 0x5D6D7E);
        basePillar.setStrokeStyle(3, 0x34495E);
        this.physics.add.existing(basePillar, true);
        
        // Add decorative elements (visual only, no physics)
        // Pillar capital (decorative top)
        const capital = this.add.rectangle(x, y - height/2 - 5, width + 8, 10, 0x6C7B7F);
        capital.setStrokeStyle(2, 0x4A5A6C);
        
        // Pillar base
        const base = this.add.rectangle(x, y + height/2 + 5, width + 8, 10, 0x6C7B7F);
        base.setStrokeStyle(2, 0x4A5A6C);
        
        // Add carved details
        for (let i = -height/2 + 10; i < height/2 - 10; i += 15) {
            const carving = this.add.rectangle(x, y + i, width - 6, 3, 0x4A5A6C);
            carving.setAlpha(0.8);
        }
        
        // Add golden ornament
        const ornament = this.add.circle(x, y, 6, 0xF1C40F);
        ornament.setAlpha(0.8);
        ornament.setStrokeStyle(1, 0xD4AC0D);
        
        // Add lighting effects
        const highlight = this.add.rectangle(x - 2, y - 2, width, height, 0x85929E);
        highlight.setAlpha(0.15);
        
        return basePillar;
    }

    createDetailedColumn(x, y, width, height) {
        // Create the main collision rectangle with physics first
        const baseColumn = this.add.rectangle(x, y, width, height, 0x566573);
        baseColumn.setStrokeStyle(3, 0x2C3E50);
        this.physics.add.existing(baseColumn, true);
        
        // Add fluting (vertical grooves) - visual only
        const numFlutes = 6;
        for (let i = 0; i < numFlutes; i++) {
            const fluteX = x - width/2 + (width/numFlutes) * i + width/(numFlutes*2);
            const flute = this.add.rectangle(fluteX, y, width/numFlutes - 2, height - 4, 0x4A5A6C);
            flute.setAlpha(0.6);
        }
        
        // Add decorative capital
        const capitalHeight = 12;
        const capital = this.add.rectangle(x, y - height/2 - capitalHeight/2, width + 10, capitalHeight, 0x6C7B7F);
        capital.setStrokeStyle(2, 0x5D6D7E);
        
        // Add carved details to capital
        const capitalDetail = this.add.rectangle(x, y - height/2 - capitalHeight/2, width + 6, 4, 0xF1C40F);
        capitalDetail.setAlpha(0.7);
        
        // Add base
        const baseHeight = 8;
        const columnBase = this.add.rectangle(x, y + height/2 + baseHeight/2, width + 6, baseHeight, 0x6C7B7F);
        columnBase.setStrokeStyle(2, 0x5D6D7E);
        
        return baseColumn;
    }

    createDetailedWallSegment(x, y, width, height) {
        // Create the main collision rectangle with physics first
        const baseWall = this.add.rectangle(x, y, width, height, 0x6C7B7F);
        baseWall.setStrokeStyle(3, 0x34495E);
        this.physics.add.existing(baseWall, true);
        
        // Add stone block pattern - visual only
        const blockWidth = 25;
        const blockHeight = 15;
        
        for (let i = -width/2; i < width/2; i += blockWidth) {
            for (let j = -height/2; j < height/2; j += blockHeight) {
                const block = this.add.rectangle(x + i + blockWidth/2, y + j + blockHeight/2, blockWidth - 1, blockHeight - 1, 0x5D6D7E);
                block.setStrokeStyle(1, 0x4A5A6C);
                block.setAlpha(0.9);
                
                // Add weathering details
                if (Phaser.Math.Between(1, 4) === 1) {
                    const weathering = this.add.circle(x + i + blockWidth/2 + Phaser.Math.Between(-8, 8), 
                                                     y + j + blockHeight/2 + Phaser.Math.Between(-5, 5), 
                                                     Phaser.Math.Between(2, 4), 0x4A5A6C);
                    weathering.setAlpha(0.5);
                }
            }
        }
        
        // Add crenellations (castle wall teeth) if it's a horizontal wall
        if (width > height) {
            const crenellationWidth = 20;
            const crenellationHeight = 8;
            
            for (let i = -width/2; i < width/2; i += crenellationWidth * 2) {
                const crenellation = this.add.rectangle(x + i + crenellationWidth/2, 
                                                       y - height/2 - crenellationHeight/2, 
                                                       crenellationWidth, crenellationHeight, 0x5D6D7E);
                crenellation.setStrokeStyle(1, 0x34495E);
            }
        }
        
        return baseWall;
    }

    createTrees() {
        // Generate random armor stand/statue positions that avoid walls
        const numStands = Phaser.Math.Between(6, 10);
        const placedStands = [];
        let attempts = 0;
        const maxAttempts = 100;
        
        while (placedStands.length < numStands && attempts < maxAttempts) {
            attempts++;
            
            // Generate random position within game bounds (with padding)
            const x = Phaser.Math.Between(70, 730);
            const y = Phaser.Math.Between(70, 530);
            
            // Check if position is valid for an armor stand
            if (this.isValidTreePosition(x, y)) {
                const armorStand = this.createArmorStand(x, y);
                this.trees.add(armorStand);
                placedStands.push({ x, y });
            }
        }
        
        // If we couldn't place enough armor stands, try some fallback positions
        if (placedStands.length < 4) {
            const fallbackPositions = [
                { x: 120, y: 120 }, { x: 680, y: 120 }, { x: 120, y: 480 }, { x: 680, y: 480 },
                { x: 200, y: 200 }, { x: 600, y: 200 }, { x: 200, y: 400 }, { x: 600, y: 400 }
            ];
            
            for (const pos of fallbackPositions) {
                if (placedStands.length >= numStands) break;
                if (this.isValidTreePosition(pos.x, pos.y)) {
                    const armorStand = this.createArmorStand(pos.x, pos.y);
                    this.trees.add(armorStand);
                    placedStands.push(pos);
                }
            }
        }
    }

    createArmorStand(x, y) {
        // Create armor stand graphics
        const graphics = this.add.graphics();
        graphics.x = x;
        graphics.y = y;
        
        // Randomly choose armor stand type
        const standType = Phaser.Math.Between(1, 3);
        
        if (standType === 1) {
            // Knight armor stand
            graphics.fillStyle(0x566573); // Metal armor
            graphics.fillRect(-8, -15, 16, 25);
            graphics.fillStyle(0x2C3E50); // Dark details
            graphics.fillRect(-6, -12, 12, 20);
            graphics.fillStyle(0xF1C40F); // Gold trim
            graphics.fillRect(-7, -8, 14, 2);
        } else if (standType === 2) {
            // Weapon rack with shield
            graphics.fillStyle(0x8B4513); // Brown wooden stand
            graphics.fillRect(-3, -15, 6, 30);
            graphics.fillStyle(0x34495E); // Metal shield
            graphics.fillCircle(0, -5, 10);
            graphics.fillStyle(0xE74C3C); // Red heraldry
            graphics.fillCircle(0, -5, 6);
        } else {
            // Stone statue
            graphics.fillStyle(0x7D8A8E); // Stone color
            graphics.fillRect(-6, -15, 12, 30);
            graphics.fillStyle(0x5D6D7E); // Darker stone details
            graphics.fillRect(-4, -12, 8, 8);
            graphics.fillStyle(0x85929E); // Light stone highlights
            graphics.fillRect(-2, -8, 4, 4);
        }
        
        // Return the graphics object (acts like a sprite for collision)
        return graphics;
    }
    
    isValidTreePosition(x, y) {
        // Check collision with walls
        for (const wall of this.walls.children.entries) {
            const wallBounds = wall.getBounds();
            // Add padding around walls to prevent trees from being too close
            const paddedBounds = new Phaser.Geom.Rectangle(
                wallBounds.x - 25, wallBounds.y - 25, 
                wallBounds.width + 50, wallBounds.height + 50
            );
            if (Phaser.Geom.Rectangle.Contains(paddedBounds, x, y)) {
                return false;
            }
        }
        
        // Check distance from other trees (minimum 40 pixels apart)
        for (const tree of this.trees.children.entries) {
            const distFromTree = Phaser.Math.Distance.Between(x, y, tree.x, tree.y);
            if (distFromTree < 40) {
                return false;
            }
        }
        
        return true;
    }
    
    createPlayers() {
        const playerCount = window.gameState?.playerCount || 1;
        const playerSpeed = window.gameState?.difficultySettings?.playerSpeed || 150;
        
        // Starting positions for players
        const startPositions = [
            { x: 100, y: 100 }, // Player 1
            { x: 700, y: 100 }, // Player 2
            { x: 100, y: 500 }  // Player 3
        ];
        
        // Create players based on count
        for (let i = 0; i < playerCount; i++) {
            let player;
            const pos = startPositions[i];
            
            if (i === 0) {
                player = new Player(this, pos.x, pos.y);
            } else if (i === 1) {
                player = new Player2(this, pos.x, pos.y);
            } else if (i === 2) {
                player = new Player3(this, pos.x, pos.y);
            }
            
            player.speed = playerSpeed;
            player.playerId = i;
            player.isImmune = false; // Initialize immunity flag
            this.players.push(player);
        }
    }

    createSpawnBarriers() {
        // Initialize spawn barriers group
        this.spawnBarriers = this.physics.add.staticGroup();
        
        // Track which players have left their spawn areas
        this.playersLeftSpawn = new Array(this.players.length).fill(false);
        
        // Player starting positions
        const playerStartPositions = [
            { x: 100, y: 100 }, // Player 1
            { x: 700, y: 100 }, // Player 2
            { x: 100, y: 500 }  // Player 3
        ];
        
        // Create barriers behind each active player
        for (let i = 0; i < this.players.length; i++) {
            const startPos = playerStartPositions[i];
            let barrierX, barrierY;
            
            // Position square barrier centered exactly on player position
            barrierX = startPos.x; // Same X as player
            barrierY = startPos.y; // Same Y as player
            const barrierSize = 40; // Square size
            
            // Create visual barrier (square, centered on player)
            const barrier = this.add.rectangle(barrierX, barrierY, barrierSize, barrierSize, 0xFF6B6B); // Red square barrier
            barrier.setAlpha(0.7); // Semi-transparent
            
            // Add physics body
            this.physics.add.existing(barrier, true); // true = static body
            this.spawnBarriers.add(barrier);
            
            // Store barrier reference for removal
            barrier.playerId = i;
            
            console.log(`Created spawn barrier for Player ${i + 1} at (${barrierX}, ${barrierY})`);
        }
    }

    createSingleSpawnBarrier(playerId) {
        // Player starting positions
        const playerStartPositions = [
            { x: 100, y: 100 }, // Player 1
            { x: 700, y: 100 }, // Player 2
            { x: 100, y: 500 }  // Player 3
        ];
        
        if (playerId >= playerStartPositions.length) return;
        
        const startPos = playerStartPositions[playerId];
        const barrierSize = 40; // Square size
        
        // Create visual barrier (square, centered on player)
        const barrier = this.add.rectangle(startPos.x, startPos.y, barrierSize, barrierSize, 0xFF6B6B); // Red square barrier
        barrier.setAlpha(0.7); // Semi-transparent
        
        // Add physics body
        this.physics.add.existing(barrier, true); // true = static body
        this.spawnBarriers.add(barrier);
        
        // Store barrier reference for removal
        barrier.playerId = playerId;
        
        // Reset the player's spawn tracking (they're back in spawn area)
        this.playersLeftSpawn[playerId] = false;
        
        console.log(`Created respawn barrier for Player ${playerId + 1} at (${startPos.x}, ${startPos.y})`);
    }

    checkSpawnBarriers() {
        if (!this.spawnBarriers || !this.playersLeftSpawn) return;
        
        // Player starting positions for distance calculation
        const playerStartPositions = [
            { x: 100, y: 100 }, // Player 1
            { x: 700, y: 100 }, // Player 2
            { x: 100, y: 500 }  // Player 3
        ];
        
        // Check each player
        this.players.forEach((player, index) => {
            if (this.playersLeftSpawn[index] || !player.active) return; // Already left or inactive
            
            const startPos = playerStartPositions[index];
            const distanceFromSpawn = Phaser.Math.Distance.Between(
                player.x, player.y, startPos.x, startPos.y
            );
            
            // If player moved 60 pixels away from spawn, remove their barrier
            if (distanceFromSpawn > 60) {
                this.playersLeftSpawn[index] = true;
                
                // Find and remove the barrier for this player
                const barriers = this.spawnBarriers.getChildren();
                const barrierToRemove = barriers.find(barrier => barrier.playerId === index);
                
                if (barrierToRemove) {
                    // Visual effect when barrier disappears
                    this.tweens.add({
                        targets: barrierToRemove,
                        alpha: 0,
                        scaleX: 0,
                        scaleY: 0,
                        duration: 300,
                        onComplete: () => {
                            barrierToRemove.destroy();
                        }
                    });
                    
                    console.log(`Player ${index + 1} left spawn area - removing barrier`);
                }
            }
        });
    }

    createEnemies() {
        // Get enemy count from difficulty settings
        const enemyCount = window.gameState?.difficultySettings?.enemyCount || 4;
        const enemySpeed = window.gameState?.difficultySettings?.enemySpeed || 80;
        const directionChangeInterval = window.gameState?.difficultySettings?.enemyDirectionChangeInterval || 3000;
        
        // Generate enemy positions based on count - spawn rooms will provide protection
        const positions = [];
        
        // Base positions for different enemy counts - now safe due to spawn room walls
        const basePositions = [
            { x: 200, y: 200 }, { x: 600, y: 200 }, { x: 200, y: 400 }, { x: 600, y: 400 },
            { x: 400, y: 150 }, { x: 150, y: 300 }, { x: 650, y: 300 }, { x: 400, y: 450 },
            { x: 300, y: 250 }, { x: 500, y: 250 }, { x: 300, y: 350 }, { x: 500, y: 350 }
        ];
        
        // Select positions based on enemy count
        for (let i = 0; i < Math.min(enemyCount, basePositions.length); i++) {
            positions.push(basePositions[i]);
        }
        
        console.log(`Creating ${positions.length} enemies - players protected by spawn rooms`);
        
        // Create enemies with difficulty settings
        positions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y);
            enemy.speed = enemySpeed;
            enemy.changeDirectionInterval = directionChangeInterval;
            this.enemies.add(enemy);
        });
    }

    createGems() {
        // Player spawn position
        const playerSpawnX = 100;
        const playerSpawnY = 100;
        const minDistanceFromPlayer = 80; // Minimum distance from player spawn
        
        // Get gems count from difficulty settings
        const gemsSettings = window.gameState?.difficultySettings?.gemsCount || { min: 8, max: 12 };
        const numGems = Phaser.Math.Between(gemsSettings.min, gemsSettings.max);
        
        console.log(`Creating ${numGems} gems for this game (range: ${gemsSettings.min}-${gemsSettings.max})`);
        
        // Store the actual number of gems created for this game
        this.totalGemsInGame = numGems;
        
        const placedGems = [];
        let attempts = 0;
        const maxAttempts = 200; // Prevent infinite loops
        
        while (placedGems.length < numGems && attempts < maxAttempts) {
            attempts++;
            
            // Generate random position within game bounds (with padding)
            const x = Phaser.Math.Between(60, 740);
            const y = Phaser.Math.Between(60, 540);
            
            // Check if position is valid
            if (this.isValidGemPosition(x, y, playerSpawnX, playerSpawnY, minDistanceFromPlayer)) {
            const gem = new Gem(this, x, y);
            this.gems.add(gem);
                placedGems.push({ x, y });
            }
        }
        
        // If we couldn't place enough gems, try some fallback positions
        if (placedGems.length < 6) {
            const fallbackPositions = [
                { x: 200, y: 500 }, { x: 600, y: 500 }, { x: 700, y: 200 },
                { x: 200, y: 200 }, { x: 500, y: 400 }, { x: 300, y: 300 }
            ];
            
            for (const pos of fallbackPositions) {
                if (placedGems.length >= numGems) break;
                if (this.isValidGemPosition(pos.x, pos.y, playerSpawnX, playerSpawnY, minDistanceFromPlayer)) {
                    const gem = new Gem(this, pos.x, pos.y);
                    this.gems.add(gem);
                    placedGems.push(pos);
                }
            }
        }
        
        // Update total gems to actual placed gems (in case fewer were placed than planned)
        this.totalGemsInGame = placedGems.length;
        console.log(`Actually placed ${this.totalGemsInGame} gems in the game`);
    }
    
    isValidGemPosition(x, y, playerSpawnX, playerSpawnY, minDistanceFromPlayer) {
        // Check distance from player spawn
        const distFromPlayer = Phaser.Math.Distance.Between(x, y, playerSpawnX, playerSpawnY);
        if (distFromPlayer < minDistanceFromPlayer) {
            return false;
        }
        
        // Check collision with walls
        for (const wall of this.walls.children.entries) {
            const wallBounds = wall.getBounds();
            if (Phaser.Geom.Rectangle.Contains(wallBounds, x, y)) {
                return false;
            }
            // Add some padding around walls
            const paddedBounds = new Phaser.Geom.Rectangle(
                wallBounds.x - 20, wallBounds.y - 20, 
                wallBounds.width + 40, wallBounds.height + 40
            );
            if (Phaser.Geom.Rectangle.Contains(paddedBounds, x, y)) {
                return false;
            }
        }
        
        // Check collision with trees
        for (const tree of this.trees.children.entries) {
            const distFromTree = Phaser.Math.Distance.Between(x, y, tree.x, tree.y);
            if (distFromTree < 35) { // Tree radius (15) + gem size + padding
                return false;
            }
        }
        
        return true;
    }

    setupCollisions() {
        console.log('Setting up collisions...');
        console.log('Number of walls in group:', this.walls.children.size);
        console.log('Number of players:', this.players.length);
        
        // Debug: Log wall positions and physics bodies
        this.walls.children.entries.forEach((wall, index) => {
            console.log(`Wall ${index}: x=${wall.x}, y=${wall.y}, width=${wall.width}, height=${wall.height}`);
            console.log(`Wall ${index} body:`, wall.body ? 'HAS PHYSICS BODY' : 'NO PHYSICS BODY');
        });
        
        // Setup collisions for each player
        this.players.forEach((player, playerIndex) => {
            console.log(`Setting up collisions for Player ${playerIndex + 1}`);
            
            // Player collision with walls
            this.physics.add.collider(player, this.walls);
            
            // Player collision with trees
            this.physics.add.collider(player, this.trees);
            
            // Player collision with enemies
            this.physics.add.collider(player, this.enemies, this.playerHit, null, this);
            
            // Player collision with gems
            this.physics.add.overlap(player, this.gems, this.collectGem, null, this);
        });
        
        // Enemy collision with walls
        this.physics.add.collider(this.enemies, this.walls);
        
        // Enemy collision with trees
        this.physics.add.collider(this.enemies, this.trees);
        
        // Enemy collision with spawn barriers (players can pass through)
        this.physics.add.collider(this.enemies, this.spawnBarriers);
        
        // Enemy-Enemy collision (prevent clustering)
        this.physics.add.collider(this.enemies, this.enemies);
        
        console.log('Collision setup complete!');
        
        // Player-Player collision (prevent overlap in multiplayer)
        if (this.players.length > 1) {
            for (let i = 0; i < this.players.length; i++) {
                for (let j = i + 1; j < this.players.length; j++) {
                    this.physics.add.collider(this.players[i], this.players[j]);
                }
            }
        }
    }

    createUI() {
        // Create UI for each player
        const playerCount = this.players.length;
        const playerColors = ['#4A90E2', '#9B59B6', '#27AE60']; // Blue, Purple, Green
        
        this.playerTexts = [];
        
        // Ensure window.gameState.players matches the actual player count
        console.log('UI Creation - playerCount:', playerCount);
        console.log('UI Creation - gameState.players:', window.gameState.players);
        console.log('UI Creation - this.players:', this.players);
        
        for (let i = 0; i < playerCount; i++) {
            // Make sure we have a corresponding player in gameState
            if (!window.gameState.players[i]) {
                console.warn(`GameState player ${i} missing, creating default`);
                window.gameState.players[i] = {
                    id: i,
                    score: 0,
                    gemsCollected: 0,
                    lives: window.gameState?.difficultySettings?.lives || 3,
                    name: `Player ${i + 1}`
                };
            }
            
            const player = window.gameState.players[i];
            console.log(`Creating UI for player ${i}:`, player);
            
            const color = playerColors[i];
            const yOffset = i * 60;
            
            // Player label and score
            const playerLabel = this.add.text(16, 16 + yOffset, `${player.name}:`, {
                fontSize: '18px',
                fill: color,
                stroke: '#000',
                strokeThickness: 3,
                fontWeight: 'bold'
            });
            playerLabel.setScrollFactor(0);
            
            const scoreText = this.add.text(16, 36 + yOffset, `Treasures: 0 | Lives: ${player.lives}`, {
                fontSize: '16px',
                fill: '#ffffff',
                stroke: '#000',
                strokeThickness: 2
            });
            scoreText.setScrollFactor(0);
            
            this.playerTexts.push({
                label: playerLabel,
                score: scoreText,
                playerId: i
            });
        }
        
        // Add game info at the bottom (will be updated later)
        this.gameInfoText = this.add.text(16, 16 + (playerCount * 60), `Total Treasures: 0`, {
            fontSize: '14px',
            fill: '#cccccc',
            stroke: '#000',
            strokeThickness: 2
        });
        this.gameInfoText.setScrollFactor(0);
    }

    startGame() {
        if (this.gameStarted) return; // Prevent multiple starts
        
        this.gameStarted = true;
        
        // Remove start instruction
        if (this.startText) {
            this.startText.destroy();
        }
        
        // Unfreeze enemies
        this.enemies.getChildren().forEach(enemy => {
            enemy.unfreeze();
        });
        
        // Add a visual effect to show game started
        this.players.forEach(player => {
            this.tweens.add({
                targets: player,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                yoyo: true
            });
        });
    }

    update() {
        if (this.gameOver) return;
        
        // Check if any player is trying to move (game start condition)
        if (!this.gameStarted) {
            // More efficient check - only check if keys are actually pressed this frame
            const keysPressed = [
                this.cursors.left.isDown, this.cursors.right.isDown,
                this.cursors.up.isDown, this.cursors.down.isDown,
                this.wasd.A.isDown, this.wasd.D.isDown,
                this.wasd.W.isDown, this.wasd.S.isDown,
                this.ijkl.I.isDown, this.ijkl.J.isDown,
                this.ijkl.K.isDown, this.ijkl.L.isDown
            ];
            
            if (keysPressed.some(key => key)) {
                this.startGame();
            }
        }
        
        // Update all players
        this.players.forEach((player, index) => {
            if (!player || !player.update) {
                console.error(`Player ${index} is invalid:`, player);
                return;
            }
            
            if (index === 0) {
                // Player 1: WASD only
                player.update(null, this.wasd);
            } else if (index === 1) {
                // Player 2: Arrow keys only
                player.update(this.cursors);
            } else if (index === 2) {
                // Player 3: IJKL
                player.update(this.ijkl);
            }
        });
        
        // Check if players have left their spawn areas and remove barriers
        this.checkSpawnBarriers();
        
        // Update enemies only if game has started
        if (this.gameStarted) {
            this.enemies.getChildren().forEach(enemy => {
                enemy.update();
            });
        }
        
        // Update UI for each player
        this.playerTexts.forEach(playerUI => {
            const playerData = window.gameState.players[playerUI.playerId];
            
            // Check for unexpected lives changes (debug mode only)
            if (this.originalLives && playerData.lives !== this.originalLives[playerUI.playerId]) {
                const livesChange = playerData.lives - this.originalLives[playerUI.playerId];
                if (livesChange < -1 && window.DEBUG_MODE) { // More than normal damage
                    console.error(`🚨 ABNORMAL LIVES CHANGE: Player ${playerUI.playerId} lives changed by ${livesChange} (was ${this.originalLives[playerUI.playerId]}, now ${playerData.lives})`);
                }
                this.originalLives[playerUI.playerId] = playerData.lives; // Update tracking
            }
            
            if (playerData.lives < 0) {
                console.error(`🚨 NEGATIVE LIVES IN UI: Player ${playerUI.playerId} has ${playerData.lives} lives`);
                // Immediately fix negative lives
                const correctLives = Math.max(0, window.gameState?.difficultySettings?.lives || 3);
                console.warn(`🔧 EMERGENCY FIX: Setting Player ${playerUI.playerId} lives from ${playerData.lives} to ${correctLives}`);
                playerData.lives = correctLives;
            }
            
            playerUI.score.setText(`Treasures: ${playerData.gemsCollected} | Lives: ${playerData.lives}`);
        });
        
        // Update total treasures count
        if (this.gameInfoText) {
            this.gameInfoText.setText(`Total Treasures: ${this.gems.getChildren().length}`);
        }
        
        // Check win condition - all gems collected
        if (this.gems.getChildren().length === 0) {
            this.gameOver = true;
            // Check if this is single player or multiplayer
            const isMultiplayer = window.gameState?.playerCount > 1;
            if (isMultiplayer) {
                this.endMultiplayerGame();
            } else {
                this.endSinglePlayerGame();
            }
        }
    }

    playerHit(player, enemy) {
        if (this.gameOver || !this.gameStarted) return; // Don't take damage before game starts
        
        // Find which player was hit
        const playerId = player.playerId;
        console.log(`Player hit - playerId: ${playerId}, player:`, player);
        
        const playerData = window.gameState.players[playerId];
        console.log(`PlayerData before hit:`, playerData);
        
        if (!playerData) {
            console.error(`No playerData found for playerId ${playerId}`);
            return;
        }
        
        // Don't damage already eliminated players or immune players
        if (playerData.lives <= 0 || !player.active || player.isImmune) {
            if (player.isImmune) {
                console.log(`Ignoring hit on immune player ${playerId}`);
            } else {
                console.log(`Ignoring hit on eliminated player ${playerId}`);
            }
            return;
        }
        
        playerData.lives--;
        console.log(`PlayerData after hit:`, playerData);
        
        if (playerData.lives <= 0) {
            // Ensure lives don't go below 0
            playerData.lives = 0;
            console.log(`Player ${playerId} eliminated with 0 lives`);
            
            // Player is eliminated but game continues for others
            player.setActive(false);
            player.setVisible(false);
            
            // Check if any players are still alive
            const alivePlayers = window.gameState.players.filter(p => p.lives > 0);
            if (alivePlayers.length === 0) {
                this.gameOver = true;
                
                // Check if this is single player or multiplayer
                const isMultiplayer = window.gameState?.playerCount > 1;
                if (isMultiplayer) {
                    this.endMultiplayerGame();
                } else {
                    this.endSinglePlayerGame();
                }
            }
        } else {
            // Reset player position to their starting position
            const startPositions = [
                { x: 100, y: 100 }, // Player 1
                { x: 700, y: 100 }, // Player 2
                { x: 100, y: 500 }  // Player 3
            ];
            const startPos = startPositions[playerId];
            player.setPosition(startPos.x, startPos.y);
            
            // Create a new spawn barrier for protection
            this.createSingleSpawnBarrier(playerId);
            
            // Add temporary immunity to prevent immediate re-damage
            player.isImmune = true;
            console.log(`Player ${playerId} granted immunity for 2 seconds`);
            
            // Remove immunity after 2 seconds
            this.time.delayedCall(2000, () => {
                if (player && player.active) {
                    player.isImmune = false;
                    console.log(`Player ${playerId} immunity ended`);
                }
            });
            
            // Flash the player to show immunity
            this.tweens.add({
                targets: player,
                alpha: 0.5,
                duration: 200,
                yoyo: true,
                repeat: 9, // Flash for 2 seconds (200ms * 10 cycles = 2000ms)
                onComplete: () => {
                    player.setAlpha(1); // Ensure player is fully visible after immunity
                }
            });
            
            // Trigger damage effect
            player.takeDamage();
        }
    }
    
    endSinglePlayerGame() {
        this.gameOver = true;
        
        // In single player, the player has lost if they lose all lives without collecting all gems
        const player = window.gameState.players[0];
        const allGemsCollected = this.gems.getChildren().length === 0;
        const hasWon = allGemsCollected;
        
        // Store results for game over scene
        window.gameState.gameResults = {
            singlePlayer: true,
            gemsCollected: player.gemsCollected,
            totalGems: this.totalGemsInGame || (window.gameState?.difficultySettings?.gemsCount?.max || 12),
            allGemsClaimed: allGemsCollected,
            finalScore: player.score
        };
        
        console.log(`Single player game ended: ${player.gemsCollected}/${this.totalGemsInGame} gems collected`);
        
        this.scene.start('GameOverScene', { 
            won: hasWon, 
            multiplayer: false 
        });
    }

    endMultiplayerGame() {
        this.gameOver = true;
        
        // Calculate winner
        let winner = null;
        let maxGems = -1;
        let tie = false;
        let allPlayersLost = false;
        
        // Find the highest gem count
        window.gameState.players.forEach((player, index) => {
            if (player.gemsCollected > maxGems) {
                maxGems = player.gemsCollected;
                winner = player;
                tie = false;
            } else if (player.gemsCollected === maxGems) {
                // Handle ties (including when all have 0 gems)
                if (maxGems === 0) {
                    // All players have 0 gems = all lost
                    allPlayersLost = true;
                    winner = null;
                } else {
                    // Multiple players tied with gems > 0
                    tie = true;
                    winner = null; // No single winner in a tie
                }
            }
        });
        
        // Determine if anyone actually won
        const someoneWon = maxGems > 0 && !tie;
        
        console.log('Multiplayer game ending:');
        console.log('- maxGems:', maxGems);
        console.log('- winner:', winner);
        console.log('- tie:', tie);
        console.log('- allPlayersLost:', allPlayersLost);
        console.log('- someoneWon:', someoneWon);
        
        // Store results for game over scene
        window.gameState.gameResults = {
            winner: winner,
            tie: tie,
            allPlayersLost: allPlayersLost,
            maxGems: maxGems,
            allGemsClaimed: this.gems.getChildren().length === 0
        };
        
        this.scene.start('GameOverScene', { 
            won: someoneWon, 
            multiplayer: true 
        });
    }

    collectGem(player, gem) {
        if (gem.collected) return;
        
        gem.collect();
        
        // Find which player collected the gem
        const playerId = player.playerId;
        const playerData = window.gameState.players[playerId];
        
        // Update player's gem count
        playerData.gemsCollected++;
        
        // Apply difficulty score multiplier
        const scoreMultiplier = window.gameState?.difficultySettings?.scoreMultiplier || 1.0;
        const baseScore = 10;
        const adjustedScore = Math.round(baseScore * scoreMultiplier);
        playerData.score += adjustedScore;
        
        // Play collection sound effect (visual feedback for now)
        this.tweens.add({
            targets: player,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true
        });
        
        // Trigger player's collection effect
        player.collectItem();
    }
}
