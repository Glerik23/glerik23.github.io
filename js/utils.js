/**
 * Utility functions for the application
 * @module utils
 */

// ============================================
// Constants
// ============================================

/** Default fallback avatar SVG for broken images */
export const DEFAULT_AVATAR_SVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23333"/></svg>';

/** Default number of columns in data tables */
export const TABLE_COLUMNS = 5;

/**
 * Format a number with space separators for thousands
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Create an element with optional class name
 * @param {string} tag - HTML tag name
 * @param {string} [className] - Optional class name
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
}

/**
 * Safely set text content (prevents XSS)
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text content to set
 */
export function setTextContent(element, text) {
    element.textContent = text;
}

/**
 * Create a loading skeleton row for tables
 * @param {number} [columns=5] - Number of columns
 * @returns {HTMLTableRowElement} Skeleton row element
 */
export function createSkeletonRow(columns = 5) {
    const tr = createElement('tr', 'skeleton-row');

    for (let i = 0; i < columns; i++) {
        const td = createElement('td');

        if (i === 0) {
            // First column with avatar placeholder
            const wrapper = createElement('div', 'table-cell-with-avatar');
            wrapper.appendChild(createElement('div', 'skeleton skeleton-avatar'));
            wrapper.appendChild(createElement('div', 'skeleton skeleton-text'));
            td.appendChild(wrapper);
        } else if (i === 2 || i === 4) {
            // Tag columns
            td.appendChild(createElement('div', 'skeleton skeleton-tag'));
        } else {
            // Regular text columns
            td.appendChild(createElement('div', 'skeleton skeleton-text-short'));
        }

        tr.appendChild(td);
    }

    return tr;
}

/**
 * Show loading skeletons in a table
 * @param {string} tableId - ID of the table
 * @param {number} [rowCount=3] - Number of skeleton rows to show
 */
export function showLoadingState(tableId, rowCount = 3) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    tbody.replaceChildren();
    for (let i = 0; i < rowCount; i++) {
        tbody.appendChild(createSkeletonRow());
    }
}

/**
 * Show error state in a table
 * @param {string} tableId - ID of the table
 * @param {string} [message='Failed to load data'] - Error message to display
 */
export function showErrorState(tableId, message = 'Failed to load data') {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    tbody.replaceChildren();

    const tr = createElement('tr');
    const td = createElement('td', 'error-message');
    td.colSpan = 5;

    const icon = createElement('i', 'fa-solid fa-exclamation-circle');
    td.appendChild(icon);
    td.appendChild(document.createTextNode(` ${message}`));

    tr.appendChild(td);
    tbody.appendChild(tr);
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if a value is a valid URL
 * @param {string} string - String to check
 * @returns {boolean} True if valid URL
 */
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
