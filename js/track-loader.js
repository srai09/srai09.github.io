// Si Si Si Radio - Data-driven content loader

document.addEventListener('DOMContentLoaded', function() {
    // Load the tracks data from JSON file
    fetch('/data/tracks.json')
        .then(response => response.json())
        .then(data => {
            // Determine which page we're on
            const path = window.location.pathname;
            
            // Home page - load current week
            if (path === '/' || path.endsWith('index.html') && !path.includes('/archive/')) {
                updateCurrentWeek(data.currentWeek);
            }
            
            // Archive index page - populate list
            if (path.endsWith('/archive/index.html') || path.endsWith('/archive/')) {
                updateArchiveList(data.archive);
            }
            
            // Individual archive page - load specific content
            if (path.includes('/archive/') && !path.endsWith('index.html') && !path.endsWith('/archive/')) {
                const dateInPath = path.match(/\d{4}-\d{2}-\d{2}/);
                if (dateInPath) {
                    const archiveItem = data.archive.find(item => item.date === dateInPath[0]);
                    if (archiveItem) {
                        updateArchivePage(archiveItem);
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error loading tracks data:', error);
        });
});

// Update the homepage with current week's content
function updateCurrentWeek(weekData) {
    // Update title
    const title = document.querySelector('.featured h2');
    if (title) {
        title.textContent = weekData.title;
    }
    
    // Update date display
    const date = formatDateRange(weekData.date);
    const dateDisplay = document.querySelector('.date-display');
    if (dateDisplay) {
        dateDisplay.textContent = date;
    }
    
    // Update player embed
    const playerContainer = document.querySelector('.player-container');
    if (playerContainer) {
        playerContainer.innerHTML = weekData.embed;
    }
    
    // Update description
    const description = document.querySelector('.description p');
    if (description) {
        description.textContent = weekData.description;
    }
}

// Update the archive index page
function updateArchiveList(archiveData) {
    const archiveGrid = document.querySelector('.archive-grid');
    
    if (archiveGrid) {
        // Clear existing content
        archiveGrid.innerHTML = '';
        
        // Sort archive by date (newest first)
        const sortedArchive = [...archiveData].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        // Add each archive item
        sortedArchive.forEach(item => {
            const date = new Date(item.date);
            
            const archiveItem = document.createElement('div');
            archiveItem.className = 'archive-item';
            
            archiveItem.innerHTML = `
                <div class="archive-date">
                    <span class="month">${date.toLocaleString('en-US', { month: 'short' })}</span>
                    <span class="day">${date.getDate()}</span>
                    <span class="year">${date.getFullYear()}</span>
                </div>
                <div class="archive-info">
                    <h3>${item.title}</h3>
                    <p>${item.artist} - ${item.description.substring(0, 100)}...</p>
                    <a href="${item.date}.html" class="archive-link">Listen</a>
                </div>
            `;
            
            archiveGrid.appendChild(archiveItem);
        });
    }
}

// Update an individual archive page
function updateArchivePage(archiveItem) {
    // Update title
    document.title = `${archiveItem.title} | Si Si Si Radio Archive`;
    
    const title = document.querySelector('.archive-header h2');
    if (title) {
        title.textContent = archiveItem.title;
    }
    
    // Update date display
    const date = formatDateRange(archiveItem.date);
    const dateDisplay = document.querySelector('.date-display');
    if (dateDisplay) {
        dateDisplay.textContent = date;
    }
    
    // Update player embed
    const playerContainer = document.querySelector('.player-container');
    if (playerContainer) {
        playerContainer.innerHTML = archiveItem.embed;
    }
    
    // Update description
    const description = document.querySelector('.description p');
    if (description) {
        description.textContent = archiveItem.description;
    }
}

// Format a date as a weekly range
function formatDateRange(dateString) {
    const startDate = new Date(dateString);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const options = { month: 'long', day: 'numeric' };
    const startFormatted = startDate.toLocaleDateString('en-US', options);
    const endFormatted = endDate.toLocaleDateString('en-US', options);
    const year = endDate.getFullYear();
    
    return `${startFormatted} - ${endFormatted}, ${year}`;
}
