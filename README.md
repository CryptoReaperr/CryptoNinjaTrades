# Crypto Ninja Trades - VIP Club Website

A professional, ninja-themed static website for Crypto Ninja Trades promoting their exclusive VIP Club for crypto futures trading.

## Project Overview

This website is designed to attract serious traders to join the Crypto Ninja Trades VIP Club, offering:

- Trading signals with +80% success rate since January 2023
- Educational content on crypto futures trading
- Risk management advice and best practices
- Expert admin support

The site features a dark, sleek ninja-themed design with neon accents, smooth animations, and a mobile-responsive layout.

## Features

- Single-page design with smooth scrolling navigation
- Mobile-responsive layout with hamburger menu
- Copy-to-clipboard functionality for payment addresses
- Membership plan cards with clear pricing
- Animated elements on scroll
- Back-to-top button
- SVG graphics for fast loading

## Technologies Used

- **Frontend:**
  - HTML5
  - Tailwind CSS (via CDN)
  - Vanilla JavaScript
  - Google Fonts (Inter, Montserrat)
  - Feather Icons

- **Backend:**
  - Flask (minimal setup for serving static content)

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```
   pip install flask
   ```
3. Run the application:
   ```
   python main.py
   ```
4. Open your browser and navigate to http://localhost:5000

## FTP Deployment Steps

1. Drag and drop all files from the project folder to your FTP server's root directory (e.g., /public_html).
2. Ensure file permissions are set to 644 for files and 755 for folders.
3. Verify the site loads at cryptoninjatrades.com.

## External Resources

- Tailwind CSS CDN: https://cdn.tailwindcss.com
- Google Fonts: Inter, Montserrat
- Feather Icons: https://unpkg.com/feather-icons

## File Structure

- `/templates/` - HTML templates
- `/static/css/` - Custom CSS styles
- `/static/js/` - JavaScript files
- `/static/images/` - SVG images (logo, hero background, favicon)

## Design Notes

- Color Scheme: Dark backgrounds (#0A0A0A, #1A1A1A) with neon green (#00FF88), electric blue (#00D4FF), and red (#FF3333) accents
- Typography: Inter for body text, Montserrat for headings
- Responsive breakpoints for mobile, tablet, and desktop views
