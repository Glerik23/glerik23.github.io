/**
 * Table filtering system
 * @module filter
 */

import { createElement, setTextContent, debounce } from './utils.js';

/**
 * Create filter controls for a table
 * @param {string} tableId - Table ID
 * @param {string} containerId - Container to insert controls
 */
export function createFilterControls(tableId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const wrapper = createElement('div', 'filter-controls');
    wrapper.id = `${tableId}-filters`;

    // Search input
    const searchWrapper = createElement('div', 'filter-search-wrapper');

    const searchIcon = createElement('i', 'fa-solid fa-search filter-search-icon');
    searchWrapper.appendChild(searchIcon);

    const searchInput = createElement('input', 'filter-search');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск...';
    searchInput.setAttribute('aria-label', 'Поиск в таблице');
    searchInput.id = `${tableId}-search`;
    searchWrapper.appendChild(searchInput);

    // Clear button
    const clearBtn = createElement('button', 'filter-clear');
    const clearIcon = createElement('i', 'fa-solid fa-times');
    clearBtn.appendChild(clearIcon);
    clearBtn.setAttribute('aria-label', 'Очистить поиск');
    clearBtn.style.display = 'none';
    searchWrapper.appendChild(clearBtn);

    wrapper.appendChild(searchWrapper);

    // Status filter buttons
    const statusWrapper = createElement('div', 'filter-status-wrapper');

    const statuses = [
        { value: 'all', label: 'Все' },
        { value: 'active', label: 'Active' },
        { value: 'closed', label: 'Closed' }
    ];

    statuses.forEach(status => {
        const btn = createElement('button', `filter-status-btn${status.value === 'all' ? ' active' : ''}`);
        btn.dataset.status = status.value;
        setTextContent(btn, status.label);
        btn.setAttribute('aria-pressed', status.value === 'all' ? 'true' : 'false');
        statusWrapper.appendChild(btn);
    });

    wrapper.appendChild(statusWrapper);

    // Insert before the h4 element (section subtitle)
    const subtitle = container.querySelector('h4');
    if (subtitle) {
        subtitle.parentNode.insertBefore(wrapper, subtitle.nextSibling);
    } else {
        container.appendChild(wrapper);
    }

    // Set up event listeners
    setupFilterListeners(tableId, searchInput, clearBtn, statusWrapper);
}

/**
 * Set up filter event listeners
 * @param {string} tableId - Table ID
 * @param {HTMLInputElement} searchInput - Search input
 * @param {HTMLButtonElement} clearBtn - Clear button
 * @param {HTMLElement} statusWrapper - Status buttons wrapper
 */
function setupFilterListeners(tableId, searchInput, clearBtn, statusWrapper) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let currentSearch = '';
    let currentStatus = 'all';

    // Debounced filter function
    const filterTable = debounce(() => {
        applyFilters(table, currentSearch, currentStatus);
    }, 150);

    // Search input
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        clearBtn.style.display = currentSearch ? 'flex' : 'none';
        filterTable();
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        clearBtn.style.display = 'none';
        filterTable();
        searchInput.focus();
    });

    // Status buttons
    statusWrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-status-btn');
        if (!btn) return;

        // Update active state
        statusWrapper.querySelectorAll('.filter-status-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        currentStatus = btn.dataset.status;
        filterTable();
    });
}

/**
 * Apply filters to table
 * @param {HTMLTableElement} table - Table element
 * @param {string} search - Search query
 * @param {string} status - Status filter
 */
function applyFilters(table, search, status) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr:not(.skeleton-row):not(.no-results-row)');
    let visibleCount = 0;

    rows.forEach(row => {
        // Get searchable text (first column - name)
        const nameCell = row.querySelector('.table-cell-with-avatar');
        const name = nameCell ? nameCell.textContent.toLowerCase() : '';

        // Get status
        const statusCell = row.querySelector('.tag-active, .tag-closed');
        const rowStatus = statusCell?.classList.contains('tag-active') ? 'active' : 'closed';

        // Check filters
        const matchesSearch = !search || name.includes(search);
        const matchesStatus = status === 'all' || rowStatus === status;

        if (matchesSearch && matchesStatus) {
            row.style.display = '';
            visibleCount++;

            // Highlight matched text
            if (search && nameCell) {
                highlightText(nameCell, search);
            } else if (nameCell) {
                removeHighlight(nameCell);
            }
        } else {
            row.style.display = 'none';
        }
    });

    // Show/hide no results message
    updateNoResultsMessage(tbody, visibleCount, rows.length);
}

/**
 * Highlight matching text
 * @param {HTMLElement} element - Element to highlight in
 * @param {string} search - Search text
 */
function highlightText(element, search) {
    const textSpan = element.querySelector('span');
    if (!textSpan) return;

    const text = textSpan.textContent;
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(search);

    if (index === -1) {
        // No match - just reset to plain text
        textSpan.textContent = text;
        return;
    }

    const before = text.substring(0, index);
    const match = text.substring(index, index + search.length);
    const after = text.substring(index + search.length);

    // Use safe DOM manipulation instead of innerHTML
    textSpan.textContent = '';
    if (before) textSpan.appendChild(document.createTextNode(before));
    const mark = createElement('mark', 'highlight');
    mark.textContent = match;
    textSpan.appendChild(mark);
    if (after) textSpan.appendChild(document.createTextNode(after));
}

/**
 * Remove highlight from element
 * @param {HTMLElement} element - Element to remove highlight from
 */
function removeHighlight(element) {
    const textSpan = element.querySelector('span');
    if (!textSpan) return;

    const mark = textSpan.querySelector('mark');
    if (mark) {
        textSpan.textContent = textSpan.textContent;
    }
}

/**
 * Update no results message
 * @param {HTMLTableSectionElement} tbody - Table body
 * @param {number} visibleCount - Number of visible rows
 * @param {number} totalCount - Total number of rows
 */
function updateNoResultsMessage(tbody, visibleCount, totalCount) {
    let noResultsRow = tbody.querySelector('.no-results-row');

    if (visibleCount === 0 && totalCount > 0) {
        if (!noResultsRow) {
            noResultsRow = createElement('tr', 'no-results-row');
            const td = createElement('td');
            td.colSpan = 5;
            // Use safe DOM manipulation instead of innerHTML
            const noResultsDiv = createElement('div', 'no-results');
            const searchIcon = createElement('i', 'fa-solid fa-search');
            noResultsDiv.appendChild(searchIcon);
            noResultsDiv.appendChild(document.createTextNode(' Ничего не найдено'));
            td.appendChild(noResultsDiv);
            noResultsRow.appendChild(td);
            tbody.appendChild(noResultsRow);
        }
        noResultsRow.style.display = '';
    } else if (noResultsRow) {
        noResultsRow.style.display = 'none';
    }
}

/**
 * Initialize filters for all tables
 */
export function initFilters() {
    createFilterControls('twitchTable', 'twitch-section');
    createFilterControls('telegramTable', 'telegram-section');
    createFilterControls('discordTable', 'discord-section');
}
