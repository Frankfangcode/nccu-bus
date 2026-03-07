/* ═══════════════════════════════════════════════════════
   LearnPlay — script.js
   • Mobile nav toggle
   • Smooth anchor scroll + nav link close
   • Scroll-reveal (IntersectionObserver)
   • Progress bar animation on reveal
   • Counter animation for stats
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Mobile Nav ─────────────────────────────────── */
  const toggle   = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on any link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar')) {
      mobileMenu && mobileMenu.classList.remove('open');
      toggle && toggle.classList.remove('open');
      toggle && toggle.setAttribute('aria-expanded', 'false');
    }
  });


  /* ─── Smooth Scroll ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navHeight = document.querySelector('.navbar')?.offsetHeight ?? 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─── Scroll Reveal (IntersectionObserver) ───────── */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ─── Progress Bar Animation ─────────────────────── */
  const progressObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
          const target = bar.getAttribute('data-width');
          if (target) {
            // Small delay so the card reveal animation can play first
            setTimeout(() => {
              bar.style.width = target + '%';
            }, 250);
          }
        });

        progressObs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  // Observe containers that hold progress bars
  document.querySelectorAll(
    '.course-card, .progress-card, .progress-demo-grid'
  ).forEach(el => progressObs.observe(el));


  /* ─── Counter Animation (stats) ─────────────────── */
  function animateCounter(el, display) {
    // Just swap text for non-numeric displays; animate numeric ones
    const numMatch = display.match(/^[\d.]+/);
    if (!numMatch) {
      el.textContent = display;
      return;
    }

    const target   = parseFloat(numMatch[0]);
    const suffix   = display.slice(numMatch[0].length);
    const isFloat  = display.includes('.');
    const duration = 1200;
    const start    = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      if (isFloat) {
        el.textContent = value.toFixed(1) + suffix;
      } else if (target >= 1000) {
        // e.g. 500000 → "500K+"
        el.textContent = Math.round(value / 1000) + 'K' + suffix;
      } else {
        el.textContent = Math.round(value) + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = display; // snap to exact final value
    }

    requestAnimationFrame(step);
  }

  const statsObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.querySelectorAll('.stat-num[data-display]').forEach(el => {
          const display = el.getAttribute('data-display');
          if (display) animateCounter(el, display);
        });

        statsObs.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObs.observe(statsSection);


  /* ─── Navbar scroll shadow ───────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 10) {
        navbar.style.filter = 'drop-shadow(0 4px 12px rgba(79,70,229,0.15))';
      } else {
        navbar.style.filter = '';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ─── Button press ripple feedback ──────────────── */
  document.querySelectorAll('.clay-btn').forEach(btn => {
    btn.addEventListener('pointerdown', function () {
      this.style.transform = 'translateY(2px) scale(0.97)';
    });
    btn.addEventListener('pointerup', function () {
      this.style.transform = '';
    });
    btn.addEventListener('pointerleave', function () {
      this.style.transform = '';
    });
  });

})();
