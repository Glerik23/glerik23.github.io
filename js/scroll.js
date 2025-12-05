/**
 * Scroll utilities
 * @module scroll
 */

import { createElement } from './utils.js';

/** Back to top button element */
let backToTopBtn = null;

/** Scroll threshold to show button */
const SCROLL_THRESHOLD = 300;

/**
 * Create back to top button
 * @returns {HTMLButtonElement} Button element
 */
function createBackToTopButton() {
    const btn = createElement('button', 'back-to-top');
    btn.id = 'back-to-top';
    const arrowIcon = createElement('i', 'fa-solid fa-arrow-up');
    btn.appendChild(arrowIcon);
    btn.setAttribute('aria-label', 'Вернуться наверх');
    btn.setAttribute('data-tooltip', 'Наверх');
    btn.setAttribute('data-tooltip-position', 'left');

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(btn);
    return btn;
}

/**
 * Handle scroll event
 */
function handleScroll() {
    if (!backToTopBtn) return;

    if (window.scrollY > SCROLL_THRESHOLD) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

/**
 * Initialize back to top button
 */
export function initBackToTop() {
    backToTopBtn = createBackToTopButton();

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector
 * @param {Object} options - Scroll options
 */
export function scrollToElement(selector, options = {}) {
    const element = document.querySelector(selector);
    if (!element) return;

    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        ...options
    };

    element.scrollIntoView(defaultOptions);
}
