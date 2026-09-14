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
      hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('active') ? 'true' : 'false');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
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
  const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');

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


  /* --- Independent Gallery: filters + lightbox --- */
  const galleryCards = document.querySelectorAll('.gallery-card');
  const galleryFilters = document.querySelectorAll('.gallery-filter');
  const galleryLightbox = document.getElementById('galleryLightbox');

  if (galleryCards.length) {
    galleryFilters.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        galleryFilters.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        galleryCards.forEach(card => {
          const visible = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !visible);
        });
      });
    });

    if (galleryLightbox) {
      const lightboxImage = document.getElementById('galleryLightboxImage');
      const lightboxTitle = document.getElementById('galleryLightboxTitle');
      const lightboxText = document.getElementById('galleryLightboxText');
      const closeButton = galleryLightbox.querySelector('.gallery-lightbox-close');
      let lastFocusedCard = null;

      const closeLightbox = () => {
        galleryLightbox.classList.remove('open');
        galleryLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedCard) lastFocusedCard.focus();
      };

      galleryCards.forEach(card => {
        card.addEventListener('click', () => {
          lastFocusedCard = card;
          lightboxImage.src = card.dataset.src;
          lightboxImage.alt = card.querySelector('img')?.alt || '';
          lightboxTitle.textContent = card.dataset.title || '';
          lightboxText.textContent = card.dataset.text || '';
          galleryLightbox.classList.add('open');
          galleryLightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          closeButton.focus();
        });
      });

      closeButton.addEventListener('click', closeLightbox);
      galleryLightbox.addEventListener('click', event => {
        if (event.target === galleryLightbox) closeLightbox();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && galleryLightbox.classList.contains('open')) closeLightbox();
      });
    }
  }

  /* --- Footer Year --- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
