// Data service to handle all Firebase interactions
class DataService {
    constructor() {
        this.database = firebase.database();
    }

    // Get matches for a specific day
    async getMatches(day) {
        try {
            const snapshot = await this.database.ref(`matches/${day}`).once('value');
            return snapshot.val() || [];
        } catch (error) {
            console.error('Error fetching matches:', error);
            return [];
        }
    }

    // Get details for a specific match
    async getMatchDetails(matchId) {
        try {
            const snapshot = await this.database.ref(`matchDetails/${matchId}`).once('value');
            return snapshot.val() || null;
        } catch (error) {
            console.error('Error fetching match details:', error);
            return null;
        }
    }

    // Get predictions for a specific match
    async getPredictions(matchId) {
        try {
            const snapshot = await this.database.ref(`predictions/${matchId}`).once('value');
            return snapshot.val() || [];
        } catch (error) {
            console.error('Error fetching predictions:', error);
            return [];
        }
    }

    // Listen for real-time updates to matches
    listenForMatchUpdates(day, callback) {
        this.database.ref(`matches/${day}`).on('value', (snapshot) => {
            callback(snapshot.val() || []);
        });
    }
}

// Create global data service instance
const dataService = new DataService();
