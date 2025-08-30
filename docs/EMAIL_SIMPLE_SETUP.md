# 📧 Configuración Simple de EmailJS para AstroKey

## 🎯 **Solo UN email cuando pagan**

Tu sistema ahora es **MUCHO más simple**. Solo envía **UN email** cuando el usuario paga €0.50:

✅ **Bienvenida al servicio premium**  
✅ **Confirmación de que ya tienen su carta astral**  
✅ **Crear contraseña para acceder al dashboard**

## 🚀 **Configuración en 3 pasos:**

### **1. Crear cuenta en EmailJS**
- Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
- Crea cuenta gratuita (200 emails/mes)
- Confirma tu email

### **2. Configurar Email Service**
- En tu dashboard: "Email Services" → "Add New Service"
- Conecta tu email (Gmail, Outlook, etc.)
- **Guarda el Service ID** (ej: `service_abc123`)

### **3. Crear Template**
- Ve a "Email Templates" → "Create New Template"
- Nombre: `template_premium_welcome_astrokey`
- Copia el HTML del template de `js/emailjs-config.js`

### **4. Obtener User ID**
- Ve a "Account" → "API Keys"
- **Copia tu Public Key** (ej: `user_abc123`)

## ⚙️ **Actualizar Configuración**

Edita `js/emailjs-config.js`:

```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_tu_service_id_aqui',
    USER_ID: 'user_tu_user_id_aqui',
    TEMPLATE: 'template_premium_welcome_astrokey'
};
```

## 📱 **Incluir EmailJS**

Añade esto en el `<head>` de `payment.html`:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

## 🎉 **¡Listo!**

**Ahora tu sistema:**
- ✅ Solo envía **UN email** cuando pagan
- ✅ Email profesional y atractivo
- ✅ Incluye carta astral personalizada
- ✅ Botón para crear contraseña
- ✅ Advertencia sobre suscripción automática

**El email se envía automáticamente cuando:**
1. Usuario completa el test
2. Introduce su email
3. Paga €0.50
4. **BOOM!** → Email premium enviado

**No más emails molestos, solo lo esencial.** 🌟✨
