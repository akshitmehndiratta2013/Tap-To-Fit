/* ========================================
   MORPH DASH - GAME CONFIGURATION
   Constants, Settings, and Shape Definitions
   ======================================== */

const GAME_CONFIG = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#050008',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
        expandParent: true,
        fullscreenTarget: 'game-container'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene, PauseScene]
};

// Game Settings
const GAME_SETTINGS = {
    // Difficulty
    initialDifficulty: 1,
    difficultyIncrement: 0.05,
    maxDifficulty: 15,
    scorePerDifficultyLevel: 2000,
    difficultyScaling: 0.95,
    
    // Combo
    comboMultiplier: 1.15,
    perfectBonus: 50,
    perfectWindow: 0.15, // 15% of hole width
    
    // Scoring
    baseScore: 100,
    
    // Colors
    colors: {
        background: '#050008',
        darkBg: '#0a0015',
        cyan: '#00d4ff',
        purple: '#9d00ff',
        pink: '#ff006b',
        yellow: '#ffff00',
        orange: '#ff6b00',
        green: '#00ff00',
        blue: '#0099ff'
    },
    
    // Animation
    morphDuration: 200,
    crashDuration: 400,
    screenShakeDuration: 300,
    pulseInterval: 5 // Pulse at 5x combo, 10x, 15x, etc
};

// Player configuration
const PLAYER_CONFIG = {
    startX: 640,
    startY: 600,
    size: 40,
    baseSpeed: 600,
    maxSpeed: 1500,
    speedIncrement: 25,
    acceleration: 8,
    speedUpPerScore: 50,
    trailParticleCount: 3,
    glowRadius: 60,
    shadowDistance: 8
};

// Wall configuration
const WALL_CONFIG = {
    width: 1280,
    height: 100,
    minSpawnRate: 0.6,
    maxSpawnRate: 3,
    initialSpawnRate: 2.8,
    holeWidth: 120,
    holeVariation: 40,
    holeMinSize: 80,
    holeMaxSize: 150,
    speed: 0,
    acceleration: 8
};

// Shapes definition
const SHAPES = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    TRIANGLE: 'triangle',
    HEXAGON: 'hexagon',
    STAR: 'star'
};

const SHAPE_ORDER = [
    SHAPES.CIRCLE,
    SHAPES.SQUARE,
    SHAPES.TRIANGLE,
    SHAPES.HEXAGON,
    SHAPES.STAR
];

// Shape drawing functions
const SHAPE_DEFINITIONS = {
    circle: (graphics, x, y, size, color) => {
        graphics.fillStyle(color, 1);
        graphics.fillCircleShape(new Phaser.Geom.Circle(x, y, size / 2));
    },
    
    square: (graphics, x, y, size, color) => {
        graphics.fillStyle(color, 1);
        graphics.fillRect(x - size / 2, y - size / 2, size, size);
    },
    
    triangle: (graphics, x, y, size, color) => {
        graphics.fillStyle(color, 1);
        const triangle = new Phaser.Geom.Triangle(
            x, y - size / 2,
            x - size / 2, y + size / 2,
            x + size / 2, y + size / 2
        );
        graphics.fillTriangleShape(triangle);
    },
    
    hexagon: (graphics, x, y, size, color) => {
        graphics.fillStyle(color, 1);
        const hexagon = Phaser.Geom.Polygon.CreateRegular(6, x, y, size / 2);
        graphics.fillPoints(hexagon.points);
    },
    
    star: (graphics, x, y, size, color) => {
        graphics.fillStyle(color, 1);
        const points = [];
        const outerRadius = size / 2;
        const innerRadius = size / 4;
        
        for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            points.push({
                x: x + radius * Math.cos(angle),
                y: y + radius * Math.sin(angle)
            });
        }
        
        graphics.fillPoints(points);
    }
};

// Shape collision detection
function checkShapeCollision(shape, x, y, size, holeX, holeY, holeWidth, holeHeight) {
    const shapeRadius = size / 2;
    const holeCenterX = holeX + holeWidth / 2;
    const holeCenterY = holeY + holeHeight / 2;
    
    switch (shape) {
        case SHAPES.CIRCLE:
            return Phaser.Geom.Intersects.CircleToRectangle(
                new Phaser.Geom.Circle(x, y, shapeRadius),
                new Phaser.Geom.Rectangle(holeX, holeY, holeWidth, holeHeight)
            );
        
        case SHAPES.SQUARE:
        case SHAPES.TRIANGLE:
        case SHAPES.HEXAGON:
        case SHAPES.STAR:
            // Bounding box check for complex shapes
            const shapeBox = new Phaser.Geom.Rectangle(x - shapeRadius, y - shapeRadius, size, size);
            const holeBox = new Phaser.Geom.Rectangle(holeX, holeY, holeWidth, holeHeight);
            return !Phaser.Geom.Intersects.RectangleToRectangle(shapeBox, holeBox);
        
        default:
            return false;
    }
}

// Particle effects
const PARTICLE_PRESETS = {
    success: {
        speed: { min: 100, max: 300 },
        scale: { start: 1, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 600,
        gravityY: -200
    },
    crash: {
        speed: { min: 200, max: 400 },
        scale: { start: 1.5, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 400,
        gravityY: 300
    },
    trail: {
        speed: { min: 50, max: 150 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 0.8, end: 0 },
        lifespan: 300,
        gravityY: 0
    },
    perfect: {
        speed: { min: 150, max: 350 },
        scale: { start: 1.2, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 700,
        gravityY: -300,
        emitZone: { type: 'circle', source: new Phaser.Geom.Circle(0, 0, 50) }
    }
};

// Audio settings
const AUDIO_SETTINGS = {
    masterVolume: 0.5,
    soundVolume: 0.7,
    musicVolume: 0.4,
    enabled: true
};
