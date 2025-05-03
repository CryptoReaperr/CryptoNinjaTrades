import feedparser
import logging
import time
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import re

logger = logging.getLogger(__name__)

class NewsFeed:
    def __init__(self):
        self.feed_urls = [
            "https://www.investing.com/rss/news_301.rss",
            "https://crypto.news/feed",
            "https://cryptonews.com/feed/",
            "https://cointelegraph.com/rss"
        ]
        self.cache = []
        self.cache_time = None
        
    def get_latest_news(self, limit=8):
        """Get latest cryptocurrency news from multiple sources"""
        # Check if we have cached data less than 15 minutes old
        now = datetime.now()
        if self.cache and self.cache_time and (now - self.cache_time < timedelta(minutes=15)):
            return self.cache[:limit]
        
        all_entries = []
        
        try:
            # Get news from all feed sources
            for feed_url in self.feed_urls:
                try:
                    feed = feedparser.parse(feed_url)
                    
                    for entry in feed.entries[:10]:  # Get top 10 from each feed
                        # Extract domain from feed URL
                        domain = re.search(r'https?://(?:www\.)?([^/]+)', feed_url).group(1)
                        
                        # Format published date
                        published = entry.get('published', entry.get('updated', ''))
                        try:
                            # Convert to datetime object
                            if hasattr(entry, 'published_parsed'):
                                dt = datetime(*entry.published_parsed[:6])
                            elif hasattr(entry, 'updated_parsed'):
                                dt = datetime(*entry.updated_parsed[:6])
                            else:
                                dt = datetime.now()
                                
                            # Format date nicely
                            published = dt.strftime('%b %d, %Y')
                        except Exception:
                            # If we can't parse the date, use the original string
                            pass
                        
                        # Clean description/summary text
                        description = ""
                        image_url = None
                        
                        # Extract image from summary or description if available
                        if hasattr(entry, 'summary'):
                            soup = BeautifulSoup(entry.summary, 'html.parser')
                            description = soup.get_text()[:150] + "..." if len(soup.get_text()) > 150 else soup.get_text()
                            # Try to find image in summary
                            img_tag = soup.find('img')
                            if img_tag and img_tag.has_attr('src'):
                                image_url = img_tag['src']
                        elif hasattr(entry, 'description'):
                            soup = BeautifulSoup(entry.description, 'html.parser')
                            description = soup.get_text()[:150] + "..." if len(soup.get_text()) > 150 else soup.get_text()
                            # Try to find image in description
                            img_tag = soup.find('img')
                            if img_tag and img_tag.has_attr('src'):
                                image_url = img_tag['src']
                        
                        # Check for media content or enclosures (common in RSS feeds)
                        if not image_url and hasattr(entry, 'media_content') and entry.media_content:
                            for media in entry.media_content:
                                if 'url' in media:
                                    image_url = media['url']
                                    break
                        
                        # Check for enclosures as another potential source of images
                        if not image_url and hasattr(entry, 'enclosures') and entry.enclosures:
                            for enclosure in entry.enclosures:
                                if hasattr(enclosure, 'type') and enclosure.type and enclosure.type.startswith('image/') and hasattr(enclosure, 'href'):
                                    image_url = enclosure.href
                                    break
                        
                        # Create news item
                        news_item = {
                            'title': entry.title,
                            'link': entry.link,
                            'published': published,
                            'description': description,
                            'source': domain,
                            'image_url': image_url
                        }
                        
                        all_entries.append(news_item)
                except Exception as e:
                    logger.error(f"Error parsing feed {feed_url}: {str(e)}")
                    continue
            
            # Sort by date (newest first) - as best we can with string dates
            # In a real app, we would parse these properly
            all_entries.sort(key=lambda x: x.get('published', ''), reverse=True)
            
            # Update cache
            self.cache = all_entries
            self.cache_time = now
            
            return all_entries[:limit]
        except Exception as e:
            logger.error(f"Exception when fetching news feeds: {str(e)}")
            return self.cache[:limit] if self.cache else []

# Create a singleton instance
news_feed = NewsFeed()
