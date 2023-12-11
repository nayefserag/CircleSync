const Redis = require('ioredis');

const subscriber = new Redis();

const publisher = new Redis();

subscriber.on('connect', () => {
  console.log('Subscriber connected');
});

publisher.on('connect', () => {
  console.log('Publisher connected');  
});

module.exports = {
  subscriber,
  publisher  
};