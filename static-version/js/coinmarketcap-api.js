/**
 * CoinMarketCap API integration for CryptoNinjaTrades
 * Uses the CoinMarketCap API to fetch cryptocurrency data
 */

/**
 * Fetch cryptocurrency data from CoinMarketCap API
 * This is a server-side function that will be called from the backend
 * For the static version, we'll use the pregenerated data
 */
async function fetchCoinMarketCapData() {
    try {
        // For a static site, this would typically be handled server-side
        // We'll simulate the response structure here for demonstration
        
        // In a real implementation with a backend, we would use:
        // const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
        //     headers: {
        //         'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        //         'Accept': 'application/json'
        //     }
        // });
        
        // For our static site, we'll return a consistent format that matches what we'd expect
        return {
            data: [
                {
                    id: 1,
                    name: "Bitcoin",
                    symbol: "BTC",
                    slug: "bitcoin",
                    quote: {
                        USD: {
                            price: 71245.38,
                            percent_change_24h: 4.23
                        }
                    }
                },
                {
                    id: 1027,
                    name: "Ethereum",
                    symbol: "ETH",
                    slug: "ethereum",
                    quote: {
                        USD: {
                            price: 3187.29,
                            percent_change_24h: 6.12
                        }
                    }
                },
                {
                    id: 5426,
                    name: "Solana",
                    symbol: "SOL",
                    slug: "solana",
                    quote: {
                        USD: {
                            price: 169.45,
                            percent_change_24h: 9.24
                        }
                    }
                },
                {
                    id: 1839,
                    name: "Binance Coin",
                    symbol: "BNB",
                    slug: "bnb",
                    quote: {
                        USD: {
                            price: 591.21,
                            percent_change_24h: 3.15
                        }
                    }
                },
                {
                    id: 52,
                    name: "XRP",
                    symbol: "XRP",
                    slug: "xrp",
                    quote: {
                        USD: {
                            price: 0.47,
                            percent_change_24h: -7.14
                        }
                    }
                },
                {
                    id: 2010,
                    name: "Cardano",
                    symbol: "ADA",
                    slug: "cardano",
                    quote: {
                        USD: {
                            price: 0.51,
                            percent_change_24h: 2.00
                        }
                    }
                },
                {
                    id: 74,
                    name: "Dogecoin",
                    symbol: "DOGE",
                    slug: "dogecoin",
                    quote: {
                        USD: {
                            price: 0.151,
                            percent_change_24h: -5.03
                        }
                    }
                },
                {
                    id: 5805,
                    name: "Avalanche",
                    symbol: "AVAX",
                    slug: "avalanche",
                    quote: {
                        USD: {
                            price: 41.50,
                            percent_change_24h: 10.61
                        }
                    }
                }
            ]
        };
    } catch (error) {
        console.error('Error fetching CoinMarketCap data:', error);
        throw error;
    }
}

/**
 * Process CoinMarketCap API response into our format
 */
function processCoinMarketCapResponse(apiData) {
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
            isPositive: change24h >= 0,
            id: crypto.id,
            slug: crypto.slug,
            coinMarketCapUrl: `https://coinmarketcap.com/currencies/${crypto.slug}/`
        };
    });
}

/**
 * Format price with appropriate precision
 * Reused from crypto-ticker.js for consistency
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
 * Reused from crypto-ticker.js for consistency
 */
function formatPercentage(value) {
    if (value === undefined || value === null) return '0.00%';
    
    const sign = value >= 0 ? '+' : '';
    return sign + value.toFixed(2) + '%';
}