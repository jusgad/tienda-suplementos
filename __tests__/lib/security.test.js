/**
 * Tests para SecurityService
 * 
 * @jest-environment node
 */

const SecurityService = require('../../src/lib/security').default;

describe('SecurityService', () => {
  
  describe('JWT Management', () => {
    const testPayload = {
      userId: 'test-user-123',
      email: 'test@example.com',
      role: 'user'
    };

    test('debe generar un token JWT válido', () => {
      const token = SecurityService.generateToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // Header.Payload.Signature
    });

    test('debe verificar un token JWT válido', () => {
      const token = SecurityService.generateToken(testPayload);
      const decoded = SecurityService.verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    test('debe rechazar un token inválido', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = SecurityService.verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });

    test('debe refrescar un token válido', () => {
      const originalToken = SecurityService.generateToken(testPayload);
      const refreshedToken = SecurityService.refreshToken(originalToken);
      
      expect(refreshedToken).toBeDefined();
      expect(refreshedToken).not.toBe(originalToken);
      
      const decoded = SecurityService.verifyToken(refreshedToken);
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
    });
  });

  describe('Password Hashing', () => {
    const testPassword = 'SecurePassword123!';

    test('debe hashear una contraseña', async () => {
      const hashed = await SecurityService.hashPassword(testPassword);
      
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(testPassword);
      expect(hashed.length).toBeGreaterThan(50);
    });

    test('debe verificar una contraseña correcta', async () => {
      const hashed = await SecurityService.hashPassword(testPassword);
      const isValid = await SecurityService.verifyPassword(testPassword, hashed);
      
      expect(isValid).toBe(true);
    });

    test('debe rechazar una contraseña incorrecta', async () => {
      const hashed = await SecurityService.hashPassword(testPassword);
      const isValid = await SecurityService.verifyPassword('wrongpassword', hashed);
      
      expect(isValid).toBe(false);
    });

    test('debe generar contraseñas seguras', () => {
      const password1 = SecurityService.generateSecurePassword();
      const password2 = SecurityService.generateSecurePassword();
      
      expect(password1).toBeDefined();
      expect(password2).toBeDefined();
      expect(password1).not.toBe(password2);
      expect(password1.length).toBe(16);
      expect(password2.length).toBe(16);
    });

    test('debe generar contraseñas de longitud personalizada', () => {
      const length = 24;
      const password = SecurityService.generateSecurePassword(length);
      
      expect(password.length).toBe(length);
    });
  });

  describe('Input Validation', () => {
    test('debe validar emails correctos', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      validEmails.forEach(email => {
        expect(SecurityService.validateEmail(email)).toBe(true);
      });
    });

    test('debe rechazar emails inválidos', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        '',
        'a'.repeat(250) + '@domain.com' // Muy largo
      ];

      invalidEmails.forEach(email => {
        expect(SecurityService.validateEmail(email)).toBe(false);
      });
    });

    test('debe validar contraseñas seguras', () => {
      const result = SecurityService.validatePassword('SecurePass123!');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('debe rechazar contraseñas débiles', () => {
      const weakPasswords = [
        'short',           // Muy corta
        'nouppercase123!', // Sin mayúsculas
        'NOLOWERCASE123!', // Sin minúsculas
        'NoNumbers!',      // Sin números
        'NoSpecialChars123' // Sin caracteres especiales
      ];

      weakPasswords.forEach(password => {
        const result = SecurityService.validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    test('debe sanitizar input malicioso', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'DROP TABLE users;',
        '<img src="x" onerror="alert(1)">',
        'test"onmouseover="alert(1)"'
      ];

      maliciousInputs.forEach(input => {
        const sanitized = SecurityService.sanitizeInput(input);
        expect(sanitized).not.toContain('<');
        expect(sanitized).not.toContain('>');
        expect(sanitized).not.toContain('"');
        expect(sanitized).not.toContain("'");
      });
    });
  });

  describe('Rate Limiting', () => {
    const testIdentifier = 'test-ip-123';

    beforeEach(() => {
      // Limpiar rate limit store antes de cada test
      SecurityService.rateLimitStore?.clear?.();
    });

    test('debe permitir requests dentro del límite', () => {
      const maxRequests = 5;
      
      for (let i = 0; i < maxRequests; i++) {
        const allowed = SecurityService.checkRateLimit(testIdentifier, maxRequests, 60000);
        expect(allowed).toBe(true);
      }
    });

    test('debe bloquear requests que exceden el límite', () => {
      const maxRequests = 3;
      
      // Hacer requests hasta el límite
      for (let i = 0; i < maxRequests; i++) {
        SecurityService.checkRateLimit(testIdentifier, maxRequests, 60000);
      }
      
      // El siguiente request debe ser bloqueado
      const blocked = SecurityService.checkRateLimit(testIdentifier, maxRequests, 60000);
      expect(blocked).toBe(false);
    });

    test('debe obtener estado del rate limit', () => {
      const maxRequests = 10;
      
      // Hacer algunos requests
      SecurityService.checkRateLimit(testIdentifier, maxRequests, 60000);
      SecurityService.checkRateLimit(testIdentifier, maxRequests, 60000);
      
      const status = SecurityService.getRateLimitStatus(testIdentifier);
      expect(status.remaining).toBe(8); // 10 - 2 = 8
      expect(status.resetTime).toBeDefined();
    });
  });

  describe('2FA', () => {
    test('debe generar configuración 2FA', () => {
      const setup = SecurityService.generate2FASecret();
      
      expect(setup.secret).toBeDefined();
      expect(setup.qrCodeUrl).toContain('otpauth://');
      expect(setup.backupCodes).toHaveLength(8);
      expect(setup.backupCodes[0]).toMatch(/^[A-F0-9]{8}$/);
    });

    test('debe verificar token 2FA en desarrollo', () => {
      // En desarrollo, el código 123456 siempre debe funcionar
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const isValid = SecurityService.verify2FAToken('testsecret', '123456');
      expect(isValid).toBe(true);
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Encryption/Decryption', () => {
    const testData = 'sensitive information';

    test('debe cifrar y descifrar datos correctamente', () => {
      const encrypted = SecurityService.encrypt(testData);
      const decrypted = SecurityService.decrypt(encrypted);
      
      expect(encrypted).not.toBe(testData);
      expect(decrypted).toBe(testData);
      expect(encrypted).toContain(':'); // IV:encrypted format
    });

    test('debe usar clave personalizada', () => {
      const customKey = 'custom-encryption-key-32-chars-long';
      
      const encrypted = SecurityService.encrypt(testData, customKey);
      const decrypted = SecurityService.decrypt(encrypted, customKey);
      
      expect(decrypted).toBe(testData);
    });
  });

  describe('Session Management', () => {
    test('debe generar IDs de sesión únicos', () => {
      const sessionId1 = SecurityService.generateSessionId();
      const sessionId2 = SecurityService.generateSessionId();
      
      expect(sessionId1).toBeDefined();
      expect(sessionId2).toBeDefined();
      expect(sessionId1).not.toBe(sessionId2);
      expect(sessionId1.length).toBe(64); // 32 bytes = 64 hex chars
    });

    test('debe generar tokens CSRF únicos', () => {
      const token1 = SecurityService.generateCSRFToken();
      const token2 = SecurityService.generateCSRFToken();
      
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(48); // 24 bytes = 48 hex chars
    });
  });

  describe('Security Logging', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('debe registrar eventos de seguridad', () => {
      SecurityService.logSecurityEvent({
        type: 'LOGIN',
        userId: 'test-user',
        ip: '192.168.1.1'
      });

      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain('Security Event');
    });
  });

  describe('IP Blocking', () => {
    const testIP = '192.168.1.100';

    beforeEach(() => {
      // Limpiar IPs bloqueadas
      SecurityService.blockedIPs?.clear?.();
      SecurityService.suspiciousActivity?.clear?.();
    });

    test('debe bloquear IP manualmente', () => {
      SecurityService.blockIP(testIP, 1000); // 1 segundo para test
      
      expect(SecurityService.isIPBlocked(testIP)).toBe(true);
    });

    test('debe desbloquear IP después del tiempo especificado', (done) => {
      SecurityService.blockIP(testIP, 100); // 100ms
      
      expect(SecurityService.isIPBlocked(testIP)).toBe(true);
      
      setTimeout(() => {
        expect(SecurityService.isIPBlocked(testIP)).toBe(false);
        done();
      }, 150);
    });

    test('debe bloquear IP después de actividades sospechosas', () => {
      // Reportar 5 actividades sospechosas (límite para bloqueo)
      for (let i = 0; i < 5; i++) {
        SecurityService.reportSuspiciousActivity(testIP);
      }
      
      expect(SecurityService.isIPBlocked(testIP)).toBe(true);
    });
  });
});

module.exports = SecurityService;