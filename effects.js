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
    const items = document.querySelectorAll(".demo-nav a, .magnetic");
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
      const card = e.target.closest(".glass-card");
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
    initFooterOrbit();
    // wave-glow is CSS-only: add class "wave-glow" to anything
  });

})();
/* ===============================
   SIGNATURE HERO ENERGY FIELD
=============================== */
(function(){
  const strength = 14;

  function initHeroEnergy(){
    const hero = document.querySelector(".hero-title");
    if(!hero) return;

    hero.classList.add("proximity-heading");

    window.addEventListener("mousemove", (e)=>{
      const r = hero.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top  + r.height/2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);

      const max = Math.max(window.innerWidth, window.innerHeight) * 0.6;
      const p = Math.max(0, 1 - (dist / max));

      hero.style.setProperty("--p", p.toFixed(3));

      const tx = (dx / r.width) * strength * p;
      const ty = (dy / r.height) * strength * p;

      hero.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  }

  document.addEventListener("DOMContentLoaded", initHeroEnergy);
})();

