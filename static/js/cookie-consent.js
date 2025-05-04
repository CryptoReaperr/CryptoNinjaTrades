/**
 * Cookie Consent Manager for Crypto Ninja Trades
 * Professional implementation following GDPR requirements
 */

class CookieConsentManager {
    constructor() {
        this.consentKey = 'cryptoNinjaTrades_cookieConsent';
        this.consentExpiry = 365; // days
        this.defaultConsent = {
            necessary: true,     // Always required
            preferences: false,  // UI preferences
            analytics: false,    // Analytics and statistics
            marketing: false     // Marketing and advertising
        };
        
        this.initialized = false;
        this.settings = {};
        
        // Initialize on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => this.init());
    }
    
    /**
     * Initialize the cookie consent manager
     */
    init() {
        if (this.initialized) return;
        this.initialized = true;
        
        console.log('Initializing cookie consent manager');
        
        // Load saved consent
        this.loadConsent();
        
        // Inject the cookie banner if no consent has been given yet
        if (!this.hasConsent()) {
            this.injectBanner();
        }
        
        // Add event listener for theme changes
        document.addEventListener('themeChanged', (e) => {
            // Update banner and modal themes if they exist
            const container = document.querySelector('.cookie-consent-container');
            const modal = document.querySelector('.cookie-settings-modal');
            
            if (container) {
                container.classList.toggle('light', e.detail.theme === 'light');
                container.classList.toggle('dark', e.detail.theme === 'dark');
            }
            
            if (modal) {
                modal.classList.toggle('light', e.detail.theme === 'light');
                modal.classList.toggle('dark', e.detail.theme === 'dark');
            }
        });
    }
    
    /**
     * Load saved consent from cookie/localStorage
     */
    loadConsent() {
        try {
            const savedConsent = localStorage.getItem(this.consentKey);
            if (savedConsent) {
                this.settings = JSON.parse(savedConsent);
                console.log('Loaded saved consent:', this.settings);
                return;
            }
        } catch (e) {
            console.error('Error loading saved consent:', e);
        }
        
        // Use default settings if nothing is saved
        this.settings = { ...this.defaultConsent };
    }
    
    /**
     * Save consent to localStorage
     */
    saveConsent() {
        try {
            localStorage.setItem(this.consentKey, JSON.stringify(this.settings));
            console.log('Saved consent settings:', this.settings);
            
            // Set expiry by adding a timestamp
            const expires = new Date();
            expires.setDate(expires.getDate() + this.consentExpiry);
            localStorage.setItem(`${this.consentKey}_expiry`, expires.toISOString());
            
            // Dispatch event for other scripts
            const event = new CustomEvent('cookieConsentUpdated', { detail: this.settings });
            document.dispatchEvent(event);
            
        } catch (e) {
            console.error('Error saving consent:', e);
        }
    }
    
    /**
     * Check if user has given any form of consent
     */
    hasConsent() {
        // Check if consent exists and isn't expired
        try {
            const savedConsent = localStorage.getItem(this.consentKey);
            const expiryStr = localStorage.getItem(`${this.consentKey}_expiry`);
            
            if (!savedConsent || !expiryStr) return false;
            
            // Check if consent has expired
            const expiry = new Date(expiryStr);
            const now = new Date();
            
            if (now > expiry) {
                // Consent expired, clear it
                localStorage.removeItem(this.consentKey);
                localStorage.removeItem(`${this.consentKey}_expiry`);
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('Error checking consent status:', e);
            return false;
        }
    }
    
    /**
     * Update specific consent setting
     */
    updateConsent(category, value) {
        // Necessary cookies can't be disabled
        if (category === 'necessary') return;
        
        this.settings[category] = value;
    }
    
    /**
     * Accept all cookies
     */
    acceptAll() {
        // Set all to true
        this.settings = {
            necessary: true,
            preferences: true,
            analytics: true,
            marketing: true
        };
        
        this.saveConsent();
        this.hideBanner();
    }
    
    /**
     * Refuse all except necessary cookies
     */
    refuseAll() {
        // Reset to defaults (only necessary)
        this.settings = { ...this.defaultConsent };
        this.saveConsent();
        this.hideBanner();
    }
    
    /**
     * Save current settings (from modal)
     */
    saveSettings() {
        this.saveConsent();
        this.hideSettingsModal();
        this.hideBanner();
    }
    
    /**
     * Create and inject the cookie consent banner
     */
    injectBanner() {
        // Get current theme
        const isLightTheme = document.documentElement.classList.contains('light');
        const themeClass = isLightTheme ? 'light' : 'dark';
        
        // Create banner element
        const banner = document.createElement('div');
        banner.className = `cookie-consent-container ${themeClass}`;
        
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-header">
                    <span class="cookie-consent-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                            <path d="M8.5 8.5v.01"></path>
                            <path d="M16 15.5v.01"></path>
                            <path d="M12 12v.01"></path>
                        </svg>
                    </span>
                    <h2 class="cookie-consent-title">Cookie Consent</h2>
                </div>
                <p class="cookie-consent-description">
                    We use cookies to enhance your experience on our website, analyze site usage, and assist in our marketing efforts. By clicking "Accept All," you consent to our use of cookies. To learn more or customize your preferences, visit our <a href="/privacy" class="cookie-consent-link">Privacy Policy</a>.
                </p>
                <div class="cookie-consent-actions">
                    <button class="cookie-consent-btn-accept" id="cookie-consent-accept-all">
                        Accept All
                    </button>
                    <button class="cookie-consent-btn-refuse" id="cookie-consent-refuse-all">
                        Refuse Non-Essential
                    </button>
                    <button class="cookie-consent-btn-settings" id="cookie-consent-settings">
                        Cookie Settings
                    </button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(banner);
        
        // Add event listeners for the buttons
        document.getElementById('cookie-consent-accept-all').addEventListener('click', () => this.acceptAll());
        document.getElementById('cookie-consent-refuse-all').addEventListener('click', () => this.refuseAll());
        document.getElementById('cookie-consent-settings').addEventListener('click', () => this.showSettingsModal());
        
        // Show the banner with a slight delay
        setTimeout(() => {
            banner.classList.add('visible');
        }, 500);
    }
    
    /**
     * Hide the cookie consent banner
     */
    hideBanner() {
        const banner = document.querySelector('.cookie-consent-container');
        if (banner) {
            banner.classList.remove('visible');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                banner.remove();
            }, 400); // Match transition duration
        }
    }
    
    /**
     * Show the cookie settings modal
     */
    showSettingsModal() {
        // Get current theme
        const isLightTheme = document.documentElement.classList.contains('light');
        const themeClass = isLightTheme ? 'light' : 'dark';
        
        // Create modal element if it doesn't exist
        let modal = document.querySelector('.cookie-settings-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = `cookie-settings-modal ${themeClass}`;
            
            modal.innerHTML = `
                <div class="cookie-settings-content">
                    <div class="cookie-settings-header">
                        <h3 class="cookie-settings-title">Cookie Settings</h3>
                        <button class="cookie-settings-close" id="cookie-settings-close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="cookie-settings-body">
                        <div class="cookie-settings-section">
                            <h4 class="cookie-settings-section-title">Manage Cookie Preferences</h4>
                            <p class="cookie-settings-description">Select which cookies you want to accept. Necessary cookies help make a website usable by enabling basic functions.</p>
                        </div>
                        
                        <div class="cookie-settings-section">
                            <div class="cookie-settings-option">
                                <div class="cookie-settings-option-info">
                                    <div class="cookie-settings-option-name">Necessary Cookies</div>
                                    <div class="cookie-settings-option-description">These cookies are essential for the website to function properly.</div>
                                </div>
                                <label class="cookie-settings-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="cookie-settings-slider"></span>
                                </label>
                            </div>
                            
                            <div class="cookie-settings-option">
                                <div class="cookie-settings-option-info">
                                    <div class="cookie-settings-option-name">Preference Cookies</div>
                                    <div class="cookie-settings-option-description">These cookies enable personalized features and remember your preferences.</div>
                                </div>
                                <label class="cookie-settings-switch">
                                    <input type="checkbox" id="cookie-setting-preferences" ${this.settings.preferences ? 'checked' : ''}>
                                    <span class="cookie-settings-slider"></span>
                                </label>
                            </div>
                            
                            <div class="cookie-settings-option">
                                <div class="cookie-settings-option-info">
                                    <div class="cookie-settings-option-name">Analytics Cookies</div>
                                    <div class="cookie-settings-option-description">These cookies help us understand how visitors interact with the website.</div>
                                </div>
                                <label class="cookie-settings-switch">
                                    <input type="checkbox" id="cookie-setting-analytics" ${this.settings.analytics ? 'checked' : ''}>
                                    <span class="cookie-settings-slider"></span>
                                </label>
                            </div>
                            
                            <div class="cookie-settings-option">
                                <div class="cookie-settings-option-info">
                                    <div class="cookie-settings-option-name">Marketing Cookies</div>
                                    <div class="cookie-settings-option-description">These cookies are used to track visitors across websites to display relevant advertisements.</div>
                                </div>
                                <label class="cookie-settings-switch">
                                    <input type="checkbox" id="cookie-setting-marketing" ${this.settings.marketing ? 'checked' : ''}>
                                    <span class="cookie-settings-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="cookie-settings-footer">
                        <button class="cookie-consent-btn-refuse" id="cookie-settings-cancel">Cancel</button>
                        <button class="cookie-consent-btn-accept" id="cookie-settings-save">Save Settings</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('cookie-settings-close').addEventListener('click', () => this.hideSettingsModal());
            document.getElementById('cookie-settings-cancel').addEventListener('click', () => this.hideSettingsModal());
            document.getElementById('cookie-settings-save').addEventListener('click', () => {
                // Update settings based on checkboxes
                this.settings.preferences = document.getElementById('cookie-setting-preferences').checked;
                this.settings.analytics = document.getElementById('cookie-setting-analytics').checked;
                this.settings.marketing = document.getElementById('cookie-setting-marketing').checked;
                
                this.saveSettings();
            });
        } else {
            // Update checkboxes to match current settings
            document.getElementById('cookie-setting-preferences').checked = this.settings.preferences;
            document.getElementById('cookie-setting-analytics').checked = this.settings.analytics;
            document.getElementById('cookie-setting-marketing').checked = this.settings.marketing;
        }
        
        // Show the modal
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
    }
    
    /**
     * Hide the cookie settings modal
     */
    hideSettingsModal() {
        const modal = document.querySelector('.cookie-settings-modal');
        if (modal) {
            modal.classList.remove('visible');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                modal.remove();
            }, 300); // Match transition duration
        }
    }
}

// Create a single instance of the cookie consent manager
const cookieConsent = new CookieConsentManager();

// For debugging/testing purposes
window.cookieConsent = cookieConsent;
