import { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { UserModel } from '../models/User';
import { validateBody } from '../middleware/validation';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from '../validation/schemas';

const router = Router();

/**
 * @swagger
 * /auth/v1/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [admin, officer, user]
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               badgeNumber:
 *                 type: string
 *               department:
 *                 type: string
 */
router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const authResponse = await AuthService.register(req.body);
    
    res.status(201).json({
      message: 'User registered successfully',
      data: authResponse
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});

/**
 * @swagger
 * /auth/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 */
router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const authResponse = await AuthService.login(req.body);
    
    res.json({
      message: 'Login successful',
      data: authResponse
    });
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Login failed'
    });
  }
});

/**
 * @swagger
 * /auth/v1/auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 */
router.post('/refresh', validateBody(refreshTokenSchema), async (req, res) => {
  try {
    const tokens = await AuthService.refreshAccessToken(req.body.refreshToken);
    
    res.json({
      message: 'Token refreshed successfully',
      data: tokens
    });
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Token refresh failed'
    });
  }
});

/**
 * @swagger
 * /auth/v1/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 */
router.post('/logout', authenticate, validateBody(refreshTokenSchema), async (req, res) => {
  try {
    await AuthService.logout(req.body.refreshToken);
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Logout failed'
    });
  }
});

/**
 * @swagger
 * /auth/v1/auth/logout-all:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout from all devices
 *     security:
 *       - BearerAuth: []
 */
router.post('/logout-all', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    await AuthService.logoutAll(req.user!.userId);
    
    res.json({
      message: 'Logged out from all devices'
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Logout failed'
    });
  }
});

/**
 * @swagger
 * /auth/v1/auth/change-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Change user password
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 */
router.post('/change-password', authenticate, validateBody(changePasswordSchema), async (req: AuthenticatedRequest, res) => {
  try {
    await AuthService.changePassword(
      req.user!.userId,
      req.body.currentPassword,
      req.body.newPassword
    );
    
    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Password change failed'
    });
  }
});

/**
 * @swagger
 * /auth/v1/auth/profile:
 *   get:
 *     tags: [Authentication]
 *     summary: Get user profile
 *     security:
 *       - BearerAuth: []
 */
router.get('/profile', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await UserModel.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password_hash, ...profile } = user;
    
    res.json({
      message: 'Profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to retrieve profile'
    });
  }
});

/**
 * @swagger
 * /auth/v1/auth/users:
 *   get:
 *     tags: [User Management]
 *     summary: Get all users (Admin only)
 *     security:
 *       - BearerAuth: []
 */
router.get('/users', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { role } = req.query;
    let users;

    if (role && typeof role === 'string') {
      users = await UserModel.findByRole(role as any);
    } else {
      users = await UserModel.findByRole('user');
      const officers = await UserModel.findByRole('officer');
      const admins = await UserModel.findByRole('admin');
      users = [...users, ...officers, ...admins];
    }

    const sanitizedUsers = users.map(user => {
      const { password_hash, ...sanitizedUser } = user;
      return sanitizedUser;
    });

    res.json({
      message: 'Users retrieved successfully',
      data: sanitizedUsers
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to retrieve users'
    });
  }
});

export default router;