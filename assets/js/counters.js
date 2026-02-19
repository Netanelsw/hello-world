/* ============================================================
   KIBEERI — ANIMATED COUNTERS
   Requires: GSAP + ScrollTrigger (loaded globally)
   ============================================================ */

function initCounters() {
  var elements = document.querySelectorAll('[data-counter]');
  if (!elements.length) return;

  elements.forEach(function(el) {
    var target   = parseFloat(el.dataset.counter) || 0;
    var prefix   = el.dataset.prefix   || '';
    var suffix   = el.dataset.suffix   || '';
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var duration = parseFloat(el.dataset.duration || '2');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function() {
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: duration,
          ease: 'power2.out',
          onUpdate: function() {
            var v = obj.val;
            var formatted = decimals > 0
              ? v.toFixed(decimals)
              : Math.round(v).toLocaleString();
            el.textContent = prefix + formatted + suffix;
          },
          onComplete: function() {
            // Final precise value
            el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
            // Pop effect
            el.classList.add('counter-updated');
            setTimeout(function() { el.classList.remove('counter-updated'); }, 500);
          }
        });
      }
    });
  });
}

window.Kibeeri = window.Kibeeri || {};
window.Kibeeri.initCounters = initCounters;
