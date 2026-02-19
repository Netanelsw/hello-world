/* ============================================================
   KIBEERI — BEFORE / AFTER BAR CHART
   Requires: GSAP + ScrollTrigger (loaded globally)
   ============================================================ */

function initCharts() {
  var chart = document.querySelector('#case-study .chart');
  if (!chart) return;

  ScrollTrigger.create({
    trigger: chart,
    start: 'top 70%',
    once: true,
    onEnter: function() {
      var bars = chart.querySelectorAll('.bar-fill');
      gsap.to(bars, {
        scaleY: 1,
        duration: 1.1,
        ease: 'power3.out',
        stagger: { amount: 0.35, from: 'start' },
        transformOrigin: 'bottom center'
      });
    }
  });
}

window.Kibeeri = window.Kibeeri || {};
window.Kibeeri.initCharts = initCharts;
