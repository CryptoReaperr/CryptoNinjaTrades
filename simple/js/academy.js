/**
 * Academy page specific animations and interactions
 * For Crypto Ninja Trades - 2025
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS animations with custom settings for academy page
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
    delay: 100
  });
  
  // Card hover effects for course and resource cards
  const enhancedCards = document.querySelectorAll('.enhanced-card');
  if (enhancedCards.length > 0) {
    enhancedCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: '0 15px 30px rgba(10, 10, 30, 0.25), 0 0 15px rgba(55, 95, 124, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
  
  // Glitch effect for academy title
  const glitchText = document.querySelector('.glitch-text');
  if (glitchText) {
    // Initial activation
    setTimeout(() => {
      glitchText.classList.add('glitch-active');
      setTimeout(() => {
        glitchText.classList.remove('glitch-active');
      }, 500);
    }, 1000);
    
    // Repeated activation
    setInterval(() => {
      glitchText.classList.add('glitch-active');
      setTimeout(() => {
        glitchText.classList.remove('glitch-active');
      }, 500);
    }, 5000);
  }
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for fixed header
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Back to top button functionality
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        gsap.to(backToTopButton, {
          opacity: 1,
          visibility: 'visible',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(backToTopButton, {
          opacity: 0,
          visibility: 'hidden',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Highlight active section in navigation based on scroll position
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active-link');
        }
      });
    });
  }
  
  // Add CSS class for animations that need to run only on academy page
  document.body.classList.add('academy-page');
  
  // Liquid background animation adjustment for academy page
  const liquidMesh = document.getElementById('liquid-mesh');
  if (liquidMesh) {
    gsap.to(liquidMesh, {
      opacity: 0.15,
      duration: 2,
      ease: 'power2.inOut'
    });
  }
  
  // Adjust particles for academy page
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    gsap.to(particlesContainer, {
      opacity: 0.4,
      duration: 2,
      ease: 'power2.inOut'
    });
  }
});

// Add CSS for glitch effect if not already present
document.addEventListener('DOMContentLoaded', () => {
  // Check if we need to add glitch style
  if (!document.querySelector('style#academy-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'academy-styles';
    styleElement.textContent = `
      .glitch-text {
        position: relative;
        color: #fff;
      }
      
      .glitch-text::before,
      .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      
      .glitch-text.glitch-active::before {
        opacity: 0.8;
        color: #0ff;
        animation: glitch-anim-1 0.4s linear forwards;
      }
      
      .glitch-text.glitch-active::after {
        opacity: 0.8;
        color: #f0f;
        animation: glitch-anim-2 0.3s linear forwards;
      }
      
      @keyframes glitch-anim-1 {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); opacity: 0; }
      }
      
      @keyframes glitch-anim-2 {
        0% { transform: translate(0); }
        25% { transform: translate(2px, -2px); }
        50% { transform: translate(-2px, 2px); }
        75% { transform: translate(2px, 2px); }
        100% { transform: translate(0); opacity: 0; }
      }
      
      .active-link {
        color: #63B3ED !important;
        font-weight: 600;
      }
      
      .enhanced-card-active {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 15px 30px rgba(10, 10, 30, 0.25), 0 0 15px rgba(55, 95, 124, 0.2);
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(styleElement);
  }
});
