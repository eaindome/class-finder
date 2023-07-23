const { Router } = require("express");
const controller = require('./controller');

const router = Router();

router.get('/calendar', controller.generateCalendarFile);


module.exports = router;