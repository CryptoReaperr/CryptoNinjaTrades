# Crypto Ninja Trades - Deployment Guide

This guide provides simple instructions for deploying the Crypto Ninja Trades website to your hosting server via FTP or Git.

## 1. Requirements for Your Server

Your hosting server needs to have:

- Python 3.9 or newer
- Support for Flask applications
- No database installation required (SQLite is used by default)
- Web server (Apache or Nginx) with Python WSGI support

## 2. Deployment Options

### A. Quick Deployment Via FTP

#### Option 1: Using Our One-Command FTP Script (Easiest)

We've included a simple shell script to help you upload all files to your server with minimal effort:

1. Open a terminal/command prompt
2. Navigate to the project directory
3. Run the script with: `./deploy.sh`
4. Follow the prompts to enter your FTP details
5. The script will automatically upload all files with the correct structure

> Note: This script requires the `ftp` command to be installed on your computer (available by default on most systems).

#### Option 2: Manual FTP Upload

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

### B. Deployment Using Git

If you're familiar with Git or want to use version control for easier updates, follow these steps:

#### Option 1: Using GitHub/GitLab

1. **Create a Git repository:**
   - Sign up or log in to [GitHub](https://github.com/) or [GitLab](https://gitlab.com/)
   - Create a new repository (keep it private for security)

2. **Upload project to repository:**
   ```bash
   # Initialize Git in the project folder
   git init
   
   # Add all files to Git
   git add .
   
   # Commit the files
   git commit -m "Initial commit"
   
   # Add your remote repository URL
   git remote add origin https://github.com/yourusername/your-repo-name.git
   
   # Push to repository
   git push -u origin main
   ```

3. **Deploy to your server (if it supports Git):**
   - SSH into your server
   - Navigate to your website directory
   - Clone your repository:
     ```bash
     git clone https://github.com/yourusername/your-repo-name.git .
     ```
   - Set file permissions as mentioned in the FTP section

#### Option 2: Direct Git Deployment

If you're testing locally and want to deploy directly:

1. **Install Git on both your computer and server**

2. **On your computer, initialize Git and create a repository:**
   ```bash
   cd /path/to/project
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **On your server, set up a bare Git repository:**
   ```bash
   ssh user@your-server
   mkdir -p /path/to/git-repo.git
   cd /path/to/git-repo.git
   git init --bare
   ```

4. **Create a post-receive hook on your server:**
   ```bash
   cat > hooks/post-receive << 'EOL'
   #!/bin/bash
   GIT_WORK_TREE=/path/to/your/website git checkout -f
   chmod -R 755 /path/to/your/website
   find /path/to/your/website -type f -exec chmod 644 {} \;
   find /path/to/your/website -name "*.sh" -exec chmod 755 {} \;
   EOL
   
   chmod +x hooks/post-receive
   ```

5. **Back on your computer, add the remote and push:**
   ```bash
   git remote add production user@your-server:/path/to/git-repo.git
   git push production main
   ```

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

## 6. Configuring Your Domain Name

To make your website accessible via your domain name:

### Shared Hosting (cPanel, Plesk, etc.)

1. **Point Domain to Hosting:**
   - Log in to your domain registrar (GoDaddy, Namecheap, etc.)
   - Update the nameservers to point to your hosting provider's nameservers
   - Alternatively, set up an A record pointing to your hosting server's IP address

2. **Configure Web Server:**
   - In your hosting control panel, add your domain to the list of domains
   - Set the document root to point to the directory where you uploaded the Crypto Ninja Trades files

3. **Configure WSGI:**
   - Set up a Python application in your hosting panel (as mentioned in section 4)
   - Configure the web server to forward requests to your Flask application

### VPS or Dedicated Server

1. **DNS Configuration:**
   - Set up an A record for your domain pointing to your server's IP address

2. **Web Server Configuration:**
   - Set up Nginx or Apache as a reverse proxy to your Flask application
   
   **Example Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
   
   **Example Apache configuration:**
   ```apache
   <VirtualHost *:80>
       ServerName yourdomain.com
       ServerAlias www.yourdomain.com
       
       ProxyPass / http://127.0.0.1:5000/
       ProxyPassReverse / http://127.0.0.1:5000/
       
       # Required modules: mod_proxy, mod_proxy_http
   </VirtualHost>
   ```

3. **SSL Certificate (Recommended):**
   - Install Certbot and run: `certbot --nginx -d yourdomain.com -d www.yourdomain.com`
   - For Apache: `certbot --apache -d yourdomain.com -d www.yourdomain.com`

## 7. Need Help?

Contact support at support@cryptoninjatrades.com for assistance with deployment.
