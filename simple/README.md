# Crypto Ninja Trades - Static Website

## Overview
This is the static HTML version of the Crypto Ninja Trades website. This version has been optimized for easy deployment via FTP to any web hosting provider without requiring a backend server or database.

## Features
- Fully static HTML, CSS, and JavaScript files
- No backend server required
- No database connections
- Maintains the original design and user experience
- Easy to deploy via FTP

## Structure
- `*.html` - The main HTML pages
- `css/` - Contains all stylesheets
- `js/` - Contains all JavaScript files
- `images/` - Contains all images and assets

## Pages
- `index.html` - Home page
- `login.html` - Login page
- `news.html` - Crypto news page
- `trends.html` - Market trends and analysis
- `terms.html` - Terms of service
- `privacy.html` - Privacy policy
- `cookie-policy.html` - Cookie policy
- `academy.html` - Trading academy

## Deployment
1. Upload all files via FTP to your web hosting provider
2. Make sure to maintain the folder structure (css/, js/, images/)
3. Set index.html as the default page

Alternatively, you can use the included `copy_to_ftp.sh` script to create a zip archive:
```
sh copy_to_ftp.sh
```

## Important Note
This is a static version of the website. Features that typically require a backend (like user login, dynamic data fetching, etc.) are simulated or presented as static content.

## Original Development
The original website was developed using Flask with a PostgreSQL database, offering dynamic content and user authentication. This static version maintains the design and user experience while being much easier to deploy.
