// server/routes/pickups.js

const express = require('express');
const router = express.Router();
const {
  createPickupRequest,
  getAllPickups,
  getPickupsByUser,
  updatePickupStatus,
} = require('../controllers/pickupController');

router.post('/', createPickupRequest);
router.get('/', getAllPickups);
router.get('/my-pickups/:userId', getPickupsByUser);
router.put('/:id/status', updatePickupStatus);

// This line is crucial!
module.exports = router;