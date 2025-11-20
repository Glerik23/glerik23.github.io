export function renderTwitchRows(data) {
    const tbody = document.querySelector('#twitchTable tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr data-streamer="${item.streamer}" data-original-name="${item.originalName}">
            <td>
                <div class="table-cell-with-avatar">
                    <a href="https://twitch.tv/${item.streamer}" target="_blank" class="streamer-link">
                        <img src="${item.avatar}" alt="${item.streamer} avatar" class="table-avatar">
                        <span>${item.streamer}</span>
                    </a>
                </div>
            </td>
            <td class="follower-count">${formatNumber(item.followers)}</td>
            <td><span class="tag ${item.position.class}">${item.position.text}</span></td>
            <td>${item.date}</td>
            <td><span class="tag ${item.status.class}">${item.status.text}</span></td>
        </tr>
    `).join('');
}

export function renderTelegramRows(data) {
    const tbody = document.querySelector('#telegramTable tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr data-telegram="${item.channel}">
            <td>
                <div class="table-cell-with-avatar">
                    <a href="https://t.me/${item.channel}" target="_blank" class="streamer-link">
                        <img src="${item.avatar}" alt="${item.channel} avatar" class="table-avatar">
                        <span>${item.channel}</span>
                    </a>
                </div>
            </td>
            <td class="member-count">${formatNumber(item.members)}</td>
            <td><span class="tag ${item.position.class}">${item.position.text}</span></td>
            <td>${item.date}</td>
            <td><span class="tag ${item.status.class}">${item.status.text}</span></td>
        </tr>
    `).join('');
}

export function renderDiscordRows(data) {
    const tbody = document.querySelector('#discordTable tbody');
    if (!tbody) return;

    tbody.innerHTML = data.map(item => `
        <tr>
            <td>
                <div class="table-cell-with-avatar">
                    <img src="${item.avatar}" alt="${item.name} avatar" class="table-avatar">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${formatNumber(item.members)}</td>
            <td><span class="tag ${item.position.class}">${item.position.text}</span></td>
            <td>${item.date}</td>
            <td><span class="tag ${item.status.class}">${item.status.text}</span></td>
        </tr>
    `).join('');
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
