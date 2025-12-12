let currentDate = new Date();
let dates = [];

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
        const response = await fetch('/api/dates');
        dates = await response.json();
        renderCalendar();
    } catch (error) {
        console.error('Error loading dates:', error);
    }
}

// Render calendar
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('current-month-year').textContent = 
        `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get dates for this month
    const monthDates = dates.filter(d => {
        const date = new Date(d.date_day);
        return date.getFullYear() === year && date.getMonth() === month;
    });
    
    // Create calendar grid
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Create calendar grid with Material Dashboard styling
    calendar.style.display = 'grid';
    calendar.style.gridTemplateColumns = 'repeat(7, 1fr)';
    calendar.style.gap = '8px';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'text-center text-sm font-weight-bold text-dark mb-2 p-2 bg-gray-100 border-radius-lg';
        header.textContent = day;
        calendar.appendChild(header);
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day border border-radius-lg p-2';
        emptyDay.style.minHeight = '100px';
        emptyDay.style.opacity = '0.3';
        calendar.appendChild(emptyDay);
    }
    
    // Days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const currentDayDate = new Date(year, month, day);
        dayElement.className = 'calendar-day border border-radius-lg p-2 bg-white';
        dayElement.style.minHeight = '100px';
        dayElement.style.cursor = 'pointer';
        dayElement.style.transition = 'all 0.2s';
        
        // Check if today
        if (currentDayDate.getTime() === today.getTime()) {
            dayElement.classList.add('bg-gradient-primary');
            dayElement.style.border = '2px solid #667eea';
        }
        
        // Hover effect
        dayElement.onmouseenter = () => {
            if (!dayElement.classList.contains('bg-gradient-primary')) {
                dayElement.style.background = '#f8f9fa';
            }
        };
        dayElement.onmouseleave = () => {
            if (!dayElement.classList.contains('bg-gradient-primary')) {
                dayElement.style.background = '#fff';
            }
        };
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'text-sm font-weight-bold mb-1';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add events for this day
        const dayDates = monthDates.filter(d => {
            const date = new Date(d.date_day);
            return date.getDate() === day;
        });
        
        dayDates.forEach(date => {
            const event = document.createElement('div');
            event.className = 'text-xs bg-gradient-dark text-white border-radius-sm p-1 mb-1 cursor-pointer';
            event.textContent = date.activity_name;
            event.title = `${date.activity_name} - ${date.location}`;
            event.onclick = (e) => {
                e.stopPropagation();
                window.location.href = `/dashboard?dateId=${date.id}`;
            };
            dayElement.appendChild(event);
        });
        
        calendar.appendChild(dayElement);
    }
    
    // Fill remaining cells to complete grid (6 weeks = 42 cells total)
    const totalCells = calendar.children.length - 7; // Subtract headers
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day border border-radius-lg p-2';
        emptyDay.style.minHeight = '100px';
        emptyDay.style.opacity = '0.3';
        calendar.appendChild(emptyDay);
    }
}

// Previous month
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

// Next month
document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
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
            }
        }
    } catch (error) {
        console.error('Error checking user profile:', error);
    }
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
            const nameModalElement = document.getElementById('name-modal');
            const nameModal = bootstrap.Modal.getInstance(nameModalElement);
            if (nameModal) nameModal.hide();
            // Reload to refresh the page
            location.reload();
        } else {
            const data = await response.json();
            alert('Error updating profile: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Error updating profile: ' + error.message);
    }
});

// Initialize
checkAuth();
checkUserProfile();
loadDates();
setInterval(loadDates, 30000); // Refresh every 30 seconds

