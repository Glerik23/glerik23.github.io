/**
 * DOM manipulation and live data updates
 * @module dom
 */

import { fetchTwitchAvatar, fetchTwitchFollowers, fetchTelegramData } from './api.js';
import { createElement, setTextContent } from './utils.js';

/**
 * Update Twitch stats (avatars and follower counts) for all rows
 * @returns {Promise<void>}
 */
export async function updateTwitchStats() {
    const rows = document.querySelectorAll('#twitchTable tbody tr');
    const promises = [];

    rows.forEach(row => {
        const streamer = row.dataset.streamer;

        if (!streamer) return;

        // Nickname history logic
        const originalName = row.dataset.originalName;
        if (originalName && streamer.toLowerCase() !== originalName.toLowerCase()) {
            const link = row.querySelector('.streamer-link');
            if (link) {
                let textContainer = link.querySelector('div');

                if (textContainer && !textContainer.querySelector('.old-name')) {
                    const oldNameSpan = createElement('span', 'old-name');
                    setTextContent(oldNameSpan, `ex. ${originalName}`);
                    textContainer.appendChild(oldNameSpan);
                }
            }
        }

        // Update Avatar
        const avatarPromise = fetchTwitchAvatar(streamer)
            .then(avatarUrl => {
                if (avatarUrl && !avatarUrl.includes('Error') && avatarUrl.startsWith('http')) {
                    const img = row.querySelector('.table-avatar');
                    if (img) {
                        img.classList.add('loading');
                        img.src = avatarUrl;
                        img.addEventListener('load', () => img.classList.remove('loading'), { once: true });
                    }
                }
            })
            .catch(err => {
                console.warn(`Failed to update avatar for ${streamer}:`, err.message);
            });

        // Update Follower Count
        const followerPromise = fetchTwitchFollowers(streamer)
            .then(followers => {
                if (followers && !followers.includes('Error') && !isNaN(parseInt(followers))) {
                    const formattedFollowers = followers.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    const countCell = row.querySelector('.follower-count');
                    if (countCell) {
                        setTextContent(countCell, formattedFollowers);
                    }
                }
            })
            .catch(err => {
                console.warn(`Failed to update followers for ${streamer}:`, err.message);
            });

        promises.push(avatarPromise, followerPromise);
    });

    await Promise.allSettled(promises);
}

/**
 * Update Telegram stats (avatars, names, and member counts) for all rows
 * @returns {Promise<void>}
 */
export async function updateTelegramStats() {
    const rows = document.querySelectorAll('#telegramTable tbody tr');
    const promises = [];

    rows.forEach(row => {
        const channel = row.dataset.telegram;
        if (!channel) return;

        const promise = (async () => {
            try {
                const htmlContent = await fetchTelegramData(channel);
                if (!htmlContent) return;

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, "text/html");

                // 1. Avatar
                const avatarImg = doc.querySelector('img.tgme_page_photo_image');
                if (avatarImg && avatarImg.src) {
                    const img = row.querySelector('.table-avatar');
                    if (img) {
                        img.classList.add('loading');
                        img.src = avatarImg.src;
                        img.addEventListener('load', () => img.classList.remove('loading'), { once: true });
                    }
                }

                // 2. Channel Title
                const titleDiv = doc.querySelector('.tgme_page_title');
                if (titleDiv) {
                    const titleText = titleDiv.textContent.trim();
                    const nameSpan = row.querySelector('.table-cell-with-avatar span');
                    if (nameSpan && titleText) {
                        setTextContent(nameSpan, titleText);
                    }
                }

                // 3. Subscriber Count
                const extraDiv = doc.querySelector('.tgme_page_extra');
                if (extraDiv) {
                    const text = extraDiv.textContent.trim();
                    const countMatch = text.match(/^([\d\s.,KM]+)/);
                    const countCell = row.querySelector('.member-count');
                    if (countCell) {
                        if (countMatch) {
                            // Remove existing separators and format with spaces
                            const rawCount = countMatch[1].replace(/[,\s.]/g, '');
                            setTextContent(countCell, rawCount.replace(/\B(?=(\d{3})+(?!\d))/g, " "));
                        } else {
                            setTextContent(countCell, text);
                        }
                    }
                }
            } catch (parseErr) {
                console.warn(`Error parsing Telegram data for ${channel}:`, parseErr.message);
            }
        })();

        promises.push(promise);
    });

    await Promise.allSettled(promises);
}
