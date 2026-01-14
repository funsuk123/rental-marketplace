// Simple Authentication System
const users = [
    {
        id: 1,
        firstName: "John",
        email: "renter@example.com",
        password: "password123",
        userType: "renter"
    },
    {
        id: 2,
        firstName: "Sarah",
        email: "owner@example.com",
        password: "password123",
        userType: "owner"
    }
];

function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('Invalid email or password');
        return false;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert(`Welcome back, ${user.firstName}!`);
    
    if (user.userType === 'owner') {
        window.location.href = 'owner-dashboard.html';
    } else {
        window.location.href = 'renter-dashboard.html';
    }
    
    return true;
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    alert('Logged out successfully');
    window.location.href = 'index.html';
}

// Setup login form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            loginUser(email, password);
        });
    }
});
