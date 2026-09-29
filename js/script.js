/* ============================================
   AGIBANK - PROGRAMA DE ESTÁGIO LP
   JavaScript principal

   CHANGELOG:
   - [NOVO] initCampusCarousel(): carrossel infinito das fotos do
     escritório. Função INDEPENDENTE de initMediaCarousel() (mesma
     técnica de clonagem de bordas, mas código isolado) — decisão
     proposital para evitar qualquer risco de regressão cruzada
     entre as duas seções de carrossel.
============================================ */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Agibank LP - Estágio carregada com sucesso ✅');

  const editMode = new URLSearchParams(window.location.search).get('edit') === '1';

  function safeRun(fn, label) {
    try {
      fn();
    } catch (err) {
      console.error('❌ Erro ao executar "' + label + '":', err);
    }
  }

  safeRun(initHeaderScroll, 'initHeaderScroll');
  safeRun(initMobileMenu, 'initMobileMenu');
  safeRun(initWhyApplyTimeline, 'initWhyApplyTimeline');
  safeRun(initScrollReveal, 'initScrollReveal');
  safeRun(initLeafEffect, 'initLeafEffect');
  safeRun(initCharacterWalk, 'initCharacterWalk');
  safeRun(initPercentCounter, 'initPercentCounter');
  safeRun(initKickstartMorph, 'initKickstartMorph');
  safeRun(initIaIconHover, 'initIaIconHover');
  safeRun(initRequirementsCascade, 'initRequirementsCascade');
  safeRun(initAreasAccordion, 'initAreasAccordion');
  safeRun(initProcessSteps, 'initProcessSteps');
  safeRun(initValuePropVideo, 'initValuePropVideo');
  safeRun(initMediaCarousel, 'initMediaCarousel');
  safeRun(initCampusCarousel, 'initCampusCarousel');

  if (editMode) {
    console.log('🛠 Modo edição ativo — parallax desabilitado propositalmente.');
    safeRun(initPositionEditor, 'initPositionEditor');
  } else {
    safeRun(initHeroParallax, 'initHeroParallax');
    safeRun(initAwardsParallax, 'initAwardsParallax');
    safeRun(initCarDriveIn, 'initCarDriveIn');
    safeRun(initCacoMouseParallax, 'initCacoMouseParallax');
    safeRun(initReqGirlParallax, 'initReqGirlParallax');
  }
});

/* ============================================
   HEADER: SOMBRA AO ROLAR
============================================ */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  function handleHeaderScroll() {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll();
}

/* ============================================
   MENU MOBILE: TOGGLE
============================================ */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   HERO: PARALLAX
============================================ */
function initHeroParallax() {
  const heroBanner = document.getElementById('hero-banner');
  const repelEls = document.querySelectorAll('[data-parallax="repel"]');
  const tiltEls = document.querySelectorAll('[data-parallax="tilt-x"]');

  if (!heroBanner) return;
  if (!repelEls.length && !tiltEls.length) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse) return;

  const repelRadius = 210;

  const repelState = Array.from(repelEls).map(function (el) {
    return {
      el: el,
      strength: parseFloat(el.dataset.strength) || 18,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0
    };
  });

  const tiltState = Array.from(tiltEls).map(function (el) {
    return {
      el: el,
      strength: parseFloat(el.dataset.strength) || 18,
      currentX: 0,
      targetX: 0
    };
  });

  heroBanner.addEventListener('mousemove', function (e) {
    const rect = heroBanner.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    repelState.forEach(function (item) {
      const elRect = item.el.getBoundingClientRect();
      const elCenterX = elRect.left - rect.left + elRect.width / 2;
      const elCenterY = elRect.top - rect.top + elRect.height / 2;

      const dx = elCenterX - mouseX;
      const dy = elCenterY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < repelRadius) {
        const t = distance / repelRadius;
        const force = Math.cos(t * (Math.PI / 2));
        const angle = Math.atan2(dy, dx);
        item.targetX = Math.cos(angle) * force * item.strength;
        item.targetY = Math.sin(angle) * force * item.strength;
      } else {
        item.targetX = 0;
        item.targetY = 0;
      }
    });

    const ratio = (mouseX / rect.width) * 2 - 1;
    tiltState.forEach(function (item) {
      item.targetX = ratio * item.strength;
    });
  });

  heroBanner.addEventListener('mouseleave', function () {
    repelState.forEach(function (item) {
      item.targetX = 0;
      item.targetY = 0;
    });
    tiltState.forEach(function (item) {
      item.targetX = 0;
    });
  });

  function animate() {
    repelState.forEach(function (item) {
      item.currentX += (item.targetX - item.currentX) * 0.08;
      item.currentY += (item.targetY - item.currentY) * 0.08;
      item.el.style.transform = 'translate(' + item.currentX.toFixed(2) + 'px, ' + item.currentY.toFixed(2) + 'px)';
    });

    tiltState.forEach(function (item) {
      item.currentX += (item.targetX - item.currentX) * 0.08;
      item.el.style.transform = 'translateX(' + item.currentX.toFixed(2) + 'px)';
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   AWARDS: PARALLAX DE PROFUNDIDADE
============================================ */
function initAwardsParallax() {
  const stage = document.getElementById('awardsStage');
  const depthEls = document.querySelectorAll('#awardsStage [data-parallax="depth"]');
  if (!stage || !depthEls.length) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse) return;

  const state = Array.from(depthEls).map(function (el) {
    return {
      el: el,
      depth: parseFloat(el.dataset.depth) || 15,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0
    };
  });

  stage.addEventListener('mousemove', function (e) {
    const rect = stage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const normX = (relX - 0.5) * 2;
    const normY = (relY - 0.5) * 2;

    state.forEach(function (item) {
      item.targetX = normX * item.depth;
      item.targetY = normY * item.depth * 0.6;
    });
  });

  stage.addEventListener('mouseleave', function () {
    state.forEach(function (item) {
      item.targetX = 0;
      item.targetY = 0;
    });
  });

  function animate() {
    state.forEach(function (item) {
      item.currentX += (item.targetX - item.currentX) * 0.08;
      item.currentY += (item.targetY - item.currentY) * 0.08;
      item.el.style.transform = 'translate(' + item.currentX.toFixed(2) + 'px, ' + item.currentY.toFixed(2) + 'px)';
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   CTA PURPOSE: PARALLAX DE MOUSE NO CACO
============================================ */
function initCacoMouseParallax() {
  const stage = document.getElementById('ctaPurposeStage');
  const wrapper = document.querySelector('.cta-purpose__caco-parallax');
  if (!stage || !wrapper) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse) return;

  const depth = parseFloat(wrapper.dataset.depth) || 14;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  stage.addEventListener('mousemove', function (e) {
    const rect = stage.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    const normX = (relX - 0.5) * 2;
    const normY = (relY - 0.5) * 2;

    targetX = normX * depth;
    targetY = normY * depth * 0.6;
  });

  stage.addEventListener('mouseleave', function () {
    targetX = 0;
    targetY = 0;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    wrapper.style.transform = 'translate(' + currentX.toFixed(2) + 'px, ' + currentY.toFixed(2) + 'px)';
    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   REQUIREMENTS: PARALLAX LATERAL NA MENINA
============================================ */
function initReqGirlParallax() {
  const card = document.querySelector('.requirements__card--horizontal');
  const girl = document.getElementById('reqGirlParallax');
  
  if (!card || !girl) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse) return;

  let currentX = 0;
  let targetX = 0;
  const strength = 15;

  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const normX = (relX - 0.5) * 2;
    targetX = normX * strength;
  });

  card.addEventListener('mouseleave', function() {
    targetX = 0;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    girl.style.transform = 'translateX(' + currentX.toFixed(2) + 'px)';
    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   REQUIREMENTS: HOVER DO ÍCONE DE IA
============================================ */
function initIaIconHover() {
  const icons = document.querySelectorAll('.requirements__ia-icon');
  if (!icons.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  icons.forEach(function (icon) {
    icon.addEventListener('mouseenter', function () {
      icon.classList.remove('is-hover-active');
      void icon.offsetWidth;
      icon.classList.add('is-hover-active');
    });
  });
}

/* ============================================
   REQUIREMENTS: CASCATA DE ENTRADA DOS 4 CARDS
============================================ */
function initRequirementsCascade() {
  const grid = document.querySelector('.requirements__grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.requirements__card');
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    grid.classList.add('is-cascade-visible');
    return;
  }

  const STAGGER_STEP = 0.18;

  cards.forEach(function (card, i) {
    card.style.transitionDelay = (i * STAGGER_STEP).toFixed(2) + 's';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        grid.classList.add('is-cascade-visible');
        observer.unobserve(grid);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);
}

/* ============================================
   SEÇÃO 07 - ÁREAS DE ATUAÇÃO: ACORDEÃO SIMPLES
============================================ */
function initAreasAccordion() {
  const accordion = document.getElementById('areasAccordion');
  if (!accordion) return;

  const items = Array.from(accordion.querySelectorAll('.areas__item'));
  if (!items.length) return;

  items.forEach(function (item) {
    const headerBtn = item.querySelector('.areas__item-header');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', function () {
      const wasOpen = item.classList.contains('is-open');
      items.forEach(function (i) { i.classList.remove('is-open'); });
      if (!wasOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* ============================================
   SEÇÃO 08 - PROCESSO SELETIVO
   (Arco SVG + scroll pinado)
============================================ */
function initProcessSteps() {
  const pinWrapper = document.getElementById('processPinWrapper');
  const header = document.getElementById('header');
  const overlay = document.getElementById('processOverlay');
  const headerBlock = document.getElementById('processHeader');
  const stepContent = document.getElementById('processStepContent');
  const stepNumber = document.getElementById('processStepNumber');
  const stepTitle = document.getElementById('processStepTitle');
  const dotsGroup = document.getElementById('processDots');
  const path = document.getElementById('processArcPath');

  if (!pinWrapper || !header || !overlay || !headerBlock || !stepContent ||
      !stepNumber || !stepTitle || !dotsGroup || !path) return;

  const STEPS = [
    'Inscrições',
    'Testes on-line',
    'Etapas em grupo',
    'Entrevista final',
    'Resultados',
    'Início da jornada | Março'
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  const totalLength = path.getTotalLength();
  const fractions = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const svgNS = 'http://www.w3.org/2000/svg';

  const dots = fractions.map(function (f) {
    const point = path.getPointAtLength(f * totalLength);
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', 8);
    circle.setAttribute('class', 'process__dot');
    dotsGroup.appendChild(circle);
    return circle;
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        overlay.classList.add('is-visible');
        headerBlock.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealObserver.observe(pinWrapper);

  function applyImmediate(index) {
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
    stepNumber.textContent = String(index + 1).padStart(2, '0');
    stepTitle.textContent = STEPS[index];
  }

  if (reduceMotion || isMobile) {
    applyImmediate(0);
    return;
  }

  let currentIndex = 0;
  applyImmediate(0);

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function getProgress() {
    const rect = pinWrapper.getBoundingClientRect();
    const headerHeight = header.offsetHeight;
    const scrollable = pinWrapper.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    const raw = (headerHeight - rect.top) / scrollable;
    return clamp(raw, 0, 0.9999);
  }

  function setActive(index) {
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });

    stepContent.classList.add('is-fading');
    setTimeout(function () {
      stepNumber.textContent = String(index + 1).padStart(2, '0');
      stepTitle.textContent = STEPS[index];
      stepContent.classList.remove('is-fading');
    }, 200);
  }

  function update() {
    const progress = getProgress();
    const idx = clamp(Math.floor(progress * STEPS.length), 0, STEPS.length - 1);
    if (idx !== currentIndex) {
      currentIndex = idx;
      setActive(idx);
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  update();
}

/* ============================================
   SEÇÃO 09 - EFETIVAÇÃO: VÍDEO (FACADE PATTERN)
============================================ */
function initValuePropVideo() {
  const videoWrap = document.getElementById('valuePropVideo');
  if (!videoWrap) return;

  videoWrap.addEventListener('click', function () {
    const videoId = videoWrap.dataset.videoId;
    if (!videoId) return;

    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0'
    );
    iframe.setAttribute('title', 'Vídeo Programa de Estágio Agibank');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    );
    iframe.setAttribute('allowfullscreen', '');

    videoWrap.innerHTML = '';
    videoWrap.appendChild(iframe);
    videoWrap.style.cursor = 'default';
  }, { once: true });
}

/* ============================================
   SEÇÃO 10 - AGIBANK NA MÍDIA: CARROSSEL INFINITO
============================================ */
function initMediaCarousel() {
  const track = document.getElementById('mediaTrack');
  const prevBtn = document.getElementById('mediaPrev');
  const nextBtn = document.getElementById('mediaNext');
  if (!track || !prevBtn || !nextBtn) return;

  const realCards = Array.from(track.children);
  if (!realCards.length) return;

  realCards.forEach(function (card, i) {
    card.dataset.realIndex = String(i);
  });

  function buildCloneSet() {
    const fragment = document.createDocumentFragment();
    realCards.forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('data-clone', 'true');
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      fragment.appendChild(clone);
    });
    return fragment;
  }

  track.insertBefore(buildCloneSet(), track.firstChild);
  track.appendChild(buildCloneSet());

  const allCards = Array.from(track.querySelectorAll('.media__card'));

  function centerCard(card, smooth) {
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offset = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
    const target = track.scrollLeft + offset;

    if (smooth) {
      track.scrollTo({ left: target, behavior: 'smooth' });
    } else {
      track.scrollLeft = target;
    }
  }

  function updateActiveCard() {
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    allCards.forEach(function (card) {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenterX - centerX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    allCards.forEach(function (card) {
      card.classList.toggle('is-active', card === closestCard);
    });

    return closestCard;
  }

  function correctIfOnClone() {
    const active = updateActiveCard();
    if (!active || active.getAttribute('data-clone') !== 'true') return;

    const idx = active.dataset.realIndex;
    const realEquivalent = track.querySelector(
      '.media__card[data-real-index="' + idx + '"]:not([data-clone])'
    );
    if (!realEquivalent) return;

    const prevBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    centerCard(realEquivalent, false);
    requestAnimationFrame(function () {
      track.style.scrollBehavior = prevBehavior || 'smooth';
      updateActiveCard();
    });
  }

  let scrollEndTimer = null;
  track.addEventListener('scroll', function () {
    updateActiveCard();
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(correctIfOnClone, 120);
  }, { passive: true });

  function stepTo(direction) {
    const active = updateActiveCard();
    if (!active) return;

    const currentIdx = allCards.indexOf(active);
    const targetIdx = currentIdx + direction;

    if (targetIdx < 0 || targetIdx >= allCards.length) return;
    centerCard(allCards[targetIdx], true);
  }

  prevBtn.addEventListener('click', function () {
    stepTo(-1);
  });

  nextBtn.addEventListener('click', function () {
    stepTo(1);
  });

  window.addEventListener('resize', function () {
    const active = updateActiveCard();
    if (!active) return;

    const prevBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    centerCard(active, false);
    requestAnimationFrame(function () {
      track.style.scrollBehavior = prevBehavior || 'smooth';
    });
  });

  requestAnimationFrame(function () {
    const firstReal = track.querySelector('.media__card:not([data-clone])');
    if (firstReal) {
      track.style.scrollBehavior = 'auto';
      centerCard(firstReal, false);
      requestAnimationFrame(function () {
        track.style.scrollBehavior = 'smooth';
        updateActiveCard();
      });
    }
  });
}

/* ============================================
   SEÇÃO 11 - CAMPUS/ESCRITÓRIO: CARROSSEL INFINITO
   (função independente de initMediaCarousel — mesma
   técnica, código isolado por segurança)
============================================ */
function initCampusCarousel() {
  const track = document.getElementById('campusTrack');
  const prevBtn = document.getElementById('campusPrev');
  const nextBtn = document.getElementById('campusNext');
  if (!track || !prevBtn || !nextBtn) return;

  const realCards = Array.from(track.children);
  if (!realCards.length) return;

  realCards.forEach(function (card, i) {
    card.dataset.realIndex = String(i);
  });

  function buildCloneSet() {
    const fragment = document.createDocumentFragment();
    realCards.forEach(function (card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('data-clone', 'true');
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      fragment.appendChild(clone);
    });
    return fragment;
  }

  track.insertBefore(buildCloneSet(), track.firstChild);
  track.appendChild(buildCloneSet());

  const allCards = Array.from(track.querySelectorAll('.campus-gallery__card'));

  function centerCard(card, smooth) {
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offset = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
    const target = track.scrollLeft + offset;

    if (smooth) {
      track.scrollTo({ left: target, behavior: 'smooth' });
    } else {
      track.scrollLeft = target;
    }
  }

  function updateActiveCard() {
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    allCards.forEach(function (card) {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenterX - centerX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    allCards.forEach(function (card) {
      card.classList.toggle('is-active', card === closestCard);
    });

    return closestCard;
  }

  function correctIfOnClone() {
    const active = updateActiveCard();
    if (!active || active.getAttribute('data-clone') !== 'true') return;

    const idx = active.dataset.realIndex;
    const realEquivalent = track.querySelector(
      '.campus-gallery__card[data-real-index="' + idx + '"]:not([data-clone])'
    );
    if (!realEquivalent) return;

    const prevBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    centerCard(realEquivalent, false);
    requestAnimationFrame(function () {
      track.style.scrollBehavior = prevBehavior || 'smooth';
      updateActiveCard();
    });
  }

  let scrollEndTimer = null;
  track.addEventListener('scroll', function () {
    updateActiveCard();
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(correctIfOnClone, 120);
  }, { passive: true });

  function stepTo(direction) {
    const active = updateActiveCard();
    if (!active) return;

    const currentIdx = allCards.indexOf(active);
    const targetIdx = currentIdx + direction;

    if (targetIdx < 0 || targetIdx >= allCards.length) return;
    centerCard(allCards[targetIdx], true);
  }

  prevBtn.addEventListener('click', function () {
    stepTo(-1);
  });

  nextBtn.addEventListener('click', function () {
    stepTo(1);
  });

  window.addEventListener('resize', function () {
    const active = updateActiveCard();
    if (!active) return;

    const prevBehavior = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    centerCard(active, false);
    requestAnimationFrame(function () {
      track.style.scrollBehavior = prevBehavior || 'smooth';
    });
  });

  requestAnimationFrame(function () {
    const firstReal = track.querySelector('.campus-gallery__card:not([data-clone])');
    if (firstReal) {
      track.style.scrollBehavior = 'auto';
      centerCard(firstReal, false);
      requestAnimationFrame(function () {
        track.style.scrollBehavior = 'smooth';
        updateActiveCard();
      });
    }
  });
}

/* ============================================
   EDITOR VISUAL UNIVERSAL (ativa com ?edit=1)
============================================ */
function initPositionEditor() {
  const UNLOCKED_ELEMENTS = [
    'req-girl'
  ];

  function isLocked(name) {
    return UNLOCKED_ELEMENTS.indexOf(name) === -1;
  }

  const allEditableEls = Array.from(document.querySelectorAll('[data-editable]'));
  const allRatioEls = Array.from(document.querySelectorAll('[data-ratio-var]'));

  if (!allEditableEls.length) return;

  allEditableEls.forEach(function (el) {
    if (isLocked(el.dataset.editable)) {
      el.setAttribute('data-locked', 'true');
    }
  });

  const editableEls = allEditableEls.filter(function (el) {
    return !isLocked(el.dataset.editable);
  });
  const ratioEls = allRatioEls.filter(function (el) {
    return !isLocked(el.dataset.ratioVar);
  });

  document.body.classList.add('position-editor-active');

  const state = {};
  const dirty = {};
  const ratioDirty = {};

  function getFields(el) {
    return (el.dataset.editableFields || 'top,left,width').split(',');
  }

  function readInitialValue(el, prop) {
    const parent = el.offsetParent || el.parentElement;
    const parentW = parent.offsetWidth || 1;
    const parentH = parent.offsetHeight || 1;
    const computed = getComputedStyle(el);

    if (prop === 'top') {
      const px = parseFloat(computed.top) || 0;
      return (px / parentH * 100);
    }
    if (prop === 'left') {
      const px = parseFloat(computed.left) || 0;
      return (px / parentW * 100);
    }
    if (prop === 'width') {
      return (el.offsetWidth / parentW * 100);
    }
    if (prop === 'height') {
      return (el.offsetHeight / parentH * 100);
    }
    if (prop === 'rotation') {
      return 0;
    }
    return 0;
  }

  editableEls.forEach(function (el) {
    const name = el.dataset.editable;
    const fields = getFields(el);

    state[name] = {};
    dirty[name] = false;
    fields.forEach(function (f) {
      state[name][f] = readInitialValue(el, f);
    });

    if (fields.indexOf('rotation') !== -1) {
      el.style.transform = 'rotate(0deg)';
    }

    el.style.opacity = '1';
  });

  function applyState(el, name) {
    const s = state[name];
    if (s.top !== undefined) el.style.top = s.top.toFixed(2) + '%';
    if (s.left !== undefined) el.style.left = s.left.toFixed(2) + '%';
    if (s.width !== undefined) el.style.width = s.width.toFixed(2) + '%';
    if (s.height !== undefined) el.style.height = s.height.toFixed(2) + '%';
    if (s.rotation !== undefined) el.style.transform = 'rotate(' + s.rotation + 'deg)';
  }

  const badge = document.createElement('div');
  badge.className = 'position-editor__badge';
  badge.textContent = '🛠 MODO EDIÇÃO — ' + editableEls.length + ' item(ns) destravado(s), ' +
    (allEditableEls.length - editableEls.length) + ' travado(s)';
  document.body.appendChild(badge);

  const panel = document.createElement('div');
  panel.className = 'position-editor';

  let ratioHtml = '';
  ratioEls.forEach(function (el, i) {
    const varName = el.dataset.ratioVar;
    const label = el.dataset.ratioLabel || varName;
    const min = el.dataset.ratioMin || -500;
    const max = el.dataset.ratioMax || 900;
    const current = getComputedStyle(el).getPropertyValue(varName).trim() || min;

    ratioDirty[varName] = false;

    ratioHtml +=
      '<div class="position-editor__ratio">' +
        '<label>' + label + ' (' + varName + ': <span data-ratio-display="' + i + '">' + current + '</span>)</label>' +
        '<input type="range" data-ratio-input="' + i + '" data-ratio-var="' + varName + '" data-ratio-target="' + i + '" min="' + min + '" max="' + max + '" step="5" value="' + current + '">' +
      '</div>';
  });

  const lockedCount = allEditableEls.length - editableEls.length;

  panel.innerHTML =
    '<div class="position-editor__header">' +
      '<strong>Editor de Posição</strong>' +
      '<button type="button" class="position-editor__copy">Copiar alterações</button>' +
    '</div>' +
    '<div class="position-editor__locked-notice">🔒 ' + lockedCount + ' elemento(s) travado(s) nesta página — não aparecem aqui e não podem ser alterados.</div>' +
    ratioHtml +
    '<div class="position-editor__list"></div>' +
    '<div class="position-editor__hint">' +
      '1. Clique num elemento na tela (ou no nome dele aqui) para selecionar.<br><br>' +
      '2. Use as setas do teclado para mover Top/Left (Shift = passo maior).<br><br>' +
      '3. Ou digite valores exatos nos campos.<br><br>' +
      '4. Ajuste alturas nas barrinhas rosa.<br><br>' +
      '5. Só o que você REALMENTE alterar entra no "Copiar alterações" — itens intocados nunca são exportados.' +
    '</div>';
  document.body.appendChild(panel);

  panel.querySelectorAll('[data-ratio-input]').forEach(function (input, i) {
    input.addEventListener('input', function () {
      const el = ratioEls[i];
      const varName = input.dataset.ratioVar;
      el.style.setProperty(varName, input.value);
      ratioDirty[varName] = true;
      panel.querySelector('[data-ratio-display="' + i + '"]').textContent = input.value;
    });
  });

  const list = panel.querySelector('.position-editor__list');
  let selected = null;
  let selectedName = null;

  editableEls.forEach(function (el) {
    const name = el.dataset.editable;
    const fields = getFields(el);

    let fieldsHtml = '';
    if (fields.indexOf('top') !== -1) {
      fieldsHtml += '<label>Top % <input type="number" step="0.1" data-prop="top" data-target="' + name + '"></label>';
    }
    if (fields.indexOf('left') !== -1) {
      fieldsHtml += '<label>Left % <input type="number" step="0.1" data-prop="left" data-target="' + name + '"></label>';
    }
    if (fields.indexOf('width') !== -1) {
      fieldsHtml += '<label>Width % <input type="number" step="0.1" data-prop="width" data-target="' + name + '"></label>';
    }
    if (fields.indexOf('height') !== -1) {
      fieldsHtml += '<label>Height % <input type="number" step="0.1" data-prop="height" data-target="' + name + '"></label>';
    }
    if (fields.indexOf('rotation') !== -1) {
      fieldsHtml += '<label>Rot° <input type="number" step="1" data-prop="rotation" data-target="' + name + '"></label>';
    }

    const item = document.createElement('div');
    item.className = 'position-editor__item';
    item.dataset.itemFor = name;
    item.innerHTML =
      '<button type="button" class="position-editor__select" data-target="' + name + '">' + name + '</button>' +
      fieldsHtml;
    list.appendChild(item);

    el.addEventListener('click', function (e) {
      e.stopPropagation();
      selectElement(el, name);
    });
  });

  function markDirty(name) {
    dirty[name] = true;
    const item = panel.querySelector('[data-item-for="' + name + '"]');
    if (item) item.classList.add('is-dirty');
  }

  function selectElement(el, name) {
    if (selected) selected.classList.remove('is-selected');
    document.querySelectorAll('.position-editor__item').forEach(function (i) {
      i.classList.remove('is-active');
    });

    selected = el;
    selectedName = name;
    el.classList.add('is-selected');

    const activeItem = panel.querySelector('[data-item-for="' + name + '"]');
    if (activeItem) activeItem.classList.add('is-active');

    updateInputs();
  }

  function updateInputs() {
    if (!selected || !selectedName) return;
    const s = state[selectedName];

    panel.querySelectorAll('input[data-prop][data-target="' + selectedName + '"]').forEach(function (input) {
      const prop = input.dataset.prop;
      const value = s[prop];
      input.value = (value !== undefined) ? (value.toFixed ? value.toFixed(2) : value) : 0;
    });
  }

  panel.addEventListener('click', function (e) {
    if (e.target.matches('.position-editor__select')) {
      const name = e.target.dataset.target;
      const el = document.querySelector('[data-editable="' + name + '"]:not([data-locked])');
      if (el) selectElement(el, name);
    }
  });

  panel.addEventListener('input', function (e) {
    if (!e.target.matches('input[data-prop]')) return;

    const name = e.target.dataset.target;
    const prop = e.target.dataset.prop;
    const el = document.querySelector('[data-editable="' + name + '"]:not([data-locked])');
    if (!el) return;
    const value = parseFloat(e.target.value) || 0;

    state[name][prop] = value;
    applyState(el, name);
    markDirty(name);
  });

  document.addEventListener('keydown', function (e) {
    if (!selected || !selectedName) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) === -1) return;

    const fields = getFields(selected);
    e.preventDefault();
    const step = e.shiftKey ? 1 : 0.2;
    let prop, dir;

    if (e.key === 'ArrowUp')    { prop = 'top';  dir = -1; }
    if (e.key === 'ArrowDown')  { prop = 'top';  dir = 1; }
    if (e.key === 'ArrowLeft')  { prop = 'left'; dir = -1; }
    if (e.key === 'ArrowRight') { prop = 'left'; dir = 1; }

    if (fields.indexOf(prop) === -1) return;

    state[selectedName][prop] += dir * step;
    applyState(selected, selectedName);
    markDirty(selectedName);
    updateInputs();
  });

  panel.querySelector('.position-editor__copy').addEventListener('click', function () {
    const dirtyNames = Object.keys(dirty).filter(function (name) { return dirty[name]; });
    const dirtyRatios = Object.keys(ratioDirty).filter(function (name) { return ratioDirty[name]; });

    if (!dirtyNames.length && !dirtyRatios.length) {
      alert('Nada foi alterado nesta sessão — nada para copiar. Selecione um elemento e mova/edite algo primeiro.');
      return;
    }

    let output = '/* ===== ALTERAÇÕES DESTA SESSÃO (apenas o que foi tocado) ===== */\n\n';

    ratioEls.forEach(function (el) {
      const varName = el.dataset.ratioVar;
      if (ratioDirty[varName]) {
        output += '/* ratio ' + (el.dataset.ratioLabel || varName) + ' */\n';
        output += varName + ': ' + el.style.getPropertyValue(varName) + ';\n\n';
      }
    });

    dirtyNames.forEach(function (name) {
      const s = state[name];
      output += '/* ' + name + ' */\n';

      Object.keys(s).forEach(function (prop) {
        if (prop === 'rotation') {
          output += 'rotation: ' + s[prop] + 'deg;\n';
        } else {
          output += prop + ': ' + s[prop].toFixed(2) + '%;\n';
        }
      });

      output += '\n';
    });

    navigator.clipboard.writeText(output).then(function () {
      alert('Alterações copiadas! Cole aqui no chat com o Claude.');
    }).catch(function () {
      prompt('Copie o texto abaixo manualmente:', output);
    });
  });
}

/* ============================================
   SEÇÃO 01 - WHY APPLY: PIN + SCROLL SCRUBBING
============================================ */
function initWhyApplyTimeline() {
  const pinWrapper = document.getElementById('whyApplyPinWrapper');
  const lineFill = document.getElementById('whyApplyLineFill');
  const dots = document.querySelectorAll('.why-apply__dot');
  const cards = document.querySelectorAll('.why-apply__card');
  const header = document.getElementById('header');

  if (!pinWrapper || !lineFill || !dots.length || !cards.length || !header) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (reduceMotion || isMobile) {
    lineFill.style.width = '100%';
    dots.forEach(function (dot) {
      dot.style.opacity = '1';
      dot.style.transform = 'scale(1)';
    });
    cards.forEach(function (card) {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    return;
  }

  const total = dots.length;
  const ITEM_SPAN = 0.4;

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getGlobalProgress() {
    const rect = pinWrapper.getBoundingClientRect();
    const headerHeight = header.offsetHeight;
    const startScroll = headerHeight;
    const scrollable = pinWrapper.offsetHeight - window.innerHeight;

    if (scrollable <= 0) return 1;

    const raw = (startScroll - rect.top) / scrollable;
    return clamp(raw, 0, 1);
  }

  function getItemProgress(globalProgress, index) {
    const spacing = (1 - ITEM_SPAN) / (total - 1);
    const itemStart = index * spacing;
    const itemEnd = itemStart + ITEM_SPAN;

    const raw = (globalProgress - itemStart) / (itemEnd - itemStart);
    return clamp(raw, 0, 1);
  }

  function update() {
    const globalProgress = getGlobalProgress();

    lineFill.style.width = (globalProgress * 100).toFixed(2) + '%';

    dots.forEach(function (dot, i) {
      const p = getItemProgress(globalProgress, i);
      const eased = easeOutBack(p);

      const opacity = clamp(p * 1.6, 0, 1);
      const scale = 0.3 + 0.7 * eased;

      dot.style.opacity = opacity;
      dot.style.transform = 'scale(' + scale.toFixed(3) + ')';
    });

    cards.forEach(function (card, i) {
      const p = getItemProgress(globalProgress, i);
      const eased = easeOutCubic(p);
      const easedBack = easeOutBack(p);

      const opacity = clamp(p * 1.4, 0, 1);
      const translateY = 40 * (1 - eased);
      const scale = 0.9 + 0.1 * easedBack;

      const rotationStart = (i % 2 === 0) ? -7 : 7;
      const rotation = rotationStart * (1 - eased);

      card.style.opacity = opacity;
      card.style.transform =
        'translateY(' + translateY.toFixed(2) + 'px) ' +
        'rotate(' + rotation.toFixed(2) + 'deg) ' +
        'scale(' + scale.toFixed(3) + ')';
    });
  }

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  update();
}

/* ============================================
   SCROLL REVEAL GENÉRICO
============================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-fade, .reveal-fade-left');
  if (!revealEls.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
}

/* ============================================
   CTA INTRO: EFEITO DE FOLHINHAS VOANDO
============================================ */
function initLeafEffect() {
  const zone = document.getElementById('ctaIntroLeafZone');
  if (!zone) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const LEAF_COLORS = ['#77DF40', '#FFD600', '#5BC72E'];
  let isVisible = false;
  let spawnTimer = null;

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createLeafSVG(color) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute(
      'd',
      'M12 2C7 2 2 7 2 14c0 4 3 8 10 8s10-4 10-8C22 7 17 2 12 2z'
    );
    path.setAttribute('fill', color);

    const vein = document.createElementNS(svgNS, 'path');
    vein.setAttribute('d', 'M12 4 L12 20');
    vein.setAttribute('stroke', 'rgba(0,0,0,0.15)');
    vein.setAttribute('stroke-width', '1');

    svg.appendChild(path);
    svg.appendChild(vein);
    return svg;
  }

  function spawnLeaf() {
    const size = randomBetween(10, 20);
    const startLeft = randomBetween(0, 90);
    const duration = randomBetween(4, 7);
    const drift = randomBetween(-80, 80);
    const fall = randomBetween(180, 260);
    const spin = randomBetween(180, 540) * (Math.random() > 0.5 ? 1 : -1);
    const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];

    const leaf = document.createElement('div');
    leaf.className = 'cta-leaf';
    leaf.style.width = size + 'px';
    leaf.style.height = size + 'px';
    leaf.style.left = startLeft + '%';
    leaf.style.setProperty('--leaf-drift', drift + 'px');
    leaf.style.setProperty('--leaf-fall', fall + 'px');
    leaf.style.setProperty('--leaf-spin', spin + 'deg');
    leaf.style.animationDuration = duration + 's';

    leaf.appendChild(createLeafSVG(color));
    zone.appendChild(leaf);

    leaf.addEventListener('animationend', function () {
      leaf.remove();
    });
  }

  function startSpawning() {
    if (spawnTimer) return;
    spawnTimer = setInterval(function () {
      spawnLeaf();
    }, randomBetween(900, 1600));
  }

  function stopSpawning() {
    clearInterval(spawnTimer);
    spawnTimer = null;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        startSpawning();
      } else {
        stopSpawning();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(zone);
}

/* ============================================
   CTA INTRO: PERSONAGEM CAMINHANDO
============================================ */
function initCharacterWalk() {
  const character = document.getElementById('ctaIntroCharacter');
  if (!character) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        character.classList.add('is-walking');
        observer.unobserve(character);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(character);
}

/* ============================================
   CTA INTRO: COUNTDOWN 0% → 100%
============================================ */
function initPercentCounter() {
  const counter = document.getElementById('ctaIntroCounter');
  if (!counter) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    counter.textContent = '100%';
    return;
  }

  const TARGET = 100;
  const DURATION = 1800;

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function runCounter() {
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOutQuart(progress);
      const value = Math.round(eased * TARGET);

      counter.textContent = value + '%';

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        runCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(counter);
}

/* ============================================
   CTA PURPOSE: FUSCA CHEGANDO
============================================ */
function initCarDriveIn() {
  const ctaPurpose = document.getElementById('cta-purpose');
  const car = document.getElementById('ctaPurposeCar');
  const caco = document.getElementById('ctaPurposeCaco');
  
  if (!ctaPurpose || !car || !caco) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (reduceMotion || isMobile) {
    ctaPurpose.classList.add('is-animated');
    return;
  }

  const carFinalRot = parseFloat(car.dataset.finalRotation || 0);
  const cacoFinalRot = parseFloat(caco.dataset.finalRotation || 43);

  const CAR_START_TRANSLATE_X = 45;
  const CAR_START_ROTATE_OFFSET = -7; 
  
  const CACO_START_TRANSLATE_X = 20;
  const CACO_START_ROTATE_OFFSET = -25;

  car.style.opacity = '0';
  car.style.transform = `translateX(${CAR_START_TRANSLATE_X}%) rotate(${carFinalRot + CAR_START_ROTATE_OFFSET}deg)`;
  
  caco.style.opacity = '0';
  caco.style.transform = `translateX(${CACO_START_TRANSLATE_X}%) rotate(${cacoFinalRot + CACO_START_ROTATE_OFFSET}deg)`;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        
        car.style.transition = 'transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) 0.1s, opacity 1.2s ease-out 0.1s';
        car.style.opacity = '1';
        car.style.transform = `translateX(0%) rotate(${carFinalRot}deg)`;

        caco.style.transition = 'transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 1.2s ease-out';
        caco.style.opacity = '1';
        caco.style.transform = `translateX(0%) rotate(${cacoFinalRot}deg)`;

        observer.unobserve(ctaPurpose);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(ctaPurpose);
}

/* ============================================
   SEÇÃO 05 - KICKSTART: MORPH + FADE DO CONTEÚDO
============================================ */
function initKickstartMorph() {
  const pinWrapper = document.getElementById('kickstartPinWrapper');
  const pinInner = document.getElementById('kickstartPinInner');
  const content = document.getElementById('kickstartContent');
  const clone = document.getElementById('kickstartMorphClone');
  const targetPill = document.getElementById('kickstartTargetPill');
  const header = document.getElementById('header');

  if (!pinWrapper || !pinInner || !content || !clone || !targetPill || !header) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (reduceMotion || isMobile) {
    content.style.opacity = '1';
    clone.style.display = 'none';
    targetPill.style.opacity = '1';
    return;
  }

  const MORPH_END = 0.55;
  const CONTENT_FADE_END = 0.35;

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function getGlobalProgress() {
    const rect = pinWrapper.getBoundingClientRect();
    const headerHeight = header.offsetHeight;
    const scrollable = pinWrapper.offsetHeight - window.innerHeight;

    if (scrollable <= 0) return 1;

    const raw = (headerHeight - rect.top) / scrollable;
    return clamp(raw, 0, 1);
  }

  let lastPhase = null;

  function update() {
    const progress = getGlobalProgress();

    const contentProgress = clamp(progress / CONTENT_FADE_END, 0, 1);
    content.style.opacity = contentProgress.toFixed(3);

    const morphProgress = clamp(progress / MORPH_END, 0, 1);

    if (morphProgress >= 1) {
      if (lastPhase !== 'pill') {
        clone.style.display = 'none';
        targetPill.style.opacity = '1';
        lastPhase = 'pill';
      }
      return;
    }

    if (lastPhase !== 'full') {
      clone.style.display = 'block';
      targetPill.style.opacity = '0';
      lastPhase = 'full';
    }

    const eased = easeInOutCubic(morphProgress);

    const pinRect = pinInner.getBoundingClientRect();
    const pillRect = targetPill.getBoundingClientRect();

    const startTop = 0;
    const startLeft = 0;
    const startWidth = pinRect.width;
    const startHeight = pinRect.height;

    const endTop = pillRect.top - pinRect.top;
    const endLeft = pillRect.left - pinRect.left;
    const endWidth = pillRect.width;
    const endHeight = pillRect.height;

    const currentTop = startTop + (endTop - startTop) * eased;
    const currentLeft = startLeft + (endLeft - startLeft) * eased;
    const currentWidth = startWidth + (endWidth - startWidth) * eased;
    const currentHeight = startHeight + (endHeight - startHeight) * eased;
    const currentRadius = 999 * eased;

    clone.style.top = currentTop + 'px';
    clone.style.left = currentLeft + 'px';
    clone.style.width = currentWidth + 'px';
    clone.style.height = currentHeight + 'px';
    clone.style.borderRadius = currentRadius + 'px';
  }

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  update();
}
