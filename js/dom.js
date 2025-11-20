import { fetchTwitchAvatar, fetchTwitchFollowers, fetchTelegramData } from './api.js';

export function updateTwitchStats() {
    const rows = document.querySelectorAll('#twitchTable tbody tr');

    rows.forEach(row => {
        const streamer = row.dataset.streamer;

        if (!streamer) return;

        // Nickname history logic
        const originalName = row.dataset.originalName;
        if (originalName && streamer.toLowerCase() !== originalName.toLowerCase()) {
            const link = row.querySelector('.streamer-link');
            let textContainer = link.querySelector('div');

            if (!textContainer) {
                const nameSpan = link.querySelector('span');
                if (nameSpan) {
                    // Wrap span in div
                    const div = document.createElement('div');
                    link.replaceChild(div, nameSpan);
                    div.appendChild(nameSpan);
                    textContainer = div;
                }
            }

            if (textContainer && !textContainer.querySelector('.old-name')) {
                const oldNameSpan = document.createElement('span');
                oldNameSpan.className = 'old-name';
                oldNameSpan.textContent = `ex. ${originalName}`;
                textContainer.appendChild(oldNameSpan);
            }
        }

        // Update Avatar
        fetchTwitchAvatar(streamer)
            .then(avatarUrl => {
                if (avatarUrl && !avatarUrl.includes('Error')) {
                    const img = row.querySelector('.table-avatar');
                    if (img) img.src = avatarUrl;
                }
            })
            .catch(err => console.error(`Failed to update avatar for ${streamer}:`, err));

        // Update Follower Count
        fetchTwitchFollowers(streamer)
            .then(followers => {
                if (followers && !followers.includes('Error')) {
                    const formattedFollowers = followers.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    const countCell = row.querySelector('.follower-count');
                    if (countCell) countCell.textContent = formattedFollowers;
                }
            })
            .catch(err => console.error(`Failed to update followers for ${streamer}:`, err));
    });
}

export async function updateTelegramStats() {
    const rows = document.querySelectorAll('#telegramTable tbody tr');
    const promises = [];

    rows.forEach(row => {
        const channel = row.dataset.telegram;
        if (!channel) return;

        const promise = (async () => {
            const htmlContent = await fetchTelegramData(channel);
            if (!htmlContent) return;

            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, "text/html");

                // 1. Avatar
                const avatarImg = doc.querySelector('img.tgme_page_photo_image');
                if (avatarImg) {
                    const img = row.querySelector('.table-avatar');
                    if (img) img.src = avatarImg.src;
                }

                // 2. Channel Title
                const titleDiv = doc.querySelector('.tgme_page_title');
                if (titleDiv) {
                    const titleText = titleDiv.textContent.trim();
                    const nameSpan = row.querySelector('.table-cell-with-avatar span');
                    if (nameSpan && titleText) {
                        nameSpan.textContent = titleText;
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
                            countCell.textContent = rawCount.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                        } else {
                            countCell.textContent = text;
                        }
                    }
                }
            } catch (parseErr) {
                console.error(`Error parsing Telegram data for ${channel}:`, parseErr);
            }
        })();

        promises.push(promise);
    });

    await Promise.allSettled(promises);
}
