/**
 * Tooltip system
 * @module tooltip
 */

import { createElement, setTextContent } from './utils.js';

/** Tooltip element */
let tooltipEl = null;

/** Show delay timer */
let showTimer = null;

/** Currently hovered element */
let currentTarget = null;

/** Tooltip show delay in ms */
const SHOW_DELAY = 300;

/**
 * Get or create tooltip element
 * @returns {HTMLElement} Tooltip element
 */
function getTooltip() {
    if (!tooltipEl) {
        tooltipEl = createElement('div', 'tooltip');
        tooltipEl.setAttribute('role', 'tooltip');
        tooltipEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
}

/**
 * Position tooltip relative to target element
 * @param {HTMLElement} target - Target element
 * @param {string} position - Preferred position (top, bottom, left, right)
 */
function positionTooltip(target, position = 'top') {
    const tooltip = getTooltip();
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const gap = 8;
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    let top, left;
    let finalPosition = position;

    // Calculate positions
    const positions = {
        top: {
            top: targetRect.top - tooltipRect.height - gap,
            left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
        },
        bottom: {
            top: targetRect.bottom + gap,
            left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
        },
        left: {
            top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
            left: targetRect.left - tooltipRect.width - gap
        },
        right: {
            top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
            left: targetRect.right + gap
        }
    };

    // Try preferred position first
    let pos = positions[position];

    // Check if fits in viewport, try alternatives
    if (pos.top < 0 && position === 'top') {
        finalPosition = 'bottom';
        pos = positions.bottom;
    } else if (pos.top + tooltipRect.height > viewport.height && position === 'bottom') {
        finalPosition = 'top';
        pos = positions.top;
    } else if (pos.left < 0) {
        if (position === 'left') {
            finalPosition = 'right';
            pos = positions.right;
        } else {
            pos.left = gap;
        }
    } else if (pos.left + tooltipRect.width > viewport.width) {
        if (position === 'right') {
            finalPosition = 'left';
            pos = positions.left;
        } else {
            pos.left = viewport.width - tooltipRect.width - gap;
        }
    }

    top = pos.top + window.scrollY;
    left = pos.left + window.scrollX;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.setAttribute('data-position', finalPosition);
}

/**
 * Show tooltip for element
 * @param {HTMLElement} target - Target element
 */
function showTooltip(target) {
    const text = target.getAttribute('data-tooltip');
    if (!text) return;

    const tooltip = getTooltip();
    const position = target.getAttribute('data-tooltip-position') || 'top';

    setTextContent(tooltip, text);
    tooltip.classList.add('tooltip-visible');
    tooltip.setAttribute('aria-hidden', 'false');

    // Position after text is set (so we have correct dimensions)
    requestAnimationFrame(() => {
        positionTooltip(target, position);
    });

    currentTarget = target;
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
    }

    if (tooltipEl) {
        tooltipEl.classList.remove('tooltip-visible');
        tooltipEl.setAttribute('aria-hidden', 'true');
    }

    currentTarget = null;
}

/**
 * Handle mouse enter
 * @param {Event} e - Mouse event
 */
function handleMouseEnter(e) {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;

    if (showTimer) clearTimeout(showTimer);

    showTimer = setTimeout(() => {
        showTooltip(target);
    }, SHOW_DELAY);
}

/**
 * Handle mouse leave
 * @param {Event} e - Mouse event
 */
function handleMouseLeave(e) {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;

    hideTooltip();
}

/**
 * Handle focus (for keyboard accessibility)
 * @param {Event} e - Focus event
 */
function handleFocus(e) {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;

    showTooltip(target);
}

/**
 * Handle blur
 * @param {Event} e - Blur event
 */
function handleBlur(e) {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;

    hideTooltip();
}

/** Long press timer for mobile */
let longPressTimer = null;

/**
 * Handle touch start (long press for mobile)
 * @param {Event} e - Touch event
 */
function handleTouchStart(e) {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;

    longPressTimer = setTimeout(() => {
        showTooltip(target);
    }, 500);
}

/**
 * Handle touch end
 */
function handleTouchEnd() {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }

    // Hide after a delay on mobile
    if (currentTarget) {
        setTimeout(hideTooltip, 1500);
    }
}

/**
 * Initialize tooltip system
 */
export function initTooltips() {
    // Mouse events
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Keyboard accessibility
    document.addEventListener('focusin', handleFocus, true);
    document.addEventListener('focusout', handleBlur, true);

    // Mobile long-press
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Hide on scroll
    window.addEventListener('scroll', hideTooltip, { passive: true });
}
