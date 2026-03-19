// server/routes/chatbot.js

import express from "express";
import { askChatbot } from "../controllers/chartbot.controller.js";

const router = express.Router();

router.post("/ask", askChatbot);

export default router;
