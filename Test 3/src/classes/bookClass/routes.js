const express = require('express');
const { cancelRoomBooking, getAvailableTimes, getAvailableTimesCurrent, bookClassNow, bookClassLater, bookClassLaterDay, getBookedRooms } = require('./controller');

const router = express.Router();

router.get('/getBookedRooms', getBookedRooms);
router.post('/bookNow/:roomId', bookClassNow);
router.post('/bookLater/:roomId', bookClassLater);
router.post('/bookLaterDay/:roomId', bookClassLaterDay);
router.put('/cancel/:roomId', cancelRoomBooking);
router.get('/availableTimes/:roomId/:day', getAvailableTimes);
router.get('/getAvailableTimesCurrent/:roomId', getAvailableTimesCurrent);

module.exports = router;

