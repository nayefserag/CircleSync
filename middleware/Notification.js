const FCM = require('fcm-node');
// const senderId = process.env.SERVER_KEY;
const serverKey = process.env.SERVER_KEY;

exports.Follownotification = (req, res, next) => {
  const fcm = new FCM(serverKey);
  const message = {
    to: req.headers['auth-token'], 
    notification: {
      title: 'New Follower',
      body: 'You have a new follower!',
      sound: 'default',
      click_action: 'FLUTTER_NOTIFICATION_CLICK', 
      icon: 'fcm_push_icon',
    },
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.error('Error sending FCM message:', err);
    } else {
      console.log('FCM message sent successfully:', response);
    }
  });

  next();
};