/**
 * Cookie Banner Test - Simple version that always shows the banner
 */

console.log('Loading cookie-banner-test.js script');

// Create and show the banner with a delay to allow loading screen to complete
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded in cookie-banner-test.js');
    // Wait 5 seconds before showing the banner
    console.log('Waiting 5 seconds before showing the banner...');
    setTimeout(function() {
        console.log('Timeout completed, creating banner');
        createTestBanner();
    }, 5000); // 5000ms = 5 seconds
});

function createTestBanner() {
    console.log('Creating test banner');
    // Create banner
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.id = 'cookie-banner-test';
    
    // Set explicit styles
    banner.style.position = 'fixed';
    banner.style.bottom = '-100px'; // Start off-screen for animation
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.display = 'flex';
    banner.style.justifyContent = 'space-between';
    banner.style.alignItems = 'center';
    banner.style.padding = '15px 20px';
    banner.style.backgroundColor = '#1A1A1A';
    banner.style.color = 'white';
    banner.style.borderTop = '1px solid #375F7C';
    banner.style.boxShadow = '0 -5px 15px rgba(0, 0, 0, 0.2)';
    banner.style.zIndex = '9999999';
    banner.style.fontSize = '14px';
    banner.style.transition = 'bottom 0.5s ease-in-out'; // Add transition for animation
    
    // Banner inner HTML
    banner.innerHTML = `
        <div style="flex: 1">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; color: white;">TEST BANNER - This website uses cookies</h3>
            <p style="margin: 0; font-size: 14px; color: #e0e0e0;">We use cookies to enhance your browsing experience.</p>
        </div>
        <div>
            <button id="test-cookie-close" style="background-color: #375F7C; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
        </div>
    `;
    
    console.log('Appending test banner to document body');
    document.body.appendChild(banner);
    console.log('Test banner has been appended');
    
    // Give a brief pause before starting the animation
    setTimeout(function() {
        console.log('Starting banner animation');
        banner.style.bottom = '0'; // Animate to visible position
    }, 100);
    
    // Set up event handlers
    document.getElementById('test-cookie-close').addEventListener('click', function() {
        console.log('Close button clicked');
        // Animate the banner out before removing it
        banner.style.bottom = '-100px';
        
        // Wait for animation to complete before removing from DOM
        setTimeout(function() {
            // Remove the element after animation completes
            if (banner && banner.parentNode) {
                banner.parentNode.removeChild(banner);
                console.log('Banner has been completely removed from DOM');
            } else {
                console.error('Could not remove banner, parent node not found');
            }
        }, 500); // Match the transition duration
    });
}