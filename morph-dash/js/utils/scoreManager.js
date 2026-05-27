/* ========================================
   SCORE MANAGER
   localStorage-based high score persistence
   ======================================== */

class ScoreManager {
    constructor() {
        this.storageKey = 'morph-dash-scores';
        this.statsKey = 'morph-dash-stats';
        this.maxScores = 100;
        this.scores = this.loadScores();
        this.stats = this.loadStats();
    }

    addScore(score, combo, shapes) {
        const scoreData = {
            score: score,
            combo: combo,
            shapesDestroyed: shapes,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        this.scores.unshift(scoreData);
        if (this.scores.length > this.maxScores) {
            this.scores.pop();
        }

        // Update stats
        this.stats.totalGames++;
        this.stats.totalScore += score;
        if (score > this.stats.highScore) {
            this.stats.highScore = score;
        }
        if (combo > this.stats.bestCombo) {
            this.stats.bestCombo = combo;
        }
        this.stats.lastPlayDate = new Date().toISOString();

        this.saveScores();
        this.saveStats();

        return this.scores[0];
    }

    getHighScore() {
        return this.stats.highScore || 0;
    }

    getTopScores(count = 10) {
        return this.scores.slice(0, count);
    }

    getAllScores() {
        return [...this.scores];
    }

    getFormattedStats() {
        return {
            highScore: this.stats.highScore || 0,
            totalGames: this.stats.totalGames || 0,
            totalScore: this.stats.totalScore || 0,
            bestCombo: this.stats.bestCombo || 0,
            averageScore: this.stats.totalGames > 0 ? Math.round(this.stats.totalScore / this.stats.totalGames) : 0,
            lastPlayDate: this.stats.lastPlayDate || 'Never'
        };
    }

    saveScores() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
        } catch (e) {
            console.warn('Could not save scores to localStorage:', e);
        }
    }

    loadScores() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('Could not load scores from localStorage:', e);
            return [];
        }
    }

    saveStats() {
        try {
            localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Could not save stats to localStorage:', e);
        }
    }

    loadStats() {
        try {
            const data = localStorage.getItem(this.statsKey);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('Could not load stats from localStorage:', e);
        }

        return {
            highScore: 0,
            totalGames: 0,
            totalScore: 0,
            bestCombo: 0,
            lastPlayDate: null
        };
    }

    reset() {
        this.scores = [];
        this.stats = {
            highScore: 0,
            totalGames: 0,
            totalScore: 0,
            bestCombo: 0,
            lastPlayDate: null
        };
        this.saveScores();
        this.saveStats();
    }
}

// Global instance
const scoreManager = new ScoreManager();
