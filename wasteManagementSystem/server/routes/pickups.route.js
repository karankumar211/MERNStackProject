// server/routes/pickups.js

import express from "express";
import {
  createPickupRequest,
  getAllPickups,
  getPickupsByUser,
  updatePickupStatus,
} from "../controllers/pickup.controller.js";

const router = express.Router();

router.post("/", createPickupRequest);
router.get("/", getAllPickups);
router.get("/my-pickups/:userId", getPickupsByUser);
router.put("/:id/status", updatePickupStatus);

export default router;
