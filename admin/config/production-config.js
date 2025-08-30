// ===== CONFIGURACIÓN DE PRODUCCIÓN - ASTROKEY =====
// Este archivo debe configurarse con tus datos reales antes de subir a producción

const PRODUCTION_CONFIG = {
    // ===== CONFIGURACIÓN DEL DOMINIO =====
    domain: {
        main: 'https://astrokey.io', // Tu dominio real
        admin: 'https://astrokey.io/admin',
        api: 'https://astrokey.io/api',
        webhook: 'https://astrokey.io/webhooks'
    },

    // ===== CONFIGURACIÓN DE SEGURIDAD =====
    security: {
        // Cambiar estas contraseñas por unas súper seguras
        adminPassword: 'TU_CONTRASEÑA_SUPER_SEGURA_AQUI',
        managerPassword: 'OTRA_CONTRASEÑA_SUPER_SEGURA',
        supportPassword: 'TERCERA_CONTRASEÑA_SUPER_SEGURA',
        
        // Configuración de sesión
        sessionTimeout: 8 * 60 * 60 * 1000, // 8 horas
        rememberMeTimeout: 30 * 24 * 60 * 60 * 1000, // 30 días
        inactivityTimeout: 30 * 60 * 1000, // 30 minutos
        
        // Configuración de seguridad adicional
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutos
        requireHTTPS: true,
        allowedIPs: [] // Dejar vacío para permitir todas las IPs
    },

    // ===== CONFIGURACIÓN DE STRIPE =====
    stripe: {
        publishableKey: 'pk_live_TU_CLAVE_PUBLICA_STRIPE',
        secretKey: 'sk_live_TU_CLAVE_SECRETA_STRIPE',
        webhookSecret: 'whsec_TU_WEBHOOK_SECRET_STRIPE',
        liveMode: true, // Cambiar a true para producción
        currency: 'EUR',
        supportedCountries: ['ES', 'US', 'GB', 'DE', 'FR']
    },

    // ===== CONFIGURACIÓN DE EMAILJS =====
    emailjs: {
        serviceId: 'service_TU_SERVICE_ID_EMAILJS',
        userId: 'user_TU_USER_ID_EMAILJS',
        templateId: 'template_TU_TEMPLATE_ID_EMAILJS',
        apiKey: 'TU_API_KEY_EMAILJS'
    },

    // ===== CONFIGURACIÓN DE GOOGLE OAUTH =====
    google: {
        clientId: 'TU_GOOGLE_CLIENT_ID',
        clientSecret: 'TU_GOOGLE_CLIENT_SECRET',
        redirectUri: 'https://tudominio.com/auth/google/callback',
        allowedDomains: ['tudominio.com'] // Solo usuarios de tu dominio
    },

    // ===== CONFIGURACIÓN DE MAPBOX =====
    mapbox: {
        accessToken: 'TU_ACCESS_TOKEN_MAPBOX',
        style: 'mapbox://styles/mapbox/streets-v11'
    },

    // ===== CONFIGURACIÓN DE BASE DE DATOS =====
    database: {
        // Si usas base de datos (opcional)
        type: 'mysql', // o 'postgresql', 'mongodb'
        host: 'localhost',
        port: 3306,
        name: 'astrokey_db',
        user: 'astrokey_user',
        password: 'TU_PASSWORD_DB'
    },

    // ===== CONFIGURACIÓN DE MONITOREO =====
    monitoring: {
        // Servicios de monitoreo recomendados
        uptime: 'https://uptimerobot.com', // Monitoreo de uptime
        analytics: 'https://analytics.google.com', // Google Analytics
        errors: 'https://sentry.io', // Monitoreo de errores
        performance: 'https://pagespeed.web.dev' // PageSpeed Insights
    },

    // ===== CONFIGURACIÓN DE BACKUP =====
    backup: {
        // Configuración de backup automático
        enabled: true,
        frequency: 'daily', // daily, weekly, monthly
        retention: 30, // días
        storage: 'local', // local, s3, google-cloud
        encrypt: true
    },

    // ===== CONFIGURACIÓN DE LOGS =====
    logging: {
        level: 'info', // error, warn, info, debug
        file: '/var/log/astrokey/admin.log',
        maxSize: '10MB',
        maxFiles: 5
    }
};

// ===== FUNCIONES DE CONFIGURACIÓN =====

// Función para validar configuración
function validateProductionConfig() {
    const errors = [];
    
    // Verificar dominio
    if (PRODUCTION_CONFIG.domain.main === 'https://tudominio.com') {
        errors.push('❌ Debes cambiar la URL del dominio');
    }
    
    // Verificar contraseñas
    if (PRODUCTION_CONFIG.security.adminPassword === 'TU_CONTRASEÑA_SUPER_SEGURA_AQUI') {
        errors.push('❌ Debes cambiar las contraseñas por defecto');
    }
    
    // Verificar Stripe
    if (PRODUCTION_CONFIG.stripe.publishableKey === 'pk_live_TU_CLAVE_PUBLICA_STRIPE') {
        errors.push('❌ Debes configurar las claves de Stripe');
    }
    
    // Verificar EmailJS
    if (PRODUCTION_CONFIG.emailjs.serviceId === 'service_TU_SERVICE_ID_EMAILJS') {
        errors.push('❌ Debes configurar EmailJS');
    }
    
    if (errors.length > 0) {
        console.error('🚨 Errores de configuración encontrados:');
        errors.forEach(error => console.error(error));
        return false;
    }
    
    console.log('✅ Configuración de producción válida');
    return true;
}

// Función para generar archivo .env
function generateEnvFile() {
    const envContent = `# ===== VARIABLES DE ENTORNO ASTROKEY =====

# Dominio
DOMAIN_MAIN=${PRODUCTION_CONFIG.domain.main}
DOMAIN_ADMIN=${PRODUCTION_CONFIG.domain.admin}

# Seguridad
ADMIN_PASSWORD=${PRODUCTION_CONFIG.security.adminPassword}
MANAGER_PASSWORD=${PRODUCTION_CONFIG.security.managerPassword}
SUPPORT_PASSWORD=${PRODUCTION_CONFIG.security.supportPassword}

# Stripe
STRIPE_PUBLISHABLE_KEY=${PRODUCTION_CONFIG.stripe.publishableKey}
STRIPE_SECRET_KEY=${PRODUCTION_CONFIG.stripe.secretKey}
STRIPE_WEBHOOK_SECRET=${PRODUCTION_CONFIG.stripe.webhookSecret}

# EmailJS
EMAILJS_SERVICE_ID=${PRODUCTION_CONFIG.emailjs.serviceId}
EMAILJS_USER_ID=${PRODUCTION_CONFIG.emailjs.userId}
EMAILJS_TEMPLATE_ID=${PRODUCTION_CONFIG.emailjs.templateId}

# Google OAuth
GOOGLE_CLIENT_ID=${PRODUCTION_CONFIG.google.clientId}
GOOGLE_CLIENT_SECRET=${PRODUCTION_CONFIG.google.clientSecret}

# Mapbox
MAPBOX_ACCESS_TOKEN=${PRODUCTION_CONFIG.mapbox.accessToken}

# Base de Datos
DB_HOST=${PRODUCTION_CONFIG.database.host}
DB_PORT=${PRODUCTION_CONFIG.database.port}
DB_NAME=${PRODUCTION_CONFIG.database.name}
DB_USER=${PRODUCTION_CONFIG.database.user}
DB_PASSWORD=${PRODUCTION_CONFIG.database.password}
`;
    
    return envContent;
}

// Función para generar configuración de servidor web
function generateServerConfig() {
    const nginxConfig = `# ===== CONFIGURACIÓN NGINX PARA ASTROKEY =====

server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    
    # Redirigir HTTP a HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;
    
    # Certificado SSL
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Seguridad adicional
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Root del sitio
    root /var/www/tudominio.com;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Página principal
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Panel de administración
    location /admin {
        # Protección adicional para admin
        auth_basic "Área Restringida";
        auth_basic_user_file /etc/nginx/.htpasswd;
        
        try_files \$uri \$uri/ /admin/index.html;
    }
    
    # API (si la tienes)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    # Webhooks
    location /webhooks {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    # Archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Seguridad
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(htaccess|htpasswd)$ {
        deny all;
    }
}`;
    
    return nginxConfig;
}

// Función para generar script de despliegue
function generateDeployScript() {
    const deployScript = `#!/bin/bash
# ===== SCRIPT DE DESPLIEGUE ASTROKEY =====

echo "🚀 Iniciando despliegue de AstroKey..."

# Variables
DOMAIN="tudominio.com"
PROJECT_DIR="/var/www/\$DOMAIN"
BACKUP_DIR="/var/backups/\$DOMAIN"

# Crear directorios si no existen
mkdir -p \$PROJECT_DIR
mkdir -p \$BACKUP_DIR

# Backup del directorio actual
if [ -d "\$PROJECT_DIR" ]; then
    echo "📦 Creando backup..."
    tar -czf "\$BACKUP_DIR/backup_\$(date +%Y%m%d_%H%M%S).tar.gz" -C \$PROJECT_DIR .
fi

# Limpiar directorio
echo "🧹 Limpiando directorio..."
rm -rf \$PROJECT_DIR/*

# Copiar archivos del proyecto
echo "📁 Copiando archivos..."
cp -r . \$PROJECT_DIR/

# Configurar permisos
echo "🔐 Configurando permisos..."
chown -R www-data:www-data \$PROJECT_DIR
chmod -R 755 \$PROJECT_DIR
chmod -R 644 \$PROJECT_DIR/*.html \$PROJECT_DIR/*.css \$PROJECT_DIR/*.js

# Verificar configuración
echo "✅ Verificando configuración..."
if node -e "require('./config/production-config.js'); console.log('Configuración válida')"; then
    echo "✅ Configuración verificada"
else
    echo "❌ Error en la configuración"
    exit 1
fi

# Reiniciar servicios
echo "🔄 Reiniciando servicios..."
systemctl reload nginx
systemctl reload apache2 2>/dev/null || true

# Verificar estado
echo "🔍 Verificando estado..."
if curl -s -o /dev/null -w "%{http_code}" "https://\$DOMAIN" | grep -q "200"; then
    echo "✅ Sitio funcionando correctamente"
else
    echo "❌ Error al verificar el sitio"
    exit 1
fi

echo "🎉 ¡Despliegue completado exitosamente!"
echo "🌐 Tu sitio está disponible en: https://\$DOMAIN"
echo "🔧 Panel de admin en: https://\$DOMAIN/admin"`;
    
    return deployScript;
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PRODUCTION_CONFIG,
        validateProductionConfig,
        generateEnvFile,
        generateServerConfig,
        generateDeployScript
    };
} else {
    window.PRODUCTION_CONFIG = PRODUCTION_CONFIG;
    window.validateProductionConfig = validateProductionConfig;
    window.generateEnvFile = generateEnvFile;
    window.generateServerConfig = generateServerConfig;
    window.generateDeployScript = generateDeployScript;
}

// Auto-validar al cargar
console.log('🔧 Configuración de producción cargada');
validateProductionConfig();
