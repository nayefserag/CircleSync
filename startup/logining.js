const config = require('../config');
const winston =require('winston')
require('express-async-errors');
require('winston-mongodb');
module.exports = function() { 
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'unhandled.log' }),
        new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()) }),
        
        );
        
    process.on('unhandledRejection', (err) => {
    throw err;
    });
    
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({
        db: config.database.url,
        level:'info'
    }))
    
}