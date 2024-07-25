// Game.js

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.backgroundImg = new Image();
        this.backgroundImg.src = 'https://as2.ftcdn.net/v2/jpg/07/74/59/31/1000_F_774593110_JqF5VoFkHpEG39ux6ngEY6OVJJ6RT3lN.jpg';
        this.gnomeImg = new Image();
        this.gnomeImg.src = 'gnome3.png';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawShip() {
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(this.canvas.width / 2 - 25, this.canvas.height - 30, 50, 30);
    }

    drawText(text, x, y, options = {}) {
        this.ctx.font = options.font || 'bold 20px Arial';
        this.ctx.fillStyle = options.fillStyle || 'white';
        this.ctx.strokeStyle = options.strokeStyle || 'black';
        this.ctx.lineWidth = options.lineWidth || 3;
        this.ctx.textAlign = options.textAlign || 'left';
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    drawGameOver(score) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawText('Game Over', this.canvas.width / 2, this.canvas.height / 2, {
            font: 'bold 40px Arial',
            textAlign: 'center'
        });
        this.drawText(`Final Score: ${score}`, this.canvas.width / 2, this.canvas.height / 2 + 40, {
            font: 'bold 20px Arial',
            textAlign: 'center'
        });
    }
}

class AudioManager {
    constructor(sfxEnabled = true, musicEnabled = false) {
        this.sfxEnabled = sfxEnabled;
        this.musicEnabled = musicEnabled;
        this.fireSound = new Audio('https://cdn.freesound.org/previews/427/427396_9497060-lq.mp3');
        this.destroySound = new Audio('https://cdn.freesound.org/previews/403/403297_6142149-lq.mp3');
        this.backgroundMusic = new Audio('https://cdn.freesound.org/previews/697/697844_10643461-lq.mp3');
        this.hurtSound = new Audio('https://cdn.freesound.org/previews/261/261855_4157918-lq.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.1;
        this.destroySound.volume = 0.06;
    }

    playSound(sound) {
        if (this.sfxEnabled) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.backgroundMusic.play();
        } else {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
    }
}

class FallingWord {
    constructor(word, canvasWidth, renderer) {
        this.word = word;
        this.x = Math.random() * (canvasWidth - 100);
        this.y = 0;
        this.speed = 0.5 + Math.random() * 1;
        this.amplitude = 20 + Math.random() * 30;
        this.frequency = 0.02 + Math.random() * 0.03;
        this.phase = Math.random() * Math.PI * 2;
        this.renderer = renderer;
    }

    draw() {
        const parachuteWidth = 80;
        const parachuteHeight = 60;
        const gnomeWidth = 60;
        const gnomeHeight = 60;

        // Draw parachute
        this.renderer.ctx.beginPath();
        this.renderer.ctx.moveTo(this.x, this.y);
        this.renderer.ctx.bezierCurveTo(
            this.x - parachuteWidth / 2, this.y - parachuteHeight / 2,
            this.x + parachuteWidth / 2, this.y - parachuteHeight / 2,
            this.x + parachuteWidth, this.y
        );
        this.renderer.ctx.strokeStyle = 'red';
        this.renderer.ctx.lineWidth = 2;
        this.renderer.ctx.stroke();

        // Draw strings
        this.renderer.ctx.beginPath();
        this.renderer.ctx.moveTo(this.x, this.y);
        this.renderer.ctx.lineTo(this.x + gnomeWidth / 2, this.y + parachuteHeight);
        this.renderer.ctx.moveTo(this.x + parachuteWidth, this.y);
        this.renderer.ctx.lineTo(this.x + gnomeWidth / 2, this.y + parachuteHeight);
        this.renderer.ctx.strokeStyle = 'black';
        this.renderer.ctx.lineWidth = 1;
        this.renderer.ctx.stroke();

        // Draw gnome
        this.renderer.ctx.drawImage(this.renderer.gnomeImg, this.x, this.y + parachuteHeight, gnomeWidth, gnomeHeight);

        // Draw word
        this.renderer.drawText(this.word, this.x + parachuteWidth / 2, this.y + 20, {
            textAlign: 'center'
        });
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y * this.frequency + this.phase) * this.amplitude / 20;
    }
}

class PatrollingGnome {
    constructor(x, canvasWidth, canvasHeight, renderer) {
        this.x = x;
        this.y = canvasHeight - 30;
        this.speed = 1;
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.canvasWidth = canvasWidth;
        this.renderer = renderer;
    }

    draw() {
        this.renderer.ctx.drawImage(this.renderer.gnomeImg, this.x, this.y - 30, 60, 60);
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x < 0 || this.x > this.canvasWidth - 30) {
            this.direction *= -1;
        }
    }
}

class Shot {
    constructor(x, y, target, renderer) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 5;
        this.renderer = renderer;
    }

    draw() {
        this.renderer.ctx.fillStyle = 'red';
        this.renderer.ctx.beginPath();
        this.renderer.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        this.renderer.ctx.fill();
    }

    update() {
        if (this.target) {
            const dx = (this.target.x + 40) - this.x;
            const dy = (this.target.y + 30) - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.speed) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            } else {
                this.x = this.target.x + 40;
                this.y = this.target.y + 30;
                return true; // Hit the target
            }
        }
        return false;
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.audioManager = new AudioManager();
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
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - 60;
    }

    addWord() {
        if (this.fallingWords.length < 5 && Math.random() < 0.02) {
            const word = this.words[Math.floor(Math.random() * this.words.length)];
            this.fallingWords.push(new FallingWord(word, this.canvas.width, this.renderer));
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
            this.gameOver = true;
            this.renderer.drawGameOver(this.score);
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

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
    const canvasRef = useRef(null);
    const gameRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    useEffect(() => {
        if (canvasRef.current && !gameRef.current) {
            gameRef.current = new Game(canvasRef.current);
            gameRef.current.init();
        }
    }, []);

    const handleInputChange = (e) => {
        if (gameRef.current) {
            gameRef.current.handleInput(e.target.value.toLowerCase());
            e.target.value = '';
        }
    };

    const togglePause = () => {
        if (gameRef.current) {
            gameRef.current.togglePause();
            setIsPaused(!isPaused);
        }
    };

    const toggleMusic = () => {
        if (gameRef.current) {
            gameRef.current.audioManager.toggleMusic();
            setMusicEnabled(!musicEnabled);
        }
    };

    const toggleSFX = () => {
        if (gameRef.current) {
            gameRef.current.audioManager.toggleSFX();
            setSfxEnabled(!sfxEnabled);
        }
    };

    const resetGame = () => {
        if (gameRef.current) {
            gameRef.current.reset();
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Word Parachute Game</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div id="gameContainer" className={styles.gameContainer}>
                    <canvas ref={canvasRef} id="gameCanvas"></canvas>
                    <button className={styles.pauseButton} onClick={togglePause}>
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button className={styles.resetButton} onClick={resetGame}>
                        Reset
                    </button>
                </div>

                <input
                    type="text"
                    onChange={handleInputChange}
                    className={styles.inputBox}
                    placeholder="Type words here"
                />

                <div id="audioControls" className={styles.audioControls}>
                    <button className={styles.audioButton} onClick={toggleMusic}>
                        {musicEnabled ? 'Disable Music' : 'Enable Music'}
                    </button>
                    <button className={styles.audioButton} onClick={toggleSFX}>
                        {sfxEnabled ? 'Disable SFX' : 'Enable SFX'}
                    </button>
                </div>
            </main>
        </div>
    );
}