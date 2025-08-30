// ===== EMAIL SERVICE - ASTROKEY =====

// Configuración del servicio de emails
const EMAIL_CONFIG = {
    // Puedes usar servicios como EmailJS, SendGrid, o tu propio backend
    SERVICE_ID: 'service_astrokey', // Reemplazar con tu Service ID de EmailJS
    TEMPLATE_ID: 'template_premium_welcome', // Reemplazar con tu Template ID
    USER_ID: 'user_astrokey', // Reemplazar con tu User ID
    FROM_EMAIL: 'noreply@astrokey.com',
    FROM_NAME: 'AstroKey'
};

// Clase principal del servicio de emails
class EmailService {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    // Inicializar el servicio
    async init() {
        try {
            // Verificar si EmailJS está disponible
            if (typeof emailjs !== 'undefined') {
                emailjs.init(EMAIL_CONFIG.USER_ID);
                this.isInitialized = true;
                console.log('✅ EmailJS inicializado correctamente');
            } else {
                console.warn('⚠️ EmailJS no está disponible, usando modo simulado');
                this.isInitialized = false;
            }
        } catch (error) {
            console.error('❌ Error al inicializar EmailJS:', error);
            this.isInitialized = false;
        }
    }

    // Enviar email de bienvenida premium (ÚNICO EMAIL)
    async sendPremiumWelcomeEmail(userData, testResults) {
        const templateParams = {
            to_email: userData.email,
            to_name: userData.firstName || 'Usuario',
            from_name: EMAIL_CONFIG.FROM_NAME,
            signo_solar: testResults.sunSign || 'No disponible',
            elemento: testResults.dominantElement || 'No disponible',
            ascendente: testResults.ascendant || 'No disponible',
            signo_lunar: testResults.moonSign || 'No disponible',
            dashboard_url: `${window.location.origin}/dashboard.html`,
            message: `¡Bienvenido a AstroKey Premium, ${userData.firstName || 'Usuario'}! 

Tu pago de €0.50 ha sido confirmado y ya tienes acceso completo a tu carta astral personalizada.

🌟 Tu Carta Astral:
• Signo Solar: ${testResults.sunSign || 'No disponible'}
• Elemento Dominante: ${testResults.dominantElement || 'No disponible'}
• Ascendente: ${testResults.ascendant || 'No disponible'}
• Signo Lunar: ${testResults.moonSign || 'No disponible'}

🔐 Para acceder a tu dashboard premium, crea tu contraseña:
1. Haz clic en el botón de abajo
2. Crea una contraseña segura
3. Accede a tu dashboard completo

⚠️ IMPORTANTE: Tu suscripción de €19.99/mes se activará en 2 días si no la cancelas.

¡Disfruta de tu experiencia astrológica premium! ✨🔮`
        };

        return this.sendEmail(templateParams);
    }

    // Método principal para enviar email
    async sendEmail(templateParams) {
        try {
            if (!this.isInitialized) {
                // Modo simulado si EmailJS no está disponible
                return this.simulateEmail(templateParams);
            }

            // Enviar email real con EmailJS
            const response = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams
            );

            console.log('✅ Email premium enviado correctamente:', response);
            return { success: true, messageId: response.text };

        } catch (error) {
            console.error('❌ Error al enviar email premium:', error);
            
            // Fallback a modo simulado
            return this.simulateEmail(templateParams);
        }
    }

    // Simular envío de email (para desarrollo y fallback)
    simulateEmail(templateParams) {
        console.log('📧 [SIMULADO] Email premium enviado a:', templateParams.to_email);
        console.log('📝 Contenido:', templateParams.message);
        
        // Simular delay de envío
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    messageId: `simulated_${Date.now()}`,
                    simulated: true 
                });
            }, 1000);
        });
    }

    // Verificar estado del servicio
    getStatus() {
        return {
            initialized: this.isInitialized,
            service: this.isInitialized ? 'EmailJS' : 'Simulado',
            config: EMAIL_CONFIG
        };
    }
}

// Instancia global del servicio de emails
const emailService = new EmailService();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
} else {
    window.EmailService = EmailService;
    window.emailService = emailService;
}
