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

  if (editMode) {
    console.log('🛠 Modo edição ativo — parallax do Hero desabilitado propositalmente.');
    initHeroEditor();
  } else {
    initHeroParallax();
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
   HERO: EDITOR VISUAL (ativa com ?edit=1)
============================================ */
function initHeroEditor() {
  const editableEls = document.querySelectorAll('[data-editable]');
  const heroStage = document.getElementById('heroStage');
  if (!editableEls.length || !heroStage) return;

  document.body.classList.add('hero-editor-active');

  const badge = document.createElement('div');
  badge.className = 'hero-editor__badge';
  badge.textContent = '🛠 MODO EDIÇÃO ATIVO';
  document.body.appendChild(badge);

  const currentRatio = getComputedStyle(heroStage).getPropertyValue('--hero-ratio-h').trim() || '650';

  const panel = document.createElement('div');
  panel.className = 'hero-editor';
  panel.innerHTML =
    '<div class="hero-editor__header">' +
      '<strong>Editor do Hero</strong>' +
      '<button type="button" class="hero-editor__copy">Copiar configuração</button>' +
    '</div>' +
    '<div class="hero-editor__ratio">' +
      '<label>Altura do Hero (proporção 1440 / <span id="heroRatioValue">' + currentRatio + '</span>)</label>' +
      '<input type="range" id="heroRatioInput" min="450" max="850" step="5" value="' + currentRatio + '">' +
    '</div>' +
    '<div class="hero-editor__list"></div>' +
    '<div class="hero-editor__hint">' +
      '1. Clique num elemento na tela (ou no nome dele aqui) para selecionar.<br><br>' +
      '2. Use as setas do teclado para mover (Shift = passo maior).<br><br>' +
      '3. Ou digite valores exatos nos campos Top / Left / Width.<br><br>' +
      '4. Ajuste a altura geral do Hero na barrinha rosa no topo.<br><br>' +
      '5. Quando terminar tudo, clique em "Copiar configuração" e cole no chat.' +
    '</div>';
  document.body.appendChild(panel);

  const ratioInput = panel.querySelector('#heroRatioInput');
  const ratioValue = panel.querySelector('#heroRatioValue');

  ratioInput.addEventListener('input', function () {
    heroStage.style.setProperty('--hero-ratio-h', ratioInput.value);
    ratioValue.textContent = ratioInput.value;
  });

  const list = panel.querySelector('.hero-editor__list');
  let selected = null;

  editableEls.forEach(function (el) {
    const name = el.dataset.editable;

    const item = document.createElement('div');
    item.className = 'hero-editor__item';
    item.dataset.itemFor = name;
    item.innerHTML =
      '<button type="button" class="hero-editor__select" data-target="' + name + '">' + name + '</button>' +
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
    document.querySelectorAll('.hero-editor__item').forEach(function (i) {
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
    panel.querySelectorAll('input[data-target="' + name + '"]').forEach(function (input) {
      input.value = getPercent(selected, input.dataset.prop);
    });
  }

  panel.addEventListener('click', function (e) {
    if (e.target.matches('.hero-editor__select')) {
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

  panel.querySelector('.hero-editor__copy').addEventListener('click', function () {
    let output = '/* ===== CONFIGURAÇÃO FINAL DO HERO ===== */\n\n';
    output += '/* hero-stage (altura da seção) */\n';
    output += 'aspect-ratio-height: ' + heroStage.style.getPropertyValue('--hero-ratio-h') + ';\n\n';

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
   SEÇÃO 01 - WHY APPLY: SCROLL SCRUBBING
   Cada elemento (linha, bolinhas, cards) tem seu
   progresso calculado diretamente a partir da
   posição de scroll — 100% reversível: rolar para
   cima desfaz a animação exatamente pelo caminho
   inverso, sem "trava" de estado.
============================================ */
function initWhyApplyTimeline() {
  const wrapper = document.getElementById('whyApplyReveal');
  const lineFill = document.getElementById('whyApplyLineFill');
  const dots = document.querySelectorAll('.why-apply__dot');
  const cards = document.querySelectorAll('.why-apply__card');

  if (!wrapper || !lineFill || !dots.length || !cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    console.log('Timeline "Why Apply": prefers-reduced-motion ativo, animação desabilitada.');
    return;
  }

  const total = dots.length;
  const ITEM_SPAN = 0.4; // cada item "ocupa" 40% do progresso total (com sobreposição/stagger)

  /* ---------- Funções de easing ---------- */
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

  /* ---------- Progresso geral (0 a 1) do bloco inteiro ----------
     Baseado na altura TOTAL do bloco (linha + cards), não mais
     apenas na linha isolada — isso dá um percurso de scroll bem
     maior, corrigindo a velocidade excessiva de antes. */
  function getGlobalProgress() {
    const rect = wrapper.getBoundingClientRect();
    const vh = window.innerHeight;

    const start = vh * 0.82;                 // início: bloco ainda baixo na tela
    const end = vh * 0.18 - rect.height;      // fim: bloco já quase saindo por cima

    const total = start - end;
    const raw = (start - rect.top) / total;

    return clamp(raw, 0, 1);
  }

  /* ---------- Progresso individual de cada item, com stagger ---------- */
  function getItemProgress(globalProgress, index) {
    const spacing = (1 - ITEM_SPAN) / (total - 1);
    const itemStart = index * spacing;
    const itemEnd = itemStart + ITEM_SPAN;

    const raw = (globalProgress - itemStart) / (itemEnd - itemStart);
    return clamp(raw, 0, 1);
  }

  function update() {
    const globalProgress = getGlobalProgress();

    // Linha pontilhada - acompanha o progresso geral, 1:1
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

      // Rotação alternada por card (par entra da esquerda, ímpar da direita)
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

  update(); // estado inicial correto, sem esperar o primeiro scroll

  console.log('Timeline "Why Apply" inicializada ✅ | ' + total + ' itens | scroll-scrubbing ativo');
}
