document.addEventListener('DOMContentLoaded', async () => {

  aplicarConfig();
  initAnimaciones();

  const data = await cargarEdiciones();
  if (!data) return;

  const { ediciones } = data;

  actualizarStats(ediciones);

  const destacada = ediciones[ediciones.length - 1];
  renderizarDestacada(destacada);

  const recientes = ediciones
    .slice()
    .reverse()
    .slice(1, LAUTEUR_CONFIG.edicionesEnHome + 1);

  renderizarRecientes(recientes);

  const btnLatest = document.getElementById('btn-ultima-edicion');
  if (btnLatest && destacada) {
    btnLatest.href = `visor.html?id=${destacada.id}`;
  }
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

function aplicarConfig() {
  const heroEyebrow = document.querySelector('.hero-eyebrow-text');
  if (heroEyebrow) heroEyebrow.textContent = LAUTEUR_CONFIG.textos.heroEyebrow;

  const aboutText = document.getElementById('about-manifiesto');
  if (aboutText) aboutText.innerHTML = LAUTEUR_CONFIG.manifiesto;

  const citaEl = document.getElementById('about-cita');
  if (citaEl) citaEl.textContent = LAUTEUR_CONFIG.cita;

  const citaAutor = document.getElementById('about-cita-autor');
  if (citaAutor) citaAutor.textContent = LAUTEUR_CONFIG.citaAutor;
}

function actualizarStats(ediciones) {
  const statEdiciones = document.getElementById('stat-ediciones');
  if (statEdiciones) statEdiciones.textContent = ediciones.length;
}

function renderizarDestacada(ed) {
  if (!ed) return;

  const heroImg = document.getElementById('hero-cover-img');
  if (heroImg) { heroImg.src = ed.portada; heroImg.alt = `${ed.numero} — ${ed.titulo}`; }

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('feat-numero',      ed.numero);
  set('feat-titulo',      ed.titulo);
  set('feat-descripcion', ed.descripcion);
  set('feat-fecha',       ed.fecha);
  set('feat-paginas',     `${ed.paginas} páginas`);

  const featCover = document.getElementById('feat-cover');
  if (featCover) { featCover.src = ed.portada; featCover.alt = `Portada ${ed.numero}`; }

  const featBtn = document.getElementById('feat-btn');
  if (featBtn) featBtn.href = `visor.html?id=${ed.id}`;

  const featCard = document.getElementById('featured-card');
  if (featCard) observarElemento(featCard);
}

function renderizarRecientes(ediciones) {
  const grid = document.getElementById('recientes-grid');
  if (!grid) return;
  grid.innerHTML = '';

  ediciones.forEach((ed, i) => {
    const card = crearTarjeta(ed);
    card.style.transitionDelay = `${i * 90}ms`;
