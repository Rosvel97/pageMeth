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

// “Carrito” mínimo: solo contador
const bagCount = document.getElementById('bagCount');
document.querySelectorAll('.addCart').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = parseInt(bagCount.textContent || '0', 10);
    bagCount.textContent = current + 1;
    btn.textContent = 'Agregado ✓';
    setTimeout(() => (btn.textContent = 'Agregar'), 1000);
  });
});

// Newsletter “fake”
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

  // --- Modal Sirenglow (láminas web) ---
(() => {
  const btnOpen = document.getElementById('openInfo');
  const modal = document.getElementById('infoModal');
  const sheets = [...document.querySelectorAll('.sheet')];
  const prev = document.getElementById('sheetPrev');
  const next = document.getElementById('sheetNext');
  const tabsWrap = document.getElementById('sheetTabs');

  let index = 0, startX = 0;

  const render = () => {
    sheets.forEach((s,i)=> s.classList.toggle('is-active', i===index));
    [...tabsWrap.children].forEach((b,i)=> b.classList.toggle('is-active', i===index));
  };

  const open = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    render();
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  };
  const go = (d) => { index = (index + d + sheets.length) % sheets.length; render(); };

  // Construir tabs desde los data-title
  sheets.forEach((s,i)=>{
    const b=document.createElement('button');
    b.textContent = s.dataset.title || `Sección ${i+1}`;
    b.addEventListener('click', ()=>{ index=i; render(); });
    tabsWrap.appendChild(b);
  });

  btnOpen?.addEventListener('click', open);
  modal?.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close-modal')) close(); });
// backdrop o botón con data-close-modal
modal?.addEventListener('click', (e)=>{
  if(e.target.dataset.closeModal !== undefined) close();
});

document.querySelectorAll('[data-close-modal]').forEach(el=>{
  el.addEventListener('click', close);
});

  prev?.addEventListener('click', ()=>go(-1));
  next?.addEventListener('click', ()=>go(1));

  // Teclado
  window.addEventListener('keydown', (e)=>{
    if(!modal.classList.contains('is-open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') go(-1);
    if(e.key==='ArrowRight') go(1);
  });

  // Swipe en móvil
  const stage = document.getElementById('sheets');
  stage.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  stage.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx)>40) go(dx>0?-1:1);
  }, {passive:true});
})();

// --- close helpers ---
const modal = document.getElementById('infoModal');
const closeModal = () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
};

// cierra al hacer click en el fondo o en cualquier elemento con data-close-modal
modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal__backdrop')) return closeModal();
  if (e.target.closest('[data-close-modal]')) return closeModal();
});

// fallback directo por si algo elimina la delegación
document.querySelectorAll('[data-close-modal]').forEach(el =>
  el.addEventListener('click', closeModal)
);


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

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('heroTrack');
  const slides = Array.from(track.children);
  const prevBtn = document.querySelector('.hero-nav--prev');
  const nextBtn = document.querySelector('.hero-nav--next');
  const dotsWrap = document.getElementById('heroDots');

  let index = 0;
  let autoTimer;
  let startX = 0;

  // Dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('is-active', i === index));
  };

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    update();
    restartAuto();
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Auto-advance (5s)
  const startAuto = () => { autoTimer = setInterval(next, 5000); };
  const stopAuto = () => { clearInterval(autoTimer); };
  const restartAuto = () => { stopAuto(); startAuto(); };

  // Eventos
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Swipe móvil
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAuto(); }, { passive:true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    restartAuto();
  }, { passive:true });

  // Inicializar
  update();
  startAuto();
});

document.addEventListener("click", (e) => {
  // Abrir
  if (e.target.matches("[data-open]")) {
    const id = e.target.getAttribute("data-open");
    const modal = document.getElementById(id);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // Cerrar
  if (e.target.matches("[data-close], [data-close] *")) {
    const modal = e.target.closest(".modal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
});
