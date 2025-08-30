// ===== EMAIL REQUEST SCRIPT - ASTROKEY =====

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📧 Página de solicitud de email iniciada');
    
    setupEventListeners();
    checkTestCompletion();
});

// Configurar event listeners
function setupEventListeners() {
    const emailInput = document.getElementById('finalEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
        
        emailInput.addEventListener('input', function() {
            clearFieldError(this);
        });
    }
}

// Verificar si el test fue completado
function checkTestCompletion() {
    const testAnswers = localStorage.getItem('astralTestAnswers');
    if (!testAnswers) {
        // Si no hay respuestas del test, redirigir al test
        window.location.href = 'test.html';
        return;
    }
    
    console.log('✅ Test completado, mostrando solicitud de email');
}

// Validar email
function validateEmail(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (!isValidEmail(value)) {
        showFieldError(field, 'Introduzca un email válido');
        return false;
    }
    
    return true;
}

// Mostrar error de campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--error-color)';
}

// Limpiar error de campo
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// Validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enviar email y continuar
function submitEmail() {
    const emailInput = document.getElementById('finalEmail');
    
    if (!validateEmail(emailInput)) {
        return;
    }
    
    // Guardar email en localStorage
    const email = emailInput.value.trim();
    const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
    testAnswers.finalEmail = email;
    localStorage.setItem('astralTestAnswers', JSON.stringify(testAnswers));
    
    // Mostrar notificación de éxito
    showNotification('¡Email guardado exitosamente! Redirigiendo...', 'success');
    
    // Redirigir a la página de pago después de 2 segundos
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 2000);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--white-color);
        color: var(--dark-color);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-xl);
        z-index: 3000;
        max-width: 400px;
        border-left: 4px solid ${getNotificationColor(type)};
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-ocultar
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Obtener icono de notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Obtener color de notificación
function getNotificationColor(type) {
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--warning-color)',
        info: 'var(--info-color)'
    };
    return colors[type] || colors.info;
}
