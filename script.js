        // Theme Toggle
        function toggleTheme() {
            const body = document.body;
            const themeToggle = document.getElementById('themeToggle');
            const mobileThemeToggle = document.getElementById('mobileThemeToggle');
            
            body.classList.toggle('light-mode');
            
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            themeToggle.checked = isLight;
            mobileThemeToggle.checked = isLight;
        }

        // Load saved theme
        window.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
                document.getElementById('themeToggle').checked = true;
                document.getElementById('mobileThemeToggle').checked = true;
            }
        });

        // Mobile Menu Toggle
        function toggleMobileMenu() {
            const mobileNav = document.getElementById('mobileNav');
            const btn = document.querySelector('.mobile-menu-btn');
            mobileNav.classList.toggle('active');
            btn.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
        }

        // Scroll to Section
        function scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                const navHeight = 64;
                const targetPosition = element.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                const mobileNav = document.getElementById('mobileNav');
                mobileNav.classList.remove('active');
                document.querySelector('.mobile-menu-btn').textContent = '☰';
            }
        }

        // Tools Data with Official Logos
        const tools = [
    { 
        name: 'Illustrator', 
        svg: '<img src="./src/icono-illustrator.png" alt="Illustrator">'
    },
    { 
        name: 'Photoshop', 
        svg: '<img src="./src/icono-photoshop.png" alt="Photoshop">' 
    },
    { 
        name: 'After', 
        svg: '<img src="./src/icono-after.png" alt="After">' 
    },
    { 
        name: 'Premiere', 
        svg: '<img src="./src/icono-premiere.png" alt="premiere">' 
    },
    { 
        name: 'Indesign', 
        svg: '<img src="./src/icono-indesign.png" alt="indesign">' 
    },
    { 
        name: 'Blender', 
        svg: '<img src="./src/icono-blender.png" alt="blender">' 
    },
    { 
        name: 'Figma', 
        svg: '<img src="./src/icono-Figma.png" alt="Figma">' 
    },
    { 
        name: 'Weflow', 
        svg: '<img src="./src/icono-webflow.png" alt="webflow">' 
    },
    { 
        name: 'Framer', 
        svg: '<img src="./src/icono-framer.png" alt="framer">' 
    },
    { 
        name: 'Wordpress', 
        svg: '<img src="./src/icono-wordpress.png" alt="wordpress">' 
    },
    { 
        name: 'Elementor', 
        svg: '<img src="./src/icono-elementor.png" alt="elementor">' 
    },
    { 
        name: 'Divi', 
        svg: '<img src="./src/icono-divi.png" alt="divi">' 
    },
    { 
        name: 'Visualstudiocode', 
        svg: '<img src="./src/icono-visualstudiocode.png" alt="visualstudiocode">' 
    },
    { 
        name: 'Html', 
        svg: '<img src="./src/icono-html.png" alt="html">' 
    },
    { 
        name: 'Css', 
        svg: '<img src="./src/icono-css.png" alt="css">' 
    },
    { 
        name: 'Javascript', 
        svg: '<img src="./src/icono-javascript.png" alt="Javascript">' 
    },
    { 
        name: 'React', 
        svg: '<img src="./src/icono-react.png" alt="react">' 
    },
    { 
        name: 'Bootstrap', 
        svg: '<img src="./src/icono-bootstrap.png" alt="bootstrap">' 
    },
    { 
        name: 'Github', 
        svg: '<img src="./src/icono-github.png" alt="github">' 
    },
    { 
        name: 'Gitbash', 
        svg: '<img src="./src/icono-Gitbash.png" alt="Gitbash">' 
    },
    { 
        name: 'Chatgpt', 
        svg: '<img src="./src/icono-chatgpt.png" alt="chatgpt">' 
    }
];



        // Projects Data
        const projects = [
            {
                title: 'FroshFeel',
                description: 'Prototipo completo de una e-commerce con páginas de productos, carrito, favoritos y sistema de ubicación para ofrecer una experiencia de compra fluida.',
                image: './src/FroshFeel-portada.jpg',
                tools: ['Figma', 'Photoshop', 'Illustrator'],
                link: 'https://www.behance.net/gallery/235600881/FroshFeel-web-design-ecoomerce',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Mixto',
                description: 'E-commerce online para restaurante con sistema de compras web y reserva de mesas, brindando una experiencia organizada, rápida y accesible para los usuarios.',
                image: './src/Mixto-Portada.jpg',
                tools: ['Figma', 'Wordpress'],
                link: 'https://www.behance.net/gallery/220909617/Mixto-Proyecto-web-Web-Design',
                linkText: 'Ver Proyecto'
            },
            {
                title: 'Todo',
                description: 'Diseño visual de una web para supermercado destacando productos clave para compras online y facilitando una experiencia más clara y eficiente de uso.',
                image: './src/Todo-Portada.jpg',
                tools: ['Figma', 'Illustrator', 'Photoshop'],
                link: 'https://www.behance.net/gallery/237840385/TODO-Web-de-supermercado-en-html-y-css',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Cambioo',
                description: 'Prototipo de una app inspirada en Mercado Libre y Amazon, brindando una experiencia de compra más segura y mejor adaptada a tus necesidades.',
                image: './src/Cambio-Portada.jpg',
                tools: ['Figma'],
                link: 'https://www.behance.net/gallery/140718557/Cambioo-App-de-ventas-(diseno-uxui)',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Class',
                description: 'Prototipo de una aplicación inspirada en Classroom con comentarios integrados, publicación de contenido y clases grabadas accesibles para todos.',
                image: './src/Class-Portada.jpg',
                tools: ['Figma', 'Adobe XD'],
                link: 'https://www.behance.net/gallery/195365343/Class-App-proyecto-UXUI',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Plataform',
                description: 'Revista Platform lanza su edición gamer centrada en Steam, explorando características clave, tutoriales útiles, beneficios destacados y mucho contenido exclusivo adicional más.',
                image: './src/Plataform-Portada.jpg',
                tools: ['Illustrator', 'Photoshop', 'indesign'],
                link: 'https://www.behance.net/gallery/196466261/Plataform-Revista-sobre-Steam',
                linkText: 'Ver en Behance'
            }
        ];

        // Pricing Data
        const pricing = [
            {
                name: 'Básico',
                price: '100',
                description: 'Ideal para presentar tu proyecto online',
                link: 'https://ig.me/m/barrale_design',
                features: [
                    'Landing Page responsive',
                    'Diseño personalizado',
                    'Optimización móvil',
                    'Integración redes sociales',
                    '2 revisiones',
                    'Entrega en 5 días'
                ]
            },
            {
                name: 'Estándar',
                price: '230',
                description: 'Perfecto para negocios que inician',
                link: 'https://ig.me/m/barrale_design',
                features: [
                    'Web de 3 páginas',
                    'Diseño responsive',
                    'Optimización SEO básica',
                    'Integración redes sociales',
                    '4 revisiones',
                    'Soporte por 30 días',
                    'Entrega en 10 días'
                ]
            },
            {
                name: 'Profesional',
                price: '380',
                description: 'Sitio completo en WordPress',
                link: 'https://ig.me/m/barrale_design',
                features: [
                    'Web de 5 páginas',
                    'Animaciones',
                    'Diseño personalizado',
                    'Blog integrado',
                    'Optimización SEO',
                    '5 revisiones',
                    'Soporte por 60 días',
                    'Entrega en 12 días'
                ],
                featured: true
            },
            {
                name: 'E-Commerce',
                price: '600',
                description: 'Tienda online completa',
                link: 'https://ig.me/m/barrale_design',
                features: [
                    'E-commerce en WordPress + WooCommerce',
                    'Catálogo de productos ilimitado',
                    'Pasarela de pago integrada',
                    'Panel de gestión completo',
                    'Diseño responsive premium',
                    'Diseño personalizado de tienda',
                    '8 revisiones',
                    'Soporte por 90 días',
                    'Entrega en 20 días'
                ]
            }
        ];

        // Render Tools
        function renderTools() {
            const toolsGrid = document.getElementById('toolsGrid');
            tools.forEach(tool => {
                const card = document.createElement('div');
                card.className = 'tool-card';
                card.innerHTML = `
                    <div class="tool-logo">${tool.svg}</div>
                    <p>${tool.name}</p>
                `;
                toolsGrid.appendChild(card);
            });
        }

        // Render Projects
        function renderProjects() {
            const projectsGrid = document.getElementById('projectsGrid');
            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <div class="project-image" style="background-image: url('${project.image}'); background-size: cover; background-position: center;"></div>
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-footer">
                            <div class="tool-icons">
                                ${project.tools.map(toolName => {
                                    const tool = tools.find(t => t.name === toolName);
                                    return tool ? `<div class="tool-icon2" title="${toolName}">${tool.svg}</div>` : '';
                                }).join('')}
                            </div>
                            <a href="${project.link}" target="_blank" class="project-link">
                                ${project.linkText} →
                            </a>
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(card);
            });
        }

        // Render Pricing
function renderPricing() {
    const pricingGrid = document.getElementById('pricingGrid');
    pricing.forEach(plan => {
        const card = document.createElement('div');
        card.className = `price-card ${plan.featured ? 'featured' : ''}`;
        card.innerHTML = `
            ${plan.featured ? '<div class="featured-badge">Más Popular</div>' : ''}
            <div class="price-header">
                <div class="price-name">${plan.name}</div>
                <div class="price-amount"><span class="currency">$</span>${plan.price}</div>
                <p class="price-description">${plan.description}</p>
            </div>
            <ul class="price-features">
                ${plan.features.map(feature => `
                    <li>
                        <span class="check-icon">✓</span>
                        <span>${feature}</span>
                    </li>
                `).join('')}
            </ul>

            <a href="${plan.link}" class="btn"
               style="width: 100%; display:block; text-align:center; ${plan.featured ? '' : 'background: var(--bg-secondary); color: var(--text-primary);'}">
                Seleccionar Plan
            </a>
        `;
        pricingGrid.appendChild(card);
    });
}


        // Create Animated Particles - Estilo Figma Exacto
        function createParticles() {
            const container = document.getElementById('particlesContainer');
            if (!container) return;

            // Definir partículas específicas como en Figma
            const particles = [
                // Cuadrados con tamaños diferentes
                { type: 'square', size: 'small', top: '15%', left: '8%', delay: 0, duration: 20 },
                { type: 'square', size: 'large', top: '65%', right: '12%', delay: 5, duration: 22 },
                { type: 'square', size: 'medium', top: '45%', left: '85%', delay: 8, duration: 24 },
                
                // Solo UN círculo más pequeño, más arriba detrás de las cards
                { type: 'circle', top: '35%', left: '65%', delay: 0, duration: 18 },
                
                // Puntos rojos brillantes
                { type: 'dot', top: '12%', right: '15%', delay: 0, duration: 12 },
                { type: 'dot', top: '35%', left: '25%', delay: 2, duration: 10 },
                { type: 'dot', top: '55%', right: '30%', delay: 4, duration: 14 },
                { type: 'dot', top: '75%', left: '40%', delay: 1, duration: 11 },
                { type: 'dot', top: '20%', left: '60%', delay: 6, duration: 13 },
                { type: 'dot', top: '85%', right: '25%', delay: 3, duration: 15 },
                { type: 'dot', top: '40%', right: '8%', delay: 7, duration: 12 },
                { type: 'dot', top: '60%', left: '15%', delay: 5, duration: 11 },
                
                // Una sola línea horizontal cerca del título
                { type: 'line', top: '35%', left: '0', delay: 0, duration: 15 }
            ];

            particles.forEach(config => {
                const particle = document.createElement('div');
                particle.className = `particle ${config.type}`;
                
                // Agregar clase de tamaño para cuadrados
                if (config.type === 'square' && config.size) {
                    particle.classList.add(`size-${config.size}`);
                }
                
                if (config.top) particle.style.top = config.top;
                if (config.left) particle.style.left = config.left;
                if (config.right) particle.style.right = config.right;
                if (config.bottom) particle.style.bottom = config.bottom;
                if (config.style) particle.style.cssText += config.style;
                
                particle.style.animationDelay = config.delay + 's';
                particle.style.animationDuration = config.duration + 's';
                
                container.appendChild(particle);
            });
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderTools();
            renderProjects();
            renderPricing();
            createParticles();
        });