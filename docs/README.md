# Morph Dash - Hypercasual Browser Game

A production-quality HTML5 hypercasual game built with Phaser 3, designed for Poki publishing.

## 🎮 Game Overview

**Morph Dash** is an endless, shape-shifting arcade game where players must morph their character to match incoming obstacles.

### Core Gameplay
- Control a glowing shape that moves automatically through an endless tunnel
- Tap/click to cycle through 5 different shapes: Circle → Square → Triangle → Hexagon → Star
- Walls appear with holes matching various shapes
- Match the shape to pass through, or crash and lose
- Build combos for exponential score multipliers
- Progressive difficulty increases speed and challenge

### Key Features
✅ Endless gameplay with dynamic difficulty  
✅ 5 unique morphable shapes  
✅ Combo multiplier system (1.15x per consecutive pass)  
✅ Perfect timing bonus system  
✅ Particle effects and screen shake  
✅ High score persistence via localStorage  
✅ Mobile-friendly controls (tap/click/spacebar)  
✅ Pause functionality  
✅ Rewarded ad integration (Poki SDK)  
✅ Web Audio API sound effects  
✅ Neon cyberpunk visual aesthetic  
✅ 60 FPS optimized performance  

## 🎨 Visual Style

Modern neon cyberpunk aesthetic with:
- Dark backgrounds (#050008)
- Glowing cyan primary color (#00d4ff)
- Purple accents (#9d00ff)
- Animated grid background
- Glowing effects and auras
- Smooth animations and transitions

## 📱 Controls

**Desktop:**
- Spacebar or Left Mouse Click = Change Shape
- ESC = Pause/Resume

**Mobile:**
- Tap anywhere = Change Shape

## 🚀 Getting Started

### Running Locally

1. Clone or download the game files
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. The game will load with the main menu

### File Structure

```
morph-dash/
├── index.html                    Main HTML file
├── style.css                     Game styling
├── js/
│   ├── config.js                Game configuration & constants
│   ├── main.js                  Phaser initialization
│   ├── utils/
│   │   ├── audioManager.js      Web Audio API sounds
│   │   ├── particleManager.js   Particle system
│   │   └── scoreManager.js      High score persistence
│   └── scenes/
│       ├── BootScene.js         Initialization
│       ├── MenuScene.js         Main menu
│       ├── GameScene.js         Core gameplay
│       ├── GameOverScene.js     Game over screen
│       └── PauseScene.js        Pause overlay
└── README.md                     This file
```

## 🎮 Gameplay Tips

- **Build Combos**: Pass through walls consecutively to increase your combo multiplier
- **Perfect Hits**: Pass through the center of holes for bonus points and "PERFECT!" text
- **Watch Your Combo**: Your combo resets if you crash, so precision is key
- **Difficulty Scaling**: The game gradually gets faster every 2000 points
- **High Combos**: At 5x, 10x, 20x combos, you'll see special effects and sounds

## 📊 Scoring System

- **Base Score**: 100 points per wall passed
- **Combo Multiplier**: 1.15x per consecutive pass (exponential growth)
- **Perfect Bonus**: +50 points for center-aligned passages
- **Example**: At 5x combo, each wall = 100 × 1.15^4 ≈ 174 points

## 🔧 Configuration

Edit `js/config.js` to customize:

### Player Settings
```javascript
player: {
    baseSpeed: 600,      // Initial movement speed
    maxSpeed: 1500,      // Maximum speed cap
    speedIncrement: 15,  // Speed increase per difficulty level
    size: 40             // Player shape size
}
```

### Wall Settings
```javascript
wall: {
    spawnRate: 2.5,      // Seconds between wall spawns (reduced as difficulty increases)
    minSpawnRate: 0.8,   // Minimum spawn rate at high difficulty
    holeWidth: 120,      // Width of the hole
    holeVariation: 30    // Random variation
}
```

### Difficulty
```javascript
GAME_SETTINGS: {
    speedIncrease: 25,           // Points before speed increase
    difficultyScaling: 0.95,     // Spawn rate multiplier
    maxDifficulty: 50            // Difficulty cap
}
```

### Colors
Edit `GAME_SETTINGS.colors` to customize the neon palette

## 🔊 Audio

The game uses the Web Audio API to generate procedural sound effects:
- **Morph Sound**: Shape change feedback (400Hz)
- **Success Sound**: Wall passed (500Hz-700Hz scale)
- **Perfect Sound**: Perfect timing (800Hz + 600Hz)
- **Combo Sound**: Milestone achieved (600Hz-900Hz progression)
- **Crash Sound**: Game over (200Hz-150Hz descending)

Volume is configurable in the Settings menu (0-100%).

## 💾 Data Persistence

High scores are saved using browser localStorage:
- Last 100 scores stored
- Total games, best combo, and statistics tracked
- All data persists between browser sessions
- Can be reset via Settings menu

## 🎮 Poki Integration

The game includes full Poki SDK integration:

```javascript
// Initialization (BootScene)
PokiSDK.init()

// Gameplay tracking
PokiSDK.gameplayStart()  // Called when game starts
PokiSDK.gameplayStop()   // Called when game ends

// Commercial breaks
PokiSDK.commercialBreak() // Before/after games

// Rewarded ads
// Integrated in GameOverScene for "Revive" functionality
```

### Deploying to Poki

1. Upload all files to your Poki game page
2. Set the game URL as the HTML file location
3. Ensure Poki SDK initialization is working
4. Test ad breaks and rewarded ad functionality
5. Submit for Poki review

## 🎨 Customizing the Game

### Changing Colors
Edit `GAME_SETTINGS.colors` in `js/config.js`:
```javascript
colors: {
    background: '#050008',
    cyan: '#00d4ff',
    purple: '#9d00ff',
    // ... etc
}
```

### Adding New Shapes
1. Add shape name to `GAME_SETTINGS.shapes` array
2. Define drawing function in `SHAPE_DEFINITIONS`
3. Add collision detection in `GameScene.checkWallCollision()`

### Modifying Difficulty Curve
Adjust `speedIncrement`, `difficultyScaling`, and `maxDifficulty` in `config.js`

### Changing Wall Spawn Rate
Edit `wall.spawnRate` and `wall.minSpawnRate` in `GAME_SETTINGS`

## 🐛 Debugging

The game exposes useful debug information:

```javascript
// Access game instance
window.morphDashGame

// Check score manager
scoreManager.getHighScore()
scoreManager.getFormattedStats()

// Check audio manager
audioManager.getMasterVolume()
audioManager.isEnabled()
```

## 📈 Performance Optimization

The game is optimized for 60 FPS with:
- Object pooling for walls and particles
- Graphics rendering optimization
- Efficient collision detection
- Asset caching
- Particle limit caps

## 🔐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

Created for Poki publishing. All rights reserved.

## 🚀 Future Enhancements

Potential features to add:
- Power-ups and special abilities
- Multiple game modes
- Leaderboards
- Achievements/badges
- Custom themes
- Touch gesture controls
- Haptic feedback
- Seasonal content
- Boss levels

## 📞 Support

For issues or questions about deploying to Poki, refer to:
- Poki Publisher Documentation: https://poki.com/developers
- Phaser 3 Documentation: https://phaser.io
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

---

**Morph Dash** - Made with ❤️ for Poki Gaming Platform
