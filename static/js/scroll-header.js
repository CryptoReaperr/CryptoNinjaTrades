/**
 * Scroll-based header animations for Crypto Ninja Trades
 * Creates smooth transitions for header appearance/disappearance based on scroll direction
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing scroll-based header animations');
  initScrollHeader();
});

function initScrollHeader() {
  const header = document.querySelector('header');
  if (!header) {
    console.error('Header element not found');
    return;
  }
  
  // Remove any existing transition to prevent conflicts
  header.style.transition = 'none';
  header.style.transform = 'translateY(0)';
  
  // Use wheel event for direct response to mouse wheel/trackpad
  // This gives a more immediate, interactive feel
  window.addEventListener('wheel', function(event) {
    handleWheelScroll(event, header);
  }, { passive: false });
  
  // For mobile/touch devices, track scroll position changes
  let lastScrollY = window.scrollY;
  let scrollTimer = null;
  
  window.addEventListener('scroll', function() {
    // Clear existing timer
    if (scrollTimer) clearTimeout(scrollTimer);
    
    // Handle scroll direction
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY ? 'down' : 'up';
    const delta = Math.abs(currentScrollY - lastScrollY);
    
    // Only respond to significant scroll changes
    if (delta > 5) {
      if (direction === 'down' && currentScrollY > 50) {
        // Calculate how far to hide based on scroll speed
        const headerHeight = header.offsetHeight;
        const hideAmount = Math.min(delta * 0.5, headerHeight);
        animateHeader(header, -hideAmount, 'cubic-bezier(0.215, 0.61, 0.355, 1)');
        console.log(`Scrolling down: hiding ${hideAmount}px of header`);
      } else if (direction === 'up') {
        // Calculate how much to show based on scroll speed
        const showAmount = Math.min(delta * 0.5, Math.abs(getTranslateY(header)));
        animateHeader(header, getTranslateY(header) + showAmount, 'cubic-bezier(0.215, 0.61, 0.355, 1)');
        console.log(`Scrolling up: showing ${showAmount}px of header`);
      }
      
      // At top of page, always fully show header
      if (currentScrollY < 10) {
        animateHeader(header, 0, 'cubic-bezier(0.215, 0.61, 0.355, 1)');
        console.log('At top: fully showing header');
      }
      
      lastScrollY = currentScrollY;
    }
    
    // Reset after scrolling stops
    scrollTimer = setTimeout(function() {
      // If near top, show header completely
      if (window.scrollY < 10) {
        animateHeader(header, 0, 'ease-out');
      } 
      // If scrolled down and not moving, hide header completely
      else if (window.scrollY > 100) {
        animateHeader(header, -header.offsetHeight, 'ease-out');
      }
    }, 150);
  }, { passive: true });
  
  function handleWheelScroll(event, header) {
    // Determine direct response to wheel movement
    const deltaY = event.deltaY;
    const headerHeight = header.offsetHeight;
    const currentTransform = getTranslateY(header);
    
    // Apply immediate visual feedback based on wheel direction
    if (deltaY > 0 && window.scrollY > 50) {
      // Scrolling down - hide header proportionally to wheel movement
      const newTransform = Math.max(currentTransform - (deltaY * 0.1), -headerHeight);
      animateHeader(header, newTransform, 'linear');
      console.log(`Wheel down: ${deltaY}, new transform: ${newTransform}`);
    } else if (deltaY < 0) {
      // Scrolling up - show header proportionally to wheel movement
      const newTransform = Math.min(currentTransform - (deltaY * 0.1), 0);
      animateHeader(header, newTransform, 'linear');
      console.log(`Wheel up: ${deltaY}, new transform: ${newTransform}`);
    }
    
    // Always fully visible at top of page
    if (window.scrollY < 10) {
      animateHeader(header, 0, 'linear');
    }
  }
  
  function animateHeader(header, transformValue, easing = 'ease') {
    // Apply animation with custom easing
    header.style.transition = `transform 0.2s ${easing}`;
    header.style.transform = `translateY(${transformValue}px)`;
    
    // Update header visibility class
    if (transformValue < -header.offsetHeight/2) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
  }
  
  // Helper function to get current translateY value
  function getTranslateY(element) {
    const transform = window.getComputedStyle(element).getPropertyValue('transform');
    if (transform === 'none') return 0;
    
    const matrix = transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
      const values = matrix[1].split(', ');
      return parseFloat(values[5]) || 0;
    }
    return 0;
  }
  
  console.log('Enhanced header scroll animations initialized');
}