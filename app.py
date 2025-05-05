import os
import logging
import json
import requests
from datetime import datetime, timedelta
from flask import Flask, render_template, jsonify, request, redirect, url_for, flash, session, make_response, send_from_directory
from flask_login import login_user, logout_user, login_required, current_user

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Import config, extensions, and models
from config import Config
from extensions import db, login_manager
from models import User
from services.crypto_api import crypto_api
from services.news_feed import news_feed
from services.telegram_auth import telegram_auth

# Create Flask app
def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    return app

app = create_app()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Cookie consent management
@app.route('/api/cookie-consent', methods=['POST'])
def set_cookie_consent():
    try:
        # Get consent data from request
        consent_data = request.json
        
        # Create response
        response = make_response(jsonify({'status': 'success', 'message': 'Cookie preferences saved'}))
        
        # Set cookie with consent data
        # Max age: 180 days (in seconds)
        max_age = 60 * 60 * 24 * 180
        expires = datetime.now() + timedelta(days=180)
        
        # Set cookie with consent data
        response.set_cookie(
            'crypto_ninja_cookie_consent',
            json.dumps(consent_data),
            max_age=max_age, 
            expires=expires,
            secure=request.is_secure,
            httponly=False,  # Allow JavaScript to read this cookie
            samesite='Lax',
            path='/'
        )
        
        return response
    except Exception as e:
        logging.error(f"Error setting cookie consent: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

# Helper function to get the cookie consent status
def get_cookie_consent():
    try:
        cookie = request.cookies.get('crypto_ninja_cookie_consent')
        if cookie:
            return json.loads(cookie)
        return None
    except Exception as e:
        logging.error(f"Error retrieving cookie consent: {e}")
        return None

# Pass the cookie consent status to all templates
@app.context_processor
def inject_cookie_consent():
    return {'cookie_consent': get_cookie_consent()}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/cookie-policy')
def cookie_policy():
    return render_template('cookie-policy.html')

@app.route('/terms')
def terms():
    return render_template('terms.html')

@app.route('/academy')
def academy():
    return render_template('academy.html')

@app.route('/login')
def login():
    # Add Telegram login URL to the template context
    telegram_login_url = telegram_auth.get_auth_url(request.host_url + 'auth/telegram/callback')
    return render_template('login.html', telegram_login_url=telegram_login_url)
    
# Telegram Auth routes
@app.route('/auth/telegram/callback')
def telegram_callback():
    # Get query string and parse auth data
    query_string = request.query_string.decode('utf-8')
    auth_data = telegram_auth.parse_auth_data(query_string)
    
    if not auth_data:
        flash('Failed to authenticate with Telegram. Please try again.', 'danger')
        return redirect(url_for('login'))
    
    # Verify data
    if not telegram_auth.verify_telegram_data(auth_data):
        flash('Invalid authentication data from Telegram.', 'danger')
        return redirect(url_for('login'))
    
    # Get or create user
    user = User.get_or_create_from_telegram(auth_data)
    
    # Log user in
    login_user(user)
    flash(f'Welcome, {user.telegram_first_name}!', 'success')
    
    # Redirect to dashboard or requested page
    next_page = request.args.get('next')
    return redirect(next_page or url_for('dashboard'))
    
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))
    
@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/trends')
def trends():
    return render_template('trends.html')

# Static site routes (for the simple static version)
@app.route('/simple/<path:filename>')
def serve_simple_site(filename):
    return send_from_directory('simple', filename)

# Special route to serve simple/index.html when /simple/ is accessed
@app.route('/simple/')
def serve_simple_index():
    return send_from_directory('simple', 'index.html')

# API Routes
@app.route('/api/crypto-proxy', methods=['POST'])
def crypto_proxy():
    """Proxy for CoinMarketCap API to avoid CORS issues"""
    try:
        # Get request data
        data = request.json
        url = data.get('url')
        api_key = data.get('apiKey')
        
        if not url or not api_key:
            return jsonify({'error': 'Missing URL or API key'}), 400
            
        # Make the request to CoinMarketCap
        headers = {
            'X-CMC_PRO_API_KEY': api_key,
            'Accept': 'application/json'
        }
        
        response = requests.get(url, headers=headers)
        
        # Return the response
        return jsonify(response.json())
    except Exception as e:
        logging.error(f"CoinMarketCap proxy error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/crypto-prices')
def crypto_prices():
    prices = crypto_api.get_latest_prices(limit=10)
    return jsonify(prices)

@app.route('/api/news-feed')
def news_feed_api():
    from flask import request
    limit = request.args.get('limit', default=8, type=int)
    news_items = news_feed.get_latest_news(limit=limit)
    return jsonify(news_items)

@app.route('/api/market-trends')
def market_trends_api():
    # For now we'll create some simple sample data
    # In a real app, this would come from a real API with historical data
    from flask import request
    import random
    from datetime import datetime, timedelta
    
    symbol = request.args.get('symbol', default='BTC', type=str)
    days = request.args.get('days', default=7, type=int)
    
    # Generate some realistic but sample data
    today = datetime.now()
    dates = [(today - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(days)][::-1]
    
    # Base values for different coins (starting points)
    base_values = {
        'BTC': 50000.0,
        'ETH': 2500.0,
        'SOL': 150.0,
        'DOGE': 0.15,
        'ADA': 0.50,
        'BNB': 400.0
    }
    
    # Volatility factors for different coins
    volatility = {
        'BTC': 0.03,  # 3% daily volatility
        'ETH': 0.04,
        'SOL': 0.06,
        'DOGE': 0.08,
        'ADA': 0.05,
        'BNB': 0.04
    }
    
    # Use the base value for the requested symbol, or default to BTC
    base_value = base_values.get(symbol, 1000.0)  
    vol = volatility.get(symbol, 0.05)
    
    # Generate realistic price movements
    prices = []
    current_price = base_value
    
    for _ in range(days):
        # Random movement with some momentum
        change_percent = random.uniform(-vol, vol) + random.uniform(-vol/2, vol/2)
        current_price = current_price * (1 + change_percent)
        prices.append(round(current_price, 2))
    
    # Calculate some indicators
    avg_price = sum(prices) / len(prices)
    min_price = min(prices)
    max_price = max(prices)
    current = prices[-1]
    previous = prices[-2] if len(prices) > 1 else prices[-1]
    percent_change = ((current - previous) / previous) * 100
    
    # Determine trend direction
    if current > previous:
        trend = "up"
    elif current < previous:
        trend = "down"
    else:
        trend = "stable"
    
    return jsonify({
        'symbol': symbol,
        'dates': dates,
        'prices': prices,
        'trend': trend,
        'percent_change': round(percent_change, 2),
        'statistics': {
            'average': round(avg_price, 2),
            'min': round(min_price, 2),
            'max': round(max_price, 2),
            'current': round(current, 2)
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
