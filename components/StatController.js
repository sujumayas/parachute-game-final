// StatsController.js
export class StatsController {
    constructor() {
        this.apiUrl = '/api/highscores'; // Adjust this to your API endpoint
    }

    saveHighScore = async (score) => {
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
    }

    getHighScores = async () => {
        try {
            const response = await fetch(`/.netlify/functions/getHighScores?userId=${userId}`);
            const data = await response.json();
            setHighScores(data);
        } catch (error) {
            console.error('Error getting high scores:', error);
        }
    }

    getTopHighScores = async () => {
        try {
            const response = await fetch('/.netlify/functions/getTopHighScores');
            const data = await response.json();
            setTopScores(data);
        } catch (error) {
            console.error('Error getting top high scores:', error);
        }
    }
}
