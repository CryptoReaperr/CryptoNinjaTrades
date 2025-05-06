/**
 * Particle network system for Crypto Ninja Trades
 * Creates an interactive background with connecting nodes
 */

class ParticleNetwork {
  constructor(container, options) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    this.options = Object.assign({
      particleCount: 50,
      particleColor: '#375F7C',
      lineColor: '#4A6378',
      particleRadius: 2,
      lineWidth: 0.5,
      maxDistance: 150,
      speed: 0.2,
      responsive: true,
      interactMode: 'attract'  // 'attract' or 'repel'
    }, options);
    
    this.particles = [];
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.mouse = {
      x: this.width / 2,
      y: this.height / 2,
      isActive: false
    };
    
    // Initialize the network
    this._initializeCanvas();
    this._initializeEvents();
    this._createParticles();
    this._animateParticles();
  }
  
  _initializeCanvas() {
    // Set canvas to full width/height
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Set some css for smooth appearance
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.right = '0';
    this.canvas.style.top = '0';
    this.canvas.style.bottom = '0';
    this.canvas.style.pointerEvents = 'none';
  }
  
  _initializeEvents() {
    // Mouse interaction
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isActive = true;
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.mouse.isActive = false;
    });
    
    // Window resize handler for responsive design
    if (this.options.responsive) {
      window.addEventListener('resize', () => {
        this._resize();
        this._createParticles();
      });
    }
  }
  
  _resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  
  _createParticles() {
    this.particles = [];
    
    // Create the particles
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
        radius: this.options.particleRadius + (Math.random() * 1.5),
        color: this._getRandomColor()
      });
    }
  }
  
  _getRandomColor() {
    // Check if using light or dark theme
    if (document.body.classList.contains('light-theme')) {
      // Generate colors with a lighter blue-grey theme for light mode
      const colors = [
        'rgba(47, 65, 79, 0.7)', // dark blue-grey with transparency
        'rgba(55, 95, 124, 0.7)', // medium blue-grey with transparency
        'rgba(74, 99, 120, 0.7)', // steel blue-grey with transparency
        'rgba(86, 120, 144, 0.7)', // light blue-grey with transparency
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // Generate colors with a subtle, Batman-style blue-grey theme for dark mode
      const colors = [
        '#2F414F', // dark blue-grey
        '#375F7C', // medium blue-grey
        '#4A6378', // steel blue-grey
        '#567890', // light blue-grey
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }
  
  _animateParticles() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      
      // Mouse interaction
      if (this.mouse.isActive) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxForce = 100;
        
        if (dist < maxForce) {
          const force = (1 - dist / maxForce) * 0.03;
          
          if (this.options.interactMode === 'attract') {
            p.vx -= dx * force;
            p.vy -= dy * force;
          } else {
            p.vx += dx * force;
            p.vy += dy * force;
          }
        }
      }
      
      // Update position with velocity
      p.x += p.vx * this.options.speed;
      p.y += p.vy * this.options.speed;
      
      // Enforce bounds
      if (p.x < 0) {
        p.x = 0;
        p.vx *= -1;
      } else if (p.x > this.width) {
        p.x = this.width;
        p.vx *= -1;
      }
      
      if (p.y < 0) {
        p.y = 0;
        p.vy *= -1;
      } else if (p.y > this.height) {
        p.y = this.height;
        p.vy *= -1;
      }
      
      // Draw the particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      
      // Connect with other particles
      for (let j = i + 1; j < this.particles.length; j++) {
        let p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.options.maxDistance) {
          // Calculate line opacity based on distance
          const opacity = 1 - (dist / this.options.maxDistance);
          
          // Draw the connection line
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(86, 120, 144, ${opacity * 0.3})`;
          this.ctx.lineWidth = this.options.lineWidth;
          this.ctx.stroke();
        }
      }
    }
    
    // Continue the animation loop
    requestAnimationFrame(() => this._animateParticles());
  }
}

// Initialize the particle network when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    new ParticleNetwork(heroSection, {
      particleCount: window.innerWidth < 768 ? 25 : 50,
      speed: 0.2,
      maxDistance: window.innerWidth < 768 ? 100 : 160
    });
  }
  
  // Also add particles to benefits section for extra visual appeal
  const benefitsSection = document.getElementById('benefits');
  if (benefitsSection) {
    new ParticleNetwork(benefitsSection, {
      particleCount: window.innerWidth < 768 ? 20 : 40,
      speed: 0.15,
      maxDistance: window.innerWidth < 768 ? 80 : 120,
      interactMode: 'repel'
    });
  }
});
