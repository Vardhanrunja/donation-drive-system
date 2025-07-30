// main.js - General JavaScript for the application

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any general functionality needed across pages
    
    // Mobile menu toggle functionality
    setupMobileMenu();
    
    // Active link highlighting
    highlightActiveLink();
    
    // Any other general initialization
});

// Setup mobile menu toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
}

// Highlight active link in navigation
function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        }
    });
}

// Display toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format time for display
function formatTime(timeString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timeString).toLocaleTimeString(undefined, options);
}

// Debounce function for limiting how often a function can fire
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for limiting how often a function can fire
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        // Redirect to login if not authenticated
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('signup.html') &&
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

// Make authenticated API requests
async function makeAuthRequest(url, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Add this to your CSS:
/*
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    background-color: #333;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
}

.toast.show {
    opacity: 1;
}

.toast-success {
    background-color: #28a745;
}

.toast-error {
    background-color: #dc3545;
}

.toast-warning {
    background-color: #ffc107;
    color: #333;
}

@media (max-width: 768px) {
    nav ul {
        display: none;
    }
    
    nav ul.show {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    #mobileMenuBtn {
        display: block;
    }
}
*/