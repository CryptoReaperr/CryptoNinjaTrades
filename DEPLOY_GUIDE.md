# Crypto Ninja Trades - Deployment Guide

This guide provides simple instructions for deploying the Crypto Ninja Trades website to your hosting server via FTP.

## 1. Requirements for Your Server

Your hosting server needs to have:

- Python 3.9 or newer
- Support for Flask applications
- No database installation required (SQLite is used by default)

## 2. Quick Deployment Via FTP

### Option 1: Using Our One-Command FTP Script (Easiest)

We've included a simple shell script to help you upload all files to your server with minimal effort:

1. Open a terminal/command prompt
2. Navigate to the project directory
3. Run the script with: `./deploy.sh`
4. Follow the prompts to enter your FTP details
5. The script will automatically upload all files with the correct structure

> Note: This script requires the `ftp` command to be installed on your computer (available by default on most systems).

### Option 2: Manual FTP Upload

#### Files to Upload

Upload ALL files and folders from this project to your server, maintaining the same structure:

```
├── services/       # API service modules
├── static/         # CSS, JS, and images
├── templates/      # HTML templates
├── app.py          # Main Flask application code
├── config.py       # Configuration settings
├── extensions.py   # Flask extensions setup
├── main.py         # Entry point for the application
├── models.py       # Database models
├── .env            # Environment variables (create this - see instructions below)
```

#### Manual Steps

1. Connect to your server using your FTP client (like FileZilla)
2. Navigate to your website's root directory (often called `public_html`, `www`, or `htdocs`)
3. Upload all project files and folders, preserving the directory structure
4. Set file permissions:
   - 755 (rwxr-xr-x) for directories
   - 644 (rw-r--r--) for files
   - 755 (rwxr-xr-x) for any script files

## 3. Environment Setup

Create a file named `.env` in the root directory with these settings:

```
SESSION_SECRET=your_random_secret_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
# Optional: DATABASE_URL=your_database_connection_string
```

Replace the placeholder values with your actual information:
- `your_random_secret_key_here`: A random string for session security
- `your_telegram_bot_token`: Your Telegram bot token for authentication
- (Optional) `your_database_connection_string`: Only needed if you want to use PostgreSQL instead of the default SQLite

## 4. Running the Application

If you have direct SSH access to your server, you can start the application with:

```bash
pip install -r requirements.txt  # Install dependencies (first time only)
gunicorn --bind 0.0.0.0:5000 --reuse-port main:app
```

### Using a Control Panel

If you're using a hosting control panel (cPanel, Plesk, etc.):

1. Go to the Python application section
2. Configure a new application with:
   - Entry point: `main.py`
   - WSGI application: `app`
   - Python version: 3.9 or newer

## 5. Troubleshooting

If you encounter issues:

1. Check that all files were uploaded with the correct structure
2. Verify file permissions are set correctly
3. Ensure your `.env` file has the correct environment variables
4. Look for error logs in your hosting control panel

## 6. Need Help?

Contact support at support@cryptoninjatrades.com for assistance with deployment.
