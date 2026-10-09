import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const PROJECTS_KEY = 'portfolioCustomProjects';
const REMOVED_PROJECTS_KEY = 'portfolioRemovedProjects';
const PROJECT_ORDER_KEY = 'portfolioProjectOrder';
const PROJECTS_COLLECTION = 'portfolioProjects';
const LEADS_COLLECTION = 'portfolioLeads';
const firebaseProjectIds = new Set();

const baseProjects = [
  ['Wavelength', 'diseno-web', 'https://images.unsplash.com/photo-1720962158813-29b66b8e23e1?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Arkive', 'ux-ui', 'https://images.unsplash.com/photo-1520583457224-aee11bad5112?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Kinetic Brand', 'motion-graphics', 'https://images.unsplash.com/photo-1599837565318-67429bde7162?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Studio Identity', 'diseno-grafico', 'https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Noma Market', 'diseno-web', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Lumen Health', 'ux-ui', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Echoes Festival', 'diseno-grafico', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Orbit Finance', 'ux-ui', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Forma Objects', 'motion-graphics', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200&h=700&fit=crop&auto=format&q=65'],
  ['Casa Norte', 'diseno-web', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=700&fit=crop&auto=format&q=65']
].map(([title, category, image]) => ({ title, category, image, base: true }));

const categoryNames = {
  'motion-graphics': 'Motion Graphics',
  'diseno-grafico': 'Diseño Gráfico',
  'diseno-web': 'Diseño Web',
  'ux-ui': 'UX / UI'
};

let editingProjectId = null;
let currentImageData = null;
let currentVideoData = null;
let editingProject = null;
let imageChangedWhileEditing = false;
let videoChangedWhileEditing = false;
const pendingProjectUpdates = new Map();

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
const auth = getAuth(app);
const db = getFirestore(app);

function getAuthErrorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
    'auth/invalid-email': 'Ingresá un correo electrónico válido.',
    'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos e intentá nuevamente.'
  };
  return messages[error.code] || 'No se pudo iniciar sesión. Revisá la configuración de Firebase.';
}

function updateFirebaseStatus(message, state) {
  const status = document.getElementById('firebase-status');
  if (!status) return;
  status.textContent = message;
  status.className = `firebase-status ${state}`;
}

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    return fallback;
  }
}

function getProjects() {
  const removedProjects = readStorage(REMOVED_PROJECTS_KEY, []);
  const customProjects = readStorage(PROJECTS_KEY, []).filter(project => !project.id?.startsWith('base-'));
  const firebaseTitles = new Set(customProjects.map(project => project.title));
  return sortProjects([
    ...baseProjects.filter(project => !removedProjects.includes(project.title) && !firebaseTitles.has(project.title)),
    ...customProjects.filter(project => !removedProjects.includes(project.title))
  ]);
}

function projectKey(project) {
  return project.id || project.title;
}

function sortProjects(projects) {
  const savedOrder = readStorage(PROJECT_ORDER_KEY, []);
  const orderMap = new Map(savedOrder.map((key, index) => [key, index]));
  return [...projects].sort((first, second) => {
    const firstPosition = orderMap.get(projectKey(first));
    const secondPosition = orderMap.get(projectKey(second));
    if (firstPosition === undefined && secondPosition === undefined) return 0;
    if (firstPosition === undefined) return 1;
    if (secondPosition === undefined) return -1;
    return firstPosition - secondPosition;
  });
}

async function moveProject(project, direction) {
  const projects = getProjects();
  const currentIndex = projects.findIndex(item => projectKey(item) === projectKey(project));
  const targetIndex = currentIndex + direction;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= projects.length) return;

  [projects[currentIndex], projects[targetIndex]] = [projects[targetIndex], projects[currentIndex]];
  await saveProjectOrder(projects);
}

async function saveProjectOrder(projects) {
  localStorage.setItem(PROJECT_ORDER_KEY, JSON.stringify(projects.map(projectKey)));
  renderProjects(projects);
  try {
    await Promise.all(projects
      .filter(item => item.id && firebaseProjectIds.has(item.id))
      .map(item => updateDoc(doc(db, PROJECTS_COLLECTION, item.id), {
        position: projects.findIndex(project => projectKey(project) === projectKey(item))
      })));
  } catch (error) {
    console.error('No se pudo guardar el orden en Firebase; se conserva localmente.', error);
    const errorCode = error.code ? ` (${error.code})` : '';
    updateFirebaseStatus(`Orden guardado localmente; Firebase rechazó la sincronización${errorCode}.`, 'error');
  }
}

function saveProjects(customProjects, removedProjects) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(customProjects));
    localStorage.setItem(REMOVED_PROJECTS_KEY, JSON.stringify(removedProjects));
    return true;
  } catch (error) {
    try {
      const lightweightProjects = customProjects.map(project => {
        if (typeof project.image !== 'string' || !project.image.startsWith('data:')) return project;
        const { image, ...projectWithoutImage } = project;
        return projectWithoutImage;
      });

      localStorage.setItem(PROJECTS_KEY, JSON.stringify(lightweightProjects));
      localStorage.setItem(REMOVED_PROJECTS_KEY, JSON.stringify(removedProjects));
      console.warn('Se guardaron los datos del proyecto sin la imagen en localStorage; la imagen completa permanece en Firebase.', error);
      return true;
    } catch (fallbackError) {
      console.error('No se pudo guardar el proyecto en localStorage.', fallbackError);
      return false;
    }
  }
}

async function syncBaseProjectsToFirebase() {
  const localProjects = readStorage(PROJECTS_KEY, [])
    .filter(project => !project.id?.startsWith('base-'));
  const syncedProjects = await Promise.all(localProjects.map(async project => {
    const { id, ...data } = project;
    if (id) {
      await setDoc(doc(db, PROJECTS_COLLECTION, id), data, { merge: true });
      firebaseProjectIds.add(id);
      return project;
    }
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), data);
    firebaseProjectIds.add(docRef.id);
    return { ...project, id: docRef.id };
  }));
  saveProjects(syncedProjects, readStorage(REMOVED_PROJECTS_KEY, []));
  renderProjects(syncedProjects);
}

function startEditingProject(project) {
  editingProjectId = project.id;
  editingProject = project;
  imageChangedWhileEditing = false;
  videoChangedWhileEditing = false;
  currentImageData = project.image || null;
  const imageInput = document.getElementById('image-input');

  document.getElementById('title').value = project.title || '';
  document.getElementById('category').value = project.category || '';
  document.getElementById('description').value = project.description || '';
  currentVideoData = project.video || null;
  document.getElementById('link').value = project.link || '';

  const previewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const dropZone = document.getElementById('drop-zone');
  if (currentImageData) {
    imagePreview.src = currentImageData;
    previewContainer.classList.remove('hidden');
    dropZone.classList.add('hidden');
  } else {
    imagePreview.src = '';
    imageInput.value = '';
    previewContainer.classList.add('hidden');
    dropZone.classList.remove('hidden');
  }

  const videoPreviewContainer = document.getElementById('video-preview-container');
  const videoPreview = document.getElementById('video-preview');
  const videoDropZone = document.getElementById('video-drop-zone');
  if (currentVideoData) {
    videoPreview.src = currentVideoData;
    videoPreviewContainer.classList.remove('hidden');
    videoDropZone.classList.add('hidden');
  } else {
    videoPreview.removeAttribute('src');
    videoPreview.load();
    videoPreviewContainer.classList.add('hidden');
    videoDropZone.classList.remove('hidden');
  }

  document.getElementById('form-kicker').textContent = 'Contenido existente';
  document.getElementById('form-title').textContent = 'Editar proyecto';
  document.getElementById('submit-project-btn').textContent = 'Guardar cambios';
  document.getElementById('cancel-edit-btn').classList.remove('hidden');
  document.getElementById('title').focus();
}

function resetEditingForm() {
  editingProjectId = null;
  editingProject = null;
  currentImageData = null;
  currentVideoData = null;
  imageChangedWhileEditing = false;
  videoChangedWhileEditing = false;
  document.getElementById('form-kicker').textContent = 'Nuevo contenido';
  document.getElementById('form-title').textContent = 'Subir proyecto';
  document.getElementById('submit-project-btn').textContent = 'Publicar Proyecto';
  document.getElementById('cancel-edit-btn').classList.add('hidden');
}

function compressImage(file, { targetWidth = 1440, targetHeight = 810, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    const mimeType = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const offsetX = (targetWidth - drawWidth) / 2;
        const offsetY = (targetHeight - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        const dataUrl = mimeType === 'image/png' || mimeType === 'image/webp'
          ? canvas.toDataURL(mimeType, quality)
          : canvas.toDataURL('image/jpeg', quality);

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('No se pudo procesar la imagen.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

function readVideo(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('video/')) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el video.'));
    reader.readAsDataURL(file);
  });
}

function renderProjects(projects = getProjects()) {
  const list = document.getElementById('projects-list');
  const count = document.getElementById('project-count');
  count.textContent = `${projects.length} ${projects.length === 1 ? 'proyecto' : 'proyectos'}`;
  list.innerHTML = '';

  if (!projects.length) {
    list.innerHTML = '<p class="empty-projects">Todavía no hay proyectos publicados.</p>';
    return;
  }

  projects.forEach(project => {
    const item = document.createElement('article');
    item.className = 'project-admin-card';
    item.draggable = true;
    item.dataset.projectKey = projectKey(project);
    item.addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', item.dataset.projectKey);
      event.dataTransfer.effectAllowed = 'move';
      item.classList.add('is-dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('is-dragging');
      list.querySelectorAll('.drop-before, .drop-after').forEach(card => {
        card.classList.remove('drop-before', 'drop-after');
      });
    });
    item.addEventListener('dragover', event => {
      event.preventDefault();
      const bounds = item.getBoundingClientRect();
      const isAfter = event.clientY > bounds.top + bounds.height / 2;
      item.classList.toggle('drop-before', !isAfter);
      item.classList.toggle('drop-after', isAfter);
    });
    item.addEventListener('dragleave', event => {
      if (!item.contains(event.relatedTarget)) {
        item.classList.remove('drop-before', 'drop-after');
      }
    });
    item.addEventListener('drop', async event => {
      event.preventDefault();
      const draggedKey = event.dataTransfer.getData('text/plain');
      const draggedIndex = projects.findIndex(candidate => projectKey(candidate) === draggedKey);
      const targetIndex = projects.findIndex(candidate => projectKey(candidate) === item.dataset.projectKey);
      if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) return;

      const bounds = item.getBoundingClientRect();
      const insertAfter = event.clientY > bounds.top + bounds.height / 2;
      const reorderedProjects = [...projects];
      const [draggedProject] = reorderedProjects.splice(draggedIndex, 1);
      let destinationIndex = targetIndex + (insertAfter ? 1 : 0);
      if (draggedIndex < destinationIndex) destinationIndex -= 1;
      reorderedProjects.splice(destinationIndex, 0, draggedProject);
      await saveProjectOrder(reorderedProjects);
    });

    const media = document.createElement('div');
    media.className = 'project-admin-media';

    if (project.video) {
      media.classList.add('is-video');
      const video = document.createElement('video');
      video.className = 'project-admin-video';
      video.src = project.video;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.autoplay = true;
      video.preload = 'metadata';
      video.addEventListener('canplay', () => {
        const startTime = Math.min(0.2, video.duration ? video.duration * 0.15 : 0.2);
        if (Number.isFinite(startTime)) {
          video.currentTime = startTime;
        }
        video.play().catch(() => {});
      });
      media.appendChild(video);
    } else if (project.image) {
      media.classList.add('project-admin-image');
      media.style.backgroundImage = `url("${project.image}")`;
    }

    const details = document.createElement('div');
    details.className = 'project-admin-details';
    details.innerHTML = `<strong>${project.title}</strong><span>${categoryNames[project.category] || project.category}</span>`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', async () => {
      if (!window.confirm(`¿Querés eliminar “${project.title}”?`)) return;

      try {
        if (project.id) {
          await deleteDoc(doc(db, PROJECTS_COLLECTION, project.id));
          firebaseProjectIds.delete(project.id);
        }
      } catch (error) {
        console.error('No se pudo eliminar el proyecto desde Firestore.', error);
        const errorCode = error.code ? ` (${error.code})` : '';
        updateFirebaseStatus(`No se pudo eliminar el proyecto de Firebase${errorCode}.`, 'error');
        alert('No se pudo eliminar el proyecto de Firebase. Revisá la conexión y los permisos, e intentá nuevamente.');
        return;
      }

      const customProjects = readStorage(PROJECTS_KEY, []).filter(item => item.id !== project.id);
      const removedProjects = readStorage(REMOVED_PROJECTS_KEY, []);
      if (project.base && !removedProjects.includes(project.title)) removedProjects.push(project.title);
      saveProjects(customProjects, removedProjects);
      renderProjects();
    });

    const actions = document.createElement('div');
    actions.className = 'project-admin-actions';

    const moveUpButton = document.createElement('button');
    moveUpButton.type = 'button';
    moveUpButton.className = 'btn-order';
    moveUpButton.textContent = '↑';
    moveUpButton.title = 'Mover hacia arriba';
    moveUpButton.setAttribute('aria-label', `Mover ${project.title} hacia arriba`);
    moveUpButton.disabled = projects.indexOf(project) === 0;
    moveUpButton.addEventListener('click', () => moveProject(project, -1));

    const moveDownButton = document.createElement('button');
    moveDownButton.type = 'button';
    moveDownButton.className = 'btn-order';
    moveDownButton.textContent = '↓';
    moveDownButton.title = 'Mover hacia abajo';
    moveDownButton.setAttribute('aria-label', `Mover ${project.title} hacia abajo`);
    moveDownButton.disabled = projects.indexOf(project) === projects.length - 1;
    moveDownButton.addEventListener('click', () => moveProject(project, 1));

    actions.append(moveUpButton, moveDownButton);

    if (project.id) {
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn-edit';
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => startEditingProject(project));
      actions.appendChild(editButton);
    }

    actions.appendChild(deleteButton);
    item.append(media, details, actions);
    list.appendChild(item);
  });
}

function formatLeadDate(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

function renderLeads(leads = []) {
  const list = document.getElementById('leads-list');
  const count = document.getElementById('lead-count');
  if (!list || !count) return;

  count.textContent = `${leads.length} ${leads.length === 1 ? 'contacto' : 'contactos'}`;
  list.innerHTML = '';

  if (!leads.length) {
    list.innerHTML = '<p class="empty-leads">Todavía no hay consultas recibidas.</p>';
    return;
  }

  const methodNames = { email: 'Email', whatsapp: 'WhatsApp', instagram: 'Instagram' };
  leads.forEach(lead => {
    const card = document.createElement('article');
    card.className = 'lead-admin-card';

    const name = document.createElement('strong');
    name.textContent = lead.name || 'Sin nombre';

    const plan = document.createElement('p');
    plan.className = 'lead-plan';
    plan.textContent = `${lead.plan || 'Plan no indicado'}${lead.currency ? ` · ${lead.currency} ${lead.price || ''}` : ''}`;

    const contact = document.createElement('p');
    contact.textContent = `${methodNames[lead.method] || 'Contacto'}: ${lead.contact || 'Sin dato'}`;

    const meta = document.createElement('span');
    meta.className = 'lead-admin-meta';
    meta.textContent = formatLeadDate(lead.createdAt);

    const actions = document.createElement('div');
    actions.className = 'lead-admin-actions';
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'lead-delete';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', async () => {
      if (!window.confirm('¿Querés eliminar este contacto?')) return;
      try {
        await deleteDoc(doc(db, LEADS_COLLECTION, lead.id));
      } catch (error) {
        console.error('No se pudo eliminar el contacto:', error);
      }
    });
    actions.appendChild(deleteButton);

    card.append(name, plan, contact, meta, actions);
    list.appendChild(card);
  });
}

function listenToFirebaseLeads() {
  const q = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));
  onSnapshot(q, snapshot => {
    const leads = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    renderLeads(leads);
  }, error => {
    console.error('No se pudieron cargar los contactos:', error);
    renderLeads([]);
  });
}

function listenToFirebaseProjects() {
  const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snapshot) => {
    updateFirebaseStatus('Firebase conectado', 'connected');
    firebaseProjectIds.clear();
    snapshot.docs.forEach(docSnap => firebaseProjectIds.add(docSnap.id));
    const firebaseProjects = snapshot.docs.filter(docSnap => !docSnap.id.startsWith('base-')).map(docSnap => ({
      ...docSnap.data(),
      ...pendingProjectUpdates.get(docSnap.id),
      id: docSnap.id,
      createdAt: docSnap.data().createdAt?.toDate ? docSnap.data().createdAt.toDate().toISOString() : (docSnap.data().createdAt || new Date().toISOString())
    }));

    const localProjects = readStorage(PROJECTS_KEY, []).filter(project => !project.id?.startsWith('base-'));
    const mergedByKey = new Map();
    [...localProjects, ...firebaseProjects].forEach(project => {
      const key = project.title?.trim().toLowerCase() || project.id;
      mergedByKey.set(key, project);
    });
    const mergedProjects = [...mergedByKey.values()];
    saveProjects(mergedProjects, readStorage(REMOVED_PROJECTS_KEY, []));
    renderProjects(sortProjects(mergedProjects));
  }, (error) => {
    console.warn('Firestore no disponible en esta sesión, usando localStorage.', error);
    const errorCode = error.code ? ` (${error.code})` : '';
    updateFirebaseStatus(`Firebase no disponible${errorCode}: usando almacenamiento local`, 'error');
    renderProjects();
  });
}

function initializeAdmin() {
  const form = document.getElementById('project-form');
  const imageInput = document.getElementById('image-input');
  const dropZone = document.getElementById('drop-zone');
  const previewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const removeImgBtn = document.getElementById('remove-img-btn');
  const videoInput = document.getElementById('video-input');
  const videoDropZone = document.getElementById('video-drop-zone');
  const videoPreviewContainer = document.getElementById('video-preview-container');
  const videoPreview = document.getElementById('video-preview');
  const removeVideoBtn = document.getElementById('remove-video-btn');
  const syncBaseProjectsButton = document.getElementById('sync-base-projects-btn');

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    try {
      const compressedImage = await compressImage(file);
      if (!compressedImage) return;

      currentImageData = compressedImage;
      if (editingProjectId) imageChangedWhileEditing = true;
      imagePreview.src = currentImageData;
      previewContainer.classList.remove('hidden');
      dropZone.classList.add('hidden');
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert('No se pudo procesar la imagen. Probá con otra fotografía.');
    }
  };

  ['dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, event => event.preventDefault());
  });
  dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'));
  });
  dropZone.addEventListener('drop', event => handleImageFile(event.dataTransfer.files[0]));
  imageInput.addEventListener('change', event => handleImageFile(event.target.files[0]));

  removeImgBtn.addEventListener('click', () => {
    currentImageData = null;
    if (editingProjectId) imageChangedWhileEditing = true;
    imageInput.value = '';
    imagePreview.src = '';
    previewContainer.classList.add('hidden');
    dropZone.classList.remove('hidden');
  });

  const handleVideoFile = async (file) => {
    if (!file || !file.type.startsWith('video/')) return;

    try {
      currentVideoData = await readVideo(file);
      if (editingProjectId) videoChangedWhileEditing = true;
      videoPreview.src = currentVideoData;
      videoPreviewContainer.classList.remove('hidden');
      videoDropZone.classList.add('hidden');
    } catch (error) {
      console.error('Error al procesar el video:', error);
      alert('No se pudo procesar el video. Probá con otro archivo.');
    }
  };

  ['dragover', 'dragleave', 'drop'].forEach(eventName => {
    videoDropZone.addEventListener(eventName, event => event.preventDefault());
  });
  videoDropZone.addEventListener('dragover', () => videoDropZone.classList.add('dragover'));
  ['dragleave', 'drop'].forEach(eventName => {
    videoDropZone.addEventListener(eventName, () => videoDropZone.classList.remove('dragover'));
  });
  videoDropZone.addEventListener('drop', event => handleVideoFile(event.dataTransfer.files[0]));
  videoInput.addEventListener('change', event => handleVideoFile(event.target.files[0]));

  removeVideoBtn.addEventListener('click', () => {
    currentVideoData = null;
    if (editingProjectId) videoChangedWhileEditing = true;
    videoInput.value = '';
    videoPreview.removeAttribute('src');
    videoPreview.load();
    videoPreviewContainer.classList.add('hidden');
    videoDropZone.classList.remove('hidden');
  });

  document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    form.reset();
    removeImgBtn.click();
    removeVideoBtn.click();
    resetEditingForm();
  });

  syncBaseProjectsButton.addEventListener('click', async () => {
    syncBaseProjectsButton.disabled = true;
    syncBaseProjectsButton.textContent = 'Subiendo proyectos...';

    try {
      await syncBaseProjectsToFirebase();
      alert('¡Los proyectos base se subieron correctamente a Firebase!');
    } catch (error) {
      console.error('No se pudieron subir los proyectos base a Firebase.', error);
      alert('No se pudieron subir los proyectos. Revisá la conexión e intentá nuevamente.');
    } finally {
      syncBaseProjectsButton.disabled = false;
      syncBaseProjectsButton.textContent = 'Sincronizar mis proyectos con Firebase'; // No change needed
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const projectFields = {
      title: document.getElementById('title').value.trim(),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value.trim(),
      link: document.getElementById('link').value.trim()
    };

    const customProjects = readStorage(PROJECTS_KEY, []);
    const isEditing = Boolean(editingProjectId);
    const id = editingProjectId || `custom-${Date.now()}`;
    const newProject = {
      ...projectFields,
      image: currentImageData || '',
      video: currentVideoData || '',
      createdAt: new Date().toISOString(),
      position: getProjects().length
    };
    const editUpdates = {
      ...projectFields,
      ...(imageChangedWhileEditing ? { image: currentImageData || '' } : {}),
      ...(videoChangedWhileEditing ? { video: currentVideoData || '' } : {})
    };
    let savedLocallyOnly = false;

    if (isEditing) {
      const updatedLocalProjects = customProjects.map(item => item.id === id
        ? { ...item, ...editUpdates, id }
        : item);
      if (!saveProjects(updatedLocalProjects, readStorage(REMOVED_PROJECTS_KEY, []))) {
        alert('El archivo supera el límite de almacenamiento. Probá subir un video más pequeño o con menos resolución.');
        return;
      }

      pendingProjectUpdates.set(id, editUpdates);
      renderProjects();
      try {
        await updateDoc(doc(db, PROJECTS_COLLECTION, id), editUpdates);
        pendingProjectUpdates.delete(id);
      } catch (error) {
        pendingProjectUpdates.delete(id);
        console.error('No se pudieron sincronizar los cambios con Firebase.', error);
        updateFirebaseStatus('Cambios guardados localmente; no se pudieron sincronizar con Firebase.', 'error');
        savedLocallyOnly = true;
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
          ...newProject,
          createdAt: serverTimestamp(),
          id
        });
        firebaseProjectIds.add(docRef.id);
        const updatedLocalProjects = [
          ...customProjects.filter(item => item.title?.trim().toLowerCase() !== newProject.title.toLowerCase()),
          { ...newProject, id: docRef.id }
        ];

        const saved = saveProjects(updatedLocalProjects, readStorage(REMOVED_PROJECTS_KEY, []));
        if (!saved) {
          alert('El archivo supera el límite de almacenamiento. Probá subir un video más pequeño o con menos resolución.');
          return;
        }
      } catch (error) {
        console.warn('No se pudo guardar en Firestore, se usa almacenamiento local.', error);
        savedLocallyOnly = true;
        const updatedLocalProjects = [
          ...customProjects.filter(item => item.title?.trim().toLowerCase() !== newProject.title.toLowerCase()),
          { ...newProject, id }
        ];
        const saved = saveProjects(updatedLocalProjects, readStorage(REMOVED_PROJECTS_KEY, []));
        if (!saved) {
          alert('El archivo supera el límite de almacenamiento. Probá subir un video más pequeño o con menos resolución.');
          return;
        }
      }
    }

    renderProjects();
    alert(savedLocallyOnly
      ? 'Los cambios se guardaron en este navegador, pero no se pudieron sincronizar con Firebase.'
      : isEditing ? '¡Proyecto actualizado exitosamente!' : '¡Proyecto cargado exitosamente!');
    form.reset();
    removeImgBtn.click();
    removeVideoBtn.click();
    resetEditingForm();
  });

  listenToFirebaseProjects();
  listenToFirebaseLeads();
  renderProjects();
}

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const logoutButton = document.getElementById('logout-btn');

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginError.textContent = '';
  const submitButton = loginForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Ingresando...';

  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById('login-email').value.trim(),
      document.getElementById('login-password').value
    );
  } catch (error) {
    loginError.textContent = getAuthErrorMessage(error);
    submitButton.disabled = false;
    submitButton.textContent = 'Iniciar sesión';
  }
});

logoutButton.addEventListener('click', () => signOut(auth));

let adminInitialized = false;
onAuthStateChanged(auth, user => {
  if (user) {
    loginScreen.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    if (!adminInitialized) {
      adminInitialized = true;
      initializeAdmin();
    }
    return;
  }

  adminPanel.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginForm.reset();
  loginError.textContent = '';
});