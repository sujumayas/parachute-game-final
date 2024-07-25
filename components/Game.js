// Game.js

import { AudioManager } from "./AudioManager";
import { PatrollingGnome } from "./PatrollingGnome";
import { Renderer } from "./Renderer";
import { Shot } from "./Shot";
import { StatsController } from "./StatController"

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.audioManager = new AudioManager();
        this.statsController = new StatsController();
        this.words = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.fallingWords = [];
        this.patrollingGnomes = [];
        this.shots = [];
        this.score = 0;
        this.lives = 10;
        this.isPaused = false;
        this.gameOver = false;
    }

    init() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.resizeCanvas();
        this.gameLoop();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = this.canvas.width * 0.6;
    }

    addWord() {
        if (this.fallingWords.length < 5 && Math.random() < 0.02) {
            const word = this.words[Math.floor(Math.random() * this.words.length)];
            this.fallingWords.push(new FallingWord(word, this.canvas.width, this.renderer));
        }
    }

    async endGame() {
        this.gameOver = true;
        this.renderer.drawGameOver(this.score);
        try {
            await this.statsController.updateHighScore(this.userId, this.score);
            const highScores = await this.statsController.getHighScores(this.userId);
            const topScores = await this.statsController.getTopHighScores();
            console.log('High Scores:', highScores);
            console.log('Top Scores:', topScores);
            // You can update the UI with these scores if needed
        } catch (error) {
            console.error('Error handling end game stats:', error);
        }
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
                this.patrollingGnomes.push(new PatrollingGnome(word.x, this.canvas.width, this.canvas.height, this.renderer));
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
        if (!this.isPaused) {
            this.gameLoop();
        }
    }
}

