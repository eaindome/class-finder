const { Router } = require("express");
const upcomingClasses = require('./upcomingClasses');

const router = Router();
/*
router.get("/", (req, res) => {
    // Handle the logic for the route
    classStatus.getClassStatus(req, res);
});*/
router.get("/", upcomingClasses.upcomingClasses);

module.exports = router;