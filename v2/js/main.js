(function () {
  // shared menu + map from parent pattern (paths differ)
  var header = document.querySelector(".site-header");
  var demo = document.querySelector(".demo-strip");
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".mobile-menu");
  var body = document.body;
  var lockedY = 0;

  function demoH() { return demo ? demo.offsetHeight : 0; }
  function syncHeaderTop() {
    if (!header) return;
    header.style.top = demoH() + "px";
    var spacer = document.querySelector(".header-spacer");
    if (spacer) spacer.style.height = demoH() + header.offsetHeight + "px";
    if (menu) menu.style.top = demoH() + header.offsetHeight + "px";
  }
  function lockScroll() {
    lockedY = window.scrollY || window.pageYOffset;
    body.style.position = "fixed";
    body.style.top = "-" + lockedY + "px";
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.classList.add("menu-open");
    document.documentElement.style.overflow = "hidden";
  }
  function unlockScroll() {
    body.classList.remove("menu-open");
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    document.documentElement.style.overflow = "";
    window.scrollTo(0, lockedY);
  }
  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    unlockScroll();
    toggle.focus();
  }
  function openMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    lockScroll();
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });
    menu.querySelectorAll("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") closeMenu();
    });
  }

  var mapBtn = document.querySelector("[data-map-load]");
  if (mapBtn) {
    mapBtn.addEventListener("click", function () {
      var wrap = mapBtn.closest(".map-frame");
      var src = mapBtn.getAttribute("data-map-src");
      if (!wrap || !src) return;
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = "Карта: салон ATAMA на улице Урицкого, 4";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.allowFullscreen = true;
      wrap.innerHTML = "";
      wrap.appendChild(iframe);
    });
  }

  // Circle reveal
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".v2-reveal");
  if (reduce) {
    reveals.forEach(function (el) { el.classList.add("is-done"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-in");
        var done = function () {
          el.classList.add("is-done");
          el.removeEventListener("transitionend", done);
        };
        el.addEventListener("transitionend", done);
        io.unobserve(el);
      });
    }, { threshold: 0.25 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-done"); });
  }

  // Drop curtain after animation so it doesn't block
  var curtain = document.querySelector(".v2-hero__curtain");
  if (curtain) {
    curtain.addEventListener("animationend", function () {
      curtain.style.display = "none";
    });
    if (reduce) curtain.style.display = "none";
  }

  // Carousels
  function initCarousel(root) {
    var track = root.querySelector(".carousel__track");
    var slides = root.querySelectorAll(".carousel__slide");
    var prev = root.querySelector(".carousel__btn--prev");
    var next = root.querySelector(".carousel__btn--next");
    var dotsWrap = root.querySelector(".carousel__dots");
    if (!track || !slides.length) return;
    var i = 0;
    var n = slides.length;

    function go(to) {
      i = (to + n) % n;
      track.style.transform = "translateX(-" + i * 100 + "%)";
      if (dotsWrap) {
        dotsWrap.querySelectorAll(".carousel__dot").forEach(function (d, di) {
          if (di === i) d.setAttribute("aria-current", "true");
          else d.removeAttribute("aria-current");
        });
      }
    }

    if (dotsWrap) {
      for (var d = 0; d < n; d++) {
        (function (di) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "carousel__dot";
          b.setAttribute("aria-label", "Слайд " + (di + 1));
          if (di === 0) b.setAttribute("aria-current", "true");
          b.addEventListener("click", function () { go(di); });
          dotsWrap.appendChild(b);
        })(d);
      }
    }
    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });

    // swipe
    var startX = 0;
    var dx = 0;
    var viewport = root.querySelector(".carousel__viewport");
    if (viewport) {
      viewport.addEventListener("touchstart", function (e) {
        startX = e.changedTouches[0].clientX;
        dx = 0;
      }, { passive: true });
      viewport.addEventListener("touchmove", function (e) {
        dx = e.changedTouches[0].clientX - startX;
      }, { passive: true });
      viewport.addEventListener("touchend", function () {
        if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
      });
    }

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    });
  }

  document.querySelectorAll(".carousel").forEach(initCarousel);

  syncHeaderTop();
  window.addEventListener("resize", syncHeaderTop);
})();
