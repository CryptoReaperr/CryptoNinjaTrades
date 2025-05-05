/**
 * Advanced animations for the Crypto Ninja Trades website
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
          // Start entrance animations after loader disappears
          startEntranceAnimations();
        }
      }, '+=0.5');
  } else {
    // If no loader, start entrance animations immediately
    startEntranceAnimations();
  }

  // Content entrance animations
  function startEntranceAnimations() {
    // Hero section animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline
      .from('.hero-logo', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
      })
      .from('.holographic-heading', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .from('h2.ninja-animate', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.ninja-animate a', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      }, '-=0.4')
      .from('.hero-stat', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2');

    // Floating animation for logo
    gsap.to('.hero-logo', {
      y: 15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Nav links staggered entrance
    gsap.from('nav a', {
      opacity: 0,
      y: -20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.5
    });

    // Connect all animated elements with class ninja-animate
    gsap.from('.ninja-animate', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.ninja-animate',
        start: 'top 80%',
      }
    });

    // Animate ninja stars
    animateNinjaStars();
  }

  // Special animation for ninja star elements
  function animateNinjaStars() {
    const stars = document.querySelectorAll('.ninja-star');
    
    stars.forEach(star => {
      // Random rotation animation
      gsap.to(star, {
        rotation: '+=360',
        duration: gsap.utils.random(4, 8),
        repeat: -1,
        ease: 'none'
      });
      
      // Random movement
      gsap.to(star, {
        x: gsap.utils.random(-20, 20),
        y: gsap.utils.random(-20, 20),
        duration: gsap.utils.random(3, 5),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  // Text splitting for character animations
  const splitTextElements = document.querySelectorAll('.split-text');
  splitTextElements.forEach(element => {
    // Split text into chars for animation
    const text = element.textContent;
    let html = '';
    
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ') {
        html += ' ';
      } else {
        html += `<span class="char">${text[i]}</span>`;
      }
    }
    
    element.innerHTML = html;
  });

  // Neon trail effect for mouse
  const trailCursor = document.querySelector('.cursor-trail');
  if (trailCursor) {
    document.addEventListener('mousemove', e => {
      gsap.to(trailCursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }

  // Counter animation for statistics
  const counterElements = document.querySelectorAll('.counter-value');
  counterElements.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    
    gsap.to(counter, {
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: counter,
        start: 'top 80%',
      },
      ease: 'power2.out'
    });
  });

  // Plan cards hover effects with GSAP
  const planCards = document.querySelectorAll('.plan-card');
  planCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        scale: 1.03,
        boxShadow: '0 10px 25px rgba(55, 95, 124, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Also animate child elements
      gsap.to(card.querySelector('h3'), {
        color: '#375F7C',
        duration: 0.3
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 0 0 rgba(55, 95, 124, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Reset child animations
      gsap.to(card.querySelector('h3'), {
        color: '#FFFFFF',
        duration: 0.3
      });
    });
  });

  // Glow effects on hover for buttons
  const glowButtons = document.querySelectorAll('.glow-on-hover');
  glowButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        boxShadow: '0 0 20px rgba(55, 95, 124, 0.8)',
        duration: 0.4
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        boxShadow: '0 0 0 rgba(55, 95, 124, 0)',
        duration: 0.4
      });
    });
  });
  
  // Initialize ScrollTrigger for GSAP
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax effect for background elements
    gsap.utils.toArray('.parallax').forEach(element => {
      gsap.to(element, {
        y: () => element.getAttribute('data-speed') || '-100',
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
    
    // Section transitions
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      gsap.from(section, {
        opacity: 0.8,
        scale: 0.98,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });
  }
});
