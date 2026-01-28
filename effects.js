/* ======================================================
   KRISI.SITE — CYBER GLASS MASTER UI (PRODUCTION CLEAN)
   Astra + Elementor
   ====================================================== */

/* ======================
   COLOR SYSTEM
====================== */
:root{
  --bg:#000000;
  --text:#E6F1FF;
  --muted:#9FB3C8;

  --cyan:#00F0FF;
  --cyan2:#4DEEFF;

  /* Accent variables (JS/section classes update these) */
  --accent:#00F0FF;
  --accent2:#4DEEFF;
}

*{ box-sizing:border-box; }

html, body{
  height:100%;
  background:#000 !important;
  color:var(--text);
  overflow-x:hidden;
}

body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}

/* Links */
a{ color:inherit; text-decoration:none !important; }

/* Reduced motion safety */
@media (prefers-reduced-motion: reduce){
  *{ animation:none !important; transition:none !important; }
}

/* Fix selection highlight + remove underline-on-select */
::selection{ background: rgba(0,240,255,.35); color: var(--text); }
::-moz-selection{ background: rgba(0,240,255,.35); color: var(--text); }
a::selection, a *::selection{ text-decoration:none !important; }

/* ======================
   FORCE ALL PAGES BLACK
====================== */
#page,
#content,
.site,
.site-content,
.ast-container,
.ast-container-fluid,
.site-main,
.content-area{
  background:#000 !important;
}

/* Elementor containers default transparent */
.elementor-section,
.elementor-container,
.e-con,
.e-con-inner{
  background:transparent !important;
}

/* ======================
   FULL-WIDTH SECTIONS (no cut-off glow)
====================== */
.elementor-section.elementor-section-boxed > .elementor-container,
.e-con.e-con-boxed,
.ast-container,
.ast-container-fluid{
  max-width: 100% !important;
  width: 100% !important;
}

.elementor-section.elementor-section-boxed,
.e-con.e-con-boxed{
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Don’t clip glow by default */
#page, #content, .site, .site-content,
.elementor-section, .e-con, .e-con-inner{
  overflow: visible !important;
}

/* Only these should clip their own glow */
.ambient-glow,
.wave-glow{
  overflow: hidden !important;
}

/* ======================
   LAYERING (IMPORTANT)
   Orbs + bg particles behind content, cursor above all
====================== */
.bg-orbs{
  position: fixed;
  inset: -20%;
  pointer-events: none;
  z-index: 0;
  opacity: .55;
  filter: blur(30px);
  mix-blend-mode: screen;
  background:
    radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--accent) 28%, transparent) 0%, transparent 55%),
    radial-gradient(circle at 78% 28%, color-mix(in srgb, var(--accent2) 20%, transparent) 0%, transparent 52%),
    radial-gradient(circle at 32% 78%, rgba(0,240,255,.10) 0%, transparent 58%),
    radial-gradient(circle at 82% 78%, rgba(168,85,247,.08) 0%, transparent 60%);
}

.bg-particles{
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

#page, #content, .site, .site-content, main, header, footer, .elementor{
  position: relative;
  z-index: 2;
}

/* Transition overlay above content */
.page-transition{
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999999;
}

/* Cursor is top-most */
.cursor-glow{ z-index: 9999999; }
.cursor-particle{ z-index: 9999998; }
.scroll-particle{ z-index: 9999997; }

/* ======================
   HEADER — PURE BLACK
====================== */
.ast-above-header-bar,
.ast-primary-header-bar,
.ast-header-break-point,
.ast-above-header-bar .ast-container,
.ast-primary-header-bar .ast-container{
  background:#000 !important;
  backdrop-filter:none !important;
  border-bottom:1px solid rgba(0,240,255,.12) !important;
  box-shadow: 0 0 18px rgba(0,240,255,.10);
}

/* ======================
   MENU LAYOUT
====================== */
.ast-above-header-bar .site-header-above-section-center{
  width:100%;
}

.ast-above-header-bar .site-header-above-section-center ul{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:90px;
}

.ast-above-header-bar .site-header-above-section-center li > a{
  font-size:24px;
  line-height:1;
}

/* Kill underline effects everywhere */
.main-navigation a::after,
.nav-menu a::after,
.ast-above-header-bar a::after,
.ast-primary-header-bar a::after{
  display:none !important;
}

/* ======================
   MENU — CYAN GLASS PILL
====================== */
.ast-above-header-bar a,
.ast-primary-header-bar a,
.main-navigation a{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:12px 26px;
  border-radius:999px;
  color:var(--text) !important;
  background:transparent;
  border:1px solid transparent;
  position:relative;
  transition:
    background .25s ease,
    box-shadow .25s ease,
    transform .15s ease,
    color .2s ease;
}

/* Glass sheen */
.ast-above-header-bar a::before,
.ast-primary-header-bar a::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:999px;
  opacity:0;
  background:linear-gradient(140deg,
    rgba(255,255,255,.35),
    rgba(255,255,255,.08) 40%,
    transparent 65%);
  transition:opacity .25s ease;
  pointer-events:none;
}

/* Hover */
.ast-above-header-bar a:hover,
.ast-primary-header-bar a:hover{
  background:linear-gradient(135deg,var(--cyan),var(--cyan2));
  color:#000 !important;
  box-shadow:
    0 0 14px rgba(0,240,255,.95),
    0 0 40px rgba(0,240,255,.55);
  transform:translateY(-1px) scale(1.05);
}
.ast-above-header-bar a:hover::before{ opacity:.6; }

/* Active breathing glow */
@keyframes breatheGlow{
  0%{ box-shadow:0 0 14px rgba(0,240,255,.6); }
  50%{ box-shadow:0 0 36px rgba(0,240,255,1); }
  100%{ box-shadow:0 0 14px rgba(0,240,255,.6); }
}

.current-menu-item > a,
.current_page_item > a{
  background:linear-gradient(135deg,var(--cyan),var(--cyan2));
  color:#000 !important;
  animation:breatheGlow 2.8s ease-in-out infinite;
}

/* ======================
   HERO GLOW TEXT
====================== */
.hero-title .accent{
  color:var(--cyan) !important;
  text-shadow:
    0 0 16px rgba(0,240,255,.9),
    0 0 48px rgba(0,240,255,.7);
  animation:heroPulse 2.2s ease-in-out infinite;
}

@keyframes heroPulse{
  0%,100%{ filter:brightness(1); }
  50%{ filter:brightness(1.25); }
}

/* If JS applies .proximity-heading */
.proximity-heading{
  --p: 0; /* 0..1 */
  transition: filter .12s ease, text-shadow .12s ease, transform .12s ease;
  filter: brightness(calc(1 + (var(--p) * 0.35)));
  text-shadow:
    0 0 calc(8px  + (var(--p) * 18px)) rgba(0,240,255, calc(.25 + (var(--p) * .55))),
    0 0 calc(20px + (var(--p) * 50px)) rgba(0,240,255, calc(.15 + (var(--p) * .45))),
    0 0 calc(40px + (var(--p) * 90px)) rgba(0,240,255, calc(.06 + (var(--p) * .28)));
}

/* ======================
   AMBIENT GLOW SECTION
   Class: ambient-glow
====================== */
.ambient-glow{
  position:relative;
  background:#000 !important;
}
.ambient-glow::before{
  content:"";
  position:absolute;
  inset:-35%;
  background:
    radial-gradient(circle at 25% 35%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%),
    radial-gradient(circle at 75% 65%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 60%);
  filter:blur(140px);
  animation:ambientFloat 28s ease-in-out infinite alternate;
  pointer-events:none;
}
@keyframes ambientFloat{
  from{ transform:translate(-3%,-2%) scale(1); opacity:.6; }
  to{ transform:translate(3%,2%) scale(1.15); opacity:1; }
}
.ambient-glow > *{ position:relative; z-index:1; }

/* Accent classes (NO orange) */
.accent-cyan   { --accent:#00F0FF; --accent2:#4DEEFF; }
.accent-purple { --accent:#A855F7; --accent2:#E879F9; }
.accent-green  { --accent:#22C55E; --accent2:#86EFAC; }

/* ======================
   GLASS CARDS
   Class: glass-card
====================== */
.glass-card{
  background:rgba(6,14,18,.78) !important;
  backdrop-filter:blur(16px) saturate(1.1);
  -webkit-backdrop-filter:blur(16px) saturate(1.1);
  border-radius:18px !important;
  border:1px solid rgba(0,240,255,.14) !important;
  box-shadow: 0 14px 34px rgba(0,0,0,.55);
  transition:
    transform .35s cubic-bezier(.2,.8,.2,1),
    box-shadow .35s ease,
    border-color .35s ease;
  position: relative;
}

.glass-card:hover{
  transform:translateY(-8px) scale(1.02);
  border-color:rgba(0,240,255,.55) !important;
  box-shadow:
    0 22px 50px rgba(0,0,0,.7),
    0 0 36px rgba(0,240,255,.35);
}

/* Click burst (JS inserts .click-burst) */
.click-burst{
  position:absolute;
  width: 14px; height: 14px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  pointer-events:none;
  z-index: 5;
  background: radial-gradient(circle,
    rgba(0,240,255,.95) 0%,
    rgba(0,240,255,.45) 35%,
    rgba(0,0,0,0) 72%
  );
  filter:
    drop-shadow(0 0 14px rgba(0,240,255,.95))
    drop-shadow(0 0 44px rgba(0,240,255,.55));
  animation: burst 520ms ease-out forwards;
}
@keyframes burst{
  0%   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(18); }
}

/* ======================================================
   ⭐ CURSOR — STAR + TAIL (keeps normal arrow visible)
   - Visible star + neon tail
   - Star particles for trail
   ====================================================== */

/* Main cursor container */
.cursor-glow{
  position: fixed;
  width: 56px;
  height: 56px;
  pointer-events: none;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  mix-blend-mode: screen;
  z-index: 9999999;

  /* subtle ambient aura */
  background: radial-gradient(circle,
    color-mix(in srgb, var(--accent) 75%, white 10%) 0%,
    color-mix(in srgb, var(--accent) 45%, transparent 55%) 42%,
    rgba(0,0,0,0) 72%
  );
  filter:
    drop-shadow(0 0 18px color-mix(in srgb, var(--accent) 78%, transparent))
    drop-shadow(0 0 52px color-mix(in srgb, var(--accent) 45%, transparent));
}

/* Tail streak (JS sets --tailLen + --tailRot + --tailOpacity) */
.cursor-glow::before{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  width: var(--tailLen, 34px);
  height: 10px;
  transform:
    translate(-100%, -50%)
    rotate(var(--tailRot, 0deg));
  transform-origin: 100% 50%;
  border-radius: 999px;

  opacity: var(--tailOpacity, .55);
  background: linear-gradient(90deg,
    rgba(0,0,0,0) 0%,
    color-mix(in srgb, var(--accent) 85%, white 10%) 35%,
    rgba(255,255,255,.55) 55%,
    rgba(0,0,0,0) 100%
  );
  filter: blur(0.2px) drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 75%, transparent));
}

/* STAR itself */
.cursor-star{
  position:absolute;
  left:50%;
  top:50%;
  width: 18px;
  height: 18px;
  transform: translate(-50%, -50%) rotate(12deg);
  opacity: .98;

  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;

  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z'/%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;

  background: radial-gradient(circle,
    rgba(255,255,255,.95) 0%,
    color-mix(in srgb, var(--accent) 75%, white 25%) 40%,
    color-mix(in srgb, var(--accent) 85%, transparent 15%) 70%
  );

  filter:
    drop-shadow(0 0 18px color-mix(in srgb, var(--accent) 95%, transparent))
    drop-shadow(0 0 44px color-mix(in srgb, var(--accent) 55%, transparent));
  animation: starPulse 1.35s ease-in-out infinite;
}

@keyframes starPulse{
  0%,100% { transform: translate(-50%, -50%) rotate(12deg) scale(1); }
  50%     { transform: translate(-50%, -50%) rotate(12deg) scale(1.08); }
}

/* Star trail particles */
.cursor-particle{
  position: fixed;
  width: 10px;
  height: 10px;
  pointer-events: none;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  opacity: 0.9;
  mix-blend-mode: screen;
  z-index: 9999998;

  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L60 40 L92 42 L66 60 L74 90 L50 73 L26 90 L34 60 L8 42 L40 40 Z'/%3E%3C/svg%3E");
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;

  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L60 40 L92 42 L66 60 L74 90 L50 73 L26 90 L34 60 L8 42 L40 40 Z'/%3E%3C/svg%3E");
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;

  background: radial-gradient(circle,
    rgba(255,255,255,.9) 0%,
    color-mix(in srgb, var(--accent) 78%, white 20%) 50%,
    rgba(0,0,0,0) 75%
  );
  filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 75%, transparent));
  animation: starParticleFade 620ms ease-out forwards;
}

@keyframes starParticleFade{
  0%   { opacity: .9; transform: translate(-50%,-50%) scale(1); }
  100% { opacity: 0;  transform: translate(-50%,-50%) scale(0.15); }
}

/* Scroll trails particles (JS uses .scroll-particle) */
.scroll-particle{
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  mix-blend-mode: screen;
  opacity: .85;
  background: radial-gradient(circle,
    color-mix(in srgb, var(--accent) 85%, white 15%) 0%,
    rgba(0,0,0,0) 72%
  );
  filter: drop-shadow(0 0 16px color-mix(in srgb, var(--accent) 70%, transparent));
  animation: scrollFade 900ms ease-out forwards;
}
@keyframes scrollFade{
  0%   { opacity: .85; transform: translate(-50%,-50%) scale(1); }
  100% { opacity: 0;   transform: translate(-50%,-80%) scale(.25); }
}

/* ======================
   FLOATING BG PARTICLES
====================== */
.bg-particle{
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: radial-gradient(circle,
    color-mix(in srgb, var(--accent) 65%, white 10%) 0%,
    rgba(0,0,0,0) 70%
  );
  filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 45%, transparent));
  animation: floatParticle ease-in-out infinite;
  transform: translate3d(0,0,0);
  mix-blend-mode: screen;
}
@keyframes floatParticle{
  0%   { transform: translate3d(0, 0, 0); }
  50%  { transform: translate3d(14px, -22px, 0); }
  100% { transform: translate3d(-10px, 10px, 0); }
}

/* ======================
   WAVE GLOW (CSS-only)
   Class: wave-glow
====================== */
.wave-glow{ position: relative; }
.wave-glow::after{
  content:"";
  position:absolute;
  inset:-40%;
  pointer-events:none;
  opacity:.55;
  background: linear-gradient(120deg,
    rgba(0,240,255,0) 0%,
    rgba(0,240,255,.18) 20%,
    rgba(0,240,255,.05) 35%,
    rgba(0,240,255,.22) 50%,
    rgba(0,240,255,0) 70%
  );
  filter: blur(18px);
  transform: translateX(-30%) rotate(8deg);
  animation: waveMove 5.2s ease-in-out infinite;
}
@keyframes waveMove{
  0%   { transform: translateX(-30%) rotate(8deg); }
  50%  { transform: translateX(30%)  rotate(8deg); }
  100% { transform: translateX(-30%) rotate(8deg); }
}

/* ======================
   SECTION REVEAL (for JS)
====================== */
.reveal{
  opacity: 0;
  transform: translateY(14px);
  filter: blur(2px);
  transition: opacity .7s ease, transform .8s cubic-bezier(.2,.8,.2,1), filter .8s ease;
  will-change: opacity, transform, filter;
}
.reveal.reveal-in{
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* ======================
   NEON BUTTON PHYSICS (for JS)
====================== */
.neon-physics{
  position: relative;
  overflow: hidden;
}
.neon-physics::before{
  content:"";
  position:absolute;
  inset:-2px;
  pointer-events:none;
  opacity:0;
  transition: opacity .22s ease;
  background: radial-gradient(140px 140px at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--accent) 40%, transparent) 0%,
    rgba(0,0,0,0) 70%
  );
  filter: blur(2px);
}
.neon-physics:hover::before{ opacity: 1; }
.neon-physics:hover{
  box-shadow:
    0 0 18px color-mix(in srgb, var(--accent) 35%, transparent),
    0 0 44px color-mix(in srgb, var(--accent) 22%, transparent);
}

/* ======================
   PAGE TRANSITION GLOW (for JS)
====================== */
.page-transition{
  opacity: 0;
  background:
    radial-gradient(circle at 50% 45%,
      color-mix(in srgb, var(--accent) 24%, transparent) 0%,
      rgba(0,0,0,0) 60%
    ),
    linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.65));
  transition: opacity .28s ease;
}
body.pt-ready.pt-leaving .page-transition{ opacity: 1; }

/* ======================
   SMOOTHER LINES
====================== */
hr,
.elementor-divider-separator{
  border-color: rgba(0,240,255,.10) !important;
}
.line, .divider, .separator{
  opacity: .65;
  filter: blur(.35px);
}

/* ======================
   MAGNETIC TARGET
====================== */
.magnetic{
  will-change: transform;
  transform: translate3d(0,0,0);
}

/* ======================
   ASTRA FOOTER SOCIAL — FIX STACKING
====================== */
#colophon .ast-footer-social-wrap,
#colophon .ast-footer-social-1-wrap,
#colophon .footer-social-inner-wrap.element-social-inner-wrap{
  display: flex !important;
  flex-direction: row !important;
  justify-content: center !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 22px !important;
  width: 100% !important;
  margin: 0 auto !important;
  padding: 18px 16px !important;
}

#colophon a.ast-builder-social-element{
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 46px !important;
  height: 46px !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 14px !important;
  background: rgba(6,14,18,.55) !important;
  border: 1px solid rgba(0,240,255,.18) !important;
  transition: transform .25s ease, filter .25s ease, box-shadow .25s ease;
}

#colophon a.ast-builder-social-element svg{
  width: 22px !important;
  height: 22px !important;
  display: block !important;
}

#colophon a.ast-builder-social-element:hover{
  transform: translateY(-2px) scale(1.12);
  box-shadow:
    0 0 18px rgba(0,240,255,.55),
    0 0 45px rgba(0,240,255,.25);
  filter: drop-shadow(0 0 14px rgba(0,240,255,.75));
}

#colophon .ast-builder-layout-element.ast-flex{
  justify-content: center !important;
}

/* Orbit layer (JS injects .orbit-layer/.orbit-spin/.orbit-dot) */
.orbit-layer{
  position:absolute;
  left:50%; top:50%;
  width: 34px; height: 34px;
  transform: translate(-50%, -50%);
  pointer-events:none;
  opacity: 0;
  transition: opacity .2s ease;
  z-index: 3;
}
#colophon a.ast-builder-social-element:hover .orbit-layer{ opacity: 1; }

.orbit-dot{
  position:absolute;
  left:50%; top:50%;
  width: 6px; height: 6px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  background: rgba(0,240,255,.95);
  filter: drop-shadow(0 0 10px rgba(0,240,255,.95));
}

.orbit-spin{
  position:absolute;
  inset:0;
  animation: orbitSpin 1.25s linear infinite;
}
.orbit-spin:nth-child(2){ animation-duration: 1.55s; }
.orbit-spin:nth-child(3){ animation-duration: 1.95s; }
.orbit-spin .orbit-dot{ transform: translate(-50%, -50%) translateX(16px); }

@keyframes orbitSpin{
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ======================
   READABLE ELEMENTOR TEXT + GLASS PANEL
====================== */
.elementor-text-editor,
.elementor-text-editor *,
.elementor-widget-text-editor,
.elementor-widget-text-editor *,
.elementor-heading-title,
p, li, span{
  color: rgba(230,241,255,0.92) !important;
  text-shadow: 0 0 6px rgba(0,240,255,.12);
}

/* Soft glass background for long text blocks */
.elementor-text-editor{
  background: rgba(6,14,18,.55);
  border: 1px solid rgba(0,240,255,.12);
  border-radius: 16px;
  padding: 22px;
  backdrop-filter: blur(6px);
}

/* ==========================
   🥚 EASTER EGG MODES
========================== */
body.easter-glow,
body.easter-neon{
  filter: saturate(1.35) brightness(1.08);
}

body.easter-glow .cursor-glow,
body.easter-neon .cursor-glow{
  filter:
    drop-shadow(0 0 26px color-mix(in srgb, var(--accent) 95%, transparent))
    drop-shadow(0 0 90px color-mix(in srgb, var(--accent) 70%, transparent));
  transform: translate(-50%, -50%) scale(1.12);
}

body.easter-glow .glass-card,
body.easter-neon .glass-card{
  border-color: color-mix(in srgb, var(--accent) 55%, transparent) !important;
  box-shadow:
    0 0 28px color-mix(in srgb, var(--accent) 55%, transparent),
    0 0 90px color-mix(in srgb, var(--accent) 30%, transparent) !important;
}

body.easter-glow .hero-title,
body.easter-neon .hero-title{
  text-shadow:
    0 0 24px color-mix(in srgb, var(--accent) 90%, transparent),
    0 0 80px color-mix(in srgb, var(--accent) 55%, transparent) !important;
}

/* ======================
   MOBILE TUNING
====================== */
@media(max-width:768px){
  .glass-card:hover{ transform:none !important; }

  .ast-above-header-bar .site-header-above-section-center ul{
    gap:18px;
    flex-wrap:wrap;
  }
  .ast-above-header-bar .site-header-above-section-center li > a{
    font-size:18px;
  }

  /* Performance: remove heavy background layers on mobile */
  .bg-orbs, .bg-particles{ display:none !important; }
}
