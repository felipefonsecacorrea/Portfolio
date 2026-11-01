/* Felipe Fonseca · Portfólio — interações */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tema claro / escuro ---------- */
  const THEME_KEY = "ff-theme";
  const getStored = () => { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } };
  const store = (v) => { try { localStorage.setItem(THEME_KEY, v); } catch (e) { /* ignore */ } };

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0f1a" : "#f5f7fb");
    document.querySelectorAll(".theme-toggle").forEach((b) =>
      b.setAttribute("aria-label", theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"));
  }
  applyTheme(root.getAttribute("data-theme") || "light");

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      store(next);
      if (!document.startViewTransition || reduceMotion) { applyTheme(next); return; }
      // Transição circular a partir do botão
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const t = document.startViewTransition(() => applyTheme(next));
      t.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
          { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(() => {});
    });
  });

  // Segue o sistema se o usuário nunca escolheu
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", (e) => {
    if (!getStored()) applyTheme(e.matches ? "dark" : "light");
  });

  /* ---------- Header / menu mobile ---------- */
  const header = document.querySelector(".site-header");
  const onScrollHeader = () => header && header.classList.toggle("scrolled", scrollY > 8);
  onScrollHeader();
  addEventListener("scroll", onScrollHeader, { passive: true });

  const menuBtn = document.querySelector(".menu-toggle");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".main-nav a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("nav-open")));
    addEventListener("keydown", (e) => { if (e.key === "Escape") document.body.classList.remove("nav-open"); });
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Reveal ao rolar ---------- */
  const revealEls = document.querySelectorAll(".reveal, .lang");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Efeito de digitação ---------- */
  const typed = document.querySelector("[data-typed]");
  if (typed) {
    const words = JSON.parse(typed.getAttribute("data-typed"));
    if (reduceMotion) { typed.textContent = words[0]; }
    else {
      let w = 0, c = 0, del = false;
      (function tick() {
        const word = words[w];
        typed.textContent = word.slice(0, c);
        if (!del && c < word.length) { c++; setTimeout(tick, 70); }
        else if (!del) { del = true; setTimeout(tick, 1600); }
        else if (c > 0) { c--; setTimeout(tick, 35); }
        else { del = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
      })();
    }
  }

  /* ---------- Contadores ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const target = +el.getAttribute("data-count");
      const suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion) { el.textContent = target + suffix; return; }
      const start = performance.now(), dur = 1400;
      (function step(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Tilt da foto (Home) ---------- */
  const frame = document.querySelector(".photo-frame");
  if (frame && !reduceMotion && matchMedia("(hover: hover)").matches) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", (e) => {
      const r = frame.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      frame.style.setProperty("--ry", (dx * 14).toFixed(2) + "deg");
      frame.style.setProperty("--rx", (-dy * 14).toFixed(2) + "deg");
    });
    hero.addEventListener("mouseleave", () => {
      frame.style.setProperty("--ry", "0deg");
      frame.style.setProperty("--rx", "0deg");
    });
  }

  /* ---------- Parallax ---------- */
  const layers = document.querySelectorAll("[data-speed]");
  if (layers.length && !reduceMotion) {
    let mx = 0, my = 0, ticking = false;
    const update = () => {
      const sy = scrollY;
      layers.forEach((el) => {
        const s = parseFloat(el.getAttribute("data-speed"));
        const base = el.closest(".parallax-band") ? (el.closest(".parallax-band").offsetTop - innerHeight / 2) : 0;
        const ty = (sy - base) * s;
        const mxv = el.hasAttribute("data-mouse") ? mx * s * 60 : 0;
        const myv = el.hasAttribute("data-mouse") ? my * s * 60 : 0;
        el.style.transform = `translate3d(${mxv}px, ${ty + myv}px, 0)`;
      });
      ticking = false;
    };
    const req = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("mousemove", (e) => {
      mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; req();
    }, { passive: true });
    update();
  }

  /* ---------- Linha do tempo: progresso + expandir ---------- */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const bar = timeline.querySelector(".progress");
    const upd = () => {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * 0.6 - r.top) / r.height, 0), 1);
      bar.style.height = (p * 100) + "%";
    };
    addEventListener("scroll", upd, { passive: true }); upd();

    timeline.querySelectorAll(".t-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".t-item");
        const open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
        btn.querySelector("span").textContent = open ? "Mostrar menos" : "Ver detalhes";
      });
    });
  }

  /* ---------- Navegação interna do currículo (scrollspy) ---------- */
  const cvLinks = document.querySelectorAll(".cv-nav a");
  if (cvLinks.length) {
    const sections = [...cvLinks].map((a) => document.querySelector(a.getAttribute("href")));
    const spy = () => {
      let idx = 0;
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) idx = i; });
      cvLinks.forEach((a, i) => a.classList.toggle("active", i === idx));
    };
    addEventListener("scroll", spy, { passive: true }); spy();
  }

  /* ---------- Filtro de cursos ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("active"); btn.setAttribute("aria-pressed", "true");
      const f = btn.getAttribute("data-filter");
      document.querySelectorAll(".course").forEach((c, i) => {
        const show = f === "all" || c.getAttribute("data-cat").split(" ").includes(f);
        c.classList.toggle("hide", !show);
        if (show && !reduceMotion) {
          c.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
            { duration: 400, delay: i * 25, easing: "ease-out", fill: "backwards" });
        }
      });
    });
  });

  /* ---------- Botão flutuante de download ---------- */
  const fab = document.querySelector(".fab-download");
  if (fab) {
    const t = () => fab.classList.toggle("show", scrollY > innerHeight * 0.6);
    addEventListener("scroll", t, { passive: true }); t();
  }

  /* ---------- Brilho que segue o mouse (Serviços) ---------- */
  document.querySelectorAll(".service").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Copiar contato ---------- */
  const toast = document.querySelector(".toast");
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault(); e.stopPropagation();
      const text = btn.getAttribute("data-copy");
      try { await navigator.clipboard.writeText(text); showToast("Copiado: " + text); }
      catch (err) { showToast(text); }
    });
  });
})();
