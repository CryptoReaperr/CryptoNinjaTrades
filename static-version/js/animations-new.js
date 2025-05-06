/**
 * Basic animations for the Crypto Ninja Trades website
 * Using GSAP and AOS libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: false,
    mirror: true,
    offset: 50
  });

  // Handle page loading animation
  const loader = document.getElementById('page-loader');
  if (loader) {
    // Timeline for loader animation
    const loaderTimeline = gsap.timeline();
    
    // Add loader animation
    loaderTimeline
      .to('.loader-icon', {
        rotation: 360,
        repeat: 2,
        duration: 1.5,
        ease: 'power2.inOut'
      })
      .to('.loader-text .char', {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, '-=1')
      .to(loader, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.8,
        onComplete: () => {
          // Simple fade-in for initial elements
          fadeInInitialElements();
        }
      }, '+=0.5');
  } else {
    // If no loader, fade in elements immediately
    fadeInInitialElements();
  }

  // Basic fade-in for initial page elements
  function fadeInInitialElements() {
    // Fade in all ninja-animate elements
    gsap.to('.ninja-animate', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out'
    });
    
    // Animate counters (works in both animation modes)
    initCounters();
  }
  
  // Animate counters
  function initCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target')) || 0;
      const duration = 2; // seconds
      
      gsap.to(counter, {
        textContent: target,
        duration: duration,
        ease: 'power2.out',
        snap: { textContent: 1 },
        stagger: 0.5,
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
        }
      });
    });
  }
});