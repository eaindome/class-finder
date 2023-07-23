const express = require('express');
const { getAllOngoingSessions } = require('./controller');

const router = express.Router();

// Route to get all ongoing sessions
router.get('/', getAllOngoingSessions);

module.exports = router;
