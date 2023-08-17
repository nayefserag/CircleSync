const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    // Server configuration
    server: {
      port: process.env.PORT ,

    },
    // Database configuration
    database: {
    url: process.env.DB_CONNECTION_URI 

    },
  
    // Authentication configuration
    auth: {
      secretKey: process.env.JWT_SECRET 
      ,tokenName: process.env.TOKEN_NAME

    },
  
    // Email configuration
    email: {
      // SMTP or other email settings
    },
  };
  