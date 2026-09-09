(() => {
  'use strict';

  const loader = document.querySelector('.page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 1000);
  });

  const header = document.querySelector('[data-header]');
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('header--scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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

  const navClose = document.querySelector('[data-nav-close]');

  const setNavOpen = (open) => {
    nav.setAttribute('data-open', String(open));
    burger.setAttribute('aria-expanded', String(open));
    header && header.classList.toggle('header--nav-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) {
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

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      document.querySelectorAll('[data-lang-current]').forEach(el => { el.textContent = lang; });
      document.querySelectorAll('[data-lang]').forEach(b => {
        b.closest('li').setAttribute('aria-selected', String(b.getAttribute('data-lang') === lang));
      });
      if (btn.closest('.header__nav-panel')) openPanel('main');
    });
  });

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

  const countEls = document.querySelectorAll('[data-count-to]');
  if (countEls.length) {
    const formatCount = (n, plain) => plain || n < 1000 ? String(n) : n.toLocaleString('en-US').replace(/,/g, ' ');
    const runCount = el => {
      const target = parseInt(el.dataset.countTo, 10);
      const plain = el.dataset.countPlain === 'true';
      const duration = 1600;
      const start = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatCount(Math.round(target * eased), plain);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const countIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      countEls.forEach(el => countIo.observe(el));
    } else {
      countEls.forEach(el => { el.textContent = formatCount(parseInt(el.dataset.countTo, 10), el.dataset.countPlain === 'true'); });
    }
  }

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

    const scrollChipIntoView = (item) => {
      const container = item.closest('.checks');
      if (!container || container.scrollWidth <= container.clientWidth) return;
      const itemRect = item.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      if (itemRect.left >= containerRect.left && itemRect.right <= containerRect.right) return;
      const offset = itemRect.left - containerRect.left - (containerRect.width - itemRect.width) / 2;
      container.scrollBy({ left: offset, behavior: 'smooth' });
    };

    const setActive = (item) => {
      if (!item || item.classList.contains('checks__item--active')) return;
      items.forEach(i => i.classList.remove('checks__item--active'));
      item.classList.add('checks__item--active');
      scrollChipIntoView(item);

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
      item.addEventListener('click', () => setActive(item));
    });
  }

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
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', endDrag);
      };

      const onPointerMove = (e) => {
        if (!dragging) return;
        deltaX = e.clientX - startX;
        track.style.transform = `translateX(${deltaX * RESISTANCE}px)`;
      };

      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', endDrag);
        window.removeEventListener('pointercancel', endDrag);
        track.classList.remove('is-dragging');
        track.style.transform = '';
        if (deltaX <= -SWIPE_THRESHOLD) goTo(current + 1);
        else if (deltaX >= SWIPE_THRESHOLD) goTo(current - 1);
        deltaX = 0;
        start();
      };

      track.addEventListener('pointerdown', onPointerDown);
    }
  }

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

  const certGridSlider = document.querySelector('[data-cert-slider]');
  if (certGridSlider) {
    const gridTrack = certGridSlider.querySelector('.cert-grid-slider__track');
    const gridViewport = certGridSlider.querySelector('.cert-grid-slider__viewport');
    const gridPages = certGridSlider.querySelectorAll('.cert-grid-slider__page');
    const gridDots = certGridSlider.querySelectorAll('.cert-grid-slider__dot');
    const gridCards = certGridSlider.querySelectorAll('.cert-card');
    const gridProgressFill = certGridSlider.querySelector('[data-cert-slider-progress-fill]');
    let gridPage = 0;

    const setGridProgress = (idx) => {
      if (!gridProgressFill || !gridCards.length) return;
      const pct = gridCards.length > 1 ? (idx / (gridCards.length - 1)) * 100 : 100;
      gridProgressFill.style.width = `${Math.max(4, pct)}%`;
    };

    const goToGridPage = (index) => {
      gridPage = (index + gridPages.length) % gridPages.length;
      gridTrack.style.transform = `translateX(-${gridPage * 100}%)`;
      gridDots.forEach((d, i) => d.classList.toggle('cert-grid-slider__dot--active', i === gridPage));
      if (gridViewport) gridViewport.scrollLeft = 0;
      setGridProgress(0);
    };

    if (gridViewport && gridProgressFill && gridCards.length > 1) {
      const cardStep = () => gridCards[1].offsetLeft - gridCards[0].offsetLeft;
      gridViewport.addEventListener('scroll', () => {
        const step = cardStep();
        if (!step) return;
        const idx = Math.min(gridCards.length - 1, Math.round(gridViewport.scrollLeft / step));
        setGridProgress(idx);
      }, { passive: true });
    }

    gridDots.forEach((dot, i) => dot.addEventListener('click', () => goToGridPage(i)));

    const certTabs = document.querySelector('[data-cert-tabs]');
    if (certTabs) {
      const tabs = certTabs.querySelectorAll('.pill-tabs__item');
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => {
            t.classList.remove('pill-tabs__item--active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('pill-tabs__item--active');
          tab.setAttribute('aria-selected', 'true');
          goToGridPage(0);
        });
      });
    }

    const SWIPE_THRESHOLD = 50;
    const RESISTANCE = 0.35;
    let dragging = false;
    let startX = 0;
    let deltaX = 0;

    const onGridPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      deltaX = 0;
      gridTrack.classList.add('is-dragging');
      window.addEventListener('pointermove', onGridPointerMove);
      window.addEventListener('pointerup', endGridDrag);
      window.addEventListener('pointercancel', endGridDrag);
    };
    const onGridPointerMove = (e) => {
      if (!dragging) return;
      deltaX = e.clientX - startX;
      gridTrack.style.transform = `translateX(calc(-${gridPage * 100}% + ${deltaX * RESISTANCE}px))`;
    };
    const endGridDrag = () => {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener('pointermove', onGridPointerMove);
      window.removeEventListener('pointerup', endGridDrag);
      window.removeEventListener('pointercancel', endGridDrag);
      gridTrack.classList.remove('is-dragging');
      if (deltaX <= -SWIPE_THRESHOLD) goToGridPage(gridPage + 1);
      else if (deltaX >= SWIPE_THRESHOLD) goToGridPage(gridPage - 1);
      else goToGridPage(gridPage);
      deltaX = 0;
    };

    gridTrack.addEventListener('pointerdown', onGridPointerDown);

    goToGridPage(0);
  }

  const galleryGrid = document.querySelector('[data-gallery-grid]');
  if (galleryGrid) {
    const GALLERY_PAGE_SIZE = 8;
    const GALLERY_DATA = {
      premises: [
        { src: '../assets/img/production-facility-card.jpg', alt: 'Lanos production hall, wide view' },
        { src: '../assets/img/production-hero.jpg', alt: 'Production floor at the Lanos facility' },
        { src: '../assets/img/hero-bg.jpg', alt: 'Steel fabrication hall interior' },
        { src: '../assets/img/about-photo.jpg', alt: 'Inside the Lanos production premises' },
        { src: '../assets/img/spotlight-jets-bg.jpg', alt: 'Partner facility premises' },
        { src: '../assets/img/about-hero.jpg', alt: 'Weathertight door mechanism on the production floor' },
        { src: '../assets/img/gallery-checks.jpg', alt: 'Quality control station on the shop floor' },
        { src: '../assets/img/gallery-other-tech.jpg', alt: 'Coordinate measuring machine on the shop floor' },
      ],
      equipment: [
        { src: '../assets/img/tech-cnc-laser.jpg', alt: 'CNC laser cutting equipment' },
        { src: '../assets/img/tech-robotic-welding.jpg', alt: 'Robotic welding arm in operation' },
        { src: '../assets/img/gallery-mechanical.jpg', alt: 'CNC milling with coolant spray' },
        { src: '../assets/img/gallery-welding.jpg', alt: 'Robotic arm welding a steel component' },
        { src: '../assets/img/gallery-surface.jpg', alt: 'Robotic surface coating equipment' },
        { src: '../assets/img/tech-surface-treatment.jpg', alt: 'Surface treatment equipment' },
        { src: '../assets/img/cutting-process.jpg', alt: 'Steel plate cutting equipment' },
        { src: '../assets/img/gallery-plastic.jpg', alt: 'Steel rolling and forming equipment' },
        { src: '../assets/img/tech-surface-light.jpg', alt: 'Surface treatment station' },
        { src: '../assets/img/tech-welding-light.jpg', alt: 'Welding station' },
        { src: '../assets/img/gallery-cutting-alt.jpg', alt: 'Precision measurement equipment' },
        { src: '../assets/img/about-video-bg.jpg', alt: 'Engineer reviewing a CAD model of a component' },
      ],
      infrastructure: [
        { src: '../assets/img/hero-bg.jpg', alt: 'Lanos facility infrastructure' },
        { src: '../assets/img/production-facility-card.jpg', alt: 'Production hall infrastructure' },
        { src: '../assets/img/spotlight-jets-bg.jpg', alt: 'Partner company infrastructure' },
        { src: '../assets/img/about-photo.jpg', alt: 'Facility infrastructure at Lanos' },
        { src: '../assets/img/about-video-bg.jpg', alt: 'Engineering workstation infrastructure' },
        { src: '../assets/img/gallery-checks.jpg', alt: 'Quality control infrastructure' },
        { src: '../assets/img/production-hero.jpg', alt: 'Production infrastructure at Lanos' },
        { src: '../assets/img/about-hero.jpg', alt: 'Door mechanism infrastructure detail' },
      ],
      'new-equipment': [
        { src: '../assets/img/gallery-plastic.jpg', alt: 'New steel rolling and forming line' },
        { src: '../assets/img/gallery-surface.jpg', alt: 'New robotic surface coating cell' },
        { src: '../assets/img/gallery-welding.jpg', alt: 'New robotic welding cell' },
        { src: '../assets/img/tech-robotic-welding.jpg', alt: 'Newly installed robotic welding arm' },
        { src: '../assets/img/tech-cnc-laser.jpg', alt: 'Newly installed CNC laser cutter' },
        { src: '../assets/img/gallery-mechanical.jpg', alt: 'New CNC milling equipment' },
        { src: '../assets/img/gallery-cutting-alt.jpg', alt: 'New precision measurement equipment' },
        { src: '../assets/img/cutting-process.jpg', alt: 'New steel cutting equipment' },
        { src: '../assets/img/gallery-other-tech.jpg', alt: 'New coordinate measuring machine' },
        { src: '../assets/img/gallery-checks.jpg', alt: 'New quality control station' },
        { src: '../assets/img/tech-surface-light.jpg', alt: 'New surface treatment station' },
        { src: '../assets/img/tech-welding-light.jpg', alt: 'New welding station' },
      ],
    };

    const galleryTabsWrap = document.querySelector('[data-gallery-tabs]');
    const galleryMoreBtn = document.querySelector('[data-gallery-more]');
    let galleryCategory = galleryTabsWrap
      ? galleryTabsWrap.querySelector('.pill-tabs__item--active')?.dataset.category
      : Object.keys(GALLERY_DATA)[0];
    let galleryShown = 0;

    const renderGalleryBatch = () => {
      const pool = GALLERY_DATA[galleryCategory] || [];
      const next = pool.slice(galleryShown, galleryShown + GALLERY_PAGE_SIZE);
      next.forEach((item) => {
        const tile = document.createElement('button');
        tile.className = 'gallery-grid__item';
        tile.type = 'button';
        tile.setAttribute('data-lightbox-trigger', '');
        tile.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy">
          <span class="gallery-grid__zoom" aria-hidden="true"><svg class="icon"><use href="#icon-zoom"/></svg></span>`;
        galleryGrid.appendChild(tile);
      });
      galleryShown += next.length;
      if (galleryMoreBtn) galleryMoreBtn.hidden = galleryShown >= pool.length;
    };

    const resetGallery = () => {
      galleryGrid.innerHTML = '';
      galleryShown = 0;
      renderGalleryBatch();
    };

    if (galleryTabsWrap) {
      const galleryTabs = galleryTabsWrap.querySelectorAll('.pill-tabs__item');
      galleryTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          galleryTabs.forEach((t) => {
            t.classList.remove('pill-tabs__item--active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('pill-tabs__item--active');
          tab.setAttribute('aria-selected', 'true');
          galleryCategory = tab.dataset.category;
          resetGallery();
        });
      });
    }

    if (galleryMoreBtn) galleryMoreBtn.addEventListener('click', renderGalleryBatch);

    resetGallery();
  }

  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lightbox__img');
    let lbIndex = 0;

    const getTriggers = () => Array.from(document.querySelectorAll('[data-lightbox-trigger]'));

    const openLightbox = (i) => {
      const triggers = getTriggers();
      if (!triggers.length) return;
      lbIndex = (i + triggers.length) % triggers.length;
      const img = triggers[lbIndex].querySelector('img');
      lbImg.src = triggers[lbIndex].dataset.full || img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox-trigger]');
      if (!trigger) return;
      openLightbox(getTriggers().indexOf(trigger));
    });
    lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => el.addEventListener('click', closeLightbox));
    const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
    const nextBtn = lightbox.querySelector('[data-lightbox-next]');
    if (prevBtn) prevBtn.addEventListener('click', () => openLightbox(lbIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => openLightbox(lbIndex + 1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
      if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    });
  }

  const worldMap = document.querySelector('[data-world-map]');
  if (worldMap) {
    const pins = worldMap.querySelectorAll('[data-pin]');
    const card = worldMap.querySelector('[data-location-card]');
    const closeBtn = card.querySelector('[data-location-close]');
    const defaultPin = worldMap.querySelector('[data-pin-active]');
    let activePin = null;

    const positionCardNear = (pin) => {
      const mapRect = worldMap.getBoundingClientRect();
      const pinRect = pin.getBoundingClientRect();
      const tipX = pinRect.left + pinRect.width / 2 - mapRect.left;
      const tipY = pinRect.top - mapRect.top;
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;

      let left = tipX + 16;
      if (left + cardWidth > mapRect.width - 8) left = tipX - cardWidth - 16;
      if (left < 8) left = 8;

      let top = tipY - cardHeight - 12;
      if (top < 8) top = tipY + 12;

      card.style.left = `${left}px`;
      card.style.top = `${top}px`;
    };

    const openCard = (pin) => {
      activePin = pin;
      pins.forEach((p) => p.classList.toggle('world-map__pin--active', p === pin));
      positionCardNear(pin);
      card.classList.add('is-visible');
    };

    const closeCard = () => {
      activePin = null;
      pins.forEach((p) => p.classList.remove('world-map__pin--active'));
      card.classList.remove('is-visible');
    };

    pins.forEach((pin) => {
      pin.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (activePin === pin) closeCard();
        else openCard(pin);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeCard);
    card.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => { if (activePin) closeCard(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activePin) closeCard();
    });

    if (defaultPin) {
      requestAnimationFrame(() => openCard(defaultPin));
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (activePin) positionCardNear(activePin); }, 150);
    });
  }

  const parallax = document.querySelector('[data-parallax]');
  if (parallax && window.matchMedia('(hover:hover)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      parallax.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
    }, { passive: true });
  }

})();
