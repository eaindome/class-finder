const { Router } = require('express');
const classController = require('./controller');

const router = Router();

router.get('/update-class-status', classController.updateClassStatus);

module.exports = router;
