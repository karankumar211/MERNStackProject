// server/controllers/pickupController.js

const Pickup = require('../models/Pickup');

// @desc    Create a new pickup request
// @route   POST /api/pickups
// @access  Private (User)
exports.createPickupRequest = async (req, res) => {
  // In a real app, the user ID would come from a JWT token after login.
  // For now, we'll imagine it's sent in the request body for testing.
  const { userId, address, wasteQuantity } = req.body;

  if (!userId || !address || !wasteQuantity) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newPickup = new Pickup({
      user: userId,
      address,
      wasteQuantity,
    });

    const pickup = await newPickup.save();
    res.status(201).json(pickup);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all pickup requests
// @route   GET /api/pickups
// @access  Private (Admin/Agent)
exports.getAllPickups = async (req, res) => {
  try {
    // We use .populate() to get the user's name and email instead of just the ID
    const pickups = await Pickup.find({}).populate('user', 'name email');
    res.json(pickups);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
exports.getPickupsByUser = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(pickups);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
// @desc    Update pickup status
// @route   PUT /api/pickups/:id/status
// @access  Private (Admin/Agent)
exports.updatePickupStatus = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // Update the status from the request body
    pickup.status = req.body.status || pickup.status;

    // In a real app, if status is 'Completed', you would also add logic here
    // to calculate and award reward points to the user.
    // For the hackathon, we'll keep it simple.

    const updatedPickup = await pickup.save();
    res.json(updatedPickup);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};