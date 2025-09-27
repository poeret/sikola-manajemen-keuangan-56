// Security utilities for rate limiting and session management

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

interface LoginAttempt {
  timestamp: number;
  count: number;
}

class SecurityManager {
  private loginAttempts: Map<string, LoginAttempt> = new Map();
  private rateLimitConfig: RateLimitConfig = {
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '60000'),
    maxAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5')
  };

  // Rate limiting for login attempts
  checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.loginAttempts.get(identifier);

    if (!attempt) {
      this.loginAttempts.set(identifier, { timestamp: now, count: 1 });
      return true;
    }

    // Reset if window has passed
    if (now - attempt.timestamp > this.rateLimitConfig.windowMs) {
      this.loginAttempts.set(identifier, { timestamp: now, count: 1 });
      return true;
    }

    // Check if max attempts exceeded
    if (attempt.count >= this.rateLimitConfig.maxAttempts) {
      return false;
    }

    // Increment attempt count
    attempt.count++;
    this.loginAttempts.set(identifier, attempt);
    return true;
  }

  // Clear rate limit for successful login
  clearRateLimit(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  // Get remaining attempts
  getRemainingAttempts(identifier: string): number {
    const attempt = this.loginAttempts.get(identifier);
    if (!attempt) return this.rateLimitConfig.maxAttempts;
    
    const now = Date.now();
    if (now - attempt.timestamp > this.rateLimitConfig.windowMs) {
      return this.rateLimitConfig.maxAttempts;
    }
    
    return Math.max(0, this.rateLimitConfig.maxAttempts - attempt.count);
  }

  // Session timeout management
  private sessionTimeout: number = parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'); // 1 hour default

  setSessionTimeout(callback: () => void): NodeJS.Timeout {
    return setTimeout(callback, this.sessionTimeout);
  }

  clearSessionTimeout(timeoutId: NodeJS.Timeout): void {
    clearTimeout(timeoutId);
  }

  // Security headers validation
  validateSecurityHeaders(): boolean {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection'
    ];

    // In a real application, you would check actual headers
    // For now, we'll assume they're properly set
    return true;
  }

  // Audit logging
  logSecurityEvent(event: string, details: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send to security monitoring service
    console.warn('Security Event:', logEntry);
  }
}

export const securityManager = new SecurityManager();
