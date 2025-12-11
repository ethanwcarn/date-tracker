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
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        header.style.fontWeight = 'bold';
        header.style.textAlign = 'center';
        header.style.padding = '10px';
        header.style.background = '#f0f0f0';
        calendar.appendChild(header);
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
    
    // Days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const currentDayDate = new Date(year, month, day);
        dayElement.className = 'calendar-day';
        
        // Check if today
        if (currentDayDate.getTime() === today.getTime()) {
            dayElement.classList.add('today');
        }
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add events for this day
        const dayDates = monthDates.filter(d => {
            const date = new Date(d.date_day);
            return date.getDate() === day;
        });
        
        dayDates.forEach(date => {
            const event = document.createElement('div');
            event.className = 'date-event';
            event.textContent = date.activity_name;
            event.title = `${date.activity_name} - ${date.location}`;
            event.onclick = () => {
                window.location.href = `/dashboard?dateId=${date.id}`;
            };
            dayElement.appendChild(event);
        });
        
        calendar.appendChild(dayElement);
    }
    
    // Fill remaining cells to complete grid
    const totalCells = calendar.children.length - 7; // Subtract headers
    const remainingCells = 42 - totalCells; // 6 weeks * 7 days
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
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
                document.getElementById('name-modal').style.display = 'block';
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
            document.getElementById('name-modal').style.display = 'none';
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

