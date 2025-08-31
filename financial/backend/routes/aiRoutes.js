import express from 'express';
// This import statement now correctly finds the exported functions
import { getAiChatResponse, getSettingsAnalysis } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, getAiChatResponse);
router.post('/analyze-settings', protect, getSettingsAnalysis);

export default router;