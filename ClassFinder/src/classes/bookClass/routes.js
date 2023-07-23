const express = require('express');
const { cancelRoomBooking, getAvailableTimes, getAvailableTimesCurrent, bookClassNow, bookClassLater, bookClassLaterDay, getBookedRooms } = require('./controller');

const router = express.Router();

router.get('/getBookedRooms', getBookedRooms);
router.post('/bookNow/:roomName', bookClassNow);
router.post('/bookLater/:roomName', bookClassLater);
router.post('/bookLaterDay/:roomName', bookClassLaterDay);
router.put('/cancel/:roomName', cancelRoomBooking);
router.get('/availableTimes/:roomName/:day', getAvailableTimes);
router.get('/getAvailableTimesCurrent/:roomName', getAvailableTimesCurrent);

module.exports = router;

