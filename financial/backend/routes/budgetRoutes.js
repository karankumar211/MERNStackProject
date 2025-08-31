import express from 'express';
import { createBudgetPlan } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.post('/plan', createBudgetPlan);

export default router;