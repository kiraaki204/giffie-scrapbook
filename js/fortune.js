/* ============================================================
   fortune.js · "a little fortune for you…"

   The folded-paper fortune teller that sits on the introduction
   page (inside front cover), right before the birthday calendar.

   The toy is four triangular paper flaps on a square of paper.
   Each flap is hinged along its outer edge, so every stage is the
   same physical object being folded open again — nothing is a
   button grid, nothing is a screenshot.

   Copy lives in BOOK_CONTENT.fortune (js/content.js).
   ============================================================ */

window.Fortune = (function () {
  "use strict";

  const motionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  /* which way each flap folds: n/s hinge on the horizontal axis,
     w/e on the vertical one. The sign brings the free corner
     (the middle of the toy) towards the reader. */
  const HINGE = {
    n: { axis: "X", sign: 1 },
    s: { axis: "X", sign: -1 },
    w: { axis: "Y", sign: -1 },
    e: { axis: "Y", sign: 1 }
  };
  const ORDER = ["n", "s", "w", "e"];
  /* reading order around the folded toy, so the numbers run
     1 top · 2 right · 3 bottom · 4 left like a real one */
  const CLOCKWISE = ["n", "e", "s", "w"];

  /* tiny hand-drawn marks, inlined so the page needs no extra files */
  const DOODLES = {
    heart:
      '<path d="M12 20.5 C6 14.6 2 10.8 2 6.9 C2 3.6 4.7 1.6 7.5 2.2 C9.5 2.6 11.1 4.3 12 6.1 C12.9 4.3 14.5 2.6 16.5 2.2 C19.3 1.6 22 3.6 22 6.9 C22 10.8 18 14.6 12 20.5Z"/>',
    star:
      '<path d="M12 1.6 l3.1 6.7 7.3 1 -5.3 5.1 1.3 7.3 -6.4-3.4 -6.4 3.4 1.3-7.3 -5.3-5.1 7.3-1z"/>',
    flower:
      '<g><circle cx="12" cy="12" r="2.6"/><ellipse cx="12" cy="4.8" rx="3" ry="4"/><ellipse cx="12" cy="19.2" rx="3" ry="4"/><ellipse cx="4.8" cy="12" rx="4" ry="3"/><ellipse cx="19.2" cy="12" rx="4" ry="3"/></g>',
    moon:
      '<path d="M15.8 2.6 a9.6 9.6 0 1 0 5.8 17.1 A10.6 10.6 0 0 1 15.8 2.6Z"/>',
    bow:
      '<g><path d="M9.8 12 C5.8 6.4 1.2 7.4 2.2 11.2 C2.9 13.9 6.5 14 9.8 12Z"/><path d="M14.2 12 C18.2 6.4 22.8 7.4 21.8 11.2 C21.1 13.9 17.5 14 14.2 12Z"/><ellipse cx="12" cy="12" rx="1.9" ry="1.7"/><path d="M10.6 13.4 C9.6 16.6 8 18.6 6.2 20.2 C8.6 19.9 10.9 17.7 12 15.2Z"/><path d="M13.4 13.4 C14.4 16.6 16 18.6 17.8 20.2 C15.4 19.9 13.1 17.7 12 15.2Z"/></g>'
  };

  /* ---------------- tiny DOM kit ---------------- */

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function icon(name, cls) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", cls);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = DOODLES[name] || DOODLES.heart;
    return svg;
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function rot(pos, deg) {
    const hinge = HINGE[pos];
    return "rotate" + hinge.axis + "(" + (hinge.sign * deg) + "deg)";
  }

  /* Web Animations where available; a short pause everywhere else.
     (CSS *animations* are neutralised by the reduced-motion rule,
     but WAAPI is not, so the preference is honoured here by hand.) */
  function animate(node, frames, opts, fallbackMs) {
    const fallback = fallbackMs == null ? 60 : fallbackMs;
    if (motionQuery.matches || typeof node.animate !== "function") {
      node.style.transform = frames[frames.length - 1].transform;
      return wait(fallback);
    }
    try {
      const anim = node.animate(frames, opts);
      if (anim && anim.finished) return anim.finished.catch(function () {});
      return wait(opts.duration || 300);
    } catch (err) {
      node.style.transform = frames[frames.length - 1].transform;
      return wait(fallback);
    }
  }

  /* ---------------- the toy ---------------- */

  function build(cfg) {
    const page = el("div", "ft-page");
    page.dataset.stage = "colour";

    const state = {
      stage: "colour",
      colourIndex: null,
      colour: null,
      number: null,
      primed: null,
      locked: false,
      fortune: null,
      readyAt: 0
    };

    /* ---------- heading ---------- */

    const head = el("div", "ft-head");
    const ruleL = el("span", "ft-head__rule");
    const ruleR = el("span", "ft-head__rule");
    const heading = el("h2", "ft-head__title");
    heading.append(document.createTextNode(cfg.heading));
    head.append(ruleL, heading, ruleR);
    page.append(head);

    /* ---------- the folded toy ---------- */

    const toyWrap = el("div", "ft-toywrap");
    const toy = el("div", "ft__toy");
    toy.setAttribute("role", "group");
    toy.setAttribute("aria-label", "folded paper fortune teller");

    const shadow = el("span", "ft__shadow");
    shadow.setAttribute("aria-hidden", "true");

    const base = el("div", "ft__base");
    base.setAttribute("aria-hidden", "true");
    const baseTag = el("span", "ft__base-tag");
    const baseMark = el("span", "ft__base-mark", "♡");
    const baseOpen = el("div", "ft__open");
    baseOpen.append(el("span", "ft__open-heart", "♡"));
    baseOpen.append(el("span", "ft__open-text", "for you"));
    base.append(el("span", "ft__base-crease"), baseMark, baseTag, baseOpen);

    const badge = el("span", "ft__primed-tag", "for you ♡");
    badge.hidden = true;

    toy.append(shadow, base);

    /* number painted on flap i (flap order is n, s, w, e) */
    function numberOn(i) {
      return cfg.numbers[CLOCKWISE.indexOf(ORDER[i])];
    }

    const flaps = [];
    ORDER.forEach((pos, i) => {
      const flap = el("button", "ft__panel ft__panel--" + pos);
      flap.type = "button";
      flap.dataset.pos = pos;
      flap.dataset.index = String(i);
      flap.dataset.doodle = ["heart", "star", "flower", "moon"][CLOCKWISE.indexOf(pos)];
      const face = el("span", "ft__face");
      const ink = el("span", "ft__ink");
      face.append(ink);
      flap.append(face);
      flap.addEventListener("click", () => choose(i));
      toy.append(flap);
      flaps.push(flap);
    });

    toy.append(badge);
    toyWrap.append(toy);
    page.append(toyWrap);

    /* ---------- instruction (updates every stage) ---------- */

    const hint = el("p", "ft-hint");
    hint.setAttribute("aria-live", "polite");
    page.append(hint);

    /* ---------- pre-reveal scrapbook filler ---------- */

    const pre = el("div", "ft-pre");
    const preNote = el("div", "ft-mini");
    preNote.append(el("span", "ft-mini__tape"));
    preNote.append(el("span", "ft-mini__text", cfg.note));
    const preArrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    preArrow.setAttribute("class", "ft-arrow");
    preArrow.setAttribute("viewBox", "0 0 120 96");
    preArrow.setAttribute("aria-hidden", "true");
    preArrow.innerHTML =
      '<path d="M8 88 C26 58 52 40 92 26" fill="none" stroke="#8e5761" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-dasharray="1 7"/>' +
      '<path d="M78 20 C86 22 93 24 98 26 C92 30 87 34 83 39" fill="none" stroke="#8e5761" ' +
      'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
    pre.append(preNote, preArrow);
    page.append(pre);

    /* ---------- the fortune note ---------- */

    const note = el("div", "ft-note");
    note.tabIndex = -1;
    note.setAttribute("role", "status");
    note.append(el("span", "ft-note__tape"));
    note.append(el("span", "ft-note__label", cfg.resultLabel || "your fortune"));
    const noteText = el("p", "ft-note__text");
    note.append(noteText);

    const actions = el("div", "ft-note__actions");
    const again = el("button", "ft-btn ft-btn--again", cfg.controls.again);
    again.type = "button";
    again.addEventListener("click", reset);
    const next = el("button", "ft-btn ft-btn--next", cfg.controls.next);
    next.type = "button";
    next.addEventListener("click", goToCalendar);
    actions.append(again, next);
    note.append(actions);
    page.append(note);

    /* ---------- painting ---------- */

    function setInk(target, nodes) {
      target.replaceChildren.apply(target, nodes);
    }

    function paintFlap(flap, i) {
      const ink = flap.querySelector(".ft__ink");
      flap.classList.remove("is-primed", "is-open", "is-dimmed");
      flap.style.removeProperty("--tone");
      flap.style.removeProperty("--on-tone");
      flap.style.removeProperty("--edge");

      if (state.stage === "colour") {
        const colour = cfg.colours[i];
        flap.style.setProperty("--tone", colour.tone);
        flap.style.setProperty("--on-tone", colour.ink);
        flap.style.setProperty("--edge", "rgba(75, 52, 42, .16)");
        const tag = el("span", "ft__tag", colour.name);
        setInk(ink, [tag, icon(colour.doodle || "heart", "ft__doodle")]);
        flap.setAttribute("aria-label", "colour " + colour.name + " — choose this colour");
      } else if (state.stage === "number") {
        flap.style.setProperty("--tone", "#f9efdc");
        flap.style.setProperty("--on-tone", state.colour.ink);
        flap.style.setProperty("--edge", state.colour.tone);
        setInk(ink, [el("span", "ft__num", String(numberOn(i)))]);
        flap.setAttribute("aria-label", "number " + numberOn(i) + " — choose this number");
      } else {
        flap.style.setProperty("--tone", "#fbf3e3");
        flap.style.setProperty("--on-tone", state.colour.ink);
        flap.style.setProperty("--edge", state.colour.tone);
        setInk(ink, [
          icon(flap.dataset.doodle || "heart", "ft__doodle ft__doodle--lg"),
          el("span", "ft__micro", "open")
        ]);
        flap.setAttribute("aria-label", "fortune flap " + (i + 1) + " — open this flap");
      }
    }

    function paint() {
      page.dataset.stage = state.stage;
      cfg.steps && (hint.textContent = cfg.steps[state.stage] || "");

      flaps.forEach(paintFlap);

      if (state.stage === "fortune" && state.primed != null) {
        flaps[state.primed].classList.add("is-primed");
        badge.hidden = false;
        badge.dataset.pos = ORDER[state.primed];
      } else {
        badge.hidden = true;
      }

      if (state.stage === "colour") {
        baseTag.textContent = "pick a colour ♡";
        baseMark.textContent = "♡";
      } else if (state.stage === "number") {
        baseTag.textContent = state.colour.name + " · pick a number";
        baseMark.textContent = "✿";
      } else if (state.stage === "fortune") {
        baseTag.textContent = state.colour.name + " · " + state.number;
        baseMark.textContent = "★";
      } else {
        baseTag.textContent = state.colour.name + " · " + state.number;
      }
    }

    /* the four flaps open together; content swaps while they are
       edge-on so the paper appears to be turned over */
    function flapBeat(lift, duration, swap) {
      if (motionQuery.matches) duration = 160;      /* short, calm beat */
      toy.classList.add("is-lifting");
      const jobs = flaps.map(function (flap, i) {
        const frames = [
          { transform: rot(ORDER[i], 0) },
          { transform: rot(ORDER[i], lift), offset: 0.38 },
          { transform: rot(ORDER[i], lift), offset: 0.54 },
          { transform: rot(ORDER[i], 0) }
        ];
        return animate(
          flap,
          frames,
          {
            duration: duration + (i % 2 ? 16 : 0),
            easing: "cubic-bezier(.42,.06,.28,1)",
            fill: "none"
          },
          motionQuery.matches ? 20 : duration
        );
      });

      if (typeof swap === "function") {
        if (motionQuery.matches) swap();
        else setTimeout(swap, Math.round(duration * 0.45));
      }

      /* the lock must never outlive the movement: a plain timer is the
         source of truth, the animations are best-effort, so a stalled
         frame can never leave the toy unresponsive */
      void jobs;
      return wait(duration + 30).then(function () {
        toy.classList.remove("is-lifting");
      });
    }

    function lock() {
      state.locked = true;
      toy.classList.add("is-locked");
    }

    function unlock() {
      state.locked = false;
      /* a stray tap that lands the instant the flaps settle shouldn't
         count as a choice in the brand-new stage */
      state.readyAt = Date.now() + 140;
      toy.classList.remove("is-locked");
    }

    /* ---------- the three stages ---------- */

    function choose(index) {
      if (state.locked || state.stage === "done" || state.stage === "revealed") return;
      if (Date.now() < state.readyAt) return;

      if (state.stage === "colour") {
        lock();
        const colour = cfg.colours[index];
        state.colour = colour;
        state.colourIndex = index;
        hint.textContent = cfg.steps.colourPicked.replace("{colour}", colour.name);
        flaps[index].classList.add("is-chosen");
        flapBeat(78, 720, function () {
          flaps[index].classList.remove("is-chosen");
          state.stage = "number";
          paint();
        }).then(unlock);
        return;
      }

      if (state.stage === "number") {
        lock();
        state.number = numberOn(index);
        /* the colour + the number decide which flap the paper nudges.
           Every flap stays open to taps, so nothing is faked. */
        state.primed = (state.colourIndex + state.number) % 4;
        hint.textContent = cfg.steps.numberPicked.replace("{number}", state.number);
        flapBeat(84, 660, function () {
          state.stage = "fortune";
          paint();
        }).then(unlock);
        return;
      }

      if (state.stage === "fortune") {
        reveal(index);
      }
    }

    function reveal(index) {
      lock();
      /* the flap's position is its number, so the fortune that opens is
         always the one printed for that flap — never a coincidence */
      const ord = CLOCKWISE.indexOf(ORDER[index]);
      state.fortune = cfg.fortunes[ord];
      page.dataset.stage = "revealed";
      toy.classList.add("is-revealed");

      flaps.forEach(function (flap, i) {
        const open = i === index;
        /* the chosen flap folds right over the toy's edge, showing its
           blank underside — the way paper actually opens */
        const frames = open
          ? [
              { transform: rot(ORDER[i], 0), offset: 0 },
              { transform: rot(ORDER[i], 64), offset: 0.34 },
              { transform: rot(ORDER[i], 131), offset: 0.74 },
              { transform: rot(ORDER[i], 122) }
            ]
          : [
              { transform: rot(ORDER[i], 0) },
              { transform: rot(ORDER[i], 7), offset: 0.32 },
              { transform: rot(ORDER[i], 0) }
            ];
        const anim = animate(
          flap,
          frames,
          {
            duration: open ? 760 : 460,
            delay: open ? 0 : 70,
            easing: open ? "cubic-bezier(.34,.66,.3,1)" : "ease-out",
            fill: open ? "forwards" : "none"
          },
          40
        );
        if (open && !motionQuery.matches) {
          /* past 90° we see the back of the paper: let the printed
             side fade as it turns, like light leaving the ink */
          flap.classList.add("is-turning");
          setTimeout(function () { flap.classList.add("is-under"); }, 300);
        }
        if (open && motionQuery.matches) flap.classList.add("is-under");
        flap.setAttribute("aria-disabled", "true");
        if (!open) flap.classList.add("is-dimmed");
        else flap.classList.add("is-open");
        return anim;
      });

      setTimeout(function () {
        noteText.textContent = state.fortune;
        page.classList.add("is-revealed");
        hint.textContent = cfg.steps.revealed;
        state.stage = "done";
        unlock();
        try {
          note.focus({ preventScroll: true });
        } catch (err) {
          note.focus();
        }
      }, motionQuery.matches ? 30 : 330);
    }

    /* ---------- replay + leaving the page ---------- */

    function reset() {
      flaps.forEach(function (flap) {
        if (typeof flap.getAnimations === "function") {
          flap.getAnimations().forEach(function (anim) {
            try { anim.cancel(); } catch (err) {}
          });
        }
        flap.style.transform = "";
        flap.classList.remove("is-open", "is-dimmed", "is-primed", "is-chosen",
                              "is-turning", "is-under");
        flap.removeAttribute("aria-disabled");
      });

      state.stage = "colour";
      state.colour = null;
      state.colourIndex = null;
      state.number = null;
      state.primed = null;
      state.fortune = null;

      page.classList.remove("is-revealed");
      toy.classList.remove("is-revealed", "is-lifting");
      badge.hidden = true;
      noteText.textContent = "";
      unlock();
      state.readyAt = 0;          /* a replay is ready immediately */
      paint();

      try { flaps[0].focus({ preventScroll: true }); } catch (err) {}
    }

    function goToCalendar() {
      /* reuse the reader's own pagination: page 1 is the calendar.
         In two-page mode that is the spread we are already on, so the
         reader also flashes the page to say "here it is". */
      if (window.Book && typeof window.Book.goToPage === "function") {
        window.Book.goToPage(1);
      } else if (window.Book && typeof window.Book.goTo === "function") {
        window.Book.goTo(0);
      }
      window.dispatchEvent(new Event("scrapbook:calendar"));
    }

    paint();
    return page;
  }

  return { build: build };
})();
