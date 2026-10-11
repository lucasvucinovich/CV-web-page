/* =========================================================
   Lucas Vucinovich — CV
   - Language switch (EN <-> ES). English lives in the HTML;
     Spanish lives in JS/i18n.js, keyed by data-i18n.
   - Scroll reveal, copy-to-clipboard, footer year.
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "cv-lang";
  var root = document.documentElement;
  var es = window.CV_ES || {};

  /* ---------- i18n ---------- */

  // Remember the English (original) content so we can switch back.
  var textNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var originalText = new Map();
  textNodes.forEach(function (el) {
    originalText.set(el, el.innerHTML);
  });

  // data-i18n-attr="aria-label:key; title:other.key"
  var attrNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-attr]"));
  var originalAttrs = new Map();
  attrNodes.forEach(function (el) {
    var pairs = el.getAttribute("data-i18n-attr").split(";").map(function (pair) {
      var parts = pair.split(":");
      var name = parts[0].trim();
      return { name: name, key: (parts[1] || "").trim(), en: el.getAttribute(name) };
    });
    originalAttrs.set(el, pairs);
  });

  var currentLang = "en";

  function t(key, fallback) {
    return currentLang === "es" && es[key] != null ? es[key] : fallback;
  }

  function setLang(lang) {
    currentLang = lang === "es" ? "es" : "en";
    root.lang = currentLang;

    textNodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (currentLang === "es" && es[key] == null) {
        console.warn("[i18n] Missing Spanish text for:", key);
      }
      el.innerHTML = t(key, originalText.get(el));
    });

    attrNodes.forEach(function (el) {
      originalAttrs.get(el).forEach(function (a) {
        el.setAttribute(a.name, t(a.key, a.en));
      });
    });

    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === currentLang));
    });

    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) {
      /* storage unavailable (private mode) — the switch still works for this page */
    }

    root.classList.remove("i18n-pending");
  }

  document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
    });
  });

  // The inline <head> script already resolved the preferred language.
  setLang(root.lang === "es" ? "es" : "en");

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Copy to clipboard ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.querySelector("[data-copy-label]");
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var done = function () {
        if (!label) return;
        var previous = label.innerHTML;
        label.textContent = t("contact.copied", "Copied!");
        setTimeout(function () {
          label.innerHTML = t(label.getAttribute("data-i18n"), previous);
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {
          window.location.href = "mailto:" + value;
        });
      } else {
        window.location.href = "mailto:" + value;
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
