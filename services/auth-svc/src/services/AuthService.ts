import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';
import { CreateUserRequest, LoginRequest, AuthResponse, User } from '../types/auth';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
  private static readonly REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';
  private static readonly BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

  static async register(userData: CreateUserRequest): Promise<AuthResponse> {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(userData.password, this.BCRYPT_ROUNDS);
    
    const user = await UserModel.create({
      ...userData,
      password_hash: passwordHash
    });

    const tokens = await this.generateTokens(user);
    
    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  static async login(loginData: LoginRequest): Promise<AuthResponse> {
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const storedToken = await RefreshTokenModel.findByTokenHash(tokenHash);
    
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const user = await UserModel.findById(storedToken.user_id);
    if (!user || !user.is_active) {
      throw new Error('User not found or inactive');
    }

    await RefreshTokenModel.revokeToken(tokenHash);

    const tokens = await this.generateTokens(user);
    return tokens;
  }

  static async logout(refreshToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await RefreshTokenModel.revokeToken(tokenHash);
  }

  static async logoutAll(userId: string): Promise<void> {
    await RefreshTokenModel.revokeAllUserTokens(userId);
  }

  static verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, this.BCRYPT_ROUNDS);
    await UserModel.updateById(userId, { password_hash: newPasswordHash });
    
    await RefreshTokenModel.revokeAllUserTokens(userId);
  }

  private static async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + this.parseExpirationTime(this.REFRESH_EXPIRES_IN));
    
    await RefreshTokenModel.create(user.id, refreshTokenHash, expiresAt);

    return { accessToken, refreshToken };
  }

  private static parseExpirationTime(expiration: string): number {
    const match = expiration.match(/^(\d+)([dhms])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      case 's': return value * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  private static sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}