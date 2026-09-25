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

  console.log(
    'Parallax Hero inicializado ✅ | ' +
    repelEls.length + ' elemento(s) repel | ' +
    tiltEls.length + ' elemento(s) tilt'
  );

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
   As 4 camadas de imagem se movem sutilmente com
   base na posição do mouse em relação ao centro da
   seção - cada camada tem uma "profundidade"
   diferente (data-depth), criando sensação de 3D.
============================================ */
function initAwardsParallax() {
  const stage = document.getElementById('awardsStage');
  const depthEls = document.querySelectorAll('#awardsStage [data-parallax="depth"]');
  if (!stage || !depthEls.length) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse) return;

  console.log('Parallax Awards inicializado ✅ | ' + depthEls.length + ' camada(s)');

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

    const normX = (relX - 0.5) * 2; // -1 a 1
    const normY = (relY - 0.5) * 2;

    state.forEach(function (item) {
      item.targetX = normX * item.depth;
      item.targetY = normY * item.depth * 0.6; // movimento vertical mais discreto
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
   EDITOR VISUAL UNIVERSAL (ativa com ?edit=1)
============================================ */
function initPositionEditor() {
  const editableEls = document.querySelectorAll('[data-editable]');
  const ratioEls = document.querySelectorAll('[data-ratio-var]');
  if (!editableEls.length) return;

  document.body.classList.add('position-editor-active');

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
    const min = el.dataset.ratioMin || 300;
    const max = el.dataset.ratioMax || 900;
    const current = getComputedStyle(el).getPropertyValue(varName).trim() || min;

    ratioHtml +=
      '<div class="position-editor__ratio">' +
        '<label>Altura "' + label + '" (' + varName + ': <span data-ratio-display="' + i + '">' + current + '</span>)</label>' +
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
      '2. Use as setas do teclado para mover (Shift = passo maior).<br><br>' +
      '3. Ou digite valores exatos nos campos Top / Left / Width.<br><br>' +
      '4. Ajuste alturas de seções inteiras nas barrinhas rosa no topo.<br><br>' +
      '5. Quando terminar, clique em "Copiar tudo" e cole no chat.' +
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

  editableEls.forEach(function (el) {
    const name = el.dataset.editable;

    const item = document.createElement('div');
    item.className = 'position-editor__item';
    item.dataset.itemFor = name;
    item.innerHTML =
      '<button type="button" class="position-editor__select" data-target="' + name + '">' + name + '</button>' +
      '<label>Top % <input type="number" step="0.1" data-prop="top" data-target="' + name + '"></label>' +
      '<label>Left % <input type="number" step="0.1" data-prop="left" data-target="' + name + '"></label>' +
      '<label>Width % <input type="number" step="0.1" data-prop="width" data-target="' + name + '"></label>';
    list.appendChild(item);

    el.addEventListener('click', function (e) {
      e.stopPropagation();
      selectElement(el);
    });
  });

  function getPercent(el, prop) {
    const parent = el.offsetParent || el.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    if (prop === 'top') return ((rect.top - parentRect.top) / parentRect.height * 100).toFixed(2);
    if (prop === 'left') return ((rect.left - parentRect.left) / parentRect.width * 100).toFixed(2);
    if (prop === 'width') return (rect.width / parentRect.width * 100).toFixed(2);
  }

  function selectElement(el) {
    if (selected) selected.classList.remove('is-selected');
    document.querySelectorAll('.position-editor__item').forEach(function (i) {
      i.classList.remove('is-active');
    });

    selected = el;
    el.classList.add('is-selected');

    const name = el.dataset.editable;
    const activeItem = panel.querySelector('[data-item-for="' + name + '"]');
    if (activeItem) activeItem.classList.add('is-active');

    updateInputs();
  }

  function updateInputs() {
    if (!selected) return;
    const name = selected.dataset.editable;
    panel.querySelectorAll('input[data-prop][data-target="' + name + '"]').forEach(function (input) {
      input.value = getPercent(selected, input.dataset.prop);
    });
  }

  panel.addEventListener('click', function (e) {
    if (e.target.matches('.position-editor__select')) {
      const name = e.target.dataset.target;
      const el = document.querySelector('[data-editable="' + name + '"]');
      selectElement(el);
    }
  });

  panel.addEventListener('input', function (e) {
    if (e.target.matches('input[data-prop]')) {
      const name = e.target.dataset.target;
      const prop = e.target.dataset.prop;
      const el = document.querySelector('[data-editable="' + name + '"]');
      el.style[prop] = e.target.value + '%';
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!selected) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) === -1) return;

    e.preventDefault();
    const step = e.shiftKey ? 1 : 0.2;
    let prop, dir;

    if (e.key === 'ArrowUp')    { prop = 'top';  dir = -1; }
    if (e.key === 'ArrowDown')  { prop = 'top';  dir = 1; }
    if (e.key === 'ArrowLeft')  { prop = 'left'; dir = -1; }
    if (e.key === 'ArrowRight') { prop = 'left'; dir = 1; }

    const current = parseFloat(getPercent(selected, prop));
    const next = (current + dir * step).toFixed(2);
    selected.style[prop] = next + '%';
    updateInputs();
  });

  panel.querySelector('.position-editor__copy').addEventListener('click', function () {
    let output = '/* ===== CONFIGURAÇÃO FINAL DE POSIÇÃO ===== */\n\n';

    ratioEls.forEach(function (el) {
      const varName = el.dataset.ratioVar;
      output += '/* ratio ' + (el.dataset.ratioLabel || varName) + ' */\n';
      output += varName + ': ' + el.style.getPropertyValue(varName) + ';\n\n';
    });

    editableEls.forEach(function (el) {
      const name = el.dataset.editable;
      output += '/* ' + name + ' */\n';
      output += 'top: ' + getPercent(el, 'top') + '%;\n';
      output += 'left: ' + getPercent(el, 'left') + '%;\n';
      output += 'width: ' + getPercent(el, 'width') + '%;\n\n';
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

  if (!pinWrapper || !lineFill || !dots.length || !cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (reduceMotion || isMobile) {
    console.log('Timeline "Why Apply": pin/scrub desabilitado (mobile ou reduced motion).');
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
    const wrapperTop = rect.top + window.scrollY;
    const wrapperHeight = pinWrapper.offsetHeight;
    const scrollable = wrapperHeight - window.innerHeight;

    if (scrollable <= 0) return 1;

    const raw = (window.scrollY - wrapperTop) / scrollable;
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

  console.log('Timeline "Why Apply" inicializada ✅ | ' + total + ' itens | pin + scrub ativo');
}

/* ============================================
   SCROLL REVEAL GENÉRICO
   Observa tanto .reveal-fade (baixo→cima) quanto
   .reveal-fade-left (esquerda→direita).
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

  console.log('Scroll reveal inicializado ✅ | ' + revealEls.length + ' bloco(s)');
}

/* ============================================
   CTA INTRO: EFEITO DE FOLHINHAS VOANDO
============================================ */
function initLeafEffect() {
  const zone = document.getElementById('ctaIntroLeafZone');
  if (!zone) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    console.log('Efeito de folhinhas desabilitado (prefers-reduced-motion).');
    return;
  }

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

  console.log('Efeito de folhinhas inicializado ✅');
}

/* ============================================
   CTA INTRO: PERSONAGEM CAMINHANDO
============================================ */
function initCharacterWalk() {
  const character = document.getElementById('ctaIntroCharacter');
  if (!character) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    console.log('Caminhada da personagem desabilitada (prefers-reduced-motion).');
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        character.classList.add('is-walking');
        observer.unobserve(character);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(character);

  console.log('Caminhada da personagem inicializada ✅');
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

  console.log('Countdown "100%" inicializado ✅');
}
