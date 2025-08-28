/**
 * Componente Header para AstralCoach Pro
 * @author AstralCoach Pro Team
 * @version 1.0.0
 */

class Header {
    constructor() {
        this.header = null;
        this.nav = null;
        this.navToggle = null;
        this.navMenu = null;
        this.isScrolled = false;
        this.init();
    }

    init() {
        this.createHeader();
        this.setupEventListeners();
        this.setupScrollEffects();
    }

    createHeader() {
        this.header = document.createElement('header');
        this.header.className = 'header';
        
        this.header.innerHTML = `
            <nav class="nav">
                <div class="nav-logo">
                    <i class="fas fa-star"></i>
                    <span>AstralCoach Pro</span>
                </div>
                <ul class="nav-menu">
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#precios">Precios</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                </ul>
                <div class="nav-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        `;

        this.nav = this.header.querySelector('.nav');
        this.navToggle = this.header.querySelector('.nav-toggle');
        this.navMenu = this.header.querySelector('.nav-menu');

        // Insertar al inicio del body
        document.body.insertBefore(this.header, document.body.firstChild);
    }

    setupEventListeners() {
        // Toggle del menú móvil
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Cerrar menú al hacer clic en enlaces
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100 && !this.isScrolled) {
            this.header.classList.add('scrolled');
            this.isScrolled = true;
        } else if (scrollY <= 100 && this.isScrolled) {
            this.header.classList.remove('scrolled');
            this.isScrolled = false;
        }
    }

    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Métodos públicos
    show() {
        this.header.style.display = 'block';
    }

    hide() {
        this.header.style.display = 'none';
    }

    setTransparent() {
        this.header.classList.add('transparent');
    }

    removeTransparent() {
        this.header.classList.remove('transparent');
    }

    updateLogo(text) {
        const logoText = this.header.querySelector('.nav-logo span');
        if (logoText) {
            logoText.textContent = text;
        }
    }

    addMenuItem(text, href, icon = '') {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${href}">
                ${icon ? `<i class="fas fa-${icon}"></i>` : ''}
                ${text}
            </a>
        `;
        this.navMenu.appendChild(li);
    }

    removeMenuItem(text) {
        const items = this.navMenu.querySelectorAll('li');
        items.forEach(item => {
            if (item.textContent.trim() === text) {
                item.remove();
            }
        });
    }

    setActiveMenuItem(href) {
        const items = this.navMenu.querySelectorAll('li a');
        items.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === href) {
                item.classList.add('active');
            }
        });
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Header;
} else if (typeof window !== 'undefined') {
    window.Header = Header;
}
