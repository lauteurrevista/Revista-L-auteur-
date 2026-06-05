/* ============================================================
   L'AUTEUR — Revista Literaria Digital
   Archivo: js/config.js
   Descripción: Configuración global del sitio.

   ★ CÓMO PERSONALIZAR:
     Edita este archivo para cambiar el nombre de la revista,
     descripción, correo, redes sociales, etc.
     No necesitas tocar ningún otro archivo para esto.
   ============================================================ */

const LAUTEUR_CONFIG = {

  /* ── INFORMACIÓN BÁSICA ─────────────────────────────────── */
  nombre:    "L'Auteur",
  subtitulo: "Revista Literaria Digital Independiente",
  descripcion: "Un espacio dedicado a la literatura que trasciende fronteras. Cada edición es una conversación entre voces que exploran el lenguaje, la memoria y la condición humana.",

  /* ── CONTACTO Y REDES ───────────────────────────────────── */
  email:     "contacto@lauteur.com",
  instagram: "https://instagram.com/lauteur",
  twitter:   "https://twitter.com/lauteur",
  facebook:  "",  // Dejar vacío si no se usa

  /* ── URL BASE DEL SITIO ─────────────────────────────────── */
  /* Cambia esto por la URL de tu GitHub Pages cuando la tengas */
  baseUrl: "",

  /* ── NÚMERO DE EDICIONES A MOSTRAR EN HOME ──────────────── */
  edicionesEnHome: 3,

  /* ── TEXTOS DEL SITIO ───────────────────────────────────── */
  textos: {
    heroEyebrow:      "Revista Literaria Digital",
    heroCTA:          "Leer última edición",
    heroCTASecundario:"Ver biblioteca",
    seccionRecientes: "Ediciones anteriores",
    seccionAbout:     "Sobre la revista",
    bibliotecaTitulo: "Archivo completo",
    bibliotecaDesc:   "Todas las ediciones de L'Auteur, desde la primera hasta la más reciente.",
  },

  /* ── MANIFIESTO / TEXTO SOBRE LA REVISTA ───────────────── */
  manifiesto: `
    L'Auteur nació de la convicción de que la literatura 
    sigue siendo el territorio más honesto para explorar 
    la condición humana.
    <br><br>
    Publicamos narrativa, poesía, ensayo y traducción 
    de voces que tienen algo verdadero que decir, 
    sin importar su procedencia ni su trayectoria.
    <br><br>
    Cada edición es un objeto pensado para ser leído 
    despacio, subrayado, y vuelto a leer.
  `,

  /* ── CITA EDITORIAL ─────────────────────────────────────── */
  cita: "La literatura es la forma más lúcida de pensar el mundo.",
  citaAutor: "— Redacción L'Auteur",

};

/* No modifiques nada debajo de esta línea */
Object.freeze(LAUTEUR_CONFIG);
