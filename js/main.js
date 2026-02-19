/* ============================================================
   KIBEERI – MAIN.JS
   Global Performance Commerce Infrastructure Platform
   ============================================================ */

(function () {
  'use strict';

  /* === NAVIGATION === */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* === ACTIVE NAV LINK === */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* === SCROLL REVEAL === */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* === ANIMATED COUNTERS === */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el, target, duration, prefix, suffix, decimals) {
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = eased * target;
      const display = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
      el.textContent = prefix + (typeof display === 'number' ? display.toLocaleString() : display) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target || '0');
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration || '2000', 10);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        animateCounter(el, target, duration, prefix, suffix, decimals);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  /* === MARKET CARD ACCORDION === */
  document.querySelectorAll('.market-card').forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.market-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });
  });

  /* === SMOOTH SCROLL (anchor links) === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* === CONTACT FORM === */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Request Sent';
        btn.style.background = 'var(--accent-green)';

        const existingMsg = contactForm.querySelector('.form-success');
        if (!existingMsg) {
          const msg = document.createElement('div');
          msg.className = 'highlight-box highlight-box--green form-success';
          msg.style.marginTop = '16px';
          msg.style.fontSize = '14px';
          msg.style.color = 'var(--accent-green)';
          msg.style.fontWeight = '500';
          msg.textContent = 'Thank you. A member of our partnerships team will respond within 48 hours.';
          contactForm.appendChild(msg);
        }
      }, 1400);
    });
  }

  /* === WORLD MAP PIN STAGGER === */
  const pins = document.querySelectorAll('.market-pin');
  pins.forEach((pin, i) => {
    pin.style.animationDelay = `${i * 0.15}s`;
  });

})();
