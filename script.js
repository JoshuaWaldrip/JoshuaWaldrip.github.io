// Joshua Waldrip — site behavior
// Theme toggle, mobile nav, active nav link, scroll-reveal, skill bars.

(function () {
  "use strict";

  /* ---- theme: applied ASAP (see inline head script) --------------- */
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");

  function setTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("jw-theme", next); } catch (e) {}
    if (toggle) toggle.setAttribute("aria-pressed", String(next === "light"));
  }

  if (toggle) {
    // Sync aria-pressed to whatever theme the inline head script already
    // applied (from localStorage), without re-writing storage.
    toggle.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "light"));

    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---- mobile nav ---------------------------------------------------- */
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");

  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- active nav link, based on current file ------------------------ */
  var here = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var page = link.getAttribute("data-page-file");
    if (page === here) link.classList.add("is-active");
  });

  /* ---- footer year --------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- scroll reveal --------------------------------------------------*/
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- skill bar fill on reveal --------------------------------------*/
  var bars = document.querySelectorAll(".bar-track");
  if ("IntersectionObserver" in window && bars.length) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var fill = entry.target.querySelector(".bar-fill");
            if (fill && fill.dataset.fill) {
              fill.style.width = fill.dataset.fill + "%";
            }
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach(function (el) { barObserver.observe(el); });
  } else {
    bars.forEach(function (el) {
      var fill = el.querySelector(".bar-fill");
      if (fill && fill.dataset.fill) fill.style.width = fill.dataset.fill + "%";
    });
  }
})();
