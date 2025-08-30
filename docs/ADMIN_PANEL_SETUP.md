# 🚀 Panel de Administración Completo - AstroKey

## 🎯 **¿Qué incluye el panel?**

Tu panel administrativo incluye **TODO** lo necesario para que AstroKey funcione en producción:

✅ **Configuración de Stripe** - Para procesar pagos  
✅ **Configuración de EmailJS** - Para enviar emails  
✅ **Configuración de Google OAuth** - Para registro con Google  
✅ **Gestión de usuarios** - Ver y gestionar cuentas  
✅ **Estadísticas** - Métricas de la plataforma  
✅ **Configuración legal** - Términos y políticas  
✅ **Variables de entorno** - Todas las claves API  

## 🚀 **Acceso al Panel**

### **URL del Panel:**
```
https://tuweb.com/admin/
```

### **Credenciales por defecto:**
- **Usuario:** Admin
- **Contraseña:** Sin contraseña (solo local)

## ⚙️ **Configuración Paso a Paso**

### **1. Configuración de Stripe (Pagos)**

#### **Crear cuenta en Stripe:**
1. Ve a [https://stripe.com](https://stripe.com)
2. Crea cuenta gratuita
3. Completa verificación de identidad

#### **Obtener claves de API:**
1. En tu dashboard: "Developers" → "API keys"
2. **Publishable key:** `pk_test_...` (para frontend)
3. **Secret key:** `sk_test_...` (para backend)
4. **Webhook secret:** Crear webhook en "Webhooks"

#### **Configurar en el panel:**
1. Haz clic en "Configurar Stripe"
2. Introduce las claves
3. Marca "Modo Producción" cuando estés listo
4. Guarda configuración

#### **Webhook de Stripe:**
```
URL: https://tuweb.com/webhooks/stripe
Eventos: payment_intent.succeeded, customer.subscription.created
```

### **2. Configuración de EmailJS (Emails)**

#### **Crear cuenta en EmailJS:**
1. Ve a [https://www.emailjs.com](https://www.emailjs.com)
2. Crea cuenta gratuita (200 emails/mes)
3. Confirma tu email

#### **Configurar Email Service:**
1. "Email Services" → "Add New Service"
2. Conecta tu email (Gmail, Outlook, etc.)
3. **Guarda el Service ID** (ej: `service_abc123`)

#### **Crear Template:**
1. "Email Templates" → "Create New Template"
2. Nombre: `template_premium_welcome_astrokey`
3. Copia el HTML del template de `js/emailjs-config.js`

#### **Obtener User ID:**
1. "Account" → "API Keys"
2. **Copia tu Public Key** (ej: `user_abc123`)

#### **Configurar en el panel:**
1. Haz clic en "Configurar EmailJS"
2. Introduce Service ID, User ID y Template ID
3. Guarda configuración

### **3. Configuración de Google OAuth (Registro)**

#### **Crear proyecto en Google Cloud:**
1. Ve a [https://console.cloud.google.com](https://console.cloud.google.com)
2. Crea nuevo proyecto
3. Habilita Google+ API

#### **Configurar OAuth 2.0:**
1. "APIs & Services" → "Credentials"
2. "Create Credentials" → "OAuth 2.0 Client IDs"
3. Tipo: "Web application"
4. **Authorized redirect URIs:**
   ```
   https://tuweb.com/auth/google/callback
   https://tuweb.com/dashboard
   ```

#### **Obtener credenciales:**
1. **Client ID:** `123456789-...`
2. **Client Secret:** `GOCSPX-...`

#### **Configurar en el panel:**
1. Haz clic en "Configurar Google OAuth"
2. Introduce Client ID, Client Secret y Redirect URI
3. Guarda configuración

## 🔧 **Configuración del Panel**

### **Acceder al panel:**
```
https://tuweb.com/admin/index.html
```

### **Configurar servicios:**
1. **Stripe:** Para procesar pagos de €0.50 y €19.99
2. **EmailJS:** Para enviar email premium cuando pagan
3. **Google OAuth:** Para registro con cuenta de Google

### **Verificar conexiones:**
- Cada servicio muestra estado: "Desconectado", "Pendiente", "Conectado"
- Usa colores: 🔴 Rojo (error), 🟡 Amarillo (pendiente), 🟢 Verde (conectado)

## 📊 **Funcionalidades del Panel**

### **Dashboard Principal:**
- **Usuarios activos:** Total de cuentas registradas
- **Suscripciones premium:** Usuarios con plan mensual
- **Tests completados hoy:** Actividad del día
- **Ingresos del mes:** Facturación mensual

### **Gestión de Usuarios:**
- Ver lista de usuarios registrados
- Estado de suscripciones
- Acciones: Ver perfil, suspender cuenta

### **Configuración de Servicios:**
- **Stripe:** Claves API, modo test/producción
- **EmailJS:** Service ID, User ID, Template ID
- **Google:** Client ID, Client Secret, Redirect URI

### **Precios y Planes:**
- Precio del test: €0.50
- Plan mensual: €19.99
- Sincronización automática con Stripe

### **Contenido Legal:**
- Términos de servicio
- Política de privacidad
- Política de cookies
- Última actualización automática

## 🚨 **Seguridad y Producción**

### **Modo Test vs Producción:**

#### **Stripe:**
- **Test:** `pk_test_...`, `sk_test_...`
- **Producción:** `pk_live_...`, `sk_live_...`

#### **Google OAuth:**
- **Test:** URLs de desarrollo
- **Producción:** URLs de tu dominio real

#### **EmailJS:**
- **Test:** Plan gratuito (200 emails/mes)
- **Producción:** Plan de pago según volumen

### **Variables de Entorno:**
- **NUNCA** expongas claves secretas en el frontend
- Usa variables de entorno en producción
- El panel solo muestra claves públicas

### **Acceso al Panel:**
- Protege con autenticación en producción
- Usa HTTPS obligatorio
- Limita acceso por IP si es posible

## 📱 **Responsive y Accesibilidad**

### **Dispositivos soportados:**
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

### **Características:**
- Grid responsive automático
- Modales adaptables
- Navegación por teclado (Escape para cerrar)
- Iconos Font Awesome para mejor UX

## 🔍 **Troubleshooting**

### **Stripe no conecta:**
1. Verifica que las claves sean correctas
2. Confirma que la cuenta esté verificada
3. Revisa logs de la consola del navegador

### **EmailJS no funciona:**
1. Verifica Service ID, User ID y Template ID
2. Confirma que el template esté creado
3. Revisa límites del plan gratuito

### **Google OAuth falla:**
1. Verifica Client ID y Client Secret
2. Confirma Redirect URI exacto
3. Revisa que la API esté habilitada

### **Panel no carga:**
1. Verifica que todos los archivos estén en `/admin/`
2. Revisa consola del navegador para errores
3. Confirma que los CSS y JS se carguen

## 🚀 **Despliegue en Producción**

### **1. Subir archivos:**
```
/admin/
├── index.html
├── css/admin-styles.css
└── js/admin.js
```

### **2. Configurar servicios:**
- Stripe en modo producción
- EmailJS con plan adecuado
- Google OAuth con dominio real

### **3. Proteger acceso:**
- Añadir autenticación
- Usar HTTPS
- Limitar acceso por IP

### **4. Monitorear:**
- Revisar logs de errores
- Verificar conexiones de servicios
- Monitorear uso de recursos

## 💡 **Consejos de Producción**

### **Antes de lanzar:**
1. **Prueba todo** en modo test
2. **Verifica emails** se envíen correctamente
3. **Confirma pagos** funcionen en Stripe
4. **Testea registro** con Google

### **Después del lanzamiento:**
1. **Monitorea** métricas del dashboard
2. **Revisa** logs de errores
3. **Optimiza** según feedback de usuarios
4. **Escala** servicios según crecimiento

## 🎉 **¡Listo para Producción!**

Con este panel administrativo tienes **TODO** lo necesario:

✅ **Sistema de pagos** completo con Stripe  
✅ **Emails automáticos** con EmailJS  
✅ **Registro con Google** OAuth  
✅ **Gestión de usuarios** y suscripciones  
✅ **Estadísticas** en tiempo real  
✅ **Configuración centralizada** de todos los servicios  

**¡Tu web AstroKey estará completamente funcional y profesional!** 🌟✨

## 📞 **Soporte**

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica la configuración de cada servicio
3. Confirma que las claves API sean correctas
4. Revisa los logs de cada servicio

**¡El panel te guiará en cada paso!** 🚀
