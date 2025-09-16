import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly secret = process.env.CSRF_SECRET || 'your-csrf-secret-key';
  private readonly tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours

  use(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF for GET requests and safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Skip CSRF for auth endpoints
    if (req.path.startsWith('/auth/')) {
      return next();
    }

    const token = req.headers['x-csrf-token'] as string;
    const sessionId = req.headers['x-session-id'] as string;

    if (!token || !sessionId) {
      throw new UnauthorizedException('CSRF token and session ID required');
    }

    if (!this.validateToken(token, sessionId)) {
      throw new UnauthorizedException('Invalid CSRF token');
    }

    next();
  }

  private validateToken(token: string, sessionId: string): boolean {
    try {
      const [timestamp, hash] = token.split('.');
      const expectedHash = crypto
        .createHmac('sha256', this.secret)
        .update(sessionId + timestamp)
        .digest('hex');

      const tokenTime = parseInt(timestamp);
      const now = Date.now();

      return (
        hash === expectedHash &&
        (now - tokenTime) < this.tokenExpiry
      );
    } catch {
      return false;
    }
  }

  static generateToken(sessionId: string): string {
    const timestamp = Date.now().toString();
    const secret = process.env.CSRF_SECRET || 'your-csrf-secret-key';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(sessionId + timestamp)
      .digest('hex');
    
    return `${timestamp}.${hash}`;
  }
}
