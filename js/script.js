/* ============================================
   AGIBANK - PROGRAMA DE ESTÁGIO LP
   JavaScript principal

   CHANGELOG:
   - [SIMPLIFICADO] initAreasAccordion(): substitui initAreasStack().
     Acordeão simples: clique no header abre/fecha via toggle de
     classe .is-open (o CSS faz todo o trabalho via grid-template-rows).
     Sem scroll, sem sticky, sem cálculo de posição — só um listener
     de clique por item.
============================================ */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Agibank LP - Estágio carregada com sucesso ✅');

  const editMode = new URLSearchParams(window.location.search).get('edit') === '1';

  initHeaderScroll();
  initMobileMenu();
  initWhyApplyTimeline();
  initScrollReveal();
  initLeafEffect();
  initCharacterWalk();
  initPercentCounter();
  initKickstartMorph();
  initIaIconHover();
  initRequirementsCascade();
  initAreasAccordion();

  if (editMode) {
    console.log('🛠 Modo edição ativo — parallax desabilitado propositalmente.');
    initPositionEditor();
  } else {
    initHeroParallax();
    initAwardsParallax();
    initCarDriveIn();
    initCacoMouseParallax();
    initReqGirlParallax();
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

      // Fecha todos os outros (comportamento de acordeão — só um
      // aberto por vez, igual ao que já usamos nos outros dropdowns
      // do site).
      items.forEach(function (i) { i.classList.remove('is-open'); });

      if (!wasOpen) {
        item.classList.add('is-open');
      }
    });
  });
}
