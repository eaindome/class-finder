const admin = require('../Firebase Database/firebase'); // Path to your firebase.js file

// Function to send push notification
function sendPushNotification(token, title, body) {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent push notification:', response);
    })
    .catch((error) => {
      console.error('Error sending push notification:', error);
    });
}

module.exports = {
  sendPushNotification,
};
