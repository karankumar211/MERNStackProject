import express from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  calculateSip,
    calculateDuration,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

/**
 * @route   GET /api/goals
 * @desc    Get all goals for the logged-in user
 * @route   POST /api/goals
 * @desc    Create a new goal for the logged-in user
 */
router.route("/").get(getGoals).post(createGoal);

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a specific goal
 * @route   DELETE /api/goals/:id
 * @desc    Delete a specific goal
 */
router.route("/:id").put(updateGoal).delete(deleteGoal);

/**
 * @route   POST /api/goals/sip-plan
 * @desc    Calculate the monthly SIP needed for a financial target
 */
router.post("/sip-plan", calculateSip);
// ... (keep all existing routes)

// Add this new route at the end, before `export default router;`
router.post("/calculate-duration", calculateDuration);

export default router;
