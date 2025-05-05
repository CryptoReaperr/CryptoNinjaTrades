# Crypto Ninja Trades - VIP Club Website

A professional, ninja-themed website for Crypto Ninja Trades, delivering an engaging trading platform for VIP members with interactive design elements.

## 🚀 Quick Deployment Guide

### 🔹 Deployment Options

#### Option 1: FTP Deployment (Recommended for Beginners)

1. **Download the project** from this Replit to your computer by clicking on the three dots (⋮) in the Files panel and selecting "Download as zip"
2. **Extract the downloaded zip file** to a folder on your computer
3. **Upload all files** to your web hosting using the included script:
   - Open a terminal/command prompt
   - Navigate to the extracted project folder
   - Run: `chmod +x deploy.sh` (on Mac/Linux) to make the script executable
   - Run: `./deploy.sh` (on Mac/Linux) or `bash deploy.sh` (on Windows)
   - Follow the prompts to enter your FTP server details
4. **Create a .env file** on your server with your secret keys (see DEPLOY_GUIDE.md)

#### Option 2: Using Git (For More Advanced Users)

1. **Install Git** on your computer if you don't have it: [Download Git](https://git-scm.com/downloads)
2. **Clone the repository** to your local computer:
   - Open a terminal/command prompt
   - Run: `git clone https://github.com/yourusername/crypto-ninja-trades.git`
   - Note: Replace the URL with your actual Git repository URL
3. **Upload to your web server** using either:
   - FTP: Use FileZilla or other FTP client to upload all files to your server
   - Git on server (if your hosting supports it):
     - SSH into your server
     - Navigate to your website directory
     - Run: `git clone https://github.com/yourusername/crypto-ninja-trades.git .`

> **Note:** Make sure your server supports Python 3.9+ and Flask applications!
> For complete instructions, read the [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) file.

## ✨ Project Highlights

This website offers a complete platform for crypto trading enthusiasts:

- ✅ Trading signals with +80% success rate since January 2023
- ✅ Educational academy for crypto futures trading
- ✅ Risk management advice and best practices
- ✅ Interactive user dashboard with live crypto data
- ✅ Telegram login integration for easy access
- ✅ Responsive design with adaptive layouts for all devices

## 🔧 Technical Features

### Frontend
- Interactive UI with advanced animations and transitions
- Dark mode color scheme with blue-grey accents
- Mobile-responsive design that works on all devices
- Copy-to-clipboard functionality for payment addresses
- Back-to-top button and smooth scrolling
- SVG graphics for fast loading

### Backend
- Flask-based web application with gunicorn server
- SQLite database for easy deployment (no database server required)
- Telegram authentication system
- Real-time crypto price data API integration
- News feeds from cryptocurrency sources

## 🔍 File Structure

```
📂 root
 ┣ 📂 services/       # API service modules
 ┣ 📂 static/         # CSS, JS, and images
 ┃  ┣ 📂 css/         # Stylesheet files
 ┃  ┣ 📂 js/          # JavaScript files
 ┃  ┗ 📂 images/      # Website images
 ┣ 📂 templates/      # HTML templates for all pages
 ┣ 📄 app.py          # Main Flask application
 ┣ 📄 config.py       # Configuration settings
 ┣ 📄 extensions.py   # Flask extensions setup
 ┣ 📄 main.py         # Entry point for the application
 ┣ 📄 models.py       # Database models
 ┗ 📄 DEPLOY_GUIDE.md # Detailed deployment instructions
```

## 🎨 Design Elements

- **Color Scheme:** Dark backgrounds with blue-grey accent colors
- **Typography:** Inter for body text, Montserrat for headings
- **Animations:** Subtle page transitions, hover effects, and scroll animations
- **Layout:** Responsive design with mobile-first approach

## 💻 Technologies Used

- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, GSAP animations
- **Backend:** Flask, SQLAlchemy, Python 3.9+
- **Integrations:** Telegram login API, cryptocurrency data APIs

## 📱 Social Media and Contact

- **Telegram:** https://t.me/cryptoninjatrades
- **Twitter/X:** https://x.com/ninjatradesBTC
- **Discord:** https://discord.gg/EZtXMRnBBa
- **Email:** support@cryptoninjatrades.com

## 📋 Technical Requirements

See the detailed requirements in [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) for server setup instructions.

---

© 2025 Crypto Ninja Trades. All Rights Reserved.
