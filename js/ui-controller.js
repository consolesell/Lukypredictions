// UI Controller to handle DOM manipulations
class UIController {
    constructor() {
        // Theme handling
        this.themeSwitch = document.getElementById('theme-switch');
        if (this.themeSwitch) {
            this.initThemeSwitch();
        }
        
        // Tab handling
        this.tabs = document.querySelectorAll('.tab-btn');
        if (this.tabs.length > 0) {
            this.initTabs();
        }
    }

    initThemeSwitch() {
        // Set initial theme based on user preference
        const darkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.themeSwitch.checked = localStorage.getItem('darkMode') === 'true' || darkModePreferred;
        this.toggleTheme(this.themeSwitch.checked);

        // Listen for theme changes
        this.themeSwitch.addEventListener('change', () => {
            this.toggleTheme(this.themeSwitch.checked);
            localStorage.setItem('darkMode', this.themeSwitch.checked);
        });
    }

    toggleTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
    }

    initTabs() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.setActiveTab(tab);
                const filter = tab.dataset.filter;
                this.loadFilteredMatches(filter);
            });
        });
    }

    setActiveTab(activeTab) {
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    async loadFilteredMatches(filter) {
        const matchesList = document.getElementById('matches-list');
        matchesList.innerHTML = '<div class="loading">Loading matches...</div>';
        
        const matches = await dataService.getMatches(filter);
        this.renderMatches(matches);
    }

    renderMatches(matches) {
        const matchesList = document.getElementById('matches-list');
        if (!matches || matches.length === 0) {
            matchesList.innerHTML = '<div class="no-matches">No matches available</div>';
            return;
        }

        // Group matches by league
        const leagueGroups = {};
        matches.forEach(match => {
            if (!leagueGroups[match.league]) {
                leagueGroups[match.league] = [];
            }
            leagueGroups[match.league].push(match);
        });

        // Generate HTML for each league group
        let html = '';
        for (const league in leagueGroups) {
            html += `
                <div class="league-section">
                    <div class="league-header">
                        <img src="../assets/images/leagues/${league.toLowerCase().replace(' ', '-')}.png" alt="${league}" class="league-logo">
                        <h3>${league}</h3>
                    </div>
                    <div class="league-matches">
            `;
            
            leagueGroups[league].forEach(match => {
                html += `
                    <a href="match-details.html?id=${match.id}" class="match-card">
                        <div class="match-time">${match.time}</div>
                        <div class="match-teams">
                            <div class="team">
                                <img src="../assets/images/teams/${match.homeTeam.logo}" alt="${match.homeTeam.name}" class="team-logo">
                                <span>${match.homeTeam.name}</span>
                            </div>
                            <span class="vs">vs</span>
                            <div class="team">
                                <img src="../assets/images/teams/${match.awayTeam.logo}" alt="${match.awayTeam.name}" class="team-logo">
                                <span>${match.awayTeam.name}</span>
                            </div>
                        </div>
                    </a>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        matchesList.innerHTML = html;
    }

    renderMatchDetails(match) {
        if (!match) return;
        
        // Update header information
        document.getElementById('league-name').textContent = match.league;
        document.getElementById('match-time').textContent = match.datetime;
        document.getElementById('match-status').textContent = match.status;
        
        // Update team information
        document.getElementById('home-name').textContent = match.homeTeam.name;
        document.getElementById('away-name').textContent = match.awayTeam.name;
        document.getElementById('home-logo').src = `../assets/images/teams/${match.homeTeam.logo}`;
        document.getElementById('away-logo').src = `../assets/images/teams/${match.awayTeam.logo}`;
        
        // Render predictions
        this.renderPredictions(match.predictions);
        
        // Render reasoning
        this.renderReasoning(match.reasoning);
    }

    renderPredictions(predictions) {
        const container = document.getElementById('prediction-cards');
        let html = '';
        
        predictions.forEach(prediction => {
            const stars = '★'.repeat(prediction.confidence) + '☆'.repeat(5 - prediction.confidence);
            
            html += `
                <div class="prediction-card">
                    <h3>${prediction.type}</h3>
                    <div class="prediction-value">${prediction.value}</div>
                    <div class="confidence">${stars}</div>
                    <div class="odds">Odds: ${prediction.odds}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    renderReasoning(reasoning) {
        const container = document.getElementById('reasoning-content');
        container.innerHTML = `
            <div class="reasoning-card">
                <p>${reasoning}</p>
            </div>
        `;
    }
}

// Create global UI controller instance
const uiController = new UIController();
