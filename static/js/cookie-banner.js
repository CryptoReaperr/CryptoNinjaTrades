/**
 * Cookie Banner for Crypto Ninja Trades
 * Professional implementation including server-side persistence
 */

// Debug cookie banner initialization
console.log('Loading cookie-banner.js script');

// Wait for the page to be fully loaded, including all resources 
// This ensures the cookie banner appears after the loading screen
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded in cookie-banner.js');
    // Wait 5 seconds before showing the banner to ensure loading screen completes
    console.log('Waiting for 5 seconds before initializing cookie banner...');
    setTimeout(function() {
        console.log('Timeout completed, now initializing cookie banner');
        // Initialize cookie banner after a delay
        initCookieBanner();
        
        // Listen for event to open cookie settings from other places
        document.addEventListener('openCookieSettings', function() {
            openCookieSettings();
        });
    }, 5000); // 5 second delay to ensure loading animation completes
});

function initCookieBanner() {
    console.log('initCookieBanner function running');
    // Check if consent is already given via cookie or localStorage
    const serverConsent = getCookieValue('crypto_ninja_cookie_consent');
    console.log('Server consent:', serverConsent);
    let hasConsent = false;
    
    try {
        if (serverConsent) {
            console.log('Server consent found, not showing banner');
            hasConsent = true;
        } else {
            // Fallback to localStorage if no cookie found
            const localConsent = localStorage.getItem('crypto_ninja_cookie_consent');
            console.log('Local storage consent:', localConsent);
            if (localConsent) {
                console.log('Local consent found, not showing banner');
                hasConsent = true;
            }
        }
    } catch (e) {
        console.error('Error checking consent:', e);
    }
    
    // If no consent yet, show the banner
    if (!hasConsent) {
        console.log('No consent found, showing banner');
        showCookieBanner();
    } else {
        console.log('Consent already given, not showing banner');
    }
}

function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function showCookieBanner() {
    console.log('showCookieBanner function running');
    // Create banner
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.id = 'cookie-banner';
    console.log('Banner element created:', banner);
    
    // Set up for animation
    banner.style.position = 'fixed';
    banner.style.bottom = '-100px'; // Start off-screen for animation
    banner.style.transition = 'bottom 0.5s ease-in-out'; // Add transition for animation
    
    // Check if we're in light or dark mode
    const isLightMode = document.body.classList.contains('theme-light');
    
    // Banner inner HTML
    banner.innerHTML = `
        <div class="cookie-consent-text">
            <h3>This website uses cookies</h3>
            <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
            <div>
                <a href="/cookie-policy" class="cookie-settings" target="_blank">Learn more</a>
            </div>
        </div>
        <div class="cookie-consent-actions">
            <button id="static-cookie-accept" class="cookie-accept">Accept All</button>
            <button id="static-cookie-settings" class="cookie-settings">Customize preferences</button>
            <button id="static-cookie-refuse" class="cookie-refuse">Refuse All</button>
        </div>
    `;
    
    console.log('Appending banner to document body');
    document.body.appendChild(banner);
    console.log('Banner has been appended to document body');
    
    // Force the banner to be visible
    banner.style.display = 'flex';
    banner.style.opacity = '1';
    banner.style.visibility = 'visible';
    banner.style.zIndex = '9999999';
    console.log('Banner forced to display:flex and opacity:1');
    
    // Give a brief pause before starting the animation
    setTimeout(function() {
        console.log('Starting banner animation');
        banner.style.bottom = '0'; // Animate to visible position
    }, 100);
    
    // Set up event handlers
    document.getElementById('static-cookie-accept').addEventListener('click', function() {
        console.log('Accept all clicked');
        
        // Create consent data
        const consentData = {
            necessary: true,
            preferences: true,
            statistics: true,
            marketing: true
        };
        
        // Store in localStorage (as fallback)
        localStorage.setItem('crypto_ninja_cookie_consent', JSON.stringify(consentData));
        
        // Use the server API to set a proper cookie
        fetch('/api/cookie-consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(consentData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Cookie consent saved:', data);
            
            // Force banner to be hidden
            hideBanner(banner);
        })
        .catch(error => {
            console.error('Error saving cookie consent:', error);
            // Still hide the banner even if API call fails
            hideBanner(banner);
        });
    });
    
    document.getElementById('static-cookie-refuse').addEventListener('click', function() {
        console.log('Refuse all clicked');
        // Create overlay with message
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        
        // Check if we're in light or dark mode
        const isLightMode = document.body.classList.contains('theme-light');
        
        if (isLightMode) {
            overlay.style.backgroundColor = 'rgba(240, 240, 240, 0.98)';
            overlay.style.color = '#1A1A1A';
        } else {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
            overlay.style.color = 'white';
        }
        
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '2147483647';
        overlay.style.textAlign = 'center';
        overlay.style.padding = '2rem';
        overlay.style.transition = 'all 0.3s ease';
        
        // Ninja logo
        const logo = document.createElement('div');
        logo.innerHTML = '<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0Z" fill="#375F7C"/><path d="M58 30C58 36.6274 52.6274 42 46 42C39.3726 42 34 36.6274 34 30C34 23.3726 39.3726 18 46 18C52.6274 18 58 23.3726 58 30Z" fill="black"/><path d="M26 38C26 41.3137 23.3137 44 20 44C16.6863 44 14 41.3137 14 38C14 34.6863 16.6863 32 20 32C23.3137 32 26 34.6863 26 38Z" fill="black"/><path d="M20 52C20 52 24 60 40 60C56 60 60 52 60 52L20 52Z" fill="black"/></svg>';
        logo.style.marginBottom = '2rem';
        logo.style.opacity = '0.9';
        if (isLightMode) {
            logo.querySelector('path').setAttribute('fill', '#1A1A1A');
        }
        
        const message = document.createElement('h2');
        message.textContent = 'This site requires cookies to function';
        message.style.fontSize = '1.75rem';
        message.style.marginBottom = '1rem';
        message.style.fontWeight = 'bold';
        message.style.fontFamily = "'Montserrat', sans-serif";
        
        const subtext = document.createElement('p');
        subtext.textContent = 'Closing tab in a few seconds...';
        subtext.style.fontSize = '1.25rem';
        subtext.style.marginBottom = '2rem';
        subtext.style.opacity = '0.8';
        
        const countdown = document.createElement('div');
        countdown.style.fontSize = '3.5rem';
        countdown.style.fontWeight = 'bold';
        countdown.style.width = '80px';
        countdown.style.height = '80px';
        countdown.style.borderRadius = '50%';
        countdown.style.display = 'flex';
        countdown.style.alignItems = 'center';
        countdown.style.justifyContent = 'center';
        countdown.style.background = isLightMode ? 'rgba(55, 95, 124, 0.1)' : 'rgba(55, 95, 124, 0.2)';
        countdown.style.border = '2px solid #375F7C';
        countdown.style.color = '#375F7C';
        countdown.textContent = '6';
        
        overlay.appendChild(logo);
        overlay.appendChild(message);
        overlay.appendChild(subtext);
        overlay.appendChild(countdown);
        document.body.appendChild(overlay);
        
        // Set countdown and close tab
        let timeLeft = 6;
        const timer = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                window.close();
                // Fallback if window.close() doesn't work
                window.location.href = 'about:blank';
            }
        }, 1000);
        
        // Create consent data with only necessary cookies
        const consentData = {
            necessary: true,
            preferences: false,
            statistics: false,
            marketing: false
        };
        
        // Store in localStorage (as fallback)
        localStorage.setItem('crypto_ninja_cookie_consent', JSON.stringify(consentData));
        
        // Use the server API to set a proper cookie
        fetch('/api/cookie-consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(consentData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Cookie refusal saved:', data);
            hideBanner(banner);
        })
        .catch(error => {
            console.error('Error saving cookie refusal:', error);
            hideBanner(banner);
        });
    });
    
    document.getElementById('static-cookie-settings').addEventListener('click', function() {
        openCookieSettings(banner);
    });
}

function openCookieSettings(banner) {
    console.log('Settings clicked');
    
    // Create settings modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '2147483647';
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflowY = 'auto';
    modalContent.style.backgroundColor = document.body.classList.contains('theme-light') ? '#f0f0f0' : '#1a1a1a';
    modalContent.style.color = document.body.classList.contains('theme-light') ? '#1a1a1a' : '#e0e0e0';
    modalContent.style.borderRadius = '10px';
    modalContent.style.padding = '2rem';
    modalContent.style.position = 'relative';
    modalContent.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.3)';
    modalContent.style.border = '1px solid rgba(55, 95, 124, 0.3)';
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '15px';
    closeBtn.style.right = '15px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.5rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = document.body.classList.contains('theme-light') ? '#1a1a1a' : '#e0e0e0';
    
    // Header
    const header = document.createElement('div');
    header.style.marginBottom = '1.5rem';
    header.style.borderBottom = '1px solid rgba(55, 95, 124, 0.3)';
    header.style.paddingBottom = '1rem';
    
    const title = document.createElement('h3');
    title.textContent = 'Cookie Settings';
    title.style.fontSize = '1.25rem';
    title.style.fontWeight = '700';
    header.appendChild(title);
    
    // Description
    const description = document.createElement('p');
    description.textContent = 'Customize your cookie preferences for the Crypto Ninja Trades website.';
    description.style.color = document.body.classList.contains('theme-light') ? 'rgba(26, 26, 26, 0.7)' : 'rgba(224, 224, 224, 0.7)';
    description.style.fontSize = '0.9rem';
    description.style.marginBottom = '1rem';
    description.style.marginTop = '0.5rem';
    header.appendChild(description);
    
    // Cookie Categories Container
    const categoriesContainer = document.createElement('div');
    
    // Get existing settings or defaults
    let cookieSettings;
    try {
        const serverConsent = getCookieValue('crypto_ninja_cookie_consent');
        if (serverConsent) {
            cookieSettings = JSON.parse(serverConsent);
        } else {
            const savedSettings = localStorage.getItem('crypto_ninja_cookie_consent');
            cookieSettings = savedSettings ? JSON.parse(savedSettings) : {
                necessary: true,
                preferences: true,
                statistics: true,
                marketing: true
            };
        }
    } catch (e) {
        cookieSettings = {
            necessary: true,
            preferences: true,
            statistics: true, 
            marketing: true
        };
    }
    
    // Create toggle function
    function createToggle(isChecked, isDisabled = false) {
        const toggleContainer = document.createElement('div');
        toggleContainer.style.position = 'relative';
        toggleContainer.style.display = 'inline-block';
        toggleContainer.style.width = '50px';
        toggleContainer.style.height = '24px';
        if (isDisabled) toggleContainer.style.opacity = '0.6';
        
        const toggle = document.createElement('div');
        toggle.style.position = 'absolute';
        toggle.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
        toggle.style.top = '0';
        toggle.style.left = '0';
        toggle.style.right = '0';
        toggle.style.bottom = '0';
        toggle.style.backgroundColor = isChecked ? '#375F7C' : 'rgba(224, 224, 224, 0.2)';
        toggle.style.transition = '0.4s';
        toggle.style.borderRadius = '34px';
        toggleContainer.appendChild(toggle);
        
        const toggleKnob = document.createElement('div');
        toggleKnob.style.position = 'absolute';
        toggleKnob.style.height = '16px';
        toggleKnob.style.width = '16px';
        toggleKnob.style.left = isChecked ? '30px' : '4px';
        toggleKnob.style.bottom = '4px';
        toggleKnob.style.backgroundColor = 'white';
        toggleKnob.style.transition = '0.4s';
        toggleKnob.style.borderRadius = '50%';
        toggle.appendChild(toggleKnob);
        
        return { container: toggleContainer, toggle, knob: toggleKnob, isChecked };
    }
    
    // Create cookie category
    function createCategory(id, title, description, cookies, isChecked, isDisabled = false) {
        const category = document.createElement('div');
        category.style.marginBottom = '1.5rem';
        category.style.paddingBottom = '1rem';
        category.style.borderBottom = '1px solid rgba(55, 95, 124, 0.2)';
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '0.5rem';
        
        const titleEl = document.createElement('h4');
        titleEl.textContent = title;
        titleEl.style.fontWeight = '600';
        titleEl.style.fontSize = '1rem';
        header.appendChild(titleEl);
        
        // Add toggle switch
        const toggle = createToggle(isChecked, isDisabled);
        toggle.id = id;
        header.appendChild(toggle.container);
        
        // Make toggle interactive if not disabled
        if (!isDisabled) {
            toggle.toggle.addEventListener('click', function() {
                toggle.isChecked = !toggle.isChecked;
                toggle.toggle.style.backgroundColor = toggle.isChecked ? '#375F7C' : 'rgba(224, 224, 224, 0.2)';
                toggle.knob.style.left = toggle.isChecked ? '30px' : '4px';
                cookieSettings[id] = toggle.isChecked;
            });
        }
        
        category.appendChild(header);
        
        // Add description
        const desc = document.createElement('p');
        desc.textContent = description;
        desc.style.color = document.body.classList.contains('theme-light') ? 'rgba(26, 26, 26, 0.7)' : 'rgba(224, 224, 224, 0.7)';
        desc.style.fontSize = '0.85rem';
        desc.style.margin = '0.5rem 0';
        category.appendChild(desc);
        
        // Add cookie list if provided
        if (cookies && cookies.length > 0) {
            const cookieList = document.createElement('div');
            cookieList.style.marginTop = '0.75rem';
            cookieList.style.backgroundColor = document.body.classList.contains('theme-light') ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
            cookieList.style.padding = '0.75rem';
            cookieList.style.borderRadius = '4px';
            cookieList.style.fontSize = '0.8rem';
            
            const cookieTitle = document.createElement('div');
            cookieTitle.textContent = 'Cookies used:';
            cookieTitle.style.fontWeight = '600';
            cookieTitle.style.marginBottom = '0.5rem';
            cookieList.appendChild(cookieTitle);
            
            cookies.forEach(cookie => {
                const cookieItem = document.createElement('div');
                cookieItem.style.margin = '0.25rem 0';
                cookieItem.style.display = 'flex';
                
                const cookieName = document.createElement('div');
                cookieName.textContent = cookie.name;
                cookieName.style.fontWeight = '500';
                cookieName.style.marginRight = '0.5rem';
                cookieName.style.minWidth = '120px';
                cookieItem.appendChild(cookieName);
                
                const cookiePurpose = document.createElement('div');
                cookiePurpose.textContent = cookie.purpose;
                cookiePurpose.style.color = document.body.classList.contains('theme-light') ? 'rgba(26, 26, 26, 0.6)' : 'rgba(224, 224, 224, 0.6)';
                cookiePurpose.style.fontSize = '0.8rem';
                cookieItem.appendChild(cookiePurpose);
                
                cookieList.appendChild(cookieItem);
            });
            
            category.appendChild(cookieList);
        }
        
        return category;
    }
    
    // Create the four standard cookie categories
    const necessaryCategory = createCategory(
        'necessary',
        'Essential Cookies',
        'These cookies are required for the website to function and cannot be disabled.',
        [
            { name: 'session', purpose: 'Manages user session information' },
            { name: 'csrf_token', purpose: 'Protects against cross-site request forgery attacks' },
            { name: 'crypto_ninja_cookie_consent', purpose: 'Stores your cookie preferences' }
        ],
        true,
        true // Cannot be disabled
    );
    
    const preferencesCategory = createCategory(
        'preferences',
        'Preference Cookies',
        'These cookies allow the website to remember choices you make and provide enhanced features.',
        [
            { name: 'theme_mode', purpose: 'Remembers your light/dark theme preference' },
            { name: 'animation_mode', purpose: 'Stores your animation preference' },
            { name: 'ui_settings', purpose: 'Remembers customized interface settings' }
        ],
        cookieSettings.preferences
    );
    
    const statisticsCategory = createCategory(
        'statistics',
        'Analytics Cookies',
        'These cookies help us understand how visitors interact with the website, allowing us to improve site performance and functionality.',
        [
            { name: 'crypto_ninja_analytics', purpose: 'Anonymous usage statistics' },
            { name: '_ga', purpose: 'Google Analytics visitor tracking' },
            { name: 'page_views', purpose: 'Tracks pages viewed during your session' }
        ],
        cookieSettings.statistics
    );
    
    const marketingCategory = createCategory(
        'marketing',
        'Marketing Cookies',
        'These cookies are used to deliver relevant advertisements and marketing communications.',
        [
            { name: 'visit_count', purpose: 'Tracks number of visits to tailor marketing' },
            { name: 'referral_source', purpose: 'Records where you came from' },
            { name: 'crypto_interests', purpose: 'Remembers cryptocurrencies you showed interest in' }
        ],
        cookieSettings.marketing
    );
    
    // Add categories to container
    categoriesContainer.appendChild(necessaryCategory);
    categoriesContainer.appendChild(preferencesCategory);
    categoriesContainer.appendChild(statisticsCategory);
    categoriesContainer.appendChild(marketingCategory);
    
    // Actions container
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'space-between';
    actions.style.gap = '1rem';
    actions.style.marginTop = '2rem';
    
    // Save preferences button
    const savePrefsButton = document.createElement('button');
    savePrefsButton.textContent = 'Save Preferences';
    savePrefsButton.style.backgroundColor = '#375F7C';
    savePrefsButton.style.color = 'white';
    savePrefsButton.style.border = 'none';
    savePrefsButton.style.borderRadius = '4px';
    savePrefsButton.style.padding = '0.75rem 1rem';
    savePrefsButton.style.fontWeight = '600';
    savePrefsButton.style.cursor = 'pointer';
    savePrefsButton.style.fontSize = '0.9rem';
    savePrefsButton.style.flex = '1';
    actions.appendChild(savePrefsButton);
    
    // Accept all button
    const acceptAllButton = document.createElement('button');
    acceptAllButton.textContent = 'Accept All';
    acceptAllButton.style.backgroundColor = 'transparent';
    acceptAllButton.style.border = '1px solid #375F7C';
    acceptAllButton.style.color = '#375F7C';
    acceptAllButton.style.borderRadius = '4px';
    acceptAllButton.style.padding = '0.75rem 1rem';
    acceptAllButton.style.fontWeight = '600';
    acceptAllButton.style.cursor = 'pointer';
    acceptAllButton.style.fontSize = '0.9rem';
    acceptAllButton.style.flex = '1';
    actions.appendChild(acceptAllButton);
    
    // Refuse all button (except necessary)
    const refuseAllButton = document.createElement('button');
    refuseAllButton.textContent = 'Refuse Non-Essential';
    refuseAllButton.style.backgroundColor = 'transparent';
    refuseAllButton.style.border = '1px solid rgba(224, 224, 224, 0.3)';
    refuseAllButton.style.color = document.body.classList.contains('theme-light') ? '#1a1a1a' : '#e0e0e0';
    refuseAllButton.style.borderRadius = '4px';
    refuseAllButton.style.padding = '0.75rem 1rem';
    refuseAllButton.style.fontWeight = '600';
    refuseAllButton.style.cursor = 'pointer';
    refuseAllButton.style.fontSize = '0.9rem';
    refuseAllButton.style.flex = '1';
    actions.appendChild(refuseAllButton);
    
    // Assemble modal content
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(header);
    modalContent.appendChild(categoriesContainer);
    modalContent.appendChild(actions);
    
    // Add modal to page
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Event listeners
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    savePrefsButton.addEventListener('click', function() {
        console.log('Saving preferences:', cookieSettings);
        
        // Store in localStorage (as fallback)
        localStorage.setItem('crypto_ninja_cookie_consent', JSON.stringify(cookieSettings));
        
        // Use the server API to set a proper cookie
        fetch('/api/cookie-consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cookieSettings),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Cookie preferences saved:', data);
            
            // Force banner to be hidden if banner exists
            if (banner) hideBanner(banner);
            
            document.body.removeChild(modal);
        })
        .catch(error => {
            console.error('Error saving cookie preferences:', error);
            // Still hide the banner even if API call fails
            if (banner) hideBanner(banner);
            document.body.removeChild(modal);
        });
    });
    
    acceptAllButton.addEventListener('click', function() {
        console.log('Accept all clicked');
        const consentData = {
            necessary: true,
            preferences: true,
            statistics: true,
            marketing: true
        };
        
        // Store in localStorage (as fallback)
        localStorage.setItem('crypto_ninja_cookie_consent', JSON.stringify(consentData));
        
        // Use the server API to set a proper cookie
        fetch('/api/cookie-consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(consentData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Accepted all cookies:', data);
            
            // Force banner to be hidden if banner exists
            if (banner) hideBanner(banner);
            
            document.body.removeChild(modal);
        })
        .catch(error => {
            console.error('Error accepting all cookies:', error);
            // Still hide the banner even if API call fails
            if (banner) hideBanner(banner);
            document.body.removeChild(modal);
        });
    });
    
    refuseAllButton.addEventListener('click', function() {
        console.log('Refuse non-essential clicked');
        const consentData = {
            necessary: true,
            preferences: false,
            statistics: false,
            marketing: false
        };
        
        // Store in localStorage (as fallback)
        localStorage.setItem('crypto_ninja_cookie_consent', JSON.stringify(consentData));
        
        // Use the server API to set a proper cookie
        fetch('/api/cookie-consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(consentData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Refused non-essential cookies:', data);
            
            // Force banner to be hidden if banner exists
            if (banner) hideBanner(banner);
            
            document.body.removeChild(modal);
        })
        .catch(error => {
            console.error('Error refusing cookies:', error);
            // Still hide the banner even if API call fails
            if (banner) hideBanner(banner);
            document.body.removeChild(modal);
        });
    });
}

function hideBanner(banner) {
    console.log('hideBanner function called');
    if (!banner) {
        console.log('No banner provided to hideBanner function');
        return;
    }
    
    console.log('Animating banner out of view');
    // Animate banner out of view first
    banner.style.bottom = '-100px';
    
    // Wait for animation to complete before removing from DOM
    setTimeout(function() {
        console.log('Animation completed, now removing banner');
        // Then hide it completely
        banner.style.opacity = '0';
        banner.style.visibility = 'hidden';
        banner.style.display = 'none';
        banner.setAttribute('style', 'display: none !important; opacity: 0 !important; visibility: hidden !important; bottom: -100px !important;');
        console.log('Banner hidden successfully');
    }, 500); // Match the transition duration (0.5s)
}