const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Cart is handled on frontend with localStorage
// This route is a placeholder for future server-side cart implementation

router.get('/', protect, (req, res) => {
  res.json({ message: 'Cart routes - implement server-side cart if needed' });
});

module.exports = router;