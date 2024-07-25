import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Game } from './Game';

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