const express = require('express');
const { getAllAvailableLectureRooms } = require('./controller');

const router = express.Router();

// Route to get all available lecture rooms
router.get('/', getAllAvailableLectureRooms);

module.exports = router;
