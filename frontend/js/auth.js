// Handle user registration
document.addEventListener('DOMContentLoaded', () => {
    // Show NGO fields when NGO is selected
    const userTypeSelect = document.getElementById('userType');
    const ngoFields = document.getElementById('ngoFields');
    
    if (userTypeSelect && ngoFields) {
        userTypeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'ngo') {
                ngoFields.classList.remove('hidden');
                // Make NGO fields required
                document.getElementById('ngoName').required = true;
                document.getElementById('ngoRegistration').required = true;
            } else {
                ngoFields.classList.add('hidden');
                // Remove required from NGO fields
                document.getElementById('ngoName').required = false;
                document.getElementById('ngoRegistration').required = false;
            }
        });
    }
    
    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(signupForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate passwords match
          
            try {
                const response = await fetch('https://donation-drive-system.onrender.com/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    alert(result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration');
            }
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('https://donation-drive-system.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(result.user));
                    localStorage.setItem('token', result.token);
                    
                    // Redirect based on user type
                    if (result.user.userType === 'ngo') {
                        window.location.href = 'ngo-dashboard.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {console.error('Error:', error);
                alert('An error occurred during login');
            }
        });
    }
    
    // Handle logout
    const logoutButtons = document.querySelectorAll('#logoutBtn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    });
    
    // Check if user is logged in on protected pages
    const protectedPages = ['dashboard.html', 'ngo-dashboard.html', 'make-donation.html', 'donations-list.html'];
    if (protectedPages.includes(window.location.pathname.split('/').pop())) {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        if (!user || !token) {
            window.location.href = 'login.html';
        }
    }
});
