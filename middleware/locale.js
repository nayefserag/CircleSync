const il8n = require('../Localization/il8n.js');

function getlanguage() {
    const preferredLanguage = req.headers['accept-language'] || 'en';
    il8n.setLocale(preferredLanguage);

    return il8n;
}
module.exports = getlanguage;