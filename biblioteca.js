let todasLasEdiciones = [];
let filtroActual = '';

document.addEventListener('DOMContentLoaded', async () => {

  const data = await cargarEdiciones();
  if (!data) { mostrarError(); return; }

  todasLasEdiciones = data.ediciones.slice().reverse();

  const countEl = document.getElementById('biblioteca-count');
  if (countEl) countEl.textContent = todasLasEdiciones.length;

  renderizarGrid(todasLasEdiciones);
  initBusqueda();
});

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

function renderizarGrid(ediciones) {
  const grid = document.getElementById('ediciones-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (ediciones.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No se encontraron ediciones</h3>
        <p>Intenta con otro término de búsqueda.</p>
      </div>`;
    return;
  }

  ediciones.forEach((ed, i) => {
    const card = crearBibCard(ed);
    card.style.transitionDelay = `${i * 70}ms`;
    grid.appendChild(card);
    requestAnimationFrame(() => observarElemento(card));
  });
}

function crearBibCard(ed) {
  const article = document.createElement('article');
  article.className = 'bib-card fade-in';

  article.innerHTML = `
    <div class="bib-card-cover">
      <img src="${ed.portada}" alt="Portada ${ed.numero} — ${ed.titulo}" loading="lazy"
           onerror="this.src='assets/images/cover-placeholder.svg'" />
      <div class="bib-card-numero-badge">${ed.numero}</div>
      <div class="bib-card-overlay">
        <button class="bib-overlay-btn bib-overlay-btn-primary"
          onclick="abrirVisor(${ed.id}, event)"
          aria-label="Leer ${ed.titulo} en el visor">Leer en visor</button>
        <a href="${ed.pdf}" download
          class="bib-overlay-btn bib-overlay-btn-secondary"
          onclick="event.stopPropagation()"
          aria-label="Descargar PDF de ${ed.titulo}">Descargar PDF</a>
      </div>
    </div>
    <div class="bib-card-info">
      <h3 class="bib-card-titulo">${ed.titulo}</h3>
      <p class="bib-card-fecha">${ed.fecha} · ${ed.paginas} págs.</p>
    </div>
  `;

  article.addEventListener('click', () => abrirVisor(ed.id));
  return article;
}

function abrirVisor(id, event) {
  if (event) event.stopPropagation();
  window.location.href = `visor.html?id=${id}`;
}

function initBusqueda() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    filtroActual = e.target.value.toLowerCase().trim();
    filtrarEdiciones();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filtroActual = '';
      filtrarEdiciones();
    }
  });
}

function filtrarEdiciones() {
  if (!filtroActual) { renderizarGrid(todasLasEdiciones); return; }

  const filtradas = todasLasEdiciones.filter(ed => {
    return [ed.numero, ed.titulo, ed.descripcion, ed.fecha, ...(ed.temas || [])]
      .join(' ').toLowerCase().includes(filtroActual);
  });

  renderizarGrid(filtradas);
}

function mostrarError() {
  const grid = document.getElementById('ediciones-grid');
  if (grid) grid.innerHTML = `
    <div class="empty-state">
      <h3>Error al cargar ediciones</h3>
      <p>No se pudo cargar <code>data/editions.json</code>.</p>
    </div>`;
}

function observarElemento(el) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  observer.observe(el);
}
