/**
 * Toast notification system
 * @module toast
 */

import { createElement, setTextContent } from './utils.js';

/** Toast container element */
let container = null;

/** Toast types with icons */
const TOAST_TYPES = {
    success: { icon: 'fa-check-circle', color: 'var(--status-active)' },
    error: { icon: 'fa-times-circle', color: 'var(--skill-red)' },
    warning: { icon: 'fa-exclamation-triangle', color: 'var(--status-admin)' },
    info: { icon: 'fa-info-circle', color: 'var(--telegram-color)' }
};

/**
 * Get or create toast container
 * @returns {HTMLElement} Toast container
 */
function getContainer() {
    if (!container) {
        container = createElement('div', 'toast-container');
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-label', 'Notifications');
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} [type='info'] - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} [duration=4000] - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 4000) {
    const containerEl = getContainer();
    const typeConfig = TOAST_TYPES[type] || TOAST_TYPES.info;

    // Create toast element
    const toast = createElement('div', `toast toast-${type}`);
    toast.setAttribute('role', 'alert');
    toast.style.setProperty('--toast-color', typeConfig.color);

    // Icon
    const icon = createElement('i', `fa-solid ${typeConfig.icon} toast-icon`);
    toast.appendChild(icon);

    // Message
    const msg = createElement('span', 'toast-message');
    setTextContent(msg, message);
    toast.appendChild(msg);

    // Close button
    const closeBtn = createElement('button', 'toast-close');
    const closeIcon = createElement('i', 'fa-solid fa-times');
    closeBtn.appendChild(closeIcon);
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.addEventListener('click', () => removeToast(toast));
    toast.appendChild(closeBtn);

    // Progress bar
    const progress = createElement('div', 'toast-progress');
    progress.style.animationDuration = `${duration}ms`;
    toast.appendChild(progress);

    // Add to container
    containerEl.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-visible');
    });

    // Auto remove
    const timeoutId = setTimeout(() => removeToast(toast), duration);

    // Pause on hover
    toast.addEventListener('mouseenter', () => {
        progress.style.animationPlayState = 'paused';
        clearTimeout(timeoutId);
    });

    toast.addEventListener('mouseleave', () => {
        progress.style.animationPlayState = 'running';
        const remaining = parseFloat(getComputedStyle(progress).width) /
            parseFloat(getComputedStyle(toast).width) * duration;
        setTimeout(() => removeToast(toast), remaining);
    });

    return toast;
}

/**
 * Remove a toast with animation
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    if (!toast || !toast.parentNode) return;

    toast.classList.remove('toast-visible');
    toast.classList.add('toast-hiding');

    toast.addEventListener('animationend', () => {
        toast.remove();
    }, { once: true });
}

/**
 * Shorthand functions
 */
export const toast = {
    success: (msg, duration) => showToast(msg, 'success', duration),
    error: (msg, duration) => showToast(msg, 'error', duration),
    warning: (msg, duration) => showToast(msg, 'warning', duration),
    info: (msg, duration) => showToast(msg, 'info', duration)
};
