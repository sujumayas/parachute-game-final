import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [userId, setUserId] = useState(null);
    const [highScores, setHighScores] = useState([]);
    const [topScores, setTopScores] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(10);
    const [isPaused, setIsPaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    const canvasRef = useRef(null);
    const inputRef = useRef(null);
    const animationRef = useRef(null);
    const fallingWordsRef = useRef([]);
    const patrollingGnomesRef = useRef([]);
    const shotsRef = useRef([]);
    const backgroundMusicRef = useRef(null);

    const words = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    useEffect(() => {
        if (!userId) {
            setUserId(Math.random().toString(36).substring(7));
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 60;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Audio setup
        const fireSound = new Audio('https://cdn.freesound.org/previews/61/61900_878851-lq.mp3');
        const destroySound = new Audio('https://cdn.freesound.org/previews/403/403297_6142149-lq.mp3');
        backgroundMusicRef.current = new Audio('https://cdn.freesound.org/previews/697/697844_10643461-lq.mp3');
        const hurtSound = new Audio('https://cdn.freesound.org/previews/261/261855_4157918-lq.mp3');
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = 0.1;
        destroySound.volume = 0.06;

        // Load gnome image
        const gnomeImg = new Image();
        gnomeImg.src = 'gnome3.png';

        // Load background image
        const backgroundImg = new Image();
        backgroundImg.src = 'https://as2.ftcdn.net/v2/jpg/07/74/59/31/1000_F_774593110_JqF5VoFkHpEG39ux6ngEY6OVJJ6RT3lN.jpg';


        class FallingWord {
            constructor(word) {
                this.word = word;
                this.x = Math.random() * (canvas.width - 100);
                this.y = 0;
                this.speed = 0.5 + Math.random() * 1;
                this.amplitude = 20 + Math.random() * 30;
                this.frequency = 0.02 + Math.random() * 0.03;
                this.phase = Math.random() * Math.PI * 2;
            }

            draw() {
                const parachuteWidth = 80;
                const parachuteHeight = 60;
                const gnomeWidth = 60;
                const gnomeHeight = 60;

                // Draw parachute
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.bezierCurveTo(
                    this.x - parachuteWidth / 2, this.y - parachuteHeight / 2,
                    this.x + parachuteWidth / 2, this.y - parachuteHeight / 2,
                    this.x + parachuteWidth, this.y
                );
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw strings
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + gnomeWidth / 2, this.y + parachuteHeight);
                ctx.moveTo(this.x + parachuteWidth, this.y);
                ctx.lineTo(this.x + gnomeWidth / 2, this.y + parachuteHeight);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw gnome
                ctx.drawImage(gnomeImg, this.x, this.y + parachuteHeight, gnomeWidth, gnomeHeight);

                // Draw word
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 3;
                ctx.textAlign = 'center';
                ctx.strokeText(this.word, this.x + parachuteWidth / 2, this.y + 20);
                ctx.fillText(this.word, this.x + parachuteWidth / 2, this.y + 20);
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.y * this.frequency + this.phase) * this.amplitude / 20;
            }
        }

        class PatrollingGnome {
            constructor(x) {
                this.x = x;
                this.y = canvas.height - 30;
                this.speed = 1;
                this.direction = Math.random() < 0.5 ? -1 : 1;
            }

            draw() {
                ctx.drawImage(gnomeImg, this.x, this.y - 30, 60, 60);
            }

            update() {
                this.x += this.speed * this.direction;
                if (this.x < 0 || this.x > canvas.width - 30) {
                    this.direction *= -1;
                }
            }
        }

        class Shot {
            constructor(x, y, target) {
                this.x = x;
                this.y = y;
                this.target = target;
                this.speed = 5;
            }

            draw() {
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
                ctx.fill();
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

        const addWord = () => {
            if (fallingWordsRef.current.length < 5 && Math.random() < 0.02) {
                const word = words[Math.floor(Math.random() * words.length)];
                fallingWordsRef.current.push(new FallingWord(word));
            }
        };

        const drawShip = () => {
            ctx.fillStyle = 'brown';
            ctx.fillRect(canvas.width / 2 - 25, canvas.height - 30, 50, 30);
        };

        const playSound = (sound) => {
            if (sfxEnabled) {
                sound.currentTime = 0;
                sound.play();
            }
        };

        const gameLoop = () => {
            if (isPaused || gameOver) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background image
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            
            drawShip();

            fallingWordsRef.current = fallingWordsRef.current.filter((word, index) => {
                word.draw();
                word.update();

                if (word.y > canvas.height - 30) {
                    setLives((prevLives) => {
                        const newLives = prevLives - 1;
                        if (newLives <= 0) {
                            setGameOver(true);
                        }
                        return newLives;
                    });
                    playSound(hurtSound);
                    patrollingGnomesRef.current.push(new PatrollingGnome(word.x));
                    return false;
                }
                return true;
            });

            patrollingGnomesRef.current.forEach(gnome => {
                gnome.draw();
                gnome.update();
            });

            shotsRef.current = shotsRef.current.filter((shot, index) => {
                shot.draw();
                const hitTarget = shot.update();
                if (hitTarget) {
                    setScore((prevScore) => prevScore + shot.target.word.length);
                    fallingWordsRef.current = fallingWordsRef.current.filter(word => word !== shot.target);
                    playSound(destroySound);

                    ctx.font = 'bold 16px Arial';
                    ctx.fillStyle = 'lime';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'center';
                    ctx.strokeText(`+${shot.target.word.length}`, shot.x, shot.y);
                    ctx.fillText(`+${shot.target.word.length}`, shot.x, shot.y);
                    return false;
                }
                return true;
            });

            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.textAlign = 'left';
            ctx.strokeText(`Score: ${score}`, 10, 30);
            ctx.fillText(`Score: ${score}`, 10, 30);
            ctx.strokeText(`Lives: ${lives}`, 10, 55);
            ctx.fillText(`Lives: ${lives}`, 10, 55);
            addWord();

            if (lives > 0) {
                animationRef.current = requestAnimationFrame(gameLoop);
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = 'bold 40px Arial';
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 5;
                ctx.textAlign = 'center';
                ctx.strokeText('Game Over', canvas.width / 2, canvas.height / 2);
                ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
                ctx.font = 'bold 20px Arial';
                ctx.strokeText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
                ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
            }
        };

        gnomeImg.onload = () => {
            if (musicEnabled) {
                backgroundMusic.play();
            }
            animationRef.current = requestAnimationFrame(gameLoop);
        };

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPaused, gameOver, lives, score, musicEnabled, sfxEnabled]);

    useEffect(() => {
        if (musicEnabled && backgroundMusicRef.current) {
            backgroundMusicRef.current.play();
        } else if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause();
            backgroundMusicRef.current.currentTime = 0;
        }
    }, [musicEnabled]);

    const handleInputChange = (e) => {
        const typedWord = e.target.value.toLowerCase();
        const targetWord = fallingWordsRef.current.find(word => word.word === typedWord);
        if (targetWord) {
            shotsRef.current.push(new Shot(canvasRef.current.width / 2, canvasRef.current.height - 30, targetWord));
            e.target.value = '';
            if (sfxEnabled) {
                const fireSound = new Audio('https://cdn.freesound.org/previews/61/61900_878851-lq.mp3');
                fireSound.play();
            }
        }
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const toggleMusic = () => {
        setMusicEnabled(!musicEnabled);
    };

    const toggleSFX = () => {
        setSfxEnabled(!sfxEnabled);
    };

    const resetGame = () => {
        setScore(0);
        setLives(10);
        setGameOver(false);
        fallingWordsRef.current = [];
        patrollingGnomesRef.current = [];
        shotsRef.current = [];
        if (!isPaused) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = requestAnimationFrame(gameLoop);
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
                    ref={inputRef}
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