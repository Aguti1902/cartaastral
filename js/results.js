// ===== RESULTS SCRIPT - ASTROKEY =====

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Página de Resultados AstroKey iniciada');
    
    initializeResults();
    loadUserData();
    generateAstralResults();
});

// Inicializar la página de resultados
function initializeResults() {
    // Verificar si el usuario completó el test y el pago
    const testAnswers = localStorage.getItem('astralTestAnswers');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!testAnswers || !userEmail) {
        // Si no hay datos, redirigir al test
        window.location.href = 'test.html';
        return;
    }
    
    console.log('✅ Usuario autorizado, mostrando resultados');
}

// Cargar datos del usuario
function loadUserData() {
    const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
    
    // Mostrar información del usuario
    // Construir nombre completo desde firstName y lastName
    let fullName = 'Usuario';
    if (testAnswers.firstName && testAnswers.lastName) {
        fullName = `${testAnswers.firstName} ${testAnswers.lastName}`;
    } else if (testAnswers.firstName) {
        fullName = testAnswers.firstName;
    } else if (testAnswers.lastName) {
        fullName = testAnswers.lastName;
    }
    
    document.getElementById('userName').textContent = fullName;
    
    // Mostrar fecha de nacimiento
    let birthDateFormatted = 'Fecha no disponible';
    if (testAnswers.birthDate && testAnswers.birthDate.day && testAnswers.birthDate.month && testAnswers.birthDate.year) {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const monthName = months[parseInt(testAnswers.birthDate.month) - 1];
        birthDateFormatted = `${testAnswers.birthDate.day} de ${monthName} de ${testAnswers.birthDate.year}`;
    }
    document.getElementById('userBirthInfo').textContent = birthDateFormatted;
    
    // Mostrar lugar de nacimiento
    const birthPlace = testAnswers.birthPlace || 'Lugar no disponible';
    document.getElementById('userBirthPlace').textContent = birthPlace;
    
    // Mostrar email desde el test (finalEmail)
    const finalEmail = testAnswers.finalEmail;
    if (finalEmail) {
        document.getElementById('userEmail').textContent = finalEmail;
    } else {
        document.getElementById('userEmail').textContent = 'Email no disponible';
    }
    
    console.log('📊 Información del usuario cargada:', {
        fullName,
        birthDate: testAnswers.birthDate,
        birthPlace: testAnswers.birthPlace,
        finalEmail: testAnswers.finalEmail
    });
}

// Generar resultados astrológicos basados en las respuestas
function generateAstralResults() {
    const testAnswers = JSON.parse(localStorage.getItem('astralTestAnswers') || '{}');
    
    // Determinar signo solar basado en la fecha de nacimiento
    const sunSign = calculateSunSign(testAnswers.birthDate);
    if (sunSign) {
        document.getElementById('sunSign').innerHTML = `
            <img src="images/${sunSign.image}" alt="${sunSign.name}" class="sign-image">
            <span class="sign-name">${sunSign.name}</span>
        `;
    }
    
    // Determinar elemento dominante basado en las respuestas del test
    const dominantElement = determineDominantElement(testAnswers);
    if (dominantElement) {
        document.getElementById('dominantElement').innerHTML = `
            <i class="fas fa-fire sign-image" style="color: #f97316; font-size: 3rem;"></i>
            <span class="element-name">${dominantElement.name}</span>
        `;
    }
    
    // Calcular ascendente (simulado)
    const ascendant = calculateAscendant(testAnswers.birthDate, testAnswers.birthTime);
    if (ascendant) {
        document.getElementById('ascendant').innerHTML = `
            <img src="images/${ascendant.image}" alt="${ascendant.name}" class="sign-image">
            <span class="sign-name">${ascendant.name}</span>
        `;
    }
    
    // Calcular signo lunar (simulado)
    const moonSign = calculateMoonSign(testAnswers.birthDate);
    if (moonSign) {
        document.getElementById('moonSign').innerHTML = `
            <img src="images/${moonSign.image}" alt="${moonSign.name}" class="sign-image">
            <span class="sign-name">${moonSign.name}</span>
        `;
    }
    
    // Generar casa astrológica
    const astralHouse = calculateAstralHouse(testAnswers.birthDate);
    if (astralHouse) {
        document.getElementById('astralHouse').innerHTML = `
            <i class="fas fa-home sign-image" style="color: #6366f1; font-size: 3rem;"></i>
            <span class="house-name">Casa ${astralHouse.number}</span>
        `;
    }
    
    // Generar planeta dominante
    const dominantPlanet = calculateDominantPlanet(testAnswers.birthDate);
    if (dominantPlanet) {
        document.getElementById('dominantPlanet').innerHTML = `
            <i class="fas fa-globe sign-image" style="color: #dc2626; font-size: 3rem;"></i>
            <span class="planet-name">${dominantPlanet.name}</span>
        `;
    }
    
    // Generar aspectos planetarios
    const planetaryAspects = calculatePlanetaryAspects(testAnswers.birthDate);
    if (planetaryAspects) {
        document.getElementById('planetaryAspects').innerHTML = `
            <i class="fas fa-star sign-image" style="color: #fbbf24; font-size: 3rem;"></i>
            <span class="aspects-name">${planetaryAspects.name}</span>
        `;
    }
    
    // Generar nodos lunares
    const lunarNodes = calculateLunarNodes(testAnswers.birthDate);
    if (lunarNodes) {
        document.getElementById('lunarNodes').innerHTML = `
            <i class="fas fa-moon sign-image" style="color: #7c3aed; font-size: 3rem;"></i>
            <span class="planet-name">${lunarNodes.name}</span>
        `;
    }
}

// Calcular signo solar basado en la fecha de nacimiento
function calculateSunSign(birthDate) {
    if (!birthDate) return null;
    
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Lógica simplificada para determinar signo solar
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        return { image: 'aries.svg', name: 'Aries' };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        return { image: 'taurus.svg', name: 'Tauro' };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        return { image: 'gemini.svg', name: 'Géminis' };
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        return { image: 'cancer.svg', name: 'Cáncer' };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        return { image: 'leo.svg', name: 'Leo' };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        return { image: 'virgo.svg', name: 'Virgo' };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        return { image: 'libra.svg', name: 'Libra' };
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        return { image: 'scorpio.svg', name: 'Escorpio' };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        return { image: 'sagittarius.svg', name: 'Sagitario' };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return { image: 'capricorn.svg', name: 'Capricornio' };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        return { image: 'aquarius.svg', name: 'Acuario' };
    } else {
        return { image: 'pisces.svg', name: 'Piscis' };
    }
}

// Determinar elemento dominante basado en las respuestas
function determineDominantElement(testAnswers) {
    // Contar respuestas de cada elemento
    let fireCount = 0;
    let earthCount = 0;
    let airCount = 0;
    let waterCount = 0;
    
    // Analizar respuestas del test (simplificado)
    if (testAnswers.elementChoice) {
        switch(testAnswers.elementChoice) {
            case 'fuego':
                fireCount += 3;
                break;
            case 'tierra':
                earthCount += 3;
                break;
            case 'aire':
                airCount += 3;
                break;
            case 'agua':
                waterCount += 3;
                break;
        }
    }
    
    // Determinar elemento dominante
    const maxCount = Math.max(fireCount, earthCount, airCount, waterCount);
    
    if (fireCount === maxCount) {
        return { image: 'Fortune Telling with Crystal Balls and Books.png', name: 'Fuego' };
    } else if (earthCount === maxCount) {
        return { image: 'Fortune Telling with Crystal Balls and Books.png', name: 'Tierra' };
    } else if (airCount === maxCount) {
        return { image: 'Fortune Telling with Crystal Balls and Books.png', name: 'Aire' };
    } else {
        return { image: 'Fortune Telling with Crystal Balls and Books.png', name: 'Agua' };
    }
}

// Calcular ascendente (simulado)
function calculateAscendant(birthDate, birthTime) {
    // Lógica simplificada para el ascendente
    const signs = [
        { image: 'aries.svg', name: 'Aries' },
        { image: 'taurus.svg', name: 'Tauro' },
        { image: 'gemini.svg', name: 'Géminis' },
        { image: 'cancer.svg', name: 'Cáncer' },
        { image: 'leo.svg', name: 'Leo' },
        { image: 'virgo.svg', name: 'Virgo' },
        { image: 'libra.svg', name: 'Libra' },
        { image: 'scorpio.svg', name: 'Escorpio' },
        { image: 'sagittarius.svg', name: 'Sagitario' },
        { image: 'capricorn.svg', name: 'Capricornio' },
        { image: 'aquarius.svg', name: 'Acuario' },
        { image: 'pisces.svg', name: 'Piscis' }
    ];
    
    // Seleccionar ascendente basado en la fecha (simulado)
    const date = new Date(birthDate);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const signIndex = dayOfYear % 12;
    
    return signs[signIndex];
}

// Calcular signo lunar (simulado)
function calculateMoonSign(birthDate) {
    // Lógica simplificada para el signo lunar
    const signs = [
        { image: 'aries.svg', name: 'Aries' },
        { image: 'taurus.svg', name: 'Tauro' },
        { image: 'gemini.svg', name: 'Géminis' },
        { image: 'cancer.svg', name: 'Cáncer' },
        { image: 'leo.svg', name: 'Leo' },
        { image: 'virgo.svg', name: 'Virgo' },
        { image: 'libra.svg', name: 'Libra' },
        { image: 'scorpio.svg', name: 'Escorpio' },
        { image: 'sagittarius.svg', name: 'Sagitario' },
        { image: 'capricorn.svg', name: 'Capricornio' },
        { image: 'aquarius.svg', name: 'Acuario' },
        { image: 'pisces.svg', name: 'Piscis' }
    ];
    
    // Seleccionar signo lunar basado en la fecha (simulado)
    const date = new Date(birthDate);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const signIndex = (dayOfYear + 7) % 12; // Offset para diferenciar del solar
    
    return signs[signIndex];
}

// Calcular casa astrológica
function calculateAstralHouse(birthDate) {
    if (!birthDate) return null;
    
    const date = new Date(birthDate);
    const hour = date.getHours();
    
    // Lógica simplificada para determinar casa astrológica
    if (hour >= 6 && hour < 12) {
        return { number: 1, name: 'Casa 1 - Ascendente' };
    } else if (hour >= 12 && hour < 18) {
        return { number: 4, name: 'Casa 4 - Fondo del Cielo' };
    } else if (hour >= 18 && hour < 24) {
        return { number: 7, name: 'Casa 7 - Descendente' };
    } else {
        return { number: 10, name: 'Casa 10 - Medio Cielo' };
    }
}

// Calcular planeta dominante
function calculateDominantPlanet(birthDate) {
    if (!birthDate) return null;
    
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    
    // Lógica simplificada para determinar planeta dominante
    const planets = [
        { name: 'Marte', month: 3 },
        { name: 'Venus', month: 4 },
        { name: 'Mercurio', month: 5 },
        { name: 'Luna', month: 6 },
        { name: 'Sol', month: 7 },
        { name: 'Mercurio', month: 8 },
        { name: 'Venus', month: 9 },
        { name: 'Plutón', month: 10 },
        { name: 'Júpiter', month: 11 },
        { name: 'Saturno', month: 12 },
        { name: 'Urano', month: 1 },
        { name: 'Neptuno', month: 2 }
    ];
    
    return planets[month - 1] || planets[0];
}

// Calcular aspectos planetarios
function calculatePlanetaryAspects(birthDate) {
    if (!birthDate) return null;
    
    const date = new Date(birthDate);
    const day = date.getDate();
    
    // Lógica simplificada para determinar aspectos
    const aspects = [
        { name: 'Conjunción', angle: 0 },
        { name: 'Sextil', angle: 60 },
        { name: 'Cuadratura', angle: 90 },
        { name: 'Trígono', angle: 120 },
        { name: 'Oposición', angle: 180 }
    ];
    
    const aspectIndex = day % aspects.length;
    return aspects[aspectIndex];
}

// Calcular nodos lunares
function calculateLunarNodes(birthDate) {
    if (!birthDate) return null;
    
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    
    // Lógica simplificada para determinar nodos lunares
    if (month <= 6) {
        return { name: 'Nodo Norte en Cáncer', description: 'Evolución emocional' };
    } else {
        return { name: 'Nodo Norte en Capricornio', description: 'Evolución material' };
    }
}

// Acceder al dashboard
function accessDashboard() {
    // Simular acceso al dashboard
    showNotification('Redirigiendo a tu dashboard personal...', 'success');
    
    // En una implementación real, aquí redirigirías al dashboard
    setTimeout(() => {
        // Por ahora, mostrar mensaje de que el dashboard está en desarrollo
        showNotification('Dashboard en desarrollo. Pronto tendrás acceso completo.', 'info');
    }, 2000);
}

// Mostrar ayuda
function showHelp() {
    showNotification('Para obtener ayuda, contacta con nuestro equipo de soporte', 'info');
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
    }, 3000);
}
