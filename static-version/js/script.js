document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing scripts...');
    
    // Initialize feather icons
    try {
        feather.replace();
        console.log('Feather icons initialized');
    } catch (error) {
        console.error('Error initializing feather icons:', error);
    }
    
    // Set default animation mode to basic (we now use separate theme toggle)
    if (!document.body.classList.contains('animations-basic') && !document.body.classList.contains('animations-advanced')) {
        document.body.classList.add('animations-basic');
        console.log('Initial animation mode set to basic');
    }
  // Create Batman-style smoke effects
  createSmokeEffects();
  
  // Initialize FAQ accordion
  initFaqAccordion();
  
  // Ensure logo in header doesn't disappear on hover
  const logoLink = document.querySelector('.logo-link');
  if (logoLink) {
    // Remove any transform effects that might be applied by other scripts
    logoLink.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      logoLink.style.opacity = '1';
      logoLink.style.visibility = 'visible';
    });
  }
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
      
      // Toggle between hamburger and close icon
      const iconOpen = mobileMenuBtn.querySelector('.icon-open');
      const iconClose = mobileMenuBtn.querySelector('.icon-close');
      
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
      }
    });
  }
  
  // Close mobile menu when clicking a nav link
  const mobileNavLinks = document.querySelectorAll('#mobile-menu a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      
      // Reset to hamburger icon
      const iconOpen = mobileMenuBtn.querySelector('.icon-open');
      const iconClose = mobileMenuBtn.querySelector('.icon-close');
      
      if (iconOpen && iconClose) {
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    });
  });
  
  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Copy to clipboard functionality
  const copyButtons = document.querySelectorAll('.copy-button');
  const toast = document.getElementById('copy-toast');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const textToCopy = this.getAttribute('data-copy');
      
      // Use the Clipboard API
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Show toast notification
          if (toast) {
            toast.textContent = 'Copied!';
            toast.classList.add('visible');
            
            // Hide toast after 2 seconds
            setTimeout(() => {
              toast.classList.remove('visible');
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          if (toast) {
            toast.textContent = 'Failed to copy';
            toast.classList.add('visible');
            
            setTimeout(() => {
              toast.classList.remove('visible');
            }, 2000);
          }
        });
    });
  });
  
  // Animate elements on scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const animateOnScroll = () => {
    animatedElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('fade-in');
      }
    });
  };
  
  // Run once on page load
  animateOnScroll();
  
  // Run on scroll
  window.addEventListener('scroll', animateOnScroll);
});

// Batman-style smoke effect function
function createSmokeEffects() {
  // Add smoke containers to key sections
  const heroSection = document.getElementById('hero');
  const featuresSection = document.getElementById('features');
  const testimonialsSection = document.getElementById('testimonials');
  
  // Add smoke container to hero section
  if (heroSection) {
    const smokeContainer = document.createElement('div');
    smokeContainer.className = 'smoke-container';
    heroSection.appendChild(smokeContainer);
    
    // Generate 7 smoke elements with random positions and delays
    for (let i = 0; i < 7; i++) {
      createSmokeElement(smokeContainer);
    }
    
    // Continue generating smoke at intervals
    setInterval(() => {
      createSmokeElement(smokeContainer);
    }, 8000);
  }
  
  // Add smoke effect to other sections
  [featuresSection, testimonialsSection].forEach(section => {
    if (section) {
      const smokeContainer = document.createElement('div');
      smokeContainer.className = 'smoke-container';
      section.appendChild(smokeContainer);
      
      // Generate 3-5 smoke elements for other sections
      const smokeCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < smokeCount; i++) {
        createSmokeElement(smokeContainer);
      }
      
      // Continue generating smoke at intervals
      setInterval(() => {
        if (Math.random() > 0.5) { // 50% chance to create new smoke
          createSmokeElement(smokeContainer);
        }
      }, 12000);
    }
  });
}

// Create individual smoke element with randomized properties
function createSmokeElement(container) {
  const smoke = document.createElement('div');
  smoke.className = 'smoke';
  
  // Random position within container
  const xPos = Math.random() * 100;
  const yPos = Math.random() * 50 + 50; // Start in bottom half
  
  // Random size (150px to 250px)
  const size = Math.random() * 100 + 150;
  
  // Random animation delay
  const delay = Math.random() * 5;
  
  // Apply randomized styles
  smoke.style.width = `${size}px`;
  smoke.style.height = `${size}px`;
  smoke.style.left = `${xPos}%`;
  smoke.style.bottom = `${yPos}px`;
  smoke.style.animationDelay = `${delay}s`;
  
  // Check if using light or dark theme
  if (document.body.classList.contains('light-theme')) {
    // Subtle blue tint for light theme
    const opacity = Math.random() * 0.08 + 0.03; // Between 0.03 and 0.11
    smoke.style.background = `rgba(55, 95, 124, ${opacity})`;
  } else {
    // Subtle blue tint for dark theme
    const opacity = Math.random() * 0.08 + 0.03; // Between 0.03 and 0.11
    smoke.style.background = `rgba(15, 20, 35, ${opacity})`;
  }
  
  // Add to container
  container.appendChild(smoke);
  
  // Remove after animation completes
  setTimeout(() => {
    if (container.contains(smoke)) {
      container.removeChild(smoke);
    }
  }, 15000 + (delay * 1000));
}

// Initialize FAQ accordion functionality
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      // Toggle this FAQ item
      const faqItem = this.parentElement;
      const answer = this.nextElementSibling;
      const icon = this.querySelector('.faq-icon');
      
      // Toggle active state for this item
      answer.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
      
      // Apply special styling to the active question
      if (!answer.classList.contains('hidden')) {
        // Item is now open
        faqItem.classList.add('active-faq');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        
        // Add a subtle animation/glow effect
        faqItem.classList.add('border-electric-blue/30');
        
        // Close other FAQ items
        faqQuestions.forEach(otherQuestion => {
          if (otherQuestion !== question) {
            const otherAnswer = otherQuestion.nextElementSibling;
            const otherIcon = otherQuestion.querySelector('.faq-icon');
            const otherItem = otherQuestion.parentElement;
            
            // Close other items
            otherAnswer.classList.add('hidden');
            otherIcon.classList.remove('rotate-180');
            otherItem.classList.remove('active-faq');
            otherItem.classList.remove('border-electric-blue/30');
            otherAnswer.style.maxHeight = null;
          }
        });
      } else {
        // Item is now closed
        faqItem.classList.remove('active-faq');
        faqItem.classList.remove('border-electric-blue/30');
        answer.style.maxHeight = null;
      }
    });
  });
  
  // Open the first FAQ item by default
  if (faqQuestions.length > 0) {
    // Trigger a click on the first question
    setTimeout(() => {
      faqQuestions[0].click();
    }, 500);
  }
}
