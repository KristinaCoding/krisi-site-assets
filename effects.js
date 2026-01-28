/* ======================================================
   KRISI.SITE — FX PACK
   - Cursor tail + particles
   - Menu: blip + whoosh + cyan fade transition
   - Social: magical trill + orbit particles
====================================================== */

function isMobileish() {
  return window.matchMedia("(max-width: 768px)").matches || ("ontouchstart" in window);
}
function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- transition overlay ---------- */
function ensureTransitionOverlay() {
  let overlay = document.querySelector(".page-transition");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "page-transition";
    document.body.appendChild(overlay);
  }
  document.body.classList.add("pt-ready");
  return overlay;
}
function runPageTransition() {
  if (reducedMotion()) return Promise.resolve();
  ensureTransitionOverlay();
  document.body.classList.add("pt-leaving");
  return new Promise((resolve) => setTimeout(resolve, 260));
}

/* ---------- cursor FX ---------- */
function initCursorFX() {
  if (isMobileish() || reducedMotion()) return;

  document.body.classList.add("fx-cursor");

  let glow = document.querySelector(".cursor-glow");
  if (!glow) {
    glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
  }

  if (!glow.querySelector(".cursor-tail")) {
    const tail = document.createElement("div");
    tail.className = "cursor-tail";
    glow.appendChild(tail);
  }

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  let lastX = x, lastY = y;

  let lastParticleTime = 0;
  const particleEveryMs = 20;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;

    const now = performance.now();
    if (now - lastParticleTime > particleEveryMs) {
      lastParticleTime = now;
      const p = document.createElement("div");
      p.className = "cursor-particle";
      p.style.left = tx + "px";
      p.style.top = ty + "px";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
  }, { passive: true });

  (function loop() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;

    const vx = x - lastX;
    const vy = y - lastY;
    lastX = x;
    lastY = y;

    const speed = Math.min(28, Math.hypot(vx, vy) * 2.2);
    const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 180;

    glow.style.left = x + "px";
    glow.style.top = y + "px";
    glow.style.setProperty("--tailLen", (20 + speed * 1.7).toFixed(1) + "px");
    glow.style.setProperty("--tailRot", angle.toFixed(1) + "deg");
    glow.style.setProperty("--tailOpacity", (0.22 + speed / 45).toFixed(2));

    requestAnimationFrame(loop);
  })();
}
function initSoundFX() {
  const audioState = { ctx: null, unlocked: false };

  const ensureContext = () => {
    if (!audioState.ctx) audioState.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioState.ctx.state === "suspended") audioState.ctx.resume();
    audioState.unlocked = true;
  };

  /* ----------------------
     ONE CONSISTENT “MAGICAL CLICK”
     (used everywhere)
  ---------------------- */
  const magicalClick = () => {
    if (!audioState.unlocked) return;
    const ctx = audioState.ctx;
    const now = ctx.currentTime;

    // master gain = volume control
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.30, now + 0.03);   // NOT subtle, not loud
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    gain.connect(ctx.destination);

    // light “sparkle” stack
    const freqs = [640, 820, 980, 1240];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.028);
      osc.frequency.exponentialRampToValueAtTime(f * 1.16, now + i * 0.028 + 0.07);
      osc.connect(gain);
      osc.start(now + i * 0.028);
      osc.stop(now + i * 0.028 + 0.12);
    });

    // subtle shimmer “air” (very short)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1600, now);
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.14);
  };

  /* ----------------------
     SOCIAL: orbit inject
  ---------------------- */
  const ensureOrbitLayer = (el) => {
    if (!el || el.querySelector(".orbit-layer")) return;
    const layer = document.createElement("div");
    layer.className = "orbit-layer";
    for (let i = 0; i < 3; i++) {
      const spin = document.createElement("div");
      spin.className = "orbit-spin";
      const dot = document.createElement("div");
      dot.className = "orbit-dot";
      spin.appendChild(dot);
      layer.appendChild(spin);
    }
    el.appendChild(layer);
  };

  /* ----------------------
     Navigation helpers
  ---------------------- */
  const shouldHandleLink = (a, e) => {
    if (!a || !a.href) return false;
    if (a.target === "_blank") return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;

    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    const samePath = (url.pathname === window.location.pathname);
    if (samePath && url.hash) return false;

    return true;
  };

  const bindAll = () => {
    // MENU clicks (same magical sound + transition)
    const menuSelector = ".ast-above-header-bar a, .ast-primary-header-bar a, .main-navigation a";
    document.querySelectorAll(menuSelector).forEach((a) => {
      a.addEventListener("click", async (e) => {
        magicalClick();

        if (!shouldHandleLink(a, e)) return;
        e.preventDefault();

        // run your existing transition function if you have it
        if (typeof runPageTransition === "function") await runPageTransition();

        window.location.href = a.href;
      }, { passive: false });
    });

    // Social: magical on hover + click (NO blip)
    const socialSelector = "#colophon a.ast-builder-social-element";
    document.querySelectorAll(socialSelector).forEach((a) => {
      ensureOrbitLayer(a);
      a.addEventListener("mouseenter", () => { ensureOrbitLayer(a); magicalClick(); }, { passive: true });
      a.addEventListener("click", () => { ensureOrbitLayer(a); magicalClick(); }, { passive: true });
    });

    // Other internal links: same magical sound + transition
    document.addEventListener("click", async (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      // already handled by menu handler above
      if (a.matches(".ast-above-header-bar a, .ast-primary-header-bar a, .main-navigation a")) return;

      magicalClick();

      if (!shouldHandleLink(a, e)) return;
      e.preventDefault();

      if (typeof runPageTransition === "function") await runPageTransition();
      window.location.href = a.href;
    }, { passive: false });
  };

  const unlock = () => {
    ensureContext();
    bindAll();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}
