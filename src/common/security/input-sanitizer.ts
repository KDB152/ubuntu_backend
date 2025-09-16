import { Injectable } from '@nestjs/common';
import * as DOMPurify from 'isomorphic-dompurify';

@Injectable()
export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });
  }

  /**
   * Sanitize plain text input
   */
  sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  /**
   * Sanitize SQL input (basic protection)
   */
  sanitizeSql(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/['";\\]/g, '') // Remove dangerous SQL characters
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comments start
      .replace(/\*\//g, '') // Remove block comments end
      .trim();
  }

  /**
   * Validate and sanitize email
   */
  sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      return '';
    }
    
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }
    
    return sanitized;
  }

  /**
   * Validate and sanitize phone number
   */
  sanitizePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') {
      return '';
    }
    
    const sanitized = phone.replace(/[^\d+\-\s()]/g, '').trim();
    
    if (sanitized.length < 8 || sanitized.length > 20) {
      throw new Error('Invalid phone number format');
    }
    
    return sanitized;
  }
}
