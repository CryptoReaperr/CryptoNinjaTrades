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
  
  // Add fixed header class when scrolling down
  window.addEventListener('scroll', function() {
    // Apply fixed header when scrolled beyond a certain point
    if (window.scrollY > 100) {
      header.classList.add('fixed-header');
    } else {
      header.classList.remove('fixed-header');
    }
    
    // Clear existing timer
    if (scrollTimer) clearTimeout(scrollTimer);
    
    // Handle scroll direction
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY ? 'down' : 'up';
    const delta = Math.abs(currentScrollY - lastScrollY);
    
    // Only respond to significant scroll changes
    if (delta > 5) {
      // At top of page, always fully show header
      if (currentScrollY < 10) {
        animateHeader(header, 0, 'cubic-bezier(0.215, 0.61, 0.355, 1)');
        console.log('At top: fully showing header');
      } else if (direction === 'up') {
        // Always show header when scrolling up
        animateHeader(header, 0, 'cubic-bezier(0.215, 0.61, 0.355, 1)', 0.3);
        console.log('Scrolling up: showing header');
      }
      
      lastScrollY = currentScrollY;
    }
    
    // Reset after scrolling stops - always keep header visible
    scrollTimer = setTimeout(function() {
      // If near top, show header completely without fixed position
      if (window.scrollY < 10) {
        animateHeader(header, 0, 'ease-out');
      } else {
        // Always keep header visible when scrolled down
        animateHeader(header, 0, 'ease-out');
      }
    }, 150);
  }, { passive: true });
  
  function handleWheelScroll(event, header) {
    // Determine direct response to wheel movement
    const deltaY = event.deltaY;
    const headerHeight = header.offsetHeight;
    const currentTransform = getTranslateY(header);
    
    // Check if we're at the top of the page with the header fully visible
    const atPageTop = window.scrollY < 10;
    
    // Apply immediate visual feedback based on wheel direction
    if (deltaY > 0) {
      if (atPageTop && currentTransform < 0) {
        // At top but header is showing the "rewind" effect - continue the animation
        const newTransform = Math.min(currentTransform + (Math.abs(deltaY) * 0.1), 0);
        animateHeader(header, newTransform, 'linear');
        console.log(`Rewind animation (scrolling down): ${newTransform}`);
      } else if (window.scrollY > 50) {
        // Keep header visible even when scrolling down
        animateHeader(header, 0, 'linear');
        console.log('Keeping header visible while scrolling down');
      }
    } else if (deltaY < 0) {
      if (atPageTop) {
        // At top of page and scrolling up - show "overscroll" effect
        // Push the header down (negative translateY value moves up, positive moves down)
        const overscrollAmount = Math.min(Math.abs(deltaY) * 0.05, 20);  // Limit max push to 20px
        animateHeader(header, overscrollAmount, 'ease-out');
        console.log(`Overscroll effect: ${overscrollAmount}px`);
        
        // Bounce back after a short delay
        setTimeout(() => {
          animateHeader(header, 0, 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', 0.5); // Bounce effect
        }, 100);
      } else {
        // Normal scrolling up behavior - always show header
        animateHeader(header, 0, 'linear');
        console.log('Showing header when scrolling up');
      }
    }
    
    // If we're at the top of the page but the header isn't at default position, reset it
    if (atPageTop && !event.deltaY && currentTransform !== 0) {
      animateHeader(header, 0, 'ease-out', 0.3);
    }
    
    // Apply fixed position styles when scrolled down
    if (window.scrollY > 100) {
      header.classList.add('fixed-header');
    } else {
      header.classList.remove('fixed-header');
    }
  }
  
  function animateHeader(header, transformValue, easing = 'ease', duration = 0.2) {
    // Apply animation with custom easing and duration
    header.style.transition = `transform ${duration}s ${easing}`;
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