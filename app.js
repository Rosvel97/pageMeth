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
