import Goal from '../models/Goal.js';

// @desc    Get all goals for a user
// @route   GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ targetDate: 'asc' });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const { goalName, targetAmount, targetDate, currentAmount } = req.body;

    if (!goalName || !targetAmount || !targetDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newGoal = new Goal({
      userId: req.user.id,
      goalName,
      targetAmount,
      targetDate,
      currentAmount,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an existing goal
// @route   PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Ensure the goal belongs to the logged-in user
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Ensure the goal belongs to the logged-in user
    if (goal.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Goal removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Calculate monthly SIP (Systematic Investment Plan)
// @route   POST /api/goals/sip-plan
export const calculateSip = (req, res) => {
  const { targetAmount, durationInYears, rateOfReturn = 12 } = req.body; // Default 12% annual return

  if (!targetAmount || !durationInYears) {
    return res.status(400).json({ message: 'Target amount and duration are required' });
  }

  // SIP Formula: P = S * (r / ( (1+r)^n - 1 ))
  const futureValue = parseFloat(targetAmount);
  const annualRate = parseFloat(rateOfReturn) / 100;
  const monthlyRate = annualRate / 12;
  const numberOfMonths = parseFloat(durationInYears) * 12;

  if (monthlyRate === 0) {
    const monthlySip = futureValue / numberOfMonths;
    return res.json({ monthlySip: monthlySip.toFixed(2) });
  }

  const monthlySip = futureValue * (monthlyRate / (Math.pow(1 + monthlyRate, numberOfMonths) - 1));

  res.status(200).json({
    monthlySip: monthlySip.toFixed(2)
  });
};

// @desc    Calculate the duration to reach a goal
// @route   POST /api/goals/calculate-duration
export const calculateDuration = async (req, res) => {
    const { targetAmount, monthlySaving } = req.body;
    const currentAmount = req.body.currentAmount || 0;
  
    if (!targetAmount || !monthlySaving) {
      return res.status(400).json({ message: 'Target amount and monthly saving are required' });
    }
  
    if (monthlySaving <= 0) {
      return res.status(400).json({ message: 'Monthly saving must be a positive number' });
    }
  
    const amountNeeded = targetAmount - currentAmount;
    if (amountNeeded <= 0) {
      return res.json({ months: 0, years: 0, message: "You've already reached this goal!" });
    }
  
    const monthsRequired = Math.ceil(amountNeeded / monthlySaving);
    const yearsRequired = (monthsRequired / 12).toFixed(1);
  
    res.status(200).json({ months: monthsRequired, years: yearsRequired });
  };