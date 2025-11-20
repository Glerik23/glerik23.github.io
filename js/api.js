/**
 * Helper function to fetch with timeout
 * @param {string} url 
 * @param {number} timeout 
 * @returns {Promise<Response>}
 */
export const fetchWithTimeout = (url, timeout = 5000) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
};

export const fetchTwitchAvatar = (streamer) => {
    return fetch(`https://decapi.me/twitch/avatar/${streamer}`)
        .then(response => response.text());
};

export const fetchTwitchFollowers = (streamer) => {
    return fetch(`https://decapi.me/twitch/followcount/${streamer}`)
        .then(response => response.text());
};

export const fetchTelegramData = async (channel) => {
    const targetUrl = `https://t.me/${channel}`;
    const proxies = [
        {
            url: `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${new Date().getTime()}`,
            extract: async (response) => {
                const data = await response.json();
                return data.contents;
            }
        },
        {
            url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
            extract: async (response) => await response.text()
        }
    ];

    try {
        const proxyPromises = proxies.map(async (proxy) => {
            const response = await fetchWithTimeout(proxy.url, 5000);
            if (!response.ok) throw new Error('Network response was not ok');
            return await proxy.extract(response);
        });

        return await Promise.any(proxyPromises);
    } catch (err) {
        console.error(`All proxies failed for ${channel}:`, err);
        return null;
    }
};
