/* ========================================
   PAUSE SCENE
   Overlay for paused game state
   ======================================== */

class PauseScene extends Phaser.Scene {
    constructor() {
        super('Pause');
    }

    create() {
        audioManager.playClickSound();

        // Create pause overlay
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Pause UI container
        const pauseDiv = document.createElement('div');
        pauseDiv.className = 'pause-overlay';
        pauseDiv.innerHTML = `
            <div class="pause-content">
                <h2>PAUSED</h2>
                <button id="resumeBtn">RESUME</button>
                <button id="menuBtn">MAIN MENU</button>
            </div>
        `;
        document.body.appendChild(pauseDiv);

        // Resume button
        document.getElementById('resumeBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            pauseDiv.remove();
            this.scene.resume('Game');
            this.scene.stop('Pause');
        });

        // Menu button
        document.getElementById('menuBtn').addEventListener('click', () => {
            audioManager.playClickSound();
            pauseDiv.remove();

            // Signal Poki gameplay stop
            if (window.PokiSDK && window.PokiSDK.gameplayStop) {
                window.PokiSDK.gameplayStop();
            }

            this.scene.stop('Game');
            this.scene.stop('Pause');
            this.scene.start('Menu');
        });
    }
}
