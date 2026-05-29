import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'GDCH_DIBRUGARH_SUPER_SECRET_TOKEN_KEY_2026';
const COOKIE_NAME = 'admin_session';

export interface AdminSession {
  id: number;
  username: string;
  role: string;
}

export function signToken(payload: Omit<AdminSession, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch (error) {
    return null;
  }
}

export function getSession(req: NextRequest): AdminSession | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getCookieConfig() {
  return {
    name: COOKIE_NAME,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 8, // 8 Hours
      path: '/',
    }
  };
}
