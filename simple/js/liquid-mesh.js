/**
 * Liquid Mesh Background Effect for Crypto Ninja Trades
 * A sophisticated, subtle animation that creates a futuristic liquid mesh appearance
 * Complements the Batman-style aesthetic with dark petrol blue tones
 */

class LiquidMesh {
  constructor(targetElement, options = {}) {
    this.container = targetElement;
    this.options = {
      color: options.color || '#2F414F',
      secondaryColor: options.secondaryColor || '#375F7C',
      density: options.density || (window.innerWidth < 768 ? 15 : 25),
      speed: options.speed || 0.008,
      amplitude: options.amplitude || 0.7,
      opacity: options.opacity || 0.1,
      ...options
    };
    
    this.width = 0;
    this.height = 0;
    this.points = [];
    this.raf = null;
    this.isActive = true;
    this.canvas = null;
    this.ctx = null;
    
    this.init();
  }
  
  init() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Apply styles
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    
    // Add to container
    this.container.appendChild(this.canvas);
    
    // Make container relative if it's static
    const position = window.getComputedStyle(this.container).position;
    if (position === 'static') {
      this.container.style.position = 'relative';
    }
    
    // Set size and create points
    this.resize();
    
    // Add event listeners
    window.addEventListener('resize', this.resize.bind(this));
    
    // Start animation
    this.animate();
    
    // Detect visibility changes to improve performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
    
    // Also use Intersection Observer to only animate when visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.start();
          } else {
            this.stop();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(this.container);
    }
  }
  
  resize() {
    // Get container dimensions
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    // Set canvas size with pixel ratio for sharpness
    const pixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = this.width * pixelRatio;
    this.canvas.height = this.height * pixelRatio;
    this.ctx.scale(pixelRatio, pixelRatio);
    
    // Create mesh points
    this.createPoints();
  }
  
  createPoints() {
    this.points = [];
    
    // Calculate grid dimensions
    const cellSize = Math.max(this.width, this.height) / this.options.density;
    const columns = Math.ceil(this.width / cellSize) + 2;
    const rows = Math.ceil(this.height / cellSize) + 2;
    
    // Create points
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        this.points.push({
          x: x * cellSize - cellSize,
          y: y * cellSize - cellSize,
          originX: x * cellSize - cellSize,
          originY: y * cellSize - cellSize,
          noiseOffsetX: Math.random() * 1000,
          noiseOffsetY: Math.random() * 1000
        });
      }
    }
  }
  
  animate() {
    if (!this.isActive) return;
    
    this.render();
    this.raf = requestAnimationFrame(this.animate.bind(this));
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update points with noise
    const time = Date.now() * this.options.speed * 0.003;
    
    this.points.forEach(point => {
      // Simple noise approximation for performance
      const nX = Math.sin(time + point.noiseOffsetX) * this.options.amplitude;
      const nY = Math.cos(time + point.noiseOffsetY) * this.options.amplitude;
      
      const cellSize = Math.max(this.width, this.height) / this.options.density;
      point.x = point.originX + nX * cellSize;
      point.y = point.originY + nY * cellSize;
    });
    
    // Draw mesh
    const cellSize = Math.max(this.width, this.height) / this.options.density;
    const columns = Math.ceil(this.width / cellSize) + 2;
    const rows = Math.ceil(this.height / cellSize) + 2;
    
    // Create gradient
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, this.options.color + Math.floor(this.options.opacity * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, this.options.secondaryColor + Math.floor(this.options.opacity * 255).toString(16).padStart(2, '0'));
    
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 1;
    
    // Draw triangles to create mesh
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < columns - 1; x++) {
        const index = y * columns + x;
        const p1 = this.points[index];
        const p2 = this.points[index + 1];
        const p3 = this.points[index + columns];
        const p4 = this.points[index + columns + 1];
        
        if (p1 && p2 && p3 && p4) {
          // Draw only if points are within visible range (with padding)
          const padding = cellSize * 2;
          const isVisible =
            (p1.x > -padding && p1.x < this.width + padding && p1.y > -padding && p1.y < this.height + padding) ||
            (p2.x > -padding && p2.x < this.width + padding && p2.y > -padding && p2.y < this.height + padding) ||
            (p3.x > -padding && p3.x < this.width + padding && p3.y > -padding && p3.y < this.height + padding) ||
            (p4.x > -padding && p4.x < this.width + padding && p4.y > -padding && p4.y < this.height + padding);
            
          if (isVisible) {
            this.ctx.globalAlpha = this.options.opacity;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.lineTo(p4.x, p4.y);
            this.ctx.lineTo(p3.x, p3.y);
            this.ctx.closePath();
            this.ctx.stroke();
            
            // Add subtle fill for more dimension
            this.ctx.globalAlpha = this.options.opacity * 0.3;
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
          }
        }
      }
    }
  }
  
  stop() {
    this.isActive = false;
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }
  
  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.animate();
    }
  }
  
  destroy() {
    this.stop();
    this.canvas.remove();
    window.removeEventListener('resize', this.resize);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Add to key sections for a sophisticated background effect
  const sections = [
    document.getElementById('hero'),
    document.getElementById('about'),
    document.getElementById('footer')
  ];
  
  sections.forEach(section => {
    if (section) {
      // Use different settings depending on the section
      const options = {
        color: section.id === 'hero' ? '#375F7C' : '#2F414F',
        secondaryColor: section.id === 'hero' ? '#567890' : '#4A6378',
        density: section.id === 'hero' ? 25 : 20,
        opacity: section.id === 'hero' ? 0.08 : 0.06,
        amplitude: section.id === 'hero' ? 0.8 : 0.6
      };
      
      new LiquidMesh(section, options);
    }
  });
});
