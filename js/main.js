(function () {
  var header = document.querySelector(".site-header");
  var demo = document.querySelector(".demo-strip");
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".mobile-menu");
  var body = document.body;
  var lockedY = 0;

  function demoH() {
    return demo ? demo.offsetHeight : 0;
  }

  function syncHeaderTop() {
    if (!header) return;
    header.style.top = demoH() + "px";
    document.documentElement.style.setProperty("--demo-h", demoH() + "px");
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
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
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
      }
    });
  }

  // Click-to-load map
  var mapBtn = document.querySelector("[data-map-load]");
  if (mapBtn) {
    mapBtn.addEventListener("click", function () {
      var wrap = mapBtn.closest(".map-frame");
      if (!wrap) return;
      var src = mapBtn.getAttribute("data-map-src");
      if (!src) return;
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

  syncHeaderTop();
  window.addEventListener("resize", syncHeaderTop);
})();
