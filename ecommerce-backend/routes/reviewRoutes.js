const express = require('express');
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:id/reviews', protect, addReview);
router.get('/:id/reviews', getProductReviews);

module.exports = router;