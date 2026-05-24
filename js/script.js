/* ══════════════════════════════════════════
   ODONTOLOGIA KARINA — script.js
   Navbar · Scroll · Reveal · Counters
   Before/After · Video Modal · Carousel
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Referências ── */
  const nav    = document.getElementById('nav');
  const stBtn  = document.getElementById('stBtn');
  const hbg    = document.getElementById('hbg');
  const drawer = document.getElementById('drawer');

  /* ══════════════════════════════════════════
     NAVBAR SCROLL + BOTÃO VOLTAR AO TOPO
  ══════════════════════════════════════════ */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('sc', scrollY > 60);
    stBtn.classList.toggle('on', scrollY > 400);
  }, { passive: true });

  stBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ══════════════════════════════════════════
     MENU MOBILE
  ══════════════════════════════════════════ */
  hbg.addEventListener('click', () => {
    const open = hbg.classList.toggle('act');
    drawer.classList.toggle('op', open);
    hbg.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* Fecha ao clicar em qualquer link do drawer */
  drawer.querySelectorAll('.drawer-link').forEach(a =>
    a.addEventListener('click', () => {
      hbg.classList.remove('act');
      drawer.classList.remove('op');
      hbg.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    })
  );

  /* ══════════════════════════════════════════
     LINK ATIVO POR SCROLL (IntersectionObserver)
  ══════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-ul a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-ul a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));

  /* ══════════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ══════════════════════════════════════════
     REVEAL ON SCROLL
  ══════════════════════════════════════════ */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-r]').forEach(el => ro.observe(el));

  /* ══════════════════════════════════════════
     ANIMATED COUNTERS
  ══════════════════════════════════════════ */
  function animCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    let start    = null;

    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = prefix + Math.floor(p * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  }

  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-target]').forEach(el => {
        if (!el.dataset.animated) {
          el.dataset.animated = '1';
          animCount(el);
        }
      });
      co.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stats-strip, .hero-stats').forEach(s => co.observe(s));

  /* ══════════════════════════════════════════
     BEFORE / AFTER SLIDER
  ══════════════════════════════════════════ */
  document.querySelectorAll('.ba-container').forEach(c => {
    const slider = c.querySelector('.ba-slider');
    const after  = c.querySelector('.ba-after');
    let drag = false;

    const set = x => {
      const r = c.getBoundingClientRect();
      const p = Math.min(Math.max((x - r.left) / r.width, 0.02), 0.98);
      slider.style.left    = p * 100 + '%';
      after.style.clipPath = `inset(0 0 0 ${p * 100}%)`;
    };

    slider.addEventListener('mousedown',  ()  => { drag = true; });
    window.addEventListener('mouseup',    ()  => { drag = false; });
    window.addEventListener('mousemove',  e   => { if (drag) set(e.clientX); });
    slider.addEventListener('touchstart', ()  => { drag = true; }, { passive: true });
    window.addEventListener('touchend',   ()  => { drag = false; });
    window.addEventListener('touchmove',  e   => { if (drag) set(e.touches[0].clientX); }, { passive: false });
  });

  /* ══════════════════════════════════════════
     VIDEO MODAL
  ══════════════════════════════════════════ */
  const playBtn   = document.getElementById('playVideoBtn');
  const vmodal    = document.getElementById('videoModal');
  const closeVBtn = document.getElementById('closeVideoBtn');
  const vid       = document.getElementById('heroVideo');

  if (playBtn && vmodal) {
    const openModal  = () => {
      vmodal.classList.add('active');
      vmodal.setAttribute('aria-hidden', 'false');
      if (vid) vid.play();
    };
    const closeModal = () => {
      vmodal.classList.remove('active');
      if (vid) vid.pause();
    };

    playBtn.addEventListener('click',    openModal);
    closeVBtn.addEventListener('click',  closeModal);
    vmodal.addEventListener('click',     e => { if (e.target === vmodal) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && vmodal.classList.contains('active')) closeModal();
    });
  }

}); // end DOMContentLoaded

/* ══════════════════════════════════════════
   CAROUSEL DE RESULTADOS
══════════════════════════════════════════ */
(function () {
  const carousel = document.getElementById('resultsCarousel');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');

  if (!carousel || !prevBtn || !nextBtn) return;

  const slideWidth = 380 + 24; // largura do slide + gap

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
  });
})();