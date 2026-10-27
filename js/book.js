/* ============================================================
   book.js · Layer B — pagination + 3D leaf page-turn
   Spread map:  0 → [inside front cover | 1]   then
                s → [2s | 2s+1]  for s = 1…8  (last: 16 | 17)
   Inside covers are physical surfaces, never numbered pages.

   Turn mechanics (physically derived):
   forward  · leaf rests on the RIGHT half, hinges at the spine,
              front = current right page, back = next left page;
              under: left stays, right swaps to next right page.
   backward · leaf rests on the LEFT half, hinges at the spine,
              front = current left page, back = previous right page;
              under: left swaps to previous left page, right stays.
   ============================================================ */

window.Book = (() => {
  const TOTAL_SPREADS = 9;
  const TOTAL_PAGES = 17;
  const CONTENT = window.BOOK_CONTENT;

  let spread = 0;
  let single = false;          /* portrait single-page mode */
  let page = 1;                /* current page in single mode (1…17) */
  let turning = false;
  let cleanupScheduled = false;

  const els = {};

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function sidesOf(s) {
    return s === 0 ? ["inside-front", 1] : [s * 2, s * 2 + 1];
  }

  function spreadLabel(s) {
    const [l, r] = sidesOf(s);
    if (s === 0) return "intro · p. 1";
    return l + "–" + r;
  }

  function surface(id) {
    return window.Pages.renderSurface(id);
  }

  function setStatic(lId, rId) {
    els.underLeft.replaceChildren(surface(lId));
    els.underRight.replaceChildren(surface(rId));
  }

  function renderSpread() {
    const [l, r] = sidesOf(spread);
    setStatic(l, r);
    els.pageTab.textContent = spreadLabel(spread);
    document.getElementById("page-tab").setAttribute(
      "aria-label", "showing pages " + spreadLabel(spread));
    els.prevBtn.disabled = spread === 0;
    els.nextBtn.disabled = spread === TOTAL_SPREADS - 1;
  }

  function renderSingle() {
    els.underLeft.replaceChildren();
    els.underRight.replaceChildren(surface(page === 0 ? "inside-front" : page));
    els.pageTab.textContent = page === 0 ? "intro" : "p. " + page;
    document.getElementById("page-tab").setAttribute(
      "aria-label", page === 0 ? "showing the introduction page" : "showing page " + page);
    els.prevBtn.disabled = page <= 0;
    els.nextBtn.disabled = page >= TOTAL_PAGES;
  }

  /* ---------------- single-page (portrait) mode ---------------- */

  function setSingle(on) {
    on = !!on;
    if (on === single) return;
    if (turning) cancelTurn();
    single = on;
    document.body.classList.toggle("is-single", single);
    if (single) {
      const [, r] = sidesOf(spread);
      page = spread === 0
        ? 0
        : (typeof r === "number" && r >= 1 && r <= TOTAL_PAGES) ? r : 1;
      renderSingle();
    } else {
      spread = page <= 1 ? 0 : Math.floor(page / 2);
      renderSpread();
    }
  }

  function fadeToPage(target) {
    if (reduceMotion.matches) {
      page = target;
      renderSingle();
      return;
    }
    els.underRight.classList.add("is-fading");
    setTimeout(() => {
      page = target;
      renderSingle();
      els.underRight.classList.remove("is-fading");
    }, 160);
  }

  /* ---------------- turn state helpers ---------------- */

  function prepareTurn(dir) {
    const [curL, curR] = sidesOf(spread);
    const target = spread + dir;
    const [nextL, nextR] = sidesOf(target);

    els.turnLeaf.classList.remove("is-forward", "is-backward", "is-fading", "is-dragging");
    els.turnLeaf.style.transition = "";
    els.turnLeaf.style.transform = "";
    els.turnLeaf.classList.add(dir === 1 ? "is-forward" : "is-backward");

    if (dir === 1) {
      setStatic(curL, nextR);                    /* left stays, right reveals next */
      els.turnFront.replaceChildren(surface(curR));
      els.turnBack.replaceChildren(surface(nextL));
    } else {
      setStatic(nextL, curR);                    /* left reveals previous, right stays */
      els.turnFront.replaceChildren(surface(curL));
      els.turnBack.replaceChildren(surface(nextR));
    }

    els.turnLeaf.hidden = false;
    turning = true;
    return target;
  }

  function finishTurn(target) {
    els.turnLeaf.hidden = true;
    els.turnLeaf.classList.remove("is-forward", "is-backward", "is-fading", "is-dragging");
    els.turnLeaf.style.transition = "";
    els.turnLeaf.style.transform = "";
    spread = target;
    turning = false;
    cleanupScheduled = false;
    renderSpread();
  }

  function cancelTurn() {
    els.turnLeaf.hidden = true;
    els.turnLeaf.classList.remove("is-forward", "is-backward", "is-fading", "is-dragging");
    els.turnLeaf.style.transition = "";
    els.turnLeaf.style.transform = "";
    turning = false;
    cleanupScheduled = false;
    renderSpread();
  }

  /* ---------------- animated turn ---------------- */

  function startTurn(dir) {
    if (turning) return false;
    const target = spread + dir;
    if (target < 0 || target >= TOTAL_SPREADS) return false;

    if (reduceMotion.matches) {          /* instant, no animation */
      spread = target;
      renderSpread();
      return true;
    }

    prepareTurn(dir);
    cleanupScheduled = true;
    els.turnLeaf.addEventListener("animationend", function onEnd(e) {
      if (e.target !== els.turnLeaf) return;
      if (!cleanupScheduled) return;
      els.turnLeaf.removeEventListener("animationend", onEnd);
      finishTurn(target);
    });
    return true;
  }

  /* ---------------- drag gesture ---------------- */

  const drag = { active: false, moved: false, dir: 1, startX: 0, startY: 0, target: 0, halfW: 1 };

  function onPointerDown(e, dir) {
    if (single || turning || reduceMotion.matches) return;
    const target = spread + dir;
    if (target < 0 || target >= TOTAL_SPREADS) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    drag.active = true;
    drag.moved = false;
    drag.dir = dir;
    drag.startX = e.clientX;
    drag.startY = e.clientY;
    drag.target = target;
    drag.halfW = els.paper.clientWidth / 2;

    drag.pointerId = e.pointerId;
    els.dogear(dir).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 8) return;

    if (!drag.moved) {
      drag.moved = true;
      prepareTurn(drag.dir);            /* same DOM prep as a click turn */
      cleanupScheduled = false;
      els.turnLeaf.classList.add("is-dragging");   /* keeps is-forward/is-backward anchoring; kills the CSS animation */
      document.body.style.userSelect = "none";
    }

    /* dragging right pulls the right page over (forward), etc. */
    const raw = drag.dir === 1 ? -dx : dx;
    const progress = Math.min(1, Math.max(0, raw / drag.halfW));
    els.turnLeaf.style.transition = "";
    els.turnLeaf.style.transform =
      "rotateY(" + (drag.dir === 1 ? -180 * progress : 180 * progress) + "deg)";
    e.preventDefault();
  }

  function onPointerUp(e) {
    if (!drag.active) return;
    drag.active = false;
    document.body.style.userSelect = "";

    if (!drag.moved) {                                     /* plain click */
      cancelTurn();                                        /* undo prep-less state */
      startTurn(drag.dir);
      return;
    }

    const dx = e.clientX - drag.startX;
    const raw = drag.dir === 1 ? -dx : dx;
    const progress = Math.min(1, Math.max(0, raw / drag.halfW));

    if (progress >= 0.3) {                                 /* complete the turn */
      const remaining = Math.max(180, (1 - progress) * 620);
      els.turnLeaf.style.transition =
        "transform " + remaining + "ms cubic-bezier(.33,.12,.2,1)";
      els.turnLeaf.style.transform =
        "rotateY(" + (drag.dir === 1 ? -180 : 180) + "deg)";
      const target = drag.target;
      const onEnd = (ev) => {
        if (ev.propertyName !== "transform") return;
        els.turnLeaf.removeEventListener("transitionend", onEnd);
        finishTurn(target);
      };
      els.turnLeaf.addEventListener("transitionend", onEnd);
    } else {                                               /* spring back */
      els.turnLeaf.style.transition = "transform 260ms cubic-bezier(.33,.12,.2,1)";
      els.turnLeaf.style.transform = "rotateY(0deg)";
      const onBack = (ev) => {
        if (ev.propertyName !== "transform") return;
        els.turnLeaf.removeEventListener("transitionend", onBack);
        cancelTurn();
      };
      els.turnLeaf.addEventListener("transitionend", onBack);
    }
    e.preventDefault();
  }

  /* ---------------- public navigation ---------------- */

  function step(dir) {
    if (single) {
      if (turning) return false;
      const target = page + dir;
      if (target < 0 || target > TOTAL_PAGES) return false;
      fadeToPage(target);
      return true;
    }
    return startTurn(dir);
  }

  function goTo(target) {
    if (turning) return false;
    if (target < 0 || target >= TOTAL_SPREADS) return false;
    if (single) {
      const [, r] = sidesOf(target);
      const next = (typeof r === "number") ? r : 1;
      if (next === page) return true;
      page = next;
      renderSingle();
      return true;
    }
    if (target === spread) return true;      /* already here — don't rebuild */
    spread = target;
    renderSpread();
    return true;
  }

  /* page-number navigation: 0 = the unnumbered introduction page,
     1 = the birthday calendar … 17 = the end. Works in the two-page
     reader and in single-page (portrait) mode alike. */
  function goToPage(n) {
    n = Math.max(0, Math.min(TOTAL_PAGES, Math.round(Number(n) || 0)));
    if (turning) return false;
    if (single) {
      if (page === n) return true;
      page = n;
      renderSingle();
      return true;
    }
    return goTo(n <= 1 ? 0 : Math.floor(n / 2));
  }

  /* ---------------- lifecycle ---------------- */

  function init() {
    els.underLeft = document.getElementById("under-left");
    els.underRight = document.getElementById("under-right");
    els.paper = document.querySelector(".book__paper");
    els.turnLeaf = document.getElementById("turn-leaf");
    els.turnFront = document.getElementById("turn-front");
    els.turnBack = document.getElementById("turn-back");
    els.pageTab = document.getElementById("page-tab-label");
    els.prevBtn = document.getElementById("prev-btn");
    els.nextBtn = document.getElementById("next-btn");

    els.dogear = (dir) => (dir === 1 ? els.nextBtn : els.prevBtn);

    for (const dir of [1, -1]) {
      const btn = els.dogear(dir);
      btn.addEventListener("click", (e) => {
        if (drag.moved) { e.preventDefault(); return; }    /* gesture handled elsewhere */
        step(dir);
      });
      btn.addEventListener("pointerdown", (e) => onPointerDown(e, dir));
    }
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", () => {
      if (drag.active) { drag.active = false; document.body.style.userSelect = ""; if (drag.moved) cancelTurn(); }
    });

    /* the fortune teller on the intro page asks for the calendar;
       in two-page mode it is already facing us, so say "here" */
    window.addEventListener("scrapbook:calendar", () => {
      const leaf = document.querySelector(".leaf--right");
      if (!leaf) return;
      leaf.classList.remove("is-flash");
      void leaf.offsetWidth;
      leaf.classList.add("is-flash");
      setTimeout(() => leaf.classList.remove("is-flash"), 1600);
    });

    renderSpread();
  }

  return {
    init,
    step,
    goTo,
    goToPage,
    setSingle,
    get spread() { return spread; },
    get page() { return page; },
    get single() { return single; },
    get totalSpreads() { return TOTAL_SPREADS; },
    get totalPages() { return TOTAL_PAGES; },
    get isTurning() { return turning; },
    sidesOf,
    content: CONTENT
  };
})();
