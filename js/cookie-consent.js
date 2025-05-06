/**
 * Cookie Consent Manager for Crypto Ninja Trades
 * Professional implementation following GDPR requirements
 */

class CookieConsentManager {
    constructor() {
        this.consentKey = 'crypto_ninja_cookie_consent';
        this.consentSettings = {
            necessary: true,     // Always required, cannot be turned off
            preferences: false,  // Site preferences/settings cookies
            statistics: false,   // Analytics/statistics cookies
            marketing: false     // Marketing/advertising cookies
        };
        this.hasInitialConsent = false;
    }

    /**
     * Initialize the cookie consent manager
     */
    init() {
        console.log('CookieConsentManager: init called');
        // Check if consent has already been given
        this.loadConsent();
        
        // If no consent found, show the banner
        if (!this.hasInitialConsent) {
            console.log('CookieConsentManager: no initial consent, showing banner');
            this.injectBanner();
        } else {
            console.log('CookieConsentManager: consent already given, not showing banner');
        }
    }

    /**
     * Load saved consent from cookie/localStorage
     */
    loadConsent() {
        try {
            const savedConsent = localStorage.getItem(this.consentKey);
            
            if (savedConsent) {
                const consentData = JSON.parse(savedConsent);
                this.hasInitialConsent = true;
                
                // Update consent settings with saved values
                if (consentData.preferences !== undefined) {
                    this.consentSettings.preferences = consentData.preferences;
                }
                
                if (consentData.statistics !== undefined) {
                    this.consentSettings.statistics = consentData.statistics;
                }
                
                if (consentData.marketing !== undefined) {
                    this.consentSettings.marketing = consentData.marketing;
                }
            }
        } catch (error) {
            console.error('Error loading consent settings:', error);
        }
    }

    /**
     * Save consent to localStorage
     */
    saveConsent() {
        try {
            localStorage.setItem(this.consentKey, JSON.stringify(this.consentSettings));
            this.hasInitialConsent = true;
        } catch (error) {
            console.error('Error saving consent settings:', error);
        }
    }

    /**
     * Check if user has given any form of consent
     */
    hasConsent() {
        return this.hasInitialConsent;
    }

    /**
     * Update specific consent setting
     */
    updateConsent(category, value) {
        if (category === 'necessary') {
            // Cannot change necessary cookies consent
            return;
        }
        
        if (this.consentSettings[category] !== undefined) {
            this.consentSettings[category] = value;
        }
    }

    /**
     * Accept all cookies
     */
    acceptAll() {
        this.consentSettings.preferences = true;
        this.consentSettings.statistics = true;
        this.consentSettings.marketing = true;
        this.saveConsent();
        this.hideBanner();
    }

    /**
     * Refuse all except necessary cookies
     */
    refuseAll() {
        this.consentSettings.preferences = false;
        this.consentSettings.statistics = false;
        this.consentSettings.marketing = false;
        this.saveConsent();
        this.hideBanner();
    }

    /**
     * Save current settings (from modal)
     */
    saveSettings() {
        // Get values from toggles in the modal
        const preferencesToggle = document.getElementById('cookie-preferences-toggle');
        const statisticsToggle = document.getElementById('cookie-statistics-toggle');
        const marketingToggle = document.getElementById('cookie-marketing-toggle');
        
        if (preferencesToggle) {
            this.consentSettings.preferences = preferencesToggle.checked;
        }
        
        if (statisticsToggle) {
            this.consentSettings.statistics = statisticsToggle.checked;
        }
        
        if (marketingToggle) {
            this.consentSettings.marketing = marketingToggle.checked;
        }
        
        this.saveConsent();
        this.hideSettingsModal();
        this.hideBanner();
    }

    /**
     * Create and inject the cookie consent banner
     */
    injectBanner() {
        console.log('CookieConsentManager: injectBanner called');
        // Check if a banner already exists
        if (document.querySelector('.cookie-consent')) {
            console.log('CookieConsentManager: banner already exists, not creating a new one');
            return;
        }
        
        try {
            // Create banner element
            const bannerElement = document.createElement('div');
            bannerElement.className = 'cookie-consent';
            
            // Set banner content with privacy policy link
            bannerElement.innerHTML = `
                <div class="cookie-consent-text">
                    <h3>Cookie Consent</h3>
                    <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.</p>
                    <button class="cookie-settings">Customize preferences</button>
                </div>
                <div class="cookie-consent-actions">
                    <button class="cookie-refuse">Refuse All</button>
                    <button class="cookie-accept">Accept All</button>
                </div>
            `;
            
            // Add event listeners to buttons
            const acceptButton = bannerElement.querySelector('.cookie-accept');
            const refuseButton = bannerElement.querySelector('.cookie-refuse');
            const settingsButton = bannerElement.querySelector('.cookie-settings');
            
            if (acceptButton) {
                acceptButton.addEventListener('click', () => this.acceptAll());
            } else {
                console.error('CookieConsentManager: Accept button not found in the banner');
            }
            
            if (refuseButton) {
                refuseButton.addEventListener('click', () => this.refuseAll());
            } else {
                console.error('CookieConsentManager: Refuse button not found in the banner');
            }
            
            if (settingsButton) {
                settingsButton.addEventListener('click', () => this.showSettingsModal());
            } else {
                console.error('CookieConsentManager: Settings button not found in the banner');
            }
            
            // Inject banner into the DOM
            if (document.body) {
                document.body.appendChild(bannerElement);
                console.log('CookieConsentManager: Banner injected into document body');
                
                // Ensure banner is visible (fix any CSS issues)
                setTimeout(() => {
                    bannerElement.style.opacity = '1';
                    bannerElement.style.transform = 'translateY(0)';
                }, 100);
                
                // Also inject the settings modal (hidden by default)
                this.injectSettingsModal();
            } else {
                console.error('CookieConsentManager: document.body not available for banner injection');
            }
        } catch (error) {
            console.error('CookieConsentManager: Error injecting banner:', error);
        }
    }

    /**
     * Hide the cookie consent banner
     */
    hideBanner() {
        const banner = document.querySelector('.cookie-consent');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    /**
     * Create and inject the cookie settings modal
     */
    injectSettingsModal() {
        // Check if a modal already exists
        if (document.querySelector('.cookie-modal')) {
            return;
        }
        
        // Create modal element
        const modalElement = document.createElement('div');
        modalElement.className = 'cookie-modal';
        
        // Set modal content
        modalElement.innerHTML = `
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h3>Cookie Preferences</h3>
                    <button class="cookie-modal-close">&times;</button>
                </div>
                <div class="cookie-modal-body">
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Necessary Cookies</h4>
                            <label class="cookie-toggle disabled">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p>These cookies are essential for the website to function properly. They cannot be disabled.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Preference Cookies</h4>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="cookie-preferences-toggle" ${this.consentSettings.preferences ? 'checked' : ''}>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p>These cookies allow the website to remember choices you make and provide enhanced functionality and personalization.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Statistics Cookies</h4>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="cookie-statistics-toggle" ${this.consentSettings.statistics ? 'checked' : ''}>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p>These cookies collect information about how you use our website, which pages you visited and which links you clicked on. All data is anonymized and cannot be used to identify you.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Marketing Cookies</h4>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="cookie-marketing-toggle" ${this.consentSettings.marketing ? 'checked' : ''}>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        <p>These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</p>
                    </div>
                </div>
                <div class="cookie-modal-actions">
                    <button class="cookie-accept-all">Accept All</button>
                    <button class="cookie-save-prefs">Save Preferences</button>
                </div>
            </div>
        `;
        
        // Add event listeners to buttons
        const closeButton = modalElement.querySelector('.cookie-modal-close');
        const acceptAllButton = modalElement.querySelector('.cookie-accept-all');
        const savePrefsButton = modalElement.querySelector('.cookie-save-prefs');
        
        closeButton.addEventListener('click', () => this.hideSettingsModal());
        acceptAllButton.addEventListener('click', () => this.acceptAll());
        savePrefsButton.addEventListener('click', () => this.saveSettings());
        
        // Close modal if clicking outside the content
        modalElement.addEventListener('click', (event) => {
            if (event.target === modalElement) {
                this.hideSettingsModal();
            }
        });
        
        // Inject modal into the DOM
        document.body.appendChild(modalElement);
    }

    /**
     * Show the cookie settings modal
     */
    showSettingsModal() {
        const modal = document.querySelector('.cookie-modal');
        if (modal) {
            modal.classList.add('visible');
        } else {
            this.injectSettingsModal();
            setTimeout(() => {
                document.querySelector('.cookie-modal').classList.add('visible');
            }, 50);
        }
    }

    /**
     * Hide the cookie settings modal
     */
    hideSettingsModal() {
        const modal = document.querySelector('.cookie-modal');
        if (modal) {
            modal.classList.remove('visible');
        }
    }
}

// Initialize the cookie consent manager when the DOM is fully loaded
// Use a more robust initialization that waits for both DOMContentLoaded and window.load
let cookieConsentInitialized = false;

function initCookieConsent() {
    if (cookieConsentInitialized) return;
    cookieConsentInitialized = true;
    
    console.log('Initializing cookie consent manager');
    const cookieConsent = new CookieConsentManager();
    cookieConsent.init();
}

// Try to initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCookieConsent, 500); // Delay slightly to ensure all scripts are loaded
});

// Fallback - if DOMContentLoaded already fired, initialize on window load
window.addEventListener('load', function() {
    setTimeout(initCookieConsent, 1000); // Longer delay on window.load as a fallback
});

// Final fallback - force init after 2 seconds regardless
setTimeout(initCookieConsent, 2000);
