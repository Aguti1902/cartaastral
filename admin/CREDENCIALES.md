# 🔐 **CREDENCIALES DEL PANEL DE ADMINISTRACIÓN - ASTROKEY**

## 🚨 **IMPORTANTE: CAMBIAR EN PRODUCCIÓN**

**Estas son las credenciales de PRUEBA. Debes cambiarlas antes de usar en producción.**

---

## 👥 **USUARIOS DISPONIBLES**

### **1. Super Administrador** 🔑
- **Email:** `admin@astrokey.com`
- **Contraseña:** `admin123`
- **Rol:** `super_admin`
- **Permisos:** `Todos los permisos`
- **Acceso:** Panel completo

### **2. Gerente** 👔
- **Email:** `manager@astrokey.com`
- **Contraseña:** `manager123`
- **Rol:** `manager`
- **Permisos:** `usuarios`, `estadísticas`, `precios`, `legal`
- **Acceso:** Panel limitado

### **3. Soporte** 🆘
- **Email:** `support@astrokey.com`
- **Contraseña:** `support123`
- **Rol:** `support`
- **Permisos:** `usuarios`, `estadísticas`
- **Acceso:** Panel muy limitado

---

## 🔒 **SISTEMA DE SEGURIDAD**

### **Características de Seguridad:**
- ✅ **Autenticación obligatoria** para acceder al panel
- ✅ **Sesiones con expiración** automática
- ✅ **Logout por inactividad** (30 minutos)
- ✅ **Validación de permisos** por rol
- ✅ **Verificación de sesión** en cada página
- ✅ **Redirección automática** al login si no autenticado

### **Duración de Sesión:**
- **Sin "Recordar sesión":** 8 horas
- **Con "Recordar sesión":** 30 días
- **Por inactividad:** 30 minutos

---

## 🚀 **ACCESO AL PANEL**

### **URLs del Panel:**
```
📱 Página de Login:    /admin/login.html
🔧 Panel Principal:    /admin/index.html
🧪 Página de Test:     /admin/test-panel.html
```

### **Flujo de Acceso:**
1. **Ir a:** `/admin/login.html`
2. **Introducir:** Email y contraseña
3. **Acceder al:** Panel de administración
4. **Sesión activa** hasta logout o expiración

---

## ⚠️ **CAMBIOS OBLIGATORIOS EN PRODUCCIÓN**

### **1. Cambiar Contraseñas:**
```javascript
// En js/login.js, cambiar estas contraseñas:
const ADMIN_USERS = [
    {
        email: 'admin@astrokey.com',
        password: 'TU_CONTRASEÑA_SUPER_SEGURA', // Cambiar esto
        name: 'Tu Nombre',
        role: 'super_admin',
        permissions: ['all']
    }
];
```

### **2. Implementar Hash de Contraseñas:**
```javascript
// En producción, usar bcrypt o similar:
const hashedPassword = await bcrypt.hash(password, 12);
```

### **3. Añadir Autenticación de Dos Factores:**
- SMS, email, o app de autenticación
- Códigos de verificación

### **4. Limitar Acceso por IP:**
```javascript
// Verificar IP del usuario
const allowedIPs = ['192.168.1.1', '10.0.0.1'];
```

---

## 🔧 **GESTIÓN DE USUARIOS**

### **Añadir Nuevo Usuario:**
```javascript
// En la consola del navegador:
addAdminUser(
    'nuevo@astrokey.com',
    'nueva123',
    'Nuevo Usuario',
    'manager',
    ['users', 'stats', 'pricing']
);
```

### **Cambiar Contraseña:**
```javascript
// En la consola del navegador:
changePassword('admin@astrokey.com', 'nueva123');
```

### **Listar Usuarios:**
```javascript
// En la consola del navegador:
listAdminUsers();
```

---

## 🛡️ **RECOMENDACIONES DE SEGURIDAD**

### **Contraseñas Seguras:**
- **Mínimo 12 caracteres**
- **Mayúsculas y minúsculas**
- **Números y símbolos**
- **No palabras del diccionario**
- **No información personal**

### **Ejemplos de Contraseñas Seguras:**
```
✅ K9#mP$2vN8@qL
✅ H7$jR#5wX9&tM
✅ P4@kL$8nQ2#vR
```

### **Seguridad Adicional:**
- **Cambiar contraseñas cada 90 días**
- **No compartir credenciales**
- **Usar VPN en redes públicas**
- **Monitorear accesos sospechosos**
- **Backup regular de configuraciones**

---

## 🚨 **EN CASO DE EMERGENCIA**

### **Si olvidas la contraseña:**
1. **Contactar al administrador principal**
2. **Verificar identidad por teléfono**
3. **Reset manual de contraseña**
4. **Cambio inmediato de credenciales**

### **Si detectas acceso no autorizado:**
1. **Cambiar todas las contraseñas**
2. **Revisar logs de acceso**
3. **Verificar integridad del sistema**
4. **Notificar al equipo de seguridad**

---

## 📞 **CONTACTO DE EMERGENCIA**

```
🚨 ADMINISTRADOR PRINCIPAL
📧 admin@astrokey.com
📱 +34 XXX XXX XXX
⏰ 24/7 para emergencias
```

---

## ✅ **CHECKLIST DE PRODUCCIÓN**

- [ ] Cambiar todas las contraseñas por defecto
- [ ] Implementar hash de contraseñas
- [ ] Configurar autenticación de dos factores
- [ ] Limitar acceso por IP
- [ ] Configurar monitoreo de seguridad
- [ ] Crear backup de configuraciones
- [ ] Documentar procedimientos de emergencia
- [ ] Probar sistema de recuperación
- [ ] Configurar alertas de seguridad
- [ ] Revisar logs de acceso

---

**🔐 ¡Recuerda: La seguridad es responsabilidad de todos!**
