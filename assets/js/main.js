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

  /* ---------- FAQ: um aberto por vez ---------- */
  var faqs = document.querySelectorAll(".faq__item");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Barra fixa: some quando o rodapé aparece ---------- */
  var sticky = document.querySelector(".sticky");
  var footer = document.querySelector(".footer");
  if (sticky && footer && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle("sticky--hide", entries[0].isIntersecting);
    }, { threshold: 0.2 }).observe(footer);
  }

  /* ---------- Ano ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = "© " + new Date().getFullYear();
})();
