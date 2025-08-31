import express from 'express';
import { askSimplebot } from '../controllers/simplebotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', protect, askSimplebot);

export default router;