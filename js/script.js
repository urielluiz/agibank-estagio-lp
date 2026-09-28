/* ============================================
   AGIBANK - PROGRAMA DE ESTÁGIO LP
   JavaScript principal
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
  const strength = 15; // px de deslocamento máximo

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
   EDITOR VISUAL UNIVERSAL (ativa com ?edit=1)
============================================ */
function initPositionEditor() {
  const editableEls = document.querySelectorAll('[data-editable]');
  const ratioEls = document.querySelectorAll('[data-ratio-var]');
  if (!editableEls.length) return;

  document.body.classList.add('position-editor-active');

  const state = {};

  function getFields(el) {
    return (el.dataset.editableFields || 'top,left,width').split(',');
  }

  function readInitialValue(el, prop) {
    const parent = el.offsetParent || el.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const computed = getComputedStyle(el);

    if (prop === 'top') {
      const px = parseFloat(computed.top) || 0;
      return (px / parentRect.height * 100);
    }
    if (prop === 'left') {
      const px = parseFloat(computed.left) || 0;
      return (px / parentRect.width * 100);
    }
    if (prop === 'width') {
      const rect = el.getBoundingClientRect();
      return (rect.width / parentRect.width * 100);
    }
    if (prop === 'height') {
      const rect = el.getBoundingClientRect();
      return (rect.height / parentRect.height * 100);
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
  badge.textContent = '🛠 MODO EDIÇÃO ATIVO';
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

    ratioHtml +=
      '<div class="position-editor__ratio">' +
        '<label>' + label + ' (' + varName + ': <span data-ratio-display="' + i + '">' + current + '</span>)</label>' +
        '<input type="range" data-ratio-input="' + i + '" data-ratio-var="' + varName + '" data-ratio-target="' + i + '" min="' + min + '" max="' + max + '" step="5" value="' + current + '">' +
      '</div>';
  });

  panel.innerHTML =
    '<div class="position-editor__header">' +
      '<strong>Editor de Posição</strong>' +
      '<button type="button" class="position-editor__copy">Copiar tudo</button>' +
    '</div>' +
    ratioHtml +
    '<div class="position-editor__list"></div>' +
    '<div class="position-editor__hint">' +
      '1. Clique num elemento na tela (ou no nome dele aqui) para selecionar.<br><br>' +
      '2. Use as setas do teclado para mover Top/Left (Shift = passo maior).<br><br>' +
      '3. Ou digite valores exatos nos campos.<br><br>' +
      '4. Ajuste alturas nas barrinhas rosa.<br><br>' +
      '5. Quando terminar, clique em "Copiar tudo".' +
    '</div>';
  document.body.appendChild(panel);

  panel.querySelectorAll('[data-ratio-input]').forEach(function (input, i) {
    input.addEventListener('input', function () {
      const el = ratioEls[i];
      const varName = input.dataset.ratioVar;
      el.style.setProperty(varName, input.value);
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
      const el = document.querySelector('[data-editable="' + name + '"]');
      selectElement(el, name);
    }
  });

  panel.addEventListener('input', function (e) {
    if (!e.target.matches('input[data-prop]')) return;

    const name = e.target.dataset.target;
    const prop = e.target.dataset.prop;
    const el = document.querySelector('[data-editable="' + name + '"]');
    const value = parseFloat(e.target.value) || 0;

    state[name][prop] = value;
    applyState(el, name);
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
    updateInputs();
  });

  panel.querySelector('.position-editor__copy').addEventListener('click', function () {
    let output = '/* ===== CONFIGURAÇÃO FINAL DE POSIÇÃO ===== */\n\n';

    ratioEls.forEach(function (el) {
      const varName = el.dataset.ratioVar;
      output += '/* ratio ' + (el.dataset.ratioLabel || varName) + ' */\n';
      output += varName + ': ' + el.style.getPropertyValue(varName) + ';\n\n';
    });

    Object.keys(state).forEach(function (name) {
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
      alert('Configuração copiada! Cole aqui no chat com o Claude.');
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
