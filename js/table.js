/**
 * Table management with sorting functionality
 * @module table
 */

import { createElement, setTextContent } from './utils.js';

/**
 * TableManager class for handling table sorting
 */
export class TableManager {
    /**
     * Create a TableManager instance
     * @param {string} tableId - ID of the table element
     * @param {Object} [options={}] - Configuration options
     * @param {number} [options.defaultSortColumn] - Column index for default sort
     * @param {string} [options.defaultSortDirection='asc'] - Default sort direction ('asc' or 'desc')
     */
    constructor(tableId, options = {}) {
        this.table = document.getElementById(tableId);
        if (!this.table) {
            console.warn(`Table with id "${tableId}" not found`);
            return;
        }

        this.tbody = this.table.querySelector('tbody');
        this.headers = this.table.querySelectorAll('thead th');
        this.rows = [];
        this.sortDirection = 1; // 1 for asc, -1 for desc
        this.lastSortedColumn = -1;

        this.initHeaders();
        this.updateRows();

        // Apply default sort if specified
        if (options.defaultSortColumn !== undefined) {
            const direction = options.defaultSortDirection === 'desc' ? -1 : 1;
            this.sort(options.defaultSortColumn, direction);
        }

        // Set up observer for dynamic content
        this.setupMutationObserver();
    }

    /**
     * Initialize header click handlers and sort icons
     */
    initHeaders() {
        this.headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.setAttribute('role', 'columnheader');
            header.setAttribute('aria-sort', 'none');
            header.tabIndex = 0;

            // Click handler
            header.addEventListener('click', () => this.sort(index));

            // Keyboard handler for accessibility
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.sort(index);
                }
            });

            // Add sort icon placeholder
            const icon = createElement('span', 'sort-icon');
            icon.setAttribute('aria-hidden', 'true');
            header.appendChild(icon);
        });
    }

    /**
     * Update internal rows array from DOM
     */
    updateRows() {
        this.rows = Array.from(this.tbody.querySelectorAll('tr:not(.skeleton-row)'));
    }

    /**
     * Set up mutation observer to handle dynamic row additions
     */
    setupMutationObserver() {
        const observer = new MutationObserver(() => {
            this.updateRows();
        });

        observer.observe(this.tbody, {
            childList: true,
            subtree: false
        });
    }

    /**
     * Sort the table by column index
     * @param {number} columnIndex - Column to sort by
     * @param {number|null} [forceDirection=null] - Force sort direction (1 for asc, -1 for desc)
     */
    sort(columnIndex, forceDirection = null) {
        this.updateRows();

        if (this.rows.length === 0) return;

        // Determine sort direction
        if (forceDirection !== null) {
            this.sortDirection = forceDirection;
            this.lastSortedColumn = columnIndex;
        } else if (this.lastSortedColumn === columnIndex) {
            this.sortDirection *= -1;
        } else {
            this.sortDirection = 1;
            this.lastSortedColumn = columnIndex;
        }

        // Update header ARIA attributes and icons
        this.headers.forEach((h, i) => {
            const icon = h.querySelector('.sort-icon');
            if (icon) {
                setTextContent(icon, '');
            }

            if (i === columnIndex) {
                h.setAttribute('aria-sort', this.sortDirection === 1 ? 'ascending' : 'descending');
                if (icon) {
                    setTextContent(icon, this.sortDirection === 1 ? ' ▲' : ' ▼');
                }
            } else {
                h.setAttribute('aria-sort', 'none');
            }
        });

        // Sort rows
        this.rows.sort((a, b) => {
            const cellA = a.children[columnIndex]?.textContent.trim() || '';
            const cellB = b.children[columnIndex]?.textContent.trim() || '';

            // Try to parse as number (remove spaces and commas first)
            const numA = parseFloat(cellA.replace(/[,\s]/g, ''));
            const numB = parseFloat(cellB.replace(/[,\s]/g, ''));

            if (!isNaN(numA) && !isNaN(numB)) {
                return (numA - numB) * this.sortDirection;
            }

            return cellA.localeCompare(cellB) * this.sortDirection;
        });

        // Re-append rows in sorted order
        const fragment = document.createDocumentFragment();
        this.rows.forEach(row => fragment.appendChild(row));
        this.tbody.appendChild(fragment);
    }
}
