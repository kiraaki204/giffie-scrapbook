/* Run with: node --test tests/music.test.js */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const musicScript = fs.readFileSync(path.join(__dirname, "../js/music.js"), "utf8");

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type, target = this) {
    for (const listener of [...(this.listeners.get(type) || [])]) {
      listener({ type, target });
    }
  }
}

class FakeClassList {
  constructor(...classes) {
    this.classes = new Set(classes);
  }

  toggle(name, force) {
    if (force) this.classes.add(name);
    else this.classes.delete(name);
  }

  contains(name) {
    return this.classes.has(name);
  }
}

function playError(name) {
  return Object.assign(new Error(name), { name });
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function setup({ attempts = [], currentTime = 0 } = {}) {
  const window = new FakeEventTarget();
  let storageReads = 0;
  let storageWrites = 0;
  window.localStorage = {
    getItem() { storageReads++; return "1"; }, // legacy saved "muted" value
    setItem() { storageWrites++; }
  };

  const audio = new FakeEventTarget();
  audio.currentTime = currentTime;
  audio.muted = true;
  audio.volume = 1;
  audio.pauseCalls = 0;
  audio.playCalls = [];
  audio.play = function () {
    this.playCalls.push({ currentTime: this.currentTime, muted: this.muted, volume: this.volume });
    const attempt = attempts[this.playCalls.length - 1];
    return attempt ? attempt() : Promise.resolve();
  };
  audio.pause = function () { this.pauseCalls++; };

  const button = new FakeEventTarget();
  const icon = {};
  const tag = { textContent: "play music" };
  button.hidden = true;
  button.classList = new FakeClassList("music-btn", "is-waiting");
  button.attributes = {};
  button.setAttribute = (name, value) => { button.attributes[name] = value; };
  button.querySelector = (selector) => selector === ".music-btn__tag" ? tag : null;
  button.contains = (target) => target === button || target === icon;

  const book = {};
  const document = {
    getElementById(id) {
      return id === "bg-music" ? audio : id === "music-toggle" ? button : null;
    }
  };
  vm.runInNewContext(musicScript, { document, window }, { filename: "music.js" });

  return {
    window, audio, button, icon, tag, book,
    get storageReads() { return storageReads; },
    get storageWrites() { return storageWrites; },
    gesture(type, target = book) { window.dispatch(type, target); },
    clickButton(target = button) {
      // Simulate capturing pointer/click listeners followed by the button handler.
      window.dispatch("pointerdown", target);
      window.dispatch("click", target);
      button.dispatch("click", target);
    }
  };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("autoplay begins at zero, unmuted, even with a legacy saved mute", async () => {
  const app = setup({ currentTime: 38 });
  assert.deepEqual(app.audio.playCalls, [{ currentTime: 0, muted: false, volume: 0.18 }]);
  assert.equal(app.audio.loop, true);
  assert.equal(app.audio.preload, "auto");
  assert.equal(app.storageReads, 0);
  assert.equal(app.button.hidden, false);
  await settle();

  assert.equal(app.window.GiffieMusic.started, true);
  assert.equal(app.window.GiffieMusic.muted, false);
  assert.equal(app.window.GiffieMusic.waitingForGesture, false);
  assert.equal(app.button.classList.contains("is-playing"), true);
  assert.equal(app.button.classList.contains("is-muted"), false);
  assert.equal(app.button.attributes["aria-label"], "Mute background music");
  assert.equal(app.button.attributes["aria-pressed"], "true");
  assert.equal(app.tag.textContent, "music");
});

test("blocked autoplay waits unmuted and starts from zero on a book gesture", async () => {
  const app = setup({ attempts: [() => Promise.reject(playError("NotAllowedError"))] });
  await settle();
  assert.equal(app.window.GiffieMusic.waitingForGesture, true);
  assert.equal(app.audio.muted, false);
  assert.equal(app.button.classList.contains("is-muted"), false);
  assert.equal(app.button.classList.contains("is-waiting"), true);
  assert.equal(app.button.attributes["aria-label"], "Play background music");
  assert.equal(app.button.attributes["aria-pressed"], "false");
  assert.equal(app.tag.textContent, "play music");

  app.gesture("pointerdown");
  assert.deepEqual(app.audio.playCalls[1], { currentTime: 0, muted: false, volume: 0.18 });
  await settle();
  assert.equal(app.window.GiffieMusic.started, true);
  assert.equal(app.window.GiffieMusic.waitingForGesture, false);
  assert.equal(app.button.classList.contains("is-playing"), true);

  app.audio.currentTime = 24;
  app.gesture("click");
  app.gesture("keydown");
  assert.equal(app.audio.playCalls.length, 2, "later page interactions do not restart music");
  assert.equal(app.audio.currentTime, 24);
});

test("the first click on the music control plays instead of muting", async () => {
  const app = setup({ attempts: [() => Promise.reject(playError("NotAllowedError"))] });
  await settle();
  app.clickButton(app.icon); // clicking a descendant must not trigger both handlers
  assert.equal(app.audio.playCalls.length, 2);
  assert.equal(app.audio.muted, false);
  await settle();
  assert.equal(app.window.GiffieMusic.started, true);
  assert.equal(app.window.GiffieMusic.muted, false);

  app.audio.currentTime = 16;
  app.clickButton();
  assert.equal(app.audio.muted, true);
  assert.equal(app.button.classList.contains("is-muted"), true);
  assert.equal(app.button.attributes["aria-label"], "Turn background music on");
  assert.equal(app.button.attributes["aria-pressed"], "false");
  app.clickButton();
  assert.equal(app.audio.muted, false);
  assert.equal(app.audio.currentTime, 16, "manual mute does not restart the song");
  assert.equal(app.audio.playCalls.length, 2);
  assert.equal(app.storageWrites, 0, "muting only applies to the current visit");
});

test("keyboard activation of the music button starts playback", async () => {
  const app = setup({ attempts: [() => Promise.reject(playError("NotAllowedError"))] });
  await settle();
  app.gesture("keydown", app.button);
  assert.equal(app.audio.playCalls.length, 1, "button handles its own activation");
  app.window.dispatch("click", app.button);
  app.button.dispatch("click");
  await settle();
  assert.equal(app.audio.playCalls.length, 2);
  assert.equal(app.audio.muted, false);
  assert.equal(app.window.GiffieMusic.started, true);
});

test("an early gesture retries even if the autoplay promise has not settled", async () => {
  const initialPlay = deferred();
  const app = setup({ attempts: [() => initialPlay.promise] });
  app.gesture("touchstart");
  assert.equal(app.audio.playCalls.length, 2, "play() must run inside the gesture");
  await settle();
  assert.equal(app.window.GiffieMusic.started, true);
  initialPlay.reject(playError("NotAllowedError"));
  await settle();
  assert.equal(app.window.GiffieMusic.started, true, "a late rejection cannot undo playback");
  assert.equal(app.window.GiffieMusic.waitingForGesture, false);
});

test("an early click on the music button can retry a pending autoplay", async () => {
  const initialPlay = deferred();
  const app = setup({ attempts: [() => initialPlay.promise] });
  app.clickButton();
  assert.equal(app.audio.playCalls.length, 2);
  assert.equal(app.audio.muted, false);
  await settle();
  initialPlay.reject(playError("NotAllowedError"));
  await settle();
  assert.equal(app.window.GiffieMusic.started, true);
  assert.equal(app.window.GiffieMusic.muted, false);
});

test("another gesture can retry after playback is blocked more than once", async () => {
  const denied = () => Promise.reject(playError("NotAllowedError"));
  const app = setup({ attempts: [denied, denied] });
  await settle();
  app.gesture("pointerdown");
  await settle();
  assert.equal(app.window.GiffieMusic.waitingForGesture, true);
  app.gesture("keydown");
  await settle();
  assert.equal(app.audio.playCalls.length, 3);
  assert.equal(app.window.GiffieMusic.started, true);
});

test("unsupported media hides the control instead of waiting forever", async () => {
  const app = setup({ attempts: [() => Promise.reject(playError("NotSupportedError"))] });
  await settle();
  assert.equal(app.window.GiffieMusic.failed, true);
  assert.equal(app.window.GiffieMusic.waitingForGesture, false);
  assert.equal(app.button.hidden, true);
  assert.equal(app.audio.pauseCalls, 1);
  app.gesture("click");
  assert.equal(app.audio.playCalls.length, 1);
});

test("a media error wins over a pending playback promise", async () => {
  const initialPlay = deferred();
  const app = setup({ attempts: [() => initialPlay.promise] });
  app.audio.dispatch("error");
  initialPlay.resolve();
  await settle();
  assert.equal(app.window.GiffieMusic.failed, true);
  assert.equal(app.window.GiffieMusic.started, false);
  assert.equal(app.button.hidden, true);
});

test("a synchronous autoplay failure can be retried by a gesture", async () => {
  const app = setup({ attempts: [() => { throw playError("NotAllowedError"); }] });
  assert.equal(app.window.GiffieMusic.waitingForGesture, true);
  app.gesture("click");
  await settle();
  assert.equal(app.window.GiffieMusic.started, true);
  assert.equal(app.audio.muted, false);
});

test("legacy browsers without a play promise still update the control", () => {
  const app = setup({ attempts: [() => undefined] });
  assert.equal(app.window.GiffieMusic.started, true);
  assert.equal(app.window.GiffieMusic.waitingForGesture, false);
  assert.equal(app.button.classList.contains("is-playing"), true);
});
