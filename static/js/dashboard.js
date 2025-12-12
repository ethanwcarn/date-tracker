let dates = [];
let currentDateId = null;

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            window.location.href = '/';
        }
    } catch (error) {
        window.location.href = '/';
    }
}

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
});

// Load dates
async function loadDates() {
    try {
        const params = new URLSearchParams();
        const activity = document.getElementById('filter-activity').value;
        const location = document.getElementById('filter-location').value;
        const rating = document.getElementById('filter-rating').value;
        const dateDay = document.getElementById('filter-date').value;
        
        if (activity) params.append('activity_name', activity);
        if (location) params.append('location', location);
        if (rating) params.append('rating', rating);
        if (dateDay) params.append('date_day', dateDay);
        
        const response = await fetch(`/api/dates?${params.toString()}`);
        dates = await response.json();
        
        displayDates();
        updateCount();
    } catch (error) {
        console.error('Error loading dates:', error);
    }
}

// Update count
async function updateCount() {
    try {
        const response = await fetch('/api/dates/count');
        const data = await response.json();
        document.getElementById('total-count').textContent = data.count;
    } catch (error) {
        console.error('Error loading count:', error);
    }
}

// Display dates
function displayDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDates = dates.filter(d => new Date(d.date_day) >= today);
    const pastDates = dates.filter(d => new Date(d.date_day) < today);
    
    // Sort future dates ascending, past dates descending
    futureDates.sort((a, b) => new Date(a.date_day) - new Date(b.date_day));
    pastDates.sort((a, b) => new Date(b.date_day) - new Date(a.date_day));
    
    document.getElementById('future-dates').innerHTML = futureDates.length > 0
        ? futureDates.map(d => createDateCard(d)).join('')
        : '<div class="list-group-item border-0 p-3 text-center text-secondary">No future dates</div>';
    
    document.getElementById('past-dates').innerHTML = pastDates.length > 0
        ? pastDates.map(d => createDateCard(d)).join('')
        : '<div class="list-group-item border-0 p-3 text-center text-secondary">No past dates</div>';
}

// Create date card
function createDateCard(date) {
    const dateObj = new Date(date.date_day);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const ratingStars = date.rating ? '⭐'.repeat(date.rating) : 'No rating';
    const addedBy = date.created_by_name ? `Added by ${date.created_by_name}` : '';
    
    return `
        <a href="javascript:;" class="list-group-item list-group-item-action border-0 d-flex p-3 mb-2 bg-gray-100 border-radius-lg cursor-pointer" onclick="openDateModal(${date.id})">
            <div class="d-flex flex-column w-100">
                <div class="d-flex justify-content-between mb-1">
                    <h6 class="mb-1 text-dark">${date.activity_name}</h6>
                    <small class="text-secondary">${formattedDate}</small>
                </div>
                <p class="mb-1 text-sm text-dark">
                    <i class="material-symbols-rounded text-sm opacity-5 me-1">location_on</i>${date.location}
                    ${date.rating ? ` | <span class="text-warning">${ratingStars}</span>` : ''}
                    ${date.photos && date.photos.length > 0 ? ` | <i class="material-symbols-rounded text-sm opacity-5">photo</i> ${date.photos.length}` : ''}
                </p>
                ${addedBy ? `<small class="text-secondary text-xs">${addedBy}</small>` : ''}
            </div>
        </a>
    `;
}

// Open date modal
async function openDateModal(dateId = null) {
    currentDateId = dateId;
    const modalElement = document.getElementById('date-modal');
    const modal = new bootstrap.Modal(modalElement);
    const form = document.getElementById('date-form');
    const deleteBtn = document.getElementById('delete-date-btn');
    const photosSection = document.getElementById('photos-section');
    
    if (dateId) {
        // Edit mode
        document.getElementById('modal-title').textContent = 'Edit Date';
        deleteBtn.style.display = 'block';
        photosSection.style.display = 'block';
        
        try {
            const response = await fetch(`/api/dates/${dateId}`);
            const date = await response.json();
            
            document.getElementById('date-id').value = date.id;
            document.getElementById('activity-name').value = date.activity_name;
            document.getElementById('location').value = date.location;
            document.getElementById('date-day').value = date.date_day;
            document.getElementById('rating').value = date.rating || '';
            document.getElementById('notes').value = date.notes || '';
            
            // Display notes editing info
            const notesMeta = document.getElementById('notes-meta');
            if (date.notes && date.notes.trim() !== '') {
                if (date.notes_edited_by_name) {
                    notesMeta.textContent = `Notes edited by ${date.notes_edited_by_name}`;
                    notesMeta.style.display = 'block';
                } else {
                    notesMeta.style.display = 'none';
                }
            } else {
                notesMeta.style.display = 'none';
            }
            
            // Display photos
            displayPhotos(date.photos || []);
        } catch (error) {
            console.error('Error loading date:', error);
        }
    } else {
        // Add mode
        document.getElementById('modal-title').textContent = 'Add New Date';
        deleteBtn.style.display = 'none';
        photosSection.style.display = 'none';
        document.getElementById('notes-meta').style.display = 'none';
        form.reset();
        document.getElementById('photos-container').innerHTML = '';
    }
    
    modal.show();
}

// Modal close handled by Bootstrap

// Date form submit
document.getElementById('date-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ratingValue = document.getElementById('rating').value;
    
    const dateData = {
        activity_name: document.getElementById('activity-name').value,
        location: document.getElementById('location').value,
        date_day: document.getElementById('date-day').value,
        rating: ratingValue ? parseInt(ratingValue) : null,
        notes: document.getElementById('notes').value || ''
    };
    
    try {
        if (currentDateId) {
            // Update - always send all fields
            const response = await fetch(`/api/dates/${currentDateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Update failed');
            }
        } else {
            // Create
            const response = await fetch('/api/dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dateData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Create failed');
            }
        }
        
        const modalElement = document.getElementById('date-modal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        loadDates();
    } catch (error) {
        alert('Error saving date: ' + error.message);
    }
});

// Delete date
document.getElementById('delete-date-btn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete this date?')) return;
    
    try {
        const response = await fetch(`/api/dates/${currentDateId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            document.getElementById('date-modal').style.display = 'none';
            loadDates();
        } else {
            alert('Error deleting date');
        }
    } catch (error) {
        alert('Error deleting date: ' + error.message);
    }
});

// Upload photo
document.getElementById('upload-photo-btn').addEventListener('click', async () => {
    if (!currentDateId) {
        alert('Please save the date first before uploading photos');
        return;
    }
    
    const fileInput = document.getElementById('photo-upload');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('Please select a photo');
        return;
    }
    
    for (let file of files) {
        const formData = new FormData();
        formData.append('photo', file);
        
        try {
            const response = await fetch(`/api/dates/${currentDateId}/photos`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const photo = await response.json();
                // Reload date to get updated photos
                const dateResponse = await fetch(`/api/dates/${currentDateId}`);
                const date = await dateResponse.json();
                displayPhotos(date.photos || []);
                fileInput.value = '';
            } else {
                alert('Error uploading photo');
            }
        } catch (error) {
            alert('Error uploading photo: ' + error.message);
        }
    }
});

// Display photos
function displayPhotos(photos) {
    const container = document.getElementById('photos-container');
    container.innerHTML = photos.map(photo => `
        <div class="col-md-4 mb-3">
            <img src="/${photo.filepath}" alt="${photo.filename}" class="img-fluid border-radius-lg">
        </div>
    `).join('');
}

// Filters
document.getElementById('filter-activity').addEventListener('input', loadDates);
document.getElementById('filter-location').addEventListener('input', loadDates);
document.getElementById('filter-rating').addEventListener('change', loadDates);
document.getElementById('filter-date').addEventListener('change', loadDates);

// Clear filters
document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('filter-activity').value = '';
    document.getElementById('filter-location').value = '';
    document.getElementById('filter-rating').value = '';
    document.getElementById('filter-date').value = '';
    loadDates();
});

// Add date button
document.getElementById('add-date-btn')?.addEventListener('click', () => {
    openDateModal(null);
});

// Search functionality
document.getElementById('search-input')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allDateCards = document.querySelectorAll('.list-group-item');
    allDateCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

// Check and prompt for name if missing
async function checkUserProfile() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            if (!user.has_name) {
                // Show name prompt modal
                const nameModalElement = document.getElementById('name-modal');
                const nameModal = new bootstrap.Modal(nameModalElement);
                nameModal.show();
            } else {
                // Update welcome message with user's name
                updateWelcomeMessage(user);
            }
        }
    } catch (error) {
        console.error('Error checking user profile:', error);
    }
}

// Update welcome message with user's name and compliment
function updateWelcomeMessage(user) {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Guest';
    
    document.getElementById('user-name').textContent = fullName;
    
    // Array of flirty compliments
    const compliments = [
        "Ready to create some beautiful memories together? ✨",
        "You look absolutely stunning today! Let's plan something special. 💕",
        "Every moment with you is a treasure. What adventure awaits? 🌟",
        "You make my heart skip a beat. Ready for our next date? 💖",
        "Life is better with you. Let's make today unforgettable! 💫",
        "You're the best part of my day. What should we do next? 😊",
        "Together we make magic happen. Ready to plan something amazing? ✨"
    ];
    
    // Pick a random compliment
    const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    document.getElementById('welcome-message').textContent = randomCompliment;
}

// Name form submit
document.getElementById('name-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('profile-first-name').value.trim();
    const lastName = document.getElementById('profile-last-name').value.trim();
    
    if (!firstName || !lastName) {
        alert('Please enter both first and last name');
        return;
    }
    
    try {
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName })
        });
        
        if (response.ok) {
            const data = await response.json();
            const nameModalElement = document.getElementById('name-modal');
            const nameModal = bootstrap.Modal.getInstance(nameModalElement);
            if (nameModal) nameModal.hide();
            // Update welcome message with new name
            updateWelcomeMessage({
                first_name: data.first_name,
                last_name: data.last_name,
                has_name: true
            });
        } else {
            const data = await response.json();
            alert('Error updating profile: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Error updating profile: ' + error.message);
    }
});

// Initialize - load user profile first to show welcome message
async function initializeDashboard() {
    await checkAuth();
    await checkUserProfile();
    loadDates();
    setInterval(loadDates, 30000); // Refresh every 30 seconds
}

initializeDashboard();

// Check for dateId in URL (from calendar click)
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateId = urlParams.get('dateId');
    if (dateId) {
        setTimeout(() => openDateModal(parseInt(dateId)), 500);
        // Clean URL
        window.history.replaceState({}, document.title, '/dashboard');
    }
});

