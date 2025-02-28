// Handle navigation between pages
class NavigationHandler {
    constructor() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Handle back button
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateBack();
            });
        }
        
        // Handle match card clicks
        document.addEventListener('click', (e) => {
            const matchCard = e.target.closest('.match-card');
            if (matchCard) {
                e.preventDefault();
                this.navigateToMatch(matchCard.getAttribute('href'));
            }
        });
    }
    
    navigateToMatch(url) {
        // Add page transition animation
        document.body.classList.add('page-exit-active');
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
    
    navigateBack() {
        document.body.classList.add('page-exit-active');
        
        setTimeout(() => {
            window.history.back();
        }, 300);
    }
    
    // Method to handle filter tab navigation
    handleFilterChange(filter) {
        // Update URL without page reload
        const url = new URL(window.location.href);
        url.searchParams.set('filter', filter);
        window.history.pushState({filter}, '', url);
        
        // Load filtered matches
        uiController.loadFilteredMatches(filter);
    }
}

// Create global navigation handler instance
const navigationHandler = new NavigationHandler();

// Handle page load animations
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-enter');
    
    setTimeout(() => {
        document.body.classList.add('page-enter-active');
        document.body.classList.remove('page-enter');
    }, 10);
});
