# Crypto Ninja Trades - Static Website

This is a complete static version of the Crypto Ninja Trades website. It has been optimized for easy deployment to any web hosting service via FTP or direct file upload.

## Features

- Fully responsive design that works on all devices (mobile, tablet, desktop)
- Real-time cryptocurrency ticker showing live prices for top 20 cryptos using CoinGecko API (free, no API key required)
- Interactive cryptocurrency market trends visualization with price charts
- Modern dark-mode design with sleek animations and particle effects
- All pages fully functional: Home, News, Trends, Academy, Login

## Quick Installation Guide

1. Download this package
2. Extract the contents to your local machine
3. Upload all files to your web hosting via FTP
4. No configuration needed - the site will work immediately

## Automated Deployment

For convenience, you can use the included script to create a deployable archive:

```bash
./copy_to_ftp.sh
```

This will create a `crypto_ninja_trades_static.tar.gz` file that contains all necessary files for deployment.

## File Structure

- `index.html` - Main homepage
- `news.html` - Cryptocurrency news page
- `trends.html` - Market trends and analysis page
- `login.html` - Login page for members
- `js/` - All JavaScript files
  - `crypto-ticker.js` - Real-time cryptocurrency ticker (using CoinGecko API)
  - `market-trends.js` - Interactive market trends visualizations
  - Other utility and animation scripts
- `css/` - Stylesheets
- `images/` - Site graphics and assets

## External APIs

This static site uses the following free public APIs:

- CoinGecko API - For real-time cryptocurrency prices (no API key required)
- No other external APIs or backend services required

## Notes

- Cookie consent functionality is included but works client-side only
- All animations are optimized for performance
- The site includes a full dark mode (default)

For support or questions: support@cryptoninjatrades.com