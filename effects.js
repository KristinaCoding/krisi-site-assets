(function () {
  "use strict";

  /* =========================
     Helpers / guards
  ========================== */
  function whenReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else fn();
  }
  const isMobileish = () => window.matchMedia("(max-width: 768px)").matches;
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isTypingInField = () => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || el.isContentEditable;
  };

  function setAccent(a, b) {
    document.documentElement.style.setProperty("--accent", a);
    document.documentElement.style.setProperty("--accent2", b);
  }

  /* =========================
     A) Page transition glow
  ========================== */
  function initPageTransitionGlow() {
    if (reducedMotion()) return;

    if (!document.querySelector(".page-transition")) {
      const ov = document.createElement("div");
      ov.className = "page-transition";
      document.body.appendChild(ov);
      requestAnimationFrame(() => document.body.classList.add("pt-ready"));
    }

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
      document.body.classList.add("pt-leaving");
      blip(220, 980, 0.12, 0.05);

      setTimeout(() => { window.location.href = url.href; }, 320);
    });
  }

  /* =========================
     B) Section accent shift (hover/scroll)
  ========================== */
  function initSectionAccentShift() {
    const sections = document.querySelectorAll(".accent-cyan, .accent-purple, .accent-green");
    if (!sections.length) return;

    function setAccentFrom(el) {
      const cs = getComputedStyle(el);
      const a = cs.getPropertyValue("--accent").trim();
      const a2 = cs.getPropertyValue("--accent2").trim();
      if (a) document.documentElement.style.setProperty("--accent", a);
      if (a2) document.documentElement.style.setProperty("--accent2", a2);
    }

    sections.forEach(sec => {
      sec.addEventListener("mouseenter", () => setAccentFrom(sec));
      sec.addEventListener("focusin", () => setAccentFrom(sec));
    });

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

  /* =========================
     C) Cursor glow + particles
  ========================== */
  function initCursorFX() {
    if (isMobileish() || reducedMotion()) return;

    let glow = document.querySelector(".cursor-glow");
    if (!glow) {
      glow = document.createElement("div");
      glow.className = "cursor-glow";
      document.body.appendChild(glow);
    }

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;

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

  /* =========================
     D) Hero proximity energy
  ========================== */
  function initHeroEnergy() {
    if (isMobileish() || reducedMotion()) return;

    const hero =
      document.querySelector(".hero-title") ||
      document.querySelector(".proximity-heading");

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

  /* =========================
     E) Card tilt + click burst
  ========================== */
  function initCardFX() {
    const cards = document.querySelectorAll(".glass-card");
    if (!cards.length) return;

    const tiltOn = !(isMobileish() || reducedMotion());
    const maxTilt = 12;
    const scale = 1.04;

    cards.forEach(card => {
      // click burst
      if (card.dataset.burstBound !== "1") {
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

          blip(240, 900, 0.10, 0.05);
        });
      }

      // tilt
      if (tiltOn && card.dataset.tiltBound !== "1") {
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
      }
    });
  }

  /* =========================
     F) Footer orbit
  ========================== */
  function initFooterOrbit() {
    const links = document.querySelectorAll("#colophon a.ast-builder-social-element");
    if (!links.length) return;

    links.forEach(a => {
      if (a.dataset.orbitBound === "1") return;
      a.dataset.orbitBound = "1";
      if (a.querySelector(".orbit-layer")) return;

      const layer = document.createElement("span");
      layer.className = "orbit-layer";
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

  /* =========================
     G) Neon button hover physics
  ========================== */
  function initNeonButtonPhysics() {
    if (isMobileish() || reducedMotion()) return;

    const selectors = [
      ".elementor-button",
      ".wp-block-button__link",
      ".ast-button",
      "button",
      "a.magnetic",
      ".main-navigation a",
      ".nav-menu a",
      ".ast-above-header-bar a",
      ".ast-primary-header-bar a"
    ];

    const buttons = document.querySelectorAll(selectors.join(","));
    buttons.forEach(btn => {
      if (btn.dataset.neonBound === "1") return;
      btn.dataset.neonBound = "1";
      btn.classList.add("neon-physics");

      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        btn.style.setProperty("--mx", `${x}px`);
        btn.style.setProperty("--my", `${y}px`);
      });

      btn.addEventListener("mouseenter", () => blip(260, 520, 0.12, 0.03));
      btn.addEventListener("click", () => blip(220, 780, 0.10, 0.05));
    });
  }

  /* =========================
     H) Section reveal animations
  ========================== */
  function initSectionReveal() {
    if (reducedMotion()) return;

    const nodes = document.querySelectorAll(".elementor-section, .e-con, .e-con-inner, .elementor-widget");
    if (!nodes.length) return;

    nodes.forEach(el => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add("reveal-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach(el => io.observe(el));
  }

  /* =========================
     I) Orbs layer + scroll parallax
  ========================== */
  function initOrbsAndParallax() {
    if (reducedMotion()) return;

    let orbs = document.querySelector(".bg-orbs");
    if (!orbs) {
      orbs = document.createElement("div");
      orbs.className = "bg-orbs";
      document.body.appendChild(orbs);
    }

    let target = 0;
    let current = 0;

    function onScroll() {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target = (window.scrollY / maxScroll) * 60;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function loop() {
      current += (target - current) * 0.08;
      orbs.style.transform = `translate3d(0, ${-current}px, 0) scale(1.05)`;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* =========================
     J) Floating background particles
  ========================== */
  function initFloatingParticles() {
    if (isMobileish() || reducedMotion()) return;
    if (document.querySelector(".bg-particles")) return;

    const wrap = document.createElement("div");
    wrap.className = "bg-particles";
    document.body.appendChild(wrap);

    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "bg-particle";

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const s = 0.6 + Math.random() * 1.2;
      const d = 10 + Math.random() * 18;
      const o = 0.15 + Math.random() * 0.25;

      p.style.left = x + "vw";
      p.style.top = y + "vh";
      p.style.opacity = o.toFixed(2);
      p.style.transform = `scale(${s.toFixed(2)})`;
      p.style.animationDuration = d.toFixed(1) + "s";
      p.style.animationDelay = (-Math.random() * d).toFixed(1) + "s";
      wrap.appendChild(p);
    }
  }

  /* =========================
     K) Scroll glow trails (optional)
  ========================== */
  function initScrollTrails() {
    if (isMobileish() || reducedMotion()) return;

    let last = 0;
    let lastX = window.innerWidth * 0.5;
    let lastY = window.innerHeight * 0.6;

    window.addEventListener("mousemove", (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
    }, { passive: true });

    function spawn(px, py) {
      const p = document.createElement("div");
      p.className = "scroll-particle";
      p.style.left = px + "px";
      p.style.top = py + "px";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }

    window.addEventListener("scroll", () => {
      const now = performance.now();
      if (now - last < 90) return;
      last = now;
      spawn(lastX + (Math.random() * 18 - 9), lastY + (Math.random() * 18 - 9));
      if (Math.random() > 0.55) spawn(lastX + (Math.random() * 28 - 14), lastY + (Math.random() * 28 - 14));
    }, { passive: true });
  }

  /* =========================
     L) Magnetic pull (menu + .magnetic)
  ========================== */
  function initMagneticPull() {
    if (isMobileish() || reducedMotion()) return;

    const selectors = [
      ".ast-above-header-bar .site-header-above-section-center a",
      ".ast-primary-header-bar a",
      ".main-navigation a",
      ".nav-menu a",
      ".magnetic"
    ];

    const items = document.querySelectorAll(selectors.join(","));
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

  /* =========================
     M) Sound FX toggle (S)
     + simple synth blip()
  ========================== */
  const SFX_KEY = "krisi_sfx_on";
  let sfxOn = localStorage.getItem(SFX_KEY) === "1";
  let audioCtx = null;

  function blip(freqA = 280, freqB = 820, dur = 0.14, gain = 0.04) {
    if (!sfxOn || reducedMotion()) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const t0 = audioCtx.currentTime;

      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const f = audioCtx.createBiquadFilter();

      o.type = "triangle";
      o.frequency.setValueAtTime(freqA, t0);
      o.frequency.exponentialRampToValueAtTime(freqB, t0 + dur);

      f.type = "lowpass";
      f.frequency.setValueAtTime(900, t0);
      f.frequency.exponentialRampToValueAtTime(2400, t0 + dur);

      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      o.connect(f); f.connect(g); g.connect(audioCtx.destination);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    } catch (_) {}
  }

  function initSfxToggle() {
    // enable audio context on first user click
    window.addEventListener("pointerdown", () => {
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();
    }, { passive: true });

    window.addEventListener("keydown", (e) => {
      if (isTypingInField()) return;
      if ((e.key || "").toLowerCase() !== "s") return;

      sfxOn = !sfxOn;
      localStorage.setItem(SFX_KEY, sfxOn ? "1" : "0");
      document.body.classList.toggle("sfx-on", sfxOn);
      blip(220, 520, 0.16, 0.05);
      console.log("SFX:", sfxOn ? "ON" : "OFF");
    });

    document.body.classList.toggle("sfx-on", sfxOn);
  }

  /* =========================
     N) Easter eggs (G / N / Konami / word cheats)
  ========================== */
  let neonInterval = null;
  function startNeonCycle() {
    const accents = [
      ["#00F0FF", "#4DEEFF"],
      ["#A855F7", "#E879F9"],
      ["#22C55E", "#86EFAC"]
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
    blip(260, 900, 0.14, 0.05);

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
    blip(240, 760, 0.14, 0.05);
  }

  function resetModes() {
    document.body.classList.remove("easter-glow", "easter-neon");
    stopNeonCycle();
    setAccent("#00F0FF", "#4DEEFF");
    blip(220, 520, 0.12, 0.04);
  }

  function initEggs() {
    const konami = [
      "arrowup","arrowup","arrowdown","arrowdown",
      "arrowleft","arrowright","arrowleft","arrowright","b","a"
    ];
    let k = 0;
    let locked = false;

    let buffer = "";
    let bufferTimer = null;

    window.addEventListener("keydown", (e) => {
      if (isTypingInField()) return;
      const key = (e.key || "").toLowerCase();

      // quick keys
      if (key === "g") { pulseBurst(8000); return; }
      if (key === "n") { toggleNeon(); return; }
      if (key === "r") { resetModes(); return; }

      // word cheats
      if (/^[a-z]$/.test(key)) {
        buffer += key;
        buffer = buffer.slice(-10);

        clearTimeout(bufferTimer);
        bufferTimer = setTimeout(() => { buffer = ""; }, 900);

        if (buffer.endsWith("glow")) pulseBurst(8000);
        if (buffer.endsWith("cyber")) toggleNeon();
        if (buffer.endsWith("reset")) resetModes();
      }

      // konami
      if (locked) return;
      if (key === konami[k]) {
        k++;
        if (k === konami.length) {
          k = 0;
          locked = true;
          pulseBurst(9000);
          setTimeout(() => { locked = false; }, 9200);
        }
      } else {
        k = 0;
      }
    });

    console.log("🥚 Eggs: G=burst, N=toggle neon, R=reset. Word: glow/cyber/reset. Konami works too.");
  }

  /* =========================
     BOOT
  ========================== */
  whenReady(() => {
    initSfxToggle();

    initPageTransitionGlow();
    initSectionAccentShift();

    initCursorFX();
    initHeroEnergy();

    initMagneticPull();
    initNeonButtonPhysics();

    initSectionReveal();
    initOrbsAndParallax();
    initFloatingParticles();
    initScrollTrails();

    initCardFX();
    initFooterOrbit();

    initEggs();

    console.log("✅ KRISI FX loaded.");
  });

})();
