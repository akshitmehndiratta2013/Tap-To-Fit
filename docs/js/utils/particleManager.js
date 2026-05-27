/* ========================================
   PARTICLE MANAGER
   Custom particle system for effects
   ======================================== */

class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 500;
    }

    emit(x, y, count, preset = 'success', color = 0x00d4ff) {
        const config = PARTICLE_PRESETS[preset] || PARTICLE_PRESETS.success;

        for (let i = 0; i < count; i++) {
            const angle = Phaser.Math.Between(0, 360);
            const speed = Phaser.Math.Between(config.speed.min, config.speed.max);
            const velocity = new Phaser.Math.Vector2(
                Math.cos(Phaser.Math.DegToRad(angle)) * speed,
                Math.sin(Phaser.Math.DegToRad(angle)) * speed
            );

            const particle = {
                x: x,
                y: y,
                vx: velocity.x,
                vy: velocity.y,
                life: config.lifespan,
                maxLife: config.lifespan,
                scale: config.scale.start,
                alpha: config.alpha.start,
                color: color,
                scaleEnd: config.scale.end,
                alphaEnd: config.alpha.end,
                gravityY: config.gravityY || 0
            };

            this.particles.push(particle);
        }

        // Limit particles
        if (this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(-this.maxParticles);
        }
    }

    update(deltaTime) {
        const dt = deltaTime / 1000; // Convert to seconds

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= deltaTime;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Update position
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += p.gravityY * dt; // Apply gravity

            // Update scale and alpha
            const progress = 1 - (p.life / p.maxLife);
            p.scale = Phaser.Math.Interpolation.Linear(
                [p.scale - (p.scale - p.scaleEnd) * progress],
                0
            )[0];
            p.alpha = Phaser.Math.Interpolation.Linear(
                [p.alpha - (p.alpha - p.alphaEnd) * progress],
                0
            )[0];
        }
    }

    render(graphics) {
        graphics.clear();

        for (const p of this.particles) {
            graphics.fillStyle(p.color, p.alpha);
            graphics.fillCircle(p.x, p.y, p.scale * 4);
        }
    }

    clear() {
        this.particles = [];
    }

    getCount() {
        return this.particles.length;
    }
}
