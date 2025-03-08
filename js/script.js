// Si Si Si Radio - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Only update the date on the homepage, not on archive pages
    const isHomePage = window.location.pathname === '/' || 
                       window.location.pathname.endsWith('index.html') && 
                       !window.location.pathname.includes('/archive/');
    
    if (isHomePage) {
        updateCurrentDateRange();
    }
    
    // Function to update the date range for the current week's selection
    function updateCurrentDateRange() {
        // Get the current date
        const now = new Date();
        
        // Format date range for "This Week's Selection"
        const startOfWeek = new Date(now);
        // Adjust to Wednesday (3) as the start of radio week
        const day = now.getDay();
        const diff = (day >= 3) ? day - 3 : (day + 7) - 3;
        startOfWeek.setDate(now.getDate() - diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        // Format dates
        const options = { month: 'long', day: 'numeric' };
        const startFormatted = startOfWeek.toLocaleDateString('en-US', options);
        const endFormatted = endOfWeek.toLocaleDateString('en-US', options);
        const yearFormatted = endOfWeek.getFullYear();
        
        // Update the date display only on the homepage
        const dateDisplay = document.querySelector('.date-display');
        if (dateDisplay) {
            dateDisplay.textContent = `${startFormatted} - ${endFormatted}, ${yearFormatted}`;
        }
    }
});