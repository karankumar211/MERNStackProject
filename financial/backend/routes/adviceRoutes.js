import express from 'express';
import { getFinancialAdvice } from '../controllers/adviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/advice
 * @desc    Get rule-based financial advice for the logged-in user
 * @access  Private
 */
router.post('/', protect, getFinancialAdvice);

export default router;