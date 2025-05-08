from flask import Flask, send_from_directory, redirect, request, make_response
import os
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Route for the root path
@app.route('/')
def index():
    return send_from_directory('static-version', 'index.html')

# Route for pages without .html extension
@app.route('/<path:path>')
def serve_file(path):
    logger.debug(f"Requested path: {path}")
    
    # Handle hash/anchor tags (like #requirements) by serving the index page
    if path.startswith('#'):
        logger.debug(f"Hash/anchor tag detected: {path}, serving index.html")
        return send_from_directory('static-version', 'index.html')
    
    # Check if the path already has an extension
    if '.' in path:
        # If it has an extension, serve directly from static-version
        logger.debug(f"Serving file with extension: {path}")
        return send_from_directory('static-version', path)
    
    # Check if the corresponding HTML file exists
    html_path = f"{path}.html"
    if os.path.exists(os.path.join('static-version', html_path)):
        # Serve the HTML file
        logger.debug(f"Serving HTML file: {html_path}")
        response = send_from_directory('static-version', html_path)
        # Set Content-Disposition to prevent download prompt
        response.headers['Content-Disposition'] = f'inline; filename={html_path}'
        return response
    
    # If no HTML file, try adding /index.html for directory paths
    directory_index = f"{path}/index.html"
    if os.path.exists(os.path.join('static-version', directory_index)):
        # Serve the directory index
        logger.debug(f"Serving directory index: {directory_index}")
        return send_from_directory('static-version', directory_index)
    
    # Check if it's one of our known routes and redirect
    known_routes = ['privacy', 'terms', 'news', 'trends', 'login', 'dashboard']
    if path in known_routes:
        logger.debug(f"Redirecting known route: {path} to {path}.html")
        return redirect(f"/{path}.html")
    
    # Default fallback - just try to serve the path directly
    logger.debug(f"Fallback: Serving path directly: {path}")
    try:
        return send_from_directory('static-version', path)
    except Exception as e:
        logger.error(f"Error serving {path}: {str(e)}")
        return f"Page not found: {path}", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)