const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fr', 'ar', 'es'],  // Supported languages
  defaultLocale: 'en',    // Default language
  directory: __dirname + '/locales', // Path to your locales directory
  objectNotation: true    // Allows nested keys in translation files
});

module.exports = i18n;
