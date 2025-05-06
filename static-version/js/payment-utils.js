/**
 * Payment Utilities for Crypto Ninja Trades
 * Handles payment-related functionality like copying addresses
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize copy functionality
    initCopyFunctionality();
});

/**
 * Initialize copy functionality for wallet addresses
 */
function initCopyFunctionality() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            
            // Copy to clipboard
            copyToClipboard(textToCopy);
            
            // Visual feedback
            showCopySuccess(this);
            
            // Show toast notification
            showCopyToast();
        });
    });
    
    // Set up toast
    setupCopyToast();
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

/**
 * Show success animation on button
 * @param {HTMLElement} button - Button element
 */
function showCopySuccess(button) {
    // Add success animation class
    button.classList.add('copy-success');
    
    // Change icon to checkmark temporarily
    const icon = button.querySelector('i');
    const originalIcon = icon.getAttribute('data-feather');
    
    icon.setAttribute('data-feather', 'check');
    feather.replace();
    
    // Change button color temporarily
    const originalBgColor = button.style.backgroundColor;
    button.style.backgroundColor = '#4ADE80'; // Green success color
    
    // Reset after animation
    setTimeout(() => {
        button.classList.remove('copy-success');
        icon.setAttribute('data-feather', 'copy');
        feather.replace();
        button.style.backgroundColor = '';
    }, 1500);
}

/**
 * Set up toast notification
 */
function setupCopyToast() {
    const toast = document.getElementById('copy-toast');
    
    if (!toast) {
        // Create toast if it doesn't exist
        const newToast = document.createElement('div');
        newToast.id = 'copy-toast';
        newToast.className = 'fixed top-4 right-4 bg-neon-green text-ninja-black py-2 px-4 rounded-md shadow-lg z-50 transform translate-y-[-20px] opacity-0 transition-all duration-300';
        newToast.textContent = 'Copied to clipboard!';
        document.body.appendChild(newToast);
    }
}

/**
 * Show toast notification
 */
function showCopyToast() {
    const toast = document.getElementById('copy-toast');
    
    if (toast) {
        // Show toast
        toast.classList.add('translate-y-0', 'opacity-100');
        
        // Hide after delay
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
        }, 2000);
    }
}

/**
 * Add payment-related animations and effects
 */
function enhancePaymentElements() {
    // Add shine effect to payment cards
    const paymentCards = document.querySelectorAll('.payment-card');
    
    paymentCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Get position relative to the card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update custom properties
            card.style.setProperty('--shine-x', `${x}px`);
            card.style.setProperty('--shine-y', `${y}px`);
        });
    });
}

// Call enhance functions when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhancePaymentElements();
});