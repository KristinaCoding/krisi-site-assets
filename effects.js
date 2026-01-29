(function () {

  function whenReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else fn();
  }

  /* PAGE FADE (demo-safe) */
  function initPageFades(){
    document.body.classList.add("is-loaded");
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#") || a.target === "_blank") return;
      // In CodePen we don't navigate away; keep this disabled.
    });
  }

  /* SECTION ACCENT SHIFT */
  function initSectionAccentShift() {
    const sections = document.querySelectorAll(".accent-cyan, .accent-purple, .accent-green");
    if (!sections.length) return;

    function setAccentFrom(el){
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
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        let best = null, bestDist = Infinity;
        const mid = window.innerHeight * 0.45;

        sections.forEach(sec => {
          const r = sec.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist){ bestDist = dist; best = sec; }
        });
        if (best) setAccentFrom(best);
      });
    }

    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
  }

  /* MAGNETIC PULL */
  function initMagneticPull(){
    const items = document.querySelectorAll(".magnetic");
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
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });
  }

  /* CURSOR GLOW + PARTICLES */
  function initCursorFX(){
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let glow = document.querySelector(".cursor-glow");
    if (!glow){
      glow = document.createElement("div");
      glow.className = "cursor-glow";
      document.body.appendChild(glow);
    }

    let x = innerWidth/2, y = innerHeight/2, tx = x, ty = y;

    let lastParticleTime = 0;
    const particleEveryMs = 22;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;

      const now = performance.now();
      if (now - lastParticleTime > particleEveryMs){
        lastParticleTime = now;
        const p = document.createElement("div");
        p.className = "cursor-particle";
        p.style.left = tx + "px";
        p.style.top = ty + "px";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 650);
      }
    }, { passive:true });

    (function loop(){
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      glow.style.left = x + "px";
      glow.style.top = y + "px";
      requestAnimationFrame(loop);
    })();
  }

  /* HEADING PROXIMITY GLOW */
  function initHeadingProximityGlow(){
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const headings = Array.from(document.querySelectorAll("h1, h2, h3, .elementor-heading-title"))
      .filter(h => h.textContent && h.textContent.trim().length);

    headings.forEach(h => h.classList.add("proximity-heading"));
    if (!headings.length) return;

    let mx = innerWidth/2, my = innerHeight/2;
    let ticking = false;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        for (const h of headings){
          const r = h.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) continue;

          const cx = r.left + r.width/2;
          const cy = r.top + r.height/2;
          const dx = mx - cx;
          const dy = my - cy;
          const dist = Math.sqrt(dx*dx + dy*dy);

          const radius = Math.max(220, Math.min(520, r.width * 0.9));
          const p = Math.max(0, Math.min(1, 1 - dist / radius));
          h.style.setProperty("--p", p.toFixed(3));
        }
      });
    }, { passive:true });
  }

  /* CLICK GLOW EXPLOSION */
  function initCardClickBurst(){
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".glass-card, .dragon-card, .system-card, .icon-card");
      if (!card) return;

      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const burst = document.createElement("span");
      burst.className = "click-burst";
      burst.style.left = x + "px";
      burst.style.top = y + "px";
      card.appendChild(burst);

      setTimeout(() => burst.remove(), 700);
    });
  }

  function initContentCards(){
    const headingSelector = "h2, h3, .elementor-heading-title";
    const headings = Array.from(document.querySelectorAll(headingSelector));

    function closestCard(el){
      return el.closest(".elementor-column, .e-con, .elementor-widget-wrap, .elementor-widget-container, section");
    }

    const dragonNames = ["aether drake", "verdant wyrm", "cryo seraph", "pyro titan"];
    const glassCardHeadings = ["build a system", "learn the system", "explore the lab"];
    headings.forEach(h => {
      const text = (h.textContent || "").trim().toLowerCase();
      if (!text) return;

      if (dragonNames.some(name => text.includes(name))){
        const card = closestCard(h);
        if (card){
          card.classList.add("dragon-card");
          h.classList.add("dragon-card-title");
          const img = card.querySelector("img");
          if (img) img.classList.add("dragon-card-media");
        }
      }

      if (["clarity", "structure", "flow", "leverage"].includes(text)){
        const card = closestCard(h);
        if (card) card.classList.add("system-card");
      }

      if (text.includes("why systems matter")){
        const section = h.closest(".elementor-section, .e-con, section");
        if (section) section.classList.add("particle-section");
      }

      if (glassCardHeadings.includes(text)){
        const card = closestCard(h);
        if (card) card.classList.add("glass-card");
      }
    });

    const iconBoxes = document.querySelectorAll(".elementor-widget-icon-box, .elementor-widget-icon");
    iconBoxes.forEach(box => {
      const card = box.closest(".elementor-column, .e-con, .elementor-widget-wrap, .elementor-widget-container");
      if (card && !card.classList.contains("system-card")){
        card.classList.add("icon-card");
      }
    });
  }

  function initDragonParallax(){
    const cards = document.querySelectorAll(".dragon-card");
    cards.forEach(card => {
      if (card.dataset.parallaxBound === "1") return;
      card.dataset.parallaxBound = "1";

      let rafId = null;
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-y * 10).toFixed(2);
        const ry = (x * 12).toFixed(2);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      };

      const onLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = "";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  }

  /* FOOTER ORBIT */
  function initFooterOrbit(){
    const links = document.querySelectorAll(".site-footer a");
    links.forEach(a => {
      if (a.dataset.orbitBound === "1") return;
      a.dataset.orbitBound = "1";

      const layer = document.createElement("span");
      layer.className = "orbit-layer";

      for (let i = 0; i < 3; i++){
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

  whenReady(() => {
    initPageFades();
    initSectionAccentShift();
    initMagneticPull();
    initCursorFX();
    initHeadingProximityGlow();
    initCardClickBurst();
    initContentCards();
    initDragonParallax();
    // Footer orbit disabled per request.
    // wave-glow is CSS-only: add class "wave-glow" to anything
  });

})();
