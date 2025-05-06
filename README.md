# Crypto Ninja Trades - Static Website

This is the static version of the Crypto Ninja Trades website, designed for easy deployment via FTP to any web hosting service.

## Deployment Instructions

### Option 1: Direct FTP Upload

1. Download the entire `static-version` folder
2. Connect to your web hosting service via FTP
3. Upload all files from the `static-version` folder to your web hosting's public HTML directory (often called `public_html`, `www`, or `htdocs`)
4. Your website should now be live at your domain

### Option 2: Using the Provided Archive

1. Download the `static-version/crypto_ninja_trades_static.tar.gz` file
2. Upload this file to your web hosting service
3. Extract the archive using the command: `tar -xzf crypto_ninja_trades_static.tar.gz`
4. Your website should now be live at your domain

## Features

- Fully static website with no backend dependencies
- Real-time cryptocurrency price updates via CoinGecko API (no API key required)
- Responsive, modern design with ninja-themed aesthetics
- Interactive elements and animations
- Market trends visualization
- Cryptocurrency news feed
- User login/registration interface
- Advanced animations and particle effects

## Technical Details

- The website uses the CoinGecko API for cryptocurrency data (free, no API key required)
- All JavaScript is client-side only, no server-side processing required
- CSS is optimized for fast loading and responsive design
- Animations use a combination of CSS and JavaScript for optimal performance

## File Structure

- `index.html` - Main homepage
- `login.html` - User login and registration page
- `news.html` - Cryptocurrency news page
- `trends.html` - Market trends visualization page
- `css/` - All styling files
- `js/` - JavaScript functionality
- `images/` - Website images and assets
- `copy_to_ftp.sh` - Helper script for deployment (optional)