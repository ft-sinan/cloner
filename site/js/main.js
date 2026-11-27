/* monsoon.exe — vanilla JS, no dependencies.
   Everything degrades gracefully: without JS the site still reads fine. */
(function () {
  "use strict";

  var root = document.documentElement;
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem("monsoon:" + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem("monsoon:" + k, JSON.stringify(v)); } catch (e) {}
    }
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- settings persistence ---------------- */
  var settings = Object.assign(
    { rain: true, scan: true, sparkle: true, sound: false },
    store.get("settings", {})
  );
  if (reduceMotion) { settings.rain = false; settings.sparkle = false; }

  function paintSettings() {
    root.classList.toggle("no-rain", !settings.rain);
    root.classList.toggle("no-scan", !settings.scan);
    root.classList.toggle("no-sparkle", !settings.sparkle);
    root.classList.toggle("no-motion", reduceMotion);
    document.querySelectorAll("[data-toggle]").forEach(function (b) {
      var key = b.getAttribute("data-toggle");
      b.setAttribute("aria-pressed", String(!!settings[key]));
    });
    document.querySelectorAll("[data-state]").forEach(function (el) {
      var on = !!settings[el.getAttribute("data-state")];
      el.textContent = on ? "on" : "off";
    });
    if (settings.rain) Rain.start(); else Rain.stop();
    var amb = document.getElementById("ambience");
    if (amb) amb.textContent = settings.sound ? "\u25a0 stop rain sound" : "\u25b6 start rain sound";
  }

  /* ---------------- rain canvas ---------------- */
  var Rain = (function () {
    var canvas = null, ctx = null, drops = [], raf = null, w = 0, h = 0, dpr = 1;

    function size() {
      if (!canvas) return;
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn(true);
    }

    function spawn(reset) {
      var target = Math.min(200, Math.round((w * h) / 5200));
      if (reset) drops = [];
      while (drops.length < target) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: 6 + Math.random() * 16,
          spd: 3.4 + Math.random() * 6.2,
          a: 0.12 + Math.random() * 0.45,
          drift: -0.35 - Math.random() * 0.5
        });
      }
    }

    function tick() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.strokeStyle = "rgba(174,247,255," + d.a + ")";
        ctx.lineWidth = d.len > 15 ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.drift * 4, d.y + d.len);
        ctx.stroke();
        d.y += d.spd;
        d.x += d.drift;
        if (d.y > h) { d.y = -d.len - Math.random() * 60; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 8;
      }
      raf = requestAnimationFrame(tick);
    }

    return {
      attach: function (el) {
        canvas = el;
        try { ctx = canvas.getContext("2d"); } catch (e) { ctx = null; }
        if (!ctx) return;
        size();
        window.addEventListener("resize", size, { passive: true });
      },
      start: function () {
        if (!canvas || raf || reduceMotion) return;
        tick();
      },
      stop: function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        if (ctx) ctx.clearRect(0, 0, w, h);
      }
    };
  })();

  /* ---------------- typing effect ---------------- */
  function typewriter(el) {
    var phrases = JSON.parse(el.getAttribute("data-type") || "[]");
    if (!phrases.length) return;
    if (reduceMotion) { el.textContent = phrases[0]; return; }
    var target = el.querySelector(".typed__text") || el;
    var p = 0, i = 0, back = false;
    function step() {
      var phrase = phrases[p];
      i += back ? -1 : 1;
      target.textContent = phrase.slice(0, i);
      var delay = back ? 22 : 42 + Math.random() * 40;
      if (!back && i === phrase.length) { back = true; delay = 1900; }
      else if (back && i === 0) { back = false; p = (p + 1) % phrases.length; delay = 420; }
      setTimeout(step, delay);
    }
    step();
  }

  /* ---------------- visitor counter ---------------- */
  function counter() {
    var el = document.querySelector("[data-counter]");
    if (!el) return;
    var base = 2483051;
    var n = store.get("visits", null);
    if (n === null) { n = base + Math.floor(Math.random() * 900); }
    n += 1;
    store.set("visits", n);
    el.textContent = String(n).padStart(9, "0");
  }

  /* ---------------- sparkle trail ---------------- */
  function sparkles(el) {
    if (reduceMotion) return;
    var ctx = null;
    try { ctx = el.getContext("2d"); } catch (e) { ctx = null; }
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var bits = [], raf = null;
    var glyphs = ["✦", "✧", "★", "·", "✩"];

    function fit() {
      el.width = Math.round(window.innerWidth * dpr);
      el.height = Math.round(window.innerHeight * dpr);
      el.style.width = "100%"; el.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    window.addEventListener("resize", fit, { passive: true });

    function loop() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i = bits.length - 1; i >= 0; i--) {
        var b = bits[i];
        b.life -= 0.022;
        b.y -= b.vy;
        b.x += b.vx;
        b.vy *= 0.99;
        if (b.life <= 0) { bits.splice(i, 1); continue; }
        ctx.globalAlpha = Math.max(0, b.life);
        ctx.font = b.size + "px monospace";
        ctx.fillStyle = b.color;
        ctx.fillText(b.g, b.x, b.y);
      }
      ctx.globalAlpha = 1;
      raf = bits.length ? requestAnimationFrame(loop) : null;
    }

    function add(x, y, n) {
      for (var i = 0; i < n; i++) {
        bits.push({
          x: x + (Math.random() - 0.5) * 18,
          y: y + (Math.random() - 0.5) * 18,
          vx: (Math.random() - 0.5) * 0.9,
          vy: 0.4 + Math.random() * 1.1,
          life: 1,
          g: glyphs[(Math.random() * glyphs.length) | 0],
          size: 8 + Math.random() * 10,
          color: Math.random() > 0.5 ? "#7df9ff" : "#ff5edb"
        });
      }
      if (bits.length > 160) bits.splice(0, bits.length - 160);
      if (!raf) loop();
    }

    document.addEventListener("pointermove", function (e) {
      if (!settings.sparkle) return;
      add(e.clientX, e.clientY, 2);
    }, { passive: true });
    document.addEventListener("pointerdown", function (e) {
      if (!settings.sparkle) return;
      add(e.clientX, e.clientY, 12);
    }, { passive: true });
  }

  /* ---------------- toast ---------------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add("is-on"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 3600);
  }

  /* ---------------- guestbook (local only) ---------------- */
  var seed = [
    { name: "rainfrog", url: "https://neocities.org/site/rainfrog", when: "15 Nov 2026 · 23:41", mood: "listening to: Boards of Canada — Roygbiv", msg: "found you through the shrine wall. the dithered banner is doing something to my brain. added you to my links page, no takebacks <3" },
    { name: "kerala.exe", url: "", when: "09 Nov 2026 · 10:02", mood: "sitting under the fan, power cut again", msg: "your monsoon photos smell like my grandmother's veranda. also: the tiled background loads in 0.4s on 2G. respect." },
    { name: "gifhunter99", url: "https://neocities.org/site/gifhunter99", when: "02 Nov 2026 · 03:17", mood: "counting frames", msg: "came for the frog, stayed for the anilink webring. bookmarking the tea page. tell me you have more tea pages." },
    { name: "nalini", url: "", when: "24 Oct 2026 · 19:55", mood: "chai #4 today", msg: "guestbook entry number one, basically. hello from the future where this page is still up. keep it up." }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function gbEntries() {
    var mine = store.get("guestbook", []);
    return mine.concat(seed);
  }

  function renderGuestbook() {
    var list = document.querySelector("[data-guestbook]");
    if (!list) return;
    var entries = gbEntries();
    var count = document.querySelector("[data-gb-count]");
    if (count) count.textContent = String(entries.length);
    list.innerHTML = entries.map(function (e) {
      var initials = (e.name || "?").replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase() || "??";
      var hue = (e.name || "").length * 47 % 360;
      var avatar = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">' +
        '<rect width="30" height="30" fill="hsl(' + hue + ',55%,22%)"/>' +
        '<text x="15" y="20" font-family="monospace" font-size="13" font-weight="bold" fill="hsl(' + hue + ',95%,78%)" text-anchor="middle">' + initials + "</text></svg>"
      );
      var who = e.url
        ? '<a href="' + esc(e.url) + '" rel="nofollow noopener" target="_blank">' + esc(e.name) + "</a>"
        : esc(e.name);
      return '<article class="gb__entry">' +
        '<div class="gb__head">' +
        '<img class="gb__avatar" src="' + avatar + '" alt="" width="30" height="30">' +
        '<span class="gb__who">' + who + "</span>" +
        '<span class="gb__when">' + esc(e.when) + "</span></div>" +
        '<p class="gb__msg">' + esc(e.msg) + "</p>" +
        (e.mood ? '<p class="gb__mood">' + esc(e.mood) + "</p>" : "") +
        "</article>";
    }).join("") || '<p class="gb__empty">nobody has signed yet. be the first frog.</p>';
  }

  function initGuestbook() {
    var form = document.querySelector("[data-gb-form]");
    renderGuestbook();
    if (!form) return;
    var a = Math.ceil(Math.random() * 8) + 2;
    var b = Math.ceil(Math.random() * 8) + 2;
    var q = form.querySelector("[data-math-q]");
    if (q) q.textContent = a + " + " + b;
    var note = form.querySelector("[data-gb-note]");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var err = function (msg) {
        if (note) { note.innerHTML = "<b>✖ " + msg + "</b>"; }
      };
      var name = (form.elements.name.value || "").trim();
      var url = (form.elements.url.value || "").trim();
      var msg = (form.elements.msg.value || "").trim();
      var mood = (form.elements.mood.value || "").trim();
      var sum = parseInt((form.elements.answer.value || "").trim(), 10);

      if (name.length < 2) return err("a name needs at least 2 characters");
      if (msg.length < 6) return err("say a little more than that (6+ characters)");
      if (msg.length > 600) return err("that is a diary entry, not a guestbook note (600 max)");
      if (url && !/^https?:\/\//i.test(url)) return err("links must start with http:// or https://");
      if (sum !== a + b) return err("the anti-robot question is wrong. try again?");

      var d = new Date();
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var when = d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear() + " · " +
        String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");

      var mine = store.get("guestbook", []);
      mine.unshift({ name: name, url: url, msg: msg, mood: mood, when: when });
      store.set("guestbook", mine.slice(0, 60));
      form.reset();
      a = Math.ceil(Math.random() * 8) + 2;
      b = Math.ceil(Math.random() * 8) + 2;
      if (q) q.textContent = a + " + " + b;
      if (note) note.textContent = "saved in this browser. the frog is pleased.";
      renderGuestbook();
      toast("✎ signed! entry is at the top");
    });
  }

  /* ---------------- poll ---------------- */
  function initPoll() {
    var poll = document.querySelector("[data-poll]");
    if (!poll) return;
    var opts = Array.prototype.slice.call(poll.querySelectorAll("input[type=radio]"));
    var pcts = poll.querySelectorAll(".pct");
    var bars = poll.querySelectorAll(".bar i");
    var voted = store.get("poll", null);

    function show(choice) {
      var totals = opts.map(function (o, i) { return Number(o.getAttribute("data-count")) + (choice === i ? 1 : 0); });
      var sum = totals.reduce(function (x, y) { return x + y; }, 0);
      totals.forEach(function (t, i) {
        var p = Math.round((t / sum) * 100);
        if (pcts[i]) pcts[i].textContent = p + "%";
        if (bars[i]) bars[i].style.width = p + "%";
      });
    }

    if (voted !== null) {
      for (var k = 0; k < opts.length; k++) {
        if (Number(opts[k].value) === Number(voted)) opts[k].checked = true;
      }
      show(Number(voted));
      var note = document.querySelector(".poll__note");
      if (note) note.textContent = "you voted. changes are locked to one per browser, as tradition demands.";
    }

    /* before a vote: show the (made up) running totals so the bars aren't empty */
    if (voted === null) show(-1);

    /* live preview as soon as you pick, saved when you submit */
    opts.forEach(function (o, i) {
      o.addEventListener("change", function () { show(i); });
    });

    poll.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var picked = -1;
      opts.forEach(function (o, i) { if (o.checked) picked = i; });
      var note = document.querySelector(".poll__note");
      if (picked < 0) {
        if (note) note.textContent = "pick a chai first, then press the button.";
        return;
      }
      store.set("poll", picked);
      show(picked);
      if (note) note.textContent = "vote recorded in this browser. thank you for your service to science.";
      toast("✔ vote cast — " + opts[picked].parentNode.textContent.trim().slice(0, 24));
    });
  }

  /* ---------------- copy widget ---------------- */
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sel = btn.getAttribute("data-copy");
        var box = document.querySelector(sel);
        if (!box) return;
        var text = box.value !== undefined ? box.value : box.textContent;
        var done = function () { toast("✔ copied to clipboard"); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { box.select && box.select(); });
        } else if (box.select) { box.select(); document.execCommand("copy"); done(); }
      });
    });
  }

  /* ---------------- customizer ---------------- */
  function initCustomizer() {
    var panel = document.querySelector("[data-cfg]");
    if (!panel) return;
    var toggle = panel.querySelector("[data-cfg-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    document.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var key = b.getAttribute("data-toggle");
        settings[key] = !settings[key];
        store.set("settings", settings);
        paintSettings();
        toast((settings[key] ? "✔ " : "✖ ") + key + " " + (settings[key] ? "on" : "off"));
      });
    });
  }

  /* ---------------- synthesized rain ambience (Web Audio) ---------------- */
  function initAmbience() {
    var btn = document.getElementById("ambience");
    if (!btn) return;
    var audio = null;

    function build() {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      var ctx = new Ctx();
      var seconds = 4;
      var buf = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
      for (var ch = 0; ch < 2; ch++) {
        var data = buf.getChannelData(ch);
        var last = 0;
        for (var i = 0; i < data.length; i++) {
          var white = Math.random() * 2 - 1;
          /* brown-ish noise: nicer than pure static, closer to rain on a roof */
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.2 + white * 0.12;
        }
      }
      var src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      var lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 2100; lp.Q.value = 0.4;
      var hp = ctx.createBiquadFilter();
      hp.type = "highpass"; hp.frequency.value = 180;

      var gain = ctx.createGain();
      gain.gain.value = 0;

      /* slow swell, like rain getting heavier and lighter */
      var lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06;
      var lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();

      src.connect(hp).connect(lp).connect(gain).connect(ctx.destination);
      src.start();
      return { ctx: ctx, gain: gain, src: src, lfo: lfo };
    }

    btn.addEventListener("click", function () {
      if (!audio) audio = build();
      if (!audio) { toast("✖ this browser has no Web Audio"); return; }
      var on = settings.sound;
      var now = audio.ctx.currentTime;
      audio.gain.gain.cancelScheduledValues(now);
      audio.gain.gain.setValueAtTime(audio.gain.gain.value, now);
      audio.gain.gain.linearRampToValueAtTime(on ? 0 : 0.5, now + 0.8);
      if (audio.ctx.state === "suspended") audio.ctx.resume();
      settings.sound = !on;
      store.set("settings", settings);
      paintSettings();
      btn.textContent = settings.sound ? "■ stop rain sound" : "▶ start rain sound";
      toast(settings.sound ? "♪ rain on. headphones recommended" : "✖ rain sound off");
    });
  }

  /* ---------------- clock ---------------- */
  function initClock() {
    var els = document.querySelectorAll("[data-clock]");
    if (!els.length) return;
    function tick() {
      var d = new Date();
      var t = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") + ":" + String(d.getSeconds()).padStart(2, "0");
      els.forEach(function (el) {
        el.textContent = el.hasAttribute("data-clock-short") ? t.slice(0, 5) : t;
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    var rain = document.getElementById("rain");
    if (rain) { Rain.attach(rain); }
    /* browser autoplay rules mean sound never resumes by itself */
    settings.sound = false;
    paintSettings();
    if (!settings.rain) Rain.stop();

    document.querySelectorAll("[data-type]").forEach(typewriter);
    counter();
    var trail = document.getElementById("trail");
    if (trail) sparkles(trail);
    initCustomizer();
    initGuestbook();
    initPoll();
    initCopy();
    initClock();
    initAmbience();

    /* the modem, described (no audio file needed) */
    document.querySelectorAll("[data-modem]").forEach(function (b) {
      var lines = [
        "dial tone … then a number being shouted at a robot",
        "shhhhhh — KRRRSSHH — beep beep boop — ksssssh",
        "a fax machine arguing with a vacuum cleaner",
        "then silence. then your mother picks up the phone and it all ends."
      ];
      var i = 0;
      b.addEventListener("click", function () {
        toast("☎ " + lines[i % lines.length]);
        i++;
      });
    });

    /* page render timing, for the colophon */
    var speed = document.getElementById("speed");
    if (speed && window.performance && performance.getEntriesByType) {
      var nav = performance.getEntriesByType("navigation")[0];
      var ms = nav ? Math.round(nav.duration) : Math.round(performance.now());
      speed.textContent = ms + " ms";
    }

    /* current year */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* konami-ish key: press "r" to toggle rain, "s" scanlines */
    document.addEventListener("keydown", function (e) {
      if (e.target.matches("input,textarea,select") || e.metaKey || e.ctrlKey || e.altKey) return;
      var k = e.key.toLowerCase();
      if (k === "r") { settings.rain = !settings.rain; store.set("settings", settings); paintSettings(); }
      if (k === "s") { settings.scan = !settings.scan; store.set("settings", settings); paintSettings(); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  window.monsoon = { toast: toast };
})();
