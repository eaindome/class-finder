const { Router } = require("express");
const controller = require('./controller');

const router = Router();


router.post("/login", controller.userLogin);
router.get("/profile", controller.userProfile);
router.post("/logout", controller.userLogout);
router.post('/signup', controller.userSignUp);

module.exports = router;