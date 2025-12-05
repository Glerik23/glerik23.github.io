/**
 * Render functions for table data
 * Uses safe DOM manipulation instead of innerHTML to prevent XSS
 * @module render
 */

import { formatNumber, createElement, setTextContent, DEFAULT_AVATAR_SVG } from './utils.js';

/**
 * Create a table cell with avatar and link
 * @param {Object} options - Cell options
 * @param {string} options.href - Link URL
 * @param {string} options.avatar - Avatar image URL
 * @param {string} options.name - Display name
 * @param {string} [options.altName] - Alternative/old name
 * @returns {HTMLTableCellElement} Table cell element
 */
function createAvatarCell({ href, avatar, name, altName }) {
    const td = createElement('td');
    const wrapper = createElement('div', 'table-cell-with-avatar');

    const link = createElement('a', 'streamer-link');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const img = createElement('img', 'table-avatar');
    img.src = avatar;
    img.alt = `${name} avatar`;
    img.loading = 'lazy';
    img.width = 30;
    img.height = 30;

    // Handle image load errors
    img.onerror = () => {
        img.src = DEFAULT_AVATAR_SVG;
    };

    link.appendChild(img);

    const nameContainer = createElement('div');
    const nameSpan = createElement('span');
    setTextContent(nameSpan, name);
    nameContainer.appendChild(nameSpan);

    link.appendChild(nameContainer);
    wrapper.appendChild(link);
    td.appendChild(wrapper);

    return td;
}

/**
 * Create a table cell with a tag
 * @param {Object} tagData - Tag data
 * @param {string} tagData.text - Tag text
 * @param {string} tagData.class - Tag CSS class
 * @returns {HTMLTableCellElement} Table cell element
 */
function createTagCell(tagData) {
    const td = createElement('td');
    const tag = createElement('span', `tag ${tagData.class}`);
    setTextContent(tag, tagData.text);
    td.appendChild(tag);
    return td;
}

/**
 * Create a simple text cell
 * @param {string} text - Cell text content
 * @param {string} [className] - Optional class name
 * @returns {HTMLTableCellElement} Table cell element
 */
function createTextCell(text, className) {
    const td = createElement('td', className);
    setTextContent(td, text);
    return td;
}

/**
 * Render Twitch streamer rows
 * @param {Array} data - Array of streamer data objects
 */
export function renderTwitchRows(data) {
    const tbody = document.querySelector('#twitchTable tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.replaceChildren();

    data.forEach(item => {
        const tr = createElement('tr');
        tr.dataset.streamer = item.streamer;
        tr.dataset.originalName = item.originalName;

        // Streamer cell with avatar
        tr.appendChild(createAvatarCell({
            href: `https://twitch.tv/${item.streamer}`,
            avatar: item.avatar,
            name: item.streamer
        }));

        // Followers cell
        tr.appendChild(createTextCell(formatNumber(item.followers), 'follower-count'));

        // Position tag
        tr.appendChild(createTagCell(item.position));

        // Date cell
        tr.appendChild(createTextCell(item.date));

        // Status tag
        tr.appendChild(createTagCell(item.status));

        tbody.appendChild(tr);
    });
}

/**
 * Render Telegram channel rows
 * @param {Array} data - Array of channel data objects
 */
export function renderTelegramRows(data) {
    const tbody = document.querySelector('#telegramTable tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.replaceChildren();

    data.forEach(item => {
        const tr = createElement('tr');
        tr.dataset.telegram = item.channel;

        // Channel cell with avatar
        tr.appendChild(createAvatarCell({
            href: `https://t.me/${item.channel}`,
            avatar: item.avatar,
            name: item.channel
        }));

        // Members cell
        tr.appendChild(createTextCell(formatNumber(item.members), 'member-count'));

        // Position tag
        tr.appendChild(createTagCell(item.position));

        // Date cell
        tr.appendChild(createTextCell(item.date));

        // Status tag
        tr.appendChild(createTagCell(item.status));

        tbody.appendChild(tr);
    });
}

/**
 * Render Discord server rows
 * @param {Array} data - Array of server data objects
 */
export function renderDiscordRows(data) {
    const tbody = document.querySelector('#discordTable tbody');
    if (!tbody) return;

    // Clear existing content
    tbody.replaceChildren();

    data.forEach(item => {
        const tr = createElement('tr');

        // Server cell with avatar (no link for Discord)
        const td = createElement('td');
        const wrapper = createElement('div', 'table-cell-with-avatar');

        const img = createElement('img', 'table-avatar');
        img.src = item.avatar;
        img.alt = `${item.name} avatar`;
        img.loading = 'lazy';
        img.width = 30;
        img.height = 30;

        // Handle image load errors
        img.onerror = () => {
            img.src = DEFAULT_AVATAR_SVG;
        };

        const nameSpan = createElement('span');
        setTextContent(nameSpan, item.name);

        wrapper.appendChild(img);
        wrapper.appendChild(nameSpan);
        td.appendChild(wrapper);
        tr.appendChild(td);

        // Members cell
        tr.appendChild(createTextCell(formatNumber(item.members)));

        // Position tag
        tr.appendChild(createTagCell(item.position));

        // Date cell
        tr.appendChild(createTextCell(item.date));

        // Status tag
        tr.appendChild(createTagCell(item.status));

        tbody.appendChild(tr);
    });
}
