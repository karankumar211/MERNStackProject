import express from "express";
// Add 'updateUserDetails' to this import list
import {
  getUserProfile,
  getMoneyPersona,
  updateUserDetails,
  getInflationHistory,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// GET /api/user/me
router.get("/me", getUserProfile);

// GET /api/user/persona
router.get("/persona", getMoneyPersona);

// PUT /api/user/details
router.put("/details", updateUserDetails);
router.get("/inflation-history", getInflationHistory);

export default router;
