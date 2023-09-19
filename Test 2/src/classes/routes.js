const { Router } = require("express");
const controller = require('./controller');
//const comingClass = require('./upcomingClasses/upcomingClasses')
//const classStatus = require('./classStatus/getClassStatus');
//const { upcomingClasses } = require("./queries");

const router = Router();

router.get("/", controller.getClassStatus)

module.exports = router;