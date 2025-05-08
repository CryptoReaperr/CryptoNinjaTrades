from flask import Flask, send_from_directory, redirect, request, make_response
import os

app = Flask(__name__)

# Route for the root path
@app.route('/')
def index():
    return send_from_directory('static-version', 'index.html')

# Route for pages without .html extension
@app.route('/<path:path>')
def serve_file(path):
    # Check if the path already has an extension
    if '.' in path:
        # If it has an extension, serve directly from static-version
        return send_from_directory('static-version', path)
    
    # Check if the corresponding HTML file exists
    html_path = f"{path}.html"
    if os.path.exists(os.path.join('static-version', html_path)):
        # Serve the HTML file
        return send_from_directory('static-version', html_path)
    
    # If no HTML file, try adding /index.html for directory paths
    directory_index = f"{path}/index.html"
    if os.path.exists(os.path.join('static-version', directory_index)):
        # Serve the directory index
        return send_from_directory('static-version', directory_index)
    
    # Default fallback - just try to serve the path directly
    return send_from_directory('static-version', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)