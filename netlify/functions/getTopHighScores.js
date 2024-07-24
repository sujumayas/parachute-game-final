// netlify/functions/getTopHighScores.js
const { getKVStore } = require('@netlify/functions');

exports.handler = async () => {
    const kvstore = getKVStore();

    try {
        const topScores = await kvstore.get('top_highscores') || [];
        return {
            statusCode: 200,
            body: JSON.stringify(topScores),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve top high scores' }),
        };
    }
};