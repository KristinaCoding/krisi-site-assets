/* ======================================================
   KRISI.SITE — FX PACK (CLEAN + SAFE)
   - Cursor tail + trailing particles
   - Menu click: blip + whoosh + cyan fade transition
   - Social hover/click: magical trill + orbit particles
====================================================== */

function isMobileish() {
  return window.matchMedia("(max-width: 768px)").matches || ("ontouchstart" in window);
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ----------------------
   TRANSITION OVERLAY
---------------------- */
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

/* ----------------------
   CURSOR FX (tail + particles)
---------------------- */
function initCursorFX() {
  if (isMobileish() || reducedMotion()) return;

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

  if (!glow.querySelector(".cursor-star")) {
    const star = document.createElement("div");
    star.className = "cursor-star";
    glow.appendChild(star);
  }

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  let lastX = x, lastY = y;

  let lastParticleTime = 0;
  const particleEveryMs = 18;

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
    x += (tx - x) * 0.20;
    y += (ty - y) * 0.20;

    const vx = x - lastX;
    const vy = y - lastY;
    lastX = x;
    lastY = y;

    const speed = Math.min(28, Math.hypot(vx, vy) * 2.2);
    const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 180;

    glow.style.left = x + "px";
    glow.style.top = y + "px";

    glow.style.setProperty("--tailLen", (22 + speed * 1.8).toFixed(1) + "px");
    glow.style.setProperty("--tailRot", angle.toFixed(1) + "deg");
    glow.style.setProperty("--tailOpacity", (0.25 + speed / 40).toFixed(2));

    requestAnimationFrame(loop);
  })();
}

/* ----------------------
   SOUND FX (blip / whoosh / magic trill)
---------------------- */
function initSoundFX() {
  const audioState = { ctx: null, unlocked: false };

  const ensureContext = () => {
    if (!audioState.ctx) audioState.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioState.ctx.state === "suspended") audioState.ctx.resume();
    audioState.unlocked = true;
  };

  const blip = () => {
    if (!audioState.unlocked) return;
    const ctx = audioState.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  };

  const whoosh = () => {
    if (!audioState.unlocked) return;
    const ctx = audioState.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.22);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.22);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  };

  const magicTrill = () => {
    if (!audioState.unlocked) return;
    const ctx = audioState.ctx;
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    gain.connect(ctx.destination);

    const freqs = [660, 880, 990, 1320];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(f * 1.12, now + i * 0.03 + 0.06);
      osc.connect(gain);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.10);
    });
  };

  /* ----------------------
     SOCIAL: inject orbit particles once
  ---------------------- */
  const ensureOrbitLayer = (el) => {
    if (!el || el.querySelector(".orbit-layer")) return;

    const layer = document.createElement("div");
    layer.className = "orbit-layer";

    // three rings
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
     CLICK → TRANSITION NAV
  ---------------------- */
  const shouldHandleLink = (a, e) => {
    if (!a) return false;
    if (a.target === "_blank") return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (!a.href) return false;

    const url = new URL(a.href, window.location.href);

    // only same-origin
    if (url.origin !== window.location.origin) return false;

    // if same page hash jump, skip full transition
    const samePath = (url.pathname === window.location.pathname);
    if (samePath && url.hash) return false;

    return true;
  };

  const bindAll = () => {
    ensureTransitionOverlay();

    // MENU: blip + whoosh + transition
    const menuSelector = ".ast-above-header-bar a, .ast-primary-header-bar a, .main-navigation a";
    document.querySelectorAll(menuSelector).forEach((a) => {
      a.addEventListener("click", async (e) => {
        blip();
        if (!shouldHandleLink(a, e)) return;

        e.preventDefault();
        whoosh();
        await runPageTransition();
        window.location.href = a.href;
      }, { passive: false });
    });

    // SOCIAL: magical trill + orbit particles
    const socialSelector = "#colophon a.ast-builder-social-element";
    document.querySelectorAll(socialSelector).forEach((a) => {
      ensureOrbitLayer(a);
      a.addEventListener("mouseenter", () => {
        ensureOrbitLayer(a);
        magicTrill();
      }, { passive: true });
      a.addEventListener("click", () => {
        ensureOrbitLayer(a);
        magicTrill();
      }, { passive: true });
    });

    // Internal links (optional): whoosh + transition
    document.addEventListener("click", async (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (a.matches(".ast-above-header-bar a, .ast-primary-header-bar a, .main-navigation a")) return;
      if (!shouldHandleLink(a, e)) return;

      e.preventDefault();
      whoosh();
      await runPageTransition();
      window.location.href = a.href;
    }, { passive: false });
  };

  // Unlock audio on first user interaction
  const unlock = () => {
    ensureContext();
    bindAll();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };

  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}

/* ----------------------
   BOOT
---------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initCursorFX();
  initSoundFX();
});
