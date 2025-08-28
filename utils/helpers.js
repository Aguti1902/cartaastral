/**
 * Utilidades y funciones helper para AstralCoach Pro
 * @author AstralCoach Pro Team
 * @version 1.0.0
 */

/**
 * Utilidades para manejo de fechas
 */
const DateUtils = {
    /**
     * Formatea una fecha en formato legible
     * @param {Date} date - Fecha a formatear
     * @param {string} locale - Locale para el formato
     * @returns {string} Fecha formateada
     */
    formatDate: (date, locale = 'es-ES') => {
        if (!date) return '';
        
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Date(date).toLocaleDateString(locale, options);
    },

    /**
     * Calcula la edad basada en la fecha de nacimiento
     * @param {string} birthDate - Fecha de nacimiento
     * @returns {number} Edad calculada
     */
    calculateAge: (birthDate) => {
        if (!birthDate) return 0;
        
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    /**
     * Verifica si una fecha es válida
     * @param {string} dateString - String de fecha a validar
     * @returns {boolean} True si la fecha es válida
     */
    isValidDate: (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },

    /**
     * Obtiene el día de la semana en español
     * @param {Date} date - Fecha
     * @returns {string} Día de la semana
     */
    getDayOfWeek: (date) => {
        const days = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles',
            'Jueves', 'Viernes', 'Sábado'
        ];
        return days[date.getDay()];
    }
};

/**
 * Utilidades para validación
 */
const ValidationUtils = {
    /**
     * Valida un email
     * @param {string} email - Email a validar
     * @returns {boolean} True si el email es válido
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Valida un número de teléfono
     * @param {string} phone - Teléfono a validar
     * @returns {boolean} True si el teléfono es válido
     */
    isValidPhone: (phone) => {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        return phoneRegex.test(phone);
    },

    /**
     * Valida un número de tarjeta de crédito
     * @param {string} cardNumber - Número de tarjeta
     * @returns {boolean} True si la tarjeta es válida
     */
    isValidCardNumber: (cardNumber) => {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        if (cleanNumber.length < 13 || cleanNumber.length > 19) {
            return false;
        }
        
        // Algoritmo de Luhn
        let sum = 0;
        let isEven = false;
        
        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    },

    /**
     * Valida un CVV
     * @param {string} cvv - CVV a validar
     * @returns {boolean} True si el CVV es válido
     */
    isValidCVV: (cvv) => {
        return /^\d{3,4}$/.test(cvv);
    },

    /**
     * Valida una fecha de expiración
     * @param {string} expiryDate - Fecha de expiración (MM/AA)
     * @returns {boolean} True si la fecha es válida
     */
    isValidExpiryDate: (expiryDate) => {
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            return false;
        }
        
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expMonth = parseInt(month);
        const expYear = parseInt(year);
        
        if (expMonth < 1 || expMonth > 12) {
            return false;
        }
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }
        
        return true;
    }
};

/**
 * Utilidades para manejo de strings
 */
const StringUtils = {
    /**
     * Capitaliza la primera letra de cada palabra
     * @param {string} str - String a capitalizar
     * @returns {string} String capitalizado
     */
    capitalize: (str) => {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    /**
     * Trunca un string a una longitud específica
     * @param {string} str - String a truncar
     * @param {number} length - Longitud máxima
     * @param {string} suffix - Sufijo a añadir
     * @returns {string} String truncado
     */
    truncate: (str, length = 100, suffix = '...') => {
        if (!str || str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },

    /**
     * Genera un slug a partir de un string
     * @param {string} str - String a convertir
     * @returns {string} Slug generado
     */
    slugify: (str) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Formatea un número con separadores de miles
     * @param {number} num - Número a formatear
     * @param {string} locale - Locale para el formato
     * @returns {string} Número formateado
     */
    formatNumber: (num, locale = 'es-ES') => {
        return new Intl.NumberFormat(locale).format(num);
    }
};

/**
 * Utilidades para manejo de arrays
 */
const ArrayUtils = {
    /**
     * Elimina duplicados de un array
     * @param {Array} array - Array a limpiar
     * @returns {Array} Array sin duplicados
     */
    removeDuplicates: (array) => {
        return [...new Set(array)];
    },

    /**
     * Agrupa elementos de un array por una propiedad
     * @param {Array} array - Array a agrupar
     * @param {string} key - Propiedad para agrupar
     * @returns {Object} Objeto con grupos
     */
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },

    /**
     * Ordena un array por múltiples criterios
     * @param {Array} array - Array a ordenar
     * @param {Array} sortKeys - Array de criterios de ordenación
     * @returns {Array} Array ordenado
     */
    multiSort: (array, sortKeys) => {
        return array.sort((a, b) => {
            for (const { key, order = 'asc' } of sortKeys) {
                if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
};

/**
 * Utilidades para manejo de objetos
 */
const ObjectUtils = {
    /**
     * Clona un objeto de forma profunda
     * @param {Object} obj - Objeto a clonar
     * @returns {Object} Objeto clonado
     */
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => ObjectUtils.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = ObjectUtils.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },

    /**
     * Combina múltiples objetos
     * @param {...Object} objects - Objetos a combinar
     * @returns {Object} Objeto combinado
     */
    merge: (...objects) => {
        return objects.reduce((result, obj) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        result[key] = ObjectUtils.merge(result[key] || {}, obj[key]);
                    } else {
                        result[key] = obj[key];
                    }
                }
            }
            return result;
        }, {});
    },

    /**
     * Verifica si un objeto está vacío
     * @param {Object} obj - Objeto a verificar
     * @returns {boolean} True si el objeto está vacío
     */
    isEmpty: (obj) => {
        if (obj === null || obj === undefined) return true;
        if (typeof obj === 'string') return obj.trim().length === 0;
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    }
};

/**
 * Utilidades para manejo de localStorage
 */
const StorageUtils = {
    /**
     * Guarda datos en localStorage
     * @param {string} key - Clave
     * @param {*} value - Valor a guardar
     */
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    /**
     * Obtiene datos de localStorage
     * @param {string} key - Clave
     * @param {*} defaultValue - Valor por defecto
     * @returns {*} Valor guardado o valor por defecto
     */
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Elimina datos de localStorage
     * @param {string} key - Clave
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    /**
     * Limpia todo el localStorage
     */
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

/**
 * Utilidades para manejo de cookies
 */
const CookieUtils = {
    /**
     * Establece una cookie
     * @param {string} name - Nombre de la cookie
     * @param {string} value - Valor de la cookie
     * @param {number} days - Días de expiración
     */
    set: (name, value, days = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    /**
     * Obtiene una cookie
     * @param {string} name - Nombre de la cookie
     * @returns {string} Valor de la cookie o cadena vacía
     */
    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return '';
    },

    /**
     * Elimina una cookie
     * @param {string} name - Nombre de la cookie
     */
    remove: (name) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

/**
 * Utilidades para manejo de URLs
 */
const URLUtils = {
    /**
     * Obtiene parámetros de la URL
     * @returns {Object} Objeto con los parámetros
     */
    getParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    /**
     * Añade parámetros a la URL
     * @param {Object} params - Parámetros a añadir
     */
    addParams: (params) => {
        const url = new URL(window.location);
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
        window.history.pushState({}, '', url);
    },

    /**
     * Verifica si la URL actual coincide con un patrón
     * @param {string} pattern - Patrón a verificar
     * @returns {boolean} True si coincide
     */
    matchesPattern: (pattern) => {
        const regex = new RegExp(pattern);
        return regex.test(window.location.pathname);
    }
};

/**
 * Utilidades para manejo de eventos
 */
const EventUtils = {
    /**
     * Añade un event listener con opciones
     * @param {Element} element - Elemento
     * @param {string} event - Tipo de evento
     * @param {Function} handler - Manejador del evento
     * @param {Object} options - Opciones del evento
     */
    addListener: (element, event, handler, options = {}) => {
        element.addEventListener(event, handler, options);
    },

    /**
     * Elimina un event listener
     * @param {Element} element - Elemento
     * @param {string} event - Tipo de evento
     * @param {Function} handler - Manejador del evento
     */
    removeListener: (element, event, handler) => {
        element.removeEventListener(event, handler);
    },

    /**
     * Dispara un evento personalizado
     * @param {Element} element - Elemento
     * @param {string} eventName - Nombre del evento
     * @param {Object} detail - Detalles del evento
     */
    trigger: (element, eventName, detail = {}) => {
        const event = new CustomEvent(eventName, { detail });
        element.dispatchEvent(event);
    }
};

// Exportar todas las utilidades
const Utils = {
    Date: DateUtils,
    Validation: ValidationUtils,
    String: StringUtils,
    Array: ArrayUtils,
    Object: ObjectUtils,
    Storage: StorageUtils,
    Cookie: CookieUtils,
    URL: URLUtils,
    Event: EventUtils
};

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else if (typeof window !== 'undefined') {
    window.Utils = Utils;
}
