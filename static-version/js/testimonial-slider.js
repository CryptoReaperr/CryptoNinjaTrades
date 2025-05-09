/**
 * Testimonial Slider for Crypto Ninja Trades
 * Advanced interactive slider with smooth animations
 */

class TestimonialSlider {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Testimonial slider container not found:', containerId);
      return;
    }

    // Default options
    this.options = {
      autoplay: true,
      interval: 5000, // Time between automatic slides in ms
      initialSlide: 0,
      animationSpeed: 500, // Transition speed in ms
      ...options
    };

    this.slider = this.container.querySelector('.testimonial-slider');
    this.slides = Array.from(this.container.querySelectorAll('.testimonial-slide'));
    this.indicators = [];
    this.currentIndex = this.options.initialSlide;
    this.autoplayInterval = null;
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    console.log('Initializing testimonial slider');
    if (this.slides.length === 0) {
      console.error('No slides found in the testimonial slider');
      return;
    }

    // Create navigation indicators
    this.createIndicators();

    // Create arrow navigation
    this.createArrowNavigation();

    // Set initial slide
    this.goToSlide(this.currentIndex, false);

    // Set up autoplay
    if (this.options.autoplay) {
      this.startAutoplay();
    }

    // Add event listeners for keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Add touch event listeners for mobile swipe
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => {
      if (this.options.autoplay) {
        this.startAutoplay();
      }
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoplay();
      } else if (this.options.autoplay) {
        this.startAutoplay();
      }
    });

    // Apply random highlight effect to testimonials
    this.setupRandomHighlight();
  }

  createIndicators() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'slider-navigation';

    this.slides.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'slide-indicator';
      indicator.addEventListener('click', () => this.goToSlide(index));
      indicatorsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    });

    this.container.appendChild(indicatorsContainer);
  }

  createArrowNavigation() {
    // Create previous arrow
    const prevArrow = document.createElement('div');
    prevArrow.className = 'slide-arrow prev';
    prevArrow.innerHTML = '<i data-feather="chevron-left"></i>';
    prevArrow.addEventListener('click', () => this.prevSlide());

    // Create next arrow
    const nextArrow = document.createElement('div');
    nextArrow.className = 'slide-arrow next';
    nextArrow.innerHTML = '<i data-feather="chevron-right"></i>';
    nextArrow.addEventListener('click', () => this.nextSlide());

    this.container.appendChild(prevArrow);
    this.container.appendChild(nextArrow);

    // Initialize Feather icons in arrows
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  goToSlide(index, animate = true) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Ensure index is within bounds
    if (index < 0) {
      index = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      index = 0;
    }

    // Update current index
    this.currentIndex = index;

    // Remove active class from all slides and add to current
    this.slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (animate) {
        slide.style.transition = `opacity ${this.options.animationSpeed}ms ease, transform ${this.options.animationSpeed}ms ease`;
      } else {
        slide.style.transition = 'none';
      }
    });

    // Update indicators
    this.indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });

    // Add active class to current slide with delay for animation
    setTimeout(() => {
      this.slides[index].classList.add('active');
      this.isTransitioning = false;
    }, animate ? 50 : 0);

    // Set slider position
    if (animate) {
      this.slider.style.transition = `transform ${this.options.animationSpeed}ms ease`;
    } else {
      this.slider.style.transition = 'none';
    }
    this.slider.style.transform = `translateX(-${index * 100}%)`;
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
    if (this.options.autoplay) {
      this.resetAutoplay();
    }
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
    if (this.options.autoplay) {
      this.resetAutoplay();
    }
  }

  startAutoplay() {
    this.stopAutoplay(); // Clear any existing interval
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.options.interval);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  handleKeyDown(event) {
    // Only handle key events if slider is in viewport
    if (!this.isInViewport()) return;

    if (event.key === 'ArrowRight') {
      this.nextSlide();
    } else if (event.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }

  handleTouchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const threshold = 100; // Minimum distance for a swipe
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      // Swipe left - go to next slide
      this.nextSlide();
    } else {
      // Swipe right - go to previous slide
      this.prevSlide();
    }
  }

  isInViewport() {
    const rect = this.container.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  setupRandomHighlight() {
    // Randomly highlight testimonials to draw attention
    const cards = this.container.querySelectorAll('.testimonial-card-new');
    if (cards.length === 0) return;

    let lastHighlightedIndex = -1;

    setInterval(() => {
      // Remove highlight from all cards
      cards.forEach(card => card.classList.remove('highlight'));

      // Generate a random index different from the last one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * cards.length);
      } while (randomIndex === lastHighlightedIndex && cards.length > 1);

      // Add highlight to the randomly selected card
      cards[randomIndex].classList.add('highlight');
      lastHighlightedIndex = randomIndex;
    }, 6000); // Change highlight every 6 seconds
  }
}

/**
 * Initialize the testimonial slider when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing testimonial slider');
  // Initialize the slider with custom options
  const slider = new TestimonialSlider('testimonial-slider-container', {
    autoplay: true,
    interval: 8000, // 8 seconds between slides
    initialSlide: 0
  });
});