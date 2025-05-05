#!/bin/bash

# Simple script to help with FTP transfer
# This script will create a zip file of all the static website files

echo "Creating a zip archive of the Crypto Ninja Trades static website..."

# Create a zip file with all website files
zip -r crypto_ninja_trades_static.zip *.html css/ js/ images/

echo ""
echo "Archive created: crypto_ninja_trades_static.zip"
echo ""
echo "To deploy this website:"
echo "1. Download the zip archive"
echo "2. Extract it to your local computer"
echo "3. Upload all extracted files to your web hosting via FTP"
echo "4. Make sure to maintain the folder structure (css/, js/, images/)"
echo ""
echo "That's it! Your static Crypto Ninja Trades website is ready to use."
