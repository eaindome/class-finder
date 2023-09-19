const express = require('express');
const { searchRooms } = require('./controller');

const router = express.Router();

// Route to search for lecture rooms
router.get('/search', searchRooms);

module.exports = router;
