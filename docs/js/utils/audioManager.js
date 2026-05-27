/* ========================================
   AUDIO MANAGER
   Web Audio API for procedural sounds
   ======================================== */

class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = AUDIO_SETTINGS.masterVolume;
        this.soundVolume = AUDIO_SETTINGS.soundVolume;
        this.enabled = AUDIO_SETTINGS.enabled;
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = this.masterVolume;
    }

    playSound(frequency, duration, type = 'sine') {
        if (!this.enabled) return;

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, now);
        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(this.soundVolume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playMorphSound() {
        this.playSound(400, 0.1);
    }

    playSuccessSound() {
        const now = this.audioContext.currentTime;
        const frequencies = [523, 659, 784]; // C, E, G
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playSound(freq, 0.15), i * 50);
        });
    }

    playPerfectSound() {
        this.playSound(800, 0.08);
        this.playSound(600, 0.08, 'sine');
    }

    playComboSound(comboLevel) {
        const baseFreq = 600;
        const frequency = baseFreq + (comboLevel * 30);
        this.playSound(frequency, 0.12);
    }

    playCrashSound() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(this.soundVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    playClickSound() {
        this.playSound(1000, 0.05, 'square');
    }

    playMenuSound() {
        const now = this.audioContext.currentTime;
        [523, 659].forEach((freq, i) => {
            setTimeout(() => this.playSound(freq, 0.1), i * 100);
        });
    }

    setMasterVolume(volume) {
        this.masterVolume = Phaser.Math.Clamp(volume, 0, 1);
        this.masterGain.gain.value = this.masterVolume;
    }

    getMasterVolume() {
        return this.masterVolume;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    isEnabled() {
        return this.enabled;
    }
}

// Global instance
const audioManager = new AudioManager();
