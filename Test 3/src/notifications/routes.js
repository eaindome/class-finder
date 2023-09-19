const express = require('express');
const controller = require('./controller');

const router = express.Router();

// Route for updating notification preference
router.put('/notification-preference', controller.updateNotificationPreference);

// Route for receiving the device token
router.post('/device-token', controller.receiveDeviceToken);

module.exports = router;
