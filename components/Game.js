// Game.js

import { AudioManager } from "./AudioManager";
import { PatrollingGnome } from "./PatrollingGnome";
import { Renderer } from "./Renderer";
import { Shot } from "./Shot";
import { StatsController } from "./StatController"
import { FallingWord } from "./FallingWord"

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.audioManager = new AudioManager();
        this.statsController = new StatsController();
        this.userId = Math.random().toString(36).substring(7);
        this.words = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.fallingWords = [];
        this.patrollingGnomes = [];
        this.shots = [];
        this.score = 0;
        this.lives = 10;
        this.isPaused = false;
        this.gameOver = false;
        this.highScores = Array.from({ length: 5 }, (_, i) => ({
            score: Math.floor(Math.random() * 1000) + 500,
            timestamp: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 // Random date within last 30 days
        })).sort((a, b) => b.score - a.score);;
        this.fakeUserIds = ['player1', 'player2', 'player3', 'player4', 'player5'];
        this.topScores = this.topScores = this.fakeUserIds.map(userId => ({
            userId,
            score: Math.floor(Math.random() * 2000) + 1000,
            timestamp: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        })).sort((a, b) => b.score - a.score);
        this.gnomeImages = ['gnome1.png', 'gnome2.png', 'gnome3.png', 'gnome4.png', 'gnome5.png']
    }

    init() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.resizeCanvas();
        this.renderer.preloadImages([...this.gnomeImages, 'walkingGnome.png']);
        this.renderer.onAllImagesLoaded = () => {
            this.gameLoop();
        };
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = this.canvas.width * 0.6;
    }

    addWord() {
        if (this.fallingWords.length < 5 && Math.random() < 0.02) {
            const word = this.words[Math.floor(Math.random() * this.words.length)];
            const randomGnomeImage = this.gnomeImages[Math.floor(Math.random() * this.gnomeImages.length)];
            this.fallingWords.push(new FallingWord(word, this.canvas.width, this.renderer, randomGnomeImage));
        }
    }

    async endGame() {
        this.gameOver = true;
        this.renderer.drawGameOver(this.score);
        try {
            await this.statsController.saveHighScore(this.userId, this.score);
            this.highScores = await this.statsController.getHighScores(this.userId);
            this.topScores = await this.statsController.getTopHighScores();
            console.log('High Scores:', this.highScores);
            console.log('Top Scores:', this.topScores);
            this.displayScores();
        } catch (error) {
            console.error('Error handling end game stats:', error);
        }
    }

    displayScores() {
        // Display high scores
        this.renderer.drawText('Your High Scores:', 10, this.canvas.height - 120);
        this.highScores.slice(0, 5).forEach((score, index) => {
            this.renderer.drawText(`${index + 1}. ${score.score} - ${new Date(score.timestamp).toLocaleDateString()}`, 10, this.canvas.height - 100 + (index * 20));
        });

        // Display top scores
        this.renderer.drawText('Top Scores:', this.canvas.width - 200, this.canvas.height - 120);
        this.topScores.slice(0, 5).forEach((score, index) => {
            this.renderer.drawText(`${index + 1}. ${score.userId}: ${score.score}`, this.canvas.width - 200, this.canvas.height - 100 + (index * 20));
        });
    }

    gameLoop() {
        if (this.isPaused || this.gameOver) return;

        this.renderer.clear();
        this.renderer.drawBackground();
        this.renderer.drawShip();

        this.fallingWords = this.fallingWords.filter((word) => {
            word.draw();
            word.update();

            if (word.y > this.canvas.height - 30) {
                this.lives--;
                this.audioManager.playSound(this.audioManager.hurtSound);
                this.patrollingGnomes.push(new PatrollingGnome(word.x, this.canvas.width, this.canvas.height, this.renderer, 'walkingGnome.png'));
                return false;
            }
            return true;
        });

        this.patrollingGnomes.forEach(gnome => {
            gnome.draw();
            gnome.update();
        });

        this.shots = this.shots.filter((shot) => {
            shot.draw();
            const hitTarget = shot.update();
            if (hitTarget) {
                this.score += shot.target.word.length;
                this.fallingWords = this.fallingWords.filter(word => word !== shot.target);
                this.audioManager.playSound(this.audioManager.destroySound);

                this.renderer.drawText(`+${shot.target.word.length}`, shot.x, shot.y, {
                    font: 'bold 16px Arial',
                    fillStyle: 'lime',
                    textAlign: 'center'
                });
                return false;
            }
            return true;
        });

        this.renderer.drawText(`Score: ${this.score}`, 10, 30);
        this.renderer.drawText(`Lives: ${this.lives}`, 10, 55);
        this.addWord();

        if (this.lives > 0) {
            requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            this.endGame();
        }
    }

    handleInput(typedWord) {
        const targetWord = this.fallingWords.find(word => word.word === typedWord);
        if (targetWord) {
            this.shots.push(new Shot(this.canvas.width / 2, this.canvas.height - 30, targetWord, this.renderer));
            this.audioManager.playSound(this.audioManager.fireSound);
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.gameLoop();
        }
    }

    reset() {
        this.score = 0;
        this.lives = 10;
        this.gameOver = false;
        this.fallingWords = [];
        this.patrollingGnomes = [];
        this.shots = [];
        this.highScores = [];
        this.topScores = [];
        if (!this.isPaused) {
            this.gameLoop();
        }
    }
}