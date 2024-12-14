import express from 'express';
import { calculateMatch } from '../controllers/matchController.js';

const router = express.Router();

// 定义路由
router.post('/calculate-match', calculateMatch);

export default router;