// netlify/functions/scoresHandler.js
require('dotenv').config();
const corsHandler = require('./corsHandler');

const XATA_API_KEY = process.env.XATA_API_KEY; 
const XATA_DB_URL = process.env.DATABASE_URL;

if (!XATA_API_KEY || !XATA_DB_URL) {
    console.error('Missing environment variables: XATA_API_KEY or DATABASE_URL');
}

const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${XATA_API_KEY}`,
        'Content-Type': 'application/json'
    }
};
async function readScores() {
    try {
        if (!XATA_DB_URL) {
            throw new Error('DATABASE_URL is not defined');
        }

        const response = await fetch(`${XATA_DB_URL}/tables/scores/query`, {
            ...options,
            method: 'POST',
            body: JSON.stringify({
                columns: ['id', 'highScores', 'topScores'],
                page: { size: 1 }
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Read scores:", data);

        if (data.records && data.records.length > 0) {
            const record = data.records[0];
            return {
                id: record.id,
                highScores: JSON.parse(record.highScores || '{}'),
                topScores: JSON.parse(record.topScores || '[]')
            };
        } else {
            return { id: null, highScores: {}, topScores: [] };
        }
    } catch (error) {
        console.error("Error in readScores:", error);
        throw error;
    }
}

async function writeScores(scores) {
    try {
        if (!XATA_DB_URL) {
            throw new Error('DATABASE_URL is not defined');
        }

        // Convert the scores objects to JSON strings
        const formattedScores = {
            highScores: JSON.stringify(scores.highScores),
            topScores: JSON.stringify(scores.topScores)
        };

        const response = await fetch(`${XATA_DB_URL}/tables/scores/data?columns=id`, {
            ...options,
            method: 'POST',
            body: JSON.stringify(formattedScores)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Write scores result:", result);
        return result;
    } catch (error) {
        console.error("Error in writeScores:", error);
        throw error;
    }
}

module.exports = { readScores, writeScores };