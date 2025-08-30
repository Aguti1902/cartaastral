# 🚀 **GUÍA COMPLETA DE DESPLIEGUE - ASTROKEY**

## 🌐 **Conectando tu Panel a tu Dominio en Dondominio**

### **📋 PASO 1: PREPARACIÓN DEL DOMINIO**

#### **1.1 Verificar tu dominio en Dondominio:**
- ✅ **Accede a tu cuenta** en [dondominio.com](https://dondominio.com)
- ✅ **Verifica que el dominio esté activo** y no tenga restricciones
- ✅ **Anota la fecha de expiración** para renovaciones automáticas

#### **1.2 Configurar DNS (Opcional):**
```
📝 Si quieres usar un subdominio específico:
- admin.tudominio.com → Para el panel de administración
- api.tudominio.com → Para futuras APIs
- webhooks.tudominio.com → Para webhooks de Stripe
```

---

### **🏠 PASO 2: ELEGIR HOSTING**

#### **2.1 Opciones Recomendadas:**

| **Hosting** | **Precio** | **Dificultad** | **Recomendado para** |
|-------------|------------|----------------|----------------------|
| **Hostinger** | €2-5/mes | 🟢 Fácil | Principiantes |
| **SiteGround** | €5-15/mes | 🟡 Media | Intermedios |
| **DigitalOcean** | €5-20/mes | 🔴 Difícil | Avanzados |
| **AWS Lightsail** | €3-20/mes | 🔴 Difícil | Profesionales |

#### **2.2 Hostinger (Recomendado para empezar):**
```
✅ Ventajas:
- Panel de control fácil
- SSL gratuito automático
- Soporte en español
- Precio muy económico
- WordPress incluido

❌ Desventajas:
- Menos control técnico
- Limitaciones de recursos
```

---

### **🔧 PASO 3: CONFIGURACIÓN DEL HOSTING**

#### **3.1 Crear cuenta en Hostinger:**
1. **Ve a** [hostinger.com](https://hostinger.com)
2. **Elige el plan** "Premium" o "Business"
3. **Conecta tu dominio** de Dondominio
4. **Activa SSL gratuito** automáticamente

#### **3.2 Acceder al panel de control:**
1. **Login en** [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. **Ve a "Sitios web"** → Tu dominio
3. **Accede al "Administrador de archivos"**

---

### **📁 PASO 4: SUBIR ARCHIVOS**

#### **4.1 Estructura de archivos a subir:**
```
📁 Tu sitio web:
├── 📄 index.html (página principal)
├── 📄 test.html (test astrológico)
├── 📄 intro.html (introducción)
├── 📄 email-request.html (solicitud de email)
├── 📄 payment.html (página de pago)
├── 📄 results.html (resultados)
├── 📄 dashboard.html (dashboard del usuario)
├── 📁 images/ (imágenes del sitio)
├── 📁 css/ (estilos)
├── 📁 js/ (funcionalidades)
└── 📁 admin/ (panel de administración)
    ├── 📄 login.html
    ├── 📄 index.html
    ├── 📁 css/
    ├── 📁 js/
    └── 📁 config/
```

#### **4.2 Método de subida recomendado:**
```
🚀 Opción A: Administrador de archivos (Fácil)
1. Abrir administrador de archivos en Hostinger
2. Crear carpeta raíz del sitio
3. Subir archivos uno por uno
4. Verificar que se suban correctamente

🚀 Opción B: FTP (Más rápido)
1. Descargar FileZilla (gratuito)
2. Conectar con credenciales de Hostinger
3. Arrastrar y soltar todos los archivos
4. Verificar transferencia completa
```

---

### **🔐 PASO 5: CONFIGURAR SEGURIDAD**

#### **5.1 Cambiar contraseñas por defecto:**
```javascript
// En admin/js/login.js, cambiar estas líneas:
const ADMIN_USERS = [
    {
        email: 'admin@tudominio.com', // Tu email real
        password: 'TU_CONTRASEÑA_SUPER_SEGURA_12_CARACTERES', // Cambiar esto
        name: 'Tu Nombre Real',
        role: 'super_admin',
        permissions: ['all']
    }
];
```

#### **5.2 Ejemplos de contraseñas seguras:**
```
✅ CONTRASEÑAS SEGURAS:
- K9#mP$2vN8@qL
- H7$jR#5wX9&tM
- P4@kL$8nQ2#vR

❌ CONTRASEÑAS DÉBILES:
- admin123
- password
- 123456
- tu_nombre
```

---

### **🌐 PASO 6: CONFIGURAR DOMINIO**

#### **6.1 En Dondominio:**
1. **Ve a tu panel de control**
2. **Selecciona tu dominio**
3. **Ve a "DNS" o "Nameservers"**
4. **Configura los nameservers de Hostinger:**
   ```
   ns1.hostinger.com
   ns2.hostinger.com
   ns3.hostinger.com
   ```

#### **6.2 En Hostinger:**
1. **Ve a "Dominios"**
2. **Conecta tu dominio** de Dondominio
3. **Espera propagación** (puede tardar 24-48 horas)

---

### **🔒 PASO 7: ACTIVAR HTTPS (SSL)**

#### **7.1 SSL automático en Hostinger:**
```
✅ Se activa automáticamente
✅ Certificado Let's Encrypt gratuito
✅ Renovación automática
✅ Redirección HTTP → HTTPS automática
```

#### **7.2 Verificar SSL:**
1. **Ve a tu sitio:** `https://tudominio.com`
2. **Verifica el candado verde** en el navegador
3. **Comprueba que redirija** de HTTP a HTTPS

---

### **⚙️ PASO 8: CONFIGURAR SERVICIOS**

#### **8.1 Stripe (Pagos):**
1. **Ve a** [stripe.com](https://stripe.com)
2. **Crea cuenta** y verifica identidad
3. **Obtén claves de producción:**
   ```
   Publishable Key: pk_live_...
   Secret Key: sk_live_...
   Webhook Secret: whsec_...
   ```
4. **Configura en tu panel admin**

#### **8.2 EmailJS (Emails):**
1. **Ve a** [emailjs.com](https://emailjs.com)
2. **Crea cuenta** gratuita
3. **Configura servicio de email**
4. **Crea template** para bienvenida premium
5. **Obtén credenciales** y configura

#### **8.3 Google OAuth (Registro):**
1. **Ve a** [console.cloud.google.com](https://console.cloud.google.com)
2. **Crea proyecto** nuevo
3. **Habilita Google+ API**
4. **Configura OAuth 2.0** con tu dominio
5. **Obtén Client ID y Secret**

---

### **🧪 PASO 9: PROBAR TODO**

#### **9.1 Checklist de pruebas:**
```
✅ Sitio principal carga: https://tudominio.com
✅ Test astrológico funciona
✅ Panel de admin accesible: https://tudominio.com/admin
✅ Login funciona con credenciales
✅ SSL activo (candado verde)
✅ Redirección HTTP → HTTPS
✅ Emails se envían correctamente
✅ Pagos de Stripe funcionan
✅ Google OAuth funciona
```

#### **9.2 URLs de prueba:**
```
🌐 Página principal: https://tudominio.com
🔧 Panel admin: https://tudominio.com/admin
🔐 Login admin: https://tudominio.com/admin/login.html
🧪 Test astrológico: https://tudominio.com/test.html
💳 Página de pago: https://tudominio.com/payment.html
📊 Dashboard: https://tudominio.com/dashboard.html
```

---

### **📱 PASO 10: OPTIMIZACIÓN Y MONITOREO**

#### **10.1 Google Analytics:**
1. **Ve a** [analytics.google.com](https://analytics.google.com)
2. **Crea cuenta** gratuita
3. **Añade tu dominio**
4. **Copia el código de seguimiento**
5. **Pégalo en el `<head>` de tus páginas**

#### **10.2 Google Search Console:**
1. **Ve a** [search.google.com/search-console](https://search.google.com/search-console)
2. **Verifica propiedad** de tu dominio
3. **Envía sitemap** (si lo tienes)
4. **Monitorea** rendimiento en búsquedas

#### **10.3 PageSpeed Insights:**
1. **Ve a** [pagespeed.web.dev](https://pagespeed.web.dev)
2. **Analiza tu sitio**
3. **Implementa mejoras** sugeridas
4. **Optimiza imágenes** y recursos

---

### **🚨 PASO 11: SEGURIDAD ADICIONAL**

#### **11.1 Protección del panel admin:**
```nginx
# En Hostinger, crear archivo .htaccess en /admin/
AuthType Basic
AuthName "Área Restringida"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

#### **11.2 Backup automático:**
1. **En Hostinger:** Activar backup automático
2. **Frecuencia:** Diario o semanal
3. **Retención:** 30 días mínimo
4. **Descarga manual** de backups importantes

#### **11.3 Monitoreo de uptime:**
1. **UptimeRobot:** [uptimerobot.com](https://uptimerobot.com)
2. **Plan gratuito:** 5 monitores
3. **Alertas por email** si el sitio cae
4. **Monitoreo 24/7** automático

---

### **🔧 PASO 12: MANTENIMIENTO**

#### **12.1 Tareas diarias:**
```
✅ Verificar que el sitio funcione
✅ Revisar emails de error
✅ Monitorear métricas básicas
```

#### **12.2 Tareas semanales:**
```
✅ Revisar logs de acceso
✅ Verificar backups
✅ Actualizar dependencias
✅ Revisar seguridad
```

#### **12.3 Tareas mensuales:**
```
✅ Cambiar contraseñas
✅ Revisar certificados SSL
✅ Actualizar documentación
✅ Análisis de rendimiento
```

---

### **📞 PASO 13: SOPORTE Y EMERGENCIAS**

#### **13.1 Contactos importantes:**
```
🚨 Hostinger Soporte:
- Chat en vivo 24/7
- Email: support@hostinger.com
- Teléfono: +34 900 838 432

🚨 Dondominio Soporte:
- Chat en vivo
- Email: soporte@dondominio.com
- Teléfono: +34 900 838 432

🚨 Tu contacto de emergencia:
- Email: tu@email.com
- Teléfono: +34 XXX XXX XXX
```

#### **13.2 En caso de emergencia:**
1. **No entrar en pánico**
2. **Documentar el problema**
3. **Contactar soporte técnico**
4. **Restaurar desde backup** si es necesario
5. **Verificar que todo funcione**

---

### **🎉 PASO 14: CELEBRAR**

#### **14.1 Tu sitio está listo:**
```
🌐 Dominio: https://tudominio.com
🔧 Admin: https://tudominio.com/admin
🔐 Login: admin@tudominio.com
💰 Pagos: Stripe configurado
📧 Emails: EmailJS funcionando
🔒 Seguridad: SSL + autenticación
📱 Responsive: Funciona en todos los dispositivos
```

#### **14.2 Compartir tu éxito:**
```
✅ Envía el enlace a amigos y familia
✅ Comparte en redes sociales
✅ Añade a tu CV/portfolio
✅ Celebra el logro alcanzado
```

---

## 🚀 **¡TU SITIO ASTROKEY ESTÁ LISTO PARA PRODUCCIÓN!**

### **📋 Resumen de lo que tienes:**
- ✅ **Sitio web completo** con test astrológico
- ✅ **Panel de administración** seguro
- ✅ **Sistema de pagos** con Stripe
- ✅ **Emails automáticos** con EmailJS
- ✅ **Registro con Google** OAuth
- ✅ **Dominio personalizado** en Dondominio
- ✅ **Hosting profesional** con SSL
- ✅ **Seguridad completa** implementada

### **🔮 Próximos pasos sugeridos:**
1. **Promocionar tu sitio** en redes sociales
2. **Crear contenido adicional** (blog, videos)
3. **Implementar SEO** para mejor posicionamiento
4. **Añadir más funcionalidades** según feedback
5. **Monetizar** con publicidad o servicios premium

**¡Felicidades! Has creado un negocio digital completo desde cero.** 🎉✨
