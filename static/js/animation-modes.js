/**
 * Animation Modes for Crypto Ninja Trades website
 * Provides two distinct animation styles: Basic and Advanced
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize animation modes
  initAnimationModes();
});

/**
 * Set up and handle animation modes switching
 */
function initAnimationModes() {
  // Get animation toggle button
  const animationToggle = document.getElementById('animation-toggle');
  if (!animationToggle) return;

  // Check for saved preference
  const savedMode = localStorage.getItem('animationMode') || 'basic';
  setAnimationMode(savedMode);
  
  // Update toggle button state
  if (savedMode === 'advanced') {
    animationToggle.classList.add('active');
  } else {
    animationToggle.classList.remove('active');
  }
  
  // Handle toggle button click
  animationToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    
    if (this.classList.contains('active')) {
      setAnimationMode('advanced');
      localStorage.setItem('animationMode', 'advanced');
    } else {
      setAnimationMode('basic');
      localStorage.setItem('animationMode', 'basic');
    }
  });
}

/**
 * Apply animation mode to the page
 */
function setAnimationMode(mode) {
  const body = document.body;
  
  // Remove all mode classes
  body.classList.remove('animations-basic', 'animations-advanced');
  
  // Apply selected mode
  body.classList.add(`animations-${mode}`);
  
  if (mode === 'basic') {
    applyBasicAnimations();
  } else {
    applyAdvancedAnimations();
  }
}

/**
 * Basic animation mode - simple and minimal
 */
function applyBasicAnimations() {
  // Clear any advanced animations that might be running
  gsap.killTweensOf('.hero-logo');
  gsap.killTweensOf('.holographic-heading');
  gsap.killTweensOf('.neon-button');
  gsap.killTweensOf('.hero-backdrop');
  
  // Apply simple animations
  gsap.to('.hero-logo', {
    y: 0,  // Reset position
    scale: 1,
    rotation: 0,
    duration: 0.5
  });
  
  // Simple fade-in for content
  const elements = document.querySelectorAll('.ninja-animate');
  elements.forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power1.out'
    });
  });
  
  // Basic styling
  document.querySelectorAll('.neon-button').forEach(button => {
    button.style.boxShadow = 'none';
  });
}

/**
 * Advanced animation mode - dynamic and futuristic
 */
function applyAdvancedAnimations() {
  // Hero Logo Animation
  gsap.to('.hero-logo', {
    y: 15,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });
  
  // Holographic Text Effect
  const holoText = document.querySelector('.holographic-heading');
  if (holoText) {
    gsap.to(holoText, {
      backgroundPosition: '200% 50%',
      duration: 4,
      repeat: -1,
      ease: 'linear'
    });
  }
  
  // Neon Button Glow
  document.querySelectorAll('.neon-button').forEach(button => {
    gsap.to(button, {
      boxShadow: '0 0 10px rgba(55, 95, 124, 0.8), 0 0 20px rgba(55, 95, 124, 0.5), 0 0 30px rgba(55, 95, 124, 0.3)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
  
  // Dynamic backdrop effect
  const backdrop = document.querySelector('.hero-backdrop');
  if (backdrop) {
    gsap.to(backdrop, {
      background: 'radial-gradient(circle at 70% 30%, rgba(55, 95, 124, 0.2) 0%, rgba(10, 10, 10, 0) 50%)',
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }
  
  // Ninja stars rotation
  document.querySelectorAll('.ninja-star').forEach((star, index) => {
    gsap.to(star, {
      rotation: 360,
      duration: 20 + (index * 5),
      repeat: -1,
      ease: 'none'
    });
  });
}