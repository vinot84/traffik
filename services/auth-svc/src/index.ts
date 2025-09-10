import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/auth';
import logger from './utils/logger';
import { RefreshTokenModel } from './models/RefreshToken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:8080',
    'capacitor://localhost'
  ],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later'
  }
});
app.use('/v1/auth', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many authentication attempts, please try again later'
  }
});
app.use('/v1/auth/login', authLimiter);
app.use('/v1/auth/register', authLimiter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'auth-svc'
  });
});

app.use('/v1/auth', authRoutes);

setupSwagger(app);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error);
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

const cleanup = async () => {
  logger.info('🧹 Cleaning up expired refresh tokens...');
  await RefreshTokenModel.cleanupExpiredTokens();
};

setInterval(cleanup, 60 * 60 * 1000);

const startServer = async () => {
  try {
    app.listen(port, () => {
      logger.info(`🚀 Auth service running on port ${port}`);
      logger.info(`📚 API documentation: http://localhost:${port}/docs`);
      logger.info(`🏥 Health check: http://localhost:${port}/health`);
    });

    await cleanup();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

startServer();