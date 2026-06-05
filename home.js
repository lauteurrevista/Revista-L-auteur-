/* ============================================================
   L'AUTEUR — Revista Literaria Digital
   Archivo: js/home.js
   Descripción: Lógica de la página principal.
   Lee editions.json y construye la sección hero y las tarjetas.
   ============================================================ */

/* ─────────────────────────────────────────────
   INICIALIZACIÓN
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  // Aplicar configuración global
  aplicarConfig();

  // Cargar ediciones desde JSON
  const data = await cargarEdiciones();
  if (!data) return;

  const { ediciones, revista } = data;

  // Actualizar estadísticas del hero
  actualizarStats(ediciones);

  // Renderizar la edición destacada (más reciente)
  const destacada = ediciones[ediciones.length - 1];
  renderizarDestacada(destacada);

  // Renderizar las últimas N ediciones en la sección recientes
  const recientes = ediciones
    .slice()               // Copiar array
    .reverse()             // Más reciente primero
    .slice(1, LAUTEUR_CONFIG.edicionesEnHome + 1); // Saltar la destacada

  renderizarRecientes(recientes);

  // Inicializar animaciones de entrada
  initAnimaciones();

  // Actualizar texto del botón "Leer última edición"
  const btnLatest = document.getElementById('btn-ultima-edicion');
  if (btnLatest && destacada) {
    btnLatest.href = `visor.html?id=${destacada.id}`;
  }
});

/* ─────────────────────────────────────────────
   CARGAR EDICIONES DESDE JSON
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
   APLICAR CONFIGURACIÓN GLOBAL
   Actualiza textos del sitio desde config.js
   ───────────────────────────────────────────── */
function aplicarConfig() {
  // Nombre de la revista en el hero (si existe)
  const heroEyebrow = document.querySelector('.hero-eyebrow-text');
  if (heroEyebrow) heroEyebrow.textContent = LAUTEUR_CONFIG.textos.heroEyebrow;

  // Descripción del manifiesto
  const aboutText = document.getElementById('about-manifiesto');
  if (aboutText) aboutText.innerHTML = LAUTEUR_CONFIG.manifiesto;

  // Cita
  const citaEl = document.getElementById('about-cita');
  if (citaEl) citaEl.textContent = LAUTEUR_CONFIG.cita;

  const citaAutor = document.getElementById('about-cita-autor');
  if (citaAutor) citaAutor.textContent = LAUTEUR_CONFIG.citaAutor;
}

/* ─────────────────────────────────────────────
   ACTUALIZAR ESTADÍSTICAS DEL HERO
   ───────────────────────────────────────────── */
function actualizarStats(ediciones) {
  const statEdiciones = document.getElementById('stat-ediciones');
  if (statEdiciones) statEdiciones.textContent = ediciones.length;
}

/* ─────────────────────────────────────────────
   RENDERIZAR EDICIÓN DESTACADA (Hero)
   ───────────────────────────────────────────── */
function renderizarDestacada(ed) {
  if (!ed) return;

  // Portada del hero
  const heroImg = document.getElementById('hero-cover-img');
  if (heroImg) {
    heroImg.src = ed.portada;
    heroImg.alt = `Portada ${ed.numero} — ${ed.titulo}`;
  }

  // Datos de la featured card
  const featNumero = document.getElementById('feat-numero');
  const featTitulo = document.getElementById('feat-titulo');
  const featDesc   = document.getElementById('feat-descripcion');
  const featFecha  = document.getElementById('feat-fecha');
  const featPags   = document.getElementById('feat-paginas');
  const featCover  = document.getElementById('feat-cover');
  const featBtn    = document.getElementById('feat-btn');

  if (featNumero)  featNumero.textContent  = ed.numero;
  if (featTitulo)  featTitulo.textContent  = ed.titulo;
  if (featDesc)    featDesc.textContent    = ed.descripcion;
  if (featFecha)   featFecha.textContent   = ed.fecha;
  if (featPags)    featPags.textContent    = `${ed.paginas} páginas`;

  if (featCover) {
    featCover.src = ed.portada;
    featCover.alt = `Portada ${ed.numero}`;
  }

  if (featBtn) {
    featBtn.href = `visor.html?id=${ed.id}`;
  }
}

/* ─────────────────────────────────────────────
   RENDERIZAR TARJETAS DE EDICIONES RECIENTES
   ───────────────────────────────────────────── */
function renderizarRecientes(ediciones) {
  const grid = document.getElementById('recientes-grid');
  if (!grid) return;

  grid.innerHTML = ''; // Limpiar

  ediciones.forEach(ed => {
    const card = crearTarjeta(ed);
    grid.appendChild(card);
  });
}

/* ─────────────────────────────────────────────
   CREAR TARJETA HTML DE UNA EDICIÓN
   ───────────────────────────────────────────── */
function crearTarjeta(ed) {
  const article = document.createElement('article');
  article.className = 'edition-card fade-in';
  article.setAttribute('role', 'article');

  article.innerHTML = `
    <div class="edition-card-cover">
      <img
        src="${ed.portada}"
        alt="Portada ${ed.numero} — ${ed.titulo}"
        loading="lazy"
        onerror="this.src='assets/images/cover-placeholder.svg'"
      />
      <div class="edition-card-overlay">
        <button
          class="edition-card-read-btn"
          onclick="window.location.href='visor.html?id=${ed.id}'"
          aria-label="Leer ${ed.titulo}"
        >
          Leer edición
        </button>
      </div>
    </div>
    <div class="edition-card-info">
      <p class="edition-card-numero">${ed.numero}</p>
      <h3 class="edition-card-titulo">${ed.titulo}</h3>
      <p class="edition-card-fecha">${ed.fecha}</p>
    </div>
  `;

  // Hacer la tarjeta completa clickeable
  article.addEventListener('click', () => {
    window.location.href = `visor.html?id=${ed.id}`;
  });

  return article;
}

/* ─────────────────────────────────────────────
   ANIMACIONES DE ENTRADA (Intersection Observer)
   Los elementos con clase .fade-in aparecen al
   entrar en el viewport.
   ───────────────────────────────────────────── */
function initAnimaciones() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observar todos los elementos con .fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}
