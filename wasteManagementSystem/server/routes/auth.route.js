import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/profile",getUserProfile )

export default router;
