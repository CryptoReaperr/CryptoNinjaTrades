document.addEventListener('DOMContentLoaded', function() {
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
