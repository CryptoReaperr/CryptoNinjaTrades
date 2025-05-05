import os
import requests
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class CryptoAPI:
    def __init__(self):
        self.api_key = os.environ.get("COINMARKETCAP_API_KEY")
        self.base_url = "https://pro-api.coinmarketcap.com/v1"
        self.cache = {}
        self.cache_time = None
        
    def get_latest_prices(self, limit=10):
        """Get latest cryptocurrency prices"""
        # Check if we have cached data less than 5 minutes old
        now = datetime.now()
        if self.cache and self.cache_time and (now - self.cache_time < timedelta(minutes=5)):
            return self.cache
            
        # Prepare to fetch new data
        headers = {
            'X-CMC_PRO_API_KEY': self.api_key,
            'Accept': 'application/json'
        }
        
        params = {
            'start': '1',
            'limit': str(limit),
            'convert': 'USD',
            'sort': 'market_cap',
            'sort_dir': 'desc'
        }
        
        try:
            response = requests.get(
                f"{self.base_url}/cryptocurrency/listings/latest", 
                headers=headers, 
                params=params
            )
            
            data = response.json()
            
            if response.status_code == 200:
                # Format the data for our ticker
                formatted_data = []
                for coin in data['data']:
                    price = coin['quote']['USD']['price']
                    price_formatted = f"${price:.2f}" if price >= 1 else f"${price:.6f}"
                    
                    percent_change_24h = coin['quote']['USD']['percent_change_24h']
                    change_class = 'text-green-500' if percent_change_24h >= 0 else 'text-red-500'
                    change_icon = 'trending-up' if percent_change_24h >= 0 else 'trending-down'
                    
                    formatted_data.append({
                        'symbol': coin['symbol'],
                        'name': coin['name'],
                        'price': price_formatted,
                        'percent_change_24h': f"{percent_change_24h:.2f}%",
                        'change_class': change_class,
                        'change_icon': change_icon,
                        'market_cap': coin['quote']['USD']['market_cap'],
                        'volume_24h': coin['quote']['USD']['volume_24h']
                    })
                
                # Update cache
                self.cache = formatted_data
                self.cache_time = now
                return formatted_data
            else:
                logger.error(f"Error fetching crypto data: {data['status']['error_message']}")
                # Return empty list or cached data if available
                return self.cache if self.cache else []
                
        except Exception as e:
            logger.error(f"Exception when calling CoinMarketCap API: {str(e)}")
            return self.cache if self.cache else []

# Create a singleton instance
crypto_api = CryptoAPI()
