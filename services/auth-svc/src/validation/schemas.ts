import Joi from 'joi';
import { CreateUserRequest, LoginRequest } from '../types/auth';

export const registerSchema = Joi.object<CreateUserRequest>({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('admin', 'officer', 'user').required().messages({
    'any.only': 'Role must be admin, officer, or user',
    'any.required': 'Role is required'
  }),
  firstName: Joi.string().max(100).optional(),
  lastName: Joi.string().max(100).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).max(20).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  badgeNumber: Joi.string().max(50).when('role', {
    is: Joi.string().valid('admin', 'officer'),
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }).messages({
    'any.required': 'Badge number is required for admin and officer roles',
    'any.unknown': 'Badge number is not allowed for user role'
  }),
  department: Joi.string().max(100).when('role', {
    is: Joi.string().valid('admin', 'officer'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'any.required': 'Department is required for admin and officer roles'
  })
});

export const loginSchema = Joi.object<LoginRequest>({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required'
  })
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required'
  }),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.min': 'New password must be at least 8 characters long',
    'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'New password is required'
  })
});