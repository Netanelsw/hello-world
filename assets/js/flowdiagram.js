/* ============================================================
   KIBEERI — ARCHITECTURE FLOW DIAGRAM ANIMATION
   Requires: GSAP + ScrollTrigger (loaded globally)
   Uses SVG stroke-dashoffset path draw technique
   ============================================================ */

function initFlowDiagram() {
  var diagram = document.querySelector('#arch-diagram');
  if (!diagram) return;

  var connectors = diagram.querySelectorAll('.arch-connector');
  var boxes      = diagram.querySelectorAll('.arch-node');
  var labels     = diagram.querySelectorAll('.arch-text, .arch-sub-text');

  // Set dasharray = dashoffset = total length for each connector
  connectors.forEach(function(path) {
    var length = path.getTotalLength ? path.getTotalLength() : 200;
    path.style.strokeDasharray  = length;
    path.style.strokeDashoffset = length;
  });

  // Initial state: nodes hidden
  gsap.set(boxes, { opacity: 0, scale: 0.9, transformOrigin: 'center center' });
  gsap.set(labels, { opacity: 0 });

  ScrollTrigger.create({
    trigger: '#what-we-built',
    start: 'top 65%',
    once: true,
    onEnter: function() {
      var tl = gsap.timeline();

      // 1. Reveal boxes in sequence
      tl.to(boxes, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.2)',
        stagger: 0.12
      });

      // 2. Draw connectors
      tl.to(connectors, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.1
      }, '-=0.2');

      // 3. Reveal labels
      tl.to(labels, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05
      }, '-=0.3');
    }
  });
}

window.Kibeeri = window.Kibeeri || {};
window.Kibeeri.initFlowDiagram = initFlowDiagram;
