const { Router } = require("express");
const controller = require('./c');

const router = Router();

router.post("/", controller.userLogin);
router.get("/:id", controller.userProfile);


module.exports = router;