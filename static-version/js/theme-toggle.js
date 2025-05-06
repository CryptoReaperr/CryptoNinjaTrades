/**
 * Theme Toggle for Crypto Ninja Trades website
 * Provides light and dark theme options
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Theme toggle script loaded');
  // Initialize theme toggle with a small delay to ensure DOM is fully processed
  setTimeout(() => {
    initThemeToggle();
  }, 100);
});

/**
 * Set up and handle theme mode switching
 */
function initThemeToggle() {
  // Get theme toggle buttons
  const themeToggle = document.getElementById('theme-toggle'); // Bottom right corner toggle
  const themeToggleHeader = document.getElementById('theme-toggle-header'); // Desktop header toggle
  const themeToggleMobile = document.getElementById('theme-toggle-mobile'); // Mobile menu toggle
  
  if (!themeToggle && !themeToggleHeader && !themeToggleMobile) {
    console.log('No theme toggle buttons found');
    return;
  }
  
  console.log('Theme toggle: Initializing from theme-toggle.js');

  // Check if there's a saved preference
  const savedTheme = localStorage.getItem('themeMode');
  console.log('Saved theme mode:', savedTheme);
  
  // Initialize theme based on saved preference or default to dark
  const isLightTheme = savedTheme === 'light';
  if (isLightTheme) {
    document.body.classList.add('light-theme');
    if (themeToggle) themeToggle.classList.add('active');
    if (themeToggleHeader) themeToggleHeader.classList.add('active');
    if (themeToggleMobile) themeToggleMobile.classList.add('active');
    toggleThemeIcons(true);
    console.log('Applied light theme on init');
  } else {
    document.body.classList.remove('light-theme');
    if (themeToggle) themeToggle.classList.remove('active');
    if (themeToggleHeader) themeToggleHeader.classList.remove('active');
    if (themeToggleMobile) themeToggleMobile.classList.remove('active');
    toggleThemeIcons(false);
    console.log('Applied dark theme on init');
  }
  
  // Function to handle theme toggle click
  const handleThemeToggle = (e) => {
    e.preventDefault(); // Prevent any default action
    e.stopPropagation(); // Stop event bubbling
    console.log('Theme toggle or child clicked');
    
    // Toggle themes
    const newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    
    if (newTheme === 'light') {
      // Light theme mode
      document.body.classList.add('light-theme');
      localStorage.setItem('themeMode', 'light');
      if (themeToggle) themeToggle.classList.add('active');
      if (themeToggleHeader) themeToggleHeader.classList.add('active');
      if (themeToggleMobile) themeToggleMobile.classList.add('active');
      toggleThemeIcons(true);
      refreshParticles();
      console.log('Switched to light theme');
    } else {
      // Dark theme mode
      document.body.classList.remove('light-theme');
      localStorage.setItem('themeMode', 'dark');
      if (themeToggle) themeToggle.classList.remove('active');
      if (themeToggleHeader) themeToggleHeader.classList.remove('active');
      if (themeToggleMobile) themeToggleMobile.classList.remove('active');
      toggleThemeIcons(false);
      refreshParticles();
      console.log('Switched to dark theme');
    }
  };
  
  // Add click event handlers to the original toggle button (bottom right)
  if (themeToggle) {
    const toggleElements = [themeToggle, themeToggle.querySelector('.theme-toggle-switch'), themeToggle.querySelector('.theme-toggle-label')];
    toggleElements.forEach(element => {
      if (element) element.addEventListener('click', handleThemeToggle);
    });
  }
  
  // Add click event handler to the header toggle button
  if (themeToggleHeader) {
    themeToggleHeader.addEventListener('click', handleThemeToggle);
  }
  
  // Add click event handler to the mobile toggle button
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', handleThemeToggle);
  }
}

/**
 * Toggle the sun/moon icons based on theme
 */
function toggleThemeIcons(isLight) {
  // Get all dark and light icons
  const darkIcons = document.querySelectorAll('.dark-icon');
  const lightIcons = document.querySelectorAll('.light-icon');
  
  // Update all theme toggle icons
  darkIcons.forEach(icon => {
    if (isLight) {
      icon.classList.add('hidden');
    } else {
      icon.classList.remove('hidden');
    }
  });
  
  lightIcons.forEach(icon => {
    if (isLight) {
      icon.classList.remove('hidden');
    } else {
      icon.classList.add('hidden');
    }
  });
}

/**
 * Refresh particles network when theme changes
 */
function refreshParticles() {
  // Remove existing particle canvases
  document.querySelectorAll('.particles-network canvas').forEach(canvas => {
    canvas.remove();
  });
  
  // Re-initialize particles with new colors
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    new ParticleNetwork(heroSection, {
      particleCount: window.innerWidth < 768 ? 25 : 50,
      speed: 0.2,
      maxDistance: window.innerWidth < 768 ? 100 : 160
    });
  }
  
  // Also re-initialize particles in benefits section
  const benefitsSection = document.getElementById('benefits');
  if (benefitsSection) {
    new ParticleNetwork(benefitsSection, {
      particleCount: window.innerWidth < 768 ? 20 : 40,
      speed: 0.15,
      maxDistance: window.innerWidth < 768 ? 80 : 120,
      interactMode: 'repel'
    });
  }
}
