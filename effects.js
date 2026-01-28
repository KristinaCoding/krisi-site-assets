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
    gain.c
