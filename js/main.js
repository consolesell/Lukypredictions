// Main application script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    init();
});

async function init() {
    // Load default matches (Today)
    if (document.getElementById('matches-list')) {
        await uiController.loadFilteredMatches('today');
        
        // Set up real-time updates
        dataService.listenForMatchUpdates('today', (matches) => {
            uiController.renderMatches(matches);
        });
    }
}

// Function to load match details (called from match-details.html)
async function loadMatchDetails(matchId) {
    if (!matchId) {
        console.error('No match ID provided');
        return;
    }
    
    const match = await dataService.getMatchDetails(matchId);
    if (match) {
        uiController.renderMatchDetails(match);
    } else {
        document.querySelector('main').innerHTML = '<div class="error-message">Match not found</div>';
    }
}
