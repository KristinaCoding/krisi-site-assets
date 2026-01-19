(function () {
  "use strict";

  /* -------------------------------
     Helper — Run when DOM is ready
  -------------------------------- */
  function whenReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  /* -------------------------------
     MOBILE / REDUCED MOTION GUARDS
  -------------------------------- */
  function isMobileish() {
    return window.matchMedia("(max-width: 768px)").matches;
  }
  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* -------------------------------
     PAGE FADE TRANSITIONS (optional)
     NOTE: Requires you to add CSS for .is-loaded/.is-leaving if you want it visible.
  -------------------------------- */
  function initPageFades() {
    document.body.classList.add("is-loaded");

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank" ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;

      let url;
      try { url = new URL(href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;

      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => { window.location.href = url.href; }, 260);
    });
  }

  /* -------------------------------
     SECTION ACCENT SHIFT (hover/scroll)
     Add Elementor classes:
       accent-cyan / accent-purple / accent-green
  -------------------------------- */
  function initSectionAccentShift() {
    const sections = document.querySelectorAll(
      ".accent-cyan, .accent-purple, .accent-green"
    );
    if (!sections.length) return;

    function setAccentFrom(el) {
      const cs = getComputedStyle(el);
      const a = cs.getPropertyValue("--accent").trim();
      const a2 = cs.getPropertyValue("--accent2").trim();
      if (a) document.documentElement.style.setProperty("--accent", a);
      if (a2) document.documentElement.style.setProperty("--accent2", a2);
    }

    // Hover changes
    sections.forEach(sec => {
      sec.addEventListener("mouseenter", () => setAccentFrom(sec));
      sec.addEventListener("focusin", () => setAccentFrom(sec));
    });

    // Scroll-based (section closest to screen center)
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        let best = null;
        let bestDist = Infinity;
        const mid = window.innerHeight * 0.45;

        sections.forEach(sec => {
          const r = sec.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = sec;
          }
        });

        if (best) setAccentFrom(best);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------
     MAGNETIC PULL (menu + any .magnetic)
     Add class "magnetic" to Elementor buttons/cards you want
  -------------------------------- */
  function initMagneticPull() {
    const selectors = [
      ".ast-above-header-bar .site-header-above-section-center a",
      ".ast-primary-header-bar a",
      ".main-navigation a",
      ".nav-menu a",
      ".magnetic"
    ];

    const items = document.querySelectorAll(selectors.join(","));
    if (!items.length) {
      setTimeout(initMagneticPull, 600);
      return;
    }

    items.forEach(el => {
      if (el.dataset.magnetBound === "1") return;
      el.dataset.magnetBound = "1";

      const strength = el.classList.contains("magnetic") ? 10 : 6;

      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `translate(${x * strength}px, ${y * (strength * 0.85)}px) scale(1.04)`;
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* -------------------------------
     CURSOR GLOW + TRAILING PARTICLES
  -------------------------------- */
  function initCursorFX() {
    if (isMobileish() || reducedMotion()) return;

    // Create glow element if missing
    let glow = document.querySelector(".cursor-glow");
    if (!glow) {
      glow = document.createElement("div");
      glow.className = "cursor-glow";
      document.body.appendChild(glow);
    }

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;

    // Particle throttling
    let lastParticleTime = 0;
    const particleEveryMs = 22;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;

      const now = performance.now();
      if (now - lastParticleTime > particleEveryMs) {
        lastParticleTime = now;
        spawnParticle(tx, ty);
      }
    }, { passive: true });

    function spawnParticle(px, py) {
      const p = document.createElement("div");
      p.className = "cursor-particle";
      p.style.left = px + "px";
      p.style.top = py + "px";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }

    function loop() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      glow.style.left = x + "px";
      glow.style.top = y + "px";
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* -------------------------------
     HERO PROXIMITY ENERGY (glow + lean)
     Target: .hero-title (or add .proximity-heading to any heading)
  -------------------------------- */
  function initHeroEnergy() {
    if (isMobileish() || reducedMotion()) return;

    // Prefer .hero-title, fallback to first .proximity-heading
    const hero = document.querySelector(".hero-title") || document.querySelector(".proximity-heading");
    if (!hero) return;

    hero.classList.add("proximity-heading");

    const strength = 14;

    window.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      const max = Math.max(window.innerWidth, window.innerHeight) * 0.6;
      const p = Math.max(0, 1 - (dist / max));

      hero.style.setProperty("--p", p.toFixed(3));

      const tx = (dx / Math.max(240, r.width)) * strength * p;
      const ty = (dy / Math.max(240, r.height)) * strength * p;

      hero.style.transform = `translate(${tx}px, ${ty}px)`;
    }, { passive: true });
  }

  /* -------------------------------
     3D CARD TILT (hover)
     Target: .glass-card
  -------------------------------- */
  function initCardTilt() {
    if (isMobileish() || reducedMotion()) return;

    const cards = document.querySelectorAll(".glass-card");
    if (!cards.length) return;

    const maxTilt = 12;   // degrees
    const scale = 1.04;   // hover scale

    cards.forEach(card => {
      if (card.dataset.tiltBound === "1") return;
      card.dataset.tiltBound = "1";

      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";

      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        const rx = ((y / r.height) - 0.5) * -2 * maxTilt;
        const ry = ((x / r.width) - 0.5) *  2 * maxTilt;

        card.style.transform =
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`;
      });
    });
  }

  /* -------------------------------
     CLICK GLOW EXPLOSION ON CARDS
     Target: .glass-card
  -------------------------------- */
  function initCardClickBurst() {
    const cards = document.querySelectorAll(".glass-card");
    if (!cards.length) return;

    cards.forEach(card => {
      if (card.dataset.burstBound === "1") return;
      card.dataset.burstBound = "1";

      card.style.position = card.style.position || "relative";

      card.addEventListener("click", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        const b = document.createElement("div");
        b.className = "click-burst";
        b.style.left = x + "px";
        b.style.top = y + "px";

        card.appendChild(b);
        setTimeout(() => b.remove(), 560);
      });
    });
  }

  /* -------------------------------
     FOOTER ICON ORBIT (only in footer)
     Target: #colophon a.ast-builder-social-element
     NOTE: Your CSS already styles .orbit-layer/.orbit-dot etc.
  -------------------------------- */
  function initFooterOrbit() {
    const links = document.querySelectorAll("#colophon a.ast-builder-social-element");
    if (!links.length) return;

    links.forEach(a => {
      if (a.dataset.orbitBound === "1") return;
      a.dataset.orbitBound = "1";

      // If orbit markup already exists, skip
      if (a.querySelector(".orbit-layer")) return;

      const layer = document.createElement("span");
      layer.className = "orbit-layer";

      // 3 dots with different speeds
      for (let i = 0; i < 3; i++) {
        const spin = document.createElement("span");
        spin.className = "orbit-spin";
        const dot = document.createElement("span");
        dot.className = "orbit-dot";
        spin.appendChild(dot);
        layer.appendChild(spin);
      }
      a.appendChild(layer);
    });
  }

  /* -------------------------------
     BOOT
  -------------------------------- */
  whenReady(() => {
    // Optional fades (keep if you like)
    initPageFades();

    initSectionAccentShift();
    initMagneticPull();
    initCursorFX();
    initHeroEnergy();
    initCardTilt();
    initCardClickBurst();
    initFooterOrbit();
  });

})();
/* -------------------------------
   🥚 EASTER EGGS (robust)
   - Konami (arrows + B A)
   - Glow Burst: press "G"
   - Neon Toggle: press "N"
-------------------------------- */
(function () {
  const isTypingInField = () => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || el.isContentEditable;
  };

  // --- helpers
  let neonInterval = null;

  function setAccent(a, b) {
    document.documentElement.style.setProperty("--accent", a);
    document.documentElement.style.setProperty("--accent2", b);
  }

  function startNeonCycle() {
    const accents = [
      ["#00F0FF", "#4DEEFF"],
      ["#A855F7", "#E879F9"],
      ["#22C55E", "#86EFAC"],
      ["#00F0FF", "#4DEEFF"],
    ];
    let i = 0;
    stopNeonCycle();
    neonInterval = setInterval(() => {
      const [a, b] = accents[i % accents.length];
      setAccent(a, b);
      i++;
    }, 420);
  }

  function stopNeonCycle() {
    if (neonInterval) clearInterval(neonInterval);
    neonInterval = null;
  }

  function pulseBurst(ms = 8000) {
    document.body.classList.add("easter-glow");
    startNeonCycle();
    window.clearTimeout(pulseBurst._t);
    pulseBurst._t = window.setTimeout(() => {
      document.body.classList.remove("easter-glow");
      stopNeonCycle();
    }, ms);
  }

  function toggleNeon() {
    const on = document.body.classList.toggle("easter-neon");
    if (on) startNeonCycle();
    else stopNeonCycle();
  }

  // --- Konami listener (more tolerant)
  const konami = [
    "arrowup","arrowup",
    "arrowdown","arrowdown",
    "arrowleft","arrowright",
    "arrowleft","arrowright",
    "b","a"
  ];
  let k = 0;
  let locked = false;

  window.addEventListener("keydown", (e) => {
    if (isTypingInField()) return; // don't hijack typing in forms
    const key = (e.key || "").toLowerCase();

    // quick hotkeys
    if (key === "g") { pulseBurst(8000); return; }   // instant test
    if (key === "n") { toggleNeon(); return; }       // toggle mode

    if (locked) return;

    const expected = konami[k];
    if (key === expected) {
      k++;
      if (k === konami.length) {
        k = 0;
        locked = true;
        pulseBurst(9000);
        // unlock after it ends
        setTimeout(() => { locked = false; }, 9200);
      }
    } else {
      k = 0;
    }
  });

  // Debug: prove the egg script loaded
  console.log("🥚 Easter eggs loaded: press G (burst) or N (toggle), or Konami.");
})();

