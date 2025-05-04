import os
import hashlib
import hmac
import time
import logging
from urllib.parse import parse_qsl

logger = logging.getLogger(__name__)

class TelegramAuth:
    def __init__(self):
        self.bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
        if not self.bot_token:
            logger.warning('No TELEGRAM_BOT_TOKEN found in environment variables')
            
    def get_auth_url(self, callback_url):
        """Generate Telegram login widget URL"""
        return f"https://oauth.telegram.org/auth?bot_id={self.bot_token.split(':')[0]}&origin={callback_url}&return_to={callback_url}"
    
    def verify_telegram_data(self, auth_data):
        """Verify data received from Telegram login widget"""
        if not auth_data or 'hash' not in auth_data:
            logger.error('No hash found in auth data')
            return False
        
        auth_hash = auth_data['hash']
        auth_data_copy = auth_data.copy()
        auth_data_copy.pop('hash', None)

        # Sort data alphabetically
        data_check_string = '\n'.join(f"{k}={v}" for k, v in sorted(auth_data_copy.items()))

        # Generate secret key from bot token
        secret_key = hashlib.sha256(self.bot_token.encode()).digest()
        
        # Calculate hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Check if received hash matches calculated hash
        if calculated_hash != auth_hash:
            logger.error('Hash verification failed')
            return False
            
        # Check if auth date is not expired (1 day)
        auth_date = int(auth_data.get('auth_date', 0))
        if time.time() - auth_date > 86400:
            logger.error('Authentication expired')
            return False
            
        return True
    
    def parse_auth_data(self, auth_string):
        """Parse auth data from query string"""
        try:
            # Parse data from query string format
            auth_data = dict(parse_qsl(auth_string))
            
            # Convert IDs to string to ensure consistency
            if 'id' in auth_data:
                auth_data['id'] = str(auth_data['id'])
                
            # Convert auth_date to int
            if 'auth_date' in auth_data:
                auth_data['auth_date'] = int(auth_data['auth_date'])
                
            return auth_data
            
        except Exception as e:
            logger.error(f"Error parsing Telegram auth data: {str(e)}")
            return None

# Create singleton instance
telegram_auth = TelegramAuth()
