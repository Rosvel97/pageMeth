// Copiar cupón
const copy = document.getElementById('copyCode');
copy?.addEventListener('click', e => {
  e.preventDefault();
  navigator.clipboard.writeText('SALE10').then(() => {
    copy.textContent = '¡Copiado!';
    setTimeout(() => copy.textContent = 'SALE10', 1600);
  });
});

// Feedback al agregar producto
document.querySelectorAll('[data-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    const prev = btn.textContent;
    btn.textContent = 'Agregado ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 1200);
  });
});
