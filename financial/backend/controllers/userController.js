import User from '../models/User.js';
import Expense from '../models/Expense.js';

/**
 * @desc    Get user profile including financial details
 * @route   GET /api/user/me
 */
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      moneyPersona: user.moneyPersona,
      income: user.income,
      inflationRate: user.inflationRate,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


/**
 * @desc    Calculate and return the user's money persona
 * @route   GET /api/user/persona
 */
export const getMoneyPersona = async (req, res) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentExpenses = await Expense.find({
      userId: userId,
      timestamp: { $gte: thirtyDaysAgo },
    });

    let persona = 'Balanced';
    const totalSpent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const transactionCount = recentExpenses.length;

    if (transactionCount > 20 && totalSpent > 15000) {
      persona = 'Impulsive';
    } else if (transactionCount < 5 && totalSpent < 5000) {
      persona = 'Saver';
    } else if (transactionCount > 15 && totalSpent <= 15000) {
      persona = 'Planner';
    }

    const user = await User.findByIdAndUpdate(userId, { moneyPersona: persona }, { new: true });
    res.json({ moneyPersona: user.moneyPersona });

  } catch (error) {
    console.error('Error calculating money persona:', error);
    res.status(500).json({ message: 'Server error while calculating persona.' });
  }
};


/**
 * @desc    Update user details like income and inflation rate
 * @route   PUT /api/user/details
 */
export const updateUserDetails = async (req, res) => {
  try {
    const { income, inflationRate } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (income !== undefined) {
      user.income = parseFloat(income);
    }
    if (inflationRate !== undefined) {
      user.inflationRate = parseFloat(inflationRate);
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      income: updatedUser.income,
      inflationRate: updatedUser.inflationRate,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get historical inflation rate data
 * @route   GET /api/user/inflation-history
 */
export const getInflationHistory = async (req, res) => {
  // For this example, we'll use a static dataset representing recent years in India.
  // In a real-world app, this data could be fetched from a live financial data API.
  const inflationData = [
    { year: 2019, rate: 3.73 },
    { year: 2020, rate: 6.62 },
    { year: 2021, rate: 5.13 },
    { year: 2022, rate: 6.70 },
    { year: 2023, rate: 5.69 },
    { year: 2024, rate: 4.85 },
  ];
  res.status(200).json(inflationData);
};