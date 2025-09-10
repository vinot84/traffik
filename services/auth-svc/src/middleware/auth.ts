import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { UserModel } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyAccessToken(token);
    
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.is_active) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};