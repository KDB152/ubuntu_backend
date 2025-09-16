import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly requests = new Map<string, RateLimitInfo>();
  private readonly maxRequests = 100; // Max requests per window
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = this.getClientId(req);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanupExpiredEntries(now);
    
    const clientData = this.requests.get(clientId);
    
    if (!clientData) {
      // First request from this client
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs
      });
    } else if (now > clientData.resetTime) {
      // Window expired, reset
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs
      });
    } else if (clientData.count >= this.maxRequests) {
      // Rate limit exceeded
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    } else {
      // Increment count
      clientData.count++;
    }
    
    // Add rate limit headers
    const clientInfo = this.requests.get(clientId);
    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - clientInfo.count));
    res.setHeader('X-RateLimit-Reset', new Date(clientInfo.resetTime).toISOString());
    
    next();
  }

  private getClientId(req: Request): string {
    // Use IP address as client identifier
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? (forwarded as string).split(',')[0] : req.connection.remoteAddress;
    return ip || 'unknown';
  }

  private cleanupExpiredEntries(now: number): void {
    for (const [clientId, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(clientId);
      }
    }
  }
}
