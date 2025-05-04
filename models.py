from flask_login import UserMixin
import datetime
from extensions import db

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    telegram_id = db.Column(db.String(64), unique=True, nullable=True)
    telegram_username = db.Column(db.String(64), nullable=True)
    telegram_first_name = db.Column(db.String(64), nullable=True)
    telegram_last_name = db.Column(db.String(64), nullable=True)
    telegram_photo_url = db.Column(db.String(255), nullable=True)
    telegram_auth_date = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    @classmethod
    def get_or_create_from_telegram(cls, telegram_data):
        """Get existing user or create new one from Telegram login data"""
        user = cls.query.filter_by(telegram_id=telegram_data.get('id')).first()
        
        if not user:
            username = telegram_data.get('username', '')
            if username:
                # Check if username exists, make it unique if needed
                existing = cls.query.filter_by(username=username).first()
                if existing:
                    username = f"{username}_{telegram_data.get('id')}"
            else:
                # If no username, create one from first_name and id
                username = f"{telegram_data.get('first_name')}_{telegram_data.get('id')}"
                
            user = cls(
                username=username,
                telegram_id=telegram_data.get('id'),
                telegram_username=telegram_data.get('username'),
                telegram_first_name=telegram_data.get('first_name'),
                telegram_last_name=telegram_data.get('last_name'),
                telegram_photo_url=telegram_data.get('photo_url'),
                telegram_auth_date=telegram_data.get('auth_date')
            )
            db.session.add(user)
            db.session.commit()
        else:
            # Update existing user with latest data
            user.telegram_username = telegram_data.get('username')
            user.telegram_first_name = telegram_data.get('first_name')
            user.telegram_last_name = telegram_data.get('last_name')
            user.telegram_photo_url = telegram_data.get('photo_url')
            user.telegram_auth_date = telegram_data.get('auth_date')
            user.last_login = datetime.datetime.utcnow()
            db.session.commit()
            
        return user
