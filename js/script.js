/* ============================================
   AGIBANK - PROGRAMA DE ESTÁGIO LP
   JavaScript principal
============================================ */

document.addEventListener('DOMContentLoaded', function () {
  console.log('Agibank LP - Estágio carregada com sucesso ✅');

  const editMode = new URLSearchParams(window.location.search).get('edit') === '1';

  initHeaderScroll();
  initMobileMenu();

  if (editMode) {
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
   HERO: PARALLAX "FOGE DO MOUSE"
   (só roda fora do modo de edição)
============================================ */
function initHeroParallax() {
  const heroBanner = document.getElementById('hero-banner');
  const cacos = document.querySelectorAll('[data-parallax]');
  if (!heroBanner || !cacos.length) return;

  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasMouse) return;

  const repelRadius = 220;

  const state = Array.from(cacos).map((el) => ({
    el: el,
    strength: parseFloat(el.dataset.strength) || 30,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0
  }));

  heroBanner.addEventListener('mousemove', function (e) {
    const rect = heroBanner.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    state.forEach(function (item) {
      const elRect = item.el.getBoundingClientRect();
      const elCenterX = elRect.left - rect.left + elRect.width / 2;
      const elCenterY = elRect.top - rect.top + elRect.height / 2;

      const dx = elCenterX - mouseX;
      const dy = elCenterY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < repelRadius) {
        const force = (repelRadius - distance) / repelRadius;
        const angle = Math.atan2(dy, dx);
        item.targetX = Math.cos(angle) * force * item.strength;
        item.targetY = Math.sin(angle) * force * item.strength;
      } else {
        item.targetX = 0;
        item.targetY = 0;
      }
    });
  });

  heroBanner.addEventListener('mouseleave', function () {
    state.forEach(function (item) {
      item.targetX = 0;
      item.targetY = 0;
    });
  });

  function animate() {
    state.forEach(function (item) {
      item.currentX += (item.targetX - item.currentX) * 0.1;
      item.currentY += (item.targetY - item.currentY) * 0.1;
      item.el.style.transform = 'translate(' + item.currentX.toFixed(2) + 'px, ' + item.currentY.toFixed(2) + 'px)';
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   EDITOR VISUAL DO HERO
   Ativa com ?edit=1 na URL
============================================ */
function initHeroEditor() {
  const editableEls = document.querySelectorAll('[data-editable]');
  if (!editableEls.length) return;

  document.body.classList.add('hero-editor-active');

  // Badge indicando modo edição
  const badge = document.createElement('div');
  badge.className = 'hero-editor__badge';
  badge.textContent = '🛠 MODO EDIÇÃO ATIVO';
  document.body.appendChild(badge);

  // Painel lateral
  const panel = document.createElement('div');
  panel.className = 'hero-editor';
  panel.innerHTML =
    '<div class="hero-editor__header">' +
      '<strong>Editor do Hero</strong>' +
      '<button type="button" class="hero-editor__copy">Copiar configuração</button>' +
    '</div>' +
    '<div class="hero-editor__list"></div>' +
    '<div class="hero-editor__hint">' +
      '1. Clique num elemento na tela (ou no nome dele aqui) para selecionar.<br><br>' +
      '2. Use as setas do teclado para mover (Shift = passo maior).<br><br>' +
      '3. Ou digite valores exatos nos campos Top / Left / Width.<br><br>' +
      '4. Quando terminar tudo, clique em "Copiar configuração" e cole no chat.' +
    '</div>';
  document.body.appendChild(panel);

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
      // fallback caso o clipboard falhe (ex: navegador corporativo bloqueando)
      prompt('Copie o texto abaixo manualmente:', output);
    });
  });
}
