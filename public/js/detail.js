// LoftVision - Detail Page JavaScript
// Vanilla JavaScript - No frameworks!

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏠 LoftVision Detail Page Loaded');
    loadDesignDetail();
});

// Get the slug from the URL
function getSlugFromURL() {
    const path = window.location.pathname;
    // Extract slug from /designs/slug-name
    const parts = path.split('/');
    return parts[parts.length - 1];
}

// Load design details
async function loadDesignDetail() {
    const slug = getSlugFromURL();
    console.log('📍 Loading design with slug:', slug);
    
    try {
        const response = await fetch(`/api/designs/${slug}`);
        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📊 API Result:', result);
        
        if (result.success && result.data) {
            displayDesign(result.data);
        } else {
            showError();
        }
    } catch (error) {
        console.error('❌ Error loading design:', error);
        showError();
    }
}

// Display the design details
function displayDesign(design) {
    console.log('✅ Displaying design:', design.title);
    
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('design-content').style.display = 'block';
    
    // Update page title
    document.title = `${design.title} | LoftVision`;
    
    // Breadcrumb
    document.getElementById('breadcrumb-title').textContent = design.title;
    
    // Hero image
    const img = document.getElementById('design-image');
    img.src = design.image_url;
    img.alt = design.title;
    
    // Header info
    document.getElementById('design-title').textContent = design.title;
    document.getElementById('design-style-location').textContent = 
        `${design.style} Style • ${design.location}`;
    
    // Price
    const price = design.price ? 
        `$${parseFloat(design.price).toLocaleString()}` : 
        'Price on Request';
    document.getElementById('design-price').textContent = price;
    
    // Description
    document.getElementById('design-description').textContent = design.description;
    
    // Specifications
    document.getElementById('spec-sqft').textContent = 
        `${design.square_feet.toLocaleString()} sq ft`;
    document.getElementById('spec-bedrooms').textContent = 
        `${design.bedrooms} Bedroom${design.bedrooms !== 1 ? 's' : ''}`;
    document.getElementById('spec-bathrooms').textContent = 
        `${design.bathrooms} Bathroom${design.bathrooms !== 1 ? 's' : ''}`;
    document.getElementById('spec-style').textContent = design.style;
    document.getElementById('spec-year').textContent = design.year;
    document.getElementById('spec-location').textContent = design.location;
    document.getElementById('spec-architect').textContent = 
        design.architect || 'Not specified';
    document.getElementById('spec-id').textContent = `#${design.id}`;
}

// Show error state
function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'flex';
}

// Contact about this design
function contactAboutDesign() {
    const designTitle = document.getElementById('design-title').textContent;
    alert(`📧 Inquire about: ${designTitle}\n\nContact form coming soon!\n\nFor now, email us at:\nhello@loftvision.com`);
}

// Export for inline HTML usage
window.contactAboutDesign = contactAboutDesign;