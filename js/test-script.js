// ===== TEST SCRIPT - ASTRALCOACH PRO =====

// Variables globales del test
let currentStep = 1;
const totalSteps = 14;
let testAnswers = {};
let selectedOptions = {};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Test Astral Completo iniciado');
    
    // Mostrar pantalla de inicio por defecto
    showStartScreen();
});

// Mostrar pantalla de inicio
function showStartScreen() {
    const startScreen = document.getElementById('startScreen');
    const testContainer = document.getElementById('testContainer');
    
    if (startScreen && testContainer) {
        startScreen.style.display = 'flex';
        testContainer.style.display = 'none';
    }
}

// Iniciar el test
function startTest() {
    const startScreen = document.getElementById('startScreen');
    const testContainer = document.getElementById('testContainer');
    
    if (startScreen && testContainer) {
        startScreen.style.display = 'none';
        testContainer.style.display = 'block';
        
        // Inicializar el test
        initializeTest();
        setupEventListeners();
        populateSelectOptions();
        
        // Asegurar que el primer paso se muestre correctamente
        setTimeout(() => {
            showStep(1);
        }, 100);
    }
}

// Inicializar el test
function initializeTest() {
    // Configurar respuestas por defecto
    testAnswers = {
        gender: '',
        birthDate: { day: '', month: '', year: '' },
        birthTime: { hour: '', minute: '' },
        birthPlace: '',
        relationshipStatus: '',
        hasNatalChart: '',
        currentThoughts: '',
        element: '',
        personalityTraits: [],
        compatibleSigns: [],
        lifeDifficulties: '',
        fullName: '',
        lifeGoals: '',
        astrologicalPreferences: '',
        finalEmail: ''
    };
    
    // Configurar opciones seleccionadas
    selectedOptions = {
        personalityTraits: [],
        compatibleSigns: []
    };
    
    // Configurar eventos
    setupOptionCards();
    setupTextInputs();
    setupSpecialLinks();
    setupLocationSearch();
    
    // No llamar showStep aquí, se llama desde startTest
}

// Configurar event listeners
function setupEventListeners() {
    // Configurar selección de opciones
    setupOptionSelection();
    
    // Configurar inputs de texto
    setupTextInputs();
    
    // Configurar enlaces especiales
    setupSpecialLinks();
}

// Configurar selección de opciones
function setupOptionSelection() {
    // Opciones simples (una sola selección)
    const simpleOptions = document.querySelectorAll('.option-card:not(.personality-trait):not(.zodiac-sign)');
    simpleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.dataset.value;
            const step = this.closest('.test-step').dataset.step;
            
            // Deseleccionar otras opciones del mismo paso
            const otherOptions = this.closest('.options-grid').querySelectorAll('.option-card');
            otherOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar esta opción
            this.classList.add('selected');
            
            // Guardar respuesta
            saveAnswer(step, value);
        });
    });
    
    // Rasgos de personalidad (múltiple selección)
    const personalityTraits = document.querySelectorAll('.personality-trait');
    personalityTraits.forEach(trait => {
        trait.addEventListener('click', function() {
            const value = this.dataset.value;
            
            if (this.classList.contains('selected')) {
                // Deseleccionar
                this.classList.remove('selected');
                removeFromArray(selectedOptions.personalityTraits, value);
            } else {
                // Seleccionar
                this.classList.add('selected');
                selectedOptions.personalityTraits.push(value);
            }
            
            // Guardar respuesta
            testAnswers.personalityTraits = [...selectedOptions.personalityTraits];
        });
    });
    
    // Signos del zodiaco (máximo 3)
    const zodiacSigns = document.querySelectorAll('.zodiac-sign');
    zodiacSigns.forEach(sign => {
        sign.addEventListener('click', function() {
            const value = this.dataset.value;
            
            if (this.classList.contains('selected')) {
                // Deseleccionar
                this.classList.remove('selected');
                removeFromArray(selectedOptions.compatibleSigns, value);
            } else {
                // Verificar límite de 3
                if (selectedOptions.compatibleSigns.length >= 3) {
                    showNotification('Solo puedes seleccionar máximo 3 signos', 'warning');
                    return;
                }
                
                // Seleccionar
                this.classList.add('selected');
                selectedOptions.compatibleSigns.push(value);
            }
            
            // Guardar respuesta
            testAnswers.compatibleSigns = [...selectedOptions.compatibleSigns];
        });
    });
}

// Configurar inputs de texto
function setupTextInputs() {
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    textInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const step = this.closest('.test-step').dataset.step;
            const fieldName = this.name;
            const value = this.value;
            
            if (step === '2') {
                // Fecha de nacimiento
                if (fieldName === 'birthDay') testAnswers.birthDate.day = value;
                if (fieldName === 'birthMonth') testAnswers.birthDate.month = value;
                if (fieldName === 'birthYear') testAnswers.birthDate.year = value;
            } else if (step === '3') {
                // Hora de nacimiento
                if (fieldName === 'birthHour') testAnswers.birthTime.hour = value;
                if (fieldName === 'birthMinute') testAnswers.birthTime.minute = value;
            } else if (step === '4') {
                // Lugar de nacimiento
                testAnswers.birthPlace = value;
            }
            
            clearFieldError(this);
        });
    });
}

// Configurar enlaces especiales
function setupSpecialLinks() {
    // Enlace "No lo sé" para hora de nacimiento
    const dontKnowLink = document.querySelector('.dont-know-link');
    if (dontKnowLink) {
        dontKnowLink.addEventListener('click', function(e) {
            e.preventDefault();
            showTimeModal();
        });
    }
}

// Configurar búsqueda de ubicación
function setupLocationSearch() {
    const locationInput = document.getElementById('birthPlace');
    const searchResults = document.getElementById('searchResults');
    
    if (locationInput && searchResults) {
        locationInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            // Simular búsqueda de ciudades
            const cities = searchCities(query);
            displaySearchResults(cities, searchResults);
        });
        
        // Ocultar resultados al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!locationInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Buscar ciudades (simulado)
function searchCities(query) {
    const allCities = [
        'Madrid, España', 'Barcelona, España', 'Valencia, España', 'Sevilla, España',
        'Buenos Aires, Argentina', 'Córdoba, Argentina', 'Rosario, Argentina',
        'Ciudad de México, México', 'Guadalajara, México', 'Monterrey, México',
        'Santiago, Chile', 'Valparaíso, Chile', 'Concepción, Chile',
        'Bogotá, Colombia', 'Medellín, Colombia', 'Cali, Colombia',
        'Lima, Perú', 'Arequipa, Perú', 'Trujillo, Perú',
        'Caracas, Venezuela', 'Maracaibo, Venezuela', 'Valencia, Venezuela',
        'Quito, Ecuador', 'Guayaquil, Ecuador', 'Cuenca, Ecuador',
        'La Paz, Bolivia', 'Santa Cruz, Bolivia', 'Cochabamba, Bolivia',
        'Asunción, Paraguay', 'Ciudad del Este, Paraguay',
        'Montevideo, Uruguay', 'Salto, Uruguay',
        'New York, USA', 'Los Angeles, USA', 'Chicago, USA',
        'London, UK', 'Manchester, UK', 'Birmingham, UK',
        'Paris, France', 'Lyon, France', 'Marseille, France',
        'Berlin, Germany', 'Munich, Germany', 'Hamburg, Germany',
        'Rome, Italy', 'Milan, Italy', 'Naples, Italy',
        'Tokyo, Japan', 'Osaka, Japan', 'Kyoto, Japan'
    ];
    
    return allCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
}

// Mostrar resultados de búsqueda
function displaySearchResults(cities, container) {
    if (cities.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.innerHTML = cities.map(city => 
        `<div class="search-result-item" onclick="selectCity('${city}')">${city}</div>`
    ).join('');
    
    container.style.display = 'block';
}

// Seleccionar ciudad
function selectCity(city) {
    const locationInput = document.getElementById('birthPlace');
    const searchResults = document.getElementById('searchResults');
    
    if (locationInput) {
        locationInput.value = city;
        testAnswers.birthPlace = city;
    }
    
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Poblar opciones de los selects
function populateSelectOptions() {
    // Días del 1 al 31
    const birthDay = document.getElementById('birthDay');
    if (birthDay) {
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            birthDay.appendChild(option);
        }
    }
    
    // Años (desde 1920 hasta 2010)
    const birthYear = document.getElementById('birthYear');
    if (birthYear) {
        for (let i = 2010; i >= 1920; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            birthYear.appendChild(option);
        }
    }
    
    // Horas del 0 al 23
    const birthHour = document.getElementById('birthHour');
    if (birthHour) {
        for (let i = 0; i <= 23; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i.toString().padStart(2, '0');
            birthHour.appendChild(option);
        }
    }
    
    // Minutos del 0 al 59
    const birthMinute = document.getElementById('birthMinute');
    if (birthMinute) {
        for (let i = 0; i <= 59; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i.toString().padStart(2, '0');
            birthMinute.appendChild(option);
        }
    }
}

// Mostrar paso específico
function showStep(stepNumber) {
    console.log(`🔍 Mostrando paso ${stepNumber}`);
    
    // Ocultar todos los pasos
    const allSteps = document.querySelectorAll('.test-step');
    console.log(`📝 Pasos encontrados: ${allSteps.length}`);
    
    allSteps.forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });
    
    // Mostrar paso actual
    const currentStepElement = document.getElementById(`step${stepNumber}`);
    console.log(`🎯 Elemento del paso ${stepNumber}:`, currentStepElement);
    
    if (currentStepElement) {
        currentStepElement.style.display = 'block';
        currentStepElement.classList.add('active');
        console.log(`✅ Paso ${stepNumber} mostrado correctamente`);
    } else {
        console.error(`❌ No se encontró el elemento step${stepNumber}`);
    }
    
    // Actualizar estado de navegación
    updateNavigation(stepNumber);
    
    // Actualizar progreso
    updateProgress(stepNumber);
    
    // Actualizar botón de continuar
    updateContinueButton(stepNumber);
}

// Actualizar navegación
function updateNavigation(stepNumber) {
    const backBtn = document.querySelector('.back-btn');
    const skipBtn = document.querySelector('.skip-btn');
    
    // Botón atrás
    if (stepNumber === 1) {
        backBtn.disabled = true;
        backBtn.style.opacity = '0.5';
    } else {
        backBtn.disabled = false;
        backBtn.style.opacity = '1';
    }
    
    // Botón saltar (no disponible en pasos críticos)
    if (stepNumber === 1 || stepNumber === 2 || stepNumber === 3 || stepNumber === 4) {
        skipBtn.style.display = 'none';
    } else {
        skipBtn.style.display = 'flex';
    }
}

// Actualizar progreso
function updateProgress(stepNumber) {
    const progressFill = document.getElementById('progressFill');
    const currentStepSpan = document.getElementById('currentStep');
    
    if (progressFill) {
        const progressPercentage = (stepNumber / totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (currentStepSpan) {
        currentStepSpan.textContent = stepNumber;
    }
}

// Actualizar botón de continuar
function updateContinueButton(stepNumber) {
    const continueBtn = document.getElementById('continueBtn');
    
    if (stepNumber === totalSteps) {
        continueBtn.innerHTML = '<span>Finalizar Test</span><i class="fas fa-check"></i>';
        continueBtn.onclick = finishTest;
    } else {
        continueBtn.innerHTML = '<span>Continuar</span><i class="fas fa-arrow-right"></i>';
        continueBtn.onclick = nextStep;
    }
}

// Siguiente paso
function nextStep() {
    if (currentStep < totalSteps) {
        // Validar paso actual antes de continuar
        if (validateCurrentStep()) {
            currentStep++;
            showStep(currentStep);
            
            // Scroll al top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Paso anterior
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        
        // Scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Saltar paso
function skipStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        
        // Scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Validar paso actual
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    
    switch (currentStep) {
        case 1: // Sexo
            if (!testAnswers.gender) {
                showNotification('Por favor selecciona tu sexo', 'error');
                return false;
            }
            break;
            
        case 2: // Fecha de nacimiento
            if (!testAnswers.birthDate.day || !testAnswers.birthDate.month || !testAnswers.birthDate.year) {
                showNotification('Por favor completa tu fecha de nacimiento', 'error');
                return false;
            }
            break;
            
        case 3: // Hora de nacimiento
            if (!testAnswers.birthTime.hour || !testAnswers.birthTime.minute) {
                showNotification('Por favor completa tu hora de nacimiento', 'error');
                return false;
            }
            break;
            
        case 4: // Lugar de nacimiento
            if (!testAnswers.birthPlace) {
                showFieldError(document.getElementById('birthPlace'), 'Este campo es requerido');
                return false;
            }
            break;
            
        case 5: // Situación sentimental
            if (!testAnswers.relationshipStatus) {
                showNotification('Por favor selecciona tu situación sentimental', 'error');
                return false;
            }
            break;
            
        case 6: // Carta natal previa
            if (!testAnswers.hasNatalChart) {
                showNotification('Por favor responde si te has hecho una carta natal', 'error');
                return false;
            }
            break;
            
        case 7: // Temas de pensamiento
            if (!testAnswers.currentThoughts) {
                showNotification('Por favor selecciona en qué temas has pensado', 'error');
                return false;
            }
            break;
            
        case 8: // Elementos
            if (!testAnswers.element) {
                showNotification('Por favor selecciona tu elemento dominante', 'error');
                return false;
            }
            break;
            
        case 9: // Rasgos de personalidad
            if (testAnswers.personalityTraits.length === 0) {
                showNotification('Por favor selecciona al menos un rasgo de personalidad', 'error');
                return false;
            }
            break;
            
        case 10: // Compatibilidad con signos
            if (testAnswers.compatibleSigns.length === 0) {
                showNotification('Por favor selecciona al menos un signo compatible', 'error');
                return false;
            }
            break;
            
        case 11: // Dificultades en la vida
            if (!testAnswers.lifeDifficulties) {
                showNotification('Por favor selecciona qué te ha costado más en la vida', 'error');
                return false;
            }
            break;
            
        case 12: // Nombre
            if (!testAnswers.fullName) {
                showFieldError(document.getElementById('fullName'), 'Este campo es requerido');
                return false;
            }
            break;
            
        case 13: // Objetivos
            if (!testAnswers.lifeGoals) {
                showNotification('Por favor selecciona tus principales objetivos', 'error');
                return false;
            }
            break;
            
        case 14: // Preferencias
            if (!testAnswers.astrologicalPreferences) {
                showNotification('Por favor selecciona tus preferencias astrológicas', 'error');
                return false;
            }
            break;
    }
    
    return true;
}

// Guardar respuesta
function saveAnswer(step, value) {
    switch (step) {
        case '1':
            testAnswers.gender = value;
            break;
        case '5':
            testAnswers.relationshipStatus = value;
            break;
        case '6':
            testAnswers.hasNatalChart = value;
            break;
        case '7':
            testAnswers.currentThoughts = value;
            break;
        case '8':
            testAnswers.element = value;
            break;
        case '11':
            testAnswers.lifeDifficulties = value;
            break;
        case '13':
            testAnswers.lifeGoals = value;
            break;
        case '14':
            testAnswers.astrologicalPreferences = value;
            break;
    }
}

// Finalizar test
function finishTest() {
    // Mostrar modal de carga
    showLoadingModal();
    
    // Simular proceso de análisis
    simulateAnalysis();
}

// Simular análisis
function simulateAnalysis() {
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        const progressElement = document.getElementById('loadingProgress');
        if (progressElement) {
            progressElement.textContent = `${progress}%`;
        }
        
        // Completar pasos del loading
        if (progress >= 25) {
            document.querySelector('.loading-step:nth-child(2)').classList.add('completed');
            document.querySelector('.loading-step:nth-child(2) i').className = 'fas fa-check';
        }
        
        if (progress >= 50) {
            document.querySelector('.loading-step:nth-child(3)').classList.add('completed');
            document.querySelector('.loading-step:nth-child(3) i').className = 'fas fa-check';
        }
        
        if (progress >= 75) {
            document.querySelector('.loading-step:nth-child(4)').classList.add('completed');
            document.querySelector('.loading-step:nth-child(4) i').className = 'fas fa-check';
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Ocultar modal de carga
            hideLoadingModal();
            
            // Mostrar modal de solicitud de email
            showEmailModal();
        }
    }, 100);
}

// Mostrar modal de carga
function showLoadingModal() {
    const modal = document.getElementById('loadingModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Ocultar modal de carga
function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Mostrar modal de confirmación de hora
function showTimeModal() {
    const modal = document.getElementById('timeModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Editar hora
function editTime() {
    const modal = document.getElementById('timeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Confirmar hora
function confirmTime() {
    const modal = document.getElementById('timeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Continuar al siguiente paso
    nextStep();
}

// Mostrar modal de solicitud de email
function showEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Ocultar modal de email
function hideEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Enviar email y finalizar
function submitEmail() {
    const emailInput = document.getElementById('finalEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showFieldError(emailInput, 'Este campo es requerido');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFieldError(emailInput, 'Introduzca un email válido');
        return;
    }
    
    // Guardar email
    testAnswers.finalEmail = email;
    
    // Ocultar modal de email
    hideEmailModal();
    
    // Redirigir a la página principal
    redirectToMainPage();
}

// Redirigir a página principal
function redirectToMainPage() {
    // Guardar respuestas en localStorage
    localStorage.setItem('astralTestAnswers', JSON.stringify(testAnswers));
    
    // Mostrar notificación de éxito
    showNotification('¡Test completado exitosamente! Redirigiendo...', 'success');
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Validar campo
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Introduzca un email válido');
        return false;
    }
    
    // Guardar valor en testAnswers
    const fieldName = field.name;
    if (fieldName === 'fullName') testAnswers.fullName = value;
    if (fieldName === 'finalEmail') testAnswers.finalEmail = value;
    
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

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Remover elemento de array
function removeFromArray(array, item) {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
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

// Funciones globales
window.nextStep = nextStep;
window.previousStep = previousStep;
window.skipStep = skipStep;
window.editTime = editTime;
window.confirmTime = confirmTime;

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTest,
        nextStep,
        previousStep,
        validateCurrentStep,
        finishTest
    };
}
