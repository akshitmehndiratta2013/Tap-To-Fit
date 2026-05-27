/* ========================================
   MORPH DASH - MAIN ENTRY POINT
   Phaser Game Initialization
   ======================================== */

// Initialize the game when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Phaser to be ready
    if (typeof Phaser === 'undefined') {
        console.error('Phaser not loaded!');
        return;
    }

    // Create Phaser game instance
    const game = new Phaser.Game(GAME_CONFIG);

    // Expose game globally for debugging
    window.morphDashGame = game;

    // Handle window resize
    window.addEventListener('resize', () => {
        if (game && game.scale) {
            game.scale.refresh();
        }
    });

    console.log('Morph Dash initialized successfully');
});
