import Expense from '../models/Expense.js';
import { categorizeExpense } from '../utils/categorizationEngine.js';

// @desc    Add a new expense
// @route   POST /api/expenses
export const addExpense = async (req, res) => {
  try {
    const { amount, note, source, timestamp } = req.body;
    const category = categorizeExpense(note);
    
    const newExpense = new Expense({
      userId: req.user.id, // Comes from protect middleware
      amount,
      note,
      category,
      source,
      timestamp
    });
    
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error: error.message });
  }
};

// @desc    Get user expenses
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};