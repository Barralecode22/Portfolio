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
  deleteDoc,
  getDocs
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
const PROJECTS_COLLECTION = 'portfolioProjects';
const PROJECT_ORDER_KEY = 'portfolioProjectOrder';
const EXCHANGE_RATE_ARS = 1200;
let currentCurrency = localStorage.getItem('currency') || 'USD';

console.log('¡Firebase conectado!');

/* let projects = [
  {
    title: 'Wavelength',
    subtitle: 'Plataforma de descubrimiento musical',
    category: 'diseno-web',
    description: 'Una experiencia musical curada según el estado de ánimo y el contexto, con una interfaz inmersiva de ondas de audio.',
    tech: ['React', 'Node.js', 'Spotify API', 'WebAudio API'],
    color: '#b8f552',
    bgFrom: '#0a1400', bgTo: '#0f1f00',
    year: '2024', role: 'Desarrollo full-stack',
    image: 'https://images.unsplash.com/photo-1720962158813-29b66b8e23e1?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Reproduciendo'], ['13px','#f0ebe3','Outfit','The Midnight — Crystalline'], ['10px','#f0ebe3','JetBrains Mono','▶ ████████░░ 3:42']],
    screenBars: [60,80,40,90,55,70,85,45,95,65],
  },
  {
    title: 'Arkive',
    subtitle: 'Gestor de recursos de diseño',
    category: 'ux-ui',
    description: 'Gestor local de recursos de diseño para equipos. Organiza, etiqueta y encuentra miles de archivos rápidamente.',
    tech: ['Electron', 'SQLite', 'TypeScript', 'Tailwind CSS'],
    color: '#fb923c',
    bgFrom: '#1a0800', bgTo: '#200d00',
    year: '2024', role: 'Diseño de producto + Ingeniería',
    image: 'https://images.unsplash.com/photo-1520583457224-aee11bad5112?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Recursos'], ['13px','#f0ebe3','Outfit','1.204 archivos sincronizados'], ['10px','#f0ebe3','JetBrains Mono','Actualizado ahora']],
    screenBars: [90,55,75,40,85,60,70,95,50,80],
  },
  {
    title: 'Kinetic Brand',
    subtitle: 'Showreel de motion 3D',
    category: 'motion-graphics',
    description: 'Pieza de animación 3D y diseño en movimiento orientada a la identidad dinámica de marcas en plataformas digitales.',
    tech: ['After Effects', 'Cinema 4D', 'Octane'],
    color: '#818cf8',
    bgFrom: '#06000f', bgTo: '#0a0018',
    year: '2024', role: 'Diseño de movimiento',
    image: 'https://images.unsplash.com/photo-1599837565318-67429bde7162?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Cola de render'], ['13px','#f0ebe3','Outfit','1080p 60fps'], ['10px','#f0ebe3','JetBrains Mono','✦ Completo']],
    screenBars: [70,85,50,95,60,80,45,90,65,75],
  },
  {
    title: 'Studio Identity',
    subtitle: 'Branding y diseño gráfico',
    category: 'diseno-grafico',
    description: 'Sistema completo de identidad gráfica, tipografía custom y manual de marca para estudio creativo.',
    tech: ['Illustrator', 'Photoshop', 'InDesign'],
    color: '#f472b6',
    bgFrom: '#150008', bgTo: '#1c000f',
    year: '2023', role: 'Diseño gráfico',
    image: 'https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Sistema de marca'], ['13px','#f0ebe3','Outfit','Recursos vectoriales'], ['10px','#f0ebe3','JetBrains Mono','↗ Exportado']],
    screenBars: [50,90,65,80,40,95,55,75,85,60],
  },
  {
    title: 'Noma Market',
    subtitle: 'Experiencia de comercio electrónico',
    category: 'diseno-web',
    description: 'Tienda online de productos de autor con una experiencia de compra editorial, simple y enfocada en el detalle.',
    tech: ['Next.js', 'Stripe', 'Sanity', 'GSAP'],
    color: '#38bdf8',
    bgFrom: '#00131f', bgTo: '#002236',
    year: '2024', role: 'Diseño web + Desarrollo',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Resumen del pedido'], ['13px','#f0ebe3','Outfit','Carrito listo para enviar'], ['10px','#f0ebe3','JetBrains Mono','$ 248,00 total']],
    screenBars: [80,45,65,90,55,75,95,50,85,70],
  },
  {
    title: 'Lumen Health',
    subtitle: 'App y panel de bienestar',
    category: 'ux-ui',
    description: 'Producto digital para registrar hábitos y convertir datos cotidianos en decisiones de bienestar más claras.',
    tech: ['Figma', 'React Native', 'Firebase', 'D3.js'],
    color: '#34d399',
    bgFrom: '#001a12', bgTo: '#003326',
    year: '2023', role: 'Diseño de producto',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Resumen diario'], ['13px','#f0ebe3','Outfit','Tu ritmo es constante'], ['10px','#f0ebe3','JetBrains Mono','Racha de 7 días']],
    screenBars: [55,70,85,60,90,75,50,80,65,95],
  },
  {
    title: 'Echoes Festival',
    subtitle: 'Identidad para evento cultural',
    category: 'diseno-grafico',
    description: 'Identidad visual flexible para un festival de música independiente, desde el sistema gráfico hasta sus piezas digitales.',
    tech: ['Illustrator', 'InDesign', 'Figma', 'Art Direction'],
    color: '#facc15',
    bgFrom: '#1c1500', bgTo: '#302400',
    year: '2023', role: 'Dirección de arte + Branding',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Escenario principal'], ['13px','#f0ebe3','Outfit','Echoes — Día 02'], ['10px','#f0ebe3','JetBrains Mono','Puertas abiertas 19:00']],
    screenBars: [95,60,80,45,70,90,55,85,65,75],
  },
  {
    title: 'Orbit Finance',
    subtitle: 'Sistema de producto fintech',
    category: 'ux-ui',
    description: 'Sistema de producto financiero que ordena operaciones, reportes y decisiones para equipos en crecimiento.',
    tech: ['TypeScript', 'Figma', 'Storybook', 'Charts'],
    color: '#fb7185',
    bgFrom: '#1b050b', bgTo: '#320914',
    year: '2022', role: 'UX/UI + Sistema de diseño',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Informe mensual'], ['13px','#f0ebe3','Outfit','Los ingresos subieron 18,4%'], ['10px','#f0ebe3','JetBrains Mono','Actualizado hace 2 min']],
    screenBars: [65,85,45,75,95,55,80,60,90,70],
  },
  {
    title: 'Forma Objects',
    subtitle: 'Motion para lanzamiento de producto',
    category: 'motion-graphics',
    description: 'Lanzamiento audiovisual para una colección de objetos cotidianos, con foco en materiales, ritmo y formas.',
    tech: ['Cinema 4D', 'After Effects', 'Octane', 'Sound Design'],
    color: '#c084fc',
    bgFrom: '#10051c', bgTo: '#1d0a32',
    year: '2022', role: 'Diseño de movimiento',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Secuencia 04'], ['13px','#f0ebe3','Outfit','Estudio de material y luz'], ['10px','#f0ebe3','JetBrains Mono','Render completo']],
    screenBars: [45,75,90,55,85,65,95,50,80,60],
  },
  {
    title: 'Casa Norte',
    subtitle: 'Portfolio de arquitectura',
    category: 'diseno-web',
    description: 'Portfolio digital para un estudio de arquitectura que combina documentación de obra, narrativa y exploración visual.',
    tech: ['Webflow', 'GSAP', 'CMS', 'Art Direction'],
    color: '#fb923c',
    bgFrom: '#1d0d00', bgTo: '#301900',
    year: '2021', role: 'Diseño web + Dirección',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1800&h=1000&fit=crop&auto=format',
    screenLines: [['9px','#ffffff66','JetBrains Mono','Proyecto 07'], ['13px','#f0ebe3','Outfit','Luz, volumen, espacio'], ['10px','#f0ebe3','JetBrains Mono','Ver caso de estudio ↗']],
    screenBars: [75,50,90,65,80,45,85,70,95,55],
  },
]; */

let projects = [];
const baseProjects = projects;

function deduplicateProjects(projectList) {
  const uniqueProjects = new Map();
  projectList.forEach(project => {
    const key = project.title?.trim().toLowerCase() || project.id;
    if (key) uniqueProjects.set(key, project);
  });
  return [...uniqueProjects.values()];
}

function sortProjectsByPosition(projectList) {
  let savedOrder = [];
  try {
    savedOrder = JSON.parse(localStorage.getItem(PROJECT_ORDER_KEY)) || [];
  } catch (error) {
    savedOrder = [];
  }

  const orderMap = new Map(savedOrder.map((key, index) => [key, index]));
  return [...projectList].sort((first, second) => {
    const firstPosition = first.position ?? orderMap.get(first.id || first.title);
    const secondPosition = second.position ?? orderMap.get(second.id || second.title);
    if (firstPosition === undefined && secondPosition === undefined) return 0;
    if (firstPosition === undefined) return 1;
    if (secondPosition === undefined) return -1;
    return firstPosition - secondPosition;
  });
}

function normalizeProject(project, fallbackTitle = 'Proyecto personalizado') {
  const categoryNames = {
    'motion-graphics': 'Motion Graphic',
    'diseno-grafico': 'Diseño Gráfico',
    'diseno-web': 'Diseño Web',
    'ux-ui': 'UX / UI'
  };

  return {
    ...project,
    title: project.title || fallbackTitle,
    subtitle: project.subtitle || categoryNames[project.category] || project.category || 'Proyecto personalizado',
    tech: project.tech || [],
    color: project.color || '#b8f552',
    bgFrom: project.bgFrom || '#0a0a0a',
    bgTo: project.bgTo || '#161616',
    year: project.year || new Date(project.createdAt || Date.now()).getFullYear(),
    role: project.role || 'Proyecto personalizado',
    description: project.description || 'Proyecto publicado desde el panel de administración.'
  };
}

function refreshProjectsFromStorage() {
  try {
    const removedProjects = JSON.parse(localStorage.getItem('portfolioRemovedProjects')) || [];
    const customProjects = JSON.parse(localStorage.getItem('portfolioCustomProjects')) || [];
    const normalizedCustomProjects = deduplicateProjects(
      customProjects
      .map(project => normalizeProject(project, project.title || 'Proyecto personalizado'))
      .filter((project, index, list) => list.findIndex(candidate => {
        if (project.id && candidate.id) return project.id === candidate.id;
        return !project.id && !candidate.id && project.title === candidate.title;
      }) === index)
    );
    const customTitles = new Set(normalizedCustomProjects.map(project => project.title));

    projects = sortProjectsByPosition(baseProjects
      .filter(project => !removedProjects.includes(project.title) && !customTitles.has(project.title))
      .concat(normalizedCustomProjects));
  } catch (error) {
    // Mantiene los proyectos base si el almacenamiento local no es válido.
  }
}

function listenToRemoteProjects() {
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snapshot) => {
    const firebaseProjects = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString());
      return normalizeProject({ ...data, id: docSnap.id, createdAt }, data.title || 'Proyecto nuevo');
    });

    const localProjects = deduplicateProjects(
      (JSON.parse(localStorage.getItem('portfolioCustomProjects')) || [])
        .filter(project => !project.id?.startsWith('base-'))
    );
    const filteredFirebaseProjects = firebaseProjects.filter(project => !project.id.startsWith('base-'));
    const mergedProjects = sortProjectsByPosition(deduplicateProjects([...localProjects, ...filteredFirebaseProjects]));
    localStorage.setItem('portfolioCustomProjects', JSON.stringify(mergedProjects));
    refreshProjectsFromStorage();

    const metric = document.getElementById('metric-projects');
    if (metric) metric.innerHTML = '30<span>+</span>';

    if (typeof buildProjectCards === 'function') {
      buildProjectCards(document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all');
    }

    if (typeof updateHeroUI === 'function' && projects.length) {
      heroActive = Math.min(heroActive, projects.length - 1);
      buildHeroSlides();
      buildHeroDots();
      updateHeroUI(heroActive);
    }
  }, (error) => {
    console.warn('No se pudo escuchar proyectos de Firebase:', error);
    refreshProjectsFromStorage();
  });
}

refreshProjectsFromStorage();
listenToRemoteProjects();

const tools = [
  'Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro',
  'InDesign', 'Blender', 'Webflow', 'Framer', 'WordPress', 'Elementor',
  'HTML', 'CSS', 'JavaScript', 'React', 'Bootstrap', 'GitHub', 'Git',
  'ChatGPT', 'Gemini', 'Claude', 'Affinity', 'CapCut', 'Notion', 'Canva',
  'Google Analytics', 'Maze', 'Visual Studio Code', 'Vercel', 'Node.js', 'Firebase'
];

function renderToolsGrid() {
  const toolsGrid = document.getElementById('toolsGrid');
  if (!toolsGrid) return;

  toolsGrid.innerHTML = tools.map(tool => `
    <span class="tool-pill">${tool}</span>
  `).join('');
}

const skills = [
  { category: 'Motion Graphics', items: ['After Effects', 'Premiere Pro', 'Cinema 4D', 'Blender', 'CapCut', 'Affinity'] },
  { category: 'Diseño Gráfico', items: ['Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Canva', 'Affinity', 'Branding', 'Identidad visual', 'Diseño editorial'] },
  { category: 'Desarrollo Web', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Firebase', 'GitHub', 'Vercel', 'WordPress', 'Webflow', 'Framer', 'Visual Studio Code'] },
  { category: 'UX / UI', items: ['UX Research', 'Wireframes', 'Prototipado', 'Design Systems', 'UI Design', 'Usabilidad', 'Arquitectura de información', 'A/B testing', 'Maze', 'Google Analytics'] },
  { category: 'IA / Productividad', items: ['ChatGPT', 'Gemini', 'Claude', 'Notion'] }
];

renderToolsGrid();
const metricProjects = document.getElementById('metric-projects');
if (metricProjects) metricProjects.innerHTML = '30<span>+</span>';

const arsPerUsd = 1200;
const currencyOptions = document.querySelectorAll('.currency-option');
const priceNumbers = document.querySelectorAll('.price-number');
const priceCurrencies = document.querySelectorAll('.price-currency');

function updatePrices(currency) {
  priceNumbers.forEach(price => {
    const usdValue = Number(price.dataset.usd);
    const value = currency === 'ars' ? usdValue * arsPerUsd : usdValue;
    price.textContent = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);
  });
  priceCurrencies.forEach(label => { label.textContent = currency.toUpperCase(); });
  currencyOptions.forEach(option => {
    const isActive = option.dataset.currency === currency;
    option.classList.toggle('active', isActive);
    option.setAttribute('aria-pressed', String(isActive));
  });
}

currencyOptions.forEach(option => {
  option.addEventListener('click', () => updatePrices(option.dataset.currency));
});
updatePrices('usd');

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navSectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')]
  .filter(link => !link.classList.contains('nav-cta'));

function setMenuState(isOpen) {
  navbar.classList.toggle('menu-open', isOpen);
  document.body.classList.toggle('menu-active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  navLinks.setAttribute('aria-hidden', String(!isOpen));
}

navToggle.addEventListener('click', () => {
  setMenuState(!navbar.classList.contains('menu-open'));
});

navLinks.addEventListener('click', event => {
  const target = event.target;
  const link = target instanceof Element ? target.closest('a') : null;

  if (target === navLinks) {
    setMenuState(false);
    return;
  }

  if (link) {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) {
      setMenuState(false);
      return;
    }

    const section = document.querySelector(href);
    if (section) {
      event.preventDefault();
      setMenuState(false);
      window.history.pushState(null, '', href);
      requestAnimationFrame(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }
});

document.addEventListener('click', event => {
  if (!navbar.contains(event.target)) setMenuState(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navbar.classList.contains('menu-open')) {
    setMenuState(false);
    navToggle.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && navbar.classList.contains('menu-open')) setMenuState(false);
});

function updateActiveNav() {
  const currentPosition = window.scrollY + 140;
  let activeId = 'hero';

  navSectionLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section && section.offsetTop <= currentPosition) activeId = section.id;
  });

  navSectionLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
  });
}

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
}, { passive: true });
updateActiveNav();

/* ── HERO ── */
let heroActive = 0;
let heroTransitioning = false;
let heroTimer = null;

function buildHeroSlides() {
  const container = document.getElementById('hero-slides');
  container.innerHTML = '';
  projects.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'hero-slide' + (i === heroActive ? ' active' : '');
    div.id = 'hero-slide-' + i;
    const img = document.createElement('img');
    img.src = p.image;
    img.alt = p.title;
    div.appendChild(img);
    container.appendChild(div);
  });
}

function buildHeroDots() {
  const container = document.getElementById('hero-dots');
  container.innerHTML = '';
  projects.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero-dot' + (i === heroActive ? ' active' : '');
    btn.addEventListener('click', () => heroGoTo(i));
    container.appendChild(btn);
  });
}

function updateHeroUI(idx) {
  const p = projects[idx];

  document.getElementById('hero-eyebrow').style.color = p.color;
  document.getElementById('hero-accent').style.color = p.color;
  document.getElementById('hero-btn').style.background = p.color;

  document.getElementById('hero-project-bar').style.background = p.color;
  document.getElementById('hero-project-label').style.color = p.color;
  document.getElementById('hero-project-label').textContent = p.year + ' — ' + p.role;

  const titleEl = document.getElementById('hero-project-title');
  titleEl.classList.remove('animate');
  void titleEl.offsetWidth;
  titleEl.classList.add('animate');
  titleEl.textContent = p.title;

  const subEl = document.getElementById('hero-project-sub');
  subEl.classList.remove('animate');
  void subEl.offsetWidth;
  subEl.classList.add('animate');
  subEl.textContent = p.subtitle;

  const pillsEl = document.getElementById('hero-tech-pills');
  pillsEl.innerHTML = '';
  p.tech.forEach(t => {
    const span = document.createElement('span');
    span.className = 'hero-tech-pill';
    span.textContent = t;
    span.style.border = '1px solid ' + p.color + '55';
    span.style.color = p.color;
    span.style.background = p.color + '0a';
    pillsEl.appendChild(span);
  });

  document.getElementById('hero-counter-active').textContent = String(idx + 1).padStart(2, '0');
  document.getElementById('hero-counter-active').style.color = p.color;
  document.getElementById('hero-counter-total').textContent = ' / ' + String(projects.length).padStart(2, '0');

  document.querySelectorAll('.hero-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
    d.style.background = i === idx ? p.color : 'rgba(255,255,255,0.2)';
  });

  const bar = document.getElementById('hero-progress-bar');
  bar.style.background = p.color;
  bar.style.animation = 'none';
  void bar.offsetWidth;
  bar.style.animation = 'progressBar 5s linear forwards';

  document.getElementById('hero-bg-number').textContent = String(idx + 1).padStart(2, '0');
  document.getElementById('hero-bg-number').style.webkitTextStroke = '1px ' + p.color + '20';

  syncProjectCards();
}

function heroGoTo(idx) {
  if (heroTransitioning || idx === heroActive) return;
  heroTransitioning = true;
  clearTimeout(heroTimer);
  const prev = heroActive;
  heroActive = idx;
  document.getElementById('hero-slide-' + prev).classList.remove('active');
  document.getElementById('hero-slide-' + idx).classList.add('active');
  updateHeroUI(idx);
  setTimeout(() => { heroTransitioning = false; startHeroTimer(); }, 900);
}

function startHeroTimer() {
  clearTimeout(heroTimer);
  heroTimer = setTimeout(() => heroGoTo((heroActive + 1) % projects.length), 5000);
}

buildHeroSlides();
buildHeroDots();
if (projects.length) {
  updateHeroUI(0);
  startHeroTimer();
}

setTimeout(() => {
  ['hero-eyebrow','hero-title','hero-tagline','hero-ctas','hero-project-info','hero-controls'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('loaded');
  });
}, 120);

/* ── PROJECTS (FILA DE TARJETAS SINCRONIZADA CON EL INICIO) ── */

// Crea las tarjetas horizontales; cada una guarda su índice real dentro de `projects`
// para poder mostrarla en el hero sin importar el filtro activo.
function buildProjectCards(filter) {
  const row = document.getElementById('projects-row');
  row.innerHTML = '';

  projects.forEach((p, i) => {
    if (filter !== 'all' && p.category !== filter) return;

    const card = document.createElement('button');
    card.className = 'project-card' + (i === heroActive ? ' active' : '');
    card.dataset.index = String(i);
    card.style.setProperty('--pcolor', p.color);
    card.setAttribute('aria-label', 'Ver ' + p.title + ' en el inicio');

    card.innerHTML = `
      <div class="project-card-media"><img src="${p.image}" alt="${p.title}" /></div>
      <div class="project-card-overlay"></div>
      <div class="project-card-info">
        <div class="project-card-meta">
          <span class="project-card-index">${String(i + 1).padStart(2, '0')}</span>
          <span class="project-card-year">${p.year}</span>
        </div>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-sub">${p.subtitle}</p>
      </div>
    `;

    card.addEventListener('click', () => selectProjectInHero(i));
    row.appendChild(card);
  });
}

// Al apretar una tarjeta, ese proyecto pasa a mostrarse en el inicio y hacemos scroll hacia arriba.
function selectProjectInHero(idx) {
  heroGoTo(idx);
  document.getElementById('hero').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Marca como activa la tarjeta que corresponde al proyecto que se ve actualmente en el inicio
// (se llama tanto al hacer click como en cada avance automático del hero).
function syncProjectCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.classList.toggle('active', Number(card.dataset.index) === heroActive);
  });
}

// Inicialización de la sección Proyectos
buildProjectCards('all');
syncProjectCards();

// Control de botones de filtro
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    buildProjectCards(e.target.getAttribute('data-filter'));
    document.querySelector('.projects-row-wrap').scrollTo({ left: 0, behavior: 'smooth' });
  });
});

/* ── PROJECTS CAROUSEL ── */
const projectsRowWrap = document.querySelector('.projects-row-wrap');
const projectsPrevButton = document.querySelector('.projects-nav-prev');
const projectsNextButton = document.querySelector('.projects-nav-next');

function updateProjectsNavigation() {
  const maxScroll = projectsRowWrap.scrollWidth - projectsRowWrap.clientWidth;
  projectsPrevButton.disabled = projectsRowWrap.scrollLeft <= 1;
  projectsNextButton.disabled = projectsRowWrap.scrollLeft >= maxScroll - 1;
}

function moveProjects(direction) {
  const card = projectsRowWrap.querySelector('.project-card');
  if (!card) return;
  projectsRowWrap.scrollBy({ left: direction * (card.offsetWidth + 20), behavior: 'smooth' });
}

projectsPrevButton.addEventListener('click', () => moveProjects(-1));
projectsNextButton.addEventListener('click', () => moveProjects(1));
projectsRowWrap.addEventListener('scroll', updateProjectsNavigation, { passive: true });
window.addEventListener('resize', updateProjectsNavigation);
updateProjectsNavigation();

/* ── SKILLS ── */
const skillsGroups = document.getElementById('skills-groups');
skills.forEach(group => {
  const col = document.createElement('div');
  col.className = 'skill-group';
  const label = document.createElement('button');
  label.type = 'button';
  label.className = 'skill-group-label';
  label.textContent = group.category;
  label.setAttribute('aria-expanded', 'false');
  col.appendChild(label);
  const items = document.createElement('div');
  items.className = 'skill-items';
  group.items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'skill-item';
    div.style.transitionDelay = (i * 0.08) + 's';
    div.textContent = item;
    items.appendChild(div);
  });
  col.appendChild(items);
  skillsGroups.appendChild(col);

  label.addEventListener('click', () => {
    const isOpen = col.classList.toggle('is-open');
    label.setAttribute('aria-expanded', String(isOpen));
  });
});