// netlify/functions/saveHighScore.js
const { readScores, writeScores } = require('./scoresHandler');
const corsHandler = require('./corsHandler');

const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200 }; // Handle preflight request
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userId, score } = JSON.parse(event.body);
        const scores = await readScores();

        // Update user's high scores
        if (!scores.highScores[userId]) {
            scores.highScores[userId] = [];
        }
        scores.highScores[userId].push({ score: parseInt(score), timestamp: Date.now() });
        scores.highScores[userId].sort((a, b) => b.score - a.score);
        scores.highScores[userId] = scores.highScores[userId].slice(0, 10);

        // Update global top scores
        scores.topScores.push({ userId, score: parseInt(score), timestamp: Date.now() });
        scores.topScores.sort((a, b) => b.score - a.score);
        scores.topScores = scores.topScores.slice(0, 10);

        await writeScores(scores);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'High score saved successfully', scores: scores.highScores[userId] }),
        };
    } catch (error) {
        console.error('Error in saveHighScore function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save high score', details: error.message }),
        };
    }
};

exports.handler = corsHandler(handler);