const ghostVersion = require('../../lib/ghost-version');
const settingsCache = require('../../services/settings/cache');
const urlUtils = require('../../../shared/url-utils');
const http = require('http');

require('dotenv').config();
const KDK_GHOST_ACCESS_KEY = process.env.KDK_GHOST_ACCESS_KEY;
const KDK_COMPETITION_API_HOST = process.env.KDK_COMPETITION_API_HOST;

// Thank you https://stackoverflow.com/a/50244236/10974316
const httpGet = url => {
    return new Promise((resolve, reject) => {
        http.get(
            url,
            {
                'headers': {
                    'x-kdk-ghost-access-key': KDK_GHOST_ACCESS_KEY
                }
            },
            res => {
                res.setEncoding('utf8');
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => resolve(body));
            }).on('error', reject);
    });
};

const registrations = {
    docName: 'registrations',

    read: {
        permissions: false,
        options: [
            'page',
            'rows'
        ],
        async query(frame) {
            return JSON.parse(
                await httpGet(
                    `${KDK_COMPETITION_API_HOST}/?page=${frame.options.page}&rows=${frame.options.rows}`
                )
            );
        }
    }
};

module.exports = registrations;
