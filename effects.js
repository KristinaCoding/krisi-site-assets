/* ======================================================
   KRISI.SITE — FX PACK (CLEAN FINAL v2)
   - Cursor tail + particles
   - Cyan fade transition on internal navigation
   - One consistent magical sound everywhere
   - Social orbit particles
   - FIX: no double-binding clicks
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
  const particleEveryMs = 24; // slightly less busy (perf)

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

/* ---------- audio + orbit + nav ---------- */
function initSoundAndNavFX() {
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
    if (!audio.unlocked || !audio.ctx) return;

    const ctx = audio.ctx;
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.24, now + 0.03);
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
    gain2.gain.exponentialRampToValueAtTime(0.055, now + 0.02);
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

  const isInternalNavLink = (a, e) => {
    if (!a || !a.href) return false;
    if (a.target === "_blank") return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;

    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    // ignore hash jumps on same page
    const samePath = (url.pathname === window.location.pathname);
    if (samePath && url.hash) return false;

    // ignore downloads/mailto/tel
    if (a.hasAttribute("download")) return false;
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;

    return true;
  };

  // Prepare overlay early
  ensureTransitionOverlay();

  // Unlock audio on FIRST pointer interaction (more reliable than click)
  const unlockOnce = async () => {
    if (audio.unlocked) return;
    createCtx();
    await unlockAudio();
    // optional tiny “hello” only once:
    // if (audio.unlocked) magicalClick();
    window.removeEventListener("pointerdown", unlockOnce, { capture: true });
  };
  window.addEventListener("pointerdown", unlockOnce, { capture: true, passive: true });

  // Inject orbit layers once (footer socials)
  document.querySelectorAll("#colophon a.ast-builder-social-element").forEach((a) => ensureOrbitLayer(a));

  // SINGLE delegated handler for ALL clicks
  document.addEventListener("click", async (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    if (audio.unlocked) magicalClick();

    if (isInternalNavLink(a, e)) {
      e.preventDefault();
      await runPageTransition();
      window.location.href = a.href;
    }
  }, { passive: false });

  // Optional: hover sound on socials (only if already unlocked)
  document.addEventListener("mouseenter", (e) => {
    const a = e.target.closest("#colophon a.ast-builder-social-element");
    if (!a) return;
    if (audio.unlocked) magicalClick();
  }, { capture: true, passive: true });
}

/* ---------- BOOT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initCursorFX();
  initSoundAndNavFX();
});
