const { Router } = require("express");
const classStatus = require('./getClassStatus');

const router = Router();

router.get("/", classStatus.getClassStatus);

module.exports = router;