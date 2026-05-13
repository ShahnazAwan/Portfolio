/* ═══════════════════════════════════════════
   main.js — Portfolio Scripts
   Shahnaz Kulsoom
   ═══════════════════════════════════════════ */

'use strict';

/* ── EMAILJS INIT ── */
window.addEventListener('load', () => {
  if (window.emailjs) emailjs.init('3O3Zc7-zFkAMY-cZv');
});

/* ── NAVBAR SCROLL EFFECT ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'),
        entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in, .exp-item, .project-card').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 100;
  revealObserver.observe(el);
});

/* ── PROJECT CARD STAGGER ── */
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});

/* ── CONTACT FORM ── */
document.getElementById('send-btn').addEventListener('click', () => {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    alert('Please fill all fields!');
    return;
  }

  emailjs.send('service_lflga8i', 'template_d0gs36n', {
    from_name:  name,
    from_email: email,
    message,
    to_email:   'shahnaz.kulsoom19@gmail.com'
  })
  .then(() => {
    alert('Message sent successfully! ✅');
    document.getElementById('name').value    = '';
    document.getElementById('email').value   = '';
    document.getElementById('message').value = '';
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    alert('Something went wrong. Please try again.');
  });
});
