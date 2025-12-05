/**
 * Main application entry point
 * @module main
 */

import { updateTwitchStats, updateTelegramStats } from './dom.js';
import { TableManager } from './table.js';
import { twitchStreamers, telegramChannels, discordServers } from './data.js';
import { renderTwitchRows, renderTelegramRows, renderDiscordRows } from './render.js';
import { showLoadingState } from './utils.js';
import { initTheme } from './theme.js';
import { initTooltips } from './tooltip.js';
import { initShortcuts } from './shortcuts.js';
import { initFilters } from './filter.js';
import { createStatsSection, initStatsAnimation, markStatsReady } from './stats.js';
import { initBackToTop } from './scroll.js';
import { setupAnimationClasses, initScrollAnimations } from './animations.js';
import { initParticles } from './particles.js';
import { toast } from './toast.js';

/**
 * Hide preloader
 */
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
}

/**
 * Initialize the application
 */
function init() {
    // Initialize theme immediately (before content loads)
    initTheme();

    // Initialize particles background
    initParticles();

    // Show loading state while preparing data
    showLoadingState('twitchTable', 3);
    showLoadingState('telegramTable', 1);
    showLoadingState('discordTable', 3);

    // Create stats section
    const statsPlaceholder = document.getElementById('stats-section');
    if (statsPlaceholder) {
        const statsSection = createStatsSection();
        statsPlaceholder.replaceWith(statsSection);
    }

    // Small delay to show loading animation
    requestAnimationFrame(() => {
        // Render static data
        renderTwitchRows(twitchStreamers);
        renderTelegramRows(telegramChannels);
        renderDiscordRows(discordServers);

        // Initialize table sorting after render
        initializeTables();

        // Initialize filters
        initFilters();

        // Initialize stats animation
        initStatsAnimation(document.getElementById('stats-section'));

        // Set up scroll animations
        setupAnimationClasses();
        initScrollAnimations();

        // Initialize UI components
        initTooltips();
        initShortcuts();
        initBackToTop();

        // Start live data updates
        startLiveUpdates();

        // Hide preloader after everything is ready
        setTimeout(() => {
            hidePreloader();

            // Show welcome toast
            toast.info('Нажмите ? для справки по горячим клавишам', 5000);
        }, 300);
    });
}

/**
 * Initialize table managers for sorting
 */
function initializeTables() {
    new TableManager('twitchTable', {
        defaultSortColumn: 1,
        defaultSortDirection: 'desc'
    });

    new TableManager('telegramTable', {
        defaultSortColumn: 1,
        defaultSortDirection: 'desc'
    });

    new TableManager('discordTable');
}

/**
 * Start live data updates for Twitch and Telegram
 * Stats animation is enabled after all API calls complete (success or failure)
 */
function startLiveUpdates() {
    const twitchPromise = updateTwitchStats()
        .catch(err => {
            console.warn('Failed to update Twitch stats:', err.message);
            toast.warning('Не удалось загрузить данные Twitch');
        });

    const telegramPromise = updateTelegramStats()
        .catch(err => {
            console.warn('Failed to update Telegram stats:', err.message);
            toast.warning('Не удалось загрузить данные Telegram');
        });

    // Wait for both API calls to complete (success or failure)
    // Then mark stats as ready for animation
    Promise.allSettled([twitchPromise, telegramPromise])
        .then(() => {
            markStatsReady();
        });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
