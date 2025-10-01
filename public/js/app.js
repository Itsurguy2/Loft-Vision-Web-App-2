// LoftVision - Vanilla JavaScript Application
// No frontend frameworks - pure JavaScript

// Global variable to store all designs
let allDesigns = [];
let favorites = [];

// Initialize favorites from storage
function initializeFavorites() {
    const stored = localStorage.getItem('loftvision_favorites');
    favorites = stored ? JSON.parse(stored) : [];
    console.log('❤️ Loaded favorites:', favorites.length);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 LoftVision App Loaded');
    initializeFavorites();
    initializeApp();
});

// Initialize the application
function initializeApp() {
    console.log('✅ App initialized');
    // Load designs from API
    loadDesigns();
}

// Smooth scroll to designs section
function scrollToDesigns() {
    const designsSection = document.getElementById('designs');
    if (designsSection) {
        designsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Contact Us action
function contactUs() {
    alert('📧 Contact form coming soon!\n\nFor now, email us at: hello@loftvision.com');
}

// Load designs from API
async function loadDesigns() {
    console.log('🔄 Fetching designs from API...');
    try {
        const response = await fetch('/api/designs');
        console.log('📡 API Response status:', response.status);
        
        const result = await response.json();
        console.log('📊 API Result:', result);
        
        if (result.success && result.data) {
            console.log(`✅ Loaded ${result.data.length} designs`);
            allDesigns = result.data; // Store for filtering
            displayDesigns(result.data);
        } else {
            console.error('❌ API returned unsuccessful response');
            displayError();
        }
    } catch (error) {
        console.error('❌ Error loading designs:', error);
        displayError();
    }
}

// Display designs in the grid
function displayDesigns(designs) {
    const container = document.getElementById('designs-container');
    container.innerHTML = ''; // Clear loading state
    
    if (!designs || designs.length === 0) {
        container.innerHTML = '<article><p>No designs available yet.</p></article>';
        return;
    }
    
    designs.forEach(design => {
        const card = createDesignCard(design);
        container.appendChild(card);
    });
}

// Create a design card element
function createDesignCard(design) {
    const article = document.createElement('article');
    article.className = 'design-card';
    article.onclick = () => viewDesignDetail(design.id, design.slug);
    
    // Format price
    const formattedPrice = design.price ? 
        `${parseFloat(design.price).toLocaleString()}` : 
        'Price on request';
    
    article.innerHTML = `
        <img src="${design.image_url}" alt="${design.title}" onerror="this.src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'">
        <div style="padding: 1rem;">
            <h3>${design.title}</h3>
            <p>${design.description.substring(0, 120)}...</p>
            <p><strong>Location:</strong> ${design.location}</p>
            <p><strong>Size:</strong> ${design.square_feet.toLocaleString()} sq ft | ${design.bedrooms} bed | ${design.bathrooms} bath</p>
            <div class="card-footer">
                <span class="design-badge">${design.style}</span>
                <small>${design.year} • ${formattedPrice}</small>
            </div>
        </div>
    `;
    
    return article;
}

// View design detail page
function viewDesignDetail(id, slug) {
    window.location.href = `/designs/${slug}`;
}

// Display error message
function displayError() {
    const container = document.getElementById('designs-container');
    container.innerHTML = `
        <article>
            <p>❌ Unable to load designs. Please try again later.</p>
        </article>
    `;
}

// Export functions for inline HTML usage
window.scrollToDesigns = scrollToDesigns;
window.contactUs = contactUs;

// ===== SEARCH AND FILTER FUNCTIONALITY =====

// Filter designs based on search and filter criteria
function filterDesigns() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const styleFilter = document.getElementById('style-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    
    let filtered = allDesigns.filter(design => {
        // Search filter
        const matchesSearch = !searchTerm || 
            design.title.toLowerCase().includes(searchTerm) ||
            design.location.toLowerCase().includes(searchTerm) ||
            design.architect.toLowerCase().includes(searchTerm) ||
            design.description.toLowerCase().includes(searchTerm);
        
        // Style filter
        const matchesStyle = !styleFilter || design.style === styleFilter;
        
        // Price filter
        const matchesPrice = !priceFilter || parseFloat(design.price) <= parseFloat(priceFilter);
        
        // Size filter
        const matchesSize = !sizeFilter || design.square_feet >= parseInt(sizeFilter);
        
        return matchesSearch && matchesStyle && matchesPrice && matchesSize;
    });
    
    // Update results count
    const resultsDiv = document.getElementById('filter-results');
    resultsDiv.textContent = `Showing ${filtered.length} of ${allDesigns.length} designs`;
    
    // Display filtered designs
    displayDesigns(filtered);
}

// Reset all filters
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('style-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('size-filter').value = '';
    document.getElementById('sort-select').value = 'newest';
    document.getElementById('filter-results').textContent = '';
    displayDesigns(allDesigns);
}

// Sort designs
function sortDesigns() {
    const sortBy = document.getElementById('sort-select').value;
    const container = document.getElementById('designs-container');
    const currentCards = Array.from(container.children);
    
    // Get current designs being displayed
    let designs = [...allDesigns];
    
    // Apply current filters first
    filterDesigns();
    
    // Get filtered designs
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const styleFilter = document.getElementById('style-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    
    designs = allDesigns.filter(design => {
        const matchesSearch = !searchTerm || 
            design.title.toLowerCase().includes(searchTerm) ||
            design.location.toLowerCase().includes(searchTerm) ||
            design.architect.toLowerCase().includes(searchTerm);
        const matchesStyle = !styleFilter || design.style === styleFilter;
        const matchesPrice = !priceFilter || parseFloat(design.price) <= parseFloat(priceFilter);
        const matchesSize = !sizeFilter || design.square_feet >= parseInt(sizeFilter);
        return matchesSearch && matchesStyle && matchesPrice && matchesSize;
    });
    
    // Sort based on selection
    switch(sortBy) {
        case 'newest':
            designs.sort((a, b) => b.year - a.year);
            break;
        case 'oldest':
            designs.sort((a, b) => a.year - b.year);
            break;
        case 'price-low':
            designs.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            designs.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'size-small':
            designs.sort((a, b) => a.square_feet - b.square_feet);
            break;
        case 'size-large':
            designs.sort((a, b) => b.square_feet - a.square_feet);
            break;
        case 'name-az':
            designs.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-za':
            designs.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }
    
    displayDesigns(designs);
}

// Export filter functions
window.filterDesigns = filterDesigns;
window.resetFilters = resetFilters;

// ===== FAVORITES FUNCTIONALITY =====

// Toggle favorite status
function toggleFavorite(id, event) {
    event.stopPropagation(); // Prevent card click
    
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        console.log('💔 Removed from favorites:', id);
    } else {
        favorites.push(id);
        console.log('❤️ Added to favorites:', id);
    }
    
    // Save to localStorage
    localStorage.setItem('loftvision_favorites', JSON.stringify(favorites));
    
    // Refresh display
    filterDesigns();
}

// Show only favorites
function showFavorites() {
    if (favorites.length === 0) {
        alert('❤️ No favorites yet!\n\nClick the heart icon on any design to add it to your favorites.');
        return;
    }
    
    const favoriteDesigns = allDesigns.filter(d => favorites.includes(d.id));
    displayDesigns(favoriteDesigns);
    
    const resultsDiv = document.getElementById('filter-results');
    resultsDiv.textContent = `Showing ${favoriteDesigns.length} favorite design${favoriteDesigns.length !== 1 ? 's' : ''}`;
}

// Export favorite functions
window.toggleFavorite = toggleFavorite;
window.showFavorites = showFavorites;
window.sortDesigns = sortDesigns;