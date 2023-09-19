const { Router } = require('express');
const classController = require('./controller');

const router = Router();

router.post('/:timetableId', classController.bookClass);

module.exports = router;

