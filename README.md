# Programa de Estágio Agibank 2027 — Landing Page

Landing page institucional para divulgação do Programa de Estágio Agibank,
edição 2027. Site desenvolvido 100% em HTML5, CSS3 e JavaScript vanilla
(sem frameworks, sem bundlers, sem pré-processadores).

---

## 📦 Stack Técnica

- **HTML5** semântico
- **CSS3** puro (variáveis nativas via `:root`, Grid, Flexbox, `clip-path`,
  `mask-image`, `aspect-ratio`)
- **JavaScript ES6** vanilla (sem jQuery, sem React/Vue, sem build step)
- **Font Awesome 6** via CDN (ícones)
- **Fontes customizadas**: Agibank Sans (5 pesos: Thin, Light, Regular,
  Medium, Bold), formato `.woff2`, carregadas via `@font-face`

Não há `package.json`, não há processo de build. O projeto roda abrindo
o `index.html` diretamente ou hospedando os arquivos estáticos em
qualquer servidor/CDN (foi desenvolvido e testado no GitHub Pages).

---

## 📁 Estrutura de Pastas
├── index.html          → Toda a estrutura HTML do site (single page)
├── css/
│   └── style.css       → Todo o CSS do projeto (um único arquivo)
├── js/
│   └── script.js       → Todo o JavaScript do projeto (um único arquivo)
└── assets/
├── fonts/          → Arquivos .woff2 da fonte Agibank Sans
└── img/            → Todas as imagens, ilustrações e ícones

**Importante**: os caminhos de imagem no HTML/CSS são todos **relativos**
(ex: `assets/img/arquivo.png`). Se a estrutura de pastas for alterada,
os caminhos precisam ser ajustados em conjunto.

---

## 🎨 Design Tokens (Variáveis CSS)

Todas as cores, tipografia, espaçamentos e breakpoints estão centralizados
como variáveis CSS dentro do seletor `:root`, no topo do arquivo `style.css`.

**Cores principais:**
```css
--color-blue: #0064F9
--color-green: #77DF40
--color-navy: #000F44
--color-blue-medium: #0033B0
--color-yellow: #FFD600

Espaçamentos padronizados (escala consistente usada em todo o site):
--space-xs: 8px    --space-sm: 16px   --space-md: 24px
--space-lg: 40px   --space-xl: 64px   --space-2xl: 96px

Ao fazer qualquer alteração de cor ou espaçamento, prefira editar a
variável no :root ao invés de alterar valores fixos espalhados pelo
código — isso mantém a consistência visual em todas as seções que
reutilizam aquele token.

Arquitetura das Seções ("Stage System")
Várias seções (Hero, CTA Intro, Awards, CTA Purpose) usam um padrão de
composição chamado internamente de "stage":
<section class="nome-secao">
  <div class="nome-secao__stage" style="aspect-ratio: 1440 / VALOR_H;">
    <!-- elementos posicionados com position: absolute e top/left em % -->
  </div>
</section>

• O .stage mantém uma proporção fixa (aspect-ratio) baseada no design original em 1440px de largura.
• Todos os elementos internos (ilustrações, textos, botões) são posicionados com position: absolute e coordenadas em porcentagem (top, left, width), o que os mantém proporcionalmente alinhados conforme   a tela redimensiona.
• Essa técnica só funciona bem em telas largas (desktop). Por isso, em todos os breakpoints de tablet (max-width: 1024px) e mobile (max-width: 767px), essas seções são convertidas para layout empilhado   (display: flex; flex-direction: column; ou display: grid em alguns casos), abandonando o posicionamento absoluto.

Ao editar uma seção que usa esse padrão, lembre-se: uma alteração no desktop (fora de media query) não afeta tablet/mobile, e vice-versa — são sistemas de posicionamento completamente diferentes por breakpoint, não uma adaptação automática do mesmo sistema.

Responsividade — Breakpoints

O projeto usa 2 breakpoints principais, ambos no final do arquivo CSS:

Breakpoint	   Media Query	                Público-alvo
Tablet/iPad	   @media (max-width: 1024px)	  Tablets em geral
Mobile	       @media (max-width: 767px)	  Smartphones

Atenção — Media Queries Não São Mutuamente Exclusivas
Um erro comum (que já corrigimos uma vez neste projeto) é assumir que o
bloco de mobile "substitui" o de tablet. Isso não é verdade. Uma tela
de 375px de largura satisfaz as duas condições ao mesmo tempo
(max-width: 1024px E max-width: 767px). Como o bloco de tablet vem
antes no arquivo, qualquer propriedade definida lá e não
re-declarada no bloco mobile continua valendo no celular.

Regra prática: sempre que uma propriedade for alterada no bloco
tablet, verifique se ela também precisa de um valor específico no bloco
mobile — não assuma que "ficou de fora" significa "não se aplica".

Convenção de Nomenclatura CSS (BEM-like)
.bloco { }
.bloco__elemento { }
.bloco__elemento--modificador { }
.is-estado { }  /* ex: .is-active, .is-open, .is-visible */

Arquitetura JavaScript
Padrão safeRun
Todas as funções de inicialização são chamadas dentro de um único
DOMContentLoaded, através de um wrapper safeRun(fn, label):
function safeRun(fn, label) {
  try {
    fn();
  } catch (err) {
    console.error('❌ Erro ao executar "' + label + '":', err);
  }
}

safeRun(initHeaderScroll, 'initHeaderScroll');
safeRun(initMobileMenu, 'initMobileMenu');
// ... demais inicializações

Por quê: se uma função quebrar (por exemplo, por um elemento não
encontrado no DOM), o erro é isolado e logado no console, sem impedir
que as demais seções funcionem normalmente. Ao adicionar uma nova
funcionalidade, sempre registre a função de init através do safeRun.

Principais Funcionalidades JS por Seção

Seção	                   Função	                         O que faz
Header	                 initHeaderScroll	               Adiciona sombra ao header ao rolar a página
Header	                 initMobileMenu	                 Toggle do menu hambúrguer mobile
Hero	                   initHeroParallax	               Parallax de repulsão/tilt no mouse (desktop only)
Why Apply	               initWhyApplyTimeline	           Scroll-scrubbing da timeline (linha + dots + cards)
CTA Intro	               initLeafEffect	                 Geração dinâmica de folhas caindo (SVG via JS)
CTA Intro	               initCharacterWalk	             Animação de entrada do personagem andando
CTA Intro	               initPercentCounter	             Contador animado de 0% a 100%
Awards	                 initAwardsParallax	             Parallax de profundidade no mouse
CTA Purpose	             initCarDriveIn	                 Animação de entrada do Fusca
Kickstart	               initKickstartMorph	             Efeito de morphing (imagem "vira" uma pílula do grid via scroll)
Requirements	           initReqGirlParallax	           Parallax lateral no mouse
Requirements	           initRequirementsCascade	       Entrada em cascata dos cards ao rolar
Áreas	                   initAreasAccordion	             Lógica do acordeão (FAQ-style)
Depoimentos	             initTestimonials	               Alternância entre depoimentos via setas
Processo Seletivo	       initProcessSteps	               Arco SVG com scroll pinado (desktop); lista estática (tablet/mobile)
Proposta de Valor	       initValuePropVideo	             Facade pattern — carrega vídeo do YouTube só no clique
Mídia	                   initMediaCarousel	             Carrossel infinito (clonagem de itens)
Campus	                 initCampusCarousel	             Carrossel infinito com efeito "baralho" (z-index dinâmico)


Detecção de Preferências e Dispositivo
O JS verifica proativamente:

window.matchMedia('(prefers-reduced-motion: reduce)').matches
window.matchMedia('(hover: hover) and (pointer: fine)').matches
window.matchMedia('(max-width: 767px)').matches

Isso desativa animações complexas para usuários com preferência de
movimento reduzido, e desativa parallax de mouse em dispositivos touch
(que não têm cursor).

Efeitos Visuais Notáveis (documentação de "por que foi feito assim")
Fade nas bordas de carrosséis (Campus, Mídia): usa mask-image com gradiente linear para dissolver suavemente os cards laterais no fundo, ao invés de um corte abrupto.
Morphing do Kickstart: um elemento clone (.kickstart__morph-clone) interpola suas coordenadas absolutas (top/left/width/height/border-radius) do tamanho de uma imagem full-screen até o tamanho exato de uma pílula específica no grid, sincronizado ao progresso do scroll.
Arco SVG do Processo Seletivo: os 6 pontos são posicionados matematicamente via path.getPointAtLength(), garantindo que fiquem sempre perfeitamente alinhados à curva do SVG, independente de ajustes futuros no desenho do arco.

Dependências Externas
Font Awesome 6.5.1 (via CDN): https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css — usado para ícones de setas, chevrons, redes sociais e play button.
YouTube (embed sob demanda): o vídeo da seção "Proposta de Valor" só carrega o iframe do YouTube após o clique do usuário (Facade Pattern), para não pesar o carregamento inicial da página com scripts do YouTube desnecessariamente.

Nenhuma outra dependência externa (sem Google Fonts, sem jQuery, sem
analytics pré-configurado — se for necessário adicionar Google Analytics
ou tag manager, isso deve ser inserido manualmente no <head> do
index.html).

Compatibilidade de Navegadores
O projeto usa CSS moderno (aspect-ratio, clip-path, mask-image,
CSS Grid, custom properties). Funciona bem nas versões atuais de:
Chrome, Edge, Safari e Firefox (últimas 2 versões). Não foi testado nem
otimizado para Internet Explorer 11 ou navegadores muito antigos.

Como Rodar Localmente
Não há processo de build. Basta:

Abrir o arquivo index.html diretamente no navegador, ou
Servir a pasta com qualquer servidor estático simples, por exemplo:
# Python 3
python -m http.server 8000

# Node (com o pacote "serve")
npx serve .

Acessar http://localhost:8000 (ou porta equivalente).

Deploy
O projeto foi desenvolvido e testado no GitHub Pages, mas por ser
100% estático (HTML/CSS/JS puros), pode ser hospedado em qualquer
serviço de hospedagem estática (Netlify, Vercel, S3 + CloudFront,
servidor Apache/Nginx tradicional, etc.) sem nenhuma alteração de
código — basta fazer upload da estrutura de pastas tal como está.

Notas Finais
Este projeto foi construído de forma incremental, seção por seção, com
validação visual constante em desktop, tablet e mobile. Qualquer
alteração futura de layout deve ser testada nos 3 formatos de tela,
dado que — como explicado acima — as seções principais usam sistemas de
posicionamento distintos por breakpoint (absoluto no desktop, empilhado
no tablet/mobile).
