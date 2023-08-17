const mongoose = require('mongoose');
const config = require('../config');
const winston =require('winston')
module.exports = function(app) { 
    mongoose.connect(config.database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true ,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(config.server.port, () => {
            console.log(`Running on port ${config.server.port}!`);
        });
    })
    .catch((err) => winston.info('Error connecting to MongoDB:', err));
  
     
}