// Sample property data
const properties = [
    {
        id: 1,
        title: "Modern Downtown Apartment",
        price: 1800,
        address: "123 Main St, Downtown",
        type: "Apartment",
        beds: 2,
        baths: 1,
        sqft: 950,
        amenities: ["Parking", "Gym", "AC"],
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600"
    },
    {
        id: 2,
        title: "Cozy Suburban House",
        price: 2200,
        address: "456 Oak Ave, Suburbia",
        type: "House",
        beds: 3,
        baths: 2,
        sqft: 1500,
        amenities: ["Pet Friendly", "Garden", "Garage"],
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600"
    },
    {
        id: 3,
        title: "Studio Near University",
        price: 950,
        address: "789 College Blvd",
        type: "Studio",
        beds: "Studio",
        baths: 1,
        sqft: 550,
        amenities: ["Furnished", "Wi-Fi", "Laundry"],
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600"
    },
    {
        id: 4,
        title: "Luxury Villa with Pool",
        price: 4500,
        address: "101 Beachfront Rd",
        type: "Villa",
        beds: 4,
        baths: 3,
        sqft: 2800,
        amenities: ["Pool", "AC", "Parking", "Gym"],
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600"
    }
];

// Display featured properties on homepage
function displayFeaturedProperties() {
    const container = document.getElementById('featuredProperties');
    const allContainer = document.getElementById('allProperties');
    
    if (container || allContainer) {
        let html = '';
        properties.forEach(property => {
            html += `
                <div class="property-card" data-id="${property.id}">
                    <div class="property-image" style="background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${property.image}'); background-size: cover; background-position: center;">
                        <div class="property-type">${property.type}</div>
                    </div>
                    <div class="property-info">
                        <div class="property-price">$${property.price}/month</div>
                        <h3 class="property-title">${property.title}</h3>
                        <p class="property-address">${property.address}</p>
                        <div class="property-features">
                            <span>${property.beds} bed${property.beds !== 'Studio' ? 's' : ''}</span>
                            <span>${property.baths} bath${property.baths > 1 ? 's' : ''}</span>
                            <span>${property.sqft} sqft</span>
                        </div>
                        <div class="property-amenities">
                            ${property.amenities.slice(0, 3).map(amenity => `<span>${amenity}</span>`).join('')}
                        </div>
                        <a href="#" class="btn-view-details" onclick="viewPropertyDetails(${property.id})">View Details</a>
                    </div>
                </div>
            `;
        });
        
        if (container) {
            container.innerHTML = html;
            // Update results count
            document.getElementById('resultsCount').textContent = `${properties.length} properties found`;
        }
        
        if (allContainer) {
            allContainer.innerHTML = html;
            document.getElementById('results-count').textContent = `${properties.length} properties found`;
        }
    }
}

// View property details
function viewPropertyDetails(id) {
    const property = properties.find(p => p.id === id);
    if (property) {
        alert(`Property Details:\n\n${property.title}\nPrice: $${property.price}/month\nAddress: ${property.address}\nType: ${property.type}\nBedrooms: ${property.beds}\nBathrooms: ${property.baths}\nSquare Feet: ${property.sqft}\nAmenities: ${property.amenities.join(', ')}`);
        
        // In real app, this would open a detailed modal or new page
        // window.location.href = `property-details.html?id=${id}`;
    }
}

// Property form submission
function setupPropertyForm() {
    const form = document.getElementById('propertyForm');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadPreview = document.getElementById('uploadPreview');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const propertyData = {};
            formData.forEach((value, key) => {
                propertyData[key] = value;
            });
            
            // Get selected amenities
            const amenities = [];
            document.querySelectorAll('.amenities-grid input:checked').forEach(checkbox => {
                amenities.push(checkbox.nextSibling.textContent.trim());
            });
            propertyData.amenities = amenities;
            
            // In a real app, you would send this to a server
            // For now, just show success message
            alert('Property listed successfully! It will be visible to renters after review.');
            form.reset();
            uploadPreview.innerHTML = '';
            
            // Clear property data from "database"
            localStorage.setItem('lastProperty', JSON.stringify(propertyData));
            console.log('Property saved:', propertyData);
        });
    }
    
    // File upload handling
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = '#e8f4fc';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.background = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = '';
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
    
    function handleFiles(files) {
        uploadPreview.innerHTML = '';
        Array.from(files).slice(0, 6).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    uploadPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Login/Register functionality
function setupAuth() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const togglePassword = document.getElementById('togglePassword');
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tab) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Password toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = this.closest('.form-group').querySelector('input[type="password"]');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In real app, validate credentials with server
            alert('Login successful! Redirecting to dashboard...');
            // window.location.href = 'dashboard.html';
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userType = document.querySelector('input[name="userType"]:checked').value;
            
            // In real app, send registration data to server
            alert(`Account created successfully as ${userType}! Please check your email to verify.`);
            // window.location.href = userType === 'owner' ? 'add-property.html' : 'listings.html';
        });
    }
}

// Filter functionality
function setupFilters() {
    const priceSlider = document.querySelector('.price-slider');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            maxPrice.textContent = value;
            
            // In real app, this would filter properties
            console.log('Filtering by max price:', value);
        });
    }
    
    // Apply filters button
    const applyBtn = document.querySelector('.btn-apply-filters');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const selectedTypes = [];
            document.querySelectorAll('.filter-section input[type="checkbox"]:checked').forEach(cb => {
                selectedTypes.push(cb.nextSibling.textContent.trim());
            });
            
            const beds = document.querySelector('input[name="beds"]:checked')?.nextSibling.textContent.trim();
            
            alert(`Filters applied:\nProperty Types: ${selectedTypes.join(', ')}\nBedrooms: ${beds}\nMax Price: $${maxPrice.textContent}`);
            
            // In real app, this would filter and display properties
        });
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('RentalConnect initialized');
    
    // Display properties on relevant pages
    displayFeaturedProperties();
    
    // Setup forms
    setupPropertyForm();
    setupAuth();
    setupFilters();
    
    // Update copyright year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});