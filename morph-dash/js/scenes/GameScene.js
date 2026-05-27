/* ========================================
   GAME SCENE
   Core gameplay loop and mechanics
   ======================================== */

class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        this.isReviving = data?.revive || false;
        this.previousScore = data?.previousScore || 0;
    }

    create() {
        // Initialize game state
        this.score = this.isReviving ? this.previousScore : 0;
        this.combo = 0;
        this.difficulty = 1;
        this.gameSpeed = PLAYER_CONFIG.baseSpeed;
        this.shapesPassed = 0;
        this.gameActive = true;
        this.isPaused = false;

        // Create particle manager
        this.particleManager = new ParticleManager(this);

        // Create graphics for rendering
        this.graphicsPlayer = this.make.graphics({ x: 0, y: 0, add: true });
        this.graphicsParticles = this.make.graphics({ x: 0, y: 0, add: true });
        this.graphicsWalls = this.make.graphics({ x: 0, y: 0, add: true });

        // Player
        this.playerX = PLAYER_CONFIG.startX;
        this.playerY = PLAYER_CONFIG.startY;
        this.playerShape = SHAPES.CIRCLE;
        this.shapeIndex = 0;
        this.playerSize = PLAYER_CONFIG.size;

        // Walls
        this.walls = [];
        this.nextWallTime = 0;
        this.wallSpawnRate = WALL_CONFIG.initialSpawnRate;

        // HUD
        this.createHUD();

        // Input handling
        this.input.keyboard.on('keydown-SPACE', () => this.morphShape());
        this.input.mouse.on('pointerdown', () => this.morphShape());
        this.input.keyboard.on('keydown-ESC', () => this.pauseGame());

        // Game loop
        this.time.addEvent({ delay: 16, callback: this.update, callbackScope: this, loop: true });

        console.log('Game started');
    }

    createHUD() {
        const hudDiv = document.createElement('div');
        hudDiv.className = 'hud-container';
        hudDiv.innerHTML = `
            <div class="hud-score" id="scoreDisplay">0</div>
            <div class="hud-combo" id="comboDisplay">COMBO: 0x</div>
            <div class="hud-high-score" id="highScoreDisplay">BEST: ${scoreManager.getHighScore()}</div>
        `;
        document.body.appendChild(hudDiv);

        // Add pause button
        const pauseBtn = document.createElement('button');
        pauseBtn.className = 'pause-btn';
        pauseBtn.textContent = 'PAUSE';
        pauseBtn.addEventListener('click', () => this.pauseGame());
        document.body.appendChild(pauseBtn);

        this.hudDiv = hudDiv;
        this.pauseBtn = pauseBtn;
    }

    updateHUD() {
        document.getElementById('scoreDisplay').textContent = this.formatNumber(this.score);
        document.getElementById('comboDisplay').textContent = `COMBO: ${this.combo}x`;
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    morphShape() {
        if (!this.gameActive) return;

        this.shapeIndex = (this.shapeIndex + 1) % SHAPE_ORDER.length;
        this.playerShape = SHAPE_ORDER[this.shapeIndex];

        audioManager.playMorphSound();
    }

    update(time, delta) {
        if (!this.gameActive) return;

        // Update walls
        this.updateWalls(delta);

        // Spawn new walls
        this.nextWallTime += delta;
        if (this.nextWallTime >= this.wallSpawnRate * 1000) {
            this.spawnWall();
            this.nextWallTime = 0;
        }

        // Update difficulty
        this.updateDifficulty();

        // Update particles
        this.particleManager.update(delta);

        // Render
        this.render();

        // Update HUD
        this.updateHUD();
    }

    updateWalls(delta) {
        const moveDistance = (this.gameSpeed * delta) / 1000;

        for (let i = this.walls.length - 1; i >= 0; i--) {
            const wall = this.walls[i];
            wall.y += moveDistance;

            // Check collision
            if (wall.y >= PLAYER_CONFIG.startY - 50 && wall.y <= PLAYER_CONFIG.startY + 50) {
                if (!wall.checked) {
                    wall.checked = true;
                    this.checkCollision(wall);
                }
            }

            // Remove if off screen
            if (wall.y > this.cameras.main.height) {
                this.walls.splice(i, 1);
            }
        }
    }

    spawnWall() {
        const randomShape = SHAPE_ORDER[Phaser.Math.Between(0, SHAPE_ORDER.length - 1)];
        const holeX = Phaser.Math.Between(100, this.cameras.main.width - 100);
        const holeWidth = Phaser.Math.Between(WALL_CONFIG.holeMinSize, WALL_CONFIG.holeMaxSize);

        const wall = {
            y: -100,
            shape: randomShape,
            holeX: holeX,
            holeWidth: holeWidth,
            checked: false
        };

        this.walls.push(wall);
    }

    checkCollision(wall) {
        const playerX = PLAYER_CONFIG.startX;
        const playerY = PLAYER_CONFIG.startY;
        const holeY = wall.y;
        const holeHeight = 30;

        // Check if player shape matches wall hole
        const shapeMatches = this.playerShape === wall.shape;
        const positionCorrect = Math.abs(playerX - (wall.holeX + wall.holeWidth / 2)) < wall.holeWidth / 2;

        if (shapeMatches && positionCorrect) {
            // Success
            this.onWallPass(wall);
        } else {
            // Crash
            this.onCrash();
        }
    }

    onWallPass(wall) {
        this.shapesPassed++;
        this.combo++;

        // Calculate score
        const baseScore = GAME_SETTINGS.baseScore;
        const comboMultiplier = Math.pow(GAME_SETTINGS.comboMultiplier, this.combo - 1);
        const scoreGain = Math.round(baseScore * comboMultiplier);
        this.score += scoreGain;

        // Check for perfect
        const isPerfect = this.checkPerfect(wall);
        if (isPerfect) {
            this.score += GAME_SETTINGS.perfectBonus;
            audioManager.playPerfectSound();
        } else {
            audioManager.playSuccessSound();
        }

        // Particles
        this.particleManager.emit(
            PLAYER_CONFIG.startX,
            PLAYER_CONFIG.startY,
            10,
            'success',
            0x00ff00
        );

        // Milestone effects
        if (this.combo % 5 === 0) {
            audioManager.playComboSound(this.combo);
            this.cameras.main.shake(150, 0.01);
        }
    }

    checkPerfect(wall) {
        const playerX = PLAYER_CONFIG.startX;
        const wallCenterX = wall.holeX + wall.holeWidth / 2;
        const tolerance = wall.holeWidth * GAME_SETTINGS.perfectWindow;
        return Math.abs(playerX - wallCenterX) < tolerance;
    }

    onCrash() {
        this.gameActive = false;

        audioManager.playCrashSound();
        this.cameras.main.shake(300, 0.02);

        // Particles
        this.particleManager.emit(
            PLAYER_CONFIG.startX,
            PLAYER_CONFIG.startY,
            30,
            'crash',
            0xff0000
        );

        // Remove HUD
        this.hudDiv.remove();
        this.pauseBtn.remove();

        // Wait then show game over
        this.time.delayedCall(500, () => {
            this.scene.start('GameOver', {
                score: this.score,
                combo: this.combo,
                shapeCount: this.shapesPassed
            });
        });
    }

    updateDifficulty() {
        const newDifficulty = Math.floor(this.score / GAME_SETTINGS.scorePerDifficultyLevel) + 1;
        if (newDifficulty !== this.difficulty) {
            this.difficulty = Math.min(newDifficulty, GAME_SETTINGS.maxDifficulty);
            this.gameSpeed = PLAYER_CONFIG.baseSpeed + (this.difficulty * PLAYER_CONFIG.speedIncrement);
            this.wallSpawnRate = Math.max(
                WALL_CONFIG.minSpawnRate,
                WALL_CONFIG.initialSpawnRate * Math.pow(GAME_SETTINGS.difficultyScaling, this.difficulty - 1)
            );
        }
    }

    pauseGame() {
        audioManager.playClickSound();
        this.gameActive = false;
        this.scene.launch('Pause');
    }

    render() {
        // Clear graphics
        this.graphicsPlayer.clear();
        this.graphicsWalls.clear();

        // Draw background grid
        this.drawBackgroundGrid();

        // Draw walls
        this.drawWalls();

        // Draw player
        this.drawPlayer();

        // Draw particles
        this.particleManager.render(this.graphicsParticles);
    }

    drawBackgroundGrid() {
        this.graphicsWalls.lineStyle(1, 0x9d00ff, 0.1);
        const gridSize = 80;
        for (let x = 0; x < this.cameras.main.width; x += gridSize) {
            this.graphicsWalls.beginPath();
            this.graphicsWalls.moveTo(x, 0);
            this.graphicsWalls.lineTo(x, this.cameras.main.height);
            this.graphicsWalls.strokePath();
        }
    }

    drawWalls() {
        for (const wall of this.walls) {
            // Wall background
            this.graphicsWalls.fillStyle(0x00d4ff, 0.2);
            this.graphicsWalls.fillRect(0, wall.y, this.cameras.main.width, WALL_CONFIG.height);

            // Hole (transparent)
            this.graphicsWalls.fillStyle(0x050008, 1);
            this.graphicsWalls.fillRect(wall.holeX, wall.y + 10, wall.holeWidth, 20);

            // Border
            this.graphicsWalls.lineStyle(2, 0x9d00ff);
            this.graphicsWalls.strokeRect(wall.holeX, wall.y + 10, wall.holeWidth, 20);
        }
    }

    drawPlayer() {
        const x = PLAYER_CONFIG.startX;
        const y = PLAYER_CONFIG.startY;

        // Draw glow
        this.graphicsPlayer.fillStyle(0x00d4ff, 0.1);
        this.graphicsPlayer.fillCircle(x, y, PLAYER_CONFIG.glowRadius);

        // Draw shape
        const shapeFunc = SHAPE_DEFINITIONS[this.playerShape];
        shapeFunc(this.graphicsPlayer, x, y, this.playerSize, 0x00d4ff);

        // Draw outline
        this.graphicsPlayer.lineStyle(2, 0x9d00ff);
        if (this.playerShape === SHAPES.CIRCLE) {
            this.graphicsPlayer.strokeCircle(x, y, this.playerSize / 2);
        }
    }
}
