// netlify/functions/getHighScores.js
const { getKVStore } = require('@netlify/functions');

exports.handler = async (event) => {
    const { userId } = event.queryStringParameters;
    const kvstore = getKVStore();

    try {
        const scores = await kvstore.get(`highscores_${userId}`) || [];
        return {
            statusCode: 200,
            body: JSON.stringify(scores),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve high scores' }),
        };
    }
};