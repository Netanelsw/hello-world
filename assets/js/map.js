/* ============================================================
   KIBEERI — WORLD MAP CONTROLLER
   Requires: GSAP + ScrollTrigger (loaded globally)
   ============================================================ */

var GEO_CONFIG = {
  tier1: ['US', 'GB', 'DE', 'CA', 'JP'],
  tier2: ['FR', 'ES', 'IT', 'AU', 'NL', 'SE']
};

function initMap() {
  var mapSvg = document.querySelector('#hero-map');
  if (!mapSvg) return;

  // Apply tier classes to geo dots and labels
  Object.keys(GEO_CONFIG).forEach(function(tier) {
    GEO_CONFIG[tier].forEach(function(code) {
      var dot   = mapSvg.querySelector('[data-geo="' + code + '"]');
      var label = mapSvg.querySelector('[data-geo-label="' + code + '"]');
      if (dot)   { dot.classList.add('geo-dot', 'geo--' + tier); }
      if (label) { label.classList.add('geo-label'); }
    });
  });

  // Trigger reveal on scroll
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 30%',
    once: true,
    onEnter: function() {
      revealMap(mapSvg);
    }
  });

  // Also trigger immediately if hero is already in view
  var heroRect = document.getElementById('hero');
  if (heroRect) {
    var rect = heroRect.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(function() { revealMap(mapSvg); }, 600);
    }
  }
}

function revealMap(mapSvg) {
  // Reveal continent background
  var continents = mapSvg.querySelectorAll('.continent');
  gsap.to(continents, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Stagger geo dots
  var dots = mapSvg.querySelectorAll('.geo-dot');
  gsap.to(dots, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.07,
    delay: 0.4
  });

  // Stagger geo labels
  var labels = mapSvg.querySelectorAll('.geo-label');
  gsap.to(labels, {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
    stagger: 0.07,
    delay: 0.6
  });
}

window.Kibeeri = window.Kibeeri || {};
window.Kibeeri.initMap = initMap;
