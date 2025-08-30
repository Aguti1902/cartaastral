# 📧 Ejemplos de Uso del Sistema de Emails - AstroKey

## 🚀 Casos de Uso Implementados

### **1. Email de Bienvenida (Después del Test)**

```javascript
// En email-request.html
async function submitEmail() {
    const email = document.getElementById('finalEmail').value;
    
    const userData = {
        email: email,
        firstName: testAnswers.firstName || 'Usuario',
        lastName: testAnswers.lastName || '',
        id: `user_${Date.now()}`
    };
    
    // Enviar email de bienvenida
    const result = await emailService.sendWelcomeEmail(userData);
    
    if (result.success) {
        window.location.href = 'payment.html';
    }
}
```

**Resultado:** Email automático con:
- ✅ Bienvenida personalizada
- ✅ Próximos pasos del proceso
- ✅ Link al dashboard
- ✅ Información sobre la prueba gratuita

### **2. Email de Confirmación de Pago**

```javascript
// En payment.html
async function processPayment() {
    const userData = {
        email: testAnswers.finalEmail,
        firstName: testAnswers.firstName,
        lastName: testAnswers.lastName,
        id: `user_${Date.now()}`
    };
    
    const paymentDetails = {
        amount: '0.50',
        currency: 'EUR',
        method: 'credit-card'
    };
    
    // Enviar confirmación de pago
    const result = await emailService.sendPaymentConfirmationEmail(userData, paymentDetails);
    
    if (result.success) {
        window.location.href = 'results.html';
    }
}
```

**Resultado:** Email con:
- ✅ Confirmación del pago de €0.50
- ✅ Acceso inmediato a resultados
- ✅ ⚠️ Advertencia sobre suscripción automática
- ✅ Instrucciones para cancelar

### **3. Email con Resultados del Test**

```javascript
// En results.html
async function sendResultsEmail() {
    const testResults = {
        sunSign: testAnswers.sunSign || 'Aries',
        dominantElement: testAnswers.dominantElement || 'Fuego',
        ascendant: testAnswers.ascendant || 'Libra',
        moonSign: testAnswers.moonSign || 'Cáncer'
    };
    
    // Enviar email con resultados
    const result = await emailService.sendResultsEmail(userData, testResults);
}
```

**Resultado:** Email con:
- ✅ Carta astral personalizada
- ✅ Signo solar, elemento, ascendente, luna
- ✅ Link al dashboard completo
- ✅ Información adicional disponible

### **4. Email de Recordatorio de Fin de Prueba**

```javascript
// En dashboard.js (cuando quedan 1-2 días)
async function sendTrialReminder() {
    const daysLeft = 1; // Calcular días restantes
    
    const result = await emailService.sendTrialReminderEmail(userData, daysLeft);
}
```

**Resultado:** Email con:
- ⏰ Recordatorio de fin de prueba
- ⚠️ Advertencia de activación automática
- ✅ Opciones para mantener o cancelar
- 🔗 Link directo a configuración

### **5. Email de Activación de Suscripción**

```javascript
// Cuando se activa la suscripción automáticamente
async function sendSubscriptionActivated() {
    const result = await emailService.sendSubscriptionActivatedEmail(userData);
}
```

**Resultado:** Email con:
- 💎 Confirmación de suscripción premium
- 🎁 Lista de beneficios incluidos
- 📅 Información del próximo cobro
- 🔮 Acceso completo a AstroKey

### **6. Email de Soporte**

```javascript
// Cuando un usuario solicita soporte
async function sendSupportRequest() {
    const supportMessage = "Necesito ayuda con mi cuenta...";
    
    const result = await emailService.sendSupportEmail(userData, supportMessage);
}
```

**Resultado:** Email interno con:
- 🆘 Nueva solicitud de soporte
- 👤 Información completa del usuario
- 💬 Mensaje del usuario
- 📅 Fecha y hora de la solicitud

## 🔧 Configuración Avanzada

### **Personalizar Templates**

```javascript
// En js/emailjs-config.js
const EMAIL_TEMPLATES = {
    WELCOME: `
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
            <h1>🌟 AstroKey</h1>
            <p>¡Bienvenido, {{to_name}}!</p>
            <!-- Personalizar colores, estilos, etc. -->
        </div>
    `
};
```

### **Añadir Variables Personalizadas**

```javascript
// En el servicio de emails
const templateParams = {
    to_email: userData.email,
    to_name: userData.firstName,
    custom_variable: 'Valor personalizado',
    dashboard_url: 'https://tuweb.com/dashboard'
};
```

### **Manejo de Errores**

```javascript
try {
    const result = await emailService.sendWelcomeEmail(userData);
    
    if (result.success) {
        console.log('✅ Email enviado:', result.messageId);
        // Continuar con el flujo
    } else {
        console.error('❌ Error al enviar email');
        // Fallback o reintento
    }
} catch (error) {
    console.error('❌ Excepción:', error);
    // Manejar error crítico
}
```

## 📱 Integración en el Flujo de Usuario

### **Flujo Completo de Emails:**

```
1. Usuario completa test → Email de bienvenida
2. Usuario introduce email → Email de bienvenida
3. Usuario paga €0.50 → Email de confirmación de pago
4. Usuario ve resultados → Email con resultados
5. Faltan 2 días para fin de prueba → Email de recordatorio
6. Se activa suscripción → Email de bienvenida premium
7. Usuario solicita soporte → Email interno de soporte
```

### **Timing de Emails:**

| **Momento** | **Email** | **Delay** | **Propósito** |
|-------------|-----------|-----------|---------------|
| **Test completado** | Bienvenida | Inmediato | Guiar al usuario |
| **Pago confirmado** | Confirmación | Inmediato | Confirmar transacción |
| **Resultados vistos** | Resultados | 2 segundos | Recordar acceso |
| **Fin de prueba** | Recordatorio | 1-2 días antes | Evitar sorpresas |
| **Suscripción activa** | Bienvenida premium | Inmediato | Celebrar upgrade |

## 🎨 Personalización Visual

### **Colores de Marca:**

```css
/* Colores principales de AstroKey */
:root {
    --primary-color: #6366f1;    /* Púrpura principal */
    --accent-color: #8b5cf6;     /* Púrpura secundario */
    --success-color: #10b981;    /* Verde éxito */
    --warning-color: #f59e0b;    /* Amarillo advertencia */
    --error-color: #ef4444;      /* Rojo error */
}
```

### **Tipografía:**

```css
/* Fuentes recomendadas */
font-family: 'Poppins', Arial, sans-serif;
font-weight: 400, 500, 600, 700, 800;
```

### **Botones de Acción:**

```html
<!-- Estilo de botones en emails -->
<a href="{{dashboard_url}}" style="
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    padding: 15px 30px;
    text-decoration: none;
    border-radius: 8px;
    display: inline-block;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
">
    🚀 Acceder a mi Dashboard
</a>
```

## 🔍 Testing y Debugging

### **Modo Simulado:**

```javascript
// Si EmailJS no está configurado
console.log('📧 [SIMULADO] Email welcome enviado a:', email);
console.log('📝 Contenido:', message);
```

### **Logs de Consola:**

```javascript
// Verificar estado del servicio
console.log('📊 Estado del servicio:', emailService.getStatus());

// Verificar configuración
console.log('⚙️ Configuración:', EMAILJS_CONFIG);
```

### **Verificar Envío:**

```javascript
// En el dashboard de EmailJS
- Ve a "Activity" para ver emails enviados
- Revisa "Logs" para errores
- Verifica "Templates" para personalización
```

## 🚀 Próximos Pasos

1. **Configurar EmailJS** siguiendo la guía
2. **Personalizar templates** con tu marca
3. **Probar envío** de emails
4. **Monitorear** actividad y métricas
5. **Optimizar** contenido y timing

¡Tu sistema de emails estará completamente funcional! 🌟✨
