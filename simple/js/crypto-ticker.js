/**
 * Cryptocurrency Ticker
 * Uses CoinMarketCap API to fetch real-time crypto prices
 */

document.addEventListener('DOMContentLoaded', function() {
    loadCryptoPrices();
});

// Global variable to track if we're using fallback data
let usingFallbackData = false;

async function loadCryptoPrices() {
    const tickerContainer = document.getElementById('ticker-container');
    if (!tickerContainer) return;
    
    try {
        // First try the direct CoinMarketCap API
        await fetchCoinMarketCapData(tickerContainer);
    } catch (error) {
        console.error('Error fetching from CoinMarketCap API:', error);
        // Fall back to our server API endpoint
        try {
            await fetchFromServerAPI(tickerContainer);
        } catch (serverError) {
            console.error('Error fetching from server API:', serverError);
            // If all fails, use the hardcoded data (which should already be in the HTML)
            console.log('Using existing hardcoded ticker data');
            usingFallbackData = true;
        }
    }
    
    // Start the ticker animation
    animateTicker();
}

async function fetchCoinMarketCapData(container) {
    // CoinMarketCap API endpoint for latest listings
    const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
    
    // Parameters for the API request
    const params = {
        start: '1',
        limit: '10',
        convert: 'USD',
        sort: 'market_cap',
        sort_dir: 'desc'
    };
    
    // Get API Key from environment (added in meta tag)
    const apiKeyMeta = document.querySelector('meta[name="coinmarketcap-api-key"]');
    if (!apiKeyMeta || !apiKeyMeta.content) {
        throw new Error('CoinMarketCap API key not found');
    }
    
    const apiKey = apiKeyMeta.content;
    
    // Create URL with parameters
    const url = new URL(apiUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    // Fetch data from CoinMarketCap
    const proxyUrl = '/api/crypto-proxy';
    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: url.toString(),
            apiKey: apiKey
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add each cryptocurrency to the ticker
    data.data.forEach(crypto => {
        const percentChange = crypto.quote.USD.percent_change_24h;
        const isPositive = percentChange >= 0;
        
        const tickerItem = document.createElement('div');
        tickerItem.className = 'ticker-item';
        tickerItem.innerHTML = `
            <span class="ticker-symbol">${crypto.symbol} ${crypto.name}</span>
            <span class="ticker-price">$${crypto.quote.USD.price.toFixed(2)}</span>
            <span class="ticker-change ${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : ''}${percentChange.toFixed(2)}%
            </span>
        `;
        
        container.appendChild(tickerItem);
    });
}

async function fetchFromServerAPI(container) {
    // Fetch from our server's API endpoint instead
    const response = await fetch('/api/crypto-prices');
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Clear existing content
    container.innerHTML = '';
    
    // Add each cryptocurrency to the ticker
    data.forEach(crypto => {
        const percentChange = crypto.percent_change_24h;
        const isPositive = percentChange >= 0;
        
        const tickerItem = document.createElement('div');
        tickerItem.className = 'ticker-item';
        tickerItem.innerHTML = `
            <span class="ticker-symbol">${crypto.symbol} ${crypto.name}</span>
            <span class="ticker-price">$${parseFloat(crypto.price).toFixed(2)}</span>
            <span class="ticker-change ${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : ''}${percentChange.toFixed(2)}%
            </span>
        `;
        
        container.appendChild(tickerItem);
    });
}

function animateTicker() {
    const tickerContainer = document.getElementById('ticker-container');
    if (!tickerContainer) return;
    
    // Clone the first few items and append them to the end to create a seamless loop
    if (!usingFallbackData) {
        const items = tickerContainer.querySelectorAll('.ticker-item');
        const cloneCount = Math.min(items.length, 4);
        
        for (let i = 0; i < cloneCount; i++) {
            const clone = items[i].cloneNode(true);
            tickerContainer.appendChild(clone);
        }
    }
    
    // Add the animation class to start the ticker
    tickerContainer.classList.add('ticker-animation');
    
    // Optional: reload data periodically if not fallback
    if (!usingFallbackData) {
        setInterval(() => {
            loadCryptoPrices();
        }, 300000); // Refresh every 5 minutes
    }
}
