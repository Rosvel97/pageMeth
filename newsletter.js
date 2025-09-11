document.addEventListener('DOMContentLoaded', () => {
  emailjs.init({ publicKey: 'TU_PUBLIC_KEY' });

  const form = document.getElementById('newsForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const to = form.email.value;

    const vars = {
      to_email: to,
      subject: 'Bienvenido a Novacare',
      body_html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto">
          <div style="text-align:center;padding:24px 0">
            <img src="https://TU-DOMINIO/assets/logo-blanco.png" alt="Novacare" width="72" style="display:block;margin:auto">
          </div>
          <h2 style="color:#22334E;margin:0 0 10px">¡Bienvenido a Novacare!</h2>
          <p style="color:#333;margin:0 0 16px">Gracias por suscribirte. Te enviaremos novedades y promociones.</p>
          <a href="https://rosvel97.github.io/pageMeth/"
             style="display:inline-block;background:#9A66CC;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px">
             Ver productos
          </a>
        </div>`
    };

    try {
      await emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', vars);
      alert('¡Gracias! Revisa tu correo 😊');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      alert('Hubo un problema enviando el correo.');
    }
  });
});
