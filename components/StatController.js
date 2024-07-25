// StatsController.js
export class StatsController {
    constructor() {
        this.functionPath = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/.netlify/functions/' : '/.netlify/functions/'; // Adjust this to your API endpoint
    }

    saveHighScore = async (userId, score) => {
        try {
            const response = await fetch(`${this.functionPath}saveHighScore`, {
                method: 'POST',
                body: JSON.stringify({ userId, score }),
            });
            const data = await response.json();
            console.log('High score saved:', data);
        } catch (error) {
            console.error('Error saving high score:', error);
        }
    }

    getHighScores = async (userId) => {
        try {
            const response = await fetch(`${this.functionPath}getHighScores?userId=${userId}`);
            const data = await response.json();
            console.log('High scores retrieved:', data);
            return data;
        } catch (error) {
            console.error('Error getting high scores:', error);
        }
    }

    getTopHighScores = async () => {
        try {
            const response = await fetch(`${this.functionPath}getTopHighScores`);
            const data = await response.json();
            console.log('Top scores retrieved:', data);
            return data;
        } catch (error) {
            console.error('Error getting top high scores:', error);
        }
    }
}
