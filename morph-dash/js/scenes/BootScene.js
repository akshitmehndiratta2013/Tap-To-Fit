/* ========================================
   BOOT SCENE
   Poki SDK initialization and preload
   ======================================== */

class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Show loading progress if needed
        console.log('Boot Scene: Initializing...');
    }

    create() {
        // Initialize Poki SDK
        this.initPokiSDK();

        // Start menu scene
        this.scene.start('Menu');
    }

    initPokiSDK() {
        if (typeof window.PokiSDK !== 'undefined') {
            try {
                PokiSDK.init();
                console.log('Poki SDK initialized');

                // Optional: Set up SDK event handlers
                if (PokiSDK.onAdStart) {
                    PokiSDK.onAdStart(() => {
                        console.log('Ad started');
                        // Pause game if needed
                        const gameScene = this.scene.get('Game');
                        if (gameScene && gameScene.isActive()) {
                            this.scene.pause('Game');
                        }
                    });
                }

                if (PokiSDK.onAdFinish) {
                    PokiSDK.onAdFinish(() => {
                        console.log('Ad finished');
                        // Resume game if needed
                        const gameScene = this.scene.get('Game');
                        if (gameScene && gameScene.isPaused()) {
                            this.scene.resume('Game');
                        }
                    });
                }
            } catch (error) {
                console.warn('Poki SDK not available:', error);
            }
        } else {
            console.log('Poki SDK not loaded (local testing)');
        }
    }
}
