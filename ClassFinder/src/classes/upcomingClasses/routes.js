const { Router } = require('express');
const upcomingClasses = require('./controller');

const router = Router();

router.get('/', upcomingClasses.getUpcomingClass);

module.exports = router;
