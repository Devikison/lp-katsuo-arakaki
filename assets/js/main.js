(function () {
  "use strict";

  var cfg = window.LP_CONFIG || {};

  /* ---------- WhatsApp: monta o link em todos os botões ---------- */
  var number = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  var text = encodeURIComponent(cfg.whatsappMessage || "");
  var waUrl = number ? "https://wa.me/" + number + (text ? "?text=" + text : "") : "#";

  document.querySelectorAll(".js-wa").forEach(function (a) {
    a.setAttribute("href", waUrl);
    if (waUrl === "#") a.setAttribute("aria-disabled", "true");
  });

  /* ---------- Vídeos: capa leve, iframe só quando clicar ---------- */
  var urls = { vsl: cfg.vslUrl || "", depo: cfg.depoUrl || "" };

  function embedUrl(u) {
    // Aceita links "watch?v=" e "youtu.be" e converte para embed
    var m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
    if (m) return "https://www.youtube.com/embed/" + m[1];
    var v = u.match(/vimeo\.com\/(\d+)/);
    if (v && u.indexOf("player.vimeo.com") === -1) return "https://player.vimeo.com/video/" + v[1];
    return u;
  }

  document.querySelectorAll(".video[data-video-target]").forEach(function (btn) {
    var key = btn.getAttribute("data-video-target");
    var url = urls[key];
    if (!url) {
      btn.classList.add("video--pending");
      btn.setAttribute("title", "Vídeo em breve");
      return;
    }
    btn.addEventListener("click", function () {
      var src = embedUrl(url);
      var sep = src.indexOf("?") === -1 ? "?" : "&";
      var frame = document.createElement("iframe");
      frame.src = src + sep + "autoplay=1&rel=0";
      frame.title = btn.getAttribute("aria-label") || "Vídeo";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture";
      frame.setAttribute("allowfullscreen", "");
      frame.className = "video__frame";
      btn.replaceWith(frame);
    });
  });

  /* ---------- Revelação suave ao rolar ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  // O que já está na primeira dobra aparece na hora, sem esperar o observer
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
  });
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { if (!el.classList.contains("is-in")) io.observe(el); });
  }

  /* ---------- Carrossel de depoimentos ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-track]");
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    var dotsBox = root.querySelector("[data-dots]");
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("aria-label", "Ir para o depoimento " + (i + 1));
      b.addEventListener("click", function () { go(i); });
      dotsBox.appendChild(b);
      return b;
    });

    function gap() { var g = parseFloat(getComputedStyle(track).columnGap); return isNaN(g) ? 16 : g; }
    function step() { return slides[0].getBoundingClientRect().width + gap(); }
    function index() { return Math.round(track.scrollLeft / step()); }
    function maxIndex() { return Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step())); }
    function go(i) {
      i = Math.max(0, Math.min(i, maxIndex()));
      track.scrollTo({ left: i * step(), behavior: reduce ? "auto" : "smooth" });
    }
    function paint() {
      var i = index(), m = maxIndex();
      dots.forEach(function (d, k) { d.classList.toggle("is-on", k === Math.min(i, dots.length - 1)); });
      prev.disabled = i <= 0; next.disabled = i >= m;
    }
    prev.addEventListener("click", function () { go(index() - 1); });
    next.addEventListener("click", function () { go(index() + 1); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(paint); }, { passive: true });
    window.addEventListener("resize", paint);
    paint();

    /* arrastar com o mouse no desktop */
    var down = false, startX = 0, startL = 0, moved = false;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startL = track.scrollLeft;
      track.classList.add("is-dragging"); track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX; if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startL - dx;
    });
    function up() {
      if (!down) return; down = false; track.classList.remove("is-dragging");
      go(index());
    }
    track.addEventListener("pointerup", up); track.addEventListener("pointercancel", up); track.addEventListener("mouseleave", up);
    track.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);

    /* passa sozinho, devagar; para enquanto a pessoa interage */
    var timer = null, hold = false;
    function play() {
      if (reduce) return;
      clearInterval(timer);
      timer = setInterval(function () {
        if (hold || document.hidden) return;
        var i = index(); go(i >= maxIndex() ? 0 : i + 1);
      }, 5200);
    }
    ["pointerenter", "focusin", "touchstart"].forEach(function (ev) { root.addEventListener(ev, function () { hold = true; }, { passive: true }); });
    ["pointerleave", "focusout", "touchend"].forEach(function (ev) { root.addEventListener(ev, function () { hold = false; }, { passive: true }); });
    play();
  });

  /* ---------- FAQ: abre e fecha com animação lenta e suave, um por vez ---------- */
  var faqs = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
  function faqOpen(d) {
    var body = d.querySelector(".faq__body");
    faqs.forEach(function (o) { if (o !== d && o.classList.contains("is-open")) faqClose(o); });
    d.open = true;
    if (reduce) { d.classList.add("is-open"); body.style.height = "auto"; return; }
    body.style.height = "0px";
    body.getBoundingClientRect();
    body.style.height = body.scrollHeight + "px";
    d.classList.add("is-open");
    var done = function (e) {
      if (e.propertyName !== "height") return;
      body.removeEventListener("transitionend", done);
      if (d.classList.contains("is-open")) body.style.height = "auto";
    };
    body.addEventListener("transitionend", done);
  }
  function faqClose(d) {
    var body = d.querySelector(".faq__body");
    if (reduce) { d.classList.remove("is-open"); body.style.height = ""; d.open = false; return; }
    body.style.height = body.getBoundingClientRect().height + "px";
    body.getBoundingClientRect();
    body.style.height = "0px";
    d.classList.remove("is-open");
    var done = function (e) {
      if (e.propertyName !== "height") return;
      body.removeEventListener("transitionend", done);
      if (!d.classList.contains("is-open")) { d.open = false; body.style.height = ""; }
    };
    body.addEventListener("transitionend", done);
  }
  faqs.forEach(function (d) {
    d.querySelector("summary").addEventListener("click", function (e) {
      e.preventDefault();
      if (d.classList.contains("is-open")) faqClose(d); else faqOpen(d);
    });
  });

  /* ---------- Barra fixa (celular): aparece só depois do hero, some no rodapé ---------- */
  var sticky = document.querySelector(".sticky");
  var hero = document.getElementById("hero");
  var footer = document.querySelector(".footer");
  if (sticky && hero && footer) {
    function paintSticky() {
      var pastHero = hero.getBoundingClientRect().bottom < 96;
      var atFooter = footer.getBoundingClientRect().top < window.innerHeight - 24;
      sticky.classList.toggle("sticky--on", pastHero && !atFooter);
    }
    window.addEventListener("scroll", paintSticky, { passive: true });
    window.addEventListener("resize", paintSticky);
    paintSticky();
  }

  /* ---------- Balão de conversa (desktop): aparece depois de um tempo ou ao passar o hero ---------- */
  var bubble = document.querySelector("[data-bubble]");
  if (bubble) {
    var closed = false;
    try { closed = sessionStorage.getItem("lp-bubble-closed") === "1"; } catch (e) {}
    var showBubble = function () {
      if (closed || bubble.classList.contains("bubble--on")) return;
      bubble.hidden = false;
      window.requestAnimationFrame(function () { bubble.classList.add("bubble--on"); });
    };
    if (!closed) {
      setTimeout(showBubble, 6000);
      window.addEventListener("scroll", function onFirst() {
        if (window.scrollY > 500) { showBubble(); window.removeEventListener("scroll", onFirst); }
      }, { passive: true });
    }
    var closeBtn = bubble.querySelector("[data-bubble-close]");
    closeBtn.addEventListener("click", function () {
      closed = true;
      bubble.classList.remove("bubble--on");
      try { sessionStorage.setItem("lp-bubble-closed", "1"); } catch (e) {}
      setTimeout(function () { bubble.hidden = true; }, 700);
    });
  }

  /* ---------- Cookies: aceitar ou recusar, lembrado no navegador ---------- */
  var cookie = document.querySelector("[data-cookie]");
  if (cookie) {
    var choice = null;
    try { choice = localStorage.getItem("lp-cookie-consent"); } catch (e) {}
    window.LP_CONSENT = choice;
    if (!choice) {
      setTimeout(function () {
        cookie.hidden = false;
        document.body.classList.add("cookie-open");
        window.requestAnimationFrame(function () { cookie.classList.add("cookie--on"); });
      }, 1500);
    }
    function decide(v) {
      try { localStorage.setItem("lp-cookie-consent", v); } catch (e) {}
      window.LP_CONSENT = v;
      document.dispatchEvent(new CustomEvent("lp:consent", { detail: v }));
      cookie.classList.remove("cookie--on");
      document.body.classList.remove("cookie-open");
      setTimeout(function () { cookie.hidden = true; }, 600);
    }
    cookie.querySelector("[data-cookie-accept]").addEventListener("click", function () { decide("accepted"); });
    cookie.querySelector("[data-cookie-deny]").addEventListener("click", function () { decide("denied"); });
  }

  /* ---------- Ano ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = "© " + new Date().getFullYear();
})();
