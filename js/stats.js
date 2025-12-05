/**
 * Statistics with animated counters
 * @module stats
 */

import { createElement, setTextContent } from './utils.js';

/**
 * Animate a number from 0 to target
 * @param {HTMLElement} element - Element to update
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        // Format with spaces
        setTextContent(element, current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '));

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Calculate stats from data
 * @returns {Object} Stats object
 */
function calculateStats() {
    // Import data dynamically to avoid circular dependencies
    const stats = {
        totalFollowers: 0,
        totalServers: 0,
        yearsExperience: 0,
        platforms: 3
    };

    // Get from rendered tables
    const twitchRows = document.querySelectorAll('#twitchTable tbody tr:not(.skeleton-row)');
    const discordRows = document.querySelectorAll('#discordTable tbody tr:not(.skeleton-row)');
    const telegramRows = document.querySelectorAll('#telegramTable tbody tr:not(.skeleton-row)');

    // Count followers from Twitch
    twitchRows.forEach(row => {
        const cell = row.querySelector('.follower-count');
        if (cell) {
            const num = parseInt(cell.textContent.replace(/\s/g, ''), 10);
            if (!isNaN(num)) stats.totalFollowers += num;
        }
    });

    // Count subscribers from Telegram
    telegramRows.forEach(row => {
        const cell = row.querySelector('.member-count');
        if (cell) {
            const num = parseInt(cell.textContent.replace(/\s/g, ''), 10);
            if (!isNaN(num)) stats.totalFollowers += num;
        }
    });

    // Count total servers/channels
    stats.totalServers = discordRows.length + telegramRows.length + twitchRows.length;

    // Calculate years (from 2018)
    const startYear = 2018;
    const currentYear = new Date().getFullYear();
    stats.yearsExperience = currentYear - startYear;

    return stats;
}

/**
 * Create stats section
 * @returns {HTMLElement} Stats section element
 */
export function createStatsSection() {
    const section = createElement('section', 'stats-section');
    section.id = 'stats-section';

    const statsGrid = createElement('div', 'stats-grid');

    const statsConfig = [
        { id: 'stat-followers', icon: 'fa-users', label: 'Followers', key: 'totalFollowers' },
        { id: 'stat-projects', icon: 'fa-folder-open', label: 'Projects', key: 'totalServers' },
        { id: 'stat-experience', icon: 'fa-clock', label: 'Years of Experience', key: 'yearsExperience' },
        { id: 'stat-platforms', icon: 'fa-layer-group', label: 'Platforms', key: 'platforms' }
    ];

    statsConfig.forEach(config => {
        const card = createElement('div', 'stat-card');
        card.id = config.id;

        const icon = createElement('div', 'stat-icon');
        const iconEl = createElement('i', `fa-solid ${config.icon}`);
        icon.appendChild(iconEl);

        const value = createElement('div', 'stat-value');
        value.dataset.target = '0';
        value.dataset.key = config.key;
        setTextContent(value, '0');

        const label = createElement('div', 'stat-label');
        setTextContent(label, config.label);

        card.appendChild(icon);
        card.appendChild(value);
        card.appendChild(label);
        statsGrid.appendChild(card);
    });

    section.appendChild(statsGrid);

    return section;
}

/**
 * Initialize stats animation with Intersection Observer
 * @param {HTMLElement} section - Stats section element
 */
export function initStatsAnimation(section) {
    if (!section) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;

                // Get fresh stats
                const stats = calculateStats();

                // Animate each counter
                section.querySelectorAll('.stat-value').forEach(el => {
                    const key = el.dataset.key;
                    const target = stats[key] || 0;
                    el.dataset.target = target;
                    animateCounter(el, target);
                });

                observer.unobserve(section);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(section);
}

/**
 * Update stats (call after data loads)
 */
export function updateStats() {
    const section = document.getElementById('stats-section');
    if (!section) return;

    const stats = calculateStats();

    section.querySelectorAll('.stat-value').forEach(el => {
        const key = el.dataset.key;
        const target = stats[key] || 0;

        // Only animate if target changed
        if (el.dataset.target !== String(target)) {
            el.dataset.target = target;
            animateCounter(el, target, 1000);
        }
    });
}
