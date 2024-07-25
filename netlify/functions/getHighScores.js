// netlify/functions/getHighScores.js
const { readScores } = require('./scoresHandler');
const corsHandler = require('./corsHandler');

const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200 }; // Handle preflight request
    }

    const { userId } = event.queryStringParameters;

    try {
        const scores = await readScores();
        const userScores = scores.highScores[userId] || [];

        return {
            statusCode: 200,
            body: JSON.stringify(userScores),
        };
    } catch (error) {
        console.error('Error retrieving high scores:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve high scores', details: error.message }),
        };
    }
};

exports.handler = corsHandler(handler);