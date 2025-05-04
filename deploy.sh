#!/bin/bash

# Crypto Ninja Trades - Simple FTP Deployment Script
# This script helps you upload all files to your web server via FTP

echo "========================================="
echo "   Crypto Ninja Trades - FTP Upload    "
echo "========================================="
echo ""

# Request FTP details
read -p "Enter FTP server address: " FTP_SERVER
read -p "Enter FTP username: " FTP_USER
read -s -p "Enter FTP password: " FTP_PASS
echo ""
read -p "Enter remote directory (e.g., /public_html): " REMOTE_DIR

# Create a temporary file for FTP commands
TMP_FILE=$(mktemp)

# Write FTP commands to the temporary file
echo "open $FTP_SERVER" > "$TMP_FILE"
echo "user $FTP_USER $FTP_PASS" >> "$TMP_FILE"
echo "cd $REMOTE_DIR" >> "$TMP_FILE"
echo "mkdir -p services static templates" >> "$TMP_FILE"
echo "mkdir -p static/css static/js static/images" >> "$TMP_FILE"

# Upload all files
echo "put app.py" >> "$TMP_FILE"
echo "put config.py" >> "$TMP_FILE"
echo "put extensions.py" >> "$TMP_FILE"
echo "put main.py" >> "$TMP_FILE"
echo "put models.py" >> "$TMP_FILE"
echo "put README.md" >> "$TMP_FILE"
echo "put DEPLOY_GUIDE.md" >> "$TMP_FILE"

# Upload SQLite database if it exists
if [ -f "crypto_ninja.db" ]; then
    echo "put crypto_ninja.db" >> "$TMP_FILE"
    echo "Note: Existing SQLite database will be uploaded."
fi

# Upload services directory
echo "cd services" >> "$TMP_FILE"
echo "lcd services" >> "$TMP_FILE"
echo "mput *" >> "$TMP_FILE"
echo "lcd .." >> "$TMP_FILE"
echo "cd .." >> "$TMP_FILE"

# Upload static directory
echo "cd static/css" >> "$TMP_FILE"
echo "lcd static/css" >> "$TMP_FILE"
echo "mput *" >> "$TMP_FILE"
echo "lcd ../.." >> "$TMP_FILE"
echo "cd ../.." >> "$TMP_FILE"

echo "cd static/js" >> "$TMP_FILE"
echo "lcd static/js" >> "$TMP_FILE"
echo "mput *" >> "$TMP_FILE"
echo "lcd ../.." >> "$TMP_FILE"
echo "cd ../.." >> "$TMP_FILE"

echo "cd static/images" >> "$TMP_FILE"
echo "lcd static/images" >> "$TMP_FILE"
echo "mput *" >> "$TMP_FILE"
echo "lcd ../.." >> "$TMP_FILE"
echo "cd ../.." >> "$TMP_FILE"

# Upload templates directory
echo "cd templates" >> "$TMP_FILE"
echo "lcd templates" >> "$TMP_FILE"
echo "mput *" >> "$TMP_FILE"
echo "lcd .." >> "$TMP_FILE"
echo "cd .." >> "$TMP_FILE"

# Close FTP connection
echo "bye" >> "$TMP_FILE"

echo ""
echo "Starting FTP upload..."
echo ""

# Use the ftp command with the temporary file
ftp -n < "$TMP_FILE"

# Remove the temporary file
rm "$TMP_FILE"

echo ""
echo "========================================="
echo "Upload complete! Don't forget to create a .env file on your server with:"
echo "SESSION_SECRET=your_random_secret_key_here"
echo "TELEGRAM_BOT_TOKEN=your_telegram_bot_token"
echo ""
echo "Note: SQLite database is used by default - no DATABASE_URL needed"
echo "(Only add DATABASE_URL if you want to use PostgreSQL instead of SQLite)"
echo "========================================="
