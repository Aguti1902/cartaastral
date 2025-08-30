# 📧 Configuración de EmailJS para AstroKey

## 🎯 ¿Qué es EmailJS?

EmailJS es un servicio que permite enviar emails directamente desde el frontend JavaScript sin necesidad de un backend. Es perfecto para sitios web estáticos como AstroKey.

## 🚀 Pasos para Configurar EmailJS

### **1. Crear cuenta en EmailJS**

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" y crea una cuenta gratuita
3. Confirma tu email

### **2. Configurar Email Service**

1. En tu dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Conecta tu cuenta de email
5. **Guarda el Service ID** (ej: `service_abc123`)

### **3. Crear Email Templates**

#### **Template de Bienvenida**
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Nombre: `template_welcome_astrokey`
4. Contenido HTML: Usa el template de `js/emailjs-config.js`

#### **Template de Confirmación de Pago**
1. Crea otro template: `template_payment_astrokey`
2. Usa el template PAYMENT del archivo de configuración

#### **Template de Resultados**
1. Crea: `template_results_astrokey`
2. Usa el template RESULTS del archivo de configuración

#### **Template de Recordatorio de Prueba**
1. Crea: `template_trial_astrokey`
2. Usa el template TRIAL del archivo de configuración

#### **Template de Soporte**
1. Crea: `template_support_astrokey`
2. Usa el template SUPPORT del archivo de configuración

### **4. Obtener User ID**

1. En tu dashboard, ve a "Account" → "API Keys"
2. **Copia tu Public Key** (ej: `user_abc123`)

### **5. Actualizar Configuración**

Edita `js/emailjs-config.js` y reemplaza:

```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_tu_service_id_aqui',
    USER_ID: 'user_tu_user_id_aqui',
    // ... resto de configuración
};
```

### **6. Incluir EmailJS en tu HTML**

Añade esto en el `<head>` de todas las páginas:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

## 📱 Planes de EmailJS

| **Plan** | **Precio** | **Emails/Mes** | **Características** |
|----------|------------|----------------|---------------------|
| **Free** | $0 | 200 | Básico |
| **Personal** | $15 | 1,000 | + Templates personalizados |
| **Business** | $35 | 10,000 | + Soporte prioritario |

## 🔧 Configuración Avanzada

### **Variables de Template**

Los templates usan estas variables que se reemplazan automáticamente:

- `{{to_name}}` - Nombre del destinatario
- `{{to_email}}` - Email del destinatario
- `{{from_name}}` - Nombre del remitente
- `{{from_email}}` - Email del remitente
- `{{message}}` - Mensaje personalizado
- `{{dashboard_url}}` - URL del dashboard
- `{{signo_solar}}` - Signo solar del usuario
- `{{elemento}}` - Elemento dominante
- `{{ascendente}}` - Signo ascendente
- `{{days_left}}` - Días restantes de prueba

### **Personalización de Templates**

Puedes personalizar los templates HTML en `js/emailjs-config.js`:

- Cambiar colores y estilos
- Añadir tu logo
- Modificar el contenido
- Añadir botones de acción

## 🧪 Testing

### **Modo Simulado**

Si EmailJS no está configurado, el sistema funciona en modo simulado:

```javascript
// Los emails se muestran en consola
console.log('📧 [SIMULADO] Email enviado a:', email);
```

### **Modo Real**

Una vez configurado EmailJS:

```javascript
// Los emails se envían realmente
const result = await emailService.sendWelcomeEmail(userData);
console.log('✅ Email enviado:', result.messageId);
```

## 🚨 Solución de Problemas

### **Error: "EmailJS no está disponible"**

**Solución:** Asegúrate de incluir el script de EmailJS:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

### **Error: "Service not found"**

**Solución:** Verifica que el Service ID sea correcto en la configuración.

### **Error: "Template not found"**

**Solución:** Verifica que los nombres de los templates coincidan exactamente.

### **Emails no se envían**

**Solución:** 
1. Verifica tu conexión a internet
2. Confirma que tu proveedor de email permita envíos
3. Revisa la consola del navegador para errores

## 📊 Monitoreo

### **Dashboard de EmailJS**

- Ve a tu dashboard para ver estadísticas
- Monitorea emails enviados/fallidos
- Revisa logs de actividad

### **Logs del Navegador**

Los emails se registran en la consola del navegador:

```javascript
✅ Email welcome enviado correctamente: {text: "OK"}
❌ Error al enviar email: Error details
```

## 🔒 Seguridad

### **API Keys**

- **NUNCA** expongas tu Private Key
- Solo usa la Public Key en el frontend
- Las API Keys están limitadas por plan

### **Rate Limiting**

- Plan gratuito: 200 emails/mes
- Plan personal: 1,000 emails/mes
- Plan business: 10,000 emails/mes

## 💡 Consejos

1. **Prueba primero** en modo simulado
2. **Configura templates** antes de usar en producción
3. **Monitorea** el uso de emails
4. **Personaliza** los templates para tu marca
5. **Testea** con diferentes navegadores

## 🎉 ¡Listo!

Una vez configurado EmailJS, tu sistema de emails funcionará completamente:

- ✅ Emails de bienvenida automáticos
- ✅ Confirmaciones de pago
- ✅ Resultados del test
- ✅ Recordatorios de prueba
- ✅ Sistema de soporte
- ✅ Emails profesionales y personalizados

¡Tu web AstroKey estará completamente funcional! 🌟✨
