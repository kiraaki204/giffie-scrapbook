/* ============================================================
   pages.js · Layer C — the 27 scrapbook page compositions
   Each key in RENDERERS is its own handmade layout.
   All personal strings come from BOOK_CONTENT.
   ============================================================ */

window.Pages = (() => {
  const CONTENT = window.BOOK_CONTENT;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- tiny DOM kit ---------------- */

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function svg(cls, viewBox, inner, attrs) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    node.setAttribute("class", cls);
    node.setAttribute("viewBox", viewBox);
    node.setAttribute("aria-hidden", "true");
    if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
    node.innerHTML = inner;
    return node;
  }

  function sheet(...cls) {
    return el("div", "scrap " + cls.join(" "));
  }

  function title(text, cls) {
    return el("h2", "ttl " + (cls || ""), text);
  }

  function washi(cls) {
    return el("span", "washi " + (cls || "washi--blush"));
  }

  /* a photo offers a list of candidates in order: the browser shows the
     first one it can actually decode and quietly skips the rest — that is
     how the .xcf names can stay first in the list without breaking the
     page (browsers cannot paint GIMP files, so the jpg behind it shows) */
  function photo(label, cls, tilt, source) {
    const fig = el("figure", "photo " + (cls || ""));
    if (tilt) fig.style.setProperty("--tilt", tilt + "deg");
    fig.append(washi("washi--photo"));
    const mat = el("div", "photo__mat");
    const sources = (Array.isArray(source) ? source : [source]).filter(Boolean);
    if (sources.length) {
      const image = el("img", "photo__image");
      image.alt = label;
      image.loading = "lazy";
      softImage(image, sources);
      mat.append(image);
    } else {
      mat.append(el("span", "photo__ph", label));
    }
    fig.append(mat);
    return fig;
  }

  function writeLine(text, cls) {
    const w = el("div", "wline " + (cls || ""));
    if (text) w.append(el("span", "wline__t", text));
    return w;
  }

  function stamp(text, cls) {
    return el("span", "stamp " + (cls || ""), text);
  }

  const PAPERCLIP_SVG =
    '<path d="M14 6 C9 3 4 6 4 12 L4 34 C4 42 11 47 18 47 C26 47 31 41 31 33 L31 12 C31 7 27 4 22 4 C17 4 13 8 13 13 L13 34 C13 37 15 39 18 39 C21 39 23 37 23 34 L23 14" ' +
    'fill="none" stroke="#8f8f96" stroke-width="3.4" stroke-linecap="round"/>';

  function clip() {
    return svg("clipart", "0 0 36 52", PAPERCLIP_SVG);
  }

  function pin(color) {
    return svg("pinart", "0 0 24 30",
      '<circle cx="12" cy="10" r="8" fill="' + color + '" stroke="rgba(58,43,38,.45)" stroke-width="1.4"/>' +
      '<circle cx="9" cy="7" r="2.6" fill="rgba(255,255,255,.55)"/>' +
      '<path d="M12 17 L12 28" stroke="#7a6a5c" stroke-width="2" stroke-linecap="round"/>');
  }

  const A = "assets/";
  const STICKERS = CONTENT.stickers || {};
  const NAMED_STICKERS = STICKERS.named || {};
  const STICKER_LIBRARY = STICKERS.library || [];

  /* a sticker key resolves to [new transparent png, older jpg] */
  function stickerSources(key) {
    if (Array.isArray(key)) return key.filter(Boolean);
    const entry = NAMED_STICKERS[key];
    if (entry) return [entry.png, entry.fallback].filter(Boolean);
    return [key];
  }

  /* set an image source with graceful fallbacks: if the new PNG has
     not been dropped into assets/ yet, the older file is used, and if
     that is missing too the image simply hides instead of breaking. */
  function softImage(node, sources) {
    let at = 0;
    const next = () => {
      if (at >= sources.length) {
        node.classList.add("is-missing");
        node.removeAttribute("src");
        return;
      }
      node.src = A + sources[at++];
    };
    node.addEventListener("error", next);
    node.addEventListener("load", () => {
      const file = (node.getAttribute("src") || "").toLowerCase();
      if (file.slice(-4) === ".png") node.classList.add("is-png");
    });
    next();
    return node;
  }

  /* real-photo sticker from the sticker folder */
  function sticker(key, cls) {
    const im = el("img", "pstk " + (cls || ""));
    im.alt = "";
    im.draggable = false;
    im.loading = "lazy";
    softImage(im, stickerSources(key));
    return wiggleOnTap(im);
  }

  function heartSvg(cls, fill, stroke) {
    return svg(cls, "0 0 40 36",
      '<path d="M20 33 C10 25 3 19 3 11 C3 5 8 2 13 3 C17 4 19 7 20 10 C21 7 23 4 27 3 C32 2 37 5 37 11 C37 19 30 25 20 33Z" ' +
      'fill="' + (fill || "#e8a7ab") + '" stroke="' + (stroke || "#b23a48") + '" stroke-width="2.4"/>');
  }

  function heartBullet() {
    return svg("hb", "0 0 20 18",
      '<path d="M10 16 C5 11.5 1.5 8.5 1.5 5.5 C1.5 2.8 4 1.2 6.5 1.7 C8.2 2 9.4 3.4 10 5 C10.6 3.4 11.8 2 13.5 1.7 C16 1.2 18.5 2.8 18.5 5.5 C18.5 8.5 15 11.5 10 16Z" fill="#cf959b"/>');
  }

  /* tap-to-wiggle for decorative stickers */
  function wiggleOnTap(node) {
    node.classList.add("is-tappable");
    node.addEventListener("click", () => {
      node.classList.remove("wiggle");
      void node.getBoundingClientRect();
      node.classList.add("wiggle");
      setTimeout(() => node.classList.remove("wiggle"), 500);
    });
    return node;
  }

  /* ================================================================
     STICKER SCATTER · pasted, not aligned.
     A real sticker page has three scales: little ones tucked into a
     corner, normal ones on the edge of the paper, and one or two a
     bit bigger than normal that bleed off the page. Slots are kept
     away from the top-left title, and each page starts at a different
     slot so no two spreads repeat the same arrangement.
     ================================================================ */
  const SCATTER_SLOTS = [
    { x: 67,   y: 1,    s: "sm", r: -13 },
    { x: 84,   y: 4,    s: "lg", r: 10 },
    { x: 91,   y: 21,   s: "xs", r: -8 },
    { x: 1.5,  y: 14,   s: "xs", r: 12 },
    { x: 1,    y: 33,   s: "md", r: -9 },
    { x: 90,   y: 41,   s: "md", r: 9 },
    { x: 1,    y: 54,   s: "sm", r: 13 },
    { x: 88,   y: 59,   s: "sm", r: -11 },
    { x: 2,    y: 71,   s: "lg", r: 7 },
    { x: 29,   y: 89,   s: "xs", r: -9 },
    { x: 61,   y: 86,   s: "sm", r: 11 },
    { x: 78,   y: 77,   s: "lg", r: -6 }
  ];

  function noise(seed) {
    const raw = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return raw - Math.floor(raw);
  }

  /* one pasted sticker inside a .sticker-scatter layer */
  function pastedSticker(layer, key, o) {
    const im = sticker(key, "scatter-stk tier-" + (o.s || "md") + (o.cls ? " " + o.cls : ""));
    im.style.setProperty("--x", o.x + "%");
    im.style.setProperty("--y", o.y + "%");
    im.style.setProperty("--r", (o.r || 0) + "deg");
    if (o.w) im.style.setProperty("--w", o.w + "em");
    if (o.z != null) im.style.zIndex = String(o.z);
    layer.append(im);
    return im;
  }

  function scatterLayer(host, cls) {
    const layer = el("div", "sticker-scatter" + (cls ? " " + cls : ""));
    layer.setAttribute("aria-hidden", "true");
    host.append(layer);
    return layer;
  }

  function scatterStickers(host, seed, count, slots, used) {
    if (!STICKER_LIBRARY.length) return null;
    const layer = scatterLayer(host);
    const pool = slots || SCATTER_SLOTS;
    const total = Math.min(count == null ? 6 : count, pool.length);
    const start = slots ? 0 : Math.floor(noise(seed * 1.7) * pool.length);
    const step = slots ? 1 : 5;
    const seen = used || new Set();
    let pick = 0;
    for (let i = 0; i < total; i++) {
      const slot = pool[(start + i * step) % pool.length];
      /* walk the library until we find a drawing this page hasn't used
         yet, so the same little sticker never shows up twice */
      let entry = null;
      for (let tries = 0; tries < STICKER_LIBRARY.length; tries++) {
        const candidate = STICKER_LIBRARY[(Math.floor(seed * 5) + (i + pick + tries) * 7) % STICKER_LIBRARY.length];
        if (!seen.has(candidate.png)) { entry = candidate; pick += tries; break; }
      }
      if (!entry) entry = STICKER_LIBRARY[(Math.floor(seed * 5) + i * 7) % STICKER_LIBRARY.length];
      seen.add(entry.png);
      pastedSticker(layer, [entry.png, entry.jpg].filter(Boolean), {
        x: slot.x + (noise(seed + i * 3.1) * 3 - 1.5),
        y: slot.y + (noise(seed + i * 7.7) * 3 - 1.5),
        s: slot.s,
        r: slot.r + (noise(seed + i * 2.3) * 8 - 4),
        z: 3 + (i % 2)
      });
    }
    return layer;
  }

  /* some pages have a lot of writing — fewer stickers there */
  const SCATTER_COUNTS = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 2, 9: 5,
    10: 0, 11: 5, 12: 2, 13: 0, 14: 0, 15: 0, 16: 0,
    17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0,
    25: 0, 26: 0, 27: 6
  };

  /* pages whose artwork fills almost every corner get their own little
     set of hand-picked slots, so nothing lands on top of a caption */
  const EDGE_SLOTS = [
    { x: .5, y: 3,  s: "xs", r: -10 },
    { x: 93, y: 7,  s: "xs", r: 11 },
    { x: .5, y: 44, s: "xs", r: 7 },
    { x: 94, y: 62, s: "xs", r: -8 }
  ];
  const SCATTER_OVERRIDES = {
    6: EDGE_SLOTS,
    8: [
      { x: 86, y: 89, s: "sm", r: -8 },
      { x: 12, y: 89, s: "xs", r: 9 }
    ],
    7: [
      { x: 0,  y: 2,  s: "sm", r: -11 },
      { x: 92, y: 1,  s: "xs", r: 12 },
      { x: 0,  y: 76, s: "sm", r: 8 },
      { x: 92, y: 84, s: "sm", r: -7 }
    ],
    9: [
      { x: 0,  y: 2,  s: "xs", r: -8 },
      { x: 92, y: 1,  s: "sm", r: 10 },
      { x: 0,  y: 47, s: "xs", r: 6 },
      { x: 94, y: 55, s: "xs", r: -9 }
    ],
    12: [
      { x: 1.5, y: 78, s: "xs", r: -8 },
      { x: 91,  y: 84, s: "sm", r: 10 }
    ],
    13: EDGE_SLOTS,
    27: [
      { x: .5, y: 3,  s: "xs", r: -10 },
      { x: 93, y: 6,  s: "sm", r: 11 },
      { x: .5, y: 42, s: "xs", r: 7 },
      { x: 94, y: 55, s: "xs", r: -8 },
      { x: 1,  y: 82, s: "sm", r: 9 }
    ]
  };

  /* ---------------- shared sticker doodles ---------------- */

  const STK = {
    bow: () => svg("stk stk--bow", "0 0 64 44",
      '<g fill="#e8a7ab" stroke="#b23a48" stroke-width="2">' +
      '<path d="M30 22 C18 6 4 8 6 18 C7 25 20 26 30 22Z"/>' +
      '<path d="M34 22 C46 6 60 8 58 18 C57 25 44 26 34 22Z"/>' +
      '<path d="M28 24 C24 32 18 38 12 42 C20 41 27 36 31 30Z"/>' +
      '<path d="M36 24 C40 32 46 38 52 42 C44 41 37 36 33 30Z"/>' +
      '<ellipse cx="32" cy="22" rx="5.5" ry="4.5"/></g>'),
    cake: () => svg("stk stk--cake", "0 0 70 70",
      '<g stroke="#b23a48" stroke-width="2.2" stroke-linejoin="round">' +
      '<rect x="12" y="40" width="46" height="20" rx="4" fill="#f2d0d2"/>' +
      '<rect x="16" y="28" width="38" height="14" rx="3" fill="#f7e3d2"/>' +
      '<path d="M12 46 q6 5 12 0 q6 5 12 0 q6 5 12 0 q5 4 10 0" fill="none"/>' +
      '<path d="M35 28 L35 18" fill="none"/>' +
      '<ellipse cx="35" cy="14" rx="4" ry="6" fill="#e8a7ab"/>' +
      '<circle cx="35" cy="10" r="2.5" fill="#b23a48" stroke="none"/></g>'),
    tulips: () => svg("stk stk--tulips", "0 0 60 70",
      '<g stroke="#7d8a6a" stroke-width="2.2" fill="none" stroke-linecap="round">' +
      '<path d="M22 66 C22 50 18 42 14 36"/><path d="M30 66 C30 48 30 40 30 32"/>' +
      '<path d="M38 66 C38 50 42 42 46 36"/>' +
      '<path d="M22 52 C14 50 10 46 8 42" /><path d="M38 52 C46 50 50 46 52 42"/></g>' +
      '<g fill="#e8a7ab" stroke="#b23a48" stroke-width="1.8">' +
      '<ellipse cx="14" cy="30" rx="7" ry="9"/><ellipse cx="30" cy="26" rx="7" ry="9"/>' +
      '<ellipse cx="46" cy="30" rx="7" ry="9"/></g>' +
      '<rect x="16" y="54" width="28" height="14" rx="3" fill="#f7e3d2" stroke="#b23a48" stroke-width="1.8"/>'),
    bear: () => svg("stk stk--bear", "0 0 56 52",
      '<g fill="#e2c49a" stroke="#8a6a48" stroke-width="2">' +
      '<circle cx="14" cy="12" r="8"/><circle cx="42" cy="12" r="8"/>' +
      '<circle cx="28" cy="28" r="18"/></g>' +
      '<g fill="#8a6a48"><circle cx="22" cy="25" r="2.2"/><circle cx="34" cy="25" r="2.2"/>' +
      '<ellipse cx="28" cy="33" rx="4" ry="3"/></g>' +
      '<circle cx="18" cy="33" r="3.4" fill="#e8a7ab" opacity=".7"/>' +
      '<circle cx="38" cy="33" r="3.4" fill="#e8a7ab" opacity=".7"/>'),
    envelope: () => svg("stk stk--env", "0 0 56 40",
      '<rect x="3" y="6" width="50" height="32" rx="3" fill="#fbf4e7" stroke="#96733c" stroke-width="2"/>' +
      '<path d="M3 9 L28 26 L53 9" fill="none" stroke="#96733c" stroke-width="2"/>' +
      '<path d="M22 22 c0-3 5-4 6-1 c1-3 6-2 6 1 c0 4-6 7-6 7 s-6-3-6-7z" fill="#e8a7ab"/>'),
    star: () => svg("stk stk--star", "0 0 36 36",
      '<path d="M18 2 l4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4z" fill="#e8cf9f" stroke="#c8a05e" stroke-width="1.6" stroke-linejoin="round"/>'),
    sparkle: () => svg("stk stk--sparkle", "0 0 28 28",
      '<path d="M14 0c1 9 4 12 13 13 -9 1 -12 4 -13 13 -1 -9 -4 -12 -13 -13 9 -1 12 -4 13 -13z" fill="#e8cf9f"/>'),
    headphones: () => svg("stk stk--hp", "0 0 52 48",
      '<path d="M8 32 C8 16 16 8 26 8 C36 8 44 16 44 32" fill="none" stroke="#6f5a4e" stroke-width="3.4" stroke-linecap="round"/>' +
      '<rect x="3" y="30" width="10" height="14" rx="4" fill="#cf959b" stroke="#b23a48" stroke-width="2"/>' +
      '<rect x="39" y="30" width="10" height="14" rx="4" fill="#cf959b" stroke="#b23a48" stroke-width="2"/>'),
    note16: () => svg("stk stk--note", "0 0 32 40",
      '<path d="M12 4 L28 4 L28 30 L12 36 Z" fill="#f7e3d2" stroke="#96733c" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M12 4 L12 36" fill="none" stroke="#96733c" stroke-width="2"/>' +
      '<circle cx="10" cy="30" r="5" fill="#cf959b" stroke="#b23a48" stroke-width="1.8"/>' +
      '<path d="M15 30 L10 30" stroke="#b23a48" stroke-width="2"/>'),
    heartTiny: () => svg("stk stk--htiny", "0 0 24 22",
      '<path d="M12 20 C6 14 2 10.5 2 6.8 C2 3.6 4.6 1.6 7.4 2.2 C9.4 2.6 11 4.2 12 6 C13 4.2 14.6 2.6 16.6 2.2 C19.4 1.6 22 3.6 22 6.8 C22 10.5 18 14 12 20Z" fill="#e8a7ab" stroke="#b23a48" stroke-width="1.6"/>'),
    teacup: () => svg("stk stk--tea", "0 0 52 46",
      '<path d="M10 16 L40 16 L37 36 C36 40 32 42 25 42 C18 42 14 40 13 36 Z" fill="#fbf4e7" stroke="#6f5a4e" stroke-width="2.2"/>' +
      '<path d="M40 20 C48 20 48 30 40 30" fill="none" stroke="#6f5a4e" stroke-width="2.2"/>' +
      '<path d="M18 10 C18 6 22 6 22 2 M28 10 C28 6 32 6 32 2" fill="none" stroke="#b0a898" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M14 24 L36 24" stroke="#e8a7ab" stroke-width="4" stroke-linecap="round"/>'),
    cone: () => svg("stk stk--cone", "0 0 40 46",
      '<path d="M20 4 L34 40 L6 40 Z" fill="#e8956b" stroke="#b23a48" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M13 24 L27 24 M10 33 L30 33" stroke="#fbf4e7" stroke-width="4"/>' +
      '<rect x="3" y="40" width="34" height="5" rx="2" fill="#b23a48"/>'),
    car: () => svg("stk stk--car", "0 0 70 34",
      '<path d="M8 24 L14 14 C15 12 17 11 20 11 L44 11 C47 11 49 12 51 14 L58 24" fill="#e8a7ab" stroke="#b23a48" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<rect x="4" y="22" width="58" height="9" rx="4" fill="#cf959b" stroke="#b23a48" stroke-width="2.2"/>' +
      '<circle cx="18" cy="31" r="5" fill="#4b342a"/><circle cx="48" cy="31" r="5" fill="#4b342a"/>' +
      '<circle cx="18" cy="31" r="2" fill="#f1e4cc"/><circle cx="48" cy="31" r="2" fill="#f1e4cc"/>'),
    tissue: () => svg("stk stk--tissue", "0 0 48 44",
      '<rect x="6" y="18" width="36" height="22" rx="3" fill="#f2d0d2" stroke="#b23a48" stroke-width="2"/>' +
      '<path d="M16 18 C16 10 22 6 24 10 C26 6 32 10 32 18" fill="#fbf4e7" stroke="#b23a48" stroke-width="2"/>' +
      '<path d="M20 28 q4 4 8 0" fill="none" stroke="#b23a48" stroke-width="1.6" stroke-linecap="round"/>')
  };

  /* ================================================================
     1 · BIRTHDAY CALENDAR — interactive October, the 28th
     ================================================================ */
  function calendar(p) {
    const s = sheet("p-calendar");

    const head = el("div", "cal__head");
    const hWrap = el("div", "cal__headings");
    hWrap.append(el("span", "cal__year", p.year));
    hWrap.append(title(p.title, "ttl--cal"));
    head.append(hWrap);
    s.append(head);

    /* the two big watercolour bits act as the page heading: the bunting
       garland with the "happy birthday" lettering tucked under it */
    const birthdayBadge = el("div", "cal__birthday-badge");
    birthdayBadge.setAttribute("aria-hidden", "true");
    birthdayBadge.append(sticker("confetti-garland.png", "cal__garland"));
    birthdayBadge.append(sticker("1-happy-birthday.png", "cal__birthday-sticker"));
    s.append(birthdayBadge);

    /* dashed stitched frame like the reference */
    const frame = el("div", "cal__frame");

    const grid = el("div", "cal__grid");
    ["S", "M", "T", "W", "T", "F", "S"].forEach((d) => {
      grid.append(el("span", "cal__dow", d));
    });
    const calendarYear = Number(p.year) || new Date().getFullYear();
    const leadingDays = new Date(calendarYear, 9, 1).getDay();
    const daysInOctober = new Date(calendarYear, 10, 0).getDate();
    for (let i = 0; i < leadingDays; i++) grid.append(el("span", "cal__cell cal__cell--empty"));
    for (let d = 1; d <= daysInOctober; d++) {
      const cell = el("button", "cal__cell cal__cell--day");
      cell.type = "button";
      cell.setAttribute("aria-label", p.title.toLowerCase() + " " + d);
      cell.append(el("span", "cal__num", String(d)));
      if (d === p.highlight) {
        cell.classList.add("is-bday");
        cell.append(svg("cal__ring", "0 0 44 40",
          '<path d="M22 4 C34 3 41 10 40 20 C39 31 30 37 20 36 C9 35 3 27 4 17 C5 8 12 4 22 4Z" ' +
          'fill="none" stroke="#b23a48" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M33 6 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" fill="#c8a05e"/>'));
        /* the favourite-person arrow sits just above and to the side,
           with its tip pointing back toward the 28th. */
        cell.append(sticker("favp", "cal__favp"));
        cell.append(el("span", "cal__bday-note", "the big day"));
      }
      cell.addEventListener("click", () => {
        cell.classList.remove("tap-pop");
        void cell.offsetWidth;
        cell.classList.add("tap-pop");
        if (d === p.highlight) {
          burstHearts(s, 9);
          s.classList.add("is-hooray");
          setTimeout(() => s.classList.remove("is-hooray"), 1600);
        }
      });
      grid.append(cell);
    }
    frame.append(grid);
    s.append(frame);

    const notes = el("div", "cal__notes");
    notes.append(el("p", "cal__note1", p.note1));
    notes.append(el("p", "cal__note2", p.note2));
    s.append(notes);

    const hb = el("div", "cal__hb");
    hb.append(el("span", null, "HAPPY"));
    hb.append(el("span", null, "BIRTHDAY"));
    hb.append(el("span", null, "to you ♡"));
    s.append(hb);

    s.append(svg("cal__sparkles", "0 0 200 120",
      '<path d="M20 20 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#c8a05e"/>' +
      '<path d="M170 14 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#e8a7ab"/>' +
      '<path d="M150 90 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" fill="#c8a05e"/>' +
      '<circle cx="50" cy="80" r="2.4" fill="#cf959b"/><circle cx="120" cy="30" r="2" fill="#c8a05e"/>' +
      '<circle cx="90" cy="105" r="2" fill="#e8a7ab"/>'));

    /* birthday stickers tumble around the edges of the page instead of
       standing in one straight row — little, normal, and a bit bigger */
    const calStickers = scatterLayer(s, "sticker-scatter--cal");
    /* the calendar takes up most of the leaf, so every sticker lives in
       the two side gutters (or the margins above / below it) and never
       sits on top of a date */
    [
      { key: "stk-stars.png",        x: 90,  y: 1,    s: "xs", r: 9,  w: 2.1, z: 7 },
      { key: "bow.png",              x: 90.5, y: 8,   s: "md", r: 8,  w: 2.7, z: 7 },
      { key: "bday",                 x: -1.9, y: 40,  s: "md", r: -12, w: 3.1 },
      { key: "bday1",                x: -1.6, y: 56,  s: "sm", r: 8,  w: 2.4 },
      { key: "cake.png",             x: 90.6, y: 43,  s: "md", r: -8, w: 3.2, z: 6 },
      { key: "tulips",               x: 89.6, y: 59,  s: "md", r: -9, w: 3.3 },
      { key: "stk-pixel-heart.png",  x: 90.5, y: 74,  s: "xs", r: -6, w: 2.1 },
      { key: "stk-heart.png",        x: 2,    y: 92,  s: "xs", r: 12, w: 1.8 }
    ].forEach((o) => pastedSticker(calStickers, o.key, o));
    return s;
  }

  /* ================================================================
     2 · IN CASE I DIDN'T SAY IT ENOUGH — 10 thank-yous
     ================================================================ */
  function enough(p) {
    const s = sheet("p-enough");

    const strip = el("div", "enough__strip");
    strip.append(title(p.title, "ttl--strip"));
    strip.append(clip());
    s.append(strip);

    const grid = el("div", "enough__grid");
    const tones = ["tone-a", "tone-b", "tone-c", "tone-d"];
    p.items.forEach((t, i) => {
      const n = el("div", "torn torn--sm " + tones[i % 4]);
      n.style.setProperty("--rot", ((i % 3) - 1) * 1.1 + "deg");
      n.append(heartBullet());
      n.append(el("p", "torn__t", t));
      if (i % 4 === 1) n.append(washi("washi--mini washi--cherry"));
      if (i % 5 === 3) n.append(washi("washi--mini"));
      grid.append(n);
    });
    s.append(grid);

    s.append(wiggleOnTap(STK.heartTiny()).cloneNode(true));
    const hs = s.lastElementChild;
    hs.classList.add("enough__heart");
    wiggleOnTap(hs);

    /* two requested character stickers, pinned clear of the note grid */
    s.append(sticker("stk-spider.png", "enough__spider"));
    s.append(sticker("stk-lily.png", "enough__lily"));
    return s;
  }

  /* ================================================================
     3 · SOULMATE — definition, photos orbiting around it
     ================================================================ */
  function soulmate(p) {
    const s = sheet("p-soulmate");

    const spots = [
      { cls: "sm-p1", tilt: -6, label: "us, smiling ♡" },
      { cls: "sm-p2", tilt: 4,  label: "us being us ♡" },
      { cls: "sm-p3", tilt: -3, label: "that one photo" },
      { cls: "sm-p4", tilt: 5,  label: "us again ♡" },
      { cls: "sm-p5", tilt: -4, label: "your favourite" },
      { cls: "sm-p6", tilt: 3,  label: "my favourite" }
    ];
    spots.forEach((sp, i) => {
      const f = photo(sp.label, "photo--sm " + sp.cls, sp.tilt,
        p.photoAssets && p.photoAssets[i]);
      s.append(f);
    });

    const mid = el("div", "sm-mid");
    mid.append(el("h3", "sm-word", p.title));
    mid.append(el("span", "sm-pron", p.hint));
    mid.append(el("p", "sm-def", p.definition));
    mid.append(svg("sm-flourish", "0 0 160 18",
      '<path d="M8 9 C40 2 60 16 80 9 C100 2 120 16 152 9" fill="none" stroke="#c8a05e" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M80 5 c-3 -4 -8 -2 -8 2 c0 4 5 6 8 8 c3 -2 8 -4 8 -8 c0 -4 -5 -6 -8 -2z" fill="#b23a48"/>'));
    s.append(mid);

    s.append(svg("sm-stars", "0 0 220 80",
      '<path d="M20 30 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4z" fill="#c8a05e"/>' +
      '<path d="M190 16 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#e8a7ab"/>' +
      '<path d="M110 60 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" fill="#c8a05e"/>' +
      '<circle cx="60" cy="60" r="2" fill="#cf959b"/><circle cx="160" cy="50" r="2.2" fill="#c8a05e"/>'));

    s.append(sticker("8ac6f686f773c3308510930733337b14-removebg-preview.png",
      "sm-stk sm-stk--fingerprint"));
    s.append(sticker("stk-stars.png", "sm-stk sm-stk--stars"));
    s.append(sticker("stk-planet.png", "sm-stk sm-stk--planet"));
    return s;
  }

  /* ================================================================
     4/5 · SONGS — spotify share-card style, 3 per page
     ================================================================ */
  function spotifyLogo() {
    return svg("spot", "0 0 24 24",
      '<circle cx="12" cy="12" r="11" fill="#191414"/>' +
      '<path d="M6 9.5 C10 8 15 8.4 18.5 10.4" fill="none" stroke="#f1e4cc" stroke-width="1.9" stroke-linecap="round"/>' +
      '<path d="M6.8 12.6 C10 11.4 14.2 11.7 17 13.4" fill="none" stroke="#f1e4cc" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M7.6 15.4 C10 14.5 13.2 14.7 15.4 16" fill="none" stroke="#f1e4cc" stroke-width="1.3" stroke-linecap="round"/>');
  }

  /* a stable, tiny tilt so the cards never sit in a straight line
     (same card = same angle every time the page is turned) */
  function tinyTilt(seed) {
    const raw = Math.sin(seed * 12.9898 + 4.1414) * 43758.5453;
    const unit = raw - Math.floor(raw);
    return ((unit * 2 - 1) * 3.1).toFixed(2);
  }

  function songCard(song, idx, seed) {
    const card = el("figure", "song-print");
    card.style.setProperty("--rot", tinyTilt(seed + idx * 3.7) + "deg");
    const image = el("img", "song-print__image");
    image.src = A + song.img;
    image.alt = song.title + " — " + song.artist + ": " + song.big;
    card.append(image, washi("washi--photo"));
    return card;
  }

  /* scatter decorative stickers from a placement list */
  function scatter(s, list) {
    list.forEach((pl) => {
      const n = wiggleOnTap(pl.mk());
      pl.cls.split(" ").forEach((c) => n.classList.add(c));
      if (pl.rot != null) n.style.setProperty("--rot", pl.rot + "deg");
      s.append(n);
    });
    return s;
  }

  function songsPage(p, side) {
    const s = sheet("p-songs", side === "B" ? "p-songs--b" : "p-songs--a");
    if (side === "B") s.append(el("span", "side-tag side-tag--b", p.side));
    s.append(title(p.title, "ttl--hand"));

    if (p.intro) s.append(el("p", "songs__intro", p.intro));

    const stack = el("div", "songs__stack");
    const seed = side === "B" ? 9.2 : 2.4;
    p.songs.forEach((song, i) => stack.append(songCard(song, i, seed)));
    if (p.songs.length % 2 === 1) {
      const filler = el("div", "songs__filler");
      filler.append(washi("washi--mini washi--blush songs__filler-tape"));
      filler.append(el("span", "songs__filler-t",
        side === "A" ? "…more on the second page ♡" : "…and a hundred more ♡"));
      filler.append(heartSvg("songs__filler-h"));
      stack.append(filler);
    }
    s.append(stack);

    if (side === "A") {
      /* asked for: the red star at the left of the song-4 card and the
         little star cluster tucked into the top-right corner */
      s.append(sticker("cd55b0d7f094b1cf1fe063b54416bb04-removebg-preview.png",
        "songs__next-arrow"));
      s.append(sticker("stk-heart-balloon.png", "songs__balloon"));
      s.append(sticker("Firefly (10).png", "songs__bigstar"));
      s.append(sticker("sitcker1-removebg-preview.png", "songs__cluster"));
    } else {
      s.append(sticker("stk-hug.png", "songs__hug"));
    }

    s.append(wiggleOnTap(STK.headphones()).cloneNode(true));
    const hp = s.lastElementChild;
    hp.classList.add("songs__hp");
    wiggleOnTap(hp);

    const nt = wiggleOnTap(STK.note16());
    nt.classList.add("songs__note16");
    s.append(nt);

    const heart = wiggleOnTap(STK.heartTiny());
    heart.classList.add("songs__heart");
    s.append(heart);

    /* fill the bottom band */
    s.append(el("span", "washi washi--mini washi--blush songs__washi"));
    scatter(s, [
      { mk: STK.star,      cls: "songs__star" },
      { mk: STK.sparkle,   cls: "songs__spark" },
      { mk: STK.teacup,    cls: "songs__tea" }
    ]);
    s.append(el("span", "songs__foot", side === "B" ? "…and a hundred more, one by one ♡" : "press play, think of me ♡"));
    return s;
  }

  function songsA(p) { return songsPage(p, "A"); }
  function songsB(p) { return songsPage(p, "B"); }

  /* ================================================================
     6 · 17 LITTLE THINGS
     ================================================================ */
  function littleThings(p) {
    const s = sheet("p-little");

    const head = el("div", "little__head");
    const h = el("div", "little__titles");
    h.append(title(p.title, "ttl--hand"));
    h.append(el("p", "little__sub", p.sub));
    head.append(h);
    const badge = el("span", "little__17", "17");
    head.append(badge);
    s.append(head);

    const grid = el("div", "little__grid");
    const tones = ["tone-a", "tone-b", "tone-c", "tone-d"];
    p.items.forEach((t, i) => {
      const card = el("div", "lil " + tones[i % 4]);
      card.style.setProperty("--rot", (((i * 7) % 5) - 2) * 0.7 + "deg");
      card.append(el("span", "lil__no", String(i + 1)));
      card.append(el("p", "lil__t", t));
      if (i % 6 === 0) card.append(washi("washi--mini"));
      if (i % 7 === 3) card.append(washi("washi--mini washi--cherry"));
      grid.append(card);
    });
    s.append(grid);
    s.append(sticker("fower .png", "little__flower"));
    s.append(sticker("stk-kitty.png", "little__kitty"));

    s.append(el("span", "little-flourish", "· · · every tiny bit of us · · ·"));
    return s;
  }

  /* ================================================================
     7 · PHOTO BOOTH — a whole little booth, not just a photo strip:
     curtains + bulb marquee, a camera, a 3-pose strip you can fill
     with your own photos, a countdown with a flash, and a ticket stub.
     ================================================================ */
  function photoBooth(p) {
    const s = sheet("p-booth2");

    const booth = el("div", "pb");
    booth.append(el("div", "pb__curtain pb__curtain--l"),
                 el("div", "pb__curtain pb__curtain--r"),
                 el("div", "pb__floor"));

    /* --- marquee sign --- */
    const sign = el("div", "pb__sign");
    sign.append(el("span", "pb__bulbs"));
    sign.append(el("h2", "pb__sign-t", p.marquee));
    sign.append(el("span", "pb__sign-sub", p.kicker));
    booth.append(sign);

    const scene = el("div", "pb__scene");

    /* --- the printed photo strip --- */
    const strip = el("div", "pb__strip");
    strip.append(el("span", "pb__strip-no", p.stripNo));

    p.photos.forEach((ph, i) => {
      const frame = el("div", "pb__frame");
      frame.setAttribute("role", "button");
      frame.setAttribute("tabindex", "0");
      frame.setAttribute("aria-label", "flip photo " + (i + 1));

      const flip = el("div", "pb__flip");
      const front = el("div", "pb__face pb__face--front");
      const image = el("img", "pb__photo");
      image.alt = ph;
      image.loading = "lazy";
      const photoAsset = p.photoAssets && p.photoAssets[i];
      if (photoAsset) {
        const candidates = (Array.isArray(photoAsset) ? photoAsset : [photoAsset]).filter(Boolean);
        image.addEventListener("load", () => frame.classList.add("has-photo"), { once: true });
        softImage(image, candidates);
      }
      front.append(image, el("span", "pb__ph", ph),
                   el("span", "pb__tap", p.tapHint));

      /* a tiny label lets you develop your own photo into the frame */
      const add = el("label", "pb__add", p.addHint);
      const input = el("input", "pb__input");
      input.type = "file";
      input.accept = "image/*";
      input.setAttribute("aria-label", "add photo " + (i + 1));
      add.append(input);
      add.addEventListener("click", (e) => e.stopPropagation());
      input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          image.src = reader.result;
          frame.classList.add("has-photo");
        };
        reader.readAsDataURL(file);
      });
      front.append(add);

      const back = el("div", "pb__face pb__face--back");
      back.append(el("p", "pb__msg", p.message));
      back.append(el("span", "pb__msg-h", "♡"));

      flip.append(front, back);
      frame.append(flip);
      frame.addEventListener("click", () => frame.classList.toggle("is-flipped"));
      frame.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          frame.classList.toggle("is-flipped");
        }
      });
      strip.append(frame);
    });

    const foot = el("div", "pb__strip-foot");
    foot.append(el("span", "pb__foot-t", p.caption));
    foot.append(el("span", "pb__bars"));
    foot.append(el("span", "pb__foot-date", p.date));
    strip.append(foot);
    scene.append(strip);

    /* --- the machine, the button and the ticket --- */
    const side = el("div", "pb__side");
    side.append(svg("pb__camera", "0 0 130 92",
      '<rect x="7" y="20" width="116" height="65" rx="8" fill="#f4e4cd" stroke="#5a3b3d" stroke-width="3"/>' +
      '<rect x="7" y="20" width="116" height="18" rx="7" fill="#b23a48" stroke="#5a3b3d" stroke-width="3"/>' +
      '<rect x="16" y="24" width="24" height="10" rx="3" fill="#f7e3d2"/>' +
      '<circle cx="105" cy="29" r="4" fill="#e8cf9f" stroke="#5a3b3d" stroke-width="1.6"/>' +
      '<circle cx="62" cy="56" r="21" fill="#cdb79c" stroke="#5a3b3d" stroke-width="3"/>' +
      '<circle cx="62" cy="56" r="13" fill="#7d615c" stroke="#e8cf9f" stroke-width="3"/>' +
      '<circle cx="57" cy="51" r="3.4" fill="#f6e3b8" opacity=".8"/>' +
      '<path d="M24 14 L40 14 L36 6 L28 6 Z" fill="#c8a05e" stroke="#5a3b3d" stroke-width="2"/>' +
      '<rect x="88" y="76" width="26" height="14" rx="1.5" fill="#fbf6ec" stroke="#5a3b3d" stroke-width="2" transform="rotate(-6 101 83)"/>'));

    const counter = el("div", "pb__counter", "press the button, then pose ♡");
    side.append(counter);

    const shoot = el("button", "pb__shoot", p.shoot);
    shoot.type = "button";
    side.append(shoot);

    const ticket = el("div", "pb__ticket");
    ticket.append(el("span", "pb__ticket-top", p.ticket));
    ticket.append(el("span", "pb__ticket-date", p.date));
    ticket.append(el("span", "pb__ticket-sub", p.ticketSub));
    ticket.append(el("span", "pb__ticket-tear"));
    side.append(ticket);

    side.append(el("p", "pb__title", p.title));
    side.append(el("p", "pb__note", p.note));
    scene.append(side);

    booth.append(scene);
    booth.append(sticker("stk-doodle.png", "pb__deco-sticker pb__doodle-sticker"));
    booth.append(sticker("Firefly (4).png", "pb__deco-sticker pb__firefly-sticker"));
    booth.append(el("div", "pb__flash"));
    s.append(booth);

    /* --- shoot sequence: countdown → flash → developed strip --- */
    let busy = false;
    shoot.addEventListener("click", () => {
      if (busy) return;
      busy = true;
      booth.classList.add("is-shooting");
      strip.classList.remove("is-developed");
      let i = 0;
      counter.textContent = p.countdown[0];
      const tick = setInterval(() => {
        i += 1;
        if (i < p.countdown.length) {
          counter.textContent = p.countdown[i];
          return;
        }
        clearInterval(tick);
        counter.textContent = p.developing;
        const flash = booth.querySelector(".pb__flash");
        flash.classList.remove("is-flashing");
        void flash.offsetWidth;
        flash.classList.add("is-flashing");
        setTimeout(() => {
          flash.classList.remove("is-flashing");
          counter.textContent = p.developed;
          strip.classList.add("is-developed");
          booth.classList.remove("is-shooting");
          shoot.textContent = p.shootAgain;
          boothConfetti(booth);
          busy = false;
        }, 470);
      }, 650);
    });

    return s;
  }

  function boothConfetti(host) {
    const colours = ["#b23a48", "#e8a7ab", "#e8cf9f", "#c8a05e", "#fbf6ec"];
    for (let i = 0; i < 22; i++) {
      const bit = el("span", "pb__confetti-bit", i % 3 === 0 ? "✦" : "♡");
      bit.style.left = (8 + Math.random() * 84) + "%";
      bit.style.top = (12 + Math.random() * 24) + "%";
      bit.style.color = colours[i % colours.length];
      bit.style.setProperty("--dx", (Math.random() * 260 - 130) + "px");
      bit.style.setProperty("--dy", (140 + Math.random() * 260) + "px");
      bit.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
      bit.style.setProperty("--d", (Math.random() * .3) + "s");
      host.append(bit);
      setTimeout(() => bit.remove(), 2400);
    }
  }

  /* ================================================================
     8 · WHY YOU'RE MY DEAREST FRIEND — text flows around photos
     ================================================================ */
  function dearestFriend(p) {
    const s = sheet("p-why");

    const banner = el("div", "banner");
    banner.append(el("span", "banner__ribbon", p.title));
    s.append(banner);

    const body = el("div", "why__body");
    const f1 = photo(p.photo1, "photo--why photo--why-1", 2.5, p.photoAsset);
    body.append(f1);

    p.paragraphs.forEach((t, i) => {
      const para = el("p", "why__p", t);
      body.append(para);

    });
    s.append(body);

    s.append(sticker("hand-removebg-preview.png", "why__h1"));
    s.append(wiggleOnTap(STK.star()).cloneNode(true));
    const h2 = s.lastElementChild; h2.classList.add("why__h2"); wiggleOnTap(h2);

    /* bottom-left filler so the page doesn't feel empty */
    s.append(el("span", "washi washi--mini washi--cherry why__washi"));
    scatter(s, [
      { mk: STK.bow,      cls: "why__stk why__stk--bow" },
      { mk: STK.sparkle,  cls: "why__stk why__stk--spark" },
      { mk: STK.teacup,   cls: "why__stk why__stk--tea" }
    ]);
    return s;
  }

  /* ================================================================
     9 · US IN EVERY UNIVERSE — a taped-down moodboard collage.
     Same idea as the songs spreads: nothing in a straight line —
     different sizes, small tilts, some overlapping, all hand-placed.
     ================================================================ */
  const UNI_LAYOUT = [
    { x: 1,  y: 1,  w: 24, h: 27, r: -8 },
    { x: 26, y: 6,  w: 21, h: 25, r: 7 },
    { x: 48, y: 1,  w: 27, h: 28, r: -4 },
    { x: 76, y: 7,  w: 22, h: 24, r: 10 },
    { x: 4,  y: 34, w: 27, h: 28, r: 6 },
    { x: 32, y: 30, w: 30, h: 30, r: -7 },
    { x: 64, y: 35, w: 26, h: 27, r: 5 },
    { x: 1,  y: 66, w: 25, h: 28, r: -9 },
    { x: 28, y: 69, w: 28, h: 27, r: 4 },
    { x: 59, y: 64, w: 31, h: 31, r: -5 }
  ];

  function universes(p) {
    const s = sheet("p-universe2");

    const head = el("div", "uni2__head");
    head.append(title(p.title, "ttl--star uni2__title"));
    head.append(el("p", "uni2__sub", p.hint));
    s.append(head);

    const collage = el("div", "uni2__collage");
    /* a wandering pencil line ties the little universes together */
    collage.append(svg("uni2__thread", "0 0 100 100",
      '<path d="M10 12 C28 4 38 22 52 14 C68 5 78 22 90 14 ' +
      'M12 48 C30 38 44 58 62 46 C76 36 84 54 92 46 ' +
      'M10 82 C28 72 42 92 60 80 C74 70 84 88 92 80" ' +
      'fill="none" stroke="#c8a05e" stroke-width=".45" stroke-dasharray="1.4 1.8" ' +
      'stroke-linecap="round" opacity=".75"/>',
      { preserveAspectRatio: "none" }));

    p.pairs.forEach((pair, i) => {
      const L = UNI_LAYOUT[i % UNI_LAYOUT.length];
      const card = el("figure", "uni2-card" + (i % 3 === 0 ? " uni2-card--taped" : ""));
      card.style.left = L.x + "%";
      card.style.top = L.y + "%";
      card.style.width = L.w + "%";
      card.style.height = L.h + "%";
      card.style.setProperty("--rot", L.r + "deg");
      card.style.zIndex = String(2 + (i % 3));

      const art = el("img", "uni2-art");
      art.src = A + pair.img;
      art.alt = pair.label;
      art.loading = "lazy";
      card.append(art);
      if (i % 3 === 0) card.append(washi("washi--photo uni2-tape"));
      if (i % 5 === 1) card.append(clip());
      card.append(el("figcaption", "uni2-label", pair.label));
      wiggleOnTap(card);
      collage.append(card);
    });
    s.append(collage);
    s.append(el("p", "uni2__note", p.note));
    return s;
  }

  /* ================================================================
     10 · TRAFFIC — interactive light, cutesy fills
     ================================================================ */
  function traffic(p) {
    const s = sheet("p-traffic");
    s.append(stamp(p.title, "stamp--traffic"));

    const lightBtn = el("button", "lights-btn");
    lightBtn.type = "button";
    lightBtn.setAttribute("aria-label", "tap to change the light");
    const lights = svg("lights", "0 0 74 200",
      '<rect x="6" y="4" width="62" height="192" rx="16" fill="#4b342a" stroke="#3a2b26" stroke-width="3"/>' +
      '<circle class="lamp lamp--stop" cx="37" cy="44" r="21" fill="#b23a48"/>' +
      '<circle cx="31" cy="38" r="7" fill="rgba(255,255,255,.35)"/>' +
      '<circle class="lamp lamp--wait" cx="37" cy="100" r="21" fill="#d8a44f"/>' +
      '<circle cx="31" cy="94" r="7" fill="rgba(255,255,255,.35)"/>' +
      '<circle class="lamp lamp--go" cx="37" cy="156" r="21" fill="#9aa487"/>' +
      '<circle cx="31" cy="150" r="7" fill="rgba(255,255,255,.35)"/>');
    lightBtn.append(lights);
    s.append(lightBtn);

    const lamps = [...lights.querySelectorAll(".lamp")];
    let lit = 0;
    function setLit(i) {
      lit = i;
      lamps.forEach((c, j) => c.classList.toggle("is-lit", j === i));
    }
    setLit(0);
    lightBtn.addEventListener("click", () => setLit((lit + 1) % 3));
    if (!reduceMotion.matches) {
      setInterval(() => { if (document.contains(lights)) setLit((lit + 1) % 3); }, 1900);
    }

    const panels = el("div", "tpanels");
    const data = [
      { cls: "stop", word: "STOP", text: p.stop, stk: STK.cone },
      { cls: "wait", word: "WAIT", text: p.wait, stk: STK.tissue },
      { cls: "go", word: "GO", text: p.go, stk: STK.car }
    ];
    data.forEach((d) => {
      const pan = el("div", "tpanel tpanel--" + d.cls);
      pan.append(el("span", "tpanel__chip", d.word));
      pan.append(writeLine(d.text));
      const st = wiggleOnTap(d.stk());
      st.classList.add("tpanel__stk");
      pan.append(st);
      panels.append(pan);
    });
    s.append(panels);

    /* the coupon is tucked inside an envelope pocket — tap it and the
       coupon slides out of the envelope */
    const pocket = el("div", "coupon-pocket");

    const coupon = el("section", "hug-coupon");
    coupon.setAttribute("aria-label", "one free hug and kisses coupon, redeemable anytime");
    coupon.append(el("span", "hug-coupon__eyebrow", "a little something, just for you"));
    const couponMain = el("div", "hug-coupon__main");
    couponMain.append(el("span", "hug-coupon__one", "1"));
    const offer = el("span", "hug-coupon__offer");
    offer.append(el("span", "hug-coupon__free", "FREE"));
    offer.append(el("strong", "hug-coupon__words", "hug & kisses"));
    couponMain.append(offer);
    coupon.append(couponMain);
    coupon.append(el("span", "hug-coupon__redeem", "redeemable anytime · no expiration ♡"));
    coupon.append(el("span", "hug-coupon__barcode", "|||| ||| || ||||"));

    const pocketBack = el("span", "coupon-pocket__back");
    const pocketFront = el("span", "coupon-pocket__front");
    pocketFront.append(el("span", "coupon-pocket__seam"));
    pocketFront.append(el("span", "coupon-pocket__stamp", "♡"));
    const pocketHint = el("button", "coupon-pocket__hint");
    pocketHint.type = "button";
    pocketHint.setAttribute("aria-expanded", "false");
    pocketHint.append(el("span", "coupon-pocket__tap", "tap the coupon ♡"));
    pocketHint.append(el("span", "coupon-pocket__tap2", "pull it out of the envelope"));
    pocketFront.append(pocketHint);

    pocket.append(pocketBack, coupon, pocketFront);
    s.append(pocket);

    let couponOut = false;
    const pullCoupon = () => {
      couponOut = !couponOut;
      pocket.classList.toggle("is-out", couponOut);
      pocketHint.setAttribute("aria-expanded", String(couponOut));
      pocketHint.querySelector(".coupon-pocket__tap").textContent =
        couponOut ? "there it is ♡" : "tap the coupon ♡";
      pocketHint.querySelector(".coupon-pocket__tap2").textContent =
        couponOut ? "tap again to tuck it back" : "pull it out of the envelope";
      if (couponOut) burstHearts(s, 7);
    };
    coupon.addEventListener("click", pullCoupon);
    pocketHint.addEventListener("click", pullCoupon);
    coupon.setAttribute("role", "button");
    coupon.setAttribute("tabindex", "0");
    coupon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pullCoupon(); }
    });

    const quote = el("p", "traffic__quote",
      "i miss you more than i show\ni love u more than you know");
    s.append(quote);
    return s;
  }

  /* ================================================================
     11 · RED STRING THEORY — two hands, one cherry thread
     ================================================================ */
  function redString(p) {
    const s = sheet("p-string");

    s.append(title(p.title, "ttl--hand ttl--string"));
    s.append(el("p", "string__belief", p.belief));

    const hands = el("img", "hands hands--upload");
    softImage(hands, stickerSources("hand"));
    hands.alt = "Two reaching hands connected by a red thread";
    s.append(hands);

    s.append(el("p", "string__note", p.note));

    /* two little hearts tied together — bottom flourish */
    s.append(svg("string__flourish", "0 0 260 80",
      '<path d="M20 20 C70 60 100 10 130 40 C160 70 190 20 240 55" ' +
      'fill="none" stroke="#b23a48" stroke-width="2.8" stroke-linecap="round"/>' +
      '<path d="M78 40 c-4 -6 -11 -2.5 -11 3.2 c0 5 7 8.4 11 11.8 c4 -3.4 11 -6.8 11 -11.8 c0 -5.7 -7 -9.2 -11 -3.2z" fill="#e8a7ab" stroke="#b23a48" stroke-width="1.6"/>' +
      '<path d="M182 36 c-4 -6 -11 -2.5 -11 3.2 c0 5 7 8.4 11 11.8 c4 -3.4 11 -6.8 11 -11.8 c0 -5.7 -7 -9.2 -11 -3.2z" fill="#b23a48"/>'));

    s.append(el("span", "washi washi--mini washi--cherry string__washi"));

    /* scattered tiny hearts, reference-style */
    const hearts = el("div", "string__hearts");
    for (let i = 0; i < 18; i++) {
      const h = heartSvg("string__h");
      h.style.left = (6 + (i * 37) % 88) + "%";
      h.style.top = (8 + (i * 53) % 84) + "%";
      h.style.animationDelay = (i * 0.35) + "s";
      hearts.append(h);
    }
    s.append(hearts);
    return s;
  }

  /* ================================================================
     12 · REMINDERS — tap-to-check pad
     ================================================================ */
  function reminders(p) {
    const s = sheet("p-remind");
    const pad = el("div", "pad");
    pad.append(el("div", "pad__bind"));
    pad.append(el("h3", "pad__title", p.title));
    p.items.forEach((it) => {
      const row = el("button", "check");
      row.type = "button";
      row.setAttribute("aria-pressed", "false");
      const box = svg("check__box", "0 0 30 30",
        '<path d="M4 5 C10 3 22 4 26 5 C27 11 27 20 26 25 C19 27 9 26 4 25 C3 19 3 11 4 5Z" ' +
        'fill="none" stroke="#6f5a4e" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<path class="check__tick" d="M8 15 L13 21 L23 9" fill="none" stroke="#b23a48" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>');
      row.append(box);
      row.append(el("span", "check__t", it));
      row.addEventListener("click", () => {
        const on = row.classList.toggle("is-checked");
        row.setAttribute("aria-pressed", String(on));
      });
      pad.append(row);
    });
    pad.append(el("div", "pad__foot", "· · · keep this list close · · ·"));
    s.append(pad);

    /* a taped little note fills the space under the pad */
    const foot = el("div", "remind__note");
    foot.append(washi("washi--mini washi--blush remind__note-tape"));
    foot.append(el("span", "remind__note-t",
      "read this on the days you forget how loved you are ♡"));
    foot.append(heartSvg("remind__note-h"));
    s.append(foot);

    const p1 = pin("#b23a48").cloneNode(true);
    p1.classList.add("pad__pin");
    s.append(p1);

    const tea = wiggleOnTap(STK.teacup());
    tea.classList.add("remind__tea");
    s.append(tea);
    const ht = wiggleOnTap(STK.heartTiny());
    ht.classList.add("remind__heart");
    s.append(ht);

    scatter(s, [
      { mk: STK.star,     cls: "remind__stk remind__stk--star" },
      { mk: STK.sparkle,  cls: "remind__stk remind__stk--spark" },
      { mk: STK.bow,      cls: "remind__stk remind__stk--bow" },
      { mk: STK.envelope, cls: "remind__stk remind__stk--env" }
    ]);
    return s;
  }

  /* ================================================================
     13 · A HUG FOR YOU
     ================================================================ */
  function hug(p) {
    const s = sheet("p-poem");
    s.append(el("p", "poem__eyebrow", "my version of"));
    s.append(title(p.title, "poem__title"));
    const body = el("div", "poem__body");
    p.stanzas.forEach(stanza => body.append(el("p", "poem__stanza", stanza.t)));
    s.append(body, el("p", "poem__scroll-hint", "keep reading ↓ a little more of my heart"));
    s.append(sticker("stk-kitty.png", "poem__kitty"));
    s.append(sticker("Firefly (4).png", "poem__firefly"));
    return s;
  }

  /* ================================================================
     14 · DO YOU LOVE ME? — every answer is correct
     ================================================================ */
  function quiz(p) {
    const s = sheet("p-quiz");
    s.append(title(p.title, "ttl--quiz"));
    s.append(el("p", "quiz__intro", "one tiny question · one very obvious answer ♡"));

    const card = el("div", "quiz");
    card.append(el("span", "quiz__qmark", "?"));
    card.append(el("p", "quiz__prompt", "choose the answer your heart already knows"));

    /* one option on its own line, each in a little handwritten letter
       bubble — the quiz owns roughly half the page */
    const opts = el("div", "quiz__opts");
    const marks = ["a", "b", "c", "d"];
    p.options.forEach((label, i) => {
      const b = el("button", "qopt");
      b.type = "button";
      b.setAttribute("aria-label", "answer " + label);
      b.append(el("span", "qopt__mark", marks[i] + "."));
      b.append(el("span", "qopt__t", label));
      b.addEventListener("click", () => {
        opts.querySelectorAll(".qopt").forEach((other) => {
          other.classList.remove("is-picked");
          other.setAttribute("aria-pressed", "false");
        });
        b.classList.add("is-picked");
        b.setAttribute("aria-pressed", "true");
        fb.hidden = false;
        fb.className = "quiz__fb is-yes";
        fb.textContent = p.feedback[i] || p.feedback[0];
        hiddenNote.hidden = true;
        s.classList.add("is-answered");
        certificate.hidden = false;
        certificate.classList.remove("is-awarded");
        void certificate.offsetWidth;
        requestAnimationFrame(() => certificate.classList.add("is-awarded"));
        burstHearts(s, 10);
      });
      opts.append(b);
    });
    card.append(opts);

    const fb = el("p", "quiz__fb");
    fb.hidden = true;
    fb.setAttribute("aria-live", "polite");
    card.append(fb);
    s.append(card);

    /* hidden until she picks an answer — that's when the certificate
       unrolls underneath the quiz */
    const certificate = el("section", "friend-certificate");
    certificate.hidden = true;
    certificate.setAttribute("aria-live", "polite");
    certificate.append(el("span", "friend-certificate__seal", "♡"));
    certificate.append(el("h3", "friend-certificate__title", "Dearest Friend Certificate"));
    certificate.append(el("p", "friend-certificate__name", "awarded to Giffie"));
    certificate.append(el("p", "friend-certificate__copy",
      "for being the most amazing, supportive, honest, and caring person in my life"));
    certificate.append(el("span", "friend-certificate__ribbon", "officially my dearest friend ♡"));
    certificate.append(el("span", "friend-certificate__signature", "with all my love · mie"));
    const hiddenNote = el("p", "certificate-locked",
      "pick an answer above — a little something is waiting under it ♡");
    s.append(hiddenNote, certificate);

    s.append(sticker("stk-pony.png", "quiz__pony"));
    s.append(sticker("bc26229d8dd43fddb14b1963e1f32f5a-removebg-preview.png", "quiz__pair"));
    s.append(sticker("stk-squiggle.png", "quiz__squiggle"));
    return s;
  }

  function burstHearts(host, n) {
    for (let i = 0; i < (n || 7); i++) {
      const h = el("span", "flying-heart", "♥");
      h.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      h.style.setProperty("--d", (0.1 * i) + "s");
      host.append(h);
      setTimeout(() => h.remove(), 1500);
    }
  }

  /* ================================================================
     15 · CONNECT THE DOTS-ILY — spells "i love you"
     ================================================================ */
  /* dot pattern: block letters I · LOVE / YOU, angular single-stroke */
  const ILY_DOTS = [
    /* I */
    [50, 70], [50, 180],
    /* L */
    [95, 70], [95, 180], [140, 180],
    /* O */
    [185, 80], [230, 80], [230, 170], [185, 170],
    /* V */
    [275, 70], [305, 180], [335, 70],
    /* E (angular, single stroke) */
    [420, 70], [380, 70], [380, 125], [415, 125], [380, 180], [420, 180],
    /* Y */
    [80, 270], [120, 330], [160, 270], [120, 390],
    /* O */
    [210, 280], [255, 280], [255, 380], [210, 380],
    /* U */
    [305, 280], [305, 380], [350, 380], [350, 280]
  ];

  function dotsPage(p) {
    const s = sheet("p-dots");
    s.append(title(p.title, "ttl--hand"));

    const W = 460, H = 430;
    let circles = "";
    ILY_DOTS.forEach(([x, y], i) => {
      circles += '<circle class="dot" data-i="' + i + '" cx="' + x + '" cy="' + y + '" r="8"/>';
      /* the number sits just above its dot, clear of its neighbours */
      circles += '<text class="dot__n" text-anchor="middle" x="' + x +
        '" y="' + (y - 14) + '">' + (i + 1) + "</text>";
    });

    const wrap = el("div", "dotwrap");
    const ssvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    ssvg.setAttribute("class", "dotsvg");
    ssvg.setAttribute("viewBox", "26 36 434 396");
    ssvg.innerHTML =
      '<path class="dots__finish" d="" />' +
      '<path class="dots__temp" d="" />' +
      '<path class="dots__drawn" d="" />' +
      circles;
    wrap.append(ssvg);
    s.append(wrap);

    const reveal = el("p", "dots__reveal", p.reveal + " ♡");
    s.append(reveal);

    const hint = el("p", "dot-hint", p.hint);
    s.append(hint);

    s.append(sticker("stk-cat.png", "dots__cat"));
    s.append(sticker("stk-bean.png", "dots__bean"));
    s.append(el("span", "washi washi--mini washi--blush dots__washi"));

    wireDotInteraction(ssvg, hint, W, H, reveal);
    return s;
  }

  function wireDotInteraction(ssvg, hint, W, H, reveal) {
    const dots = [...ssvg.querySelectorAll(".dot")];
    const drawn = ssvg.querySelector(".dots__drawn");
    const temp = ssvg.querySelector(".dots__temp");
    const finish = ssvg.querySelector(".dots__finish");
    const pts = ILY_DOTS;
    let next = 0;
    let fromIdx = null;
    let selectedTap = null;

    const ptOf = (evt) => {
      const r = ssvg.getBoundingClientRect();
      return [((evt.clientX - r.left) / r.width) * W, ((evt.clientY - r.top) / r.height) * H];
    };

    const commit = (a, b) => {
      drawn.setAttribute("d", drawn.getAttribute("d") +
        (drawn.getAttribute("d") ? " L" : "M") + pts[a][0] + " " + pts[a][1] +
        " L" + pts[b][0] + " " + pts[b][1]);
      dots[a].classList.add("dot--done");
      next = b;
      dots[b].classList.add("dot--next");
      if (next === pts.length - 1 && a === pts.length - 2) {
        finish.setAttribute("d", "M" + pts.map(([x, y]) => x + " " + y).join(" L"));
        finish.style.opacity = "1";
        dots.forEach(d => d.classList.add("dot--done"));
        hint.textContent = "finished — there it is ♡";
        if (reveal) reveal.classList.add("is-shown");
        ssvg.classList.add("is-complete");
      }
    };

    dots[0].classList.add("dot--next");

    const dotAt = (evt) => {
      const el2 = document.elementFromPoint(evt.clientX, evt.clientY);
      return el2 && el2.classList && el2.classList.contains("dot") ? +el2.dataset.i : null;
    };

    ssvg.addEventListener("pointerdown", (e) => {
      const i = dotAt(e);
      if (i === null) return;
      e.preventDefault();
      if (i === next) {
        fromIdx = i;
        ssvg.setPointerCapture(e.pointerId);
      } else if (i === next + 1 && selectedTap === next) {
        commit(next, i);
        selectedTap = null;
      } else {
        wiggle(dots[i]);
        selectedTap = null;
      }
    });

    ssvg.addEventListener("pointermove", (e) => {
      if (fromIdx === null) return;
      const [x, y] = ptOf(e);
      temp.setAttribute("d", "M" + pts[fromIdx][0] + " " + pts[fromIdx][1] + " L" + x.toFixed(1) + " " + y.toFixed(1));
    });

    ssvg.addEventListener("pointerup", (e) => {
      if (fromIdx === null) return;
      const i = dotAt(e);
      temp.setAttribute("d", "");
      if (i === fromIdx + 1 && i < pts.length) {
        commit(fromIdx, i);
        selectedTap = null;
      } else if (i === fromIdx) {
        selectedTap = fromIdx;
      } else if (i !== null) {
        wiggle(dots[i]);
      }
      fromIdx = null;
    });
  }

  function wiggle(dot) {
    dot.classList.remove("dot--wiggle");
    void dot.getBoundingClientRect();
    dot.classList.add("dot--wiggle");
    setTimeout(() => dot.classList.remove("dot--wiggle"), 450);
  }

  /* ================================================================
     16 · THE FINAL LETTER — reserved stationery
     ================================================================ */
  function letter(p) {
    const s = sheet("p-letter");

    const lh = el("div", "letter__head");
    lh.append(el("span", "letter__title", p.title));
    lh.append(el("span", "letter__date", "__ / __ / ____"));
    s.append(lh);

    const body = el("div", "letter__body");
    body.append(el("p", "letter__hint", p.hint));
    body.append(el("div", "letter__lines"));
    s.append(body);

    const sig = el("div", "letter__sig");
    sig.append(el("span", "letter__sig-line"));
    sig.append(el("span", "letter__sig-t", p.signature));
    s.append(sig);

    s.append(svg("envelope", "0 0 140 96",
      '<rect x="4" y="10" width="132" height="80" rx="5" fill="#f4e8d3" stroke="#96733c" stroke-width="2.4"/>' +
      '<path d="M4 14 L70 58 L136 14" fill="none" stroke="#96733c" stroke-width="2.4"/>' +
      '<path d="M4 88 L54 48 M136 88 L86 48" fill="none" stroke="#c8a05e" stroke-width="1.6"/>' +
      '<circle cx="70" cy="56" r="13" fill="#b23a48" stroke="#8e2b37" stroke-width="2"/>' +
      '<path d="M64 55 c0-4 6-5 8-1 c2-4 8-3 8 1 c0 5-8 9-8 9 s-8-4-8-9z" fill="rgba(251,244,231,.9)"/>'));

    s.append(svg("pressed-flower", "0 0 60 74",
      '<path d="M30 70 C30 52 30 40 30 30" fill="none" stroke="#9aa487" stroke-width="2.6"/>' +
      '<path d="M30 46 C22 44 16 36 18 30 C26 30 30 38 30 46Z" fill="#9aa487"/>' +
      '<g fill="#cf959b" stroke="#b23a48" stroke-width="1.4">' +
      '<ellipse cx="30" cy="16" rx="7" ry="11"/>' +
      '<ellipse cx="20" cy="24" rx="10" ry="7" transform="rotate(-30 20 24)"/>' +
      '<ellipse cx="40" cy="24" rx="10" ry="7" transform="rotate(30 40 24)"/>' +
      '<ellipse cx="24" cy="12" rx="7" ry="9" transform="rotate(-20 24 12)"/>' +
      '<ellipse cx="36" cy="12" rx="7" ry="9" transform="rotate(20 36 12)"/></g>' +
      '<circle cx="30" cy="20" r="5" fill="#e8cf9f"/>'));
    return s;
  }

  /* ================================================================
     17–26 · LETTER CONTINUATION — ten matching ruled leaves;
     the unused leaves stay blank for later additions.
     ================================================================ */
  function letterContinuation(p) {
    const s = sheet("p-letter p-letter--continuation");
    const content = CONTENT.letterPages[p.part] || { paragraphs: [] };

    const head = el("div", "letter__head");
    head.append(el("span", "letter__title", "for later, from me"));
    head.append(el("span", "letter__date", "continued · " + (p.part + 1) + " / 10"));
    s.append(head);

    const body = el("div", "letter__body letter__body--written");
    const lines = el("div", "letter__lines");
    const prose = el("div", "letter__prose");
    if (content.lead) prose.append(el("p", "letter__lead", content.lead));
    (content.paragraphs || []).forEach((paragraph) => {
      prose.append(el("p", "letter__paragraph", paragraph));
    });
    body.append(lines, prose);
    s.append(body);

    if (p.part === CONTENT.letterPages.length - 1 &&
        content.paragraphs && content.paragraphs.length) {
      const signature = el("div", "letter__sig letter__sig--written");
      signature.append(el("span", "letter__sig-line"));
      signature.append(el("span", "letter__sig-t", "— always, mie ♡"));
      s.append(signature);
    }

    return s;
  }

  /* ================================================================
     27 · THE END — bittersweet finale
     ================================================================ */
  function theEnd(p) {
    const s = sheet("p-end");

    const lettering = el("img", "end-lettering");
    lettering.src = A + "theend.jpg";
    lettering.alt = "The End";
    s.append(lettering, el("p", "end-sub", p.sub));
    const portrait = el("label", "end-portrait");
    portrait.append(el("span", "end-portrait__hint", "a little photo of me ♡\ntap to add your portrait"));
    const input = el("input", "end-portrait__input");
    input.type = "file";
    input.accept = "image/*";
    input.setAttribute("aria-label", "Add mie’s portrait");
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        let image = portrait.querySelector("img");
        if (!image) { image = el("img", "end-portrait__image"); image.alt = "mie"; portrait.append(image); }
        image.src = reader.result;
        portrait.classList.add("has-photo");
      };
      reader.readAsDataURL(file);
    });
    portrait.append(input, washi("washi--photo"));
    s.append(portrait, el("p", "end-credit", "made with love, by mie ♡"));
    const lines = el("div", "end__lines");
    p.lines.forEach(t => lines.append(el("p", "end__line", t)));
    s.append(lines);

    const seal = el("button", "end-seal");
    seal.type = "button";
    seal.setAttribute("aria-expanded", "false");
    seal.setAttribute("aria-label", p.button);
    seal.append(svg("end-seal__art", "0 0 90 90",
      '<circle cx="45" cy="45" r="38" fill="#b23a48" stroke="#8e2b37" stroke-width="4"/>' +
      '<circle cx="45" cy="45" r="28" fill="none" stroke="rgba(251,244,231,.55)" stroke-width="2" stroke-dasharray="3 6"/>' +
      '<g fill="rgba(251,244,231,.9)">' +
      '<path d="M43 42 C35 32 26 34 27 40 C28 45 37 45 43 42Z"/>' +
      '<path d="M47 42 C55 32 64 34 63 40 C62 45 53 45 47 42Z"/>' +
      '<path d="M44 45 C42 52 37 57 32 60 C38 59 43 55 46 50Z"/>' +
      '<path d="M46 45 C48 52 53 57 58 60 C52 59 47 55 44 50Z"/>' +
      '<ellipse cx="45" cy="43" rx="4" ry="3.4"/></g>'));
    const sealLbl = el("span", "end-seal__lbl", p.button);
    seal.append(sealLbl);
    s.append(seal);

    const reveal = el("div", "end-reveal");
    reveal.hidden = true;
    reveal.append(writeLine(p.reveal, "end-reveal__line"));
    s.append(reveal);

    seal.addEventListener("click", () => {
      const open = reveal.hidden;
      reveal.hidden = !open;
      seal.setAttribute("aria-expanded", String(open));
      seal.classList.toggle("is-open", open);
      if (open) {
        petalBurst(s);
        sealLbl.textContent = "…";
      } else {
        sealLbl.textContent = p.button;
      }
    });

    const again = el("button", "end-again", p.again);
    again.type = "button";
    again.addEventListener("click", () => {
      if (typeof window.Book.goToPage === "function") window.Book.goToPage(0);
      else window.Book.goTo(0);
    });
    s.append(again);

    s.append(wiggleOnTap(STK.tissue()).cloneNode(true));
    const tis = s.lastElementChild; tis.classList.add("end__tissue"); wiggleOnTap(tis);
    s.append(wiggleOnTap(STK.envelope()).cloneNode(true));
    const env = s.lastElementChild; env.classList.add("end__env"); wiggleOnTap(env);
    return s;
  }

  function petalBurst(host) {
    const hues = ["#e8a7ab", "#b23a48", "#e8cf9f", "#ecc5c4", "#c8a05e"];
    for (let i = 0; i < 26; i++) {
      const pt = el("span", "petal");
      pt.style.left = (35 + Math.random() * 30) + "%";
      pt.style.top = "38%";
      pt.style.background = hues[i % hues.length];
      pt.style.setProperty("--dx", (Math.random() * 340 - 170) + "px");
      pt.style.setProperty("--dy", (120 + Math.random() * 220) + "px");
      pt.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
      pt.style.setProperty("--d", (Math.random() * 0.25) + "s");
      host.append(pt);
      setTimeout(() => pt.remove(), 2200);
    }
  }

  /* ================================================================
     registry + surface rendering
     ================================================================ */
  const RENDERERS = {
    calendar,
    enough,
    "songs-a": songsA,
    "songs-b": songsB,
    soulmate,
    "little-things": littleThings,
    "photo-booth": photoBooth,
    "dearest-friend": dearestFriend,
    universes,
    traffic,
    "red-string": redString,
    reminders,
    hug,
    quiz,
    dots: dotsPage,
    "the-end": theEnd,
    letter,
    "letter-continuation": letterContinuation
  };

  /* -------- stage-1 fallback sheet ---------------------- */
  function placeholderSheet(page) {
    const scrap = sheet("scrap--plain");
    const tape = washi("tape tape--blush");
    scrap.append(tape);
    const body = el("div", "sheet");
    body.append(el("h2", "sheet__title", page.title));
    if (page.hint) body.append(el("p", "sheet__hint", page.hint));
    const note = el("div", "sheet__note");
    note.append(el("span", "sheet__note-line"));
    note.append(el("span", "sheet__note-text", page.note || page.hint || "your words go here"));
    body.append(note);
    scrap.append(body);
    return scrap;
  }

  /* -------- inside-cover surfaces (NOT numbered pages) --- */
  function insideCover(side) {
    const scrap = sheet("scrap--endpaper");
    scrap.dataset.surface = "inside-" + side;

    /* soft speckle texture */
    scrap.append(el("span", "endpaper__speck"));

    if (side === "front") return introductionPage(scrap);

    const label = el("div", "bookplate");
    label.append(el("span", "bookplate__small", "this book belongs to"));
    label.append(el("span", "bookplate__name", "Giffie ♡"));
    scrap.append(label);
    scrap.append(el("span", "endpaper__stamp", "the end of the pages, not of us ♡"));
    handmadeStickers(scrap, 0);
    scatterStickers(scrap, 31.7, 6);
    return scrap;
  }

  /* ================================================================
     THE INTRODUCTION PAGE · bookplate + the folded-paper fortune
     teller. Not a numbered page — it lives on the inside front
     cover, immediately before the birthday calendar.
     ================================================================ */
  function introductionPage(scrap) {
    scrap.classList.add("scrap--intro");
    const F = CONTENT.fortune;

    const plate = el("div", "bookplate");
    plate.append(el("span", "bookplate__small", "this book belongs to"));
    plate.append(el("span", "bookplate__name", "Giffie ♡"));
    scrap.append(plate);

    const pasted = el("div", "ft-sheet");
    pasted.append(el("span", "ft-sheet__tape ft-sheet__tape--a"));
    pasted.append(el("span", "ft-sheet__tape ft-sheet__tape--b"));
    pasted.append(heartSvg("ft-doodle-heart ft-doodle-heart--a"));
    pasted.append(heartSvg("ft-doodle-heart ft-doodle-heart--b"));
    pasted.append(sticker("stk-kitty.png", "intro-p intro-p--a tier-sm"));
    pasted.append(sticker("stk-planet.png", "intro-p intro-p--b tier-md"));
    pasted.append(sticker("stk-stars.png", "intro-p intro-p--c tier-lg"));
    pasted.append(window.Fortune.build(F));
    scrap.append(pasted);

    return scrap;
  }

  function handmadeStickers(host, seed, used) {
    /* these layouts have deliberately hand-picked sticker sets; leave
       their small inline SVG doodles alone instead of swapping in
       unpredictable library stickers. */
    if ([2, 4, 5, 14, 15].includes(seed)) return;
    const library = STICKER_LIBRARY.length ? STICKER_LIBRARY : [{ png: "stk-stars.png" }];
    const tiers = ["tier-md", "tier-sm", "tier-lg", "tier-sm", "tier-md", "tier-lg", "tier-xs"];
    const seen = used || new Set();
    /* every sticker already painted on this page counts as used */
    host.querySelectorAll("img.pstk").forEach((im) => {
      const src = (im.getAttribute("src") || "").split("/").pop();
      if (src) seen.add(src);
    });
    host.querySelectorAll("svg.stk").forEach((old, i) => {
      let entry = null;
      for (let tries = 0; tries < library.length; tries++) {
        const candidate = library[(seed * 3 + i + tries) % library.length];
        if (!seen.has(candidate.png)) { entry = candidate; break; }
      }
      if (!entry) entry = library[(seed * 3 + i) % library.length];
      seen.add(entry.png);
      const image = sticker([entry.png, entry.jpg].filter(Boolean));
      image.setAttribute("class",
        old.getAttribute("class") + " real-sticker " + tiers[(seed + i) % tiers.length]);
      image.style.cssText = old.style.cssText;
      old.replaceWith(image);
    });
  }

  /* -------- public API ------------------------------------- */
  function renderPage(n) {
    const page = CONTENT.pages[n - 1];
    if (!page) return sheet();
    const renderer = RENDERERS[page.key] || placeholderSheet;
    const scrap = renderer(page);
    const used = new Set();
    handmadeStickers(scrap, n, used);
    const override = SCATTER_OVERRIDES[n];
    scatterStickers(scrap, n + 1.31, SCATTER_COUNTS[n], override, used);
    scrap.dataset.page = n;
    const num = el("div", "scrap__num", String(n).padStart(2, "0"));
    scrap.append(num);
    return scrap;
  }

  function renderSurface(id) {
    if (id === "inside-front") return insideCover("front");
    if (id === "inside-back") return insideCover("back");
    if (typeof id === "number") return renderPage(id);
    return sheet();
  }

  return { renderPage, renderSurface, el };
})();
