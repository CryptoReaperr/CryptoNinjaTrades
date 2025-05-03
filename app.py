import os
import logging
from flask import Flask, render_template, jsonify
from services.crypto_api import crypto_api
from services.news_feed import news_feed

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/terms')
def terms():
    return render_template('terms.html')

@app.route('/academy')
def academy():
    return render_template('academy.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/news')
def news():
    return render_template('news.html')

# API Routes
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
