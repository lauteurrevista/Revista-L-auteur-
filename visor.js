/* ============================================================
   L'AUTEUR — Revista Literaria Digital
   Archivo: js/visor.js
   Descripción: Visor de PDF usando Mozilla PDF.js.
   Renderiza cada página del PDF en canvas con navegación,
   zoom, y soporte completo para móviles.
   ============================================================ */

/* ─────────────────────────────────────────────
   CONFIGURACIÓN DEL VISOR
   ───────────────────────────────────────────── */
const VISOR_CONFIG = {
  // Worker de PDF.js (CDN)
  workerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  // Escala inicial de renderizado
  escalaInicial: 1.4,
  // Pasos de zoom
  pasoZoom: 0.2,
  // Escala mínima y máxima
  escalaMin: 0.5,
  escalaMax: 3.0,
  // Margen entre páginas (px)
  margenPaginas: 16,
};

/* ─────────────────────────────────────────────
   ESTADO DEL VISOR
   ───────────────────────────────────────────── */
const estado = {
  pdf: null,          // Documento PDF cargado
  escala: VISOR_CONFIG.escalaInicial,
  paginaActual: 1,
  totalPaginas: 0,
  renderizando: false,
  pdfUrl: '',
  edicionData: null,
};

/* ─────────────────────────────────────────────
   ELEMENTOS DEL DOM
   ───────────────────────────────────────────── */
const dom = {
  loading:       document.getElementById('visor-loading'),
  error:         document.getElementById('visor-error'),
  canvasWrapper: document.getElementById('visor-canvas-wrapper'),
  pageIndicator: document.getElementById('page-indicator'),
  pageInput:     document.getElementById('page-input'),
  totalPages:    document.getElementById('total-pages'),
  btnPrev:       document.getElementById('btn-prev'),
  btnNext:       document.getElementById('btn-next'),
  btnZoomIn:     document.getElementById('btn-zoom-in'),
  btnZoomOut:    document.getElementById('btn-zoom-out'),
  zoomLevel:     document.getElementById('zoom-level'),
  btnDownload:   document.getElementById('btn-download'),
  visorTitle:    document.getElementById('visor-title'),
  visorEdition:  document.getElementById('visor-edition'),
};

/* ─────────────────────────────────────────────
   INICIALIZACIÓN
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {

  // Configurar PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = VISOR_CONFIG.workerSrc;

  // Obtener el ID de la edición desde la URL (?id=3)
  const params = new URLSearchParams(window.location.search);
  const edicionId = parseInt(params.get('id'));

  if (!edicionId) {
    mostrarError('No se especificó una edición.', 'Regresa a la biblioteca y selecciona una edición.');
    return;
  }

  // Cargar datos de la edición desde JSON
  const edicion = await obtenerEdicion(edicionId);
  if (!edicion) {
    mostrarError('Edición no encontrada.', `No existe la edición con ID ${edicionId}.`);
    return;
  }

  estado.edicionData = edicion;

  // Actualizar información en la barra superior
  actualizarInfoVisor(edicion);

  // Inicializar controles
  initControles();

  // Cargar el PDF
  await cargarPDF(edicion.pdf);
});

/* ─────────────────────────────────────────────
   OBTENER DATOS DE LA EDICIÓN
   ───────────────────────────────────────────── */
async function obtenerEdicion(id) {
  try {
    const response = await fetch('data/editions.json');
    const data = await response.json();
    return data.ediciones.find(ed => ed.id === id) || null;
  } catch (error) {
    console.error('Error cargando ediciones:', error);
    return null;
  }
}

/* ─────────────────────────────────────────────
   ACTUALIZAR INFORMACIÓN EN EL HEADER DEL VISOR
   ───────────────────────────────────────────── */
function actualizarInfoVisor(edicion) {
  if (dom.visorTitle)   dom.visorTitle.textContent   = edicion.titulo;
  if (dom.visorEdition) dom.visorEdition.textContent = edicion.numero;

  // Configurar botón de descarga
  if (dom.btnDownload) {
    dom.btnDownload.href     = edicion.pdf;
    dom.btnDownload.download = `lauteur-${edicion.id}-${edicion.titulo.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  }

  // Título de la pestaña del navegador
  document.title = `${edicion.numero} — ${edicion.titulo} | L'Auteur`;
}

/* ─────────────────────────────────────────────
   CARGAR EL PDF
   ───────────────────────────────────────────── */
async function cargarPDF(url) {
  estado.pdfUrl = url;
  mostrarLoading(true);

  try {
    const loadingTask = pdfjsLib.getDocument({
      url: url,
      // Mejora rendimiento con PDFs grandes
      disableRange: false,
      disableStream: false,
    });

    // Actualizar progreso de carga
    loadingTask.onProgress = (progress) => {
      if (progress.total > 0) {
        const porcentaje = Math.round((progress.loaded / progress.total) * 100);
        const loadingDetail = document.getElementById('loading-detail');
        if (loadingDetail) loadingDetail.textContent = `${porcentaje}%`;
      }
    };

    estado.pdf = await loadingTask.promise;
    estado.totalPaginas = estado.pdf.numPages;

    // Actualizar indicadores
    actualizarIndicadorPagina();

    mostrarLoading(false);

    // Renderizar todas las páginas
    await renderizarTodasLasPaginas();

  } catch (error) {
    console.error('Error cargando PDF:', error);
    mostrarLoading(false);

    // Mostrar mensaje informativo si el PDF no existe (modo demo)
    mostrarErrorPDF(url);
  }
}

/* ─────────────────────────────────────────────
   RENDERIZAR TODAS LAS PÁGINAS
   Para una experiencia de scroll continuo (mejor en móvil)
   ───────────────────────────────────────────── */
async function renderizarTodasLasPaginas() {
  if (!estado.pdf || !dom.canvasWrapper) return;

  dom.canvasWrapper.innerHTML = ''; // Limpiar

  for (let numPagina = 1; numPagina <= estado.totalPaginas; numPagina++) {
    const pagina = await estado.pdf.getPage(numPagina);
    const viewport = pagina.getViewport({ scale: estado.escala });

    // Contenedor de la página
    const pageContainer = document.createElement('div');
    pageContainer.className = 'pdf-page-container';
    pageContainer.id = `page-${numPagina}`;
    pageContainer.style.width  = `${viewport.width}px`;
    pageContainer.style.height = `${viewport.height}px`;

    // Canvas de renderizado
    const canvas = document.createElement('canvas');
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    canvas.style.display = 'block';

    // Número de página
    const pageNumEl = document.createElement('div');
    pageNumEl.className = 'pdf-page-number';
    pageNumEl.textContent = numPagina;

    pageContainer.appendChild(canvas);
    pageContainer.appendChild(pageNumEl);
    dom.canvasWrapper.appendChild(pageContainer);

    // Renderizar en el canvas
    const ctx = canvas.getContext('2d');
    await pagina.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;
  }

  // Inicializar observer para página actual
  initScrollObserver();
}

/* ─────────────────────────────────────────────
   OBSERVER PARA PÁGINA ACTUAL (al hacer scroll)
   ───────────────────────────────────────────── */
function initScrollObserver() {
  if (!dom.canvasWrapper) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Extraer número de página del ID del elemento
        const id = entry.target.id;
        if (id && id.startsWith('page-')) {
          const num = parseInt(id.replace('page-', ''));
          if (!isNaN(num)) {
            estado.paginaActual = num;
            actualizarIndicadorPagina();
          }
        }
      }
    });
  }, {
    root: dom.canvasWrapper,
    threshold: 0.4,
  });

  document.querySelectorAll('.pdf-page-container').forEach(el => {
    observer.observe(el);
  });
}

/* ─────────────────────────────────────────────
   NAVEGAR A UNA PÁGINA ESPECÍFICA
   ───────────────────────────────────────────── */
function irAPagina(numero) {
  const num = Math.max(1, Math.min(numero, estado.totalPaginas));
  estado.paginaActual = num;

  const pageEl = document.getElementById(`page-${num}`);
  if (pageEl && dom.canvasWrapper) {
    pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  actualizarIndicadorPagina();
}

/* ─────────────────────────────────────────────
   ACTUALIZAR INDICADOR DE PÁGINA
   ───────────────────────────────────────────── */
function actualizarIndicadorPagina() {
  if (dom.pageInput)  dom.pageInput.value = estado.paginaActual;
  if (dom.totalPages) dom.totalPages.textContent = estado.totalPaginas;

  // Estado de los botones prev/next
  if (dom.btnPrev) dom.btnPrev.disabled = estado.paginaActual <= 1;
  if (dom.btnNext) dom.btnNext.disabled = estado.paginaActual >= estado.totalPaginas;
}

/* ─────────────────────────────────────────────
   CONTROLES DE ZOOM
   ───────────────────────────────────────────── */
async function cambiarZoom(nuevaEscala) {
  const escala = Math.max(
    VISOR_CONFIG.escalaMin,
    Math.min(VISOR_CONFIG.escalaMax, nuevaEscala)
  );

  if (escala === estado.escala) return;

  const paginaAntes = estado.paginaActual;
  estado.escala = escala;

  // Actualizar indicador de zoom
  if (dom.zoomLevel) {
    dom.zoomLevel.textContent = `${Math.round(escala * 100)}%`;
  }

  // Re-renderizar con la nueva escala
  await renderizarTodasLasPaginas();

  // Volver a la misma página que estábamos
  irAPagina(paginaAntes);
}

/* ─────────────────────────────────────────────
   INICIALIZAR CONTROLES (eventos de botones)
   ───────────────────────────────────────────── */
function initControles() {
  // Botones de navegación
  if (dom.btnPrev) {
    dom.btnPrev.addEventListener('click', () => {
      irAPagina(estado.paginaActual - 1);
    });
  }

  if (dom.btnNext) {
    dom.btnNext.addEventListener('click', () => {
      irAPagina(estado.paginaActual + 1);
    });
  }

  // Input de número de página
  if (dom.pageInput) {
    dom.pageInput.addEventListener('change', (e) => {
      const num = parseInt(e.target.value);
      if (!isNaN(num)) irAPagina(num);
    });

    dom.pageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const num = parseInt(e.target.value);
        if (!isNaN(num)) irAPagina(num);
        dom.pageInput.blur();
      }
    });
  }

  // Botones de zoom
  if (dom.btnZoomIn) {
    dom.btnZoomIn.addEventListener('click', () => {
      cambiarZoom(estado.escala + VISOR_CONFIG.pasoZoom);
    });
  }

  if (dom.btnZoomOut) {
    dom.btnZoomOut.addEventListener('click', () => {
      cambiarZoom(estado.escala - VISOR_CONFIG.pasoZoom);
    });
  }

  // Zoom con rueda del ratón (Ctrl + scroll)
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -VISOR_CONFIG.pasoZoom : VISOR_CONFIG.pasoZoom;
      cambiarZoom(estado.escala + delta);
    }
  }, { passive: false });

  // Atajos de teclado
  document.addEventListener('keydown', (e) => {
    // No activar si el usuario está escribiendo
    if (e.target.tagName === 'INPUT') return;

    switch(e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        irAPagina(estado.paginaActual + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        irAPagina(estado.paginaActual - 1);
        break;
      case '+':
      case '=':
        cambiarZoom(estado.escala + VISOR_CONFIG.pasoZoom);
        break;
      case '-':
        cambiarZoom(estado.escala - VISOR_CONFIG.pasoZoom);
        break;
      case 'Home':
        e.preventDefault();
        irAPagina(1);
        break;
      case 'End':
        e.preventDefault();
        irAPagina(estado.totalPaginas);
        break;
    }
  });
}

/* ─────────────────────────────────────────────
   ESTADOS DE UI: CARGA Y ERROR
   ───────────────────────────────────────────── */
function mostrarLoading(visible) {
  if (dom.loading) {
    dom.loading.style.display = visible ? 'flex' : 'none';
  }
}

function mostrarError(titulo, mensaje) {
  if (dom.loading) dom.loading.style.display = 'none';
  if (dom.error) {
    dom.error.style.display = 'flex';
    const h3 = dom.error.querySelector('h3');
    const p  = dom.error.querySelector('p');
    if (h3) h3.textContent = titulo;
    if (p)  p.textContent  = mensaje;
  }
}

/* Error específico cuando el PDF no existe (modo demo) */
function mostrarErrorPDF(url) {
  if (dom.loading) dom.loading.style.display = 'none';
  if (dom.canvasWrapper) {
    dom.canvasWrapper.innerHTML = `
      <div class="visor-demo-notice">
        <h3>PDF no encontrado</h3>
        <p>
          El visor está funcionando correctamente, pero no encontró el archivo PDF en:
        </p>
        <p><code>${url}</code></p>
        <p>
          Para publicar esta edición, sube el PDF a la carpeta 
          <code>assets/pdfs/</code> con ese nombre exacto.
          Consulta la guía de administración para más detalles.
        </p>
      </div>
    `;
  }

  // Deshabilitar controles de navegación
  if (dom.btnPrev) dom.btnPrev.disabled = true;
  if (dom.btnNext) dom.btnNext.disabled = true;
  if (dom.btnZoomIn)  dom.btnZoomIn.disabled  = true;
  if (dom.btnZoomOut) dom.btnZoomOut.disabled = true;
}
