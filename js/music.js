/* ============================================================
   music.js · one persistent background track for the whole book

   - tries to start on the closed-cover screen as soon as the
     page loads, before the scrapbook is opened
   - if the browser blocks autoplay (most phones do), it starts
     on the user's first gesture instead — tapping the book,
     pressing a key, anything
   - a single <audio> element lives for the whole visit, so page
     turns and overlays never restart or reload the track
   - muting is remembered between visits via localStorage
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "giffie:music-muted";
  var GENTLE_VOLUME = 0.18;                 /* 18% — sits quietly under the writing */
  var GESTURE_EVENTS = ["pointerdown", "touchstart", "click", "keydown"];

  var audio = document.getElementById("bg-music");
  var btn = document.getElementById("music-toggle");
  if (!audio || !btn) return;

  var started = false;        /* playback has successfully begun at least once */
  var failed = false;         /* the track could not be loaded / decoded */
  var muted = readMutePref();
  var playInFlight = false;   /* a play() promise is still pending */
  var gesturesArmed = false;

  function readMutePref() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;           /* private mode etc. — just default to sound on */
    }
  }

  function writeMutePref() {
    try {
      window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch (e) {
      /* preference simply won't persist if storage is unavailable */
    }
  }

  /* gentle background level, looped forever */
  audio.volume = GENTLE_VOLUME;
  audio.muted = muted;
  audio.loop = true;
  audio.preload = "auto";

  function syncButton() {
    btn.classList.toggle("is-playing", started && !muted);
    btn.classList.toggle("is-muted", muted || !started);
    btn.classList.toggle("is-waiting", !started && !failed);
    btn.setAttribute("aria-pressed", String(!muted));
    btn.setAttribute(
      "aria-label",
      muted ? "Turn background music on" : "Mute background music"
    );
  }

  function markFailed() {
    if (failed) return;
    failed = true;
    started = false;
    playInFlight = false;
    disarmGestures();
    btn.hidden = true;                  /* no dead control if the track is missing */
    try { audio.pause(); } catch (e) { /* noop */ }
  }

  /* ---------------- autoplay-policy fallback ---------------- */

  function onFirstGesture() {
    if (started || failed) {
      disarmGestures();
      return;
    }
    requestPlay();
  }

  function armGestures() {
    if (gesturesArmed || failed || started) return;
    gesturesArmed = true;
    /* capture + passive: we never block, prevent or swallow the gesture,
       so the book's own open/turn handlers run exactly as before */
    GESTURE_EVENTS.forEach(function (t) {
      window.addEventListener(t, onFirstGesture, { capture: true, passive: true });
    });
    syncButton();
  }

  function disarmGestures() {
    if (!gesturesArmed) { syncButton(); return; }
    gesturesArmed = false;
    GESTURE_EVENTS.forEach(function (t) {
      window.removeEventListener(t, onFirstGesture, { capture: true });
    });
    syncButton();
  }

  /* ---------------- the one and only play path ---------------- */

  function requestPlay() {
    if (started || failed || playInFlight) return;
    playInFlight = true;

    var p;
    try {
      p = audio.play();
    } catch (e) {
      playInFlight = false;
      armGestures();
      return;
    }

    /* old browsers that don't return a promise: assume it started */
    if (!p || typeof p.then !== "function") {
      playInFlight = false;
      started = true;
      disarmGestures();
      syncButton();
      return;
    }

    p.then(function () {
      playInFlight = false;
      started = true;
      disarmGestures();
      syncButton();
    }).catch(function (err) {
      playInFlight = false;
      if (err && err.name === "NotSupportedError") {
        markFailed();                 /* file missing / codec unsupported */
        return;
      }
      /* NotAllowedError (autoplay blocked) or AbortError (interrupted):
         keep waiting quietly for a real user gesture */
      armGestures();
    });
  }

  /* ---------------- media element events ---------------- */

  audio.addEventListener("error", markFailed);
  audio.addEventListener("playing", function () {
    started = true;
    disarmGestures();
    syncButton();
  });

  /* ---------------- the little mute/unmute button ---------------- */

  btn.addEventListener("click", function () {
    if (failed) return;
    muted = !muted;
    audio.muted = muted;              /* mute, never pause — playback position keeps flowing */
    writeMutePref();
    if (!muted) requestPlay();        /* unmuting is itself a trusted user gesture */
    syncButton();
  });

  /* ---------------- boot: try immediately on the cover screen ---------------- */

  btn.hidden = false;
  syncButton();
  requestPlay();

  /* test/debug surface */
  window.GiffieMusic = {
    requestPlay: requestPlay,
    get started() { return started; },
    get muted() { return muted; },
    get failed() { return failed; },
    get waitingForGesture() { return gesturesArmed; }
  };
})();
