/**
 * API functions for fetching external data
 * @module api
 */

// ============================================
// Constants
// ============================================

/** Default timeout for fetch requests in milliseconds */
const DEFAULT_TIMEOUT = 5000;

/** Twitch API endpoints via DecAPI */
const TWITCH_API = {
    avatar: (username) => `https://decapi.me/twitch/avatar/${username}`,
    followers: (username) => `https://decapi.me/twitch/followcount/${username}`
};

/** Telegram base URL */
const TELEGRAM_URL = (channel) => `https://t.me/${channel}`;

/** CORS proxy configurations for Telegram data fetching */
const CORS_PROXIES = [
    {
        name: 'allorigins',
        buildUrl: (targetUrl) => `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`,
        extract: async (response) => {
            const data = await response.json();
            return data.contents;
        }
    },
    {
        name: 'codetabs',
        buildUrl: (targetUrl) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
        extract: async (response) => response.text()
    }
];

/**
 * Fetch with timeout support
 * @param {string} url - URL to fetch
 * @param {number} [timeout=5000] - Timeout in milliseconds
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If request times out or fails
 */
export const fetchWithTimeout = async (url, timeout = DEFAULT_TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
};

/**
 * Fetch Twitch avatar URL for a streamer
 * @param {string} streamer - Twitch username
 * @returns {Promise<string>} Avatar URL or error message
 */
export const fetchTwitchAvatar = async (streamer) => {
    try {
        const response = await fetchWithTimeout(TWITCH_API.avatar(streamer));
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
    } catch (error) {
        console.warn(`Failed to fetch avatar for ${streamer}:`, error.message);
        return 'Error';
    }
};

/**
 * Fetch Twitch follower count for a streamer
 * @param {string} streamer - Twitch username
 * @returns {Promise<string>} Follower count or error message
 */
export const fetchTwitchFollowers = async (streamer) => {
    try {
        const response = await fetchWithTimeout(TWITCH_API.followers(streamer));
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
    } catch (error) {
        console.warn(`Failed to fetch followers for ${streamer}:`, error.message);
        return 'Error';
    }
};

/**
 * Fetch Telegram channel data via CORS proxies
 * Tries multiple proxies and returns the first successful response
 * @param {string} channel - Telegram channel username
 * @returns {Promise<string|null>} HTML content or null if all proxies fail
 */
export const fetchTelegramData = async (channel) => {
    const targetUrl = TELEGRAM_URL(channel);

    // Try each proxy sequentially, return first success
    for (const proxy of CORS_PROXIES) {
        try {
            const response = await fetchWithTimeout(proxy.buildUrl(targetUrl), DEFAULT_TIMEOUT);
            if (!response.ok) continue;

            const content = await proxy.extract(response);
            if (content && content.length > 0) {
                return content;
            }
        } catch (err) {
            console.debug(`Proxy ${proxy.name} failed for ${channel}:`, err.message);
            continue;
        }
    }

    console.warn(`All proxies failed for Telegram channel: ${channel}`);
    return null;
};
