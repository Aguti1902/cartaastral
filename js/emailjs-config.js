// ===== EMAILJS CONFIGURATION - ASTROKEY =====

// Configuración para EmailJS
const EMAILJS_CONFIG = {
    // Reemplazar con tus credenciales reales de EmailJS
    SERVICE_ID: 'service_astrokey', // Tu Service ID
    USER_ID: 'user_astrokey', // Tu User ID
    TEMPLATE: 'template_premium_welcome_astrokey' // Tu Template ID
};

// Template HTML para EmailJS - ÚNICO EMAIL
const EMAIL_TEMPLATE = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #6366f1; margin: 0;">🌟 AstroKey Premium</h1>
                <p style="color: #6b7280; margin: 10px 0;">Tu portal al universo astrológico</p>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">¡Bienvenido a AstroKey Premium, {{to_name}}!</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                Tu pago de €0.50 ha sido confirmado y ya tienes acceso completo a tu carta astral personalizada.
            </p>
            
            <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
                <h3 style="color: #8b5cf6; margin-top: 0;">🔮 Tu Carta Astral:</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                        <strong style="color: #8b5cf6;">Signo Solar</strong><br>
                        <span style="color: #374151;">{{signo_solar}}</span>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                        <strong style="color: #8b5cf6;">Elemento</strong><br>
                        <span style="color: #374151;">{{elemento}}</span>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                        <strong style="color: #8b5cf6;">Ascendente</strong><br>
                        <span style="color: #374151;">{{ascendente}}</span>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
                        <strong style="color: #8b5cf6;">Signo Lunar</strong><br>
                        <span style="color: #374151;">{{signo_lunar}}</span>
                    </div>
                </div>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #10b981; margin-top: 0;">🔐 Para acceder a tu dashboard premium:</h3>
                <ol style="color: #374151; line-height: 1.8;">
                    <li>Haz clic en el botón de abajo</li>
                    <li>Crea una contraseña segura</li>
                    <li>Accede a tu dashboard completo</li>
                </ol>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #d97706; margin-top: 0;">⚠️ IMPORTANTE:</h3>
                <p style="color: #92400e; margin: 0;">
                    Tu suscripción de €19.99/mes se activará en 2 días si no la cancelas.
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{dashboard_url}}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                    🔐 Crear Contraseña y Acceder
                </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
                ¡Disfruta de tu experiencia astrológica premium! ✨🔮
            </p>
        </div>
    </div>
`;

// Función para inicializar EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.USER_ID);
        console.log('✅ EmailJS inicializado correctamente');
        return true;
    } else {
        console.warn('⚠️ EmailJS no está disponible');
        return false;
    }
}

// Función para enviar email usando EmailJS
async function sendEmailWithEmailJS(templateParams) {
    try {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS no está disponible');
        }
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE,
            templateParams
        );
        
        console.log('✅ Email premium enviado correctamente:', response);
        return { success: true, messageId: response.text };
        
    } catch (error) {
        console.error('❌ Error al enviar email premium:', error);
        throw error;
    }
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAILJS_CONFIG, EMAIL_TEMPLATE, initEmailJS, sendEmailWithEmailJS };
} else {
    window.EMAILJS_CONFIG = EMAILJS_CONFIG;
    window.EMAIL_TEMPLATE = EMAIL_TEMPLATE;
    window.initEmailJS = initEmailJS;
    window.sendEmailWithEmailJS = sendEmailWithEmailJS;
}
