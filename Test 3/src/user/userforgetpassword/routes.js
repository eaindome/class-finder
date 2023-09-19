const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.post('/forgot-password', controller.forgotPassword);
router.get('/reset-password/:email/:token', controller.resetPasswordPage);
router.post('/reset-password/:email/:token', controller.resetPassword); 

module.exports = router;


