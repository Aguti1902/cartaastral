// ===== ASTROKEY - MODELO DE NEGOCIO INTELIGENTE =====

// Variables globales
let selectedPlan = null;
let currentUser = null;
let isScrolling = false;
let trialStartTime = null;
let trialDuration = 2 * 24 * 60 * 60 * 1000; // 2 días en milisegundos

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupFormValidation();
    setupSmoothScrolling();
    setupAnimations();
});

// Inicializar la aplicación
function initializeApp() {
    console.log('🚀 AstroKey - Modelo de Negocio Inteligente iniciado');
    
    // Añadir efectos de parallax al header
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Inicializar contadores animados
    initializeCounters();
    
    // Configurar navegación móvil
    setupMobileNavigation();
    
    // Configurar efectos de partículas
    setupParticleEffects();
    
    // Inicializar animaciones de entrada
    initializeEntranceAnimations();
    
    // Verificar si hay un periodo de prueba activo
    checkActiveTrial();
    
    // Verificar si mostrar el botón del dashboard
    checkDashboardAccess();
}

// Configurar event listeners
function setupEventListeners() {
    // Formulario de test astral
    const astralTestForm = document.getElementById('astralTestForm');
    if (astralTestForm) {
        astralTestForm.addEventListener('submit', handleAstralTestSubmit);
    }
    
    // Formulario de pago
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    
    // Modales
    setupModals();
    
    // Validación de tarjeta de crédito
    setupCardValidation();
    
    // Efectos de hover en las tarjetas
    setupCardHoverEffects();
    
    // Scroll suave para enlaces internos
    setupInternalLinks();
}

// Manejar scroll del header
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Efectos de parallax para elementos del hero
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.planet, .nebula, .stars');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Configurar navegación móvil
function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animación del toggle
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Resetear animación del toggle
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}

// Configurar scroll suave
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Configurar modales
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Abrir modales
    window.openVideoModal = function() {
        document.getElementById('videoModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    };
    
    // Cerrar modales
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Cerrar al hacer clic fuera del modal
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });
}

// Cerrar modal
function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

// Manejar envío del test astral
function handleAstralTestSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const testData = {
        name: formData.get('name'),
        email: formData.get('email'),
        birthDate: formData.get('birthDate'),
        birthTime: formData.get('birthTime'),
        birthCity: formData.get('birthCity'),
        birthCountry: formData.get('birthCountry')
    };
    
    // Validar datos
    if (!validateTestData(testData)) {
        return;
    }
    
    // Mostrar loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    submitBtn.disabled = true;
    
            // Simular generación de carta astral
    setTimeout(() => {
        // Generar carta astral
        const chartData = generateAstralChart(testData);
        
        // Mostrar modal de pago
        showPaymentModal(testData, chartData);
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Limpiar formulario
        e.target.reset();
    }, 3000);
}

// Validar datos del test
function validateTestData(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!isValidEmail(data.email)) {
        errors.push('Email inválido');
    }
    
    if (!data.birthDate) {
        errors.push('Fecha de nacimiento requerida');
    }
    
    if (!data.birthTime) {
        errors.push('Hora de nacimiento requerida');
    }
    
    if (!data.birthCity || data.birthCity.length < 2) {
        errors.push('Ciudad de nacimiento requerida');
    }
    
    if (!data.birthCountry) {
        errors.push('País de nacimiento requerido');
    }
    
    if (errors.length > 0) {
        errors.forEach(error => showNotification(error, 'error'));
        return false;
    }
    
    return true;
}

// Mostrar modal de pago
function showPaymentModal(userData, chartData) {
    const modal = document.getElementById('paymentModal');
    
    // Actualizar vista previa de la carta
    document.getElementById('previewSunSign').textContent = chartData.sunSign;
    document.getElementById('previewMoonSign').textContent = chartData.moonSign;
    document.getElementById('previewAscendant').textContent = chartData.ascendant;
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    showNotification('¡Tu carta astral está lista! Paga solo €0.50 para verla completa.', 'success');
}

// Manejar envío del pago
function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const paymentData = {
        cardNumber: formData.get('cardNumber'),
        expiryDate: formData.get('expiryDate'),
        cvv: formData.get('cvv'),
        cardName: formData.get('cardName')
    };
    
    // Validar tarjeta
    if (!validateCard(paymentData)) {
        return;
    }
    
    // Mostrar loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
        // Simular procesamiento de pago
            setTimeout(() => {
        // Simular éxito del pago
        showNotification('¡Pago exitoso! Tu carta astral está desbloqueada.', 'success');
        
        // Cerrar modal de pago
        closeModal(document.getElementById('paymentModal'));
        
        // Mostrar carta astral completa
        showChartResultModal();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Limpiar formulario
        e.target.reset();
        
        // Iniciar periodo de prueba
        startTrialPeriod();
        }, 3000);
}

// Mostrar modal de resultado de carta astral
function showChartResultModal() {
    const modal = document.getElementById('chartResultModal');
    const chartData = JSON.parse(localStorage.getItem('astralChart'));
    
    if (chartData) {
        // Actualizar datos de la carta
        document.getElementById('resultName').textContent = chartData.birthData.name;
        document.getElementById('resultSunSign').textContent = chartData.sunSign;
        document.getElementById('resultMoonSign').textContent = chartData.moonSign;
        document.getElementById('resultAscendant').textContent = chartData.ascendant;
        document.getElementById('resultElement').textContent = chartData.element;
        
        // Generar análisis personalizado
        document.getElementById('resultAnalysis').textContent = generatePersonalAnalysis(chartData);
        document.getElementById('resultPredictions').textContent = generatePredictions(chartData);
    }
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Iniciar countdown del periodo de prueba
    startTrialCountdown();
}

// Iniciar periodo de prueba
function startTrialPeriod() {
    trialStartTime = Date.now();
    localStorage.setItem('trialStartTime', trialStartTime);
    localStorage.setItem('trialActive', 'true');
    
    showNotification('🎁 ¡Periodo de prueba activado! Tienes 2 días completos de acceso.', 'success');
}

// Verificar periodo de prueba activo
function checkActiveTrial() {
    const trialActive = localStorage.getItem('trialActive');
    const trialStartTime = localStorage.getItem('trialStartTime');
    
    if (trialActive && trialStartTime) {
        const elapsed = Date.now() - parseInt(trialStartTime);
        
        if (elapsed < trialDuration) {
            // Periodo de prueba aún activo
            startTrialCountdown();
        } else {
            // Periodo de prueba expirado, activar suscripción
            activateSubscription();
        }
    }
}

// Verificar acceso al dashboard
function checkDashboardAccess() {
    try {
        const testAnswers = localStorage.getItem('astralTestAnswers');
        const userEmail = localStorage.getItem('userEmail');
        const loginBtn = document.querySelector('.btn-login');
        
        if (loginBtn) {
            if (testAnswers && userEmail) {
                // Usuario tiene acceso al dashboard
                loginBtn.style.display = 'flex';
                loginBtn.classList.add('login-available');
                
                // Verificar si el periodo de prueba está activo
                const trialStart = localStorage.getItem('trialStartTime');
                if (trialStart) {
                    const trialStartTime = parseInt(trialStart);
                    const currentTime = Date.now();
                    const trialEndTime = trialStartTime + (2 * 24 * 60 * 60 * 1000);
                    
                    if (currentTime < trialEndTime) {
                        loginBtn.innerHTML = `
                            <i class="fas fa-sign-in-alt"></i>
                            <span>Entrar</span>
                        `;
                        loginBtn.classList.remove('login-expired');
                        loginBtn.classList.add('login-available');
    } else {
                        loginBtn.innerHTML = `
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>Prueba Expirada</span>
                        `;
                        loginBtn.classList.remove('login-available');
                        loginBtn.classList.add('login-expired');
                    }
                }
            } else {
                // Usuario no tiene acceso al dashboard
                loginBtn.style.display = 'flex';
                loginBtn.innerHTML = `
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Entrar</span>
                `;
                loginBtn.classList.remove('login-available', 'login-expired');
            }
        }
        
        console.log('🔍 Estado del login verificado');
        
    } catch (error) {
        console.error('Error al verificar acceso al dashboard:', error);
    }
}

// Iniciar countdown del periodo de prueba
function startTrialCountdown() {
    const countdownElement = document.getElementById('trialCountdown');
    if (!countdownElement) return;
    
    const updateCountdown = () => {
        const now = Date.now();
        const trialStart = parseInt(localStorage.getItem('trialStartTime') || now);
        const elapsed = now - trialStart;
        const remaining = trialDuration - elapsed;
        
        if (remaining <= 0) {
            // Periodo de prueba expirado
            activateSubscription();
            return;
        }
        
        // Calcular tiempo restante
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        
        // Formatear countdown
        const countdownText = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        countdownElement.textContent = countdownText;
        
        // Continuar countdown
        requestAnimationFrame(updateCountdown);
    };
    
    updateCountdown();
}

// Activar suscripción automática
function activateSubscription() {
    localStorage.removeItem('trialActive');
    localStorage.removeItem('trialStartTime');
    
    showNotification('🔄 Tu suscripción se ha activado automáticamente por €19.99/mes.', 'info');
    
    // Aquí se implementaría la lógica real de facturación
    console.log('💳 Suscripción activada: €19.99/mes');
}

// Generar carta astral
function generateAstralChart(birthData) {
    console.log('🔮 Generando carta astral para:', birthData.name);
    
    // Simular cálculos astrológicos
    const chartData = calculateChartData(birthData);
    
    // Guardar en localStorage
    localStorage.setItem('astralChart', JSON.stringify(chartData));
    
    return chartData;
}

// Calcular datos de la carta (simulado)
function calculateChartData(birthData) {
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    const elements = ['Fuego', 'Tierra', 'Aire', 'Agua'];
    
    return {
        sunSign: signs[Math.floor(Math.random() * signs.length)],
        moonSign: signs[Math.floor(Math.random() * signs.length)],
        ascendant: signs[Math.floor(Math.random() * signs.length)],
        element: elements[Math.floor(Math.random() * elements.length)],
        birthData: birthData,
        generatedAt: new Date().toISOString()
    };
}

// Generar análisis personalizado
function generatePersonalAnalysis(chartData) {
    const analyses = {
        'Fuego': 'Eres una persona apasionada y enérgica. Tu espíritu aventurero te lleva a buscar constantemente nuevos desafíos. Tu signo solar de ' + chartData.sunSign + ' te da un carisma natural que atrae a los demás.',
        'Tierra': 'Eres práctico y confiable. Tu enfoque realista te ayuda a construir bases sólidas en todos los aspectos de tu vida. Tu signo lunar de ' + chartData.moonSign + ' te hace muy sensible a las necesidades de los demás.',
        'Aire': 'Eres intelectual y comunicativo. Tu mente ágil te permite adaptarte fácilmente a nuevas situaciones. Tu ascendente de ' + chartData.ascendant + ' te da una apariencia que inspira confianza.',
        'Agua': 'Eres intuitivo y emocional. Tu sensibilidad te permite entender profundamente los sentimientos de los demás. Tu combinación astral te hace único y especial.'
    };
    
    return analyses[chartData.element] || 'Tu carta astral revela una personalidad única y compleja que combina elementos de fuego, tierra, aire y agua de manera equilibrada.';
}

// Generar predicciones
function generatePredictions(chartData) {
    const predictions = [
        'Los próximos 3 meses traerán oportunidades importantes en tu vida profesional. Mantén los ojos abiertos para nuevas posibilidades.',
        'Tu vida amorosa experimentará un renacimiento. Las energías astrales favorecen las conexiones profundas y significativas.',
        'La luna en ' + chartData.moonSign + ' indica un período de crecimiento personal. Es momento de reflexionar sobre tus metas.',
        'Tu elemento dominante de ' + chartData.element + ' te dará la fuerza necesaria para superar cualquier obstáculo que encuentres.',
        'Las estrellas alinean para traer abundancia y prosperidad a tu vida. Confía en tu intuición para tomar las decisiones correctas.'
    ];
    
    return predictions[Math.floor(Math.random() * predictions.length)];
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar tarjeta de crédito
function validateCard(data) {
    const errors = [];
    
    if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length !== 16) {
        errors.push('Número de tarjeta inválido');
    }
    
    if (!data.expiryDate || !/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
        errors.push('Fecha de expiración inválida (formato: MM/AA)');
    }
    
    if (!data.cvv || data.cvv.length !== 3) {
        errors.push('CVV inválido');
    }
    
    if (!data.cardName || data.cardName.length < 2) {
        errors.push('Nombre en la tarjeta requerido');
    }
    
    if (errors.length > 0) {
        errors.forEach(error => showNotification(error, 'error'));
        return false;
    }
    
    return true;
}

// Configurar validación de tarjeta
function setupCardValidation() {
    const cardNumber = document.getElementById('paymentCardNumber');
    const expiryDate = document.getElementById('paymentExpiryDate');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
}

// Configurar validación de formularios
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validar campo
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Email inválido');
        return false;
    }
    
    return true;
}

// Mostrar error de campo
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--error-color)';
}

// Limpiar error de campo
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// Configurar efectos de hover en tarjetas
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Configurar enlaces internos
function setupInternalLinks() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });
}

// Scroll a sección
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Configurar efectos de partículas
function setupParticleEffects() {
    // Crear partículas flotantes
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 20; i++) {
            createFloatingParticle(hero);
        }
    }
}

// Crear partícula flotante
function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: float 6s ease-in-out infinite;
        animation-delay: ${Math.random() * 6}s;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
    `;
    
    container.appendChild(particle);
}

// Configurar animaciones
function setupAnimations() {
    // Observador de intersección para animaciones de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar elementos para animar
    const animateElements = document.querySelectorAll('.service-card, .pricing-card, .testimonial-card, .form, .test-container');
    animateElements.forEach(el => observer.observe(el));
}

// Inicializar animaciones de entrada
function initializeEntranceAnimations() {
    // Añadir estilos CSS para animaciones
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .pricing-card, .testimonial-card, .form, .test-container {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar contadores
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.dataset.count;
                animateCounter(entry.target, parseInt(target));
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Animar contador
function animateCounter(counter, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 20);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
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
    }, 5000);
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

// Funciones globales
window.scrollToSection = scrollToSection;
window.openVideoModal = openVideoModal;
window.downloadChart = downloadChart;
window.shareChart = shareChart;
window.explorePlatform = function() {
    showNotification('🚀 ¡Explora toda la plataforma! Tienes acceso completo por 2 días.', 'success');
};
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.handleLogin = handleLogin;
window.goToTest = goToTest;
window.showHelp = showHelp;

// Descargar carta
function downloadChart() {
    showNotification('Descargando tu carta astral...', 'info');
    
    // Simular descarga
    setTimeout(() => {
        showNotification('¡Carta astral descargada exitosamente!', 'success');
    }, 2000);
}

// Compartir carta
function shareChart() {
    if (navigator.share) {
        navigator.share({
            title: 'Mi Carta Astral - AstroKey',
            text: 'Descubre tu destino astral con AstroKey',
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('¡Enlace copiado al portapapeles!', 'success');
        });
    }
}

// Función para abrir modal de login
function openLoginModal() {
    try {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'block';
            
            // Limpiar formulario
            document.getElementById('loginForm').reset();
            
            // Enfocar en el primer campo
            document.getElementById('loginEmail').focus();
            
            console.log('🔐 Modal de login abierto');
        }
    } catch (error) {
        console.error('Error al abrir modal de login:', error);
        showNotification('❌ Error al abrir el formulario de login', 'error');
    }
}

// Función para cerrar modal de login
function closeLoginModal() {
    try {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
            console.log('🔐 Modal de login cerrado');
        }
    } catch (error) {
        console.error('Error al cerrar modal de login:', error);
    }
}

// Función para manejar el login
function handleLogin(event) {
    event.preventDefault();
    
    try {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        // Validar campos
        if (!email || !password) {
            showNotification('❌ Por favor completa todos los campos', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('❌ Formato de email inválido', 'error');
            return;
        }
        
        // Verificar si el usuario existe y tiene acceso
        const testAnswers = localStorage.getItem('astralTestAnswers');
        const storedEmail = localStorage.getItem('userEmail');
        
        if (!testAnswers || !storedEmail) {
            showNotification('❌ No hay usuarios registrados. Completa el test primero.', 'error');
            setTimeout(() => {
                closeLoginModal();
                window.location.href = 'intro.html';
            }, 2000);
            return;
        }
        
        // Verificar si el email coincide
        if (email !== storedEmail) {
            showNotification('❌ Email no encontrado. Usa el email con el que completaste el test.', 'error');
            return;
        }
        
        // Verificar contraseña (simulada - en producción sería hash)
        if (password !== 'astral123') { // Contraseña por defecto
            showNotification('❌ Contraseña incorrecta. Intenta con: astral123', 'error');
            return;
        }
        
        // Verificar si el periodo de prueba está activo
        const trialStart = localStorage.getItem('trialStartTime');
        if (trialStart) {
            const trialStartTime = parseInt(trialStart);
            const currentTime = Date.now();
            const trialEndTime = trialStartTime + (2 * 24 * 60 * 60 * 1000); // 2 días
            
            if (currentTime > trialEndTime) {
                showNotification('⚠️ Tu periodo de prueba ha expirado. Completa el test nuevamente.', 'warning');
                setTimeout(() => {
                    closeLoginModal();
                    window.location.href = 'intro.html';
                }, 2000);
                return;
            }
        }
        
        // Login exitoso
        showNotification('✅ Login exitoso. Redirigiendo al dashboard...', 'success');
        
        // Marcar como logueado
        localStorage.setItem('isLoggedIn', 'true');
        
        // Cerrar modal y redirigir
        setTimeout(() => {
            closeLoginModal();
            window.location.href = 'dashboard.html';
        }, 1500);
        
        console.log('✅ Login exitoso para:', email);
        
    } catch (error) {
        console.error('Error en el login:', error);
        showNotification('❌ Error durante el login', 'error');
    }
}

// Función para ir al test
function goToTest() {
    closeLoginModal();
    window.location.href = 'intro.html';
}

// Función para mostrar ayuda
function showHelp() {
            showNotification('📧 Contacta con soporte: support@astrokey.com', 'info');
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        setupEventListeners,
        showNotification,
        validateTestData,
        generateAstralChart,
        startTrialPeriod
    };
}
