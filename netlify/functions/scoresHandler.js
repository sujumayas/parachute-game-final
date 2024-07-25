// scoresHandler.js
const fs = require('fs').promises;
const path = require('path');

// Use an environment variable to set the base path
// This should be set to the root of your project when deployed
const BASE_PATH = process.env.NETLIFY ? path.join(__dirname, '..', '..') : process.cwd();
const SCORES_FILE = path.join(BASE_PATH, 'public', 'scores.json');

async function readScores() {
    try {
        const data = await fs.readFile(SCORES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return empty data structure
            return { highScores: {}, topScores: [] };
        }
        throw error;
    }
}

async function writeScores(scores) {
    await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
}

module.exports = { readScores, writeScores };