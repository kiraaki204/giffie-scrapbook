/* ============================================================
   music.js · one persistent background track for the whole book

   - starts from the beginning with sound on for every visit
   - tries to play on the closed-cover screen as soon as it loads
   - if the browser blocks autoplay, starts on the first gesture
   - keeps playing through page turns; the button mutes for this visit
   ============================================================ */

(function () {
  "use strict";

  var GENTLE_VOLUME = 0.18;                 /* 18% — sits quietly under the writing */
  var GESTURE_EVENTS = ["pointerdown", "touchstart", "click", "keydown"];

  var audio = document.getElementById("bg-music");
  var btn = document.getElementById("music-toggle");
  if (!audio || !btn) return;
  var tag = btn.querySelector(".music-btn__tag");

  var started = false;        /* playback has successfully begun at least once */
  var failed = false;         /* the track could not be loaded / decoded */
  var muted = false;          /* each new visit starts with sound on */
  var gesturesArmed = false;

  /* Do not start muted: otherwise the song could be partway through before
     the visitor ever hears it. Older saved mute preferences are not applied. */
  audio.volume = GENTLE_VOLUME;
  audio.muted = false;
  audio.loop = true;
  audio.preload = "auto";
  try { audio.currentTime = 0; } catch (e) { /* a new track already starts at 0 */ }

  function syncButton() {
    btn.classList.toggle("is-playing", started && !muted);
    btn.classList.toggle("is-muted", muted);
    btn.classList.toggle("is-waiting", !started && !failed);
    btn.setAttribute("aria-pressed", String(started && !muted));
    btn.setAttribute(
      "aria-label",
      !started ? "Play background music" :
        muted ? "Turn background music on" : "Mute background music"
    );
    if (tag) tag.textContent = started ? "music" : "play music";
  }

  function markFailed() {
    if (failed) return;
    failed = true;
    started = false;
    disarmGestures();
    btn.hidden = true;                  /* no dead control if the track is missing */
    try { audio.pause(); } catch (e) { /* noop */ }
  }

  function markStarted() {
    if (failed) return;
    started = true;
    disarmGestures();
  }

  /* ---------------- autoplay-policy fallback ---------------- */

  function onFirstGesture(event) {
    if (started || failed) {
      disarmGestures();
      return;
    }
    /* Let the button's click handler start playback itself. Otherwise the
       pointerdown could start the song just before click immediately mutes it. */
    if (event.target === btn || btn.contains(event.target)) return;
    requestPlay();
  }

  function armGestures() {
    if (gesturesArmed || failed || started) return;
    gesturesArmed = true;
    /* capture + passive: never block the book's own open/turn handlers */
    GESTURE_EVENTS.forEach(function (t) {
      window.addEventListener(t, onFirstGesture, { capture: true, passive: true });
    });
    syncButton();
  }

  function disarmGestures() {
    if (gesturesArmed) {
      gesturesArmed = false;
      GESTURE_EVENTS.forEach(function (t) {
        window.removeEventListener(t, onFirstGesture, { capture: true });
      });
    }
    syncButton();
  }

  /* ---------------- the one and only play path ---------------- */

  function onPlayError(err) {
    if (started || failed) return;       /* an earlier attempt may settle late */
    if (err && err.name === "NotSupportedError") {
      markFailed();                      /* file missing / codec unsupported */
      return;
    }
    /* Autoplay blocked or interrupted: keep waiting for a real gesture. */
    armGestures();
  }

  function requestPlay() {
    if (started || failed) return;

    var p;
    try {
      /* Allow a gesture to retry even while the initial autoplay promise is
         pending: the browser needs play() to run within the gesture itself. */
      p = audio.play();
    } catch (e) {
      onPlayError(e);
      return;
    }

    /* old browsers that don't return a promise: assume it started */
    if (!p || typeof p.then !== "function") {
      markStarted();
      return;
    }

    p.then(markStarted, onPlayError);
  }

  /* ---------------- media element events ---------------- */

  audio.addEventListener("error", markFailed);
  audio.addEventListener("playing", markStarted);

  /* ---------------- the little mute/unmute button ---------------- */

  btn.addEventListener("click", function () {
    if (failed) return;
    if (!started) {
      requestPlay();                    /* first click starts, rather than mutes */
      return;
    }
    muted = !muted;
    audio.muted = muted;                /* mute, never pause — position keeps flowing */
    syncButton();
  });

  /* ---------------- boot: try immediately on the cover screen ---------------- */

  btn.hidden = false;
  /* Arm before play() settles, so an early gesture is never missed. */
  armGestures();
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
