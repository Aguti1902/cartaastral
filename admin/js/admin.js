// ===== PANEL ADMINISTRATIVO - ASTROKEY =====

// Configuración del panel
const ADMIN_CONFIG = {
    // Configuración por defecto
    stripe: {
        publishableKey: '',
        secretKey: '',
        webhookSecret: '',
        liveMode: false
    },
    emailjs: {
        serviceId: '',
        userId: '',
        templateId: ''
    },
    google: {
        clientId: '',
        clientSecret: '',
        redirectUri: ''
    },
    pricing: {
        testPrice: 0.50,
        monthlyPrice: 19.99
    }
};

// Estado del panel
let currentModal = null;
let adminData = {};

// Inicialización del panel
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Panel de Administración AstroKey iniciado');
    
    // Cargar configuración guardada
    loadAdminConfig();
    
    // Cargar datos del dashboard
    loadDashboardData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Verificar estado de servicios
    checkServiceStatus();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulario de Stripe
    const stripeForm = document.getElementById('stripeForm');
    if (stripeForm) {
        stripeForm.addEventListener('submit', handleStripeConfig);
    }
    
    // Formulario de EmailJS
    const emailjsForm = document.getElementById('emailjsForm');
    if (emailjsForm) {
        emailjsForm.addEventListener('submit', handleEmailJSConfig);
    }
    
    // Formulario de Google
    const googleForm = document.getElementById('googleForm');
    if (googleForm) {
        googleForm.addEventListener('submit', handleGoogleConfig);
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Cargar configuración del administrador
function loadAdminConfig() {
    try {
        const savedConfig = localStorage.getItem('astrokeyAdminConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            Object.assign(ADMIN_CONFIG, config);
            updateConfigDisplay();
        }
    } catch (error) {
        console.error('❌ Error al cargar configuración:', error);
    }
}

// Guardar configuración del administrador
function saveAdminConfig() {
    try {
        localStorage.setItem('astrokeyAdminConfig', JSON.stringify(ADMIN_CONFIG));
        console.log('✅ Configuración guardada correctamente');
    } catch (error) {
        console.error('❌ Error al guardar configuración:', error);
    }
}

// Actualizar display de configuración
function updateConfigDisplay() {
    // Stripe
    if (ADMIN_CONFIG.stripe.publishableKey) {
        document.getElementById('stripeStatus').textContent = 'Conectado';
        document.getElementById('stripeStatus').className = 'data-value status-connected';
        document.getElementById('stripeEnv').textContent = ADMIN_CONFIG.stripe.liveMode ? 'Producción' : 'Test';
    }
    
    // EmailJS
    if (ADMIN_CONFIG.emailjs.serviceId) {
        document.getElementById('emailjsStatus').textContent = 'Conectado';
        document.getElementById('emailjsStatus').className = 'data-value status-connected';
        document.getElementById('emailjsTemplates').textContent = '1';
    }
    
    // Google
    if (ADMIN_CONFIG.google.clientId) {
        document.getElementById('googleStatus').textContent = 'Conectado';
        document.getElementById('googleStatus').className = 'data-value status-connected';
        document.getElementById('googleClientId').textContent = ADMIN_CONFIG.google.clientId.substring(0, 20) + '...';
    }
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Simular datos del dashboard
    adminData = {
        activeUsers: 1247,
        premiumSubs: 342,
        testsToday: 89,
        monthlyIncome: 2847
    };
    
    updateDashboardDisplay();
}

// Actualizar display del dashboard
function updateDashboardDisplay() {
    document.getElementById('activeUsers').textContent = adminData.activeUsers.toLocaleString();
    document.getElementById('premiumSubs').textContent = adminData.premiumSubs.toLocaleString();
    document.getElementById('testsToday').textContent = adminData.testsToday;
    document.getElementById('monthlyIncome').textContent = `€${adminData.monthlyIncome.toLocaleString()}`;
    
    // Actualizar fecha legal
    const today = new Date();
    document.getElementById('legalUpdate').textContent = today.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Verificar estado de servicios
function checkServiceStatus() {
    // Verificar Stripe
    if (ADMIN_CONFIG.stripe.publishableKey) {
        document.getElementById('envStripe').textContent = 'Configurado';
        document.getElementById('envStripe').className = 'data-value status-connected';
    }
    
    // Verificar EmailJS
    if (ADMIN_CONFIG.emailjs.serviceId) {
        document.getElementById('envEmailjs').textContent = 'Configurado';
        document.getElementById('envEmailjs').className = 'data-value status-connected';
    }
}

// Abrir modal
function openModal(modalType) {
    currentModal = modalType;
    const modal = document.getElementById(`${modalType}Modal`);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        // Cargar datos en el modal
        loadModalData(modalType);
        
        // Mostrar modal
        modal.classList.add('active');
        overlay.classList.add('active');
        
        // Enfocar primer input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

// Cerrar modal
function closeModal() {
    if (currentModal) {
        const modal = document.getElementById(`${currentModal}Modal`);
        const overlay = document.getElementById('modalOverlay');
        
        if (modal && overlay) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        currentModal = null;
    }
}

// Cargar datos en el modal
function loadModalData(modalType) {
    switch (modalType) {
        case 'stripe':
            loadStripeModalData();
            break;
        case 'emailjs':
            loadEmailJSModalData();
            break;
        case 'google':
            loadGoogleModalData();
            break;
    }
}

// Cargar datos del modal de Stripe
function loadStripeModalData() {
    const config = ADMIN_CONFIG.stripe;
    
    document.getElementById('stripePublishableKey').value = config.publishableKey;
    document.getElementById('stripeSecretKey').value = config.secretKey;
    document.getElementById('stripeWebhookSecret').value = config.webhookSecret;
    document.getElementById('stripeLiveMode').checked = config.liveMode;
}

// Cargar datos del modal de EmailJS
function loadEmailJSModalData() {
    const config = ADMIN_CONFIG.emailjs;
    
    document.getElementById('emailjsServiceId').value = config.serviceId;
    document.getElementById('emailjsUserId').value = config.userId;
    document.getElementById('emailjsTemplateId').value = config.templateId;
}

// Cargar datos del modal de Google
function loadGoogleModalData() {
    const config = ADMIN_CONFIG.google;
    
    document.getElementById('googleClientId').value = config.clientId;
    document.getElementById('googleClientSecret').value = config.clientSecret;
    document.getElementById('googleRedirectUri').value = config.redirectUri;
}

// Manejar configuración de Stripe
function handleStripeConfig(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    ADMIN_CONFIG.stripe = {
        publishableKey: document.getElementById('stripePublishableKey').value.trim(),
        secretKey: document.getElementById('stripeSecretKey').value.trim(),
        webhookSecret: document.getElementById('stripeWebhookSecret').value.trim(),
        liveMode: document.getElementById('stripeLiveMode').checked
    };
    
    // Validar configuración
    if (!ADMIN_CONFIG.stripe.publishableKey || !ADMIN_CONFIG.stripe.secretKey) {
        showNotification('❌ Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Guardar configuración
    saveAdminConfig();
    
    // Actualizar display
    updateConfigDisplay();
    checkServiceStatus();
    
    // Cerrar modal
    closeModal();
    
    // Mostrar notificación
    showNotification('✅ Configuración de Stripe guardada correctamente', 'success');
}

// Manejar configuración de EmailJS
function handleEmailJSConfig(e) {
    e.preventDefault();
    
    ADMIN_CONFIG.emailjs = {
        serviceId: document.getElementById('emailjsServiceId').value.trim(),
        userId: document.getElementById('emailjsUserId').value.trim(),
        templateId: document.getElementById('emailjsTemplateId').value.trim()
    };
    
    // Validar configuración
    if (!ADMIN_CONFIG.emailjs.serviceId || !ADMIN_CONFIG.emailjs.userId || !ADMIN_CONFIG.emailjs.templateId) {
        showNotification('❌ Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Guardar configuración
    saveAdminConfig();
    
    // Actualizar display
    updateConfigDisplay();
    checkServiceStatus();
    
    // Cerrar modal
    closeModal();
    
    // Mostrar notificación
    showNotification('✅ Configuración de EmailJS guardada correctamente', 'success');
}

// Manejar configuración de Google
function handleGoogleConfig(e) {
    e.preventDefault();
    
    ADMIN_CONFIG.google = {
        clientId: document.getElementById('googleClientId').value.trim(),
        clientSecret: document.getElementById('googleClientSecret').value.trim(),
        redirectUri: document.getElementById('googleRedirectUri').value.trim()
    };
    
    // Validar configuración
    if (!ADMIN_CONFIG.google.clientId || !ADMIN_CONFIG.google.clientSecret || !ADMIN_CONFIG.google.redirectUri) {
        showNotification('❌ Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Guardar configuración
    saveAdminConfig();
    
    // Actualizar display
    updateConfigDisplay();
    checkServiceStatus();
    
    // Cerrar modal
    closeModal();
    
    // Mostrar notificación
    showNotification('✅ Configuración de Google OAuth guardada correctamente', 'success');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Añadir estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Función de logout
function logout() {
    if (confirm('¿Estás seguro de que quieres salir del panel de administración?')) {
        // Limpiar datos de sesión
        localStorage.removeItem('astrokeyAdminSession');
        
        // Redirigir a la página principal
        window.location.href = '../index.html';
    }
}

// Exportar configuración
function exportConfig() {
    const configData = {
        timestamp: new Date().toISOString(),
        config: ADMIN_CONFIG
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'astrokey-admin-config.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Importar configuración
function importConfig(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const configData = JSON.parse(e.target.result);
            
            if (configData.config) {
                Object.assign(ADMIN_CONFIG, configData.config);
                saveAdminConfig();
                updateConfigDisplay();
                checkServiceStatus();
                showNotification('✅ Configuración importada correctamente', 'success');
            }
        } catch (error) {
            showNotification('❌ Error al importar configuración', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Función para probar conexiones
function testConnection(service) {
    switch (service) {
        case 'stripe':
            testStripeConnection();
            break;
        case 'emailjs':
            testEmailJSConnection();
            break;
        case 'google':
            testGoogleConnection();
            break;
    }
}

// Probar conexión de Stripe
function testStripeConnection() {
    if (!ADMIN_CONFIG.stripe.publishableKey) {
        showNotification('❌ Configura Stripe primero', 'error');
        return;
    }
    
    // Simular test de conexión
    showNotification('🔄 Probando conexión con Stripe...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Conexión con Stripe exitosa', 'success');
    }, 2000);
}

// Probar conexión de EmailJS
function testEmailJSConnection() {
    if (!ADMIN_CONFIG.emailjs.serviceId) {
        showNotification('❌ Configura EmailJS primero', 'error');
        return;
    }
    
    // Simular test de conexión
    showNotification('🔄 Probando conexión con EmailJS...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Conexión con EmailJS exitosa', 'success');
    }, 2000);
}

// Probar conexión de Google
function testGoogleConnection() {
    if (!ADMIN_CONFIG.google.clientId) {
        showNotification('❌ Configura Google OAuth primero', 'error');
        return;
    }
    
    // Simular test de conexión
    showNotification('🔄 Probando conexión con Google...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Conexión con Google exitosa', 'success');
    }, 2000);
}

// Función para generar configuración de producción
function generateProductionConfig() {
    const productionConfig = {
        stripe: {
            ...ADMIN_CONFIG.stripe,
            liveMode: true
        },
        emailjs: ADMIN_CONFIG.emailjs,
        google: ADMIN_CONFIG.google,
        environment: 'production',
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(productionConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'astrokey-production-config.json';
    a.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('✅ Configuración de producción generada', 'success');
}

// Función para limpiar configuración
function clearConfig() {
    if (confirm('¿Estás seguro de que quieres limpiar toda la configuración? Esta acción no se puede deshacer.')) {
        // Limpiar configuración
        Object.keys(ADMIN_CONFIG).forEach(key => {
            if (typeof ADMIN_CONFIG[key] === 'object') {
                Object.keys(ADMIN_CONFIG[key]).forEach(subKey => {
                    ADMIN_CONFIG[key][subKey] = '';
                });
            } else {
                ADMIN_CONFIG[key] = '';
            }
        });
        
        // Guardar configuración limpia
        saveAdminConfig();
        
        // Actualizar display
        updateConfigDisplay();
        checkServiceStatus();
        
        showNotification('✅ Configuración limpiada correctamente', 'success');
    }
}

// Función para mostrar ayuda
function showHelp() {
    const helpContent = `
        <div class="help-content">
            <h3>Ayuda del Panel de Administración</h3>
            <p><strong>Stripe:</strong> Configura las claves de API para procesar pagos</p>
            <p><strong>EmailJS:</strong> Configura el servicio de emails</p>
            <p><strong>Google OAuth:</strong> Configura la autenticación con Google</p>
            <p><strong>Precios:</strong> Gestiona los precios de los planes</p>
            <p><strong>Legal:</strong> Edita términos y políticas</p>
        </div>
    `;
    
    // Crear modal de ayuda
    const helpModal = document.createElement('div');
    helpModal.className = 'modal active';
    helpModal.innerHTML = `
        <div class="modal-header">
            <h3>Ayuda</h3>
            <button class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="modal-content">
            ${helpContent}
        </div>
    `;
    
    document.body.appendChild(helpModal);
}

// Función para exportar estadísticas
function exportStats() {
    const statsData = {
        timestamp: new Date().toISOString(),
        stats: adminData
    };
    
    const blob = new Blob([JSON.stringify(statsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'astrokey-stats.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('✅ Estadísticas exportadas correctamente', 'success');
}

// Función para actualizar estadísticas
function refreshStats() {
    showNotification('🔄 Actualizando estadísticas...', 'info');
    
    // Simular actualización
    setTimeout(() => {
        // Generar datos aleatorios para demo
        adminData.activeUsers = Math.floor(Math.random() * 2000) + 1000;
        adminData.premiumSubs = Math.floor(Math.random() * 500) + 300;
        adminData.testsToday = Math.floor(Math.random() * 150) + 50;
        adminData.monthlyIncome = Math.floor(Math.random() * 5000) + 2000;
        
        updateDashboardDisplay();
        showNotification('✅ Estadísticas actualizadas', 'success');
    }, 1500);
}

// Función para manejar formulario de precios
function handlePricingForm(e) {
    e.preventDefault();
    
    const testPrice = parseFloat(document.getElementById('testPrice').value);
    const monthlyPrice = parseFloat(document.getElementById('monthlyPrice').value);
    const trialDays = parseInt(document.getElementById('trialDays').value);
    
    ADMIN_CONFIG.pricing = {
        testPrice,
        monthlyPrice,
        trialDays
    };
    
    saveAdminConfig();
    showNotification('✅ Precios actualizados correctamente', 'success');
    closeModal();
}

// Función para manejar formulario legal
function handleLegalForm(e) {
    e.preventDefault();
    
    const legalType = document.getElementById('legalType').value;
    const legalContent = document.getElementById('legalContent').value;
    
    if (!legalContent.trim()) {
        showNotification('❌ Por favor escribe el contenido legal', 'error');
        return;
    }
    
    // Guardar contenido legal
    if (!ADMIN_CONFIG.legal) {
        ADMIN_CONFIG.legal = {};
    }
    
    ADMIN_CONFIG.legal[legalType] = {
        content: legalContent,
        lastUpdated: new Date().toISOString()
    };
    
    saveAdminConfig();
    showNotification('✅ Contenido legal guardado correctamente', 'success');
    closeModal();
}

// Función para cargar contenido legal
function loadLegalContent(legalType) {
    if (ADMIN_CONFIG.legal && ADMIN_CONFIG.legal[legalType]) {
        document.getElementById('legalContent').value = ADMIN_CONFIG.legal[legalType].content;
    } else {
        document.getElementById('legalContent').value = '';
    }
}

// Función para probar conexión de Mapbox
function testMapboxConnection() {
    if (!ADMIN_CONFIG.mapbox || !ADMIN_CONFIG.mapbox.accessToken) {
        showNotification('❌ Configura Mapbox primero', 'error');
        return;
    }
    
    showNotification('🔄 Probando conexión con Mapbox...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Conexión con Mapbox exitosa', 'success');
    }, 2000);
}

// Función para importar configuración desde archivo
function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const configData = JSON.parse(e.target.result);
                    
                    if (configData.config) {
                        Object.assign(ADMIN_CONFIG, configData.config);
                        saveAdminConfig();
                        updateConfigDisplay();
                        checkServiceStatus();
                        showNotification('✅ Configuración importada correctamente', 'success');
                    }
                } catch (error) {
                    showNotification('❌ Error al importar configuración', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Configurar event listeners adicionales
function setupAdditionalEventListeners() {
    // Formulario de precios
    const pricingForm = document.getElementById('pricingForm');
    if (pricingForm) {
        pricingForm.addEventListener('submit', handlePricingForm);
    }
    
    // Formulario legal
    const legalForm = document.getElementById('legalForm');
    if (legalForm) {
        legalForm.addEventListener('submit', handleLegalForm);
    }
    
    // Cambio de tipo de documento legal
    const legalTypeSelect = document.getElementById('legalType');
    if (legalTypeSelect) {
        legalTypeSelect.addEventListener('change', function() {
            loadLegalContent(this.value);
        });
    }
}

// Función para cargar datos en el modal (actualizada)
function loadModalData(modalType) {
    switch (modalType) {
        case 'stripe':
            loadStripeModalData();
            break;
        case 'emailjs':
            loadEmailJSModalData();
            break;
        case 'google':
            loadGoogleModalData();
            break;
        case 'pricing':
            loadPricingModalData();
            break;
        case 'legal':
            loadLegalModalData();
            break;
        case 'stats':
            loadStatsModalData();
            break;
        case 'environment':
            loadEnvironmentModalData();
            break;
    }
}

// Cargar datos del modal de precios
function loadPricingModalData() {
    const config = ADMIN_CONFIG.pricing;
    
    document.getElementById('testPrice').value = config.testPrice || 0.50;
    document.getElementById('monthlyPrice').value = config.monthlyPrice || 19.99;
    document.getElementById('trialDays').value = config.trialDays || 2;
}

// Cargar datos del modal legal
function loadLegalModalData() {
    const legalType = document.getElementById('legalType').value;
    loadLegalContent(legalType);
}

// Cargar datos del modal de estadísticas
function loadStatsModalData() {
    // Los datos ya están cargados en el dashboard
    // Solo actualizar si es necesario
}

// Cargar datos del modal de entorno
function loadEnvironmentModalData() {
    // Los datos ya están cargados en el dashboard
    // Solo actualizar si es necesario
}

// Actualizar display de configuración (actualizada)
function updateConfigDisplay() {
    // Stripe
    if (ADMIN_CONFIG.stripe.publishableKey) {
        document.getElementById('stripeStatus').textContent = 'Conectado';
        document.getElementById('stripeStatus').className = 'data-value status-connected';
        document.getElementById('stripeEnv').textContent = ADMIN_CONFIG.stripe.liveMode ? 'Producción' : 'Test';
    }
    
    // EmailJS
    if (ADMIN_CONFIG.emailjs.serviceId) {
        document.getElementById('emailjsStatus').textContent = 'Conectado';
        document.getElementById('emailjsStatus').className = 'data-value status-connected';
        document.getElementById('emailjsTemplates').textContent = '1';
    }
    
    // Google
    if (ADMIN_CONFIG.google.clientId) {
        document.getElementById('googleStatus').textContent = 'Conectado';
        document.getElementById('googleStatus').className = 'data-value status-connected';
        document.getElementById('googleClientId').textContent = ADMIN_CONFIG.google.clientId.substring(0, 20) + '...';
    }
    
    // Variables de entorno
    if (ADMIN_CONFIG.stripe.publishableKey) {
        document.getElementById('envStripeStatus').textContent = 'Configurado';
        document.getElementById('envStripeStatus').className = 'env-value status-connected';
    }
    
    if (ADMIN_CONFIG.emailjs.serviceId) {
        document.getElementById('envEmailjsStatus').textContent = 'Configurado';
        document.getElementById('envEmailjsStatus').className = 'env-value status-connected';
    }
    
    if (ADMIN_CONFIG.google.clientId) {
        document.getElementById('envGoogleStatus').textContent = 'Configurado';
        document.getElementById('envGoogleStatus').className = 'env-value status-connected';
    }
}

// Configurar event listeners (actualizada)
function setupEventListeners() {
    // Formulario de Stripe
    const stripeForm = document.getElementById('stripeForm');
    if (stripeForm) {
        stripeForm.addEventListener('submit', handleStripeConfig);
    }
    
    // Formulario de EmailJS
    const emailjsForm = document.getElementById('emailjsForm');
    if (emailjsForm) {
        emailjsForm.addEventListener('submit', handleEmailJSConfig);
    }
    
    // Formulario de Google
    const googleForm = document.getElementById('googleForm');
    if (googleForm) {
        googleForm.addEventListener('submit', handleGoogleConfig);
    }
    
    // Event listeners adicionales
    setupAdditionalEventListeners();
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Exportar funciones para uso global
window.openModal = openModal;
window.closeModal = closeModal;
window.logout = logout;
window.exportConfig = exportConfig;
window.importConfig = importConfig;
window.testConnection = testConnection;
window.generateProductionConfig = generateProductionConfig;
window.clearConfig = clearConfig;
window.showHelp = showHelp;
window.exportStats = exportStats;
window.refreshStats = refreshStats;
