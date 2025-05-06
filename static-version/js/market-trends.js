/**
 * Market Trends functionality for CryptoNinjaTrades
 * Uses CoinGecko API to fetch real-time cryptocurrency market data
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize market trends data
    initializeMarketTrends();
});

/**
 * Initialize market trends by fetching latest data
 */
async function initializeMarketTrends() {
    try {
        // Fetch data from CoinGecko API
        const cryptoData = await fetchCryptoMarketData();
        
        // Set default crypto (Bitcoin)
        updateTrendsUI(cryptoData, 'BTC');
        
        // Configure crypto selector
        setupCryptoSelector(cryptoData);
        
    } catch (error) {
        console.error('Error initializing market trends:', error);
    }
}

/**
 * Fetch cryptocurrency market data from CoinGecko API (free, no API key required)
 */
async function fetchCryptoMarketData() {
    try {
        // Using CoinGecko's free API to get top 20 cryptocurrencies with market data
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=1h,24h,7d');
        
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        return processCryptoMarketData(data);
    } catch (error) {
        console.error('Error fetching from CoinGecko API:', error);
        throw error;
    }
}

/**
 * Process the CoinGecko API response data into the format we need
 */
function processCryptoMarketData(apiData) {
    if (!apiData || !Array.isArray(apiData)) {
        throw new Error('Invalid API response format');
    }
    
    // Map to our internal format
    return apiData.map(crypto => {
        // Create a lookup object for easy access
        const result = {
            id: crypto.id,
            symbol: crypto.symbol.toUpperCase(),
            name: crypto.name,
            image: crypto.image,
            currentPrice: crypto.current_price,
            priceFormatted: formatPrice(crypto.current_price),
            marketCap: crypto.market_cap,
            marketCapRank: crypto.market_cap_rank,
            high24h: crypto.high_24h,
            low24h: crypto.low_24h,
            priceChange24h: crypto.price_change_24h,
            priceChangePercentage24h: crypto.price_change_percentage_24h_in_currency,
            priceChangePercentage7d: crypto.price_change_percentage_7d_in_currency,
            priceChangePercentage1h: crypto.price_change_percentage_1h_in_currency,
            sparklineData: crypto.sparkline_in_7d?.price || [],
            lastUpdated: crypto.last_updated,
            isPositive24h: crypto.price_change_percentage_24h_in_currency >= 0
        };
        
        // Add formatted values
        result.priceChange24hFormatted = formatPercentage(result.priceChangePercentage24h);
        result.high24hFormatted = formatPrice(result.high24h);
        result.low24hFormatted = formatPrice(result.low24h);
        
        return result;
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
 * Set up cryptocurrency selector with available options
 */
function setupCryptoSelector(cryptoData) {
    const cryptoSelect = document.getElementById('crypto-select');
    if (!cryptoSelect) return;
    
    // Clear existing options
    cryptoSelect.innerHTML = '';
    
    // Add options for each cryptocurrency
    cryptoData.forEach(crypto => {
        const option = document.createElement('option');
        option.value = crypto.symbol;
        option.textContent = `${crypto.name} (${crypto.symbol})`;
        cryptoSelect.appendChild(option);
    });
    
    // Set default selection
    cryptoSelect.value = 'BTC';
    
    // Add change event handler
    cryptoSelect.addEventListener('change', function() {
        const selectedCrypto = this.value;
        updateTrendsUI(cryptoData, selectedCrypto);
    });
}

/**
 * Update the trends UI with data for the selected cryptocurrency
 */
function updateTrendsUI(cryptoData, selectedSymbol) {
    // Find the selected cryptocurrency
    const selectedCrypto = cryptoData.find(crypto => crypto.symbol === selectedSymbol);
    if (!selectedCrypto) return;
    
    // Update chart title
    const chartTitle = document.getElementById('chart-title');
    if (chartTitle) {
        chartTitle.textContent = `${selectedCrypto.name} (${selectedCrypto.symbol}) Price Movement`;
    }
    
    // Update current price display
    const currentPrice = document.getElementById('current-price');
    if (currentPrice) {
        currentPrice.textContent = selectedCrypto.priceFormatted;
    }
    
    // Update price change indicator
    const priceChange = document.getElementById('price-change');
    if (priceChange) {
        priceChange.className = selectedCrypto.isPositive24h ? 'trend-up' : 'trend-down';
        const icon = selectedCrypto.isPositive24h ? 'trending-up' : 'trending-down';
        priceChange.innerHTML = `<i data-feather="${icon}" class="inline h-5 w-5 mr-1"></i>${selectedCrypto.priceChange24hFormatted}`;
        // Re-initialize icons
        if (window.feather) {
            feather.replace();
        }
    }
    
    // Update statistics
    updateStatElement('avg-price', selectedCrypto.priceFormatted);
    updateStatElement('min-price', selectedCrypto.low24hFormatted);
    updateStatElement('max-price', selectedCrypto.high24hFormatted);
    
    // Update volume
    const volume = (selectedCrypto.totalVolume || 0).toLocaleString();
    updateStatElement('volume', '$' + volume);
    
    // Update price chart
    updatePriceChart(selectedCrypto);
}

/**
 * Update a statistic element with new value
 */
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

/**
 * Update price chart with data for the selected cryptocurrency
 */
function updatePriceChart(crypto) {
    // Get the chart canvas
    const ctx = document.getElementById('price-chart');
    if (!ctx) return;
    
    // Get existing chart instance if it exists
    let priceChart = Chart.getChart(ctx);
    
    // Process sparkline data
    const sparklineData = crypto.sparklineData || [];
    
    // Generate labels for the sparkline data (last 7 days, daily intervals)
    const labels = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(formatDate(date));
    }
    
    // Sample the sparkline data to daily intervals
    const dailyData = sampleDataDaily(sparklineData);
    
    // Create gradient for chart
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(55, 95, 124, 0.6)');
    gradient.addColorStop(1, 'rgba(55, 95, 124, 0.0)');
    
    // Prepare new data
    const data = {
        labels: labels,
        datasets: [{
            label: `${crypto.symbol} Price (USD)`,
            data: dailyData,
            borderColor: '#375F7C',
            borderWidth: 3,
            pointBackgroundColor: '#567890',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.3,
            fill: true,
            backgroundColor: gradient
        }]
    };
    
    // If chart exists, update it
    if (priceChart) {
        priceChart.data = data;
        priceChart.update();
    } else {
        // Create new chart
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#1A1A1A',
                        titleColor: '#E0E0E0',
                        bodyColor: '#E0E0E0',
                        borderColor: '#375F7C',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(74, 99, 120, 0.1)',
                            borderColor: 'rgba(74, 99, 120, 0.2)'
                        },
                        ticks: {
                            color: '#94A3B8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(74, 99, 120, 0.1)',
                            borderColor: 'rgba(74, 99, 120, 0.2)'
                        },
                        ticks: {
                            color: '#94A3B8',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        };
        
        priceChart = new Chart(ctx, config);
    }
}

/**
 * Format date as MMM DD (e.g., May 01)
 */
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    return `${months[date.getMonth()]} ${day}`;
}

/**
 * Sample hourly sparkline data to daily points (for 7 days)
 */
function sampleDataDaily(sparklineData) {
    if (!sparklineData || sparklineData.length < 24) {
        // Return default data if sparkline data is insufficient
        return [68982, 68112, 69455, 70321, 69874, 71012, 71245];
    }
    
    // For simplicity, get 7 evenly spaced data points from the sparkline
    const result = [];
    const step = Math.floor(sparklineData.length / 7);
    
    for (let i = 0; i < 7; i++) {
        const idx = Math.min(i * step, sparklineData.length - 1);
        result.push(sparklineData[idx]);
    }
    
    return result;
}