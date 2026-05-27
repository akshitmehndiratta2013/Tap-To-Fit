/* ========================================
   GAME OVER SCENE
   Game over screen with rewarded ad revive
   ======================================== */

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalCombo = data.combo || 0;
        this.shapeCount = data.shapeCount || 0;
    }

    create() {
        audioManager.playCrashSound();

        // Save score
        scoreManager.addScore(this.finalScore, this.finalCombo, this.shapeCount);

        // Create game over UI
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over-container';
        gameOverDiv.innerHTML = `
            <div class="game-over-content">
                <h2>GAME OVER</h2>
                
                <div class="score-display">
                    <div class="score-label">FINAL SCORE</div>
                    <div class="score-value">${this.formatNumber(this.finalScore)}</div>
                </div>
                
                <div class="combo-display">
                    <div class="score-label">MAX COMBO</div>
                    <div class="combo-value">${this.finalCombo}x</div>
                </div>
                
                <div class="score-display">
                    <div class="score-label">HIGH SCORE</div>
                    <div class="score-value">${this.formatNumber(scoreManager.getHighScore())}</div>
                </div>
                
                <div class="game-over-buttons">
                    <button class="revive-btn" id="reviveBtn">🎁 REVIVE</button>
                    <button id="restartBtn">RESTART</button>
                    <button id="menuBtn">MAIN MENU</button>
                </div>
            </div>
        `;
        document.body.appendChild(gameOverDiv);

        // Revive button (rewarded ad)
        document.getElementById('reviveBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            this.attemptRevive(gameOverDiv);
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            gameOverDiv.remove();
            this.restartGame();
        });

        // Menu button
        document.getElementById('menuBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            gameOverDiv.remove();

            // Signal Poki gameplay stop
            if (window.PokiSDK && window.PokiSDK.gameplayStop) {
                window.PokiSDK.gameplayStop();
            }

            this.scene.start('Menu');
        });
    }

    attemptRevive(gameOverDiv) {
        // Check if Poki SDK is available and has rewarded ads
        if (typeof window.PokiSDK !== 'undefined' && window.PokiSDK.rewardedBreak) {
            PokiSDK.rewardedBreak(() => {
                // Player watched the ad successfully
                console.log('Revived from ad');
                gameOverDiv.remove();
                this.reviveGame();
            });
        } else {
            // Fallback: revive without ad (for testing)
            alert('Revive feature requires Poki SDK');
            console.log('Revived (local testing)');
            gameOverDiv.remove();
            this.reviveGame();
        }
    }

    reviveGame() {
        // Return to game scene with revive flag
        this.scene.start('Game', { revive: true, previousScore: this.finalScore });
    }

    restartGame() {
        // Start fresh game
        this.scene.start('Game', { revive: false });
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}
