/**
 * Login page specific animations and interactions
 * For Crypto Ninja Trades - 2025
 */

// Split text helper function
function splitText(selector) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = document.createElement('span');
      char.className = 'char';
      char.textContent = text[i];
      element.appendChild(char);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Split text for GSAP animations
  splitText('.split-text');
  
  // Initialize AOS animations with custom settings for login page
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
    delay: 100
  });
  
  // Telegram login button animation
  const telegramBtn = document.getElementById('telegram-login');
  if (telegramBtn) {
    // Pulse effect on hover
    telegramBtn.addEventListener('mouseenter', () => {
      gsap.to(telegramBtn, {
        scale: 1.03,
        boxShadow: '0 0 20px rgba(0, 136, 204, 0.5)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    telegramBtn.addEventListener('mouseleave', () => {
      gsap.to(telegramBtn, {
        scale: 1,
        boxShadow: '0 0 0 rgba(0, 136, 204, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    // Simulated click effect for future integration
    telegramBtn.addEventListener('click', () => {
      gsap.timeline()
        .to(telegramBtn, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power2.inOut'
        })
        .to(telegramBtn, {
          scale: 1,
          duration: 0.2,
          ease: 'back.out(1.5)'
        });
      
      // Placeholder for Telegram login functionality
      // In a production environment, this would integrate with Telegram's OAuth API
      alert('Telegram login functionality would be implemented here. In a production environment, this would connect to the Telegram API.');
    });
  }
  
  // Form input animations
  const formInputs = document.querySelectorAll('input');
  formInputs.forEach(input => {
    // Focus animation
    input.addEventListener('focus', () => {
      gsap.to(input, {
        borderColor: 'rgba(59, 130, 246, 0.5)',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.25)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    // Blur animation
    input.addEventListener('blur', () => {
      gsap.to(input, {
        borderColor: input.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(75, 85, 99, 0.3)',
        boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
  
  // Form submission animation
  const loginForm = document.querySelector('form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Submit button animation
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      gsap.timeline()
        .to(submitBtn, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power2.inOut'
        })
        .to(submitBtn, {
          scale: 1,
          duration: 0.2,
          ease: 'back.out(1.5)'
        });
      
      // Placeholder for form submission logic
      // Simulate a loading state
      submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Logging in...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        // Reset button after delay (for demonstration)
        submitBtn.innerHTML = 'Login';
        submitBtn.disabled = false;
        
        // Show a demo notification
        alert('Login functionality would be implemented here. This would connect to a database for authentication.');
      }, 2000);
    });
  }
  
  // Glass card entrance animation
  const loginCard = document.querySelector('.glass-card');
  if (loginCard) {
    gsap.from(loginCard, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });
  }
  
  // Logo animation
  const logo = document.querySelector('.glass-card img');
  if (logo) {
    gsap.from(logo, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.7
    });
    
    // Subtle floating animation
    gsap.to(logo, {
      y: '-5px',
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1.5
    });
  }
  
  // Adjust particles and liquid mesh for login page
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    gsap.to(particlesContainer, {
      opacity: 0.4,
      duration: 2,
      ease: 'power2.inOut'
    });
  }
  
  const liquidMesh = document.getElementById('liquid-mesh');
  if (liquidMesh) {
    gsap.to(liquidMesh, {
      opacity: 0.15,
      duration: 2,
      ease: 'power2.inOut'
    });
  }
});

// Add necessary CSS for login page animations if not already present
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('style#login-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'login-styles';
    styleElement.textContent = `
      @keyframes pulse-animation {
        0% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 136, 204, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0); }
      }
      
      .pulse-animation {
        animation: pulse-animation 1.5s infinite;
      }
      
      @keyframes floating {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(styleElement);
  }
});
