/* ============================================================
   main.js · scene flow, atmosphere, keyboard, portrait guard
   ============================================================ */

(function () {
  const closedScene = document.getElementById("scene-closed");
  const readerScene = document.getElementById("scene-reader");
  const stage = document.querySelector(".closed-stage");
  const openBtn = document.getElementById("open-book-btn");
  const closeBtn = document.getElementById("close-book-btn");
  const rotateOverlay = document.getElementById("rotate-overlay");
  const rotateDismiss = document.getElementById("rotate-dismiss");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- sparkles ---------------- */
  const STAR =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12C8 11 11 8 12 0z"/></svg>';

  function sprinkleSparkles() {
    const host = document.getElementById("sparkles");
    if (!host) return;
    const spots = [
      [16, 22, 26, 0.2], [26, 58, 16, 1.4], [38, 14, 20, 2.6],
      [52, 8, 30, 0.8], [64, 18, 18, 2.0], [74, 34, 24, 1.1],
      [84, 52, 14, 2.9], [88, 24, 20, 0.5], [22, 78, 14, 1.8],
      [70, 74, 16, 2.4], [46, 84, 12, 1.2], [34, 34, 12, 3.4],
      [58, 62, 14, 0.6], [80, 64, 12, 2.2]
    ];
    const frag = document.createDocumentFragment();
    for (const [x, y, size, delay] of spots) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.left = x + "%";
      s.style.top = y + "%";
      s.style.width = s.style.height = size + "px";
      s.style.setProperty("--dur", (2.8 + (size % 5) * 0.5) + "s");
      s.style.setProperty("--delay", delay + "s");
      s.innerHTML = STAR;
      frag.append(s);
    }
    host.append(frag);
  }

  /* ---------------- scene flow ---------------- */
  let readerOpen = false;

  function openBook() {
    if (readerOpen) return;
    readerOpen = true;

    const showReader = () => {
      readerScene.hidden = false;
      requestAnimationFrame(() => readerScene.classList.add("is-visible"));
      closedScene.hidden = true;
      stage.classList.remove("is-opening");
      document.getElementById("book-stage").focus({ preventScroll: true });
      updatePortraitMode();
    };

    if (reduceMotion.matches) {
      showReader();
      return;
    }

    stage.classList.add("is-opening");          /* tilt flat + cover swings */
    setTimeout(() => {
      closedScene.classList.add("is-leaving");
      setTimeout(showReader, 480);
    }, 1180);
  }

  function closeBook() {
    if (!readerOpen) return;
    readerOpen = false;
    readerScene.classList.remove("is-visible");
    closedScene.hidden = false;
    requestAnimationFrame(() => closedScene.classList.remove("is-leaving"));
    setTimeout(() => { readerScene.hidden = true; }, 600);
    openBtn.focus({ preventScroll: true });
  }

  openBtn.addEventListener("click", openBook);
  closeBtn.addEventListener("click", closeBook);

  /* ---------------- keyboard ---------------- */
  document.addEventListener("keydown", (e) => {
    if (!readerOpen) {
      if ((e.key === "Enter" || e.key === " ") && document.activeElement === openBtn) {
        e.preventDefault();
        openBook();
      }
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); window.Book.step(1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); window.Book.step(-1); }
    else if (e.key === "Escape") { closeBook(); }
  });

  /* ---------------- portrait rotate guard + single-page mode ---------------- */
  const portraitQuery = window.matchMedia("(orientation: portrait) and (max-width: 767px)");

  function updatePortraitMode() {
    const dismissed = sessionStorage.getItem("rotate-dismissed") === "1";
    rotateOverlay.hidden = !(readerOpen && portraitQuery.matches && !dismissed);
    window.Book.setSingle(portraitQuery.matches && dismissed);
  }

  rotateDismiss.addEventListener("click", () => {
    sessionStorage.setItem("rotate-dismissed", "1");
    updatePortraitMode();
    document.getElementById("book-stage").focus({ preventScroll: true });
  });

  portraitQuery.addEventListener("change", updatePortraitMode);

  /* ---------------- boot ---------------- */
  sprinkleSparkles();
  window.Book.init();
  updatePortraitMode();
})();
