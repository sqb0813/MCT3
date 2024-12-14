import express from 'express';
import cors from 'cors';
import matchRoutes from './routes/match.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// CORS 配置
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], // 允许的前端地址
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // OPTION 预检请求缓存时间
}));

// 中间件
app.use(express.json());

// 路由
app.use('/api', matchRoutes);

// 错误处理
app.use(errorHandler);

export default app; 