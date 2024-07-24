// netlify/functions/saveHighScore.js
const { getKVStore } = require('@netlify/functions');

exports.handler = async (event) => {
    const { userId, score } = JSON.parse(event.body);
    const kvstore = getKVStore();

    try {
        // Get existing scores
        let scores = await kvstore.get(`highscores_${userId}`) || [];
        if (!Array.isArray(scores)) {
            scores = [];
        }

        // Add new score
        scores.push(parseInt(score));

        // Sort and keep only top 10
        scores.sort((a, b) => b - a);
        scores = scores.slice(0, 10);

        // Save updated scores
        await kvstore.set(`highscores_${userId}`, scores);

        // Update global top scores
        let topScores = await kvstore.get('top_highscores') || [];
        topScores.push({ userId, score: parseInt(score) });
        topScores.sort((a, b) => b.score - a.score);
        topScores = topScores.slice(0, 10);
        await kvstore.set('top_highscores', topScores);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'High score saved successfully', scores }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save high score' }),
        };
    }
};