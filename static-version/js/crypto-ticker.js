/**
 * Crypto Ticker for CryptoNinjaTrades
 * Uses CoinGecko API to fetch real-time crypto prices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the ticker
    initializeCryptoTicker();
});

/**
 * Initialize the crypto ticker by fetching latest data
 */
async function initializeCryptoTicker() {
    try {
        // Fetch data from CoinGecko API
        const cryptoData = await fetchCryptoData();
        updateTickerUI(cryptoData);
        
        // Set up auto-refresh every 2 minutes
        setInterval(async () => {
            const refreshedData = await fetchCryptoData();
            updateTickerUI(refreshedData);
        }, 120000); // 2 minutes
        
    } catch (error) {
        console.error('Error initializing crypto ticker:', error);
        // If the ticker fails to load, ensure it still displays acceptable UI
        handleTickerError();
    }
}

/**
 * Fetch cryptocurrency data from CoinGecko API (free, no API key required)
 */
async function fetchCryptoData() {
    try {
        // Using CoinGecko's free API to get top 20 cryptocurrencies by market cap
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h');
        
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        return processCoinGeckoResponse(data);
    } catch (error) {
        console.error('Error fetching from CoinGecko API:', error);
        throw error;
    }
}

/**
 * Process the CoinGecko API response data into the format we need
 */
function processCoinGeckoResponse(apiData) {
    if (!apiData || !Array.isArray(apiData)) {
        throw new Error('Invalid API response format');
    }
    
    return apiData.map(crypto => {
        const price = crypto.current_price;
        const change24h = crypto.price_change_percentage_24h;
        
        return {
            symbol: crypto.symbol.toUpperCase(),
            name: crypto.name,
            price: price,
            priceFormatted: formatPrice(price),
            change24h: change24h,
            change24hFormatted: formatPercentage(change24h),
            isPositive: change24h >= 0,
            image: crypto.image,
            marketCap: crypto.market_cap,
            marketCapRank: crypto.market_cap_rank,
            id: crypto.id,
            coinMarketCapUrl: `https://coinmarketcap.com/currencies/${crypto.id}/`
        };
    });
}

/**
 * Format price with appropriate precision based on value
 */
function formatPrice(price) {
    if (price === undefined || price === null) return '$0.00';
    
    // For very small prices like Shiba Inu
    if (price < 0.001) {
        return '$' + price.toFixed(8);
    }
    // For small prices like Dogecoin
    else if (price < 1) {
        return '$' + price.toFixed(4);
    }
    // For regular prices
    else if (price < 10000) {
        return '$' + price.toFixed(2);
    }
    // For larger prices, use comma separator
    else {
        return '$' + price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

/**
 * Format percentage change
 */
function formatPercentage(value) {
    if (value === undefined || value === null) return '0.00%';
    
    const sign = value >= 0 ? '+' : '';
    return sign + value.toFixed(2) + '%';
}

/**
 * Update the ticker UI with the latest data
 */
function updateTickerUI(cryptoData) {
    if (!cryptoData || !Array.isArray(cryptoData) || cryptoData.length === 0) {
        handleTickerError();
        return;
    }
    
    // Find all ticker container elements
    const tickerContainers = document.querySelectorAll('.ticker-container');
    
    tickerContainers.forEach(container => {
        // Clear existing content
        container.innerHTML = '';
        
        // Generate new ticker items
        cryptoData.forEach(crypto => {
            // Create a link wrapper for the ticker item - always use CoinMarketCap URLs
            const tickerLink = document.createElement('a');
            
            // Use coinMarketCapUrl if available, or generate it based on either slug or symbol
            let cmcUrl;
            if (crypto.coinMarketCapUrl) {
                cmcUrl = crypto.coinMarketCapUrl;
            } else if (crypto.slug) {
                cmcUrl = `https://coinmarketcap.com/currencies/${crypto.slug}/`;
            } else if (crypto.symbol) {
                // Convert common symbols to their known CoinMarketCap slugs
                const slugMap = {
                    'BTC': 'bitcoin',
                    'ETH': 'ethereum',
                    'SOL': 'solana',
                    'BNB': 'bnb',
                    'XRP': 'xrp',
                    'ADA': 'cardano',
                    'DOGE': 'dogecoin',
                    'AVAX': 'avalanche',
                    'MATIC': 'polygon',
                    'DOT': 'polkadot',
                    'LINK': 'chainlink',
                    'UNI': 'uniswap',
                    'SHIB': 'shiba-inu',
                    'LTC': 'litecoin'
                };
                
                const symbol = crypto.symbol.toUpperCase();
                const slug = slugMap[symbol] || symbol.toLowerCase();
                cmcUrl = `https://coinmarketcap.com/currencies/${slug}/`;
            } else {
                // Fallback - use the name if available, otherwise just link to CoinMarketCap homepage
                const slug = crypto.name ? crypto.name.toLowerCase().replace(/\s+/g, '-') : '';
                cmcUrl = slug ? `https://coinmarketcap.com/currencies/${slug}/` : 'https://coinmarketcap.com/';
            }
            
            tickerLink.href = cmcUrl;
            tickerLink.target = '_blank';
            tickerLink.rel = 'noopener noreferrer';
            tickerLink.className = 'ticker-item';
            tickerLink.title = `View ${crypto.name} on CoinMarketCap`;
            
            // Create ticker content elements
            const symbolElement = document.createElement('span');
            symbolElement.className = 'ticker-symbol';
            
            // If we have an image, display it with the symbol
            if (crypto.image) {
                const imgElement = document.createElement('img');
                imgElement.src = crypto.image;
                imgElement.alt = crypto.name;
                imgElement.className = 'w-5 h-5 inline-block rounded-full mr-2';
                symbolElement.appendChild(imgElement);
            }
            
            symbolElement.appendChild(document.createTextNode(`${crypto.symbol} ${crypto.name}`));
            
            const priceElement = document.createElement('span');
            priceElement.className = 'ticker-price';
            priceElement.textContent = crypto.priceFormatted;
            
            const changeElement = document.createElement('span');
            changeElement.className = `ticker-change ${crypto.isPositive ? 'positive' : 'negative'}`;
            changeElement.textContent = crypto.change24hFormatted;
            
            // Add a small external link icon indicating this links to CoinMarketCap
            const linkIcon = document.createElement('span');
            linkIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block w-3 h-3 ml-1 opacity-50"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
            
            // Add the elements to the link
            tickerLink.appendChild(symbolElement);
            tickerLink.appendChild(priceElement);
            tickerLink.appendChild(changeElement);
            tickerLink.appendChild(linkIcon);
            
            // Add the ticker item to the container
            container.appendChild(tickerLink);
        });
        
        // Apply animation
        container.classList.add('ticker-animation');
    });
}

/**
 * Handle error in ticker loading
 */
function handleTickerError() {
    console.log('Using backup ticker data due to API error');
    
    // Sample backup data to ensure UI always looks good
    const backupData = [
        { 
            symbol: 'BTC', 
            name: 'Bitcoin', 
            priceFormatted: '$71,245.38', 
            change24hFormatted: '+4.23%', 
            isPositive: true,
            slug: 'bitcoin'
        },
        { 
            symbol: 'ETH', 
            name: 'Ethereum', 
            priceFormatted: '$3,187.29', 
            change24hFormatted: '+6.12%', 
            isPositive: true,
            slug: 'ethereum'
        },
        { 
            symbol: 'BNB', 
            name: 'Binance Coin', 
            priceFormatted: '$591.21', 
            change24hFormatted: '+3.15%', 
            isPositive: true,
            slug: 'bnb'
        },
        { 
            symbol: 'SOL', 
            name: 'Solana', 
            priceFormatted: '$169.45', 
            change24hFormatted: '+9.24%', 
            isPositive: true,
            slug: 'solana'
        },
        { 
            symbol: 'XRP', 
            name: 'Ripple', 
            priceFormatted: '$0.47', 
            change24hFormatted: '-7.14%', 
            isPositive: false,
            slug: 'xrp'
        },
        { 
            symbol: 'ADA', 
            name: 'Cardano', 
            priceFormatted: '$0.51', 
            change24hFormatted: '+2.00%', 
            isPositive: true,
            slug: 'cardano'
        },
        { 
            symbol: 'DOGE', 
            name: 'Dogecoin', 
            priceFormatted: '$0.151', 
            change24hFormatted: '-5.03%', 
            isPositive: false,
            slug: 'dogecoin'
        },
        { 
            symbol: 'AVAX', 
            name: 'Avalanche', 
            priceFormatted: '$41.50', 
            change24hFormatted: '+10.61%', 
            isPositive: true,
            slug: 'avalanche'
        }
    ];
    
    updateTickerUI(backupData);
}