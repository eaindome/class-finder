const { Router } = require("express");
const controller = require('./controller');

const router = Router();

router.post('/rooms/favorite', controller.favoriteRoom);
router.post('/rooms/bookmark', controller.bookmarkRoom);

module.exports = router;