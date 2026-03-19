// server/routes/products.js

import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// We will add authentication middleware later to protect admin routes
// const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only route
// For now it's public, we will protect it later
router.post("/", createProduct);

export default router;
