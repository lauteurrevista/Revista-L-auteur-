/* ============================================================
   L'AUTEUR — Revista Literaria Digital
   Archivo: js/nav.js
   Descripción: Lógica compartida por todas las páginas.
   - Header con sombra al hacer scroll
   - Modo oscuro / claro (toggle + preferencia del sistema)
   - Menú móvil
   - Marcar enlace activo en la navegación
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initMobileMenu();
  initActiveNav();
});

/* ─────────────────────────────────────────────
   TEMA (MODO OSCURO / CLARO)
   La preferencia se guarda en localStorage para
   que persista entre páginas y visitas.
   ───────────────────────────────────────────── */
function initTheme() {
  // Leer preferencia guardada, o usar la del sistema
  const guardado    = localStorage.getItem('lauteur-theme');
  const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const temaInicial = guardado || (prefiereOscuro ? 'dark' : 'light');

  aplicarTema(temaInicial);

  // Botón de toggle
  const toggleBtn = document.querySelector('.theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const actual = document.documentElement.getAttribute('data-theme');
      aplicarTema(actual === 'dark' ? 'light' : 'dark');
    });
  }

  // Escuchar cambios del sistema
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      // Solo cambiar si el usuario no tiene preferencia guardada
      if (!localStorage.getItem('lauteur-theme')) {
        aplicarTema(e.matches ? 'dark' : 'light');
      }
    });
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  localStorage.setItem('lauteur-theme', tema);
}

/* ─────────────────────────────────────────────
   HEADER: SOMBRA AL HACER SCROLL
   ───────────────────────────────────────────── */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Verificar estado inicial
}

/* ─────────────────────────────────────────────
   MENÚ MÓVIL
   ───────────────────────────────────────────── */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', !isOpen);

    // Animar las líneas del hamburguesa
    const lineas = menuToggle.querySelectorAll('span');
    if (!isOpen) {
      lineas[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      lineas[1].style.opacity   = '0';
      lineas[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      lineas[0].style.transform = '';
      lineas[1].style.opacity   = '';
      lineas[2].style.transform = '';
    }
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      const lineas = menuToggle.querySelectorAll('span');
      lineas.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
    }
  });
}

/* ─────────────────────────────────────────────
   MARCAR ENLACE ACTIVO EN EL NAV
   ───────────────────────────────────────────── */
function initActiveNav() {
  const pagina = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.header-nav a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === pagina || (pagina === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
