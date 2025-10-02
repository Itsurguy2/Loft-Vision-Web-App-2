// LoftVision - Vanilla JavaScript Application
// No frontend frameworks - pure JavaScript

// Global variable to store all designs
let allDesigns = [];
let favorites = [];
let compareList = [];
let currentView = 'grid'; // 'grid' or 'list'

// Initialize favorites from storage
function initializeFavorites() {
    const stored = localStorage.getItem('loftvision_favorites');
    favorites = stored ? JSON.parse(stored) : [];
    
    // Load view preference
    const savedView = localStorage.getItem('loftvision_view');
    currentView = savedView || 'grid';
    
    console.log('❤️ Loaded favorites:', favorites.length);
    console.log('👁️ View mode:', currentView);
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
    // Calculate statistics
    calculateStats();
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
    container.className = currentView === 'grid' ? 'designs-grid' : 'designs-list';
    
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
    const design = allDesigns.find(d => d.id === id);
    
    if (index > -1) {
        favorites.splice(index, 1);
        console.log('💔 Removed from favorites:', id);
        showToast(`💔 Removed "${design.title}" from favorites`, 'info');
    } else {
        favorites.push(id);
        console.log('❤️ Added to favorites:', id);
        showToast(`❤️ Added "${design.title}" to favorites!`, 'success');
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

// ===== VIEW TOGGLE FUNCTIONALITY =====

// Set view mode (grid or list)
function setView(view) {
    currentView = view;
    localStorage.setItem('loftvision_view', view);
    
    // Update button states
    document.getElementById('grid-btn').classList.toggle('active', view === 'grid');
    document.getElementById('list-btn').classList.toggle('active', view === 'list');
    
    // Refresh display
    const container = document.getElementById('designs-container');
    container.className = view === 'grid' ? 'designs-grid' : 'designs-list';
    
    console.log('👁️ View changed to:', view);
}

// Export view function
window.setView = setView;

// ===== STATISTICS FUNCTIONALITY =====

// Calculate and display statistics
function calculateStats() {
    if (allDesigns.length === 0) {
        setTimeout(calculateStats, 500); // Wait for designs to load
        return;
    }
    
    const prices = allDesigns.map(d => parseFloat(d.price));
    const sizes = allDesigns.map(d => d.square_feet);
    const styles = [...new Set(allDesigns.map(d => d.style))];
    
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    document.getElementById('stat-total').textContent = allDesigns.length;
    document.getElementById('stat-avg-price').textContent = `${Math.round(avgPrice).toLocaleString()}`;
    document.getElementById('stat-avg-size').textContent = Math.round(avgSize).toLocaleString();
    document.getElementById('stat-styles').textContent = styles.length;
    document.getElementById('stat-min-price').textContent = `${minPrice.toLocaleString()}`;
    document.getElementById('stat-max-price').textContent = `${maxPrice.toLocaleString()}`;
}

// Toggle statistics dashboard
function toggleStats() {
    const dashboard = document.getElementById('stats-dashboard');
    const isHidden = dashboard.style.display === 'none';
    dashboard.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
        calculateStats();
        createCharts();
        dashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Create interactive charts
let styleChart, priceChart, sizeChart;

function createCharts() {
    if (allDesigns.length === 0) return;
    
    // Destroy existing charts if they exist
    if (styleChart) styleChart.destroy();
    if (priceChart) priceChart.destroy();
    if (sizeChart) sizeChart.destroy();
    
    // Chart 1: Designs by Style (Pie Chart)
    const styleData = {};
    allDesigns.forEach(d => {
        styleData[d.style] = (styleData[d.style] || 0) + 1;
    });
    
    const styleCtx = document.getElementById('styleChart').getContext('2d');
    styleChart = new Chart(styleCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(styleData),
            datasets: [{
                data: Object.values(styleData),
                backgroundColor: [
                    '#2c3e50', '#e67e22', '#3498db', '#27ae60',
                    '#9b59b6', '#e74c3c', '#f39c12'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    // Chart 2: Price Distribution (Bar Chart)
    const priceRanges = {
        'Under $700k': 0,
        '$700k-$900k': 0,
        '$900k-$1.1M': 0,
        'Over $1.1M': 0
    };
    
    allDesigns.forEach(d => {
        const price = parseFloat(d.price);
        if (price < 700000) priceRanges['Under $700k']++;
        else if (price < 900000) priceRanges['$700k-$900k']++;
        else if (price < 1100000) priceRanges['$900k-$1.1M']++;
        else priceRanges['Over $1.1M']++;
    });
    
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    priceChart = new Chart(priceCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(priceRanges),
            datasets: [{
                label: 'Number of Designs',
                data: Object.values(priceRanges),
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 11 }
                    }
                },
                x: {
                    ticks: {
                        font: { size: 10 }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Chart 3: Size Comparison (Horizontal Bar)
    const sortedBySize = [...allDesigns].sort((a, b) => b.square_feet - a.square_feet);
    
    const sizeCtx = document.getElementById('sizeChart').getContext('2d');
    sizeChart = new Chart(sizeCtx, {
        type: 'bar',
        data: {
            labels: sortedBySize.map(d => d.title.split(' ').slice(0, 2).join(' ')),
            datasets: [{
                label: 'Square Feet',
                data: sortedBySize.map(d => d.square_feet),
                backgroundColor: 'rgba(230, 126, 34, 0.7)',
                borderColor: 'rgba(230, 126, 34, 1)',
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' sq ft';
                        },
                        font: { size: 10 }
                    }
                },
                y: {
                    ticks: {
                        font: { size: 10 }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x.toLocaleString() + ' sq ft';
                        }
                    }
                }
            }
        }
    });
}

// Export stats function
window.toggleStats = toggleStats;

// ===== COMPARISON FUNCTIONALITY =====

// Toggle compare list
function toggleCompare(id, event) {
    event.stopPropagation();
    
    const index = compareList.indexOf(id);
    const design = allDesigns.find(d => d.id === id);
    
    if (index > -1) {
        compareList.splice(index, 1);
        console.log('➖ Removed from comparison:', id);
        showToast(`➖ Removed "${design.title}" from comparison`, 'info');
    } else {
        if (compareList.length >= 3) {
            showToast('⚠️ Maximum 3 designs can be compared', 'warning');
            return;
        }
        compareList.push(id);
        console.log('➕ Added to comparison:', id);
        showToast(`➕ Added "${design.title}" to comparison!`, 'success');
    }
    
    // Update compare count
    document.getElementById('compare-count').textContent = compareList.length;
    
    // Refresh display
    filterDesigns();
}

// Show comparison view
function showComparison() {
    if (compareList.length < 2) {
        alert('⚖️ Please select at least 2 designs to compare.\n\nClick the ⚖️ button on design cards to add them to comparison.');
        return;
    }
    
    const compareDesigns = allDesigns.filter(d => compareList.includes(d.id));
    
    // Create comparison modal
    const modal = document.createElement('div');
    modal.className = 'compare-modal';
    modal.innerHTML = `
        <div class="compare-modal-content">
            <button class="close-modal" onclick="closeCompareModal()">✕</button>
            <h2>⚖️ Design Comparison</h2>
            <div class="compare-table-container">
                <table class="compare-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            ${compareDesigns.map(d => `<th>${d.title}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Image</strong></td>
                            ${compareDesigns.map(d => `<td><img src="${d.image_url}" alt="${d.title}" style="width:100%; max-width:200px; border-radius:8px;"></td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Style</strong></td>
                            ${compareDesigns.map(d => `<td>${d.style}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Location</strong></td>
                            ${compareDesigns.map(d => `<td>${d.location}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Price</strong></td>
                            ${compareDesigns.map(d => `<td>${parseFloat(d.price).toLocaleString()}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Square Feet</strong></td>
                            ${compareDesigns.map(d => `<td>${d.square_feet.toLocaleString()} sq ft</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Bedrooms</strong></td>
                            ${compareDesigns.map(d => `<td>${d.bedrooms}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Bathrooms</strong></td>
                            ${compareDesigns.map(d => `<td>${d.bathrooms}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Year</strong></td>
                            ${compareDesigns.map(d => `<td>${d.year}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Architect</strong></td>
                            ${compareDesigns.map(d => `<td>${d.architect}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Price/Sq Ft</strong></td>
                            ${compareDesigns.map(d => `<td>${Math.round(parseFloat(d.price) / d.square_feet)}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
                ${compareDesigns.map(d => `
                    <a href="/designs/${d.slug}" role="button" class="secondary">View ${d.title.split(' ')[0]}</a>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close comparison modal
function closeCompareModal() {
    const modal = document.querySelector('.compare-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Export compare functions
window.toggleCompare = toggleCompare;
window.showComparison = showComparison;
window.closeCompareModal = closeCompareModal;

// ===== TOAST NOTIFICATION SYSTEM =====

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export toast function
window.showToast = showToast;