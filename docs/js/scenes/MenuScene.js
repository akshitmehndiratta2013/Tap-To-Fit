/* ========================================
   MENU SCENE
   Main menu UI and navigation
   ======================================== */

class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    create() {
        audioManager.playMenuSound();

        // Create animated background
        this.createBackground();

        // Create menu UI
        this.createMenuUI();
    }

    createBackground() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        graphics.fillStyle(0x050008, 1);
        graphics.fillRect(0, 0, width, height);

        // Grid pattern
        graphics.lineStyle(1, 0x9d00ff, 0.15);
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
            graphics.beginPath();
            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
            graphics.strokePath();
        }
        for (let y = 0; y < height; y += gridSize) {
            graphics.beginPath();
            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
            graphics.strokePath();
        }

        graphics.generateTexture('menuBg', width, height);
        graphics.destroy();

        const bg = this.add.image(width / 2, height / 2, 'menuBg');
        bg.setDepth(0);
    }

    createMenuUI() {
        const existingMenu = document.querySelector('.menu-container');
        if (existingMenu) existingMenu.remove();

        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu-container';
        menuDiv.innerHTML = `
            <h1 class="menu-title">MORPH DASH</h1>
            <p class="menu-subtitle">Shape Shifting Arcade Action</p>
            
            <button class="menu-button" id="playBtn">PLAY NOW</button>
            <button class="menu-button" id="statsBtn">STATISTICS</button>
            <button class="menu-button" id="settingsBtn">SETTINGS</button>
        `;
        document.body.appendChild(menuDiv);

        // Play button
        document.getElementById('playBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            menuDiv.remove();
            
            if (window.PokiSDK && window.PokiSDK.gameplayStart) {
                window.PokiSDK.gameplayStart();
            }
            
            this.scene.start('Game');
        });

        // Stats button
        document.getElementById('statsBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            this.showStats(menuDiv);
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            this.showSettings(menuDiv);
        });
    }

    showStats(menuDiv) {
        const stats = scoreManager.getFormattedStats();
        const topScores = scoreManager.getTopScores(5);

        const statsDiv = document.createElement('div');
        statsDiv.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5,0,8,0.95); z-index: 300;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            overflow-y: auto; padding: 20px;
        `;
        
        statsDiv.innerHTML = `
            <h2 style="color: #00d4ff; font-size: 36px; margin-bottom: 30px; text-shadow: 0 0 20px rgba(0,212,255,0.8);">STATISTICS</h2>
            
            <div style="background: rgba(0,212,255,0.05); border: 2px solid #9d00ff; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center; max-width: 400px;">
                <div style="margin: 10px 0; color: #00d4ff;">
                    <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">High Score:</span>
                    <span style="font-size: 28px; font-weight: bold; color: #ffff00; text-shadow: 0 0 10px rgba(255,255,0,0.8);"> ${stats.highScore}</span>
                </div>
                <div style="margin: 10px 0; color: #00d4ff;">
                    <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Games:</span>
                    <span style="font-size: 24px; font-weight: bold; color: #00d4ff;"> ${stats.totalGames}</span>
                </div>
                <div style="margin: 10px 0; color: #00d4ff;">
                    <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Best Combo:</span>
                    <span style="font-size: 24px; font-weight: bold; color: #ff6b00;"> ${stats.bestCombo}x</span>
                </div>
                <div style="margin: 10px 0; color: #00d4ff;">
                    <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Average Score:</span>
                    <span style="font-size: 24px; font-weight: bold; color: #00ff00;"> ${stats.averageScore}</span>
                </div>
            </div>

            ${topScores.length > 0 ? `
                <h3 style="color: #9d00ff; font-size: 24px; margin-bottom: 15px; text-shadow: 0 0 15px rgba(157,0,255,0.8);">TOP SCORES</h3>
                <div style="background: rgba(0,212,255,0.05); border: 2px solid #00d4ff; border-radius: 12px; padding: 15px; text-align: center; max-width: 400px;">
                    ${topScores.map((s, i) => `
                        <div style="margin: 8px 0; color: #00d4ff; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: bold; color: #ff6b00;">#${i + 1}</span>
                            <span style="font-weight: bold; color: #ffff00;">${s.score}</span>
                            <span style="font-size: 12px; color: #9d00ff;">${s.combo}x</span>
                        </div>
                    `).join('')}
                </div>
            ` : '<p style="color: #ff00ff;">No scores yet. Play to get started!</p>'}

            <button style="margin-top: 30px; padding: 12px 30px; background: linear-gradient(135deg, #00d4ff, #9d00ff); color: #050008; border: 2px solid #00d4ff; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;" id="backBtn">BACK</button>
        `;

        document.body.appendChild(statsDiv);
        document.getElementById('backBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            statsDiv.remove();
        });
    }

    showSettings(menuDiv) {
        const settingsDiv = document.createElement('div');
        settingsDiv.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5,0,8,0.95); z-index: 300;
            display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;
        `;
        
        settingsDiv.innerHTML = `
            <h2 style="color: #00d4ff; font-size: 36px; margin-bottom: 40px; text-shadow: 0 0 20px rgba(0,212,255,0.8);">SETTINGS</h2>
            
            <div style="background: rgba(0,212,255,0.05); border: 2px solid #9d00ff; border-radius: 12px; padding: 30px; text-align: center; max-width: 400px;">
                <div style="margin: 20px 0; text-align: left;">
                    <label style="display: block; color: #00d4ff; font-weight: bold; margin-bottom: 10px;">Master Volume</label>
                    <input type="range" min="0" max="100" value="${Math.round(audioManager.getMasterVolume() * 100)}" id="volumeSlider" style="width: 100%;">
                </div>

                <div style="margin: 20px 0;">
                    <label style="display: flex; align-items: center; color: #00d4ff; font-weight: bold; cursor: pointer;">
                        <input type="checkbox" id="audioToggle" ${audioManager.isEnabled() ? 'checked' : ''} style="margin-right: 10px; width: 20px; height: 20px;">
                        Enable Sound
                    </label>
                </div>

                <button id="resetBtn" style="margin-top: 20px; padding: 10px 20px; background: linear-gradient(135deg, #ff0000, #ff6b00); color: white; border: 2px solid #ff0000; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer;">RESET ALL DATA</button>

                <p style="color: #9d00ff; font-size: 12px; margin-top: 15px; text-transform: uppercase;">v1.0.0</p>
            </div>

            <button style="margin-top: 30px; padding: 12px 30px; background: linear-gradient(135deg, #00d4ff, #9d00ff); color: #050008; border: 2px solid #00d4ff; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;" id="backBtn">BACK</button>
        `;

        document.body.appendChild(settingsDiv);

        document.getElementById('volumeSlider').addEventListener('change', (e) => {
            audioManager.setMasterVolume(e.target.value / 100);
        });

        document.getElementById('audioToggle').addEventListener('change', (e) => {
            audioManager.setEnabled(e.target.checked);
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Reset all data? This cannot be undone.')) {
                scoreManager.reset();
                alert('Data reset!');
                settingsDiv.remove();
                audioManager.playClickSound();
            }
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            settingsDiv.remove();
        });
    }
}
