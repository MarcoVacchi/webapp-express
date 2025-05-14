const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')

const movieController = require('../controllers/movieController');

//index;
router.get('/', movieController.index);

router.post('/:id/reviews', movieController.storeReview);

router.post('/', upload.single('image'), movieController.store);

//show;
router.get('/:id', movieController.show);

module.exports = router;