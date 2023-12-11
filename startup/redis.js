
const {subscriber} = require('../config/redis_config');
const config = require('../config')
var reportsname = [];
module.exports= function(app){
    subscriber.subscribe(config.redis.publisher);
    subscriber.on('message', async (channel, message) => {
      if (reportsname.includes(message)) {
        console.log("Name Is already exists on Server 1");
      }
      else{
        reportsname.push(message);
        console.log(`Received ${message} on ${channel}`);
        }
    })
    console.log("reportsname Array :",reportsname);
    
}
module.exports.reportsname = reportsname;
