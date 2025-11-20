import { updateTwitchStats, updateTelegramStats } from './dom.js';
import { TableManager } from './table.js';
import { twitchStreamers, telegramChannels, discordServers } from './data.js';
import { renderTwitchRows, renderTelegramRows, renderDiscordRows } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    // Render data
    renderTwitchRows(twitchStreamers);
    renderTelegramRows(telegramChannels);
    renderDiscordRows(discordServers);

    // Initialize tables
    new TableManager('twitchTable', { defaultSortColumn: 1, defaultSortDirection: 'desc' });
    new TableManager('telegramTable', { defaultSortColumn: 1, defaultSortDirection: 'desc' });
    new TableManager('discordTable');

    // Start updates
    updateTwitchStats();
    updateTelegramStats();
});
