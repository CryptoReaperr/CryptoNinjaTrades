/**
 * Loading screen and preloader for the Crypto Ninja Trades website
 */

// Split text helper function
function splitTextForLoading(element) {
  const text = element.textContent;
  element.textContent = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = document.createElement('span');
    char.className = 'char';
    char.textContent = text[i];
    element.appendChild(char);
  }
  return element;
}

// Create and append the loading screen to the document
function createLoadingScreen() {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.classList.add('page-loader');
  
  // Loader content with ninja theme
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-icon">
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ninja-star-loader">
          <path d="M40 10L50 30L70 40L50 50L40 70L30 50L10 40L30 30L40 10Z" fill="#375F7C" />
          <circle cx="40" cy="40" r="5" fill="#0A0A0A" />
        </svg>
      </div>
      <h2 class="loader-text split-text">CRYPTO NINJA</h2>
      <p class="loader-subtitle">Trading intelligence at work...</p>
    </div>
  `;
  
  // Append to body at the beginning
  document.body.insertBefore(loader, document.body.firstChild);
  
  // Split text after inserting into DOM
  const loaderText = loader.querySelector('.loader-text');
  if (loaderText) {
    splitTextForLoading(loaderText);
  }
  
  // Animate the elements
  animateLoader();
}

// Animate the loader elements
function animateLoader() {
  // Apply initial state to chars
  const chars = document.querySelectorAll('.loader-text .char');
  chars.forEach(char => {
    char.style.opacity = '0';
    char.style.transform = 'translateY(20px)';
  });
  
  // Initial animation for the loader icon
  const loaderIcon = document.querySelector('.loader-icon');
  if (loaderIcon) {
    loaderIcon.style.animation = 'spin 1.5s infinite ease-in-out';
  }
}

// Function to hide loader after assets are loaded
function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    // GSAP will handle the fade out in the animations.js file
    // This is just a fallback if GSAP isn't loaded yet
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
    }, 2000);
  }
}

// Initialize loading screen
document.addEventListener('DOMContentLoaded', () => {
  // Create the loading screen
  createLoadingScreen();
  
  // Hide loader when everything is loaded
  window.addEventListener('load', () => {
    // Small delay for dramatic effect
    setTimeout(hideLoader, 500);
  });
});
