import express from 'express';
import { askChatbot } from '../controllers/chatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This handles the '/ask' part of the URL for a POST request.
router.post('/ask', protect, askChatbot);

export default router;