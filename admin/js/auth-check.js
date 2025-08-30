// ===== VERIFICACIÓN DE AUTENTICACIÓN - PANEL ADMINISTRATIVO ASTROKEY =====

// Verificar autenticación antes de cargar el panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Verificando autenticación...');
    
    // Verificar si hay una sesión válida
    if (!isAuthenticated()) {
        console.log('❌ No autenticado, redirigiendo al login...');
        redirectToLogin();
        return;
    }
    
    // Verificar si la sesión no ha expirado
    if (isSessionExpired()) {
        console.log('⏰ Sesión expirada, redirigiendo al login...');
        logout('Sesión expirada');
        return;
    }
    
    // Sesión válida, continuar cargando el panel
    console.log('✅ Autenticación verificada, cargando panel...');
    loadUserInfo();
});

// Verificar si el usuario está autenticado
function isAuthenticated() {
    try {
        const sessionData = localStorage.getItem('astrokeyAdminSession');
        return sessionData !== null;
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return false;
    }
}

// Verificar si la sesión ha expirado
function isSessionExpired() {
    try {
        const sessionData = localStorage.getItem('astrokeyAdminSession');
        if (!sessionData) return true;
        
        const session = JSON.parse(sessionData);
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        return now >= expiresAt;
    } catch (error) {
        console.error('Error al verificar expiración de sesión:', error);
        return true;
    }
}

// Obtener información del usuario actual
function getCurrentUser() {
    try {
        const sessionData = localStorage.getItem('astrokeyAdminSession');
        if (!sessionData) return null;
        
        const session = JSON.parse(sessionData);
        return session.user;
    } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        return null;
    }
}

// Cargar información del usuario en el panel
function loadUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Actualizar nombre del administrador en el header
    const adminNameElement = document.querySelector('.admin-name');
    if (adminNameElement) {
        adminNameElement.textContent = user.name;
    }
    
    // Actualizar título del panel con el nombre del usuario
    const headerTitle = document.querySelector('.logo-section h1');
    if (headerTitle) {
        headerTitle.textContent = `Panel de Administración - ${user.name}`;
    }
    
    // Mostrar información del usuario en consola
    console.log('👤 Usuario autenticado:', user);
    
    // Configurar permisos según el rol
    setupUserPermissions(user);
}

// Configurar permisos del usuario
function setupUserPermissions(user) {
    // Ocultar elementos según permisos
    const elementsToHide = [];
    
    if (!hasPermission('all')) {
        // Usuario no es super admin
        if (!hasPermission('stripe')) {
            elementsToHide.push('.admin-card:nth-child(2)'); // Stripe
        }
        if (!hasPermission('emailjs')) {
            elementsToHide.push('.admin-card:nth-child(3)'); // EmailJS
        }
        if (!hasPermission('google')) {
            elementsToHide.push('.admin-card:nth-child(4)'); // Google OAuth
        }
        if (!hasPermission('pricing')) {
            elementsToHide.push('.admin-card:nth-child(5)'); // Precios
        }
        if (!hasPermission('legal')) {
            elementsToHide.push('.admin-card:nth-child(6)'); // Legal
        }
        if (!hasPermission('stats')) {
            elementsToHide.push('.admin-card:nth-child(7)'); // Estadísticas
        }
        if (!hasPermission('environment')) {
            elementsToHide.push('.admin-card:nth-child(8)'); // Variables de entorno
        }
    }
    
    // Ocultar elementos no permitidos
    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    console.log('🔐 Permisos configurados para:', user.role);
}

// Verificar si el usuario tiene un permiso específico
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    
    return user.permissions.includes('all') || 
           user.permissions.includes(permission);
}

// Verificar si el usuario tiene un rol específico
function hasRole(role) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const roleHierarchy = {
        'super_admin': 3,
        'manager': 2,
        'support': 1
    };
    
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[role] || 0;
    
    return userLevel >= requiredLevel;
}

// Redirigir al login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Logout
function logout(reason = 'Sesión cerrada') {
    console.log('🚪 Logout:', reason);
    
    // Limpiar sesión
    localStorage.removeItem('astrokeyAdminSession');
    
    // Redirigir al login
    window.location.href = 'login.html';
}

// Verificar sesión periódicamente
setInterval(function() {
    if (isSessionExpired()) {
        console.log('⏰ Sesión expirada durante la sesión activa');
        logout('Sesión expirada por tiempo');
    }
}, 60000); // Verificar cada minuto

// Configurar auto-logout por inactividad
let inactivityTimer;
const inactivityTimeout = 30 * 60 * 1000; // 30 minutos

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        console.log('⏰ Logout por inactividad');
        logout('Sesión cerrada por inactividad');
    }, inactivityTimeout);
}

// Eventos que resetean el timer de inactividad
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
activityEvents.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
});

// Iniciar timer de inactividad
resetInactivityTimer();

// Interceptar navegación para verificar autenticación
window.addEventListener('beforeunload', function() {
    // Verificar autenticación antes de salir
    if (!isAuthenticated()) {
        console.log('🔒 Usuario no autenticado, limpiando...');
        localStorage.removeItem('astrokeyAdminSession');
    }
});

// Exportar funciones para uso global
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.hasPermission = hasPermission;
window.hasRole = hasRole;
window.logout = logout;
