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
const LEADS_COLLECTION = 'portfolioLeads';
const PROJECT_ORDER_KEY = 'portfolioProjectOrder';
const EXCHANGE_RATE_ARS = 1200;
let currentCurrency = localStorage.getItem('currency') || 'USD';
let currentLanguage = localStorage.getItem('portfolioLanguage') || 'es';
let portfolioLanguageMap = null;

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

    if (typeof window.refreshPortfolioLanguage === 'function') window.refreshPortfolioLanguage();
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
  { category: 'Desarrollo Web', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Firebase', 'GitHub', 'Vercel', 'WordPress', 'Webflow', 'Framer', 'Visual Studio Code', 'Unity'] },
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

/* ── PRICING TABS (Diseño Web / Video) ── */
const pricingTabs = document.querySelectorAll('.pricing-tab');
const pricingGridWeb = document.getElementById('pricing-grid-web');
const pricingGridVideo = document.getElementById('pricing-grid-video');

pricingTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    pricingTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const isVideo = tab.dataset.service === 'video';
    pricingGridWeb.classList.toggle('hidden', isVideo);
    pricingGridVideo.classList.toggle('hidden', !isVideo);
  });
});

/* ── PRICING LEADS ── */
const leadModal = document.getElementById('lead-modal');
const leadForm = document.getElementById('lead-form');
const leadSelectedPlan = document.getElementById('lead-selected-plan');
const leadStatus = document.getElementById('lead-form-status');
const leadSubmit = leadForm?.querySelector('button[type="submit"]');
let selectedLead = null;

function closeLeadModal() {
  if (!leadModal) return;
  leadModal.hidden = true;
  leadModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openLeadModal(card) {
  if (!leadModal || !leadForm) return;

  const plan = card.querySelector('.price-label')?.textContent.trim() || 'Plan';
  const price = card.querySelector('.price-number')?.textContent.trim() || '';
  const currency = card.querySelector('.price-currency')?.textContent.trim() || 'USD';
  selectedLead = { plan, price, currency };
  leadForm.reset();
  leadSelectedPlan.textContent = `${plan} - ${currency} ${price}`;
  leadStatus.textContent = '';
  leadSubmit.disabled = false;
  leadModal.hidden = false;
  leadModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.getElementById('lead-contact')?.focus();
}

document.querySelectorAll('.price-cta').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    openLeadModal(button.closest('.price-card'));
  });
});

document.querySelectorAll('[data-lead-close]').forEach(button => {
  button.addEventListener('click', closeLeadModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && leadModal && !leadModal.hidden) closeLeadModal();
});

leadForm?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!selectedLead || !leadSubmit) return;

  const name = document.getElementById('lead-name').value.trim();
  const method = document.getElementById('lead-method').value;
  const contact = document.getElementById('lead-contact').value.trim();
  if (!contact) return;

  leadSubmit.disabled = true;
  leadStatus.textContent = localizedText('Enviando...');

  try {
    await addDoc(collection(db, LEADS_COLLECTION), {
      name,
      method,
      contact,
      plan: selectedLead.plan,
      price: selectedLead.price,
      currency: selectedLead.currency,
      language: currentLanguage,
      createdAt: serverTimestamp()
    });
    leadStatus.textContent = localizedText('¡Mensaje enviado! Me voy a contactar pronto.');
    setTimeout(closeLeadModal, 1200);
  } catch (error) {
    console.error('No se pudo guardar el contacto:', error);
    leadStatus.textContent = localizedText('No se pudo enviar. Probá nuevamente.');
    leadSubmit.disabled = false;
  }
});

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
  navToggle.setAttribute('aria-label', localizedText(isOpen ? 'Cerrar menú' : 'Abrir menú'));
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

    if (p.video) {
      div.classList.add('hero-slide-video');
      div.innerHTML = `
        <div class="hero-spotlight"></div>
        <div class="hero-floor-light"></div>
        <div class="phone-stage">
          <div class="phone-glow" style="--pcolor:${p.color}"></div>
          <div class="phone-mockup">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <video src="${p.video}" autoplay muted loop playsinline></video>
              <div class="phone-screen-sheen"></div>
            </div>
          </div>
          <div class="phone-floor-shadow"></div>
        </div>
      `;
    } else {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.title;
      div.appendChild(img);
    }

    container.appendChild(div);
  });
}

function syncHeroVideos() {
  document.querySelectorAll('#hero-slides .hero-slide').forEach((slide, index) => {
    const video = slide.querySelector('video');
    if (!video) return;

    if (index === heroActive && slide.classList.contains('active')) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
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
  document.getElementById('hero-project-label').textContent = p.year + ' — ' + localizedText(p.role);

  const titleEl = document.getElementById('hero-project-title');
  titleEl.classList.remove('animate');
  void titleEl.offsetWidth;
  titleEl.classList.add('animate');
  titleEl.textContent = p.title;

  const subEl = document.getElementById('hero-project-sub');
  subEl.classList.remove('animate');
  void subEl.offsetWidth;
  subEl.classList.add('animate');
  subEl.textContent = localizedText(p.subtitle);

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
  syncHeroVideos();
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
  syncHeroVideos();
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

    const card = document.createElement('article');
    card.className = 'project-card' + (i === heroActive ? ' active' : '');
    card.dataset.index = String(i);
    card.style.setProperty('--pcolor', p.color);
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', localizedText('Ver') + ' ' + p.title + ' ' + localizedText('en el inicio'));

    const mediaMarkup = p.video
      ? `<video src="${p.video}" autoplay muted loop playsinline preload="metadata"></video>`
      : `<img src="${p.image}" alt="${p.title}" />`;

    card.innerHTML = `
      <div class="project-card-media ${p.video ? 'has-video' : ''}">${mediaMarkup}</div>
      <div class="project-card-overlay"></div>
      <div class="project-card-info">
        <div class="project-card-meta">
          <span class="project-card-index">${String(i + 1).padStart(2, '0')}</span>
          <span class="project-card-year">${p.year}</span>
        </div>
        <h3 class="project-card-title">${p.title}</h3>
        <p class="project-card-sub">${localizedText(p.subtitle)}</p>
      </div>
    `;

    if (p.video) {
      const video = card.querySelector('.project-card-media video');
      if (video) {
        video.addEventListener('loadeddata', () => {
          video.play().catch(() => {});
        });
      }
    }

    if (p.link) {
      const projectLink = document.createElement('a');
      projectLink.className = 'project-card-link';
      projectLink.href = p.link;
      projectLink.target = '_blank';
      projectLink.rel = 'noopener noreferrer';
      projectLink.textContent = localizedText('Ver proyecto ↗');
      projectLink.setAttribute('aria-label', `${localizedText('Abrir')} ${p.title}`);
      projectLink.addEventListener('click', event => event.stopPropagation());
      card.querySelector('.project-card-info').appendChild(projectLink);
    }

    card.addEventListener('click', () => selectProjectInHero(i));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectProjectInHero(i);
      }
    });
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
    const filter = e.target.getAttribute('data-filter');
    buildProjectCards(filter);
    document.getElementById('projects-row').classList.toggle('mode-vertical', filter === 'motion-graphics');
    document.querySelector('.projects-row-wrap').scrollTo({ left: 0, behavior: 'smooth' });
    updateProjectsNavigationSoon();
  });
});

// Después de cambiar de tamaño las tarjetas (modo vertical), recalculamos la navegación del carrusel.
function updateProjectsNavigationSoon() {
  requestAnimationFrame(() => {
    if (typeof updateProjectsNavigation === 'function') updateProjectsNavigation();
  });
}

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

  const languagePairs = [
    ['Inicio', 'Home'],
    ['Proyectos', 'Projects'],
    ['Servicios', 'Services'],
    ['Precios', 'Pricing'],
    ['Sobre mí', 'About me'],
    ['Habilidades', 'Skills'],
    ['Trabajemos', "Let's work together"],
    ['Abrir menú', 'Open menu'],
    ['Cerrar menú', 'Close menu'],
    ['Barrale Design — Diseño web y Edición de Video', 'Barrale Design — Web Design and Video Editing'],
    ['Diseño digital', 'Digital design'],
    ['para tu web y redes', 'for your website and social media'],
    ['Diseño gráfico, UX/UI y diseño web para emprendedores que buscan crear su sitio web, resolver un problema digital o editar contenido para redes sociales.', 'Graphic design, UX/UI and web design for entrepreneurs who want to build their website, solve a digital problem or edit content for social media.'],
    ['Ver proyectos ↓', 'View projects ↓'],
    ['Hablemos', "Let's talk"],
    ['Proyectos', 'Projects'],
    ['Trabajos', 'Recent'],
    ['recientes.', 'work.'],
    ['Tocá un proyecto para verlo al inicio.', 'Select a project to view it in the hero.'],
    ['Todos', 'All'],
    ['Diseño Web', 'Web Design'],
    ['Diseño Gráfico', 'Graphic Design'],
    ['Motion Graphic', 'Motion Graphics'],
    ['Ver proyectos anteriores', 'Previous projects'],
    ['Ver más proyectos', 'More projects'],
    ['Volver al inicio', 'Back to top'],
    ['Ver', 'View'],
    ['en el inicio', 'in the hero'],
    ['Abrir', 'Open'],
    ['Servicios', 'Services'],
    ['Ideas que toman ', 'Ideas that take '],
    ['forma.', 'shape.'],
    ['Encamino tu proyecto hacia una solucion certera de tu vision.', 'I guide your project toward a clear solution for your vision.'],
    ['Diseño web', 'Web design'],
    ['Sitios optimizados para la experiencia de tu cliente o para vender tus servicios y productos.', 'Websites optimized for your customers experience or to sell your services and products.'],
    ['Diseño de interfaces intuitivas en base a tu publico objetivo y necesidades.', 'Intuitive interface design based on your target audience and needs.'],
    ['Identidades visual en tu marca, diseño editorial, Conceptos claros que ayudan a destacar tu negocio visualmente.', 'Visual identities for your brand, editorial design and clear concepts that help your business stand out.'],
    ['Edición de videos con animaciones dinamicas para llamar la atencion de tus publico en redes sociales.', 'Video editing with dynamic animations to capture your audiences attention on social media.'],
    ['Proyectos realizados', 'Completed projects'],
    ['Clientes satisfechos', 'Happy clients'],
    ['Años creando', 'Years creating'],
    ['Compromiso en cada entrega', 'Commitment in every delivery'],
    ['Precios', 'Pricing'],
    ['Elegí el plan ', 'Choose the plan '],
    ['ideal para tu proyecto.', 'that fits your project.'],
    ['Todos los planes se pueden adaptar a las necesidades y objetivos de tu marca.', 'All plans can be adapted to your brands needs and goals.'],
    ['Edición de Video', 'Video Editing'],
    ['Moneda', 'Currency'],
    ['Básico', 'Basic'],
    ['por proyecto', 'per project'],
    ['Ideal para emprendedores', 'Ideal for entrepreneurs'],
    ['Landing Page', 'Landing page'],
    ['UX/UI básico', 'Basic UX/UI'],
    ['Animaciones de entrada (fade, slide y hover)', 'Entrance animations (fade, slide and hover)'],
    ['Diseño responsive', 'Responsive design'],
    ['Integración con redes sociales', 'Social media integration'],
    ['2 revisiones', '2 revisions'],
    ['revisiones', 'revisions'],
    ['Entrega en 5 días', 'Delivery in 5 days'],
    ['cPanel para autogestión', 'cPanel for self-management'],
    ['SEO básico', 'Basic SEO'],
    ['Optimización de velocidad', 'Speed optimization'],
    ['Optimización de imágenes', 'Image optimization'],
    ['Soporte por 30 días', '30-day support'],
    ['Más elegido', 'Most popular'],
    ['Estándar', 'Standard'],
    ['Perfecto para pequeñas empresas', 'Perfect for small businesses'],
    ['Web de 3 páginas', '3-page website'],
    ['UX/UI avanzado', 'Advanced UX/UI'],
    ['Animaciones al hacer scroll y de entrada (fade, slide y hover)', 'Scroll and entrance animations (fade, slide and hover)'],
    ['4 revisiones', '4 revisions'],
    ['Entrega en 10 días', 'Delivery in 10 days'],
    ['E-Commerce', 'E-Commerce'],
    ['por video', 'per video'],
    ['Tienda online lista para vender', 'Online store ready to sell'],
    ['Catálogo de Hasta 50 productos cargados', 'Catalog with up to 50 products loaded'],
    ['Pasarela de pago integrada', 'Integrated payment gateway'],
    ['Panel de gestión completo', 'Complete management panel'],
    ['Diseño responsive premium', 'Premium responsive design'],
    ['Compatibilidad con todos los navegadores', 'Compatible with all browsers'],
    ['Formulario de contacto avanzado', 'Advanced contact form'],
    ['6 revisiones', '6 revisions'],
    ['Soporte por 90 días', '90-day support'],
    ['Entrega en 20 días', 'Delivery in 20 days'],
    ['Hablar', 'Get in touch'],
    ['Reel Simple', 'Simple Reel'],
    ['Ideal para contenido frecuente de redes', 'Ideal for frequent social media content'],
    ['Video de hasta 60 segundos', 'Video up to 60 seconds'],
    ['Corte y ritmo de edición', 'Cuts and editing pace'],
    ['Subtítulos', 'Subtitles'],
    ['Música con derechos', 'Licensed music'],
    ['Formato vertical (Reels/TikTok/Shorts)', 'Vertical format (Reels/TikTok/Shorts)'],
    ['Entrega en 3 días', 'Delivery in 3 days'],
    ['Motion graphics animado', 'Animated motion graphics'],
    ['Corrección de color avanzada', 'Advanced color correction'],
    ['Reel Pro', 'Pro Reel'],
    ['Motion graphic para destacar tu marca', 'Motion graphics to make your brand stand out'],
    ['Video de hasta 90 segundos', 'Video up to 90 seconds'],
    ['Motion graphics y animaciones custom', 'Custom motion graphics and animations'],
    ['Exportado para feed, story y reel', 'Exported for feed, story and reel'],
    ['Archivos del proyecto', 'Project files'],
    ['Entrega en 4 días', 'Delivery in 4 days'],
    ['Paquete Mensual', 'Monthly Package'],
    ['por mes', 'per month'],
    ['Contenido constante para tus redes', 'Consistent content for your social media'],
    ['8 videos editados por mes', '8 edited videos per month'],
    ['Motion graphics avanzado', 'Advanced motion graphics'],
    ['Calendario de entregas semanal', 'Weekly delivery schedule'],
    ['3 revisiones por video', '3 revisions per video'],
    ['Sobre mí', 'About me'],
    ['Diseño con estrategia, ', 'Design with strategy, '],
    ['código con intención.', 'code with intention.'],
    ['Soy Matías Barrale, diseñador gráfico y desarrollador web enfocado en crear marcas y experiencias digitales que se entienden rápido, se sienten bien y funcionan con claridad.', 'I am Matias Barrale, a graphic designer and web developer focused on creating brands and digital experiences that are clear, feel right and work well.'],
    ['Trabajo en proyectos donde el diseño no es solo estética: es estrategia, comunicación, claridad visual y una experiencia que realmente ayuda a crecer. Desde branding y diseño de interfaces hasta sitios web completos, acompaño a marcas y negocios a transformar su presencia digital.', 'I work on projects where design is more than aesthetics: it is strategy, communication, visual clarity and an experience that truly helps businesses grow. From branding and interface design to complete websites, I help brands and businesses transform their digital presence.'],
    ['Actualmente estoy disponible para proyectos freelance, colaboraciones y trabajos a distancia desde Argentina, con foco en diseño visual, UX/UI y desarrollo web.', 'I am currently available for freelance projects, collaborations and remote work from Argentina, focused on visual design, UX/UI and web development.'],
    ['Disponible ahora', 'Available now'],
    ['Diseñador gráfico, diseñador web, editor de videos', 'Graphic designer, web designer, video editor'],
    ['Trabajo remoto', 'Remote work'],
    ['Habilidades', 'Skills'],
    ['Mis herramientas ', 'My work '],
    ['de trabajo.', 'tools.'],
    ['Hablemos', "Let's talk"],
    ['¿Tenés un proyecto ', 'Do you have a project '],
    ['en mente?', 'in mind?'],
    ['Siempre estoy abierto a conversaciones de tu proyecto y colaboraciones que tengan un gran valor. Escribime.', 'I am always open to discussing your project and meaningful collaborations. Send me a message.'],
    ['© 2026 Barrale Design. Todos los derechos reservados.', '© 2026 Barrale Design. All rights reserved.'],
    ['Ver proyecto ↗', 'View project ↗']
  ];

  portfolioLanguageMap = Object.fromEntries(languagePairs.flatMap(([spanish, english]) => [
    [spanish, { es: spanish, en: english }],
    [english, { es: spanish, en: english }]
  ]));

  function localizedText(value) {
    return portfolioLanguageMap?.[value]?.[currentLanguage] || value;
  }

  function translatePage(language) {
    document.documentElement.lang = language;
    document.title = language === 'en' ? 'Barrale Design — Digital design' : 'Barrale Design';

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('.project-card-title, #hero-project-title')) continue;
      const value = node.nodeValue.trim();
      const translation = portfolioLanguageMap?.[value];
      if (!translation) continue;
      node.nodeValue = node.nodeValue.replace(value, translation[language]);
    }

    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      languageToggle.textContent = language === 'en' ? 'ES' : 'EN';
      languageToggle.setAttribute('aria-label', language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés');
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.setAttribute('aria-label', link.textContent.trim());
    });
  }

  document.querySelectorAll('[aria-label], [title]').forEach(element => {
    ['aria-label', 'title'].forEach(attribute => {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, localizedText(value));
    });
  });

  const languageToggle = document.getElementById('language-toggle');
  languageToggle?.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    localStorage.setItem('portfolioLanguage', currentLanguage);
    translatePage(currentLanguage);
  });

  window.refreshPortfolioLanguage = () => translatePage(currentLanguage);
  translatePage(currentLanguage);