const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');

//index;
router.get('/', movieController.index);

router.post('/id/reviews', movieController.storeReview)

//show;
router.get('/:id', movieController.show);

module.exports = router;