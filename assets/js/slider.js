/* ============================================================
   KIBEERI — COMMISSION TIER SLIDER
   Requires: GSAP (loaded globally)
   ============================================================ */

var TIERS = [
  {
    label:   'Starter',
    volume:  '0 – 500 sales/mo',
    rate:    '12%',
    rev:     'Up to $6K/mo',
    barPct:  20,
    benefits: ['Standard placement', 'Comparison page inclusion', 'Monthly reporting']
  },
  {
    label:   'Growth',
    volume:  '500 – 2,000 sales/mo',
    rate:    '14%',
    rev:     '$6K – $28K/mo',
    barPct:  36,
    benefits: ['Priority placement', 'Dedicated comparison page', 'Bi-weekly reporting']
  },
  {
    label:   'Scale',
    volume:  '2,000 – 5,000 sales/mo',
    rate:    '16%',
    rev:     '$28K – $80K/mo',
    barPct:  54,
    benefits: ['Top 1–3 chart position', 'PPC amplification', 'Seasonal boost allocation']
  },
  {
    label:   'Enterprise',
    volume:  '5,000 – 20,000 sales/mo',
    rate:    '18%',
    rev:     '$80K – $360K/mo',
    barPct:  72,
    benefits: ['Algorithmic priority', 'Dedicated account manager', 'Weekly GMT reporting']
  },
  {
    label:   'Strategic',
    volume:  '20,000+ sales/mo',
    rate:    '20%',
    rev:     '$360K+/mo',
    barPct:  92,
    benefits: ['Maximum visibility', 'Custom campaign allocation', 'Real-time dashboards']
  }
];

function initSlider() {
  var slider   = document.getElementById('tier-slider');
  var rateEl   = document.getElementById('tier-rate');
  var volEl    = document.getElementById('tier-volume');
  var revEl    = document.getElementById('tier-revenue');
  var barsEl   = document.getElementById('tier-bars');
  var ticksEl  = document.getElementById('slider-ticks');

  if (!slider) return;

  // Build tick labels
  if (ticksEl) {
    ticksEl.innerHTML = TIERS.map(function(t) {
      return '<span class="slider-tick">' + t.label + '</span>';
    }).join('');
  }

  function renderBars(activeIdx) {
    if (!barsEl) return;
    barsEl.innerHTML = TIERS.map(function(t, i) {
      return [
        '<div class="tier-bar' + (i === activeIdx ? ' tier-bar--active' : '') + '">',
          '<div class="tier-bar__fill" style="height:' + t.barPct + '%"></div>',
          '<span class="tier-bar__name">' + t.label + '</span>',
        '</div>'
      ].join('');
    }).join('');

    // Animate bar fills
    var fills = barsEl.querySelectorAll('.tier-bar__fill');
    gsap.fromTo(fills,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.06,
        transformOrigin: 'bottom center'
      }
    );
  }

  function updateMetrics(idx) {
    var tier = TIERS[idx];

    // Update tick active state
    if (ticksEl) {
      ticksEl.querySelectorAll('.slider-tick').forEach(function(el, i) {
        el.classList.toggle('slider-tick--active', i === idx);
      });
    }

    // Update slider fill progress
    var pct = (idx / (TIERS.length - 1)) * 100;
    slider.style.setProperty('--slider-pct', pct + '%');

    // Update metric displays
    if (rateEl)  rateEl.textContent  = tier.rate;
    if (volEl)   volEl.textContent   = tier.volume;
    if (revEl)   revEl.textContent   = tier.rev;

    // Pop animation on metrics
    if (rateEl && volEl && revEl) {
      gsap.fromTo([rateEl, volEl, revEl],
        { scale: 1.12, color: 'var(--color-accent)' },
        { scale: 1, color: 'var(--color-accent)', duration: 0.35, ease: 'power2.out' }
      );
    }

    renderBars(idx);
  }

  slider.addEventListener('input', function() {
    updateMetrics(parseInt(this.value, 10));
  });

  // Initialize
  updateMetrics(parseInt(slider.value, 10));
}

window.Kibeeri = window.Kibeeri || {};
window.Kibeeri.initSlider = initSlider;
