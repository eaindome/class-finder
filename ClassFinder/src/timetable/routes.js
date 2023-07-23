const express = require('express');
const { getTimetable } = require('./controller');

const router = express.Router();

router.get('/', getTimetable);

module.exports = router;
