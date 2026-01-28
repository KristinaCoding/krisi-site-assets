/* ======================================================
   KRISI.SITE — FX PACK (CONSISTENT AUDIO)
   - Cursor tail + particles
   - Cyan fade transition on internal nav
   - One consistent “magical click” everywhere
   - Social orbit particles + magical sound
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

/* ---------- sound FX (robust) ---------- */
function initSoundFX() {
  const audio = { ctx: null, unlocked: false };

  const createCtx = () => {
    if (!audio.ctx) audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return audio.ctx;
  };

  const unlockAudio = async () => {
    const ctx = createCtx();
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch (e) {}
    }
    audio.unlocked = (ctx.state === "running");
    return audio.unlocked;
  };

  const magicalClick = () => {
    if (!audio.unlocked) return;
    const ctx = audio.ctx;
    if (!ctx) return;

    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.26, now + 0.03); // tuned
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    gain.connect(ctx.destination);

    [640, 820, 980, 1240].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.028);
      osc.frequency.exponentialRampToValueAtTime(f * 1.16, now + i * 0.028 + 0.07);
      osc.connect(gain);
      osc.start(now + i * 0.028);
      osc.stop(now + i * 0.028 + 0.12);
    });

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1600, now);
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.14);
  };

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

  // IMPORTANT: use ONE handler path, not duplicates
  const menuSelector = ".ast-above-header-bar a, .ast-primary-header-bar a, .main-navigation .menu > li > a";
  const socialSelector = "#colophon a.ast-builder-social-element";

  // Bind clicks now; unlock+play on first click if needed
  const onAnyClick = async (e) => {
    const a = e.target.closest("a");

    // Always attempt unlock on first user interaction
    if (!audio.unlocked) {
      createCtx();
      await unlockAudio();
    }

    // Social hover doesn't count as click; here is click only
    if (audio.unlocked) magicalClick();

    // If it's a nav link we want transition for:
    if (a && shouldHandleLink(a, e)) {
      // Avoid double handling: only intercept internal navigation
      e.preventDefault();
      await runPageTransition();
      window.location.href = a.href;
    }
  };

  // Menu links: intercept + sound
  document.querySelectorAll(menuSelector).forEach((a) => {
    a.addEventListener("click", onAnyClick, { passive: false });
  });

  // Social: hover + click (hover only after unlock)
  const bindSocial = () => {
    document.querySelectorAll(socialSelector).forEach((a) => {
      ensureOrbitLayer(a);

      a.addEventListener("mouseenter", async () => {
        if (!audio.unlocked) return; // hover sound only once unlocked
        magicalClick();
      }, { passive: true });

      a.addEventListener("click", onAnyClick, { passive: false });
    });
  };

  bindSocial();

  // Other internal links anywhere (but skip menu/social because they already have handlers)
  document.addEventListener("click", async (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    if (a.matches(menuSelector) || a.matches(socialSelector)) return;

    await onAnyClick(e);
  }, { passive: false });

  // Prepare overlay early
  ensureTransitionOverlay();
}

/* ---------- BOOT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initCursorFX();
  initSoundFX();
});
