# L'Auteur — Revista Literaria Digital

Plataforma web para revista literaria digital independiente, publicada gratuitamente en GitHub Pages.

## Tecnologías

- HTML5, CSS3, JavaScript puro (sin frameworks)
- PDF.js (Mozilla) para el visor de revistas
- GitHub Pages para el alojamiento gratuito

## Estructura

```
lauteur/
├── index.html          → Página principal
├── biblioteca.html     → Archivo de ediciones
├── visor.html          → Visor de PDF
├── data/
│   └── editions.json   → ⭐ Base de datos de ediciones
├── assets/
│   ├── covers/         → Portadas (JPG/WebP)
│   ├── pdfs/           → Archivos PDF
│   └── images/         → Imágenes del sitio
├── css/                → Hojas de estilo
├── js/                 → JavaScript
└── docs/
    └── GUIA-ADMINISTRACION.md → Guía completa para editores
```

## Agregar una nueva edición

1. Sube la portada a `assets/covers/cover-XX.jpg`
2. Sube el PDF a `assets/pdfs/edicion-XX.pdf`
3. Edita `data/editions.json` y agrega el bloque de la nueva edición
4. Haz commit — el sitio se actualiza automáticamente

Consulta `docs/GUIA-ADMINISTRACION.md` para instrucciones detalladas.

## Licencia

Todos los derechos reservados © L'Auteur
