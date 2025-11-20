const fs = require('fs');
const path = require('path');
const https = require('https');

const dataFilePath = path.join(__dirname, '../js/data.js');

// Helper to fetch data
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function updateStreamers() {
    console.log('Starting streamer update check...');

    let fileContent = fs.readFileSync(dataFilePath, 'utf8');

    // Regex to find streamer objects with IDs
    // Matches: { ... id: '123', ... streamer: 'Name', ... }
    // We need to be careful to capture the ID and the current streamer name

    // Simple regex to find all IDs and their current streamer names in the file
    const streamerRegex = /id:\s*'(\d+)',\s*streamer:\s*'([^']+)'/g;

    let match;
    let updates = 0;

    // We need to collect all matches first to avoid issues with modifying the string while iterating
    const matches = [];
    while ((match = streamerRegex.exec(fileContent)) !== null) {
        matches.push({
            fullMatch: match[0],
            id: match[1],
            currentName: match[2],
            index: match.index
        });
    }

    for (const item of matches) {
        try {
            console.log(`Checking ID ${item.id} (${item.currentName})...`);
            const data = await fetchData(`https://api.ivr.fi/v2/twitch/user?id=${item.id}`);

            if (data && data[0] && data[0].login) {
                const newName = data[0].login; // ivr returns lowercase login usually, but let's check display name if needed. 
                // Actually, for URLs we usually want the login name.
                // Let's use the login name but preserve case if possible? 
                // Twitch API returns login (lowercase) and displayName (cased). 
                // Our data.js uses cased names. 
                // Let's use displayName if available, or login.
                const actualName = data[0].displayName || data[0].login;

                if (actualName.toLowerCase() !== item.currentName.toLowerCase()) {
                    console.log(`UPDATE FOUND: ${item.currentName} -> ${actualName}`);

                    // Replace in file content
                    // We use a specific regex for this replacement to ensure we only target this specific entry
                    // We look for the specific ID and the specific streamer name following it
                    const specificRegex = new RegExp(`id:\\s*'${item.id}',\\s*streamer:\\s*'${item.currentName}'`);
                    fileContent = fileContent.replace(specificRegex, `id: '${item.id}',\n        streamer: '${actualName}'`);
                    updates++;
                } else {
                    console.log(`No change for ${item.currentName}`);
                }
            }
        } catch (err) {
            console.error(`Error checking ${item.currentName}:`, err.message);
        }
    }

    if (updates > 0) {
        console.log(`Updating data.js with ${updates} changes...`);
        fs.writeFileSync(dataFilePath, fileContent);
    } else {
        console.log('No updates needed.');
    }
}

updateStreamers();
