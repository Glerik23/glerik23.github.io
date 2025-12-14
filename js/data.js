/**
 * Static data for portfolio tables
 * @module data
 */

// ============================================
// Tag Factory Functions
// ============================================

/**
 * Create a position tag object
 * @param {'moderator'|'admin'|'owner'} type - Position type
 * @returns {Object} Position tag with text and class
 */
const positionTag = (type) => {
    const tags = {
        moderator: { text: 'Moderator', class: 'tag-moderator' },
        admin: { text: 'Administrator', class: 'tag-admin' },
        owner: { text: 'Owner', class: 'tag-owner' }
    };
    return tags[type] || tags.moderator;
};

/**
 * Create a status tag object
 * @param {'active'|'closed'} status - Status type
 * @returns {Object} Status tag with text and class
 */
const statusTag = (status) => {
    const tags = {
        active: { text: 'Active', class: 'tag-active' },
        closed: { text: 'Closed', class: 'tag-closed' }
    };
    return tags[status] || tags.active;
};

// ============================================
// Twitch Streamers
// ============================================

export const twitchStreamers = [
    {
        id: '1139750398',
        streamer: 'Yamahaaa_',
        originalName: 'Yamahaaa_',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/c71cd09d-1748-48eb-956b-e23719d3a056-profile_image-150x150.png',
        followers: 857,
        position: positionTag('moderator'),
        date: '01/09/2025 →',
        status: statusTag('active')
    },
    {
        id: '467589920',
        streamer: 'inekorai',
        originalName: 'Am0o__',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e2c89bcc-0c4d-410b-a0ab-9edbe5577886-profile_image-300x300.png',
        followers: 13,
        position: positionTag('moderator'),
        date: '10/10/2025 →',
        status: statusTag('active')
    },
    {
        id: '1032577762',
        streamer: 'Faby_morel',
        originalName: 'Faby_morel',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/1284b338-d85e-4214-8c09-a711651b1354-profile_image-70x70.png',
        followers: 496,
        position: positionTag('moderator'),
        date: '17/04/2025 →',
        status: statusTag('active')
    },
    {
        id: '842923605',
        streamer: 'Hamilthone',
        originalName: 'Hamilthone',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/2e1f4e5b-9a87-40d5-91d8-24655d8ea2a8-profile_image-150x150.png',
        followers: 8100,
        position: positionTag('admin'),
        date: '11/02/2024 →',
        status: statusTag('active')
    },
    {
        id: '1008883345',
        streamer: 'shoyo4ka',
        originalName: 'shoyo4ka',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e69bce4f-904c-45f9-8751-ffb7df5ff855-profile_image-600x600.png',
        followers: 142,
        position: positionTag('moderator'),
        date: '08/12/2025 →',
        status: statusTag('active')
    },
    {
        id: '726895581',
        streamer: 'sunako_krhshk',
        originalName: 'Mattrahersha',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/92472019-995a-410a-a952-c9a05f91c818-profile_image-70x70.png',
        followers: 200,
        position: positionTag('moderator'),
        date: '03/03/2025 → 18/06/2025',
        status: statusTag('closed')
    }
];

// ============================================
// Telegram Channels
// ============================================

export const telegramChannels = [
    {
        channel: 'excusemebr0',
        avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/2e1f4e5b-9a87-40d5-91d8-24655d8ea2a8-profile_image-150x150.png',
        members: 30000,
        position: positionTag('admin'),
        date: '13/09/2023 →',
        status: statusTag('active')
    }
];

// ============================================
// Discord Servers
// ============================================

export const discordServers = [
    {
        name: 'Hamilthone',
        avatar: 'https://glerik.notion.site/image/https%3A%2F%2Fcdn.discordapp.com%2Ficons%2F1147741446800166982%2Fa823302adc0ba0eab2cddf6476bbe009.webp%3Fsize%3D1024%26format%3Dwebp%26width%3D0%26height%3D256?table=block&id=8b471a57-f5b5-43a3-b793-d816d9c7838f&spaceId=aabc614a-b225-4edb-9d49-0e241b01313c&width=60&userId=&cache=v2',
        members: 400,
        position: positionTag('moderator'),
        date: '13/09/2023 →',
        status: statusTag('active')
    },
    {
        name: 'Reltor Server',
        avatar: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        members: 100,
        position: positionTag('moderator'),
        date: '20/10/2020 → 20/08/2021',
        status: statusTag('closed')
    },
    {
        name: 'STARCLUB',
        avatar: 'https://glerik.notion.site/image/https%3A%2F%2Fcdn.discordapp.com%2Ficons%2F868839759513010236%2Fe8d974ad0c7c2ee0d520120e7cd7f479.webp%3Fsize%3D1024%26format%3Dwebp%26width%3D0%26height%3D256?table=block&id=aa96c945-1292-4a27-892c-28b420a233be&spaceId=aabc614a-b225-4edb-9d49-0e241b01313c&width=60&userId=&cache=v2',
        members: 200,
        position: positionTag('moderator'),
        date: '15/10/2022 → 24/06/2023',
        status: statusTag('closed')
    },
    {
        name: '[RUS] Terra Incognita',
        avatar: 'https://glerik.notion.site/image/https%3A%2F%2Fcdn.discordapp.com%2Ficons%2F718459818175627346%2F3d480715ae7970ef95f502e8f6f98098.webp%3Fsize%3D1024%26format%3Dwebp%26width%3D0%26height%3D256?table=block&id=7c9b0b1d-5553-4cfa-bb9f-87d671ed7d7c&spaceId=aabc614a-b225-4edb-9d49-0e241b01313c&width=60&userId=&cache=v2',
        members: 200,
        position: positionTag('owner'),
        date: '05/06/2020 → 07/09/2021',
        status: statusTag('closed')
    },
    {
        name: '[CIS] Cat RP',
        avatar: 'https://glerik.notion.site/image/https%3A%2F%2Fcdn.discordapp.com%2Ficons%2F732344217636044921%2F49eb835e5552e091ac60b6c776b1b096.webp%3Fsize%3D512?table=block&id=9ace9f07-3564-4351-ad11-b1a9b68d0bb5&spaceId=aabc614a-b225-4edb-9d49-0e241b01313c&width=60&userId=&cache=v2',
        members: 200,
        position: positionTag('owner'),
        date: '14/09/2020 → 20/09/2022',
        status: statusTag('closed')
    },
    {
        name: 'RUS Server',
        avatar: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        members: 500,
        position: positionTag('admin'),
        date: '18/09/2018 → 26/11/2020',
        status: statusTag('closed')
    }
];
