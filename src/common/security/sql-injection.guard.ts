import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SqlInjectionGuard implements CanActivate {
  private readonly dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /([\'\";].*[\'\";])/g,
    /(\-\-|\#|\/\*|\*\/)/g,
    /(\bUNION\b.*\bSELECT\b)/gi,
    /(\bEXEC\b|\bEXECUTE\b)/gi,
    /(\bSCRIPT\b)/gi,
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const { body, query, params } = request;

    // Check request body
    if (body && this.containsSqlInjection(body)) {
      throw new BadRequestException('Invalid input detected');
    }

    // Check query parameters
    if (query && this.containsSqlInjection(query)) {
      throw new BadRequestException('Invalid query parameters');
    }

    // Check URL parameters
    if (params && this.containsSqlInjection(params)) {
      throw new BadRequestException('Invalid URL parameters');
    }

    return true;
  }

  private containsSqlInjection(obj: any): boolean {
    if (typeof obj === 'string') {
      return this.checkString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.some(item => this.containsSqlInjection(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(value => this.containsSqlInjection(value));
    }

    return false;
  }

  private checkString(str: string): boolean {
    const normalizedStr = str.replace(/[\s+]/g, ' ').toUpperCase();
    return this.dangerousPatterns.some(pattern => pattern.test(normalizedStr));
  }
}
