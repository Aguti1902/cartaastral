/**
 * Servicio de API para AstralCoach Pro
 * @author AstralCoach Pro Team
 * @version 1.0.0
 */

class ApiService {
    constructor() {
        this.baseURL = window.CONFIG?.API?.BASE_URL || 'https://api.astralcoach.com';
        this.version = window.CONFIG?.API?.VERSION || 'v1';
        this.timeout = window.CONFIG?.API?.TIMEOUT || 30000;
        this.retryAttempts = window.CONFIG?.API?.RETRY_ATTEMPTS || 3;
        this.authToken = this.getAuthToken();
    }

    /**
     * Obtiene el token de autenticación
     * @returns {string|null} Token de autenticación
     */
    getAuthToken() {
        return localStorage.getItem('astralcoach_auth_token') || 
               sessionStorage.getItem('astralcoach_auth_token') || 
               null;
    }

    /**
     * Establece el token de autenticación
     * @param {string} token - Token de autenticación
     * @param {boolean} persistent - Si debe persistir en localStorage
     */
    setAuthToken(token, persistent = true) {
        this.authToken = token;
        if (persistent) {
            localStorage.setItem('astralcoach_auth_token', token);
        } else {
            sessionStorage.setItem('astralcoach_auth_token', token);
        }
    }

    /**
     * Elimina el token de autenticación
     */
    clearAuthToken() {
        this.authToken = null;
        localStorage.removeItem('astralcoach_auth_token');
        sessionStorage.removeItem('astralcoach_auth_token');
    }

    /**
     * Construye la URL completa para la API
     * @param {string} endpoint - Endpoint de la API
     * @returns {string} URL completa
     */
    buildURL(endpoint) {
        return `${this.baseURL}/api/${this.version}${endpoint}`;
    }

    /**
     * Construye los headers de la petición
     * @param {Object} customHeaders - Headers personalizados
     * @returns {Object} Headers de la petición
     */
    buildHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders
        };

        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        return headers;
    }

    /**
     * Realiza una petición HTTP
     * @param {string} method - Método HTTP
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} data - Datos a enviar
     * @param {Object} options - Opciones adicionales
     * @returns {Promise} Promesa con la respuesta
     */
    async request(method, endpoint, data = null, options = {}) {
        const url = this.buildURL(endpoint);
        const headers = this.buildHeaders(options.headers);
        
        const config = {
            method: method.toUpperCase(),
            headers,
            ...options
        };

        if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await this.makeRequest(url, config);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Realiza la petición HTTP con reintentos
     * @param {string} url - URL de la petición
     * @param {Object} config - Configuración de la petición
     * @returns {Promise} Promesa con la respuesta
     */
    async makeRequest(url, config) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                return response;
            } catch (error) {
                lastError = error;
                
                if (error.name === 'AbortError') {
                    console.warn(`Request timeout (attempt ${attempt}/${this.retryAttempts})`);
                } else if (attempt < this.retryAttempts) {
                    console.warn(`Request failed (attempt ${attempt}/${this.retryAttempts}):`, error);
                    await this.delay(1000 * attempt); // Delay exponencial
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Maneja la respuesta de la API
     * @param {Response} response - Respuesta de fetch
     * @returns {Promise} Promesa con los datos procesados
     */
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await this.parseErrorResponse(response);
            throw new ApiError(
                errorData.message || 'Error en la petición',
                response.status,
                errorData
            );
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    }

    /**
     * Parsea la respuesta de error
     * @param {Response} response - Respuesta de fetch
     * @returns {Promise} Promesa con los datos de error
     */
    async parseErrorResponse(response) {
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return { message: response.statusText };
        } catch (error) {
            return { message: response.statusText };
        }
    }

    /**
     * Maneja los errores de la API
     * @param {Error} error - Error capturado
     * @returns {Promise} Promesa rechazada con el error procesado
     */
    handleError(error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error.name === 'AbortError') {
            throw new ApiError('La petición ha expirado', 408);
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new ApiError('Error de conexión. Verifica tu internet.', 0);
        }

        throw new ApiError('Error inesperado en la petición', 500, { originalError: error });
    }

    /**
     * Añade un delay
     * @param {number} ms - Milisegundos a esperar
     * @returns {Promise} Promesa que se resuelve después del delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Métodos HTTP específicos
    async get(endpoint, options = {}) {
        return this.request('GET', endpoint, null, options);
    }

    async post(endpoint, data, options = {}) {
        return this.request('POST', endpoint, data, options);
    }

    async put(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, data, options);
    }

    async patch(endpoint, data, options = {}) {
        return this.request('PATCH', endpoint, data, options);
    }

    async delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, null, options);
    }

    // Métodos específicos de la aplicación
    async login(credentials) {
        return this.post('/auth/login', credentials);
    }

    async register(userData) {
        return this.post('/auth/register', userData);
    }

    async logout() {
        const response = await this.post('/auth/logout');
        this.clearAuthToken();
        return response;
    }

    async refreshToken() {
        return this.post('/auth/refresh');
    }

    async getUserProfile() {
        return this.get('/user/profile');
    }

    async updateUserProfile(profileData) {
        return this.put('/user/profile', profileData);
    }

    async generateAstralChart(birthData) {
        return this.post('/astrology/chart', birthData);
    }

    async getAstralChart(chartId) {
        return this.get(`/astrology/chart/${chartId}`);
    }

    async getPredictions(userId, period = 'monthly') {
        return this.get(`/astrology/predictions/${userId}?period=${period}`);
    }

    async getCompatibility(userData, partnerData) {
        return this.post('/astrology/compatibility', {
            user: userData,
            partner: partnerData
        });
    }

    async createSubscription(subscriptionData) {
        return this.post('/subscriptions', subscriptionData);
    }

    async getSubscription(subscriptionId) {
        return this.get(`/subscriptions/${subscriptionId}`);
    }

    async cancelSubscription(subscriptionId) {
        return this.delete(`/subscriptions/${subscriptionId}`);
    }

    async updateSubscription(subscriptionId, updateData) {
        return this.patch(`/subscriptions/${subscriptionId}`, updateData);
    }

    async getPaymentMethods() {
        return this.get('/user/payment-methods');
    }

    async addPaymentMethod(paymentData) {
        return this.post('/user/payment-methods', paymentData);
    }

    async removePaymentMethod(methodId) {
        return this.delete(`/user/payment-methods/${methodId}`);
    }

    async getAstrologers() {
        return this.get('/astrologers');
    }

    async getAstrologer(astrologerId) {
        return this.get(`/astrologers/${astrologerId}`);
    }

    async bookConsultation(consultationData) {
        return this.post('/consultations', consultationData);
    }

    async getConsultations(userId) {
        return this.get(`/consultations?user=${userId}`);
    }

    async getConsultation(consultationId) {
        return this.get(`/consultations/${consultationId}`);
    }

    async cancelConsultation(consultationId) {
        return this.delete(`/consultations/${consultationId}`);
    }

    async sendMessage(consultationId, messageData) {
        return this.post(`/consultations/${consultationId}/messages`, messageData);
    }

    async getMessages(consultationId) {
        return this.get(`/consultations/${consultationId}/messages`);
    }

    async uploadFile(file, type = 'document') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        return this.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async getNotifications(userId, unreadOnly = false) {
        return this.get(`/notifications?user=${userId}&unread=${unreadOnly}`);
    }

    async markNotificationAsRead(notificationId) {
        return this.patch(`/notifications/${notificationId}`, { read: true });
    }

    async markAllNotificationsAsRead(userId) {
        return this.patch(`/notifications/mark-all-read`, { userId });
    }

    async getSupportTickets(userId) {
        return this.get(`/support/tickets?user=${userId}`);
    }

    async createSupportTicket(ticketData) {
        return this.post('/support/tickets', ticketData);
    }

    async getSupportTicket(ticketId) {
        return this.get(`/support/tickets/${ticketId}`);
    }

    async updateSupportTicket(ticketId, updateData) {
        return this.patch(`/support/tickets/${ticketId}`, updateData);
    }

    async addTicketComment(ticketId, commentData) {
        return this.post(`/support/tickets/${ticketId}/comments`, commentData);
    }
}

/**
 * Clase de error personalizada para la API
 */
class ApiError extends Error {
    constructor(message, status, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        this.timestamp = new Date();
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiService, ApiError };
} else if (typeof window !== 'undefined') {
    window.ApiService = ApiService;
    window.ApiError = ApiError;
}
