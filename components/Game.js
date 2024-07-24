// pages/index.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [userId, setUserId] = useState(null);
    const [highScores, setHighScores] = useState([]);
    const [topScores, setTopScores] = useState([]);

    useEffect(() => {
        // Generate a random user ID if not already set
        if (!userId) {
            setUserId(Math.random().toString(36).substring(7));
        }
    }, []);

    const saveHighScore = async (score) => {
        try {
            const response = await fetch('/.netlify/functions/saveHighScore', {
                method: 'POST',
                body: JSON.stringify({ userId, score }),
            });
            const data = await response.json();
            console.log('High score saved:', data);
            getHighScores();
        } catch (error) {
            console.error('Error saving high score:', error);
        }
    };

    const getHighScores = async () => {
        try {
            const response = await fetch(`/.netlify/functions/getHighScores?userId=${userId}`);
            const data = await response.json();
            setHighScores(data);
        } catch (error) {
            console.error('Error getting high scores:', error);
        }
    };

    const getTopHighScores = async () => {
        try {
            const response = await fetch('/.netlify/functions/getTopHighScores');
            const data = await response.json();
            setTopScores(data);
        } catch (error) {
            console.error('Error getting top high scores:', error);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Word Parachute Game</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Word Parachute Game</h1>

                <div id="gameContainer" className={styles.gameContainer}>
                    <img
                        src="https://as2.ftcdn.net/v2/jpg/07/74/59/31/1000_F_774593110_JqF5VoFkHpEG39ux6ngEY6OVJJ6RT3lN.jpg"
                        alt="Game Background"
                        id="backgroundImage"
                        className={styles.backgroundImage}
                    />
                    <button className={styles.pauseButton}>Pause</button>
                </div>

                <div id="audioControls" className={styles.audioControls}>
                    <button className={styles.audioButton}>Toggle Music</button>
                    <button className={styles.audioButton}>Toggle SFX</button>
                </div>

                <div className={styles.scoreContainer}>
                    <button onClick={() => saveHighScore(100)}>Save High Score (100)</button>
                    <button onClick={getHighScores}>Get My High Scores</button>
                    <button onClick={getTopHighScores}>Get Top 10 High Scores</button>
                </div>

                <div className={styles.scoresList}>
                    <h2>My High Scores</h2>
                    <ul>
                        {highScores.map((score, index) => (
                            <li key={index}>{score}</li>
                        ))}
                    </ul>
                </div>

                <div className={styles.scoresList}>
                    <h2>Top 10 High Scores</h2>
                    <ul>
                        {topScores.map((score, index) => (
                            <li key={index}>{score.userId}: {score.score}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}