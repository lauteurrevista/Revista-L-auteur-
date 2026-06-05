// Configuración de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Obtener el ID de la edición desde la URL (ej: visor.html?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const editionId = urlParams.get('id') || '1';

  // Forzamos la ruta directa a tu PDF actual basándonos en tu estructura de archivos
  const pdfUrl = `assets/pdfs/edicion-01.pdf`;
  
  const titleElement = document.getElementById("magazine-title");
  titleElement.textContent = `L'Auteur — Edición Nº 0${editionId}`;

  try {
    // 2. Cargar el documento PDF usando PDF.js
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const totalPages = pdf.numPages;
    const flipbook = document.getElementById("flipbook");

    // 3. Renderizar cada página del PDF en un lienzo (canvas) dentro del flipbook
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      const pageDiv = document.createElement("div");
      pageDiv.className = "page";
      
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      // Ajustar resolución de renderizado
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      pageDiv.appendChild(canvas);
      flipbook.appendChild(pageDiv);

      await page.render({ canvasContext: context, viewport: viewport }).promise;
    }

    // 4. Inicializar la animación de Turn.js una vez cargadas las páginas
    $(flipbook).turn({
      width: 800,
      height: 550,
      autoCenter: true,
      duration: 1000, // Duración de la animación al pasar la hoja (1 segundo)
      acceleration: true,
      gradients: true,
      elevation: 50,
      when: {
        turned: function(event, page, view) {
          document.getElementById("page-number").textContent = `${page} / ${totalPages}`;
        }
      }
    });

    // 5. Configurar botones de navegación manual
    document.getElementById("prev-page-btn").addEventListener("click", () => {
      $(flipbook).turn("previous");
    });

    document.getElementById("next-page-btn").addEventListener("click", () => {
      $(flipbook).turn("next");
    });

  } catch (error) {
    console.error("Error al renderizar el PDF animado:", error);
    titleElement.textContent = "Error al cargar la edición animada";
  }
});
