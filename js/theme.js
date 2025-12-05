/**
 * Theme management with localStorage persistence
 * @module theme
 */

const THEME_KEY = 'glerik-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * Get the user's preferred theme
 * Priority: localStorage > system preference > dark (default)
 * @returns {string} Theme name ('dark' or 'light')
 */
function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return LIGHT_THEME;
    }

    return DARK_THEME;
}

/**
 * Apply theme to document
 * @param {string} theme - Theme name
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle button icon
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = theme === DARK_THEME ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
        toggleBtn.setAttribute('aria-label',
            theme === DARK_THEME ? 'Switch to light theme' : 'Switch to dark theme'
        );
        toggleBtn.setAttribute('data-tooltip',
            theme === DARK_THEME ? 'Светлая тема' : 'Тёмная тема'
        );
    }

    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.content = theme === DARK_THEME ? '#0a0a12' : '#f5f5f7';
    }
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || DARK_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
}

/**
 * Initialize theme system
 */
export function initTheme() {
    // Apply saved theme immediately (before DOM ready to avoid flash)
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Set up toggle button listener
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
            }
        });
    }
}

// Export for keyboard shortcuts
export { toggleTheme };
