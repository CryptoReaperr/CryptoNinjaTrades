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
    console.log('Header element not found');
    return;
  }
  
  let lastScrollTop = 0;
  let scrollThreshold = 10; // Minimum amount to scroll before triggering
  let ticking = false;
  let headerHeight = header.offsetHeight;
  
  // Initially show header
  header.style.transform = 'translateY(0)';
  header.style.transition = 'transform 0.3s ease';
  
  console.log('Header scroll animations initialized');
  
  // Using scroll progress for smooth animation
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        // Get scroll progress to control header visibility
        const scrollProgress = Math.min(window.scrollY / (window.innerHeight * 0.5), 1);
        
        // When close to the top of the page, ensure header is visible
        if (window.scrollY < 50) {
          header.style.transform = 'translateY(0)';
        }
        // Otherwise, make the header transform based on scroll direction and progress
        else {
          handleHeaderScroll(header, lastScrollTop, headerHeight, scrollProgress);
        }
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // Store the scroll position for direction calculation
  window.addEventListener('scroll', function() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // Update lastScrollTop only if change is significant
    if (Math.abs(lastScrollTop - currentScrollTop) > scrollThreshold) {
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }
  }, { passive: true }); // Passive listener for better performance
  
  // Make sure the header appears when at the top of the page
  if (window.pageYOffset === 0) {
    header.style.transform = 'translateY(0)';
    header.classList.remove('header-hidden');
  }
  
  // Add smooth progress-based animation for header
  function handleHeaderScroll(header, lastScrollTop, headerHeight, scrollProgress) {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
    
    // At top of page, ensure header is fully visible
    if (currentScrollTop <= 0) {
      header.style.transform = 'translateY(0)';
      return;
    }
    
    // Calculate transform based on scroll direction and progress
    if (scrollDirection === 'down') {
      // When scrolling down, gradually hide the header
      const hideProgress = Math.min(scrollProgress * 1.5, 1); // Accelerate hiding
      const transformValue = -headerHeight * hideProgress;
      header.style.transform = `translateY(${transformValue}px)`;
    } else {
      // When scrolling up, gradually show the header
      // Get current hidden position
      const currentTransform = getTranslateY(header);
      // Move towards visible (0) by a percentage based on scroll speed
      const scrollSpeed = Math.abs(currentScrollTop - lastScrollTop);
      const showStep = Math.min(scrollSpeed / 10, headerHeight / 2); // Control reveal speed
      const newTransform = Math.min(currentTransform + showStep, 0);
      header.style.transform = `translateY(${newTransform}px)`;
    }
    
    // Update class based on visibility threshold
    if (getTranslateY(header) < -headerHeight/2) {
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
}