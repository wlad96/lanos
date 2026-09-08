(() => {
  'use strict';

  /* ---------- Page loader ---------- */
  const loader = document.querySelector('.page-loader');
  window.addEventListener('load', () => {
    // Long enough to let the logo fill-wipe finish and sit fully white for
    // a beat (the animation reaches full white at ~45% of its 2.2s cycle)
    // before the loader fades out, so the reveal is actually seen.
    setTimeout(() => loader && loader.classList.add('is-hidden'), 1000);
  });

  /* ---------- Header: scroll state + mobile nav ---------- */
  const header = document.querySelector('[data-header]');
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('header--scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav panels: drill-down with a "back" way out ----------
     .header__nav-panels holds a stack of full-size screens (main list, plus
     one per sub-menu/language) that slide left/right via .is-active/.is-back
     — see the CSS. openPanel('main') is also the reset used whenever the
     whole nav closes, so it always reopens fresh at the top level. */
  const panelsWrap = document.querySelector('[data-panels]');
  const panels = panelsWrap ? panelsWrap.querySelectorAll('.header__nav-panel') : [];
  const mainPanel = panelsWrap ? panelsWrap.querySelector('[data-panel="main"]') : null;

  const openPanel = (name) => {
    panels.forEach(p => {
      if (p === mainPanel) {
        p.classList.toggle('is-back', name !== 'main');
        p.classList.toggle('is-active', name === 'main');
      } else {
        p.classList.toggle('is-active', p.dataset.panel === name);
        p.classList.remove('is-back');
      }
    });
  };

  document.querySelectorAll('[data-panel-open]').forEach(btn => {
    btn.addEventListener('click', () => openPanel(btn.getAttribute('data-panel-open')));
  });
  document.querySelectorAll('[data-panel-back]').forEach(btn => {
    btn.addEventListener('click', () => openPanel('main'));
  });

  /* ---------- Header: scroll state + mobile nav open/close ---------- */
  const navClose = document.querySelector('[data-nav-close]');

  const setNavOpen = (open) => {
    nav.setAttribute('data-open', String(open));
    burger.setAttribute('aria-expanded', String(open));
    header && header.classList.toggle('header--nav-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) {
      // Let the close slide finish before snapping the panel stack back to
      // the top level, so a mid-drill-down close doesn't visibly reset.
      setTimeout(() => openPanel('main'), 500);
    }
  };

  if (burger && nav) {
    burger.addEventListener('click', () => {
      setNavOpen(nav.getAttribute('data-open') !== 'true');
    });
    navClose && navClose.addEventListener('click', () => setNavOpen(false));
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setNavOpen(false));
    });
  }

  /* ---------- Nav dropdowns: click accordion (desktop-only fallback) ----------
     The mobile breakpoint now drives Registration/Career via the panel
     system above; this just keeps aria-expanded in sync for anyone
     tabbing through the desktop hover flyout. */
  document.querySelectorAll('.header__nav-item--dropdown').forEach(item => {
    const trigger = item.querySelector('.header__nav-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.header__nav-item--dropdown.is-open').forEach(open => {
        if (open !== item) {
          open.classList.remove('is-open');
          open.querySelector('.header__nav-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Language switcher ----------
     Two instances live in the DOM (desktop header dropdown + the mobile
     nav's own "lang" panel), so picking a language in either one has to
     update every [data-lang-current] label and every menu's aria-selected. */
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      document.querySelectorAll('[data-lang-current]').forEach(el => { el.textContent = lang; });
      document.querySelectorAll('[data-lang]').forEach(b => {
        b.closest('li').setAttribute('aria-selected', String(b.getAttribute('data-lang') === lang));
      });
      // Picking a language inside the mobile "lang" panel reads as done —
      // step back to the main list instead of leaving it stranded there.
      if (btn.closest('.header__nav-panel')) openPanel('main');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Facilities: hover-driven category switcher ----------
     Each category's `links` columns are plain [{ label, href }] arrays so
     this block can later be swapped for a CMS feed (e.g. two columns of
     related-page links per technology) without touching the render logic. */
  const FACILITIES_DATA = {
    checks: {
      image: 'assets/img/checks.png',
      alt: 'Finished, quality-checked Lanos steel components',
      desc: 'Every component passes strict quality assurance before it leaves our yard, verified against international maritime standards:',
      links: [
        [{ label: 'Dimensional inspection', href: '#products' }, { label: 'Material certification', href: '#products' }],
        [{ label: 'Non-destructive testing', href: '#products' }, { label: 'Visual inspection', href: '#products' }],
      ],
      btn: { label: 'Explore quality control', href: '#products' },
    },
    cutting: {
      image: 'assets/img/сutting.png',
      alt: 'CNC laser cutting process at Lanos production facility',
      desc: 'Our company was founded back in 1954, a time where dramatic shipwrecks and accidents resulting in loss of life:',
      links: [
        [{ label: 'Cutting with scissors', href: '#products' }, { label: 'CNC Laser cutting', href: '#products' }],
        [{ label: 'Sawing', href: '#products' }, { label: 'Water jet cutting', href: '#products' }],
      ],
      btn: { label: 'Explore products', href: '#products' },
    },
    mechanical: {
      image: 'assets/img/mechanical-processing.png',
      alt: 'Precision-machined locking mechanisms on a Lanos steel door',
      desc: 'Precision machining keeps every moving part reliable in the harshest marine conditions:',
      links: [
        [{ label: 'CNC milling', href: '#products' }, { label: 'Turning', href: '#products' }],
        [{ label: 'Drilling', href: '#products' }, { label: 'Grinding', href: '#products' }],
      ],
      btn: { label: 'Explore machining', href: '#products' },
    },
    plastic: {
      image: 'assets/img/plastic-deformation.png',
      alt: 'Large steel plate assembly formed for a marine structure',
      desc: 'Steel plates are shaped without losing strength, using controlled forming methods:',
      links: [
        [{ label: 'Press bending', href: '#products' }, { label: 'Roll forming', href: '#products' }],
        [{ label: 'Stamping', href: '#products' }, { label: 'Forging', href: '#products' }],
      ],
      btn: { label: 'Explore forming', href: '#products' },
    },
    surface: {
      image: 'assets/img/surface-treatment.png',
      alt: 'Painted and coated marine door hardware',
      desc: 'Coatings and finishing protect every surface against salt water and years at sea:',
      links: [
        [{ label: 'Sandblasting', href: '#products' }, { label: 'Hot-dip galvanizing', href: '#products' }],
        [{ label: 'Powder coating', href: '#products' }, { label: 'Marine painting', href: '#products' }],
      ],
      btn: { label: 'Explore coatings', href: '#products' },
    },
    welding: {
      image: 'assets/img/welding.png',
      alt: 'Certified welder joining a steel structure at Lanos',
      desc: 'Certified welders join every seam to withstand extreme loads and pressure:',
      links: [
        [{ label: 'MIG welding', href: '#products' }, { label: 'TIG welding', href: '#products' }],
        [{ label: 'Robotic welding', href: '#products' }, { label: 'Arc welding', href: '#products' }],
      ],
      btn: { label: 'Explore welding', href: '#products' },
    },
    other: {
      image: 'assets/img/other-technologies.png',
      alt: 'Final assembly and testing of Lanos steel components',
      desc: 'Beyond fabrication, we handle everything needed to deliver a finished, certified product:',
      links: [
        [{ label: 'Assembly', href: '#products' }, { label: 'Testing', href: '#products' }],
        [{ label: 'Packaging', href: '#products' }, { label: 'Logistics', href: '#products' }],
      ],
      btn: { label: 'Explore capabilities', href: '#products' },
    },
  };

  const facilitiesNav = document.querySelector('[data-facilities-nav]');
  const facilitiesCard = document.querySelector('[data-facilities-card]');
  if (facilitiesNav && facilitiesCard) {
    const titleEl = facilitiesCard.querySelector('[data-category-title]');
    const imageEl = facilitiesCard.querySelector('[data-card-image]');
    const descEl = facilitiesCard.querySelector('[data-card-desc]');
    const colEls = facilitiesCard.querySelectorAll('[data-col]');
    const btnEl = facilitiesCard.querySelector('.btn');
    const btnLabelEl = facilitiesCard.querySelector('[data-card-btn-label]');
    const items = facilitiesNav.querySelectorAll('.checks__item');
    let switchTimer;

    const renderLinkColumn = (ul, links) => {
      ul.innerHTML = '';
      links.forEach(({ label, href }) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'card-cutting__link';
        a.href = href;
        a.append(label);
        a.insertAdjacentHTML('beforeend', '<svg class="icon card-cutting__link-arrow"><use href="#icon-arrow"/></svg>');
        li.append(a);
        ul.append(li);
      });
    };

    const applyData = (item) => {
      // FACILITIES_DATA (rich: images + link columns + button) covers the
      // home page's categories; any other page using this same component
      // (e.g. Production and capabilities' Doors/Hatches/Storage) just
      // needs data-image/data-alt/data-desc on the <li> itself — no JS
      // changes required to wire up a new, simpler instance of it.
      const data = FACILITIES_DATA[item.dataset.category] || {
        image: item.dataset.image,
        alt: item.dataset.alt,
        desc: item.dataset.desc,
      };
      if (!data.image && !data.desc) return;
      const label = item.querySelector('.checks__label');
      if (label && titleEl) titleEl.textContent = label.textContent;
      if (imageEl && data.image) { imageEl.src = data.image; imageEl.alt = data.alt || ''; }
      if (descEl && data.desc) descEl.textContent = data.desc;
      if (data.links) colEls.forEach((ul, i) => data.links[i] && renderLinkColumn(ul, data.links[i]));
      if (btnLabelEl && data.btn) btnLabelEl.textContent = data.btn.label;
      if (btnEl && data.btn) btnEl.href = data.btn.href;
    };

    const setActive = (item) => {
      if (!item || item.classList.contains('checks__item--active')) return;
      items.forEach(i => i.classList.remove('checks__item--active'));
      item.classList.add('checks__item--active');

      clearTimeout(switchTimer);
      facilitiesCard.classList.add('is-switching');
      switchTimer = setTimeout(() => {
        applyData(item);
        facilitiesCard.classList.remove('is-switching');
      }, 250);
    };

    items.forEach(item => {
      item.addEventListener('mouseenter', () => setActive(item));
      item.addEventListener('focusin', () => setActive(item));
    });
  }

  /* ---------- Product cards: hover-driven accordion (sticky selection) ---------- */
  const cardsWrap = document.querySelector('[data-product-cards]');
  if (cardsWrap) {
    const cards = cardsWrap.querySelectorAll('[data-product-card]');
    const setActiveCard = (card) => {
      if (!card || card.classList.contains('product-card--active')) return;
      cards.forEach(c => c.classList.remove('product-card--active'));
      card.classList.add('product-card--active');
    };
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => setActiveCard(card));
      card.addEventListener('focusin', () => setActiveCard(card));
      card.addEventListener('click', () => setActiveCard(card));
    });
  }

  /* ---------- Certificate slider ---------- */
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const slides = slider.querySelectorAll('.cert-slider__slide');
    const dots = slider.querySelectorAll('.cert-slider__dot');
    let current = 0;
    let timer;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('cert-slider__dot--active', i === current));
    };
    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 4500);
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); start(); }));
    goTo(0);
    start();

    /* Swipe/drag: an alternative way to switch slides alongside the dots
       and auto-advance. Pointer Events cover touch, mouse and pen in one
       code path, so a mouse-drag works too. The track follows the pointer
       with resistance while dragging, then snaps back via CSS transition
       once released — the actual slide change still runs through the same
       goTo()/crossfade used everywhere else. */
    const track = slider.querySelector('.cert-slider__track');
    if (track) {
      const SWIPE_THRESHOLD = 50;
      const RESISTANCE = 0.35;
      let dragging = false;
      let startX = 0;
      let deltaX = 0;

      const onPointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        deltaX = 0;
        track.classList.add('is-dragging');
        clearInterval(timer);
        track.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e) => {
        if (!dragging) return;
        deltaX = e.clientX - startX;
        track.style.transform = `translateX(${deltaX * RESISTANCE}px)`;
      };

      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        track.classList.remove('is-dragging');
        track.style.transform = '';
        if (deltaX <= -SWIPE_THRESHOLD) goTo(current + 1);
        else if (deltaX >= SWIPE_THRESHOLD) goTo(current - 1);
        deltaX = 0;
        start();
      };

      track.addEventListener('pointerdown', onPointerDown);
      track.addEventListener('pointermove', onPointerMove);
      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);
    }
  }

  /* ---------- Partner logos: seamless marquee on small screens ---------- */
  const marquee = document.querySelector('[data-marquee]');
  if (marquee) {
    const setup = () => {
      const shouldMarquee = window.innerWidth <= 1200;
      const active = marquee.hasAttribute('data-marquee-active');
      if (shouldMarquee && !active) {
        marquee.innerHTML += marquee.innerHTML;
        marquee.setAttribute('data-marquee-active', '');
      } else if (!shouldMarquee && active) {
        const half = marquee.children.length / 2;
        for (let i = marquee.children.length - 1; i >= half; i--) {
          marquee.removeChild(marquee.children[i]);
        }
        marquee.removeAttribute('data-marquee-active');
      }
    };
    setup();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 200);
    });
  }

  /* ---------- Contact form: lightweight submit feedback ---------- */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const btn = form.querySelector('.btn');
      const label = btn.querySelector('.btn__label');
      const original = label.textContent;
      label.textContent = 'Thank you!';
      btn.style.pointerEvents = 'none';
      form.reset();
      setTimeout(() => {
        label.textContent = original;
        btn.style.pointerEvents = '';
      }, 3000);
    });
  }

  /* ---------- Hero background parallax ---------- */
  const parallax = document.querySelector('[data-parallax]');
  if (parallax && window.matchMedia('(hover:hover)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      parallax.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
    }, { passive: true });
  }

})();
