/* ===========================================================
   util.js — 日期、文本、答题判定、提示与动效
   =========================================================== */
(function (global) {
  "use strict";

  /* ---------- DOM ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- 日期 ---------- */
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function today() { return ymd(new Date()); }
  function parseYmd(s) {
    var p = String(s || "").split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function addDays(s, n) {
    var d = parseYmd(s);
    d.setDate(d.getDate() + n);
    return ymd(d);
  }
  function daysBetween(a, b) {
    return Math.round((parseYmd(b) - parseYmd(a)) / 86400000);
  }
  function weekdayCN(s) {
    return "日一二三四五六".charAt(parseYmd(s).getDay());
  }
  function prettyDate(s) {
    var d = parseYmd(s);
    return (d.getMonth() + 1) + "月" + d.getDate() + "日 周" + weekdayCN(s);
  }

  /* ---------- 文本 ---------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* 轻量富文本：**加粗**、`代码`、- 列表、1. 有序列表、空行分段 */
  function renderRich(text) {
    var s = escapeHtml(String(text == null ? "" : text)).replace(/\r\n/g, "\n");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    var lines = s.split("\n");
    var out = [];
    var mode = null; // 'ul' | 'ol'
    function close() { if (mode) { out.push("</" + mode + ">"); mode = null; } }
    lines.forEach(function (line) {
      var t = line.trim();
      if (!t) { close(); return; }
      var ul = t.match(/^[-·•]\s*(.+)$/);
      var ol = t.match(/^(\d+)[.、]\s*(.+)$/);
      if (ul) {
        if (mode !== "ul") { close(); out.push("<ul>"); mode = "ul"; }
        out.push("<li>" + ul[1] + "</li>");
      } else if (ol) {
        if (mode !== "ol") { close(); out.push("<ol>"); mode = "ol"; }
        out.push("<li>" + ol[2] + "</li>");
      } else {
        close();
        out.push("<p>" + t + "</p>");
      }
    });
    close();
    return out.join("");
  }

  /* ---------- 答题判定 ---------- */
  var FULL2HALF = /[\uFF01-\uFF5E]/g;
  function normalizeAnswer(v) {
    var s = String(v == null ? "" : v).trim().toLowerCase();
    s = s.replace(FULL2HALF, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); });
    s = s.replace(/\u3000/g, " ").replace(/\s+/g, "");
    s = s.replace(/[×✕✖✱]/g, "x").replace(/[÷]/g, "/").replace(/[－—–−]/g, "-");
    s = s.replace(/[，。、；：！？；""''（）()《》〈〉【】\[\]{}!?,;:'"`]/g, "");
    s = s.replace(/^[.·]+|[.·]+$/g, "");
    return s;
  }
  function numericValue(s) {
    var t = String(s).replace(/[%％]$/, "");
    if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
    return parseFloat(t);
  }
  function sameAnswer(input, accepts) {
    if (input == null || String(input).trim() === "") return false;
    var got = normalizeAnswer(input);
    var gotNum = numericValue(got);
    for (var i = 0; i < accepts.length; i++) {
      var want = normalizeAnswer(accepts[i]);
      if (got === want) return true;
      if (gotNum !== null) {
        var wNum = numericValue(want);
        if (wNum !== null && Math.abs(wNum - gotNum) < 1e-6) return true;
      }
    }
    return false;
  }

  /* ---------- 随机 ---------- */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function shuffle(arr, seed) {
    var a = arr.slice();
    var rnd = mulberry32(seed == null ? Date.now() : seed);
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(arr, seed) { return arr[Math.floor((seed == null ? Math.random() : mulberry32(seed)()) * arr.length)]; }

  /* ---------- 反馈 ---------- */
  var toastTimer = null;
  function toast(msg, type) {
    var root = $("#toast-root");
    if (!root) return;
    var t = el("div", "toast " + (type || ""));
    t.textContent = msg;
    root.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("in"); });
    setTimeout(function () {
      t.classList.remove("in");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 240);
    }, 2200);
  }

  var audioCtx = null;
  function beep(kind) {
    try {
      if (!audioCtx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return;
        audioCtx = new AC();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      var now = audioCtx.currentTime;
      var seq = kind === "ok" ? [[880, 0], [1320, 0.07]] : kind === "bad" ? [[300, 0], [220, 0.08]] : [[520, 0]];
      seq.forEach(function (p) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = kind === "bad" ? "sine" : "triangle";
        o.frequency.value = p[0];
        g.gain.setValueAtTime(0.0001, now + p[1]);
        g.gain.exponentialRampToValueAtTime(0.09, now + p[1] + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, now + p[1] + 0.16);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(now + p[1]); o.stop(now + p[1] + 0.18);
      });
    } catch (e) { /* 静默失败 */ }
  }

  function confetti(n) {
    var layer = $("#fx-root");
    if (!layer) return;
    var colors = ["#2F6BFF", "#E8890C", "#0F9B8E", "#D9534F", "#6C5CE7", "#F5B301"];
    for (var i = 0; i < (n || 18); i++) {
      var p = el("i", "confetti");
      p.style.left = (20 + Math.random() * 60) + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 0.18) + "s";
      p.style.setProperty("--dx", (Math.random() * 240 - 120) + "px");
      p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      layer.appendChild(p);
      (function (node) { setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 1400); })(p);
    }
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  global.U = {
    $: $, $$: $$, el: el,
    today: today, ymd: ymd, parseYmd: parseYmd, addDays: addDays, daysBetween: daysBetween,
    weekdayCN: weekdayCN, prettyDate: prettyDate,
    escapeHtml: escapeHtml, renderRich: renderRich,
    normalizeAnswer: normalizeAnswer, sameAnswer: sameAnswer,
    shuffle: shuffle, pick: pick, hashStr: hashStr,
    toast: toast, beep: beep, confetti: confetti, clamp: clamp, pct: pct, debounce: debounce
  };
})(window);
