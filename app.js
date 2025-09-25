// Utilidades simples para la demo

// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil (muestra/oculta los links cuando no caben)
const openMenu = document.getElementById('openMenu');
const menu = document.getElementById('menu');
openMenu?.addEventListener('click', () => {
  const shown = menu.style.display === 'flex';
  menu.style.display = shown ? 'none' : 'flex';
  if (!shown) menu.style.flexDirection = 'column';
});

// "Carrito" mínimo: solo contador
const bagCount = document.getElementById('bagCount');
document.querySelectorAll('.addCart').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = parseInt(bagCount.textContent || '0', 10);
    bagCount.textContent = current + 1;
    btn.textContent = 'Agregado ✓';
    setTimeout(() => (btn.textContent = 'Agregar'), 1000);
  });
});

// Newsletter "fake"
const form = document.getElementById('newsletterForm');
const newsMsg = document.getElementById('newsMsg');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  if (!email) return;
  newsMsg.textContent = `¡Gracias! Te escribiremos a ${email}.`;
  form.reset();
});

// Pequeña animación al entrar en viewport
const reveal = (el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(10px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
};

const show = (el) => {
  el.style.opacity = 1;
  el.style.transform = 'none';
};

document.querySelectorAll('.card, .split__grid, .botanical, .features__grid')
  .forEach(el => reveal(el));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) show(e.target); });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .split__grid, .botanical, .features__grid')
  .forEach(el => io.observe(el));

// Scroll animado a secciones
document.querySelectorAll('a.scroll-to').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Carrusel Hero
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('heroTrack');
  if (!track) return; // Si no hay carrusel, salimos y no rompemos el resto

  const slides = Array.from(track.children);
  const prevBtn = document.querySelector('.hero-nav--prev');
  const nextBtn = document.querySelector('.hero-nav--next');
  const dotsWrap = document.getElementById('heroDots');

  let index = 0;
  let autoTimer;
  let startX = 0;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('is-active', i === index));
  };

  const goTo = (i) => { index = (i + slides.length) % slides.length; update(); restartAuto(); };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const startAuto = () => { autoTimer = setInterval(next, 5000); };
  const stopAuto = () => { clearInterval(autoTimer); };
  const restartAuto = () => { stopAuto(); startAuto(); };

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAuto(); }, { passive:true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    restartAuto();
  }, { passive:true });

  update();
  startAuto();
});

// ===== SISTEMA DE MODALES UNIFICADO =====

// Función para abrir modal
function openModal(modal) {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  initSheetsNavigation(modal);
}

// Función para cerrar modal
function closeModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Event listener principal para abrir/cerrar modales
document.addEventListener('click', (e) => {
  // Abrir modal
  const openBtn = e.target.closest('[data-open]');
  if (openBtn) {
    const modalId = openBtn.getAttribute('data-open');
    const modal = document.getElementById(modalId);
    if (modal) {
      openModal(modal);
    }
    return;
  }

  // Cerrar modal (backdrop o botón de cerrar)
  const closeBtn = e.target.closest('[data-close-modal]');
  if (closeBtn) {
    const modal = closeBtn.closest('.modal');
    if (modal) {
      closeModal(modal);
    }
    return;
  }

  // Cerrar modal al hacer clic en el backdrop
  if (e.target.classList.contains('modal__backdrop')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      closeModal(modal);
    }
  }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal.is-open');
    if (openModal) {
      closeModal(openModal);
    }
  }
});

// Función para inicializar la navegación de sheets en cada modal
function initSheetsNavigation(modal) {
  // Evitar inicializar dos veces el mismo modal
  if (modal.dataset.inited === '1') return;
  modal.dataset.inited = '1';

  const sheets = Array.from(modal.querySelectorAll('.sheet'));
  if (!sheets.length) return;

  const tabsWrap = modal.querySelector('.tabs');
  const prevBtn = modal.querySelector('.modal__nav--prev');
  const nextBtn = modal.querySelector('.modal__nav--next');
  const stage = modal.querySelector('.modal__stage');

  let index = sheets.findIndex(s => s.classList.contains('is-active'));
  if (index < 0) index = 0;

  // Construir tabs
  if (tabsWrap) {
    tabsWrap.innerHTML = '';
    sheets.forEach((sheet, i) => {
      const button = document.createElement('button');
      button.textContent = sheet.dataset.title || `Sección ${i + 1}`;
      button.addEventListener('click', () => {
        index = i;
        render();
      });
      tabsWrap.appendChild(button);
    });
  }

  // Función para actualizar la vista
  function render() {
    sheets.forEach((sheet, i) => {
      sheet.classList.toggle('is-active', i === index);
    });
    if (tabsWrap) {
      [...tabsWrap.children].forEach((tab, i) => {
        tab.classList.toggle('is-active', i === index);
      });
    }
  }

  // Función para navegar
  function navigate(delta) {
    index = (index + delta + sheets.length) % sheets.length;
    render();
  }

  // Event listeners para navegación
  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigate(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigate(1));
  }

  // Navegación con teclado (solo cuando el modal está abierto)
  const handleKeyDown = (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  };

  document.addEventListener('keydown', handleKeyDown);

  // Swipe en móvil
  let startX = 0;
  if (stage) {
    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // mínimo 50px de swipe
        if (diff > 0) {
          navigate(1); // swipe left = siguiente
        } else {
          navigate(-1); // swipe right = anterior
        }
      }
    }, { passive: true });
  }

  // Renderizar estado inicial
  render();
}