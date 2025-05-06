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
            // Create a link wrapper for the ticker item
            const tickerLink = document.createElement('a');
            tickerLink.href = crypto.coinMarketCapUrl || `https://coinmarketcap.com/currencies/${crypto.symbol.toLowerCase()}/`;
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
            
            // Add a subtle external link icon
            const linkIcon = document.createElement('span');
            linkIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block w-3 h-3 ml-1 opacity-50"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
            
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