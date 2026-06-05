/* ============================================================
   L'AUTEUR — Revista Literaria Digital
   Archivo: js/biblioteca.js
   Descripción: Genera automáticamente la galería de ediciones.
   Lee editions.json y construye todas las tarjetas.
   ============================================================ */

/* ─────────────────────────────────────────────
   ESTADO LOCAL
   ───────────────────────────────────────────── */
let todasLasEdiciones = []; // Almacena todas las ediciones cargadas
let filtroActual = '';      // Texto de búsqueda actual

/* ─────────────────────────────────────────────
   INICIALIZACIÓN
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  // Cargar todas las ediciones
  const data = await cargarEdiciones();
  if (!data) {
    mostrarError();
    return;
  }

  todasLasEdiciones = data.ediciones.slice().reverse(); // Más recientes primero

  // Actualizar contador de ediciones
  const countEl = document.getElementById('biblioteca-count');
  if (countEl) countEl.textContent = todasLasEdiciones.length;

  // Renderizar el grid completo
  renderizarGrid(todasLasEdiciones);

  // Inicializar búsqueda
  initBusqueda();

  // Animaciones de entrada
  initAnimaciones();
});

/* ─────────────────────────────────────────────
   CARGAR DATOS
   ───────────────────────────────────────────── */
async function cargarEdiciones() {
  try {
    const response = await fetch('data/editions.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error cargando ediciones:', error);
    return null;
  }
}

/* ─────────────────────────────────────────────
   RENDERIZAR GRID DE EDICIONES
   ───────────────────────────────────────────── */
function renderizarGrid(ediciones) {
  const grid = document.getElementById('ediciones-grid');
  if (!grid) return;

  grid.innerHTML = ''; // Limpiar contenido previo

  if (ediciones.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No se encontraron ediciones</h3>
        <p>Intenta con otro término de búsqueda.</p>
      </div>
    `;
    return;
  }

  ediciones.forEach(ed => {
    const card = crearBibCard(ed);
    grid.appendChild(card);
  });

  // Activar animaciones en las nuevas tarjetas
  initAnimaciones();
}

/* ─────────────────────────────────────────────
   CREAR TARJETA DE BIBLIOTECA (grande)
   ───────────────────────────────────────────── */
function crearBibCard(ed) {
  const article = document.createElement('article');
  article.className = 'bib-card fade-in';

  article.innerHTML = `
    <div class="bib-card-cover">
      <img
        src="${ed.portada}"
        alt="Portada ${ed.numero} — ${ed.titulo}"
        loading="lazy"
        onerror="this.src='assets/images/cover-placeholder.svg'"
      />
      <div class="bib-card-numero-badge">${ed.numero}</div>
      <div class="bib-card-overlay">
        <button
          class="bib-overlay-btn bib-overlay-btn-primary"
          onclick="abrirVisor(${ed.id}, event)"
          aria-label="Leer ${ed.titulo} en el visor"
        >
          Leer en visor
        </button>
        <a
          href="${ed.pdf}"
          download
          class="bib-overlay-btn bib-overlay-btn-secondary"
          onclick="event.stopPropagation()"
          aria-label="Descargar PDF de ${ed.titulo}"
        >
          Descargar PDF
        </a>
      </div>
    </div>
    <div class="bib-card-info">
      <h3 class="bib-card-titulo">${ed.titulo}</h3>
      <p class="bib-card-fecha">${ed.fecha} · ${ed.paginas} págs.</p>
    </div>
  `;

  // Click en la tarjeta abre el visor
  article.addEventListener('click', () => abrirVisor(ed.id));

  return article;
}

/* ─────────────────────────────────────────────
   ABRIR EL VISOR
   ───────────────────────────────────────────── */
function abrirVisor(id, event) {
  if (event) event.stopPropagation();
  window.location.href = `visor.html?id=${id}`;
}

/* ─────────────────────────────────────────────
   BÚSQUEDA EN TIEMPO REAL
   ───────────────────────────────────────────── */
function initBusqueda() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    filtroActual = e.target.value.toLowerCase().trim();
    filtrarEdiciones();
  });

  // Limpiar búsqueda con Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filtroActual = '';
      filtrarEdiciones();
    }
  });
}

/* ─────────────────────────────────────────────
   FILTRAR EDICIONES POR BÚSQUEDA
   Busca en: número, título, descripción, fecha, temas
   ───────────────────────────────────────────── */
function filtrarEdiciones() {
  if (!filtroActual) {
    renderizarGrid(todasLasEdiciones);
    return;
  }

  const filtradas = todasLasEdiciones.filter(ed => {
    const campos = [
      ed.numero,
      ed.titulo,
      ed.descripcion,
      ed.fecha,
      ...(ed.temas || [])
    ].join(' ').toLowerCase();

    return campos.includes(filtroActual);
  });

  renderizarGrid(filtradas);
}

/* ─────────────────────────────────────────────
   MOSTRAR ERROR DE CARGA
   ───────────────────────────────────────────── */
function mostrarError() {
  const grid = document.getElementById('ediciones-grid');
  if (!grid) return;

  grid.innerHTML = `
    <div class="empty-state">
      <h3>Error al cargar ediciones</h3>
      <p>No se pudo cargar el archivo de ediciones. Verifica que el archivo <code>data/editions.json</code> existe y es válido.</p>
    </div>
  `;
}

/* ─────────────────────────────────────────────
   ANIMACIONES DE ENTRADA
   ───────────────────────────────────────────── */
function initAnimaciones() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}
