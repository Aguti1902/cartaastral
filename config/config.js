/**
 * Configuración global de AstralCoach Pro
 * @author AstralCoach Pro Team
 * @version 1.0.0
 */

const CONFIG = {
    // Configuración de la aplicación
    APP: {
        NAME: 'AstralCoach Pro',
        VERSION: '1.0.0',
        DESCRIPTION: 'Tu guía personal en el viaje astral',
        AUTHOR: 'AstralCoach Pro Team',
        WEBSITE: 'https://astralcoach.com'
    },

    // Configuración de la API
    API: {
        BASE_URL: 'https://api.astralcoach.com',
        VERSION: 'v1',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3
    },

    // Configuración de pagos
    PAYMENT: {
        CURRENCY: 'EUR',
        TRIAL_PRICE: 0.50,
        TRIAL_DAYS: 7,
        PLANS: {
            BASIC: {
                id: 'basic',
                name: 'Plan Básico',
                price: 9.90,
                period: 'month',
                features: [
                    'Carta natal básica',
                    'Predicciones mensuales',
                    'Newsletter astrológico',
                    'Cálculo de signo lunar',
                    'Cálculo de ascendente'
                ]
            },
            PREMIUM: {
                id: 'premium',
                name: 'Plan Premium',
                price: 19.90,
                period: 'month',
                popular: true,
                features: [
                    'Todo del plan básico',
                    'Carta natal completa',
                    'Predicciones anuales',
                    'Análisis de compatibilidad',
                    '1 consulta en video/mes',
                    'Soporte prioritario'
                ]
            },
            VIP: {
                id: 'vip',
                name: 'Plan VIP',
                price: 39.90,
                period: 'month',
                features: [
                    'Todo del plan premium',
                    'Consultas ilimitadas en video',
                    'Análisis de relaciones tóxicas',
                    'Numerología personalizada',
                    'Astrólogo personal asignado',
                    'Reportes semanales'
                ]
            }
        }
    },

    // Configuración de notificaciones
    NOTIFICATIONS: {
        AUTO_HIDE_DELAY: 5000,
        POSITION: 'top-right',
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },

    // Configuración de validación
    VALIDATION: {
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 100,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MIN_PASSWORD_LENGTH: 8,
        CARD_NUMBER_LENGTH: 16
    },

    // Configuración de animaciones
    ANIMATIONS: {
        DURATION: 300,
        EASING: 'ease-in-out',
        ZODIAC_ROTATION_SPEED: 60
    },

    // Configuración de responsive
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1200
    },

    // Configuración de colores
    COLORS: {
        PRIMARY: '#6366f1',
        SECONDARY: '#f59e0b',
        ACCENT: '#ef4444',
        SUCCESS: '#10b981',
        WARNING: '#f59e0b',
        ERROR: '#ef4444',
        INFO: '#3b82f6',
        DARK: '#1f2937',
        LIGHT: '#f9fafb',
        WHITE: '#ffffff'
    },

    // Configuración de fuentes
    FONTS: {
        PRIMARY: 'Poppins, sans-serif',
        SECONDARY: 'Georgia, serif',
        MONOSPACE: 'Monaco, Consolas, monospace'
    },

    // Configuración de z-index
    Z_INDEX: {
        MODAL: 2000,
        NOTIFICATION: 3000,
        LOADING: 4000,
        HEADER: 1000
    },

    // Configuración de localStorage
    STORAGE_KEYS: {
        USER_PREFERENCES: 'astralcoach_preferences',
        SELECTED_PLAN: 'astralcoach_selected_plan',
        BIRTH_DATA: 'astralcoach_birth_data',
        SESSION_TOKEN: 'astralcoach_session_token'
    },

    // Configuración de errores
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
        VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
        PAYMENT_ERROR: 'Error en el procesamiento del pago.',
        GENERIC_ERROR: 'Ha ocurrido un error inesperado.',
        SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    },

    // Configuración de éxito
    SUCCESS_MESSAGES: {
        SUBSCRIPTION_ACTIVATED: '¡Suscripción activada exitosamente!',
        CHART_GENERATED: '¡Tu carta astral está lista!',
        PAYMENT_PROCESSED: 'Pago procesado correctamente.',
        DATA_SAVED: 'Datos guardados exitosamente.',
        EMAIL_SENT: 'Email enviado correctamente.'
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Configuración de desarrollo
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    CONFIG.API.BASE_URL = 'http://localhost:3000';
    CONFIG.DEBUG = true;
}
