// ===== DASHBOARD SCRIPT - ASTROKEY =====

// Variables globales
let currentSection = 'overview';
let trialEndDate = null;
let userData = {};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard AstroKey iniciado');
    
    try {
        initializeDashboard();
        setupNavigation();
        loadUserData();
        updateTrialCountdown();
        setupEventListeners();
    } catch (error) {
        console.error('Error al inicializar dashboard:', error);
    }
});

// Inicializar el dashboard
function initializeDashboard() {
    try {
        console.log('🔍 Inicializando dashboard...');
        
        // Verificar si el usuario tiene acceso
        const testAnswers = localStorage.getItem('astralTestAnswers');
        const userEmail = localStorage.getItem('userEmail');
        
        console.log('📊 Datos encontrados:', { testAnswers: !!testAnswers, userEmail: !!userEmail });
        
        if (!testAnswers || !userEmail) {
            console.log('⚠️ Usuario no autorizado, redirigiendo al test...');
            // Si no hay datos, redirigir al test
            window.location.href = 'test.html';
            return;
        }
        
        // Configurar fecha de fin de prueba (2 días desde el pago)
        const paymentDate = localStorage.getItem('paymentDate');
        if (paymentDate) {
            trialEndDate = new Date(paymentDate);
            trialEndDate.setDate(trialEndDate.getDate() + 2);
            console.log('📅 Fecha de fin de prueba configurada:', trialEndDate);
        } else {
            // Si no hay fecha de pago, establecer 2 días desde ahora
            trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 2);
            console.log('📅 Fecha de fin de prueba por defecto:', trialEndDate);
        }
        
        console.log('✅ Usuario autorizado, dashboard inicializado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar dashboard:', error);
        // En caso de error, mostrar mensaje al usuario
        showNotification('Error al cargar el dashboard. Recargando página...', 'error');
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

// Configurar navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
            
            // Actualizar navegación activa
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });
}

// Mostrar sección específica
function showSection(sectionId) {
    try {
        // Ocultar todas las secciones
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección objetivo
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionId;
            
            // Cargar contenido específico de la sección
            loadSectionContent(sectionId);
        } else {
            console.error('Sección no encontrada:', sectionId);
        }
    } catch (error) {
        console.error('Error al mostrar sección:', error);
    }
}

// Cargar contenido específico de cada sección
function loadSectionContent(sectionId) {
    switch(sectionId) {
        case 'overview':
            loadOverviewData();
            break;
        case 'predictions':
            loadPredictions();
            break;
        case 'chart':
            loadNatalChart();
            break;
        case 'compatibility':
            loadCompatibilityTools();
            break;
        case 'transits':
            loadTransits();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Cargar datos del usuario
function loadUserData() {
    try {
        const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
        const userEmail = localStorage.getItem('userEmail');
        
        // Construir nombre completo desde firstName y lastName
        let fullName = 'Usuario';
        if (testAnswers.firstName && testAnswers.lastName) {
            fullName = `${testAnswers.firstName} ${testAnswers.lastName}`;
        } else if (testAnswers.firstName) {
            fullName = testAnswers.firstName;
        } else if (testAnswers.lastName) {
            fullName = testAnswers.lastName;
        }
        
        userData = {
            name: fullName,
            email: userEmail || 'Email no disponible',
            birthDate: testAnswers.birthDate || 'Fecha no disponible',
            birthPlace: testAnswers.birthPlace || 'Lugar no disponible',
            birthTime: testAnswers.birthTime || 'Hora no disponible'
        };
        
        console.log('📊 Datos del usuario cargados:', userData);
        
        // Actualizar interfaz
        const userNameElement = document.getElementById('dashboardUserName');
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }
        
        // Cargar datos en el resumen
        loadOverviewData();
        
        // Cargar datos en los campos del perfil
        loadProfileFields();
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        userData = {
            name: 'Usuario',
            email: 'Email no disponible',
            birthDate: 'Fecha no disponible',
            birthPlace: 'Lugar no disponible',
            birthTime: 'Hora no disponible'
        };
    }
}

// Cargar datos del resumen
function loadOverviewData() {
    try {
        const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
        
        // Si no hay datos, usar datos de prueba
        if (!testAnswers.birthDate) {
            console.log('⚠️ No hay datos de nacimiento, usando datos de prueba');
            testAnswers.birthDate = '1990-03-15';
            testAnswers.birthTime = '14:30';
        }
        
        // Declarar variables en el scope correcto
        let sunSign, moonSign, ascendant, dominantElement;
        
        // Actualizar tarjetas de resumen
        if (testAnswers.birthDate) {
            sunSign = calculateSunSign(testAnswers.birthDate);
            if (sunSign) {
                const sunElement = document.getElementById('summarySunSign');
                if (sunElement) {
                    sunElement.textContent = sunSign.name;
                    console.log('✅ Signo Solar actualizado:', sunSign.name);
                }
            }
            
            moonSign = calculateMoonSign(testAnswers.birthDate);
            if (moonSign) {
                const moonElement = document.getElementById('summaryMoonSign');
                if (moonElement) {
                    moonElement.textContent = moonSign.name;
                    console.log('✅ Signo Lunar actualizado:', moonSign.name);
                }
            }
            
            ascendant = calculateAscendant(testAnswers.birthDate, testAnswers.birthTime);
            if (ascendant) {
                const ascElement = document.getElementById('summaryAscendant');
                if (ascElement) {
                    ascElement.textContent = ascendant.name;
                    console.log('✅ Ascendente actualizado:', ascendant.name);
                }
            }
        }
        
        // Elemento dominante
        dominantElement = determineDominantElement(testAnswers);
        if (dominantElement) {
            const elementElement = document.getElementById('summaryElement');
            if (elementElement) {
                elementElement.textContent = dominantElement.name;
                console.log('✅ Elemento actualizado:', dominantElement.name);
            }
        }
        
        console.log('📊 Datos del resumen cargados correctamente');
        console.log('☀️ Signo Solar:', sunSign?.name);
        console.log('🌙 Signo Lunar:', moonSign?.name);
        console.log('⬆️ Ascendente:', ascendant?.name);
        console.log('🔥 Elemento:', dominantElement?.name);
        
        // Verificar que los elementos del DOM existan
        const elements = {
            sun: document.getElementById('summarySunSign'),
            moon: document.getElementById('summaryMoonSign'),
            asc: document.getElementById('summaryAscendant'),
            element: document.getElementById('summaryElement')
        };
        
        console.log('🔍 Elementos del DOM encontrados:', {
            sun: !!elements.sun,
            moon: !!elements.moon,
            asc: !!elements.asc,
            element: !!elements.element
        });
        
    } catch (error) {
        console.error('Error al cargar datos del resumen:', error);
    }
}

// Cargar predicciones
function loadPredictions() {
    // Actualizar fecha actual
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('todayDate').textContent = today.toLocaleDateString('es-ES', options);
    
    // Aquí se podrían cargar predicciones dinámicas desde una API
    console.log('📅 Predicciones cargadas');
}

// Cargar carta natal
function loadNatalChart() {
    try {
        // Cargar datos del usuario
        const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
        
        // Actualizar información de nacimiento
        if (testAnswers.birthPlace) {
            const birthPlaceElement = document.getElementById('birthPlaceDisplay');
            if (birthPlaceElement) {
                birthPlaceElement.textContent = testAnswers.birthPlace;
            }
        }
        
        if (testAnswers.birthDate) {
            const birthDateElement = document.getElementById('birthDateDisplay');
            if (birthDateElement) {
                const date = new Date(testAnswers.birthDate);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                birthDateElement.textContent = date.toLocaleDateString('es-ES', options);
            }
        }
        
        if (testAnswers.birthTime) {
            const birthTimeElement = document.getElementById('birthTimeDisplay');
            if (birthTimeElement) {
                birthTimeElement.textContent = testAnswers.birthTime;
            }
        }
        
        // Actualizar posiciones planetarias
        updatePlanetaryPositions(testAnswers);
        
        console.log('🌌 Carta natal cargada correctamente');
    } catch (error) {
        console.error('Error al cargar carta natal:', error);
    }
}

// Actualizar posiciones planetarias
function updatePlanetaryPositions(testAnswers) {
    if (!testAnswers.birthDate) return;
    
    try {
        // Calcular posiciones basadas en fecha de nacimiento
        const sunSign = calculateSunSign(testAnswers.birthDate);
        const moonSign = calculateMoonSign(testAnswers.birthDate);
        const ascendant = calculateAscendant(testAnswers.birthDate, testAnswers.birthTime);
        
        // Actualizar Sol
        const sunElement = document.getElementById('sunPosition');
        if (sunElement && sunSign) {
            sunElement.textContent = `En ${sunSign.name}, Casa 1`;
        }
        
        // Actualizar Luna
        const moonElement = document.getElementById('moonPosition');
        if (moonElement && moonSign) {
            moonElement.textContent = `En ${moonSign.name}, Casa 4`;
        }
        
        // Actualizar Mercurio (simulado)
        const mercuryElement = document.getElementById('mercuryPosition');
        if (mercuryElement) {
            const mercurySign = calculateMercurySign(testAnswers.birthDate);
            mercuryElement.textContent = `En ${mercurySign}, Casa 12`;
        }
        
        // Actualizar otros planetas (simulado)
        updateOtherPlanets();
        
    } catch (error) {
        console.error('Error al actualizar posiciones planetarias:', error);
    }
}

// Calcular signo de Mercurio (simulado)
function calculateMercurySign(birthDate) {
    const signs = ['Piscis', 'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario'];
    const date = new Date(birthDate);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const signIndex = (dayOfYear + 5) % 12;
    return signs[signIndex];
}

// Actualizar otros planetas (simulado)
function updateOtherPlanets() {
    const planetPositions = {
        'venusPosition': 'En Tauro, Casa 2',
        'marsPosition': 'En Aries, Casa 1',
        'jupiterPosition': 'En Sagitario, Casa 9',
        'saturnPosition': 'En Capricornio, Casa 10'
    };
    
    Object.entries(planetPositions).forEach(([id, position]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = position;
        }
    });
}

// Configurar posiciones de planetas
function setupPlanetPositions() {
    try {
        const planets = document.querySelectorAll('.chart-planets .planet');
        
        if (planets.length === 0) {
            console.warn('No se encontraron planetas para posicionar');
            return;
        }
        
        // Posiciones más realistas y distribuidas
        const planetPositions = [
            { angle: 0, radius: 140, name: 'Sol' },      // Top
            { angle: 60, radius: 130, name: 'Luna' },    // Top-right
            { angle: 120, radius: 125, name: 'Mercurio' }, // Right
            { angle: 180, radius: 140, name: 'Venus' },  // Bottom
            { angle: 240, radius: 130, name: 'Marte' },  // Bottom-left
            { angle: 300, radius: 125, name: 'Júpiter' }, // Left
            { angle: 360, radius: 135, name: 'Saturno' }  // Top-left
        ];
        
        planets.forEach((planet, index) => {
            if (index < planetPositions.length) {
                const pos = planetPositions[index];
                const angleRad = (pos.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * pos.radius;
                const y = Math.sin(angleRad) * pos.radius;
                
                planet.style.transform = `translate(${x}px, ${y}px)`;
                
                // Añadir tooltip con información
                planet.addEventListener('click', function() {
                    showPlanetInfo(this.dataset.planet);
                });
                
                // Añadir efecto de pulso sutil
                planet.addEventListener('mouseenter', function() {
                    this.style.animation = 'planetPulse 2s infinite';
                });
                
                planet.addEventListener('mouseleave', function() {
                    this.style.animation = 'none';
                });
            }
        });
        
        // Añadir estilos de animación
        addPlanetAnimations();
    } catch (error) {
        console.error('Error al configurar posiciones de planetas:', error);
    }
}

// Añadir animaciones CSS para los planetas
function addPlanetAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes planetPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes houseGlow {
            0% { box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); }
            50% { box-shadow: 0 8px 25px rgba(124, 58, 237, 0.6); }
            100% { box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); }
        }
        
        .house:hover {
            animation: houseGlow 2s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Mostrar información del planeta
function showPlanetInfo(planetName) {
    const planetInfo = {
        sun: { name: 'Sol', sign: 'Aries', house: '1', meaning: 'Esencia fundamental y propósito de vida' },
        moon: { name: 'Luna', sign: 'Cáncer', house: '4', meaning: 'Emociones y mundo interior' },
        mercury: { name: 'Mercurio', sign: 'Piscis', house: '12', meaning: 'Comunicación y pensamiento' },
        venus: { name: 'Venus', sign: 'Tauro', house: '2', meaning: 'Amor y valores' },
        mars: { name: 'Marte', sign: 'Aries', house: '1', meaning: 'Energía y acción' },
        jupiter: { name: 'Júpiter', sign: 'Sagitario', house: '9', meaning: 'Expansión y sabiduría' },
        saturn: { name: 'Saturno', sign: 'Capricornio', house: '10', meaning: 'Responsabilidad y estructura' }
    };
    
    const info = planetInfo[planetName];
    if (info) {
        showNotification(`${info.name} en ${info.sign}, Casa ${info.house}: ${info.meaning}`, 'info');
    }
}

// Cargar herramientas de compatibilidad
function loadCompatibilityTools() {
    console.log('💕 Herramientas de compatibilidad cargadas');
}

// Calcular compatibilidad
function calculateCompatibility() {
    const partnerName = document.getElementById('partnerName').value;
    const partnerBirthDate = document.getElementById('partnerBirthDate').value;
    
    if (!partnerName || !partnerBirthDate) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    // Simular cálculo de compatibilidad
    showNotification('Calculando compatibilidad...', 'info');
    
    setTimeout(() => {
        // Mostrar resultados
        document.getElementById('compatibilityResults').style.display = 'block';
        
        // Generar puntuación aleatoria pero realista
        const communication = Math.floor(Math.random() * 30) + 70; // 70-100
        const emotional = Math.floor(Math.random() * 30) + 70; // 70-100
        const physical = Math.floor(Math.random() * 30) + 70; // 70-100
        
        const overall = Math.round((communication + emotional + physical) / 3);
        
        document.getElementById('compatibilityScore').textContent = overall + '%';
        
        // Actualizar barras de detalle
        updateCompatibilityBars(communication, emotional, physical);
        
        showNotification('¡Compatibilidad calculada exitosamente!', 'success');
    }, 2000);
}

// Actualizar barras de compatibilidad
function updateCompatibilityBars(communication, emotional, physical) {
    const bars = document.querySelectorAll('.bar-fill');
    const values = document.querySelectorAll('.detail-value');
    
    bars[0].style.width = communication + '%';
    bars[1].style.width = emotional + '%';
    bars[2].style.width = physical + '%';
    
    values[0].textContent = communication + '%';
    values[1].textContent = emotional + '%';
    values[2].textContent = physical + '%';
}

// Cargar tránsitos
function loadTransits() {
    console.log('🛰️ Tránsitos cargados');
}

// Cargar settings
function loadSettings() {
    try {
        console.log('⚙️ Settings cargados');
        loadProfileData();
        loadPreferences();
    } catch (error) {
        console.error('Error al cargar settings:', error);
    }
}

// Cargar datos del perfil
function loadProfileData() {
    try {
        const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
        const userEmail = localStorage.getItem('userEmail');
        
        // Cargar nombre
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.value = testAnswers.name || '';
        }
        
        // Cargar email
        const profileEmail = document.getElementById('profileEmail');
        if (profileEmail) {
            profileEmail.value = userEmail || '';
        }
        
        // Cargar fecha de nacimiento
        const profileBirthDate = document.getElementById('profileBirthDate');
        if (profileBirthDate) {
            profileBirthDate.value = testAnswers.birthDate || '';
        }
        
        // Cargar hora de nacimiento
        const profileBirthTime = document.getElementById('profileBirthTime');
        if (profileBirthTime) {
            profileBirthTime.value = testAnswers.birthTime || '';
        }
        
        // Cargar lugar de nacimiento
        const profileBirthPlace = document.getElementById('profileBirthPlace');
        if (profileBirthPlace) {
            profileBirthPlace.value = testAnswers.birthPlace || '';
        }
        
        console.log('📝 Datos del perfil cargados correctamente');
        
    } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
    }
}

// Cargar preferencias
function loadPreferences() {
    try {
        const emailNotifications = document.getElementById('emailNotifications');
        const pushNotifications = document.getElementById('pushNotifications');
        
        if (emailNotifications) {
            emailNotifications.checked = localStorage.getItem('emailNotifications') !== 'false';
        }
        
        if (pushNotifications) {
            pushNotifications.checked = localStorage.getItem('pushNotifications') !== 'false';
        }
        
    } catch (error) {
        console.error('Error al cargar preferencias:', error);
    }
}

// Actualizar countdown de prueba
function updateTrialCountdown() {
    try {
        if (!trialEndDate) return;
        
        const now = new Date();
        const timeLeft = trialEndDate - now;
        
        const countdownElement = document.getElementById('trialCountdown');
        if (!countdownElement) return;
        
        if (timeLeft <= 0) {
            // Prueba expirada
            countdownElement.textContent = 'Prueba expirada';
            countdownElement.style.color = '#ef4444';
            
            // Mostrar modal de suscripción
            showSubscriptionModal();
        } else {
            // Calcular días restantes
            const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
            countdownElement.textContent = `${daysLeft} día${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''}`;
        }
    } catch (error) {
        console.error('Error al actualizar countdown:', error);
    }
}

// Mostrar modal de suscripción
function showSubscriptionModal() {
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>¡Tu período de prueba ha expirado!</h3>
            <p>Para continuar disfrutando de todas las funcionalidades premium, activa tu suscripción mensual por solo 19,99€.</p>
            <div class="modal-actions">
                <button onclick="activateSubscription()" class="btn-primary">Activar Suscripción</button>
                <button onclick="closeSubscriptionModal()" class="btn-secondary">Más tarde</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

// Activar suscripción
function activateSubscription() {
    showNotification('Redirigiendo a la página de suscripción...', 'info');
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 2000);
}

// Cerrar modal de suscripción
function closeSubscriptionModal() {
    const modal = document.querySelector('.subscription-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Funciones de Settings
function saveProfile() {
    try {
        const profileName = document.getElementById('profileName').value.trim();
        const profileEmail = document.getElementById('profileEmail').value.trim();
        const profileBirthDate = document.getElementById('profileBirthDate').value;
        const profileBirthTime = document.getElementById('profileBirthTime').value;
        const profileBirthPlace = document.getElementById('profileBirthPlace').value.trim();
        
        // Validar campos requeridos
        if (!profileName) {
            showNotification('El nombre es obligatorio', 'error');
            return;
        }
        
        if (!profileEmail) {
            showNotification('El email es obligatorio', 'error');
            return;
        }
        
        if (!profileBirthDate) {
            showNotification('La fecha de nacimiento es obligatoria', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileEmail)) {
            showNotification('Formato de email inválido', 'error');
            return;
        }
        
        // Guardar en localStorage
        const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
        
        // Separar nombre completo en firstName y lastName
        const nameParts = profileName.split(' ');
        testAnswers.firstName = nameParts[0] || '';
        testAnswers.lastName = nameParts.slice(1).join(' ') || '';
        
        testAnswers.birthDate = profileBirthDate;
        testAnswers.birthTime = profileBirthTime || '';
        testAnswers.birthPlace = profileBirthPlace || '';
        
        localStorage.setItem('astralTestAnswers', JSON.stringify(testAnswers));
        localStorage.setItem('userEmail', profileEmail);
        
        showNotification('Perfil guardado correctamente', 'success');
        
        // Actualizar dashboard
        loadUserData();
        loadOverviewData();
        loadNatalChart();
        
        console.log('✅ Perfil guardado:', testAnswers);
        
    } catch (error) {
        console.error('Error al guardar perfil:', error);
        showNotification('Error al guardar el perfil', 'error');
    }
}

// Cargar campos del perfil
function loadProfileFields() {
    try {
        const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
        const userEmail = localStorage.getItem('userEmail');
        
        // Construir nombre completo
        let fullName = '';
        if (testAnswers.firstName && testAnswers.lastName) {
            fullName = `${testAnswers.firstName} ${testAnswers.lastName}`;
        } else if (testAnswers.firstName) {
            fullName = testAnswers.firstName;
        } else if (testAnswers.lastName) {
            fullName = testAnswers.lastName;
        }
        
        // Actualizar campos del perfil
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileBirthDate = document.getElementById('profileBirthDate');
        const profileBirthTime = document.getElementById('profileBirthTime');
        const profileBirthPlace = document.getElementById('profileBirthPlace');
        
        if (profileName) profileName.value = fullName;
        if (profileEmail) profileEmail.value = userEmail || '';
        if (profileBirthDate) profileBirthDate.value = testAnswers.birthDate || '';
        if (profileBirthTime) profileBirthTime.value = testAnswers.birthTime || '';
        if (profileBirthPlace) profileBirthPlace.value = testAnswers.birthPlace || '';
        
        console.log('✅ Campos del perfil cargados');
        
    } catch (error) {
        console.error('Error al cargar campos del perfil:', error);
    }
}

function savePreferences() {
    try {
        const emailNotifications = document.getElementById('emailNotifications').checked;
        const pushNotifications = document.getElementById('pushNotifications').checked;
        
        // Guardar preferencias
        localStorage.setItem('emailNotifications', emailNotifications);
        localStorage.setItem('pushNotifications', pushNotifications);
        
        // Simular guardado en servidor
        setTimeout(() => {
            showNotification('Preferencias guardadas correctamente', 'success');
        }, 500);
        
        console.log('✅ Preferencias guardadas:', {
            email: emailNotifications,
            push: pushNotifications
        });
        
    } catch (error) {
        console.error('Error al guardar preferencias:', error);
        showNotification('Error al guardar las preferencias', 'error');
    }
}



function cancelSubscription() {
    try {
        if (confirm('¿Estás seguro de que quieres cancelar tu suscripción?\n\nPerderás acceso a todas las funcionalidades premium al final del período actual.')) {
            
            // Simular proceso de cancelación
            showNotification('Procesando cancelación...', 'info');
            
            setTimeout(() => {
                // Marcar suscripción como cancelada
                localStorage.setItem('subscriptionCancelled', 'true');
                localStorage.setItem('cancellationDate', new Date().toISOString());
                
                showNotification('Suscripción cancelada correctamente', 'success');
                
                // Actualizar UI
                updateSubscriptionStatus();
                
                console.log('✅ Suscripción cancelada');
                
            }, 1500);
        }
        
    } catch (error) {
        console.error('Error al cancelar suscripción:', error);
        showNotification('Error al cancelar la suscripción', 'error');
    }
}

// Actualizar estado de suscripción
function updateSubscriptionStatus() {
    try {
        const isCancelled = localStorage.getItem('subscriptionCancelled') === 'true';
        const cancellationDate = localStorage.getItem('cancellationDate');
        
        if (isCancelled && cancellationDate) {
            const cancelDate = new Date(cancellationDate);
            const endDate = new Date(cancelDate);
            endDate.setDate(cancelDate.getDate() + 30); // Acceso hasta final del mes
            
            const today = new Date();
            const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysLeft > 0) {
                showNotification(`Acceso premium hasta el ${endDate.toLocaleDateString('es-ES')}`, 'info');
            } else {
                showNotification('Tu suscripción ha expirado', 'warning');
            }
        }
        
    } catch (error) {
        console.error('Error al actualizar estado de suscripción:', error);
    }
}

// Exportar datos del usuario
function exportUserData() {
    try {
        const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
        const userEmail = localStorage.getItem('userEmail');
        const preferences = {
            emailNotifications: localStorage.getItem('emailNotifications'),
            pushNotifications: localStorage.getItem('pushNotifications')
        };
        
        const dataToExport = {
            perfil: {
                ...testAnswers,
                email: userEmail
            },
            preferencias: preferences,
            fechaExportacion: new Date().toLocaleString('es-ES'),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `astral-chart-${userEmail || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('Datos exportados correctamente', 'success');
        console.log('✅ Datos exportados:', dataToExport);
        
    } catch (error) {
        console.error('Error al exportar datos:', error);
        showNotification('Error al exportar los datos', 'error');
    }
}

// Eliminar cuenta del usuario
function deleteUserAccount() {
    try {
        if (confirm('¿Estás completamente seguro de que quieres eliminar tu cuenta?\n\nEsta acción no se puede deshacer y perderás:\n• Todos tus datos astrológicos\n• Tu historial de predicciones\n• Tu suscripción premium\n• Acceso a todas las funcionalidades')) {
            
            if (confirm('ÚLTIMA CONFIRMACIÓN:\n\n¿Realmente quieres eliminar tu cuenta?\n\nEsta es tu última oportunidad de cancelar.')) {
                
                showNotification('Eliminando cuenta...', 'info');
                
                setTimeout(() => {
                    // Limpiar todos los datos
                    localStorage.clear();
                    
                    showNotification('Cuenta eliminada. Redirigiendo...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                    
                    console.log('🗑️ Cuenta eliminada completamente');
                }, 1500);
            }
        }
        
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        showNotification('Error al eliminar la cuenta', 'error');
    }
}

// Funciones de ayuda
function showHelp() {
    try {
        const helpContent = `
            <div class="help-modal">
                <h3>Centro de Ayuda</h3>
                <div class="help-sections">
                    <div class="help-section">
                        <h4>📊 Dashboard</h4>
                        <p>Tu centro de control astrológico personal. Aquí encontrarás todas tus predicciones, compatibilidad y herramientas.</p>
                    </div>
                    <div class="help-section">
                        <h4>⚙️ Configuración</h4>
                        <p>Gestiona tu perfil, suscripción y preferencias de notificaciones.</p>
                    </div>
                    <div class="help-section">
                        <h4>🔮 Predicciones</h4>
                        <p>Recibe predicciones personalizadas basadas en tu carta astral.</p>
                    </div>
                </div>
                <button class="btn-primary" onclick="closeHelpModal()">Entendido</button>
            </div>
        `;
        
        showModal(helpContent, 'help-modal');
        
    } catch (error) {
        console.error('Error al mostrar ayuda:', error);
        showNotification('Error al mostrar la ayuda', 'error');
    }
}

function showSupport() {
    try {
        const supportContent = `
            <div class="support-modal">
                <h3>Soporte Técnico</h3>
                <div class="support-info">
                    <p><strong>Email:</strong> support@astrokey.com</p>
                    <p><strong>Horario:</strong> 24/7</p>
                    <p><strong>Respuesta:</strong> En menos de 24 horas</p>
                </div>
                <div class="support-actions">
                    <button class="btn-primary" onclick="sendSupportEmail()">Enviar Email</button>
                    <button class="btn-secondary" onclick="closeSupportModal()">Cerrar</button>
                </div>
            </div>
        `;
        
        showModal(supportContent, 'support-modal');
        
    } catch (error) {
        console.error('Error al mostrar soporte:', error);
        showNotification('Error al mostrar el soporte', 'error');
    }
}

function showPrivacy() {
    try {
        const privacyContent = `
            <div class="support-modal">
                <h3>Política de Privacidad</h3>
                <div class="support-info">
                    <p><strong>Recopilación de datos:</strong> Solo recopilamos la información necesaria para tu carta astral.</p>
                    <p><strong>Uso de datos:</strong> Tus datos se utilizan exclusivamente para generar predicciones personalizadas.</p>
                    <p><strong>Seguridad:</strong> Todos los datos están encriptados y protegidos.</p>
                    <p><strong>Compartir:</strong> Nunca compartimos tu información con terceros.</p>
                </div>
                <button class="btn-secondary" onclick="closeSupportModal()">Entendido</button>
            </div>
        `;
        
        showModal(supportContent, 'support-modal');
        
    } catch (error) {
        console.error('Error al mostrar privacidad:', error);
        showNotification('Error al mostrar la política de privacidad', 'error');
    }
}

// Funciones auxiliares para modales
function showModal(content, className) {
    try {
        // Crear modal
        const modal = document.createElement('div');
        modal.className = `modal-overlay ${className}-overlay`;
        modal.innerHTML = content;
        
        // Añadir al DOM
        document.body.appendChild(modal);
        
        // Mostrar con animación
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Cerrar con ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        // Cerrar con clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
                document.removeEventListener('keydown', handleEsc);
            }
        });
        
    } catch (error) {
        console.error('Error al mostrar modal:', error);
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function closeHelpModal() {
    const modal = document.querySelector('.help-modal-overlay');
    closeModal(modal);
}

function closeSupportModal() {
    const modal = document.querySelector('.support-modal-overlay');
    closeModal(modal);
}

function sendSupportEmail() {
            const email = 'support@astrokey.com';
        const subject = 'Soporte AstroKey';
    const body = 'Hola, necesito ayuda con...';
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    showNotification('Email de soporte abierto', 'success');
}

// Función de Logout
function logout() {
    try {
        // Confirmar logout
        if (confirm('¿Estás seguro de que quieres cerrar sesión?\n\nSe cerrará tu sesión actual y volverás a la página principal.')) {
            
            showNotification('Cerrando sesión...', 'info');
            
            setTimeout(() => {
                // Limpiar datos de sesión (mantener datos del test)
                const testAnswers = localStorage.getItem('astralTestAnswers');
                const userEmail = localStorage.getItem('userEmail');
                
                // Limpiar localStorage
                localStorage.clear();
                
                // Restaurar solo los datos del test y email
                if (testAnswers) {
                    localStorage.setItem('astralTestAnswers', testAnswers);
                }
                if (userEmail) {
                    localStorage.setItem('userEmail', userEmail);
                }
                
                        // Marcar como no logueado
        localStorage.setItem('isLoggedIn', 'false');
        
        // Limpiar estado de suscripción
        localStorage.removeItem('subscriptionCancelled');
        localStorage.removeItem('cancellationDate');
        
        showNotification('Sesión cerrada correctamente', 'success');
                
                // Redirigir a la página principal
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
                console.log('🚪 Logout completado');
                
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error al hacer logout:', error);
        showNotification('Error al cerrar sesión', 'error');
        
        // Forzar redirección en caso de error
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Funciones de cálculo astrológico
function calculateSunSign(birthDate) {
    try {
        const date = new Date(birthDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const signs = [
            { name: 'Capricornio', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
            { name: 'Acuario', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
            { name: 'Piscis', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
            { name: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
            { name: 'Tauro', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
            { name: 'Géminis', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
            { name: 'Cáncer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
            { name: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
            { name: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
            { name: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
            { name: 'Escorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
            { name: 'Sagitario', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 }
        ];
        
        for (const sign of signs) {
            if ((month === sign.startMonth && day >= sign.startDay) || 
                (month === sign.endMonth && day <= sign.endDay) ||
                (sign.startMonth > sign.endMonth && (month >= sign.startMonth || month <= sign.endMonth))) {
                return sign;
            }
        }
        
        return { name: 'Capricornio' }; // Default
    } catch (error) {
        console.error('Error al calcular signo solar:', error);
        return { name: 'Aries' };
    }
}

function calculateMoonSign(birthDate) {
    try {
        // Simulación del signo lunar basado en la fecha
        const date = new Date(birthDate);
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        
        const moonSigns = [
            'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
            'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
        ];
        
        // Cálculo más simple y confiable
        const signIndex = dayOfYear % 12;
        const result = { name: moonSigns[signIndex] };
        
        console.log('🌙 Cálculo signo lunar:', { birthDate, dayOfYear, signIndex, result });
        return result;
        
    } catch (error) {
        console.error('Error al calcular signo lunar:', error);
        return { name: 'Cáncer' };
    }
}

function calculateAscendant(birthDate, birthTime) {
    try {
        if (!birthTime) {
            console.log('⚠️ No hay hora de nacimiento, usando ascendente por defecto');
            return { name: 'Libra' };
        }
        
        // Simulación del ascendente basado en hora de nacimiento
        const time = new Date(`2000-01-01T${birthTime}`);
        const hour = time.getHours();
        
        const ascendantSigns = [
            'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
            'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
        ];
        
        // Cálculo más preciso basado en hora
        const signIndex = Math.floor(hour / 2) % 12;
        const result = { name: ascendantSigns[signIndex] };
        
        console.log('⬆️ Cálculo ascendente:', { birthTime, hour, signIndex, result });
        return result;
        
    } catch (error) {
        console.error('Error al calcular ascendente:', error);
        return { name: 'Libra' };
    }
}

function determineDominantElement(testAnswers) {
    try {
        // Simulación del elemento dominante
        const elements = ['Fuego', 'Tierra', 'Aire', 'Agua'];
        const birthDate = new Date(testAnswers.birthDate);
        const dayOfYear = Math.floor((birthDate - new Date(birthDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        
        const elementIndex = Math.floor(dayOfYear / 91) % 4;
        const result = { name: elements[elementIndex] };
        
        console.log('🔥 Cálculo elemento dominante:', { birthDate, dayOfYear, elementIndex, result });
        return result;
        
    } catch (error) {
        console.error('Error al determinar elemento dominante:', error);
        return { name: 'Fuego' };
    }
}

// Función de prueba para verificar el dashboard
function testDashboard() {
    console.log('🧪 Iniciando prueba del dashboard...');
    
    // Forzar recarga de datos
    loadOverviewData();
    
    // Verificar elementos del DOM
    const testElements = ['summarySunSign', 'summaryMoonSign', 'summaryAscendant', 'summaryElement'];
    testElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id}:`, element.textContent);
        } else {
            console.log(`❌ ${id}: No encontrado`);
        }
    });
    
    console.log('🧪 Prueba del dashboard completada');
}

// Configurar event listeners
function setupEventListeners() {
    try {
        // Actualizar countdown cada minuto
        setInterval(updateTrialCountdown, 60000);
        
        // Event listeners para casas astrológicas
        const houses = document.querySelectorAll('.chart-houses .house');
        houses.forEach(house => {
            house.addEventListener('click', function() {
                showHouseInfo(this.dataset.house);
            });
        });
        
        console.log('✅ Event listeners configurados correctamente');
    } catch (error) {
        console.error('Error al configurar event listeners:', error);
    }
}

// Mostrar información de la casa
function showHouseInfo(houseNumber) {
    const houseInfo = {
        1: 'Casa 1 - Ascendente: Personalidad, apariencia física y primera impresión',
        2: 'Casa 2 - Valores: Finanzas, posesiones materiales y autoestima',
        3: 'Casa 3 - Comunicación: Hermanos, vecinos, viajes cortos y aprendizaje',
        4: 'Casa 4 - Hogar: Familia, hogar, raíces y vida privada',
        5: 'Casa 5 - Creatividad: Romance, hijos, placeres y expresión creativa',
        6: 'Casa 6 - Servicio: Trabajo, salud, rutinas diarias y servicio a otros',
        7: 'Casa 7 - Relaciones: Pareja, asociaciones y relaciones íntimas',
        8: 'Casa 8 - Transformación: Muerte, renacimiento, sexo y finanzas compartidas',
        9: 'Casa 9 - Expansión: Educación superior, filosofía, viajes largos y fe',
        10: 'Casa 10 - Carrera: Profesión, ambiciones y estatus social',
        11: 'Casa 11 - Amistades: Amigos, grupos, esperanzas y sueños',
        12: 'Casa 12 - Espiritualidad: Subconsciente, karma, aislamiento y espiritualidad'
    };
    
    const info = houseInfo[houseNumber];
    if (info) {
        showNotification(info, 'info');
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #1f2937;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        max-width: 400px;
        border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
    }, 4000);
}

// Funciones de cálculo astrológico (reutilizadas del results.js)
function calculateSunSign(birthDate) {
    if (!birthDate) return null;
    
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        return { name: 'Aries' };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        return { name: 'Tauro' };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        return { name: 'Géminis' };
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        return { name: 'Cáncer' };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        return { name: 'Leo' };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        return { name: 'Virgo' };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        return { name: 'Libra' };
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        return { name: 'Escorpio' };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        return { name: 'Sagitario' };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return { name: 'Capricornio' };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        return { name: 'Acuario' };
    } else {
        return { name: 'Piscis' };
    }
}

function calculateMoonSign(birthDate) {
    if (!birthDate) return null;
    
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    
    const date = new Date(birthDate);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const signIndex = (dayOfYear + 7) % 12;
    
    return { name: signs[signIndex] };
}

function calculateAscendant(birthDate, birthTime) {
    if (!birthDate) return null;
    
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    
    const date = new Date(birthDate);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const signIndex = dayOfYear % 12;
    
    return { name: signs[signIndex] };
}

function determineDominantElement(testAnswers) {
    if (testAnswers.elementChoice) {
        switch(testAnswers.elementChoice) {
            case 'fuego':
                return { name: 'Fuego' };
            case 'tierra':
                return { name: 'Tierra' };
            case 'aire':
                return { name: 'Aire' };
            case 'agua':
                return { name: 'Agua' };
        }
    }
    
    // Default
    return { name: 'Fuego' };
}
