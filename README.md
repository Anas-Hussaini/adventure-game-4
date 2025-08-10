# Adventure Quest - Phaser.js Game

A fun 2D adventure game built with Phaser.js where you control a character to collect gems while avoiding enemies!

## 🎮 Game Features

- **Player Movement**: Use WASD or Arrow keys to move around
- **Collect Gems**: Gather colorful gems to increase your score
- **Avoid Enemies**: Red enemies patrol the area - don't let them catch you!
- **Lives System**: You have 3 lives - lose them all and it's game over
- **Win Condition**: Collect all gems to win the level
- **Beautiful Effects**: Particle effects, animations, and visual feedback

## 🚀 How to Run

1. **Simple Setup**: Just open `index.html` in your web browser!
   - No server required
   - No build process needed
   - Works immediately

2. **Local Server** (Optional): For better development experience
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## 🎯 Game Controls

- **W** or **↑**: Move Up
- **S** or **↓**: Move Down  
- **A** or **←**: Move Left
- **D** or **→**: Move Right
- **SPACE**: Restart game (on game over screen)

## 🏗️ Project Structure

```
project_2/
├── index.html              # Main HTML file
├── js/
│   ├── game.js             # Main game configuration
│   ├── scenes/
│   │   ├── BootScene.js    # Loading screen and asset loading
│   │   ├── GameScene.js    # Main gameplay scene
│   │   └── GameOverScene.js # Game over screen
│   └── entities/
│       ├── Player.js       # Player character logic
│       ├── Enemy.js        # Enemy AI and behavior
│       └── Gem.js          # Collectible items
├── assets/
│   ├── map.json           # Tilemap data
│   └── placeholder.html   # Asset generator (optional)
└── README.md              # This file
```

## 🎨 Game Mechanics

### Player
- Green character with smooth movement
- Collision detection with walls and enemies
- Visual feedback when collecting items or taking damage

### Enemies
- Red enemies that patrol the area
- Random movement patterns
- Collision with walls and player

### Gems
- Colorful collectible items
- Floating animation and glow effects
- Score points when collected

### World
- Bounded play area with walls
- Decorative elements (trees)
- Camera follows the player

## 🔧 Customization

The game is built to be easily customizable:

- **Add new enemies**: Modify `Enemy.js` and add spawn points in `GameScene.js`
- **Change player speed**: Adjust the `speed` property in `Player.js`
- **Modify scoring**: Change gem values in `Gem.js`
- **Add new effects**: Extend the visual effects in any entity class

## 🎵 Future Enhancements

Potential features to add:
- Sound effects and background music
- Multiple levels with different layouts
- Power-ups and special abilities
- More enemy types
- Boss battles
- Save/load game progress

## 🛠️ Technical Details

- **Framework**: Phaser.js 3.70.0
- **Physics**: Arcade physics system
- **Rendering**: Canvas-based rendering
- **Animations**: Sprite sheet animations with tweens
- **Collision**: Built-in collision detection

## 📝 License

This project is open source and available under the MIT License.

---

**Enjoy playing Adventure Quest!** 🎮✨
