/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./static-version/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'ninja-dark': '#0A0E17',
        'ninja-black': '#050709',
        'ninja-gray': '#2A3040',
        'ninja-light': '#B8C2CC',
        'neon-green': '#00FF94',
        'electric-blue': '#00E5FF',
        'cyber-purple': '#7C3AED',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 255, 148, 0.6), 0 0 30px rgba(0, 255, 148, 0.2)',
        'glow-sm': '0 0 10px rgba(0, 255, 148, 0.4), 0 0 20px rgba(0, 255, 148, 0.1)',
        'glow-blue': '0 0 15px rgba(0, 229, 255, 0.6), 0 0 30px rgba(0, 229, 255, 0.2)',
        'glow-purple': '0 0 15px rgba(124, 58, 237, 0.6), 0 0 30px rgba(124, 58, 237, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 255, 148, 0.6), 0 0 30px rgba(0, 255, 148, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 255, 148, 0.8), 0 0 40px rgba(0, 255, 148, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise-pattern': "url('/static-version/images/noise-pattern.png')",
        'grid-pattern': "url('/static-version/images/grid-pattern.svg')",
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}