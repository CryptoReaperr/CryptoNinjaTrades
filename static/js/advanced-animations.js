/**
 * Advanced animations and interactions for Crypto Ninja Trades
 * Cutting-edge 2025 effects and responsive enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize advanced effects after page load
  initHolographicElements();
  initGlitchEffect();
  initWaveAnimations();
  initParallaxElements();
  init3DCards();
  initDataVisualization();
  initInteractiveButtons();
  initResponsiveEnhancements();
});

/**
 * Holographic text effect for key headings
 */
function initHolographicElements() {
  const holoElements = document.querySelectorAll('.holographic-text');
  
  holoElements.forEach(element => {
    // Set the data-text attribute for before pseudo-element
    const text = element.textContent;
    element.setAttribute('data-text', text);
    
    // Add mouse movement effect for holographic elements
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;
      
      // Calculate position percentages
      const xPercent = Math.floor((x / rect.width) * 100);
      const yPercent = Math.floor((y / rect.height) * 100);
      
      // Apply light reflection effect
      element.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
      element.style.filter = `hue-rotate(${xPercent}deg) drop-shadow(0 0 ${Math.max(2, xPercent/10)}px rgba(55, 95, 124, 0.${Math.min(9, Math.floor(xPercent/10))}))`;  
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.filter = '';
      element.style.backgroundPosition = '';
    });
  });
}

/**
 * Glitch text effect for section titles
 */
function initGlitchEffect() {
  const glitchElements = document.querySelectorAll('.glitch-text');
  
  glitchElements.forEach(element => {
    // Set the data-text attribute for before/after pseudo-elements
    const text = element.textContent;
    element.setAttribute('data-text', text);
    
    // Add random glitch trigger on hover
    element.addEventListener('mouseenter', () => {
      element.classList.add('active-glitch');
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove('active-glitch');
    });
  });
}

/**
 * Wave animations for section dividers
 */
function initWaveAnimations() {
  const waveDividers = document.querySelectorAll('.wave-divider');
  
  waveDividers.forEach((divider, index) => {
    // Create SVG waves dynamically
    const wave1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const wave2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    wave1.setAttribute('viewBox', '0 0 1200 120');
    wave1.setAttribute('preserveAspectRatio', 'none');
    wave1.classList.add('wave1');
    wave1.innerHTML = `<path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgba(55, 95, 124, 0.2)"></path>`;
    
    wave2.setAttribute('viewBox', '0 0 1200 120');
    wave2.setAttribute('preserveAspectRatio', 'none');
    wave2.classList.add('wave2');
    wave2.innerHTML = `<path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="rgba(47, 65, 79, 0.15)"></path>`;
    
    divider.appendChild(wave1);
    divider.appendChild(wave2);
  });
}

/**
 * Parallax scrolling effect for background elements
 */
function initParallaxElements() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed') || 0.1;
      const offset = scrollY * speed;
      
      element.style.transform = `translateY(${offset}px)`;
    });
  });
}

/**
 * 3D Card hover effects
 */
function init3DCards() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    // Only apply 3D effects on devices with hover capability
    if (window.matchMedia('(hover: hover)').matches) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        
        // Calculate rotation angles based on cursor position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 10; // max 10 degrees
        const rotateX = ((centerY - y) / centerY) * 5; // max 5 degrees
        
        // Apply transformations
        card.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateZ(20px)
        `;
        
        // Add shine effect based on cursor position
        const shine = card.querySelector('.shine-effect');
        if (shine) {
          // Calculate shine position
          const xPercent = Math.floor((x / rect.width) * 300 - 150);
          const yPercent = Math.floor((y / rect.height) * 300 - 150);
          shine.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)`;
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        
        const shine = card.querySelector('.shine-effect');
        if (shine) {
          shine.style.background = 'transparent';
        }
      });
    }
  });
}

/**
 * Data visualization highlight effects
 */
function initDataVisualization() {
  const dataElements = document.querySelectorAll('.data-glow');
  
  dataElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      // Add pulse animation
      element.classList.add('data-pulse');
    });
    
    element.addEventListener('mouseleave', () => {
      // Remove pulse animation
      element.classList.remove('data-pulse');
    });
  });
}

/**
 * Enhanced interactive buttons with sound and haptics
 */
function initInteractiveButtons() {
  const interactiveButtons = document.querySelectorAll('.btn-cyberpunk, .neon-button');
  
  interactiveButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      // Add subtle scale effect
      button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      // Reset scale
      button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', () => {
      // Add click effects
      button.classList.add('btn-clicked');
      
      // Remove effect after animation completes
      setTimeout(() => {
        button.classList.remove('btn-clicked');
      }, 300);
      
      // Try to trigger haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
}

/**
 * Responsive design enhancements based on device capabilities
 */
function initResponsiveEnhancements() {
  // Detect device capabilities
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  const isTablet = window.matchMedia('(min-width: 641px) and (max-width: 1023px)').matches;
  const isHighEnd = !isMobile && !isTablet && window.devicePixelRatio > 1;
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
  
  // Apply special optimizations for mobile
  if (isMobile) {
    // Add mobile-specific classes
    document.querySelectorAll('.enhance-mobile').forEach(element => {
      element.classList.add('mobile-enhance');
    });
    
    // Simplify or disable intensive animations
    document.querySelectorAll('.simplify-mobile').forEach(element => {
      element.classList.add('simplified');
    });
  }
  
  // Optimize for tablets
  if (isTablet) {
    document.querySelectorAll('.grid-optimize-tablet').forEach(element => {
      element.classList.add('grid-cols-2-tablet');
    });
  }
  
  // Enable high-end features on capable devices
  if (isHighEnd && !hasReducedMotion) {
    document.body.classList.add('high-end-device');
    
    // Initialize more intensive visual effects
    initAdvancedParallax();
    enableBlurEffects();
  }
  
  // Respect reduced motion preferences
  if (hasReducedMotion) {
    document.body.classList.add('reduced-motion');
  }
  
  // Add dynamic card shine effect
  document.querySelectorAll('.card-3d').forEach(card => {
    const shine = document.createElement('div');
    shine.classList.add('shine-effect');
    card.appendChild(shine);
  });
  
  // Add section highlight to important content
  document.querySelectorAll('.highlight-section').forEach(section => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('section-highlight');
    
    // Move the section content inside the highlight wrapper
    section.parentNode.insertBefore(wrapper, section);
    const inner = document.createElement('div');
    inner.classList.add('section-highlight-inner');
    wrapper.appendChild(inner);
    inner.appendChild(section);
  });
}

/**
 * Advanced parallax for high-end devices only
 */
function initAdvancedParallax() {
  // Create floating elements in the background
  const floatingContainer = document.createElement('div');
  floatingContainer.classList.add('floating-elements');
  document.body.appendChild(floatingContainer);
  
  // Create floating shapes
  const shapes = [];
  for (let i = 0; i < 8; i++) {
    const shape = document.createElement('div');
    shape.classList.add('floating-shape');
    
    // Randomize position, size, and animation
    const size = Math.floor(Math.random() * 80) + 40;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${Math.random() * 90 + 5}%`;
    shape.style.top = `${Math.random() * 80 + 10}%`;
    shape.style.animationDelay = `${delay}s`;
    shape.style.animationDuration = `${duration}s`;
    
    floatingContainer.appendChild(shape);
    shapes.push(shape);
  }
}

/**
 * Enable blur effects for capable devices
 */
function enableBlurEffects() {
  document.querySelectorAll('.enable-blur').forEach(element => {
    element.classList.add('blur-enabled');
  });
}