        // ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    doc,        
    setDoc,     
    query, 
    orderBy, 
    limit, 
    onSnapshot, 
    serverTimestamp,
    deleteDoc // <--- AGREGÁ ESTA FUNCIÓN ACÁ
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAuGvpVGinoycXN0N52yisDX1WvWYxUygE",
  authDomain: "portfolio-7d3b4.firebaseapp.com",
  projectId: "portfolio-7d3b4",
  storageBucket: "portfolio-7d3b4.firebasestorage.app",
  messagingSenderId: "478745682924",
  appId: "1:478745682924:web:02c247756be99f5439d6c9",
  measurementId: "G-0521JMV1YP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log("¡Firebase conectado!");
        
        
        
        
        
        
        
        
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
                images: ['./src/FroshFeel-portada.jpg','./src/fros2.png','./src/fros3.png'],
                tools: ['Figma', 'Photoshop', 'Illustrator'],
                link: 'https://www.behance.net/gallery/235600881/FroshFeel-web-design-ecoomerce',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Mixto',
                description: 'E-commerce online para restaurante con sistema de compras web y reserva de mesas, brindando una experiencia organizada, rápida y accesible para los usuarios.',
                images: ['./src/Mixto-Portada.jpg','./src/mix1.png','./src/mix2.png','./src/mix3.png'],
                tools: ['Figma', 'Wordpress'],
                link: 'https://www.behance.net/gallery/220909617/Mixto-Proyecto-web-Web-Design',
                linkText: 'Ver Proyecto'
            },
            {
                title: 'Todo',
                description: 'Diseño visual de una web para supermercado destacando productos clave para compras online y facilitando una experiencia más clara y eficiente de uso.',
                images: ['./src/Todo-Portada.jpg','./src/todo1.png','./src/todo2.png','./src/todo3.png'],
                tools: ['Figma', 'Illustrator', 'Photoshop'],
                link: 'https://www.behance.net/gallery/237840385/TODO-Web-de-supermercado-en-html-y-css',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Cambioo',
                description: 'Prototipo de una app inspirada en Mercado Libre y Amazon, brindando una experiencia de compra más segura y mejor adaptada a tus necesidades.',
                images: ['./src/Cambio-Portada.jpg','./src/camb1.png','./src/camb2.png'],
                tools: ['Figma'],
                link: 'https://www.behance.net/gallery/140718557/Cambioo-App-de-ventas-(diseno-uxui)',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Class',
                description: 'Prototipo de una aplicación inspirada en Classroom con comentarios integrados, publicación de contenido y clases grabadas accesibles para todos.',
                images: ['./src/Class-Portada.jpg','./src/clas1.png','./src/clas2.png','./src/clas3.png'],
                tools: ['Figma', 'Adobe XD'],
                link: 'https://www.behance.net/gallery/195365343/Class-App-proyecto-UXUI',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Plataform',
                description: 'Revista Platform lanza su edición gamer centrada en Steam, explorando características clave, tutoriales útiles, beneficios destacados y mucho contenido exclusivo adicional más.',
                images: ['./src/Plataform-Portada.jpg','./src/plata1.png','./src/plata2.png'],
                tools: ['Illustrator', 'Photoshop', 'indesign'],
                link: 'https://www.behance.net/gallery/196466261/Plataform-Revista-sobre-Steam',
                linkText: 'Ver en Behance'
            },
            {
                title: 'AOA Chile tv',
                description: 'Un rediseño de landing para una agencia audiovisual debe priorizar impacto visual inmediato, mostrando trabajos reales y un mensaje claro con llamado a la acción.',
                images: ['./src/frame 21.png','./src/aoa1.png','./src/aoa2.png','./src/aoa3.png'],
                tools: ['Figma', 'Photoshop', 'Wordpress'],
                link: 'https://www.behance.net/gallery/247261557/AOA-CHILE-TV-Website',
                linkText: 'Ver en Behance'
            },
            {
                title: 'Manos Caseras Vol. 1',
                description: 'Un proyecto gastronómico casero que reúne recetas dulces, saladas y proteicas, destacando lo artesanal, nutritivo y accesible para el día a día.',
                images: ['./src/unnamed.jpg','./src/manos1.png','./src/manos2.png','./src/manos3.png'],
                tools: ['Indesign', 'Photoshop', 'illustrator'],
                link: 'https://www.behance.net/gallery/249438661/Manos-Caseras-Vol-1-Diseno-de-Libro-de-Cocina',
                linkText: 'Ver en Behance'
            }
        ];

        // Pricing Data
        const pricingWeb = [
            {
                name: 'Básico',
                price: '25 USD',
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
                price: '75 USD',
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
                ],
                featured: true
            },
            {
                name: 'Profesional',
                price: '120 USD',
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
                ]
            },
            {
                name: 'E-Commerce',
                price: '300 USD',
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

        const pricingMotion = [
    {
        name: 'Edición Básica',
        price: '25 USD',
        description: 'Ideal para creadores de contenido y redes sociales',
        link: 'https://ig.me/m/barrale_design',
        features: ['Hasta 1 minuto de duración', 'Cortes precisos', 'pack de 3 videos', 'Subtítulos dinámicos', '2 revisiones']
    },
    {
        name: 'Promocional Pro',
        price: '50 USD',
        description: 'Videos comerciales de alto impacto',
        link: 'https://ig.me/m/barrale_design',
        features: ['Hasta 3 minutos', 'Animación de textos', 'Cortes precisos', 'pack de 3 videos', '4 revisiones'],
        featured: true
    },
    {
        name: 'Identidad Animada',
        price: '75 USD',
        description: 'Branding en movimiento para tu marca',
        link: 'https://ig.me/m/barrale_design',
        features: ['Hasta 4 minutos', 'Animación de Logotipo', 'Intros y Outros', 'Lower Thirds', 'Archivos finales .AE']
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

        function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Usar la primera imagen como portada
        const firstImage = project.images ? project.images[0] : project.image;

        card.innerHTML = `
            <div class="project-image" style="background-image: url('${firstImage}'); background-size: cover; background-position: center;"></div>
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

        // Hover preview automático en cards de proyectos
function addProjectHoverPreview() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card, index) => {
        const imageDiv = card.querySelector('.project-image');

        const previews = projects[index].images || [projects[index].image];

        let current = 0;
        let interval;

        card.addEventListener('mouseenter', () => {
            interval = setInterval(() => {
                current = (current + 1) % previews.length;
                imageDiv.style.backgroundImage = `url('${previews[current]}')`;
            }, 400); // velocidad del cambio
        });

        card.addEventListener('mouseleave', () => {

    clearInterval(interval);

    current = 0;

    const firstImage = projects[index].images
        ? projects[index].images[0]
        : projects[index].image;

    imageDiv.style.backgroundImage = `url('${firstImage}')`;

});
    });
}

        // Render Pricing
// Render Pricing
function renderPricing(category = 'web') {
    const pricingGrid = document.getElementById('pricingGrid');
    if (!pricingGrid) return;
    pricingGrid.innerHTML = '';
    
    const data = category === 'web' ? pricingWeb : pricingMotion;
    const clarifications = document.getElementById('pricingClarifications');
    
    // Al alternar el switch, esto controla que abajo solo aparezca en 'web'
    if (clarifications) {
        clarifications.style.display = category === 'web' ? 'block' : 'none';
    }

    // Mapeo e inyección de las cards
    data.forEach(plan => {
        const card = document.createElement('div');
        card.className = `price-card ${plan.featured ? 'featured' : ''}`;
        
        // CORRECCIÓN AQUÍ: Escapamos de forma segura el string para el atributo onclick HTML
        const planNameSafe = plan.name.replace(/'/g, "\\'");

        card.innerHTML = `
            ${plan.featured ? '<div class="featured-badge">Más Popular</div>' : ''}
            <div class="price-header">
                <div class="price-name">${plan.name}</div>
                <div class="price-amount"><span class="currency">$</span>${plan.price}</div>
                <p class="price-description">${plan.description}</p>
            </div>
            <ul class="price-features">
                ${plan.features.map(feature => `<li><span class="check-icon">✓</span><span>${feature}</span></li>`).join('')}
            </ul>
            <a href="javascript:void(0)" class="btn" onclick="seleccionarPlan('${planNameSafe}')" style="width: 100%; display:block; text-align:center; ${plan.featured ? '' : 'background: var(--bg-secondary); color: var(--text-primary);'}">
                Seleccionar Plan
            </a>
        `;
        pricingGrid.appendChild(card);
    });
}

function changePricingCategory(category) {
    const btnWeb = document.getElementById('btn-web');
    const btnMotion = document.getElementById('btn-motion');

    if (category === 'web') {
        btnWeb.classList.add('active');
        btnMotion.classList.remove('active');
    } else {
        btnWeb.classList.remove('active');
        btnMotion.classList.add('active');
    }
    
    renderPricing(category);
}

window.changePricingCategory = changePricingCategory;

// Modificá tu inicialización del DOM para cargar 'web' por defecto:
document.addEventListener('DOMContentLoaded', () => {
    // ... otros renders
    renderPricing('web');
});

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
            addProjectHoverPreview();
        });



        /* =========================
   3D COVERFLOW ROTATION
========================= */

const items = document.querySelectorAll('.coverflow-item');

const positions = [
    'left-3',
    'left-2',
    'left-1',
    'active',
    'right-1',
    'right-2',
    'right-3'
];

function rotateCoverflow(){

    const current = [];

    items.forEach(item => {

        positions.forEach(pos => {

            if(item.classList.contains(pos)){
                current.push(pos);
            }

        });

    });

    current.unshift(current.pop());

    items.forEach((item, index) => {

        positions.forEach(pos => item.classList.remove(pos));

        item.classList.add(current[index]);

    });

}

setInterval(rotateCoverflow, 2500);





const buttons = document.querySelectorAll(".category-btn");
const grids = document.querySelectorAll(".videos-grid");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        // ACTIVE BUTTON
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // CATEGORY
        const category = button.dataset.category;

        // SHOW GRID
        grids.forEach(grid => {

            grid.classList.remove("active-grid");

            if(grid.dataset.category === category){
                grid.classList.add("active-grid");
            }

        });

    });

});




// ==========================================
// CREDENCIALES Y LOGICA INTERNA DEL CHAT
// ==========================================
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app); // Inicializamos Auth con tu app de Firebase

// ID único de sesión del visitante anónimo
let currentChatId = localStorage.getItem('chat_session_id');
if (!currentChatId) {
    currentChatId = 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('chat_session_id', currentChatId);
}

let isAdminLoggedIn = false;
let adminSelectedChatId = null;
let unsubscribeMessages = null;

// Observador para mantener el estado de sesión de Firebase de forma segura
onAuthStateChanged(auth, (user) => {
    if (user) {
        isAdminLoggedIn = true;
        // Si se recarga la página y estabas logueado, mantiene la interfaz admin
        const loginView = document.getElementById('adminLoginView');
        if (loginView && !loginView.classList.contains('d-none')) {
            showThreadsList();
        }
    } else {
        isAdminLoggedIn = false;
        adminSelectedChatId = null;
    }
});

// Escuchar el formulario del chat cuando cargue el DOM
window.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    if (chatForm) {
        listenToMessages(currentChatId);

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            const targetChatId = isAdminLoggedIn ? adminSelectedChatId : currentChatId;
            if (!targetChatId) {
                alert("Por favor, selecciona una conversación primero.");
                return;
            }

            try {
                await addDoc(collection(db, "chats", targetChatId, "mensajes"), {
                    text: text,
                    sender: isAdminLoggedIn ? "admin" : "user",
                    createdAt: serverTimestamp()
                });

                await setDoc(doc(db, "chat_threads", targetChatId), {
                    chatId: targetChatId,
                    lastMessage: text,
                    updatedAt: serverTimestamp()
                }, { merge: true });

                chatInput.value = '';
            } catch (error) {
                console.error("Error al enviar mensaje:", error);
            }
        });
    }
});

// Escuchar mensajes en tiempo real
// Escuchar mensajes en tiempo real
function listenToMessages(chatId) {
    if (unsubscribeMessages) unsubscribeMessages();

    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const q = query(collection(db, "chats", chatId, "mensajes"), orderBy("createdAt", "asc"), limit(50));

    unsubscribeMessages = onSnapshot(q, (snapshot) => {
        chatMessages.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const msgEl = document.createElement('div');
            
            msgEl.className = `chat-message ${data.sender}`;
            
            // 🚀 CAMBIO CLAVE AQUÍ: Procesamos el texto para detectar links y usar innerHTML de forma segura
            msgEl.innerHTML = renderizarTextoConEnlaces(data.text);

            if (data.sender === "user") {
                msgEl.style.backgroundColor = "#ff003c"; 
                msgEl.style.color = "#ffffff";
            } else if (data.sender === "admin") {
                msgEl.style.backgroundColor = "#1e1e24"; 
                msgEl.style.color = "#ffffff";
            }

            chatMessages.appendChild(msgEl);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Alternar vistas del chat (Mensajes / Login Admin / Hilos Admin)
function toggleAdminView() {
    const loginView = document.getElementById('adminLoginView');
    const threadsView = document.getElementById('adminThreadsView');
    const chatBodyView = document.getElementById('chatBodyView');
    const title = document.getElementById('chatHeaderTitle');
    const subtitle = document.getElementById('chatHeaderSubtitle');

    if (!loginView || !threadsView || !chatBodyView) return;

    if (isAdminLoggedIn) {
        if (threadsView.classList.contains('d-none')) {
            showThreadsList();
        } else {
            threadsView.classList.add('d-none');
            chatBodyView.classList.remove('d-none');
            title.textContent = adminSelectedChatId ? `Chat: ${adminSelectedChatId}` : "Panel Soporte";
        }
        return;
    }

    if (loginView.classList.contains('d-none')) {
        chatBodyView.classList.add('d-none');
        threadsView.classList.add('d-none');
        loginView.classList.remove('d-none');
        title.textContent = "Área de Soporte";
        subtitle.textContent = "Por favor identifícate";
    } else {
        loginView.classList.add('d-none');
        chatBodyView.classList.remove('d-none');
        title.textContent = "Soporte Barrale Design 💬";
        subtitle.textContent = "Dejá tu consulta en tiempo real";
        listenToMessages(currentChatId);
    }
}

// Función para prevenir XSS sanitizando texto plano
function escapeHTML(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Loguear al administrador usando Firebase Auth de forma segura
async function loginAdmin() {
    const email = document.getElementById('adminUser').value.trim(); // Ahora pasás el mail configurado
    const pass = document.getElementById('adminPass').value.trim();

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        document.getElementById('adminLoginView').classList.add('d-none');
        showThreadsList();
    } catch (error) {
        console.error("Error en login:", error);
        alert("Credenciales incorrectas o error de conexión.");
    }
}

// Mostrar hilos activos en el panel del administrador
function showThreadsList() {
    const threadsView = document.getElementById('adminThreadsView');
    const chatBodyView = document.getElementById('chatBodyView');
    const threadsList = document.getElementById('threadsList');
    const title = document.getElementById('chatHeaderTitle');
    const subtitle = document.getElementById('chatHeaderSubtitle');

    chatBodyView.classList.add('d-none');
    threadsView.classList.remove('d-none');
    title.textContent = "Panel de Control Admin";
    subtitle.textContent = "Selecciona un chat para responder";

    const q = query(collection(db, "chat_threads"), orderBy("updatedAt", "desc"), limit(20));
    
    onSnapshot(q, (snapshot) => {
        threadsList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const item = document.createElement('div');
            item.className = 'thread-item';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '10px';
            item.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
            
            // Sanitizamos el último mensaje para prevenir XSS
            const safeLastMessage = data.lastMessage ? escapeHTML(data.lastMessage) : 'Nuevo chat iniciado';
            
            item.innerHTML = `
                <div class="thread-info" style="cursor: pointer; flex-grow: 1; min-width: 0; word-break: break-word; overflow-wrap: break-word; padding-right: 10px;">
                    <strong>ID: ${escapeHTML(data.chatId)}</strong><br>
                    <small style="display: block; color: rgba(255,255,255,0.8); line-height: 1.3;">${safeLastMessage}</small>
                </div>
                <button class="btn-delete-thread" data-id="${data.chatId}" style="background: #ff4d4d; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 55px;">
                    <span>🗑️</span>
                    <span style="font-size: 0.7rem; font-weight: bold;">Borrar</span>
                </button>
            `;
            
            item.querySelector('.thread-info').onclick = () => {
                adminSelectedChatId = data.chatId;
                threadsView.classList.add('d-none');
                chatBodyView.classList.remove('d-none');
                title.textContent = `Chat: ${data.chatId}`;
                subtitle.textContent = "Respondiendo en tiempo real...";
                listenToMessages(adminSelectedChatId);
            };

            item.querySelector('.btn-delete-thread').onclick = async (e) => {
                e.stopPropagation();
                
                if (confirm(`¿Estás seguro de que querés borrar permanentemente el chat ${data.chatId}?`)) {
                    try {
                        await deleteDoc(doc(db, "chat_threads", data.chatId));
                        if (adminSelectedChatId === data.chatId) {
                            adminSelectedChatId = null;
                            const chatMessages = document.getElementById('chatMessages');
                            if (chatMessages) chatMessages.innerHTML = '';
                        }
                        alert("Chat eliminado correctamente.");
                    } catch (error) {
                        console.error("Error al eliminar el chat: ", error);
                        alert("No se pudo eliminar el chat.");
                    }
                }
            };

            threadsList.appendChild(item);
        });

        if(snapshot.empty) {
            threadsList.innerHTML = '<p style="font-size:0.8rem;opacity:0.6;padding:10px;">No hay chats activos.</p>';
        }
    });
}

function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 50);
            }
        }
    }
}

// Opcional: Función para cerrar sesión si lo necesitás en el futuro
async function logoutAdmin() {
    await signOut(auth);
    alert("Sesión cerrada.");
    location.reload();
}

// ==========================================
// VINCULACIÓN AL CONTEXTO WINDOW (GLOBAL)
// ==========================================
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToSection = scrollToSection;
window.toggleChat = toggleChat;
window.toggleAdminView = toggleAdminView;
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;



// ============================================================
// FUNCIÓN PARA SELECCIÓN DE PLANES CON ENVÍO AUTOMÁTICO
// ============================================================
// ============================================================
// FUNCIÓN PARA SELECCIÓN DE PLANES CON ENVÍO AUTOMÁTICO
// ============================================================
function seleccionarPlan(nombrePlan) {
    // 1. Abre tu burbuja de chat
    toggleChat(); 
    
    // 2. Busca el input de texto del chat
    const chatInput = document.getElementById('chatInput');
    const chatForm = document.getElementById('chatForm');
    
    if (chatInput && chatForm) {
        // 3. Escribe el mensaje automático del usuario
        chatInput.value = `¡Hola! Me interesa contratar el plan [${nombrePlan}]. ¿Cómo podemos iniciar?`;
        
        // 4. Dispara automáticamente el envío a Firebase
        chatForm.requestSubmit();

        // 5. RESPUESTA AUTOMÁTICA CON EL LINK DE GOOGLE DOCS
        // Usamos un pequeño delay de 800ms para que se envíe justo después
        setTimeout(async () => {
            const targetChatId = isAdminLoggedIn ? adminSelectedChatId : currentChatId;
            if (!targetChatId) return;

            // Cambiá acá abajo REEMPLAZA_ESTE_LINK por tu enlace real de Google Docs
            const urlGoogleDocs = "https://forms.gle/oeG9JzHaVYuSsLfA6";
            const textoRespuesta = `¡Excelente elección! Para conocer más sobre tu empresa o emprendimiento y empezar a trabajar, por favor completa este formulario: ${urlGoogleDocs}`;

            try {
                // Guardamos el mensaje automático como remitente "admin" para que aparezca del lado izquierdo
                await addDoc(collection(db, "chats", targetChatId, "mensajes"), {
                    text: textoRespuesta,
                    sender: "admin", 
                    createdAt: serverTimestamp()
                });

                // Actualizamos el último mensaje en la lista de hilos
                await setDoc(doc(db, "chat_threads", targetChatId), {
                    chatId: targetChatId,
                    lastMessage: textoRespuesta,
                    updatedAt: serverTimestamp()
                }, { merge: true });

            } catch (error) {
                console.error("Error al enviar el link automático:", error);
            }
        }, 800);
    }
}

// Lo mantenemos global para el HTML
window.seleccionarPlan = seleccionarPlan;

// Función para transformar texto con links en enlaces cliqueables
function linkify(text) {
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00bcd4; text-decoration: underline;">$1</a>');
}
function renderizarTextoConEnlaces(texto) {
    // Expresión regular para detectar links (http, https, etc.)
    const expresionUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    
    // Primero convertimos a texto plano seguro para evitar vulnerabilidades XSS
    let divAuxiliar = document.createElement('div');
    divAuxiliar.textContent = texto;
    let textoSeguro = divAuxiliar.innerHTML;

    // Reemplazamos los links por etiquetas <a> estilizadas
    return textoSeguro.replace(expresionUrl, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00bcd4; text-decoration: underline; font-weight: bold;">$1</a>');
}