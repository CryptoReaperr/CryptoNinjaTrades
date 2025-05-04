/**
 * Theme Toggle for Crypto Ninja Trades website
 * Provides light and dark theme options
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Theme toggle script loaded');
  // Initialize theme toggle
  initThemeToggle();
});

/**
 * Set up and handle theme mode switching
 */
function initThemeToggle() {
  // Get theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    console.log('Theme toggle not found');
    return;
  }
  
  console.log('Theme toggle: Initializing from theme-toggle.js');

  // Check if there's a saved preference
  const savedTheme = localStorage.getItem('themeMode');
  console.log('Saved theme mode:', savedTheme);
  
  // Initialize theme based on saved preference or default to dark
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.classList.add('active');
    toggleThemeIcons(true);
    console.log('Applied light theme on init');
  } else {
    document.body.classList.remove('light-theme');
    themeToggle.classList.remove('active');
    toggleThemeIcons(false);
    console.log('Applied dark theme on init');
  }
  
  // Toggle between theme modes
  themeToggle.addEventListener('click', function() {
    console.log('Theme toggle clicked');
    this.classList.toggle('active');
    
    if (this.classList.contains('active')) {
      // Light theme mode
      document.body.classList.add('light-theme');
      localStorage.setItem('themeMode', 'light');
      toggleThemeIcons(true);
      console.log('Switched to light theme');
    } else {
      // Dark theme mode
      document.body.classList.remove('light-theme');
      localStorage.setItem('themeMode', 'dark');
      toggleThemeIcons(false);
      console.log('Switched to dark theme');
    }
  });
}

/**
 * Toggle the sun/moon icons based on theme
 */
function toggleThemeIcons(isLight) {
  const darkIcon = document.querySelector('.dark-icon');
  const lightIcon = document.querySelector('.light-icon');
  
  if (darkIcon && lightIcon) {
    if (isLight) {
      darkIcon.classList.add('hidden');
      lightIcon.classList.remove('hidden');
    } else {
      darkIcon.classList.remove('hidden');
      lightIcon.classList.add('hidden');
    }
  }
}
