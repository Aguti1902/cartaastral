// Variables globales
let countdownInterval;
let timeLeft = 294; // 4 minutos y 54 segundos en segundos

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de Pago AstroKey iniciada');
    
    initializePayment();
    startCountdown();
    setupEventListeners();
});

// Inicializar la página de pago
function initializePayment() {
    // Configurar método de pago por defecto
    showCreditCardFields();
    
    // Configurar máscaras de input
    setupInputMasks();
}

// Configurar event listeners
function setupEventListeners() {
    // Cambio de método de pago
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'credit-card') {
                showCreditCardFields();
            } else {
                hideCreditCardFields();
            }
        });
    });
    
    // Validación en tiempo real
    setupInputValidation();
}

// Mostrar campos de tarjeta de crédito
function showCreditCardFields() {
    const creditCardFields = document.getElementById('credit-card-fields');
    creditCardFields.style.display = 'block';
}

// Ocultar campos de tarjeta de crédito
function hideCreditCardFields() {
    const creditCardFields = document.getElementById('credit-card-fields');
    creditCardFields.style.display = 'none';
}

// Configurar máscaras de input
function setupInputMasks() {
    // Número de tarjeta
    const cardNumber = document.getElementById('card-number');
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });
    
    // Fecha de caducidad
    const expiryDate = document.getElementById('expiry-date');
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
    });
    
    // CVV
    const cvv = document.getElementById('cvv');
    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Configurar validación de inputs
function setupInputValidation() {
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    
    switch(field.id) {
        case 'card-number':
            if (value.length < 19) {
                showFieldError(field, 'Número de tarjeta incompleto');
                return false;
            }
            break;
            
        case 'cardholder-name':
            if (value.length < 3) {
                showFieldError(field, 'Nombre del titular requerido');
                return false;
            }
            break;
            
        case 'expiry-date':
            if (value.length < 5) {
                showFieldError(field, 'Fecha de caducidad requerida');
                return false;
            }
            break;
            
        case 'cvv':
            if (value.length < 3) {
                showFieldError(field, 'CVV requerido');
                return false;
            }
            break;
    }
    
    return true;
}

// Mostrar error de campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

// Limpiar error de campo
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Iniciar countdown
function startCountdown() {
    updateCountdown();
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdown();
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            showExpiredOffer();
        }
    }, 1000);
}

// Actualizar countdown
function updateCountdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Actualizar barra de progreso
    const totalTime = 294; // 4 minutos 54 segundos
    const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
}

// Mostrar oferta expirada
function showExpiredOffer() {
    const countdown = document.getElementById('countdown');
    countdown.innerHTML = '<div class="expired-offer">¡Oferta expirada!</div>';
    
    const paymentBtn = document.querySelector('.payment-btn');
    paymentBtn.disabled = true;
    paymentBtn.textContent = 'Oferta no disponible';
}

// Procesar pago
function processPayment() {
    if (!validatePaymentForm()) {
        return;
    }
    
    // Simular procesamiento de pago
    showPaymentProcessing();
    
    setTimeout(() => {
        // Simular pago exitoso
        showPaymentSuccess();
        
        // Redirigir a la página de resultados después de 2 segundos
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 2000);
    }, 3000);
}

// Validar formulario de pago
function validatePaymentForm() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    
    if (!selectedMethod) {
        showNotification('Por favor seleccione un método de pago', 'error');
        return false;
    }
    
    if (selectedMethod.value === 'credit-card') {
        const cardNumber = document.getElementById('card-number');
        const cardholderName = document.getElementById('cardholder-name');
        const expiryDate = document.getElementById('expiry-date');
        const cvv = document.getElementById('cvv');
        
        if (!validateField(cardNumber) || !validateField(cardholderName) || 
            !validateField(expiryDate) || !validateField(cvv)) {
            showNotification('Por favor complete todos los campos requeridos', 'error');
            return false;
        }
    }
    
    return true;
}

// Mostrar procesamiento de pago
function showPaymentProcessing() {
    const paymentBtn = document.querySelector('.payment-btn');
    paymentBtn.disabled = true;
    paymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...';
}

// Mostrar pago exitoso
function showPaymentSuccess() {
    const paymentBtn = document.querySelector('.payment-btn');
    paymentBtn.innerHTML = '<i class="fas fa-check"></i> ¡Pago exitoso!';
    paymentBtn.classList.add('success');
    
    showNotification('¡Pago procesado exitosamente! Redirigiendo a su carta natal...', 'success');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Añadir al body
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Mostrar ayuda
function showHelp() {
    showNotification('Para obtener ayuda, contacte con nuestro equipo de soporte', 'info');
}

// Función para redirigir desde la página de email
function redirectToPayment() {
    window.location.href = 'payment.html';
}
