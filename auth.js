// ============================
// AUTHENTICATION SYSTEM
// ============================

// User database (in real app, this would be a backend)
const users = JSON.parse(localStorage.getItem('rentalUsers')) || [
    // Sample users for testing
    {
        id: 1,
        firstName: "John",
        lastName: "Renter",
        email: "renter@example.com",
        password: "password123", // In real app, this would be hashed
        phone: "(555) 123-4567",
        userType: "renter",
        joined: "2023-01-15",
        favorites: [1, 3],
        properties: []
    },
    {
        id: 2,
        firstName: "Sarah",
        lastName: "Owner",
        email: "owner@example.com",
        password: "password123",
        phone: "(555) 987-6543",
        userType: "owner",
        joined: "2023-02-20",
        favorites: [],
        properties: [1, 2]
    }
];

// Current user session
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ============================
// USER FUNCTIONS
// ============================

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('rentalUsers', JSON.stringify(users));
}

// Show message
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('authMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Check password strength
function checkPasswordStrength(password) {
    const bar = document.getElementById('passwordStrengthBar');
    const hint = document.getElementById('passwordHint');
    
    if (!bar) return;
    
    let strength = 0;
    let message = '';
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    bar.style.width = `${strength}%`;
    
    if (strength < 50) {
        bar.style.background = '#e74c3c';
        message = 'Weak password';
    } else if (strength < 75) {
        bar.style.background = '#f39c12';
        message = 'Moderate password';
    } else {
        bar.style.background = '#2ecc71';
        message = 'Strong password';
    }
    
    if (hint) hint.textContent = message;
}

// Check password match
function checkPasswordMatch() {
    const password = document.getElementById('registerPassword')?.value;
    const confirm = document.getElementById('confirmPassword')?.value;
    const matchText = document.getElementById('passwordMatch');
    
    if (!matchText || !password || !confirm) return;
    
    if (password === confirm && password.length > 0) {
        matchText.textContent = '✓ Passwords match';
        matchText.style.color = '#2ecc71';
    } else if (confirm.length > 0) {
        matchText.textContent = '✗ Passwords do not match';
        matchText.style.color = '#e74c3c';
    } else {
        matchText.textContent = '';
    }
}

// ============================
// REGISTRATION
// ============================

function registerUser(event) {
    event.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('Password must be at least 8 characters', 'error');
        return;
    }
    
    // Check if email exists
    if (users.find(user => user.email === email)) {
        showMessage('Email already registered. Please login.', 'error');
        switchToLogin();
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password, // In real app, hash this!
        phone,
        userType,
        joined: new Date().toISOString().split('T')[0],
        favorites: [],
        properties: userType === 'owner' ? [] : null,
        profileImage: null,
        bio: '',
        verified: false
    };
    
    // Add to users array
    users.push(newUser);
    saveUsers();
    
    // Auto login
    loginUser(email, password, true);
    
    showMessage(`Account created successfully! Welcome, ${firstName}!`);
    
    // Redirect based on user type
    setTimeout(() => {
        if (userType === 'owner') {
            window.location.href = 'owner-dashboard.html';
        } else {
            window.location.href = 'renter-dashboard.html';
        }
    }, 1500);
}

// ============================
// LOGIN
// ============================

function loginUser(email, password, fromRegistration = false) {
    email = email.toLowerCase().trim();
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        if (!fromRegistration) {
            showMessage('Invalid email or password', 'error');
        }
        return false;
    }
    
    // Set current user (remove password for security)
    const { password: _, ...userWithoutPassword } = user;
    currentUser = userWithoutPassword;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Set session
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userId', user.id);
    
    if (!fromRegistration) {
        showMessage(`Welcome back, ${user.firstName}!`);
        
        // Redirect after delay
        setTimeout(() => {
            if (user.userType === 'owner') {
                window.location.href = 'owner-dashboard.html';
            } else {
                window.location.href = 'renter-dashboard.html';
            }
        }, 1000);
    }
    
    return true;
}

// ============================
// LOGOUT
// ============================

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userId');
    
    showMessage('You have been logged out successfully');
    
    // Redirect to home after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ============================
// CHECK LOGIN STATUS
// ============================

function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn && user) {
        currentUser = user;
        updateNavForLoggedInUser();
        return true;
    }
    
    return false;
}

// Update navigation for logged in users
function updateNavForLoggedInUser() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn && currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.firstName}`;
        loginBtn.href = currentUser.userType === 'owner' ? 'owner-dashboard.html' : 'renter-dashboard.html';
        
        // Add logout option
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.querySelector('.logout-btn')) {
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                logoutUser();
            };
            navLinks.appendChild(logoutBtn);
        }
    }
}

// ============================
// PASSWORD RESET
// ============================

function sendResetEmail() {
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        showMessage('Please enter your email', 'error');
        return;
    }
    
    // In real app, send email to backend
    // For demo, just show message
    showMessage(`Reset instructions sent to ${email}. Check your inbox.`);
    closeModal();
}

// ============================
// HELPER FUNCTIONS
// ============================

function switchToLogin() {
    const loginTab = document.querySelector('[data-tab="login"]');
    if (loginTab) loginTab.click();
}

function switchToRegister() {
    const registerTab = document.querySelector('[data-tab="register"]');
    if (registerTab) registerTab.click();
}

function showTerms() {
    alert('Terms of Service:\n\n1. Users must provide accurate information\n2. Respect privacy of other users\n3. Property owners are responsible for their listings\n4. RentalConnect is a platform, not a real estate broker\n5. Users must comply with local laws and regulations');
}

function showPrivacy() {
    alert('Privacy Policy:\n\nWe respect your privacy. We only collect necessary information to provide our services. We never sell your data to third parties.');
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// ============================
// SOCIAL LOGIN (Demo)
// ============================

function loginWithGoogle() {
    showMessage('Google login would connect here. For demo, use test account: renter@example.com / password123', 'success');
}

function loginWithFacebook() {
    showMessage('Facebook login would connect here. For demo, use test account: owner@example.com / password123', 'success');
}

// ============================
// INITIALIZE
// ============================

document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
    
    // Setup password toggle
    setupPasswordToggles();
    
    // Setup form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            loginUser(email, password);
        });
    }
    
    if (registerForm) {
        // Real-time password matching
        const confirmField = document.getElementById('confirmPassword');
        if (confirmField) {
            confirmField.addEventListener('input', checkPasswordMatch);
        }
        
        registerForm.addEventListener('submit', registerUser);
    }
    
    // Forgot password
    const forgotLink = document.getElementById('forgotPassword');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            showModal('forgotPasswordModal');
        });
    }
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Update copyright year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Setup password toggle visibility
function setupPasswordToggles() {
    // Toggle for login password
    const toggleLogin = document.getElementById('toggleLoginPassword');
    if (toggleLogin) {
        toggleLogin.addEventListener('click', function() {
            const input = document.getElementById('loginPassword');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
    
    // Toggle for register password
    const toggleRegister = document.getElementById('toggleRegisterPassword');
    if (toggleRegister) {
        toggleRegister.addEventListener('click', function() {
            const input = document.getElementById('registerPassword');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
    
    // Toggle for confirm password
    const toggleConfirm = document.getElementById('toggleConfirmPassword');
    if (toggleConfirm) {
        toggleConfirm.addEventListener('click', function() {
            const input = document.getElementById('confirmPassword');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
}