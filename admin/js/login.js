// ===== SISTEMA DE LOGIN - PANEL ADMINISTRATIVO ASTROKEY =====

// Configuración de usuarios administradores
const ADMIN_USERS = [
    {
        email: 'admin@astrokey.com',
        password: 'admin123', // En producción usar hash + salt
        name: 'Administrador Principal',
        role: 'super_admin',
        permissions: ['all']
    },
    {
        email: 'manager@astrokey.com',
        password: 'manager123',
        name: 'Gerente',
        role: 'manager',
        permissions: ['users', 'stats', 'pricing', 'legal']
    },
    {
        email: 'support@astrokey.com',
        password: 'support123',
        name: 'Soporte',
        role: 'support',
        permissions: ['users', 'stats']
    }
];

// Estado de la sesión
let currentUser = null;
let sessionTimeout = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Sistema de Login AstroKey iniciado');
    
    // Verificar si ya hay una sesión activa
    checkExistingSession();
    
    // Configurar event listeners
    setupLoginEventListeners();
    
    // Configurar auto-logout por inactividad
    setupInactivityTimeout();
});

// Configurar event listeners del login
function setupLoginEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Validación en tiempo real
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this.value);
        });
        
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
        
        passwordInput.addEventListener('blur', function() {
            validatePassword(this.value);
        });
    }
    
    // Enter para enviar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            handleLogin(e);
        }
    });
}

// Manejar el login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validar campos
    if (!validateEmail(email) || !validatePassword(password)) {
        showSystemMessage('❌ Por favor corrige los errores en el formulario', 'error');
        return;
    }
    
    // Deshabilitar botón durante el proceso
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    
    try {
        // Simular delay de verificación (en producción sería una API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verificar credenciales
        const user = authenticateUser(email, password);
        
        if (user) {
            // Login exitoso
            await loginSuccess(user, rememberMe);
        } else {
            // Login fallido
            loginFailed();
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        showSystemMessage('❌ Error del sistema. Inténtalo de nuevo.', 'error');
    } finally {
        // Restaurar botón
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
    }
}

// Autenticar usuario
function authenticateUser(email, password) {
    return ADMIN_USERS.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
    );
}

// Login exitoso
async function loginSuccess(user, rememberMe) {
    currentUser = user;
    
    // Crear sesión
    const session = {
        user: {
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions
        },
        loginTime: new Date().toISOString(),
        expiresAt: rememberMe ? 
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : // 30 días
            new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 horas
    };
    
    // Guardar sesión
    localStorage.setItem('astrokeyAdminSession', JSON.stringify(session));
    
    // Mostrar mensaje de éxito
    showSystemMessage(`✅ Bienvenido, ${user.name}!`, 'success');
    
    // Redirigir al panel
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Login fallido
function loginFailed() {
    // Agitar el formulario
    const loginCard = document.querySelector('.login-card');
    loginCard.classList.add('shake');
    
    // Mostrar mensaje de error
    showSystemMessage('❌ Email o contraseña incorrectos', 'error');
    
    // Limpiar contraseña
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
    
    // Remover clase de shake
    setTimeout(() => {
        loginCard.classList.remove('shake');
    }, 500);
}

// Verificar sesión existente
function checkExistingSession() {
    try {
        const sessionData = localStorage.getItem('astrokeyAdminSession');
        
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            
            if (now < expiresAt) {
                // Sesión válida, redirigir al panel
                currentUser = session.user;
                window.location.href = 'index.html';
            } else {
                // Sesión expirada, limpiar
                localStorage.removeItem('astrokeyAdminSession');
            }
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        localStorage.removeItem('astrokeyAdminSession');
    }
}

// Configurar timeout por inactividad
function setupInactivityTimeout() {
    let inactivityTimer;
    const timeoutDuration = 30 * 60 * 1000; // 30 minutos
    
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            logout('Sesión expirada por inactividad');
        }, timeoutDuration);
    }
    
    // Eventos que resetean el timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
    });
    
    // Iniciar timer
    resetTimer();
}

// Logout
function logout(reason = 'Sesión cerrada') {
    // Limpiar sesión
    localStorage.removeItem('astrokeyAdminSession');
    currentUser = null;
    
    // Limpiar timeout
    if (sessionTimeout) {
        clearTimeout(sessionTimeout);
    }
    
    // Redirigir al login
    if (window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
}

// Validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = document.getElementById('email');
    const formGroup = emailInput.closest('.form-group');
    
    if (!email) {
        setFieldError(formGroup, 'El email es obligatorio');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        setFieldError(formGroup, 'Formato de email inválido');
        return false;
    }
    
    // Verificar si el email existe en la base de usuarios
    const userExists = ADMIN_USERS.some(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!userExists) {
        setFieldError(formGroup, 'Este email no está registrado como administrador');
        return false;
    }
    
    setFieldSuccess(formGroup);
    return true;
}

// Validar contraseña
function validatePassword(password) {
    const passwordInput = document.getElementById('password');
    const formGroup = passwordInput.closest('.form-group');
    
    if (!password) {
        setFieldError(formGroup, 'La contraseña es obligatoria');
        return false;
    }
    
    if (password.length < 6) {
        setFieldError(formGroup, 'La contraseña debe tener al menos 6 caracteres');
        return false;
    }
    
    setFieldSuccess(formGroup);
    return true;
}

// Establecer error en campo
function setFieldError(formGroup, message) {
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    
    // Remover mensaje de error existente
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Añadir nuevo mensaje de error
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    formGroup.appendChild(errorMessage);
}

// Establecer éxito en campo
function setFieldSuccess(formGroup) {
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    // Remover mensaje de error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Mostrar mensaje del sistema
function showSystemMessage(message, type = 'info') {
    // Remover mensajes existentes
    const existingMessages = document.querySelectorAll('.system-error, .system-success');
    existingMessages.forEach(msg => msg.remove());
    
    // Crear nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `system-${type}`;
    messageElement.textContent = message;
    
    // Insertar antes del formulario
    const loginForm = document.getElementById('loginForm');
    loginForm.parentNode.insertBefore(messageElement, loginForm);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Toggle contraseña visible/oculta
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

// Mostrar modal de olvidé contraseña
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Cerrar modal de olvidé contraseña
function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal && e.target === modal) {
        closeForgotPassword();
    }
});

// Función para cambiar contraseña (solo para desarrollo)
function changePassword(email, newPassword) {
    const userIndex = ADMIN_USERS.findIndex(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userIndex !== -1) {
        ADMIN_USERS[userIndex].password = newPassword;
        console.log(`✅ Contraseña cambiada para ${email}`);
        return true;
    }
    
    console.log(`❌ Usuario no encontrado: ${email}`);
    return false;
}

// Función para añadir nuevo usuario administrador
function addAdminUser(email, password, name, role = 'support', permissions = []) {
    // Verificar que el email no exista
    const userExists = ADMIN_USERS.some(user => 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userExists) {
        console.log(`❌ El usuario ${email} ya existe`);
        return false;
    }
    
    // Añadir nuevo usuario
    const newUser = {
        email,
        password,
        name,
        role,
        permissions: permissions.length > 0 ? permissions : ['users', 'stats']
    };
    
    ADMIN_USERS.push(newUser);
    console.log(`✅ Usuario administrador añadido: ${email}`);
    return true;
}

// Función para listar usuarios administradores
function listAdminUsers() {
    return ADMIN_USERS.map(user => ({
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions
    }));
}

// Función para verificar permisos
function hasPermission(permission) {
    if (!currentUser) return false;
    
    return currentUser.permissions.includes('all') || 
           currentUser.permissions.includes(permission);
}

// Función para verificar rol
function hasRole(role) {
    if (!currentUser) return false;
    
    const roleHierarchy = {
        'super_admin': 3,
        'manager': 2,
        'support': 1
    };
    
    const userLevel = roleHierarchy[currentUser.role] || 0;
    const requiredLevel = roleHierarchy[role] || 0;
    
    return userLevel >= requiredLevel;
}

// Exportar funciones para uso global
window.togglePassword = togglePassword;
window.showForgotPassword = showForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.changePassword = changePassword;
window.addAdminUser = addAdminUser;
window.listAdminUsers = listAdminUsers;
window.hasPermission = hasPermission;
window.hasRole = hasRole;

// Información de desarrollo (remover en producción)
console.log('🔑 Usuarios de prueba disponibles:');
console.log('📧 admin@astrokey.com / admin123 (Super Admin)');
console.log('📧 manager@astrokey.com / manager123 (Manager)');
console.log('📧 support@astrokey.com / support123 (Support)');
