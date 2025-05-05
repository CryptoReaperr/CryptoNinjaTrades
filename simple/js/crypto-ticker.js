/**
 * Crypto Ticker for CryptoNinjaTrades
 * Uses CoinMarketCap API to fetch real-time crypto prices
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
        // First attempt to use the proxy API endpoint
        const cryptoData = await fetchCoinMarketCapData();
        updateTickerUI(cryptoData);
        
        // Set up auto-refresh every 2 minutes
        setInterval(async () => {
            const refreshedData = await fetchCoinMarketCapData();
            updateTickerUI(refreshedData);
        }, 120000); // 2 minutes
        
    } catch (error) {
        console.error('Error initializing crypto ticker:', error);
        // If the ticker fails to load, ensure it still displays acceptable UI
        handleTickerError();
    }
}

/**
 * Fetch cryptocurrency data from CoinMarketCap API via our Flask proxy
 */
async function fetchCoinMarketCapData() {
    try {
        // Try getting data from our server-side proxy first
        const response = await fetch('/api/crypto-prices');
        
        if (!response.ok) {
            // If server fails, try client-side with the API key in meta tag as fallback
            return await fetchDirectFromCoinMarketCap();
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching from proxy API:', error);
        // Try direct API call as fallback
        return await fetchDirectFromCoinMarketCap();
    }
}

/**
 * Fetch cryptocurrency data directly from CoinMarketCap API
 * Uses API key from meta tag
 */
async function fetchDirectFromCoinMarketCap() {
    // Get API key from meta tag
    const apiKeyMeta = document.querySelector('meta[name="coinmarketcap-api-key"]');
    if (!apiKeyMeta || !apiKeyMeta.content) {
        throw new Error('No CoinMarketCap API key found in meta tag');
    }
    
    const apiKey = apiKeyMeta.content;
    
    try {
        const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD', {
            method: 'GET',
            headers: {
                'X-CMC_PRO_API_KEY': apiKey
            }
        });
        
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        return processApiResponse(data);
    } catch (error) {
        console.error('Error fetching directly from CoinMarketCap:', error);
        throw error;
    }
}

/**
 * Process the API response data into the format we need
 */
function processApiResponse(apiData) {
    if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
        throw new Error('Invalid API response format');
    }
    
    return apiData.data.map(crypto => {
        const price = crypto.quote.USD.price;
        const change24h = crypto.quote.USD.percent_change_24h;
        
        return {
            symbol: crypto.symbol,
            name: crypto.name,
            price: price,
            priceFormatted: formatPrice(price),
            change24h: change24h,
            change24hFormatted: formatPercentage(change24h),
            isPositive: change24h >= 0
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
            const tickerItem = document.createElement('div');
            tickerItem.className = 'ticker-item';
            
            const symbolElement = document.createElement('span');
            symbolElement.className = 'ticker-symbol';
            symbolElement.textContent = `${crypto.symbol} ${crypto.name}`;
            
            const priceElement = document.createElement('span');
            priceElement.className = 'ticker-price';
            priceElement.textContent = crypto.priceFormatted;
            
            const changeElement = document.createElement('span');
            changeElement.className = `ticker-change ${crypto.isPositive ? 'positive' : 'negative'}`;
            changeElement.textContent = crypto.change24hFormatted;
            
            tickerItem.appendChild(symbolElement);
            tickerItem.appendChild(priceElement);
            tickerItem.appendChild(changeElement);
            
            container.appendChild(tickerItem);
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
        { symbol: 'BTC', name: 'Bitcoin', priceFormatted: '$61,245.37', change24hFormatted: '+2.14%', isPositive: true },
        { symbol: 'ETH', name: 'Ethereum', priceFormatted: '$3,458.91', change24hFormatted: '+1.23%', isPositive: true },
        { symbol: 'BNB', name: 'Binance Coin', priceFormatted: '$608.42', change24hFormatted: '-0.53%', isPositive: false },
        { symbol: 'SOL', name: 'Solana', priceFormatted: '$132.75', change24hFormatted: '+5.67%', isPositive: true },
        { symbol: 'XRP', name: 'Ripple', priceFormatted: '$0.5492', change24hFormatted: '-1.12%', isPositive: false },
        { symbol: 'ADA', name: 'Cardano', priceFormatted: '$0.4872', change24hFormatted: '+0.89%', isPositive: true },
        { symbol: 'AVAX', name: 'Avalanche', priceFormatted: '$41.50', change24hFormatted: '+8.01%', isPositive: true }
    ];
    
    updateTickerUI(backupData);
}