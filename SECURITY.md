# Security Implementation Guide

## Overview
This document outlines the comprehensive security measures implemented in the Chrono-Carto application to prevent XSS attacks, SQL injection, CSRF attacks, and other common web vulnerabilities.

## Implemented Security Measures

### 1. XSS (Cross-Site Scripting) Prevention

#### Backend
- **Input Sanitization**: All user inputs are sanitized using DOMPurify
- **Content Security Policy**: Strict CSP headers prevent script execution
- **Output Encoding**: All dynamic content is properly encoded

#### Frontend
- **HTML Sanitization**: `sanitizeHtml()` function removes dangerous HTML tags
- **Input Validation**: All form inputs are validated before submission
- **CSP Headers**: Content Security Policy prevents inline script execution

### 2. SQL Injection Prevention

#### Backend
- **Parameterized Queries**: All database queries use TypeORM's query builder
- **Input Validation**: SQL injection patterns are detected and blocked
- **Guard Implementation**: `SqlInjectionGuard` scans all requests for malicious patterns

#### Database
- **Prepared Statements**: All queries use prepared statements
- **TypeORM ORM**: Object-Relational Mapping prevents direct SQL construction

### 3. CSRF (Cross-Site Request Forgery) Protection

#### Backend
- **CSRF Middleware**: Validates CSRF tokens on state-changing operations
- **Token Generation**: Secure token generation with HMAC
- **Session Validation**: Tokens are tied to user sessions

#### Frontend
- **Token Management**: Automatic CSRF token generation and inclusion
- **Secure API Calls**: All API calls include CSRF tokens

### 4. Security Headers

#### Backend Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: [strict policy]
Permissions-Policy: [restrictive permissions]
```

#### Frontend Headers
- Same security headers applied via Next.js configuration
- Additional CSP directives for frontend-specific resources

### 5. Rate Limiting

#### Backend
- **Rate Limiter Middleware**: 100 requests per 15-minute window per IP
- **Headers**: Rate limit information included in responses
- **Cleanup**: Automatic cleanup of expired rate limit data

### 6. Input Validation and Sanitization

#### Backend
- **Class Validator**: Comprehensive validation using decorators
- **Whitelist Mode**: Only allowed properties are processed
- **Type Safety**: Strict type checking and transformation

#### Frontend
- **Client-side Validation**: Real-time input validation
- **Pattern Matching**: Regex patterns for email, phone, password validation
- **Length Limits**: Maximum input lengths enforced

### 7. Authentication and Authorization

#### JWT Security
- **Secure Secret**: Strong JWT secret key
- **Token Expiration**: 1-hour token lifetime
- **Role-based Access**: User roles properly validated

#### Password Security
- **Bcrypt Hashing**: Passwords hashed with bcrypt
- **Strength Requirements**: Minimum password complexity
- **Reset Security**: Secure password reset tokens

### 8. File Upload Security

#### Backend
- **File Type Validation**: Only allowed file types accepted
- **Size Limits**: Maximum file size restrictions
- **Path Sanitization**: Safe file path generation
- **Virus Scanning**: File content validation

#### Frontend
- **Client Validation**: File type and size validation before upload
- **Secure Upload**: Secure API calls for file uploads

## Usage Examples

### Backend Security Usage

```typescript
// Apply SQL injection guard to controller
@UseGuards(SqlInjectionGuard)
@Controller('users')
export class UsersController {
  // Controller methods
}

// Use input sanitizer in service
@Injectable()
export class UserService {
  constructor(private sanitizer: InputSanitizer) {}
  
  async createUser(userData: any) {
    const sanitizedData = {
      name: this.sanitizer.sanitizeText(userData.name),
      email: this.sanitizer.sanitizeEmail(userData.email),
    };
    // Process sanitized data
  }
}
```

### Frontend Security Usage

```typescript
// Use secure API calls
import { secureAPI } from '@/lib/secure-api';

// Secure GET request
const users = await secureAPI.get('/users');

// Secure POST request with sanitization
const newUser = await secureAPI.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Input validation
import { validateInput, sanitizeHtml } from '@/lib/security';

const isValidEmail = validateInput(email, 'email');
const safeHtml = sanitizeHtml(userInput);
```

## Environment Variables

Add these to your `.env` file:

```env
# Security
CSRF_SECRET=your-very-secure-csrf-secret-key
JWT_SECRET=your-very-secure-jwt-secret-key

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Installation

Install required security packages:

```bash
# Backend
npm install helmet isomorphic-dompurify

# Frontend (already included in Next.js)
# No additional packages needed
```

## Testing Security

### Manual Testing
1. Try XSS payloads in input fields
2. Attempt SQL injection in search/input fields
3. Test CSRF by making requests without tokens
4. Verify rate limiting by making many requests

### Automated Testing
```bash
# Run security tests
npm run test:security

# Run linting for security issues
npm run lint:security
```

## Monitoring and Logging

### Security Events
- Failed authentication attempts
- Rate limit violations
- SQL injection attempts
- XSS attempts
- CSRF token mismatches

### Logging
All security events are logged with:
- Timestamp
- IP address
- User ID (if authenticated)
- Event type
- Request details

## Best Practices

1. **Always validate input** on both client and server
2. **Use parameterized queries** for all database operations
3. **Implement proper error handling** without exposing sensitive information
4. **Keep dependencies updated** to patch security vulnerabilities
5. **Use HTTPS** in production
6. **Regular security audits** of the codebase
7. **Monitor logs** for suspicious activity

## Incident Response

If a security incident is detected:

1. **Immediate**: Block the offending IP address
2. **Investigate**: Check logs for the attack vector
3. **Patch**: Fix the vulnerability
4. **Notify**: Inform users if data was compromised
5. **Review**: Update security measures to prevent similar attacks

## Contact

For security-related questions or to report vulnerabilities:
- Email: security@chrono-carto.com
- Create an issue in the repository
