// Toggle between login and register
document.getElementById('show-register')?.addEventListener('click', () => {
    document.getElementById('login-card').style.display = 'none';
    document.getElementById('register-card').style.display = 'block';
});

document.getElementById('show-login')?.addEventListener('click', () => {
    document.getElementById('register-card').style.display = 'none';
    document.getElementById('login-card').style.display = 'block';
});

// Login form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) errorDiv.style.display = 'none';
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            if (errorDiv) {
                errorDiv.textContent = data.error || 'Login failed';
                errorDiv.style.display = 'block';
            }
        }
    } catch (error) {
        if (errorDiv) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'block';
        }
    }
});

// Register form
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById('register-error');
    if (errorDiv) errorDiv.style.display = 'none';
    
    const firstName = document.getElementById('register-first-name').value.trim();
    const lastName = document.getElementById('register-last-name').value.trim();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    if (!firstName || !lastName) {
        if (errorDiv) {
            errorDiv.textContent = 'First name and last name are required';
            errorDiv.style.display = 'block';
        }
        return;
    }
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            if (errorDiv) {
                errorDiv.textContent = data.error || 'Registration failed';
                errorDiv.style.display = 'block';
            }
        }
    } catch (error) {
        if (errorDiv) {
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'block';
        }
    }
});
