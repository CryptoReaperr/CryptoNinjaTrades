#!/bin/bash

# Build Tailwind CSS for production
npx tailwindcss -i ./static-version/css/tailwind-input.css -o ./static-version/css/tailwind-output.css --minify
echo "Tailwind CSS built successfully!"