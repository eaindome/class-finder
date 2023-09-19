const { Router } = require('express');
const classController = require('./controller');

const router = Router();

router.get('/', classController.updateRoomStatuses);

module.exports = router;
