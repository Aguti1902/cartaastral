/**
 * Pruebas unitarias para validaciones
 * @author AstralCoach Pro Team
 * @version 1.0.0
 */

// Importar utilidades de validación
const { ValidationUtils } = require('../../utils/helpers.js');

describe('ValidationUtils', () => {
    describe('isValidEmail', () => {
        test('debe validar emails correctos', () => {
            expect(ValidationUtils.isValidEmail('test@example.com')).toBe(true);
            expect(ValidationUtils.isValidEmail('user.name@domain.co.uk')).toBe(true);
            expect(ValidationUtils.isValidEmail('test+tag@example.org')).toBe(true);
        });

        test('debe rechazar emails incorrectos', () => {
            expect(ValidationUtils.isValidEmail('invalid-email')).toBe(false);
            expect(ValidationUtils.isValidEmail('test@')).toBe(false);
            expect(ValidationUtils.isValidEmail('@example.com')).toBe(false);
            expect(ValidationUtils.isValidEmail('')).toBe(false);
            expect(ValidationUtils.isValidEmail(null)).toBe(false);
        });
    });

    describe('isValidPhone', () => {
        test('debe validar teléfonos correctos', () => {
            expect(ValidationUtils.isValidPhone('+34 123 456 789')).toBe(true);
            expect(ValidationUtils.isValidPhone('123-456-789')).toBe(true);
            expect(ValidationUtils.isValidPhone('(123) 456-7890')).toBe(true);
            expect(ValidationUtils.isValidPhone('123456789')).toBe(true);
        });

        test('debe rechazar teléfonos incorrectos', () => {
            expect(ValidationUtils.isValidPhone('123')).toBe(false);
            expect(ValidationUtils.isValidPhone('abc')).toBe(false);
            expect(ValidationUtils.isValidPhone('')).toBe(false);
        });
    });

    describe('isValidCardNumber', () => {
        test('debe validar números de tarjeta correctos', () => {
            // Números de tarjeta de prueba válidos
            expect(ValidationUtils.isValidCardNumber('4532015112830366')).toBe(true);
            expect(ValidationUtils.isValidCardNumber('4532 0151 1283 0366')).toBe(true);
        });

        test('debe rechazar números de tarjeta incorrectos', () => {
            expect(ValidationUtils.isValidCardNumber('123')).toBe(false);
            expect(ValidationUtils.isValidCardNumber('12345678901234567890')).toBe(false);
            expect(ValidationUtils.isValidCardNumber('123456789012345')).toBe(false);
        });
    });

    describe('isValidCVV', () => {
        test('debe validar CVV correctos', () => {
            expect(ValidationUtils.isValidCVV('123')).toBe(true);
            expect(ValidationUtils.isValidCVV('1234')).toBe(true);
        });

        test('debe rechazar CVV incorrectos', () => {
            expect(ValidationUtils.isValidCVV('12')).toBe(false);
            expect(ValidationUtils.isValidCVV('12345')).toBe(false);
            expect(ValidationUtils.isValidCVV('abc')).toBe(false);
        });
    });

    describe('isValidExpiryDate', () => {
        test('debe validar fechas de expiración futuras', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            const month = String(futureDate.getMonth() + 1).padStart(2, '0');
            const year = String(futureDate.getFullYear() % 100).padStart(2, '0');
            
            expect(ValidationUtils.isValidExpiryDate(`${month}/${year}`)).toBe(true);
        });

        test('debe rechazar fechas de expiración pasadas', () => {
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            const month = String(pastDate.getMonth() + 1).padStart(2, '0');
            const year = String(pastDate.getFullYear() % 100).padStart(2, '0');
            
            expect(ValidationUtils.isValidExpiryDate(`${month}/${year}`)).toBe(false);
        });

        test('debe rechazar formatos incorrectos', () => {
            expect(ValidationUtils.isValidExpiryDate('13/25')).toBe(false);
            expect(ValidationUtils.isValidExpiryDate('00/25')).toBe(false);
            expect(ValidationUtils.isValidExpiryDate('12/25')).toBe(false);
        });
    });
});
