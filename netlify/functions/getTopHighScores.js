// getTopHighScores.js
const { readScores } = require('./scoresHandler');
const corsHandler = require('./corsHandler');

const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200 };
    }

    try {
        const scores = await readScores();

        return {
            statusCode: 200,
            body: JSON.stringify(scores.topScores),
        };
    } catch (error) {
        console.error('Error retrieving top high scores:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve top high scores', details: error.message }),
        };
    }
};

exports.handler = corsHandler(handler);