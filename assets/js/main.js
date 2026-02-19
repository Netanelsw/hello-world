/* ============================================================
   KIBEERI — MAIN INIT
   Bootstraps all modules after GSAP is ready
   ============================================================ */

(function() {
  'use strict';

  // Register GSAP plugin
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */

  function initReveal() {
    var selectors = [
      '[data-reveal]',
      '[data-reveal-left]',
      '[data-reveal-right]',
      '[data-reveal-scale]',
      '[data-reveal-stagger]'
    ].join(',');

    var elements = document.querySelectorAll(selectors);
    if (!elements.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(function(el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     NAV SCROLL EFFECT
  ---------------------------------------------------------- */

  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 60) {
            nav.style.background = 'rgba(11, 14, 19, 0.98)';
          } else {
            nav.style.background = 'rgba(11, 14, 19, 0.85)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     ACCORDION — VALUE ENGINE
  ---------------------------------------------------------- */

  function initAccordion() {
    var layers = document.querySelectorAll('.layer');
    if (!layers.length) return;

    layers.forEach(function(layer) {
      var header = layer.querySelector('.layer__header');
      if (!header) return;

      header.addEventListener('click', function() {
        var isOpen = layer.getAttribute('aria-expanded') === 'true';

        // Close all
        layers.forEach(function(l) {
          l.setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked
        if (!isOpen) {
          layer.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Open first layer by default
    if (layers[0]) {
      layers[0].setAttribute('aria-expanded', 'true');
    }
  }

  /* ----------------------------------------------------------
     SMOOTH ANCHOR SCROLL
  ---------------------------------------------------------- */

  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ----------------------------------------------------------
     EXPORT PDF BUTTON
  ---------------------------------------------------------- */

  function initExport() {
    var btn = document.getElementById('export-pdf');
    if (!btn) return;
    btn.addEventListener('click', function() {
      window.print();
    });
  }

  /* ----------------------------------------------------------
     SLIDE MODE TOGGLE
  ---------------------------------------------------------- */

  function initSlideToggle() {
    var btn = document.getElementById('slide-mode-toggle');
    if (!btn) return;
    btn.addEventListener('click', function() {
      document.body.classList.toggle('slide-mode');
      btn.textContent = document.body.classList.contains('slide-mode')
        ? 'Exit Presentation'
        : 'Presentation Mode';
    });
  }

  /* ----------------------------------------------------------
     TIMELINE STEPS — ANIMATE ON SCROLL
  ---------------------------------------------------------- */

  function initTimeline() {
    var steps = document.querySelectorAll('.timeline-step');
    if (!steps.length) return;

    var section = document.getElementById('partnership');
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      once: true,
      onEnter: function() {
        gsap.to(steps, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          onStart: function() {
            steps.forEach(function(s) {
              gsap.set(s, { opacity: 0, y: 15 });
            });
          }
        });
        steps.forEach(function(s, i) {
          setTimeout(function() {
            s.classList.add('is-active');
          }, i * 200 + 300);
        });
      }
    });
  }

  /* ----------------------------------------------------------
     BOOT
  ---------------------------------------------------------- */

  function boot() {
    initReveal();
    initNav();
    initAccordion();
    initAnchorScroll();
    initExport();
    initSlideToggle();
    initTimeline();

    // Kibeeri modules
    var K = window.Kibeeri || {};
    if (typeof K.initCounters     === 'function') K.initCounters();
    if (typeof K.initCharts       === 'function') K.initCharts();
    if (typeof K.initSlider       === 'function') K.initSlider();
    if (typeof K.initMap          === 'function') K.initMap();
    if (typeof K.initFlowDiagram  === 'function') K.initFlowDiagram();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
