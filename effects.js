function initCursorFX() {
  if (isMobileish() || reducedMotion()) return;

  // Main cursor container
  let glow = document.querySelector(".cursor-glow");
  if (!glow) {
    glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
  }

  // Star element inside the glow
  if (!glow.querySelector(".cursor-star")) {
    const star = document.createElement("div");
    star.className = "cursor-star";
    glow.appendChild(star);
  }

  // Position state
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  // For tail direction/length
  let lastX = x, lastY = y;
  let vx = 0, vy = 0;

  // Particle throttle
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
    // Smooth follow
    x += (tx - x) * 0.20;
    y += (ty - y) * 0.20;

    // Velocity (for tail)
    vx = x - lastX;
    vy = y - lastY;
    lastX = x;
    lastY = y;

    // Tail rotation points opposite movement
    const speed = Math.min(26, Math.hypot(vx, vy) * 2.2);
    const angle = Math.atan2(vy, vx) * (180 / Math.PI) + 180;

    glow.style.left = x + "px";
    glow.style.top = y + "px";

    // Tail “reactivity”
    glow.style.setProperty("--tailLen", (18 + speed * 1.6).toFixed(1) + "px");
    glow.style.setProperty("--tailRot", angle.toFixed(1) + "deg");
    glow.style.setProperty("--tailOpacity", (0.30 + speed / 40).toFixed(2));

    requestAnimationFrame(loop);
  })();
}

function initSoundFX() {
  const audioState = {
    ctx: null,
    unlocked: false,
  };

  const ensureContext = () => {
    if (!audioState.ctx) {
      audioState.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioState.ctx.state === "suspended") {
      audioState.ctx.resume();
    }
    audioState.unlocked = true;
  };

  const playBlip = () => {
    if (!audioState.unlocked) return;
    const ctx = audioState.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  };

  const playMagic = () => {
    if (!audioState.unlocked) return;
    const ctx = audioState.ctx;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    gain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = "triangle";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(520, now);
    osc2.frequency.setValueAtTime(660, now);
    osc1.frequency.exponentialRampToValueAtTime(820, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(1040, now + 0.2);

    osc1.connect(gain);
    osc2.connect(gain);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.4);
  };

  const playTransition = () => {
    if (!audioState.unlocked) return;
    const ctx = audioState.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.2);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  };

  const menuSelector = ".ast-above-header-bar a, .ast-primary-header-bar a, .main-navigation a";
  const socialSelector = "#colophon a.ast-builder-social-element";

  const bindSounds = () => {
    document.querySelectorAll(menuSelector).forEach((link) => {
      link.addEventListener("click", playBlip, { passive: true });
    });

    document.querySelectorAll(socialSelector).forEach((link) => {
      link.addEventListener("mouseenter", playMagic, { passive: true });
      link.addEventListener("click", playMagic, { passive: true });
    });

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      if (link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey) return;
      if (link.origin && link.origin !== window.location.origin) return;
      playTransition();
    }, { passive: true });
  };

  const unlockHandler = () => {
    ensureContext();
    bindSounds();
    window.removeEventListener("pointerdown", unlockHandler);
    window.removeEventListener("keydown", unlockHandler);
  };

  window.addEventListener("pointerdown", unlockHandler, { passive: true });
  window.addEventListener("keydown", unlockHandler, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  initSoundFX();
});
