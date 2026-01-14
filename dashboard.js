// ============================
// DASHBOARD FUNCTIONS
// ============================

// Load user data for dashboard
function loadDashboardData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Not logged in, redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    // Update user name
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = currentUser.firstName;
    }
    
    // Load different data based on user type
    if (currentUser.userType === 'renter') {
        loadRenterDashboard(currentUser);
    } else if (currentUser.userType === 'owner') {
        loadOwnerDashboard(currentUser);
    }
}

// ============================
// RENTER DASHBOARD
// ============================

function loadRenterDashboard(user) {
    // Load saved properties
    loadSavedProperties(user);
    
    // Update counts
    updateRenterCounts(user);
    
    // Load recent activity
    loadRecentActivity(user);
}

function loadSavedProperties(user) {
    const container = document.getElementById('savedPropertiesContainer');
    if (!container) return;
    
    const savedIds = user.favorites || [];
    const allProperties = JSON.parse(localStorage.getItem('properties')) || [];
    const savedProperties = allProperties.filter(p => savedIds.includes(p.id));
    
    if (savedProperties.length === 0) {
        // Show empty state (already in HTML)
        return;
    }
    
    // Display saved properties
    let html = '';
    savedProperties.forEach(property => {
        html += `
            <div class="property-card">
                <div class="property-image" style="background: url('${property.image}'); background-size: cover;">
                    <div class="property-type">${property.type}</div>
                    <button class="remove-favorite" onclick="removeFromFavorites(${property.id})" title="Remove from saved">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="property-info">
                    <div class="property-price">$${property.price}/month</div>
                    <h3>${property.title}</h3>
                    <p>${property.address}</p>
                    <div class="property-features">
                        <span>${property.beds} bed</span>
                        <span>${property.baths} bath</span>
                        <span>${property.sqft} sqft</span>
                    </div>
                    <div class="property-actions">
                        <button class="btn-contact" onclick="contactOwner(${property.id})">
                            Contact Owner
                        </button>
                        <button class="btn-view-details" onclick="viewPropertyDetails(${property.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateRenterCounts(user) {
    const favoritesCount = document.getElementById('favoritesCount');
    const viewedCount = document.getElementById('viewedCount');
    const messagesCount = document.getElementById('messagesCount');
    
    if (favoritesCount) {
        favoritesCount.textContent = user.favorites?.length || 0;
    }
    
    // Load from local storage
    const viewed = JSON.parse(localStorage.getItem('viewedProperties')) || [];
    const messages = JSON.parse(localStorage.getItem('userMessages')) || [];
    
    if (viewedCount) viewedCount.textContent = viewed.length;
    if (messagesCount) messagesCount.textContent = messages.length;
}

function loadRecentActivity(user) {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Sample activity data
    const activities = [
        { type: 'saved', property: 'Modern Downtown Apartment', time: '2 hours ago' },
        { type: 'viewed', property: 'Cozy Suburban House', time: '1 day ago' },
        { type: 'contacted', property: 'Studio Near University', time: '3 days ago' },
        { type: 'searched', query: '2 bedroom apartments', time: '1 week ago' }
    ];
    
    let html = '<div class="dashboard-card">';
    activities.forEach(activity => {
        let icon = 'fa-heart';
        if (activity.type === 'viewed') icon = 'fa-eye';
        if (activity.type === 'contacted') icon = 'fa-envelope';
        if (activity.type === 'searched') icon = 'fa-search';
        
        html += `
            <div style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <i class="fas ${icon}"></i>
                <span style="margin-left: 0.5rem;">
                    ${getActivityText(activity)}
                </span>
                <small style="float: right; color: #666;">${activity.time}</small>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function getActivityText(activity) {
    switch(activity.type) {
        case 'saved': return `Saved "${activity.property}"`;
        case 'viewed': return `Viewed "${activity.property}"`;
        case 'contacted': return `Contacted owner of "${activity.property}"`;
        case 'searched': return `Searched for "${activity.query}"`;
        default: return '';
    }
}

// ============================
// OWNER DASHBOARD
// ============================

function loadOwnerDashboard(user) {
    // Load owner's properties
    loadOwnerProperties(user);
    
    // Update stats
    updateOwnerStats(user);
    
    // Load inquiries
    loadOwnerInquiries(user);
}

function loadOwnerProperties(user) {
    const container = document.getElementById('ownerProperties');
    if (!container) return;
    
    const allProperties = JSON.parse(localStorage.getItem('properties')) || [];
    const ownerProperties = allProperties.filter(p => p.ownerId === user.id);
    
    if (ownerProperties.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-home"></i>
                <h3>No properties listed yet</h3>
                <p>Start by adding your first property</p>
                <a href="add-property.html" class="btn-view-details">Add Property</a>
            </div>
        `;
        return;
    }
    
    let html = '';
    ownerProperties.forEach(property => {
        html += `
            <div class="property-card">
                <div class="property-image" style="background: url('${property.image}'); background-size: cover;">
                    <div class="property-type">${property.type}</div>
                    <div class="property-status">${property.status || 'Active'}</div>
                </div>
                <div class="property-info">
                    <div class="property-price">$${property.price}/month</div>
                    <h3>${property.title}</h3>
                    <p>${property.address}</p>
                    <div class="property-stats">
                        <small>Views: ${property.views || 0}</small>
                        <small>Inquiries: ${property.inquiries || 0}</small>
                    </div>
                    <div class="property-actions">
                        <button class="btn-edit" onclick="editProperty(${property.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-analytics" onclick="viewPropertyAnalytics(${property.id})">
                            <i class="fas fa-chart-bar"></i> Analytics
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateOwnerStats(user) {
    const allProperties = JSON.parse(localStorage.getItem('properties')) || [];
    const ownerProperties = allProperties.filter(p => p.ownerId === user.id);
    
    const totalProperties = document.getElementById('totalProperties');
    const activeListings = document.getElementById('activeListings');
    const totalInquiries = document.getElementById('totalInquiries');
    const responseRate = document.getElementById('responseRate');
    
    if (totalProperties) totalProperties.textContent = ownerProperties.length;
    if (activeListings) activeListings.textContent = ownerProperties.length; // Simplified
    
    // Calculate inquiries
    let totalInquiriesCount = 0;
    ownerProperties.forEach(p => {
        totalInquiriesCount += p.inquiries || 0;
    });
    
    if (totalInquiries) totalInquiries.textContent = totalInquiriesCount;
    if (responseRate) responseRate.textContent = '100%'; // Simplified
}

function loadOwnerInquiries(user) {
    const container = document.getElementById('inquiriesTable');
    if (!container) return;
    
    // Sample inquiries data
    const inquiries = [
        {
            id: 1,
            property: 'Modern Downtown Apartment',
            renter: 'John Smith',
            date: '2023-10-15',
            message: 'Is the apartment still available?',
            status: 'pending'
        },
        {
            id: 2,
            property: 'Cozy Suburban House',
            renter: 'Sarah Johnson',
            date: '2023-10-14',
            message: 'Can I schedule a viewing?',
            status: 'viewed'
        }
    ];
    
    if (inquiries.length === 0) return;
    
    let html = '';
    inquiries.forEach(inquiry => {
        html += `
            <tr>
                <td>${inquiry.property}</td>
                <td>${inquiry.renter}</td>
                <td>${inquiry.date}</td>
                <td>${inquiry.message}</td>
                <td><span class="status ${inquiry.status}">${inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}</span></td>
                <td>
                    <button onclick="replyToInquiry(${inquiry.id})" class="btn-contact" style="padding: 0.3rem 0.8rem;">
                        Reply
                    </button>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// ============================
// COMMON FUNCTIONS
// ============================

function removeFromFavorites(propertyId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    user.favorites = user.favorites.filter(id => id !== propertyId);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('rentalUsers')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].favorites = user.favorites;
        localStorage.setItem('rentalUsers', JSON.stringify(users));
    }
    
    // Reload dashboard
    loadSavedProperties(user);
    updateRenterCounts(user);
    
    showMessage('Property removed from favorites');
}

function showSavedProperties() {
    const container = document.getElementById('savedPropertiesContainer');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
    }
}

function showMyProperties() {
    const container = document.getElementById('ownerProperties');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
    }
}

function showInquiries() {
    const container = document.querySelector('.recent-inquiries');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupAlerts() {
    const preferences = prompt('Enter your rental preferences (e.g., "2 bedroom, under $2000, downtown"):');
    if (preferences) {
        localStorage.setItem('rentalAlerts', preferences);
        showMessage('Alerts set! We\'ll notify you about matching properties.');
    }
}

function showSettings() {
    alert('Account settings would appear here.\n\nIn a real app, you could:\n- Change password\n- Update profile\n- Set notification preferences\n- Manage connected accounts');
}

// ============================
// INITIALIZE DASHBOARD
// ============================

document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data
    loadDashboardData();
    
    // Update copyright year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});