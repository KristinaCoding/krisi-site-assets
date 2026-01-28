// Quick debug switch (set to true when tweaking)
const KRISI_DEBUG = false;
const log = (...args) => KRISI_DEBUG && console.log(...args);


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
