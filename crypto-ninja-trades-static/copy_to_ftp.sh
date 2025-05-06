#!/bin/bash

# Simple script to help with FTP transfer
# This script will create a tar archive of all the static website files

echo "Creating a tar archive of the Crypto Ninja Trades static website..."

# Create a tar archive with all website files
tar -czf crypto_ninja_trades_static.tar.gz *.html css/ js/ images/

echo ""
echo "Archive created: crypto_ninja_trades_static.tar.gz"
echo ""
echo "To deploy this website:"
echo "1. Download the tar.gz archive"
echo "2. Extract it to your local computer (use tar -xzf crypto_ninja_trades_static.tar.gz)"
echo "3. Upload all extracted files to your web hosting via FTP"
echo "4. Make sure to maintain the folder structure (css/, js/, images/)"
echo ""
echo "That's it! Your static Crypto Ninja Trades website is ready to use."
