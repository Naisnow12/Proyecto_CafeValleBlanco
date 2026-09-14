/* =============================================
   VALLE BLANCO — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar Scroll Effect --- */
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* --- Hamburger Menu --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Reveal on Scroll (Intersection Observer) --- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --- Parallax Effect on Origen Background --- */
  const origenBg = document.querySelector('.origen-bg');
  if (origenBg) {
    window.addEventListener('scroll', () => {
      const section = origenBg.closest('.origen');
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.3;
        const yPos = -(rect.top * speed);
        origenBg.style.transform = `translateY(${yPos}px)`;
      }
    });
  }

  /* --- Active Nav Link Highlight --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav);

  /* --- Contact Form Demo --- */
  const form = document.getElementById('contactForm');
  const successMsg = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
      }

      form.reset();
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    });
  }

  /* --- Footer Year --- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  //Parte de Procesos Diri

  const procesoSection = document.querySelector('.proceso');
  const progressBar = document.getElementById('procesoProgressBar');
  const etapaActualEl = document.getElementById('etapaActual');
  const etapas = document.querySelectorAll('.etapa[data-etapa]');

  if (!procesoSection || !progressBar || !etapas.length) return;

  const totalEtapas = etapas.length;
  let currentEtapa = 1;

  const updateProgress = () => {
    const rect = procesoSection.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Progreso según scroll dentro de la sección
    const sectionTop = -rect.top;
    const sectionHeight = procesoSection.offsetHeight - windowH;
    let progress = sectionTop / sectionHeight;
    progress = Math.max(0, Math.min(1, progress));

    progressBar.style.width = (progress * 100) + '%';

    // Etapa actual = la que está más cerca del centro de la pantalla
    const centerY = windowH / 2;
    let closestEtapa = 1;
    let closestDist = Infinity;
    etapas.forEach(etapa => {
      const r = etapa.getBoundingClientRect();
      const etapaCenter = r.top + r.height / 2;
      const dist = Math.abs(etapaCenter - centerY);
      if (dist < closestDist) {
        closestDist = dist;
        closestEtapa = parseInt(etapa.dataset.etapa, 10);
      }
    });

    if (closestEtapa !== currentEtapa && etapaActualEl) {
      currentEtapa = closestEtapa;
      etapaActualEl.textContent = currentEtapa;
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
});
