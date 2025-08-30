// ===== TEST SCRIPT - ASTROKEY =====

// Variables globales del test
let currentStep = 1;
const totalSteps = 14; // Pasos reales del test
let testAnswers = {};
let selectedOptions = {};

// Configuración de Mapbox
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWd1dGkxOTAyIiwiYSI6ImNtZXV2YjEzNjBiNXoyaXM0cjhxYXE4NDQifQ.MuOAP6Uk69hrzJ1bZHz-6g';
let geocoder = null;

// Configuración de páginas de relleno
const fillerPages = [
    { step: 3, title: "¡Genial!", description: "La posición del Sol, la Luna y los planetas en el día en que nacimos y en el momento en que respiramos por primera vez determina nuestra carta natal.", image: "images/Fortune Telling with Crystal Balls and Books.png", alt: "Bola de cristal y libros de adivinación" },
    { step: 6, title: "Cosas que se prometen", description: "Comprende lo que te han prometido, los temas en los que debes profundizar, tus tendencias y la actitud que debes tener.", image: "images/Illustration of Fortune Telling Session.png", alt: "Sesión de adivinación" },
    { step: 9, title: "La carta natal no es una adivinación", description: "Es una ayuda para interpretar científicamente la astrología. Sólo puede ser creada e interpretada por personas experimentadas y certificadas.", image: "images/Illustration of Tarot Reader with Cards.png", alt: "Lector de tarot con cartas" },
    { step: 12, title: "Descubre tu potencial", description: "Cada respuesta nos acerca más a revelar tu verdadero potencial astrológico y las oportunidades que el universo tiene preparadas para ti.", image: "images/Illustration of Fortune Telling Session.png", alt: "Bruja practicando magia" }
];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Test Astral Completo iniciado');
    
    initializeTest();
    setupEventListeners();
    populateSelectOptions();
    showStep(1);
    
    // Debug: Mostrar estado inicial
    console.log('📊 Estado inicial:', testAnswers);
    
    // Debug: Simular datos de prueba para el paso 4
    setTimeout(() => {
        console.log('🧪 Simulando datos de prueba...');
        testAnswers.birthTime.hour = '14';
        testAnswers.birthTime.minute = '30';
        console.log('📊 Estado después de simulación:', testAnswers);
    }, 2000);
    

});

// Inicializar el test
function initializeTest() {
    // Configurar respuestas por defecto
    testAnswers = {
        gender: '',
        birthDate: {
            day: '',
            month: '',
            year: ''
        },
        birthTime: {
            hour: '',
            minute: ''
        },
        birthPlace: '',
        birthPlaceCoordinates: null,
        birthPlaceType: '',
        birthPlacePostcode: '',
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
}

// Configurar event listeners
function setupEventListeners() {
    // Configurar selección de opciones
    setupOptionSelection();
    
    // Configurar inputs de texto
    setupTextInputs();
    
    // Configurar enlaces especiales
    setupSpecialLinks();
    
    // Configurar búsqueda de ubicación
    setupLocationSearch();
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
            // Guardar el valor en tiempo real
            const step = this.closest('.test-step').dataset.step;
            const fieldName = this.name;
            const value = this.value;
            
            if (step === '2') {
                // Nombre y apellidos
                if (fieldName === 'firstName') testAnswers.firstName = value;
                if (fieldName === 'lastName') testAnswers.lastName = value;
            }
        });
    });
    
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const step = this.closest('.test-step').dataset.step;
            const fieldName = this.name;
            const value = this.value;
            
            if (step === '3') {
                // Fecha de nacimiento
                if (fieldName === 'birthDay') testAnswers.birthDate.day = value;
                if (fieldName === 'birthMonth') testAnswers.birthDate.month = value;
                if (fieldName === 'birthYear') testAnswers.birthDate.year = value;
            } else if (step === '4') {
                // Hora de nacimiento
                if (fieldName === 'birthHour') testAnswers.birthTime.hour = value;
                if (fieldName === 'birthMinute') testAnswers.birthTime.minute = value;
            } else if (step === '5') {
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

// Configurar búsqueda de ubicación con Mapbox
function setupLocationSearch() {
    const locationInput = document.getElementById('birthPlace');
    const searchResults = document.getElementById('searchResults');
    
    if (locationInput && searchResults) {
        // Inicializar Mapbox
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        
        locationInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            // Usar Mapbox para búsqueda de ciudades
            searchCitiesWithMapbox(query, searchResults);
        });
        
        // Ocultar resultados al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!locationInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Buscar ciudades con Mapbox
async function searchCitiesWithMapbox(query, container) {
    console.log('🔍 Buscando con Mapbox:', query);
    
    try {
        // Primera búsqueda: lugares y códigos postales
        const response1 = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place,postcode&language=es&limit=10`
        );
        
        // Segunda búsqueda: solo códigos postales si la consulta parece un código postal
        let response2 = null;
        if (/^\d{4,5}$/.test(query)) { // Si es un código postal de 4-5 dígitos
            response2 = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=postcode&language=es&limit=5&country=es`
            );
        }
        
        // Tercera búsqueda: códigos postales específicos para España
        let response3 = null;
        if (query.length >= 3) {
            response3 = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query + ' España')}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=postcode&language=es&limit=3&country=es`
            );
        }
        
        if (!response1.ok) {
            throw new Error('Error en la primera búsqueda');
        }
        
        const data1 = await response1.json();
        let data2 = { features: [] };
        let data3 = { features: [] };
        
        if (response2 && response2.ok) {
            data2 = await response2.json();
        }
        
        if (response3 && response3.ok) {
            data3 = await response3.json();
        }
        
        console.log('📡 Respuesta 1 (lugares):', data1);
        console.log('📡 Respuesta 2 (códigos postales):', data2);
        console.log('📡 Respuesta 3 (códigos postales España):', data3);
        
        // Combinar y procesar resultados
        const allFeatures = [...data1.features, ...data2.features, ...data3.features];
        const cities = allFeatures.map(feature => {
            let displayName = feature.place_name_es || feature.place_name;
            
            // Si es un código postal, formatear mejor
            if (feature.place_type && feature.place_type.includes('postcode')) {
                const context = feature.context || [];
                const city = context.find(c => c.id && c.id.startsWith('place.'))?.text || '';
                const country = context.find(c => c.id && c.id.startsWith('country.'))?.text || '';
                displayName = `${feature.text} - ${city}, ${country}`;
            }
            
            return {
                name: displayName,
                coordinates: feature.center,
                type: feature.place_type ? feature.place_type[0] : 'place',
                postcode: feature.place_type && feature.place_type.includes('postcode') ? feature.text : null
            };
        });
        
        // Eliminar duplicados y limitar a 15 resultados
        const uniqueCities = cities.filter((city, index, self) => 
            index === self.findIndex(c => c.name === city.name)
        ).slice(0, 15);
        
        console.log('🏙️ Ciudades procesadas:', uniqueCities);
        displaySearchResults(uniqueCities, container);
    } catch (error) {
        console.error('❌ Error buscando ciudades:', error);
        // Fallback a búsqueda local si hay error
        const fallbackCities = searchCitiesFallback(query);
        displaySearchResults(fallbackCities, container);
    }
}

// Búsqueda de respaldo (fallback)
function searchCitiesFallback(query) {
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
    ).slice(0, 10).map(city => ({ 
        name: city, 
        coordinates: null, 
        type: 'place',
        postcode: null 
    }));
}

// Mostrar resultados de búsqueda
function displaySearchResults(cities, container) {
    console.log('📋 Mostrando resultados:', cities);
    console.log('📦 Container:', container);
    
    if (cities.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    const html = cities.map(city => 
        `<div class="search-result-item" data-type="${city.type}" onclick="selectCity('${city.name}', ${city.coordinates ? JSON.stringify(city.coordinates) : 'null'}, '${city.type}', ${city.postcode ? `'${city.postcode}'` : 'null'})">${city.name}</div>`
    ).join('');
    
    console.log('🔄 HTML generado:', html);
    container.innerHTML = html;
    container.style.display = 'block';
}

// Seleccionar ciudad
function selectCity(city, coordinates, type, postcode) {
    const locationInput = document.getElementById('birthPlace');
    const searchResults = document.getElementById('searchResults');
    
    if (locationInput) {
        locationInput.value = city;
        testAnswers.birthPlace = city;
        // Guardar coordenadas si están disponibles
        if (coordinates) {
            testAnswers.birthPlaceCoordinates = coordinates;
        }
        // Guardar tipo y código postal
        testAnswers.birthPlaceType = type;
        testAnswers.birthPlacePostcode = postcode;
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
    console.log(`👁️ Mostrando paso ${stepNumber}`);
    
    // Ocultar todos los pasos
    const allSteps = document.querySelectorAll('.test-step');
    allSteps.forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });
    
    // Verificar si es una página de relleno
    const fillerPage = fillerPages.find(page => page.step === stepNumber);
    
    if (fillerPage) {
        console.log(`📖 Es una página de relleno:`, fillerPage);
        // Mostrar página de relleno como modal
        showFillerPage(fillerPage);
        // Mostrar el paso anterior para que el usuario pueda ver el test
        const previousStep = stepNumber - 1;
        if (previousStep > 0) {
            const previousStepElement = document.getElementById(`step${previousStep}`);
            if (previousStepElement) {
                previousStepElement.style.display = 'block';
                previousStepElement.classList.add('active');
            }
        }
    } else {
        console.log(`📝 Es un paso normal del test`);
        // Mostrar el paso normal del test
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
            currentStepElement.classList.add('active');
            console.log(`✅ Paso ${stepNumber} mostrado correctamente`);
        } else {
            console.log(`❌ No se encontró el elemento para el paso ${stepNumber}`);
        }
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
    console.log(`🚀 Intentando avanzar desde paso ${currentStep}`);
    
    if (currentStep < totalSteps) {
        // Verificar si el paso actual debe mostrar una página de relleno
        const fillerPage = fillerPages.find(page => page.step === currentStep);
        
        if (fillerPage) {
            console.log(`📖 Mostrando página de relleno para paso ${currentStep}`);
            // Mostrar página de relleno sin incrementar el paso
            showFillerPage(fillerPage);
        } else if (validateCurrentStep()) {
            console.log(`✅ Validación exitosa, avanzando al paso ${currentStep + 1}`);
            // Avanzar al siguiente paso real del test
            currentStep++;
            showStep(currentStep);
            
            // Scroll al top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.log(`❌ Validación fallida en paso ${currentStep}`);
        }
    } else {
        console.log(`🏁 Ya estás en el último paso (${currentStep})`);
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

// Mostrar página de relleno
function showFillerPage(fillerPage) {
    // Crear modal de página de relleno
    const modal = document.createElement('div');
    modal.className = 'filler-modal';
    modal.innerHTML = generateFillerPageHTML(fillerPage);
    
    // Añadir al body
    document.body.appendChild(modal);
    
    // Mostrar modal
    setTimeout(() => modal.classList.add('active'), 10);
}

// Generar HTML de página de relleno
function generateFillerPageHTML(fillerPage) {
    return `
        <div class="filler-modal-content">
            <button class="filler-close-btn" onclick="closeFillerModal()">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="filler-illustration">
                <img src="${fillerPage.image}" alt="${fillerPage.alt}" class="filler-image">
            </div>
            
            <h2 class="filler-title">${fillerPage.title}</h2>
            
            <p class="filler-description">${fillerPage.description}</p>
            
            <div class="filler-button-container">
                <button class="filler-btn" onclick="closeFillerModalAndContinue()">
                    <span>Continuar</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
}

// Generar HTML de ilustración según el tipo
function generateIllustrationHTML(type) {
    switch(type) {
        case 'meditation':
            return `
                <div class="person-figure">
                    <div class="head"></div>
                    <div class="body"></div>
                </div>
                <div class="celestial-elements">
                    <div class="sun"></div>
                    <div class="moon"></div>
                    <div class="stars"></div>
                </div>
            `;
        case 'astrology':
            return `
                <div class="astrology-circle">
                    <div class="orbit-dots"></div>
                    <div class="central-sun"></div>
                    <div class="planets"></div>
                </div>
            `;
        case 'potential':
            return `
                <div class="potential-stars">
                    <div class="star-group-1"></div>
                    <div class="star-group-2"></div>
                    <div class="star-group-3"></div>
                </div>
            `;
        case 'path':
            return `
                <div class="astral-path">
                    <div class="path-line"></div>
                    <div class="path-stars"></div>
                    <div class="path-destination"></div>
                </div>
            `;
        default:
            return `
                <div class="head"></div>
                <div class="body"></div>
            `;
    }
}

// Cerrar modal de página de relleno
function closeFillerModal() {
    const modal = document.querySelector('.filler-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Cerrar modal y continuar al siguiente paso
function closeFillerModalAndContinue() {
    closeFillerModal();
    setTimeout(() => {
        // Avanzar al siguiente paso real del test
        currentStep++;
        showStep(currentStep);
        
        // Scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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
    
    console.log(`🔍 Validando paso ${currentStep}:`, testAnswers);
    
    switch (currentStep) {
        case 1: // Sexo
            if (!testAnswers.gender) {
                showNotification('Por favor selecciona tu sexo', 'error');
                return false;
            }
            break;
            
        case 2: // Nombre y apellidos
            console.log('📝 Validando nombre y apellidos:', {
                firstName: testAnswers.firstName,
                lastName: testAnswers.lastName
            });
            if (!testAnswers.firstName || !testAnswers.lastName) {
                showNotification('Por favor completa tu nombre y apellidos', 'error');
                return false;
            }
            break;
            
        case 3: // Fecha de nacimiento
            if (!testAnswers.birthDate.day || !testAnswers.birthDate.month || !testAnswers.birthDate.year) {
                showNotification('Por favor completa tu fecha de nacimiento', 'error');
                return false;
            }
            break;
            
        case 4: // Hora de nacimiento
            console.log('🕐 Validando hora de nacimiento:', {
                hour: testAnswers.birthTime.hour,
                minute: testAnswers.birthTime.minute
            });
            if (!testAnswers.birthTime.hour || !testAnswers.birthTime.minute) {
                showNotification('Por favor completa tu hora de nacimiento', 'error');
                return false;
            }
            break;
            
        case 5: // Lugar de nacimiento
            if (!testAnswers.birthPlace) {
                showFieldError(document.getElementById('birthPlace'), 'Este campo es requerido');
                return false;
            }
            break;
            
        case 6: // Situación sentimental
            if (!testAnswers.relationshipStatus) {
                showNotification('Por favor selecciona tu situación sentimental', 'error');
                return false;
            }
            break;
            
        case 7: // Carta natal previa
            console.log('📋 Validando carta natal previa:', {
                hasNatalChart: testAnswers.hasNatalChart
            });
            if (!testAnswers.hasNatalChart) {
                showNotification('Por favor responde si te has hecho una carta natal', 'error');
                return false;
            }
            break;
            
        case 8: // Temas de pensamiento
            if (!testAnswers.currentThoughts) {
                showNotification('Por favor selecciona en qué temas has pensado', 'error');
                return false;
            }
            break;
            
        case 9: // Elementos
            if (!testAnswers.element) {
                showNotification('Por favor selecciona tu elemento dominante', 'error');
                return false;
            }
            break;
            
        case 10: // Rasgos de personalidad
            if (testAnswers.personalityTraits.length === 0) {
                showNotification('Por favor selecciona al menos un rasgo de personalidad', 'error');
                return false;
            }
            break;
            
        case 11: // Compatibilidad con signos
            if (testAnswers.compatibleSigns.length === 0) {
                showNotification('Por favor selecciona al menos un signo compatible', 'error');
                return false;
            }
            break;
            
        case 12: // Dificultades en la vida
            if (!testAnswers.lifeDifficulties) {
                showNotification('Por favor selecciona qué te ha costado más en la vida', 'error');
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
    console.log(`💾 Guardando respuesta para paso ${step}:`, value);
    
    switch (step) {
        case '1':
            testAnswers.gender = value;
            break;
        case '2':
            testAnswers.fullName = value;
            break;
        case '3':
            // Fecha de nacimiento se maneja en setupTextInputs
            break;
        case '4':
            // Hora de nacimiento se maneja en setupTextInputs
            break;
        case '5':
            testAnswers.birthPlace = value;
            break;
        case '6':
            testAnswers.relationshipStatus = value;
            break;
        case '7':
            testAnswers.hasNatalChart = value;
            break;
        case '8':
            testAnswers.currentThoughts = value;
            break;
        case '9':
            testAnswers.element = value;
            break;
        case '10':
            // Rasgos de personalidad se maneja en setupOptionSelection
            break;
        case '11':
            // Compatibilidad con signos se maneja en setupOptionSelection
            break;
        case '12':
            testAnswers.lifeDifficulties = value;
            break;
        case '13':
            testAnswers.lifeGoals = value;
            break;
        case '14':
            testAnswers.astrologicalPreferences = value;
            break;

    }
    
    console.log('📊 Estado actualizado:', testAnswers);
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
            
            // Redirigir a la página de email
            redirectToEmailPage();
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

// Redirigir a la página de email
function redirectToEmailPage() {
    // Guardar respuestas en localStorage
    localStorage.setItem('astralTestAnswers', JSON.stringify(testAnswers));
    
    // Mostrar notificación de éxito
    showNotification('¡Test completado exitosamente! Redirigiendo a la página de email...', 'success');
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
        window.location.href = 'email-request.html';
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
    if (fieldName === 'firstName') testAnswers.firstName = value;
    if (fieldName === 'lastName') testAnswers.lastName = value;
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
