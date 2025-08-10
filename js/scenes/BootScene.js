class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log('BootScene: preload started');
        // Simple loading text
        const loadingText = this.add.text(400, 300, 'Loading Game...', {
            fontSize: '32px',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5);
    }

    create() {
        console.log('BootScene: create started');
        // Create simple single-frame assets
        this.createSimpleAssets();
        
        console.log('BootScene: starting DifficultyScene');
        // Start the difficulty selection scene
        this.scene.start('DifficultyScene');
    }

    createSimpleAssets() {
        console.log('BootScene: creating assets');
        // Create simple colored rectangles for all sprites
        
        // Player (green square)
        const playerCanvas = document.createElement('canvas');
        playerCanvas.width = 32;
        playerCanvas.height = 32;
        const playerCtx = playerCanvas.getContext('2d');
        playerCtx.fillStyle = '#00ff00';
        playerCtx.fillRect(0, 0, 32, 32);
        playerCtx.fillStyle = '#ffffff';
        playerCtx.fillRect(2, 2, 28, 28);
        playerCtx.fillStyle = '#00ff00';
        playerCtx.fillRect(4, 4, 24, 24);
        
        // Enemy (red square)
        const enemyCanvas = document.createElement('canvas');
        enemyCanvas.width = 32;
        enemyCanvas.height = 32;
        const enemyCtx = enemyCanvas.getContext('2d');
        enemyCtx.fillStyle = '#ff0000';
        enemyCtx.fillRect(0, 0, 32, 32);
        enemyCtx.fillStyle = '#ffffff';
        enemyCtx.fillRect(2, 2, 28, 28);
        enemyCtx.fillStyle = '#ff0000';
        enemyCtx.fillRect(4, 4, 24, 24);
        
        // Gem (cyan square)
        const gemCanvas = document.createElement('canvas');
        gemCanvas.width = 16;
        gemCanvas.height = 16;
        const gemCtx = gemCanvas.getContext('2d');
        gemCtx.fillStyle = '#00ffff';
        gemCtx.fillRect(0, 0, 16, 16);
        gemCtx.fillStyle = '#ffffff';
        gemCtx.fillRect(1, 1, 14, 14);
        gemCtx.fillStyle = '#00ffff';
        gemCtx.fillRect(2, 2, 12, 12);
        
        // Heart (pink square)
        const heartCanvas = document.createElement('canvas');
        heartCanvas.width = 16;
        heartCanvas.height = 16;
        const heartCtx = heartCanvas.getContext('2d');
        heartCtx.fillStyle = '#ff69b4';
        heartCtx.fillRect(0, 0, 16, 16);
        heartCtx.fillStyle = '#ffffff';
        heartCtx.fillRect(1, 1, 14, 14);
        heartCtx.fillStyle = '#ff69b4';
        heartCtx.fillRect(2, 2, 12, 12);
        
        // Tiles (brown square)
        const tilesCanvas = document.createElement('canvas');
        tilesCanvas.width = 32;
        tilesCanvas.height = 32;
        const tilesCtx = tilesCanvas.getContext('2d');
        tilesCtx.fillStyle = '#8b4513';
        tilesCtx.fillRect(0, 0, 32, 32);
        tilesCtx.fillStyle = '#ffffff';
        tilesCtx.fillRect(2, 2, 28, 28);
        tilesCtx.fillStyle = '#8b4513';
        tilesCtx.fillRect(4, 4, 24, 24);
        
        // Background (blue rectangle)
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = 800;
        bgCanvas.height = 600;
        const bgCtx = bgCanvas.getContext('2d');
        bgCtx.fillStyle = '#87ceeb';
        bgCtx.fillRect(0, 0, 800, 600);
        
        // Add the canvases as textures to Phaser
        this.textures.addCanvas('player', playerCanvas);
        this.textures.addCanvas('enemy', enemyCanvas);
        this.textures.addCanvas('gem', gemCanvas);
        this.textures.addCanvas('heart', heartCanvas);
        this.textures.addCanvas('tiles', tilesCanvas);
        this.textures.addCanvas('background', bgCanvas);
        
        console.log('BootScene: assets created successfully');
    }
}
