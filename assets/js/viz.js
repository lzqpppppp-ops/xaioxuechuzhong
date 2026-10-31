/* ===========================================================
   viz.js — 可交互可视化
   数轴 / 正方体 / 函数图象 / 三视图 / 圆 / 旋转
   用法：容器加 data-viz="键名"，渲染后调用 Viz.mountAll(root)
   =========================================================== */
(function (global) {
  "use strict";

  var items = []; /* {el, api} */

  function mk(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function cssv(name, fb) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fb;
  }
  function pal() {
    return {
      ink: cssv("--ink", "#1F2430"),
      muted: cssv("--muted", "#79808E"),
      line: cssv("--line-2", "#F1ECE2"),
      brand: cssv("--brand", "#2F6BFF"),
      ok: cssv("--ok", "#109B74"),
      warn: cssv("--warn", "#E8890C"),
      bad: cssv("--bad", "#D9534F"),
      bg: cssv("--card", "#FFFFFF")
    };
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function fmt(n, d) {
    var v = Number(n);
    if (!isFinite(v)) return String(n);
    var s = d == null ? String(Math.round(v * 100) / 100) : v.toFixed(d);
    return s.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  }
  function fmtCoef(n) {
    var v = Math.round(n * 100) / 100;
    return v === 1 ? "" : v === -1 ? "-" : fmt(v);
  }

  function makeCanvas(host, h) {
    var canvas = mk("canvas", "viz-cv");
    host.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var api = {
      canvas: canvas,
      ctx: ctx,
      w: 0,
      h: h,
      fit: function () {
        var dpr = global.devicePixelRatio || 1;
        var w = Math.max(220, Math.round(host.clientWidth || 320));
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        api.w = w;
        return api;
      }
    };
    return api;
  }

  function ro(host, cb) {
    var r = null;
    if (global.ResizeObserver) {
      r = new global.ResizeObserver(function () { cb(); });
      r.observe(host);
    }
    return {
      disconnect: function () { if (r) r.disconnect(); }
    };
  }

  function pointerDrag(canvas, onDown, onMove, onUp) {
    var down = false;
    function pos(ev) {
      var b = canvas.getBoundingClientRect();
      return { x: ev.clientX - b.left, y: ev.clientY - b.top };
    }
    function d(ev) {
      if (!down) return;
      ev.preventDefault();
      onMove(pos(ev), ev);
    }
    function up() { if (down) { down = false; if (onUp) onUp(); } }
    canvas.addEventListener("pointerdown", function (ev) {
      down = true;
      canvas.setPointerCapture && canvas.setPointerCapture(ev.pointerId);
      canvas.style.cursor = "grabbing";
      ev.preventDefault();
      onDown(pos(ev), ev);
    });
    canvas.addEventListener("pointermove", d);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", function () { canvas.style.cursor = "grab"; });
    canvas.style.cursor = "grab";
    return {
      dispose: function () { canvas.removeEventListener("pointermove", d); canvas.removeEventListener("pointerup", up); }
    };
  }

  function seg(ctx, x1, y1, x2, y2, color, w, dash) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = w || 1;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
  function dot(ctx, x, y, r, fill, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  }
  function label(ctx, text, x, y, color, align, size, bold) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = (bold ? "700 " : "500 ") + (size || 12) + 'px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = align || "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  /* 带底色描边的文字：图形密集处压住线条，保证标签看得清 */
  function labelHalo(ctx, text, x, y, color, bg, align, size) {
    ctx.save();
    ctx.font = "700 " + (size || 12) + 'px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = align || "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = bg;
    ctx.lineJoin = "round";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function bubble(ctx, text, x, y, bg, fg) {
    ctx.save();
    ctx.font = '700 13px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    var w = ctx.measureText(text).width + 18;
    var h = 24;
    roundRect(ctx, x - w / 2, y - h - 8, w, h, 8);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y - h / 2 - 8);
    ctx.restore();
  }
  function btn(text, onClick, cls) {
    var b = mk("button", "viz-btn " + (cls || ""), text);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }
  function slider(host, labelText, min, max, step, value, onInput) {
    var row = mk("label", "viz-slider");
    var t = mk("span", "viz-slider-name", labelText);
    var v = mk("b", "viz-slider-val", fmt(value));
    var i = document.createElement("input");
    i.type = "range";
    i.min = min; i.max = max; i.step = step; i.value = value;
    i.addEventListener("input", function () {
      v.textContent = fmt(i.value);
      onInput(Number(i.value));
    });
    row.appendChild(t);
    row.appendChild(i);
    row.appendChild(v);
    host.appendChild(row);
    return { input: i, set: function (n) { i.value = n; v.textContent = fmt(n); } };
  }

  /* =========================================================
     1. 数轴
     ========================================================= */
  function numberline(host) {
    var P = pal();
    var box = mk("div", "viz-body");
    host.appendChild(box);
    var c = makeCanvas(box, 138);
    var min = -6, max = 6, val = 2;
    var flags = { abs: false, opp: false, ray: false };
    var read = mk("div", "viz-read");
    var ctl = mk("div", "viz-ctl");

    function px(v) { return 32 + ((v - min) / (max - min)) * (c.w - 64); }
    function vx(x) { return min + ((x - 32) / (c.w - 64)) * (max - min); }

    function draw() {
      var ctx = c.ctx, w = c.w, y0 = 86;
      ctx.clearRect(0, 0, w, c.h);
      if (flags.ray) {
        ctx.fillStyle = "rgba(47,107,255,.13)";
        ctx.fillRect(px(val), y0 - 16, px(max) - px(val), 32);
        label(ctx, "x ≥ " + fmt(val), (px(val) + px(max)) / 2, y0 - 30, P.brand, "center", 12, true);
      }
      seg(ctx, 20, y0, w - 14, y0, P.muted, 1.6);
      ctx.beginPath();
      ctx.moveTo(w - 14, y0); ctx.lineTo(w - 22, y0 - 4); ctx.lineTo(w - 22, y0 + 4);
      ctx.closePath(); ctx.fillStyle = P.muted; ctx.fill();

      var step = (max - min) > 12 ? 2 : 1;
      for (var v = min; v <= max; v += step) {
        var x = px(v);
        seg(ctx, x, y0 - 5, x, y0 + 5, P.muted, 1.4);
        label(ctx, String(v), x, y0 + 20, P.muted, "center", 11);
      }
      seg(ctx, px(0), y0 - 9, px(0), y0 + 9, P.ink, 2);
      label(ctx, "0", px(0), y0 + 20, P.ink, "center", 11, true);

      if (flags.abs) {
        dot(ctx, px(Math.abs(val)), y0, 5, P.ok, P.bg);
        label(ctx, "|x|=" + fmt(Math.abs(val)), px(Math.abs(val)), y0 + 40, P.ok, "center", 11, true);
      }
      if (flags.opp) {
        dot(ctx, px(-val), y0, 5, P.warn, P.bg);
        label(ctx, "-x=" + fmt(-val), px(-val), y0 + 40, P.warn, "center", 11, true);
      }
      seg(ctx, px(0), y0 - 22, px(val), y0 - 22, "rgba(47,107,255,.35)", 2, [4, 4]);
      dot(ctx, px(val), y0, 8, P.brand, P.bg);
      bubble(ctx, fmt(val), px(val), y0 - 26, P.brand, "#fff");

      var parts = ["x = " + fmt(val), "|x| = " + fmt(Math.abs(val)), "相反数 = " + fmt(-val)];
      if (flags.ray) parts.push("解集：x ≥ " + fmt(val));
      read.textContent = parts.join("　·　");
    }

    ctl.appendChild(btn("显示 |x|", function () { flags.abs = !flags.abs; this.classList.toggle("on"); draw(); }));
    ctl.appendChild(btn("显示 -x", function () { flags.opp = !flags.opp; this.classList.toggle("on"); draw(); }));
    ctl.appendChild(btn("显示解集 x ≥ a", function () { flags.ray = !flags.ray; this.classList.toggle("on"); draw(); }));
    box.appendChild(ctl);
    box.appendChild(read);

    var drag = pointerDrag(c.canvas, function (p) { move(p); }, function (p) { move(p); });
    function move(p) {
      val = clamp(Math.round(vx(p.x) * 2) / 2, min, max);
      draw();
    }

    c.fit(); draw();
    var r = ro(host, function () { c.fit(); draw(); });
    return { dispose: function () { drag.dispose(); r.disconnect(); } };
  }

  /* =========================================================
     2. 正方体（可转动 + 展开图）
     ========================================================= */
  function cubeViz(host) {
    var wrap = mk("div", "viz-cube");
    var scene = mk("div", "cube-scene");
    var cube = mk("div", "cube");
    var faces = [
      { k: "front", t: "前", c: "#5B8CFF" },
      { k: "back", t: "后", c: "#8E7BFF" },
      { k: "right", t: "右", c: "#2FBFA6" },
      { k: "left", t: "左", c: "#F0A53E" },
      { k: "top", t: "上", c: "#FF7C8A" },
      { k: "bottom", t: "下", c: "#4EA8DE" }
    ];
    faces.forEach(function (f) {
      var d = mk("div", "cube-face face-" + f.k, f.t);
      d.style.background = f.c;
      cube.appendChild(d);
    });
    scene.appendChild(cube);
    wrap.appendChild(scene);

    var rotX = -20, rotY = -32;
    function apply() {
      cube.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
    }
    var lx = 0, ly = 0, down = false;
    scene.addEventListener("pointerdown", function (ev) {
      down = true; lx = ev.clientX; ly = ev.clientY;
      scene.setPointerCapture && scene.setPointerCapture(ev.pointerId);
      cube.style.transition = "none";
    });
    scene.addEventListener("pointermove", function (ev) {
      if (!down) return;
      rotY += (ev.clientX - lx) * 0.7;
      rotX = clamp(rotX - (ev.clientY - ly) * 0.7, -89, 89);
      lx = ev.clientX; ly = ev.clientY;
      apply();
    });
    function stop() { down = false; cube.style.transition = "transform .35s cubic-bezier(.2,.8,.3,1)"; }
    scene.addEventListener("pointerup", stop);
    scene.addEventListener("pointercancel", stop);

    var ctl = mk("div", "viz-ctl");
    function go(x, y) {
      rotX = x; rotY = y;
      cube.style.transition = "transform .45s cubic-bezier(.2,.8,.3,1)";
      apply();
    }
    ctl.appendChild(btn("复位", function () { go(-20, -32); }));
    ctl.appendChild(btn("看正面", function () { go(0, 0); }));
    ctl.appendChild(btn("看上面", function () { go(-89, 0); }));
    ctl.appendChild(btn("看右面", function () { go(0, -90); }));
    wrap.appendChild(ctl);

    /* 展开图：十字形，颜色与立体图一一对应 */
    var layout = { top: [1, 0], left: [0, 1], front: [1, 1], right: [2, 1], back: [3, 1], bottom: [1, 2] };
    var cells = 62, pad = 10;
    var svg = '<svg class="cube-net" viewBox="0 0 ' + (4 * cells + pad * 2) + " " + (3 * cells + pad * 2) + '" role="img" aria-label="正方体展开图">';
    faces.forEach(function (f) {
      var p = layout[f.k];
      var x = pad + p[0] * cells, y = pad + p[1] * cells;
      svg += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (cells - 4) + '" height="' + (cells - 4) + '" rx="7" fill="' + f.c + '" opacity=".92"/>';
      svg += '<text x="' + (x + cells / 2) + '" y="' + (y + cells / 2 + 1) + '" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="17" font-weight="700">' + f.t + "</text>";
    });
    svg += "</svg>";
    var net = mk("div", "cube-net-wrap", svg + '<p class="viz-note">展开图：相对的面（上—下、前—后、左—右）永远不会相邻。</p>');
    wrap.appendChild(net);
    host.appendChild(wrap);
    apply();
    return { dispose: function () {} };
  }

  /* =========================================================
     3. 函数图象
     ========================================================= */
  function fnViz(host, opts) {
    opts = opts || {};
    var type = opts.type || "linear";
    var box = mk("div", "viz-body");
    host.appendChild(box);
    var tabs = mk("div", "viz-tabs");
    var ctl = mk("div", "viz-ctl-col");
    var read = mk("div", "viz-read");
    var c = makeCanvas(box, 300);

    var state = { k: 2, b: -1, a: 1, bb: 0, cc: -3, kk: 4 };
    var sliders = {};

    function draw() {
      var ctx = c.ctx, w = c.w, h = c.h, P = pal();
      ctx.clearRect(0, 0, w, h);
      var pad = 28;
      var xr = [-6, 6], yr = [-8, 8];
      var X = function (x) { return pad + ((x - xr[0]) / (xr[1] - xr[0])) * (w - pad * 2); };
      var Y = function (y) { return h - pad - ((y - yr[0]) / (yr[1] - yr[0])) * (h - pad * 2); };

      /* 网格 */
      for (var gx = -6; gx <= 6; gx++) seg(ctx, X(gx), Y(yr[0]), X(gx), Y(yr[1]), P.line, 1);
      for (var gy = -8; gy <= 8; gy += 2) seg(ctx, X(xr[0]), Y(gy), X(xr[1]), Y(gy), P.line, 1);
      /* 轴 */
      seg(ctx, X(xr[0]), Y(0), X(xr[1]), Y(0), P.muted, 1.4);
      seg(ctx, X(0), Y(yr[0]), X(0), Y(yr[1]), P.muted, 1.4);
      label(ctx, "O", X(0) - 8, Y(0) + 10, P.muted, "center", 11);
      for (var t = -6; t <= 6; t += 2) if (t) label(ctx, String(t), X(t), Y(0) + 12, P.muted, "center", 10);
      for (var t2 = -8; t2 <= 8; t2 += 4) if (t2) label(ctx, String(t2), X(0) - 12, Y(t2), P.muted, "center", 10);

      ctx.save();
      ctx.beginPath();
      ctx.rect(X(xr[0]), Y(yr[1]), X(xr[1]) - X(xr[0]), Y(yr[0]) - Y(yr[1]));
      ctx.clip();
      ctx.beginPath();
      var first = true;
      for (var px = 0; px <= w; px += 1) {
        var x = xr[0] + (px / w) * (xr[1] - xr[0]);
        var y;
        if (type === "linear") y = state.k * x + state.b;
        else if (type === "quad") y = state.a * x * x + state.bb * x + state.cc;
        else y = state.kk / x;
        if (!isFinite(y) || Math.abs(y) > 40) { first = true; continue; }
        if (first) { ctx.moveTo(X(x), Y(y)); first = false; }
        else ctx.lineTo(X(x), Y(y));
      }
      ctx.strokeStyle = P.brand;
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.restore();

      var eq = "";
      if (type === "linear") {
        eq = "y = " + (state.k === 0 ? "" : fmtCoef(state.k) + "x") + (state.b === 0 ? (state.k === 0 ? "0" : "") : (state.b > 0 ? " + " + fmt(state.b) : " - " + fmt(-state.b)));
        if (state.k === 0 && state.b === 0) eq = "y = 0";
        dot(ctx, X(0), Y(state.b), 4, P.warn, P.bg);
        label(ctx, "(0, " + fmt(state.b) + ")", X(0) + 12, Y(state.b) + 18, P.warn, "left", 11);
        read.textContent = eq + "　·　k " + (state.k > 0 ? "> 0，直线向右上方倾斜" : state.k < 0 ? "< 0，直线向右下方倾斜" : "= 0，直线水平") + "；b 是与 y 轴交点的纵坐标。";
      } else if (type === "quad") {
        var a = state.a, b = state.bb, cc = state.cc;
        var vx = a === 0 ? 0 : -b / (2 * a);
        var vy = a * vx * vx + b * vx + cc;
        eq = "y = " + (a === 1 ? "" : a === -1 ? "-" : fmt(a)) + "x²" + (b ? (b > 0 ? " + " + fmt(b) : " - " + fmt(-b)) + "x" : "") + (cc ? (cc > 0 ? " + " + fmt(cc) : " - " + fmt(-cc)) : "");
        seg(ctx, X(vx), Y(yr[0]), X(vx), Y(yr[1]), "rgba(232,137,12,.4)", 1.6, [5, 5]);
        dot(ctx, X(vx), Y(vy), 4.5, P.warn, P.bg);
        label(ctx, "顶点 (" + fmt(vx) + ", " + fmt(vy) + ")", clamp(X(vx) + 6, 20, w - 90), Y(vy) - 14, P.warn, "left", 11, true);
        read.textContent = eq + "　·　开口" + (a > 0 ? "向上" : a < 0 ? "向下" : "？") + "　·　对称轴 x = " + fmt(vx) + "　·　顶点 (" + fmt(vx) + ", " + fmt(vy) + ")";
      } else {
        eq = "y = " + fmt(state.kk) + " / x";
        read.textContent = eq + "　·　当 k > 0 时图象在第一、三象限；k < 0 时在第二、四象限；x 不能为 0。";
      }
    }

    function build() {
      ctl.innerHTML = "";
      sliders = {};
      if (type === "linear") {
        sliders.k = slider(ctl, "k", -4, 4, 0.5, state.k, function (v) { state.k = v; draw(); });
        sliders.b = slider(ctl, "b", -6, 6, 0.5, state.b, function (v) { state.b = v; draw(); });
      } else if (type === "quad") {
        sliders.a = slider(ctl, "a", -2, 2, 0.25, state.a, function (v) { state.a = v; draw(); });
        sliders.b = slider(ctl, "b", -6, 6, 1, state.bb, function (v) { state.bb = v; draw(); });
        sliders.c = slider(ctl, "c", -8, 8, 1, state.cc, function (v) { state.cc = v; draw(); });
      } else {
        sliders.k = slider(ctl, "k", -8, 8, 1, state.kk, function (v) { state.kk = v === 0 ? 1 : v; draw(); });
      }
      draw();
    }

    [["一次函数", "linear"], ["二次函数", "quad"], ["反比例函数", "inv"]].forEach(function (t) {
      var b = btn(t[0], function () {
        type = t[1];
        Array.prototype.forEach.call(tabs.children, function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        build();
      });
      if (t[1] === type) b.classList.add("on");
      tabs.appendChild(b);
    });
    tabs.className = "viz-tabs viz-tabs-fn";
    box.appendChild(tabs);
    box.appendChild(ctl);
    box.appendChild(read);

    c.fit(); build();
    var r = ro(host, function () { c.fit(); draw(); });
    return { dispose: function () { r.disconnect(); } };
  }

  /* =========================================================
     4. 三视图（可点格子加高）
     ========================================================= */
  function viewsViz(host) {
    var box = mk("div", "viz-body views-wrap");
    var left = mk("div", "views-3d");
    box.appendChild(left);
    var c = makeCanvas(left, 260);
    var right = mk("div", "views-grids");
    box.appendChild(right);
    var ctl = mk("div", "viz-ctl");
    var read = mk("div", "viz-read");
    var h = [[1, 1, 0], [2, 1, 1], [0, 1, 1]]; /* h[前后][左右]，0-3 层 */

    function draw3d() {
      var ctx = c.ctx, w = c.w, P = pal();
      ctx.clearRect(0, 0, w, c.h);
      var cx = w / 2, cy = 84;
      function cellPos(r, cc) { return { x: cx + (cc - r) * 26, y: cy + (cc + r) * 13 }; }
      for (var sum = 0; sum <= 4; sum++) {
        for (var r = 0; r < 3; r++) {
          var cc = sum - r;
          if (cc < 0 || cc > 3) continue;
          if (cc > 2) continue;
          for (var lv = 0; lv < h[r][cc]; lv++) {
            var p = cellPos(r, cc);
            drawCube(ctx, p.x, p.y, lv, P);
          }
        }
      }
      function drawCube(ctx, bx, by, lv, P) {
        var topY = by - lv * 26 - 26;
        var top = [[bx, topY - 12], [bx + 26, topY], [bx, topY + 12], [bx - 26, topY]];
        var leftF = [[bx - 26, topY], [bx, topY + 12], [bx, topY + 38], [bx - 26, topY + 26]];
        var rightF = [[bx + 26, topY], [bx, topY + 12], [bx, topY + 38], [bx + 26, topY + 26]];
        function poly(pts, fill, stroke) {
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
          ctx.closePath();
          ctx.fillStyle = fill; ctx.fill();
          ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();
        }
        poly(leftF, "#8FB4F7", "#6E93D6");
        poly(rightF, "#6E93D6", "#5478B8");
        poly(top, "#B9D0FB", "#8FB4F7");
      }
    }

    function pips(n, max, cls) {
      var s = '<div class="vv-grid ' + (cls || "") + '">';
      for (var i = max - 1; i >= 0; i--) {
        s += '<i class="vv-cell' + (i < n ? " on" : "") + '"></i>';
      }
      return s + "</div>";
    }

    function drawViews() {
      var front = [0, 1, 2].map(function (cc) { return Math.max(h[0][cc], h[1][cc], h[2][cc]); });
      var side = [0, 1, 2].map(function (r) { return Math.max(h[r][0], h[r][1], h[r][2]); });
      var total = 0;
      h.forEach(function (row) { row.forEach(function (v) { total += v; }); });

      var frontHtml = front.map(function (n) { return pips(n, 3, "front"); }).join("");
      var sideHtml = side.map(function (n) { return pips(n, 3, "side"); }).join("");
      var topHtml = "";
      for (var r = 0; r < 3; r++) {
        topHtml += '<div class="vv-row">';
        for (var cc = 0; cc < 3; cc++) {
          topHtml += '<button class="vv-top' + (h[r][cc] ? " on" : "") + '" data-r="' + r + '" data-c="' + cc + '">' + h[r][cc] + "</button>";
        }
        topHtml += "</div>";
      }
      right.innerHTML =
        '<div class="vv-block"><h5>主视图（从前面看）</h5><div class="vv-front">' + frontHtml + "</div></div>" +
        '<div class="vv-block"><h5>左视图（从左面看）</h5><div class="vv-front">' + sideHtml + "</div></div>" +
        '<div class="vv-block"><h5>俯视图（点格子加高）</h5><div class="vv-top-grid">' + topHtml + "</div></div>";
      Array.prototype.forEach.call(right.querySelectorAll(".vv-top"), function (b) {
        b.addEventListener("click", function () {
          var r = Number(b.dataset.r), cc = Number(b.dataset.c);
          h[r][cc] = (h[r][cc] + 1) % 4;
          draw3d(); drawViews();
        });
      });
      read.textContent = "共 " + total + " 个小正方体　·　主视图 " + front.join("、") + " 层　·　点俯视图的格子可以加高/清空，看三个视图怎么变。";
    }

    ctl.appendChild(btn("清空", function () { h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; draw3d(); drawViews(); }));
    ctl.appendChild(btn("示例", function () { h = [[1, 1, 0], [2, 1, 1], [0, 1, 1]]; draw3d(); drawViews(); }));
    box.appendChild(ctl);
    box.appendChild(read);
    host.appendChild(box);

    c.fit(); draw3d(); drawViews();
    var r = ro(host, function () { c.fit(); draw3d(); });
    return { dispose: function () { r.disconnect(); } };
  }

  /* =========================================================
     5. 圆
     ========================================================= */
  function circleViz(host) {
    var box = mk("div", "viz-body");
    host.appendChild(box);
    var c = makeCanvas(box, 300);
    var tabs = mk("div", "viz-tabs");
    var ctl = mk("div", "viz-ctl");
    var read = mk("div", "viz-read");
    var mode = "arc", r = 3, ang = 60, pAng = 100;
    var sl = null;

    function geom() {
      var cx = c.w / 2, cy = 150;
      var R = 46 + r * 15;
      return { cx: cx, cy: cy, R: Math.min(R, Math.min(c.w, 300) / 2 - 26) };
    }

    function draw() {
      var ctx = c.ctx, w = c.w, P = pal();
      ctx.clearRect(0, 0, w, c.h);
      var g = geom();
      ctx.beginPath();
      ctx.arc(g.cx, g.cy, g.R, 0, Math.PI * 2);
      ctx.strokeStyle = P.line;
      ctx.lineWidth = 2;
      ctx.stroke();
      var A = { x: g.cx + g.R * Math.cos(-ang * Math.PI / 180), y: g.cy + g.R * Math.sin(-ang * Math.PI / 180) };

      if (mode === "arc") {
        ctx.beginPath();
        ctx.arc(g.cx, g.cy, g.R, 0, -ang * Math.PI / 180, true);
        ctx.strokeStyle = P.brand;
        ctx.lineWidth = 6;
        ctx.stroke();
        seg(ctx, g.cx, g.cy, A.x, A.y, P.brand, 2);
        seg(ctx, g.cx, g.cy, g.cx + g.R, g.cy, P.muted, 1.4, [4, 3]);
        dot(ctx, g.cx, g.cy, 3.5, P.ink);
        dot(ctx, A.x, A.y, 7, P.brand, P.bg);
        ctx.beginPath();
        ctx.arc(g.cx, g.cy, 30, 0, -ang * Math.PI / 180, true);
        ctx.strokeStyle = P.warn;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        label(ctx, ang + "°", g.cx + 40 * Math.cos(-ang * Math.PI / 360), g.cy + 40 * Math.sin(-ang * Math.PI / 360), P.warn, "center", 11, true);
        var arcLen = Math.PI * r * ang / 180;
        var area = Math.PI * r * r * ang / 360;
        var chord = 2 * r * Math.sin(ang * Math.PI / 360);
        read.textContent = "半径 r = " + fmt(r) + "　·　圆心角 θ = " + ang + "°　·　弧长 = " + fmt(arcLen) + "　·　扇形面积 = " + fmt(area) + "　·　弦长 = " + fmt(chord);
      } else {
        var aA = 200, aB = 340;
        var PA = { x: g.cx + g.R * Math.cos(-aA * Math.PI / 180), y: g.cy + g.R * Math.sin(-aA * Math.PI / 180) };
        var PB = { x: g.cx + g.R * Math.cos(-aB * Math.PI / 180), y: g.cy + g.R * Math.sin(-aB * Math.PI / 180) };
        var PP = { x: g.cx + g.R * Math.cos(-pAng * Math.PI / 180), y: g.cy + g.R * Math.sin(-pAng * Math.PI / 180) };
        seg(ctx, PA.x, PA.y, PB.x, PB.y, P.line, 3);
        seg(ctx, g.cx, g.cy, PA.x, PA.y, P.warn, 2);
        seg(ctx, g.cx, g.cy, PB.x, PB.y, P.warn, 2);
        seg(ctx, PP.x, PP.y, PA.x, PA.y, P.brand, 2);
        seg(ctx, PP.x, PP.y, PB.x, PB.y, P.brand, 2);
        [PA, PB].forEach(function (p) { dot(ctx, p.x, p.y, 5, P.warn, P.bg); });
        dot(ctx, PP.x, PP.y, 7, P.brand, P.bg);
        dot(ctx, g.cx, g.cy, 3.5, P.ink);
        label(ctx, "A", PA.x + 10, PA.y - 8, P.warn, "center", 12, true);
        label(ctx, "B", PB.x + 10, PB.y + 10, P.warn, "center", 12, true);
        label(ctx, "P", PP.x, PP.y - 14, P.brand, "center", 12, true);
        label(ctx, "O", g.cx - 10, g.cy + 12, P.ink, "center", 12, true);
        read.textContent = "圆心角 ∠AOB = 140°　·　圆周角 ∠APB = " + (140 / 2) + "°　·　拖动 P：圆周角总等于圆心角的一半";
      }
    }

    [["弧长与扇形", "arc"], ["圆周角定理", "inscribed"]].forEach(function (t) {
      var b = btn(t[0], function () {
        mode = t[1];
        Array.prototype.forEach.call(tabs.children, function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        ctl.style.display = mode === "arc" ? "flex" : "none";
        draw();
      });
      if (t[1] === mode) b.classList.add("on");
      tabs.appendChild(b);
    });
    tabs.className = "viz-tabs";
    box.appendChild(tabs);
    sl = slider(ctl, "半径 r", 1, 5, 1, r, function (v) { r = v; draw(); });
    box.appendChild(ctl);
    box.appendChild(read);

    var drag = pointerDrag(c.canvas, function (p) { move(p); }, function (p) { move(p); });
    function move(p) {
      var g = geom();
      var dx = p.x - g.cx, dy = g.cy - p.y;
      var a = Math.atan2(dy, dx) * 180 / Math.PI;
      if (a < 0) a += 360;
      if (mode === "arc") {
        ang = Math.round(a);
        if (ang > 359) ang = 359;
      } else {
        /* P 只在优弧上（避开 A、B 附近） */
        pAng = Math.round(a);
        if (pAng > 20 && pAng < 160) pAng = pAng < 90 ? 20 : 160;
      }
      draw();
    }

    c.fit(); draw();
    var r2 = ro(host, function () { c.fit(); draw(); });
    return { dispose: function () { drag.dispose(); r2.disconnect(); } };
  }

  /* =========================================================
     6. 旋转
     ========================================================= */
  function rotationViz(host) {
    var box = mk("div", "viz-body");
    host.appendChild(box);
    var c = makeCanvas(box, 300);
    var ctl = mk("div", "viz-ctl");
    var read = mk("div", "viz-read");
    var ang = 90;
    var tri = [[1, 1], [4, 1], [1, 3]];
    var names = ["A", "B", "C"];

    function draw() {
      var ctx = c.ctx, w = c.w, h = c.h, P = pal();
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2, s = 26;
      var X = function (x) { return cx + x * s; };
      var Y = function (y) { return cy - y * s; };

      for (var i = -5; i <= 5; i++) {
        seg(ctx, X(i), Y(-5.4), X(i), Y(5.4), P.line, 1);
        seg(ctx, X(-5.6), Y(i), X(5.6), Y(i), P.line, 1);
      }
      seg(ctx, X(-5.6), Y(0), X(5.6), Y(0), P.muted, 1.3);
      seg(ctx, X(0), Y(-5.4), X(0), Y(5.4), P.muted, 1.3);

      function path(points, col, dash, fill) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(X(points[0][0]), Y(points[0][1]));
        for (var i = 1; i < points.length; i++) ctx.lineTo(X(points[i][0]), Y(points[i][1]));
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        if (dash) ctx.setLineDash(dash);
        ctx.stroke();
        ctx.restore();
      }

      path(tri, P.muted, [5, 4]);
      var rad = ang * Math.PI / 180;
      var rot = tri.map(function (p) {
        return [p[0] * Math.cos(rad) - p[1] * Math.sin(rad), p[0] * Math.sin(rad) + p[1] * Math.cos(rad)];
      });
      path(rot, P.brand, null, "rgba(47,107,255,.10)");

      var mx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
      var my = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      var rmx = (rot[0][0] + rot[1][0] + rot[2][0]) / 3;
      var rmy = (rot[0][1] + rot[1][1] + rot[2][1]) / 3;
      function pushOut(px, py, mx0, my0, d) {
        var dx = px - mx0, dy = py - my0;
        var L = Math.sqrt(dx * dx + dy * dy) || 1;
        return { x: dx / L * d, y: -dy / L * d };
      }

      tri.forEach(function (p, i) {
        dot(ctx, X(p[0]), Y(p[1]), 4, P.muted, P.bg);
        var o1 = pushOut(p[0], p[1], mx, my, 16);
        labelHalo(ctx, names[i], X(p[0]) + o1.x, Y(p[1]) + o1.y, P.muted, P.bg, "center", 12);
        seg(ctx, X(0), Y(0), X(p[0]), Y(p[1]), "rgba(121,128,142,.5)", 1, [3, 3]);
        var q = rot[i];
        seg(ctx, X(0), Y(0), X(q[0]), Y(q[1]), "rgba(47,107,255,.45)", 1, [3, 3]);
        dot(ctx, X(q[0]), Y(q[1]), 5, P.brand, P.bg);
        var o2 = pushOut(q[0], q[1], rmx, rmy, 17);
        labelHalo(ctx, names[i] + "'", X(q[0]) + o2.x, Y(q[1]) + o2.y, P.brand, P.bg, "center", 12);
      });
      dot(ctx, X(0), Y(0), 4, P.ink);
      labelHalo(ctx, "O", X(0) - 14, Y(0) + 14, P.ink, P.bg, "center", 12);

      read.textContent = "旋转角 " + ang + "°　·　A(" + fmt(tri[0][0]) + ", " + fmt(tri[0][1]) + ") → A'(" + fmt(rot[0][0]) + ", " + fmt(rot[0][1]) + ")　·　对应点到旋转中心 O 的距离不变。";
    }

    [90, 180, 270].forEach(function (a) {
      ctl.appendChild(btn(a + "°", function () {
        ang = a;
        sl.set(a);
        draw();
      }));
    });
    var sl = slider(ctl, "旋转角", 0, 360, 5, ang, function (v) { ang = v; draw(); });
    box.appendChild(ctl);
    box.appendChild(read);
    host.appendChild(box);

    c.fit(); draw();
    var r = ro(host, function () { c.fit(); draw(); });
    return { dispose: function () { r.disconnect(); } };
  }

  /* =========================================================
     7. 光的折射（物理）
     ========================================================= */
  function refractionViz(host) {
    var box = mk("div", "viz-body");
    host.appendChild(box);
    var c = makeCanvas(box, 300);
    var read = mk("div", "viz-read");
    var ang = 40;

    function draw() {
      var ctx = c.ctx, w = c.w, h = c.h, P = pal();
      ctx.clearRect(0, 0, w, h);
      var ox = w / 2, oy = h * 0.46;
      var L = Math.min(w, h) * 0.42;

      /* 水面以下 */
      ctx.fillStyle = "rgba(64,164,223,.13)";
      ctx.fillRect(0, oy, w, h - oy);
      seg(ctx, 0, oy, w, oy, "rgba(64,164,223,.65)", 2);
      label(ctx, "空气", 26, oy - 16, P.muted, "left", 11);
      label(ctx, "水", 26, oy + 20, P.muted, "left", 11);

      seg(ctx, ox, 16, ox, h - 16, "rgba(120,128,142,.55)", 1.2, [4, 4]);
      label(ctx, "法线", ox + 6, 22, P.muted, "left", 10);

      var a = ang * Math.PI / 180;
      var r = Math.asin(Math.sin(a) / 1.33);

      /* 入射光线（从左上射向 O） */
      var ax = ox - L * Math.sin(a), ay = oy - L * Math.cos(a);
      seg(ctx, ax, ay, ox, oy, P.warn, 2.2);
      dot(ctx, ax, ay, 6, P.warn, P.bg);
      label(ctx, "入射光", ax - 4, ay - 12, P.warn, "center", 11, true);

      /* 折射光线 */
      var bx = ox + L * Math.sin(r), by = oy + L * Math.cos(r);
      seg(ctx, ox, oy, bx, by, P.brand, 2.2);
      dot(ctx, bx, by, 5, P.brand, P.bg);

      /* 反射光线（弱） */
      seg(ctx, ox, oy, ox + L * Math.sin(a), oy - L * Math.cos(a), "rgba(232,137,12,.35)", 1.6, [5, 4]);

      /* 角弧 */
      ctx.beginPath();
      ctx.arc(ox, oy, 46, -Math.PI / 2, -Math.PI / 2 - a, true);
      ctx.strokeStyle = P.warn; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.beginPath();
      ctx.arc(ox, oy, 60, Math.PI / 2, Math.PI / 2 - r, true);
      ctx.strokeStyle = P.brand; ctx.lineWidth = 1.6; ctx.stroke();

      label(ctx, "θ=" + Math.round(ang) + "°", ox - 56 * Math.sin(a / 2) - 16, oy - 56 * Math.cos(a / 2), P.warn, "center", 11, true);
      label(ctx, "r=" + Math.round(r * 180 / Math.PI) + "°", ox + 70 * Math.sin(r / 2) + 16, oy + 70 * Math.cos(r / 2), P.brand, "center", 11, true);

      read.textContent = "入射角 θ = " + Math.round(ang) + "°　·　折射角 r = " + Math.round(r * 180 / Math.PI) +
        "°　·　光从空气斜射入水中，折射角小于入射角；θ 越大，r 也越大但增长得慢。拖动黄色光点试试。";
    }

    var drag = pointerDrag(c.canvas, function (p) { move(p); }, function (p) { move(p); });
    function move(p) {
      var ox = c.w / 2, oy = c.h * 0.46;
      var dx = Math.abs(p.x - ox), dy = Math.max(8, oy - p.y);
      ang = Math.max(5, Math.min(82, Math.atan2(dx, dy) * 180 / Math.PI));
      draw();
    }

    box.appendChild(read);
    host.appendChild(box);
    c.fit(); draw();
    var r = ro(host, function () { c.fit(); draw(); });
    return { dispose: function () { drag.dispose(); r.disconnect(); } };
  }

  /* =========================================================
     8. 地球公转与四季（地理）
     ========================================================= */
  function seasonsViz(host) {
    var box = mk("div", "viz-body");
    host.appendChild(box);
    var c = makeCanvas(box, 280);
    var ctl = mk("div", "viz-ctl");
    var read = mk("div", "viz-read");
    var t = 90; /* 0 春分, 90 夏至, 180 秋分, 270 冬至 */

    function draw() {
      var ctx = c.ctx, w = c.w, h = c.h, P = pal();
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2, rx = Math.min(w * 0.36, 150), ry = Math.min(h * 0.3, 78);

      /* 轨道 */
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120,128,142,.35)";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.setLineDash([]);

      /* 太阳 */
      var g = ctx.createRadialGradient(cx, cy, 4, cx, cy, 26);
      g.addColorStop(0, "#FFD666");
      g.addColorStop(1, "rgba(255,214,102,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill();
      dot(ctx, cx, cy, 9, "#F6C445");
      label(ctx, "太阳", cx, cy + 26, P.muted, "center", 10);

      /* 四个节气位置 */
      var marks = [[0, "春分"], [90, "夏至"], [180, "秋分"], [270, "冬至"]];
      marks.forEach(function (m) {
        var a = m[0] * Math.PI / 180;
        var x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
        dot(ctx, x, y, 2.5, "rgba(120,128,142,.5)");
        var dx = x - cx, dy = y - cy, lx, ly, la;
        if (Math.abs(dx) < 22) { lx = x; ly = y + (dy > 0 ? 28 : -20); la = "center"; }
        else { lx = x + (dx > 0 ? 20 : -20); ly = y + 12; la = dx > 0 ? "left" : "right"; }
        label(ctx, m[1], lx, ly, P.muted, la, 10);
      });

      /* 地球 */
      var a2 = t * Math.PI / 180;
      var ex = cx + rx * Math.cos(a2), ey = cy + ry * Math.sin(a2);
      dot(ctx, ex, ey, 11, "#3E7BFA");
      /* 昼夜：朝向太阳的一半亮 */
      ctx.save();
      ctx.beginPath();
      ctx.arc(ex, ey, 11, 0, Math.PI * 2);
      ctx.clip();
      var ang2 = Math.atan2(cy - ey, cx - ex);
      ctx.beginPath();
      ctx.arc(ex, ey, 11, ang2 - Math.PI / 2, ang2 + Math.PI / 2);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.fill();
      ctx.restore();
      /* 地轴：方向固定、始终倾斜 */
      seg(ctx, ex - 14 * Math.cos(0.42), ey - 14 * Math.sin(0.42), ex + 14 * Math.cos(0.42), ey + 14 * Math.sin(0.42), "#6B4A2F", 2);
      label(ctx, "地轴", ex + 16, ey - 14, P.muted, "left", 9);

      var decl = 23.5 * Math.sin(a2);
      var seasonName = t === 90 ? "夏至" : t === 180 ? "秋分" : t === 270 ? "冬至" : t === 0 ? "春分"
        : (t > 0 && t < 90) ? "春季" : (t > 90 && t < 180) ? "夏季" : (t > 180 && t < 270) ? "秋季" : "冬季";
      var declText = Math.abs(decl) < 1 ? "赤道" : Math.abs(decl).toFixed(1) + "°" + (decl > 0 ? "N" : "S");
      read.textContent = "位置：" + seasonName + "　·　太阳直射点：" + declText +
        "　·　北半球" + (decl > 5 ? "昼长夜短" : decl < -5 ? "昼短夜长" : "昼夜平分") +
        "　·　地轴始终倾斜、指向不变，所以四季在变。";
    }

    ctl.appendChild(btn("春分", function () { t = 0; sl.set(0); draw(); }));
    ctl.appendChild(btn("夏至", function () { t = 90; sl.set(90); draw(); }));
    ctl.appendChild(btn("秋分", function () { t = 180; sl.set(180); draw(); }));
    ctl.appendChild(btn("冬至", function () { t = 270; sl.set(270); draw(); }));
    var sl = slider(ctl, "公转位置", 0, 359, 1, t, function (v) { t = v; draw(); });
    box.appendChild(ctl);
    box.appendChild(read);
    host.appendChild(box);

    var drag = pointerDrag(c.canvas, function (p) { move(p); }, function (p) { move(p); });
    function move(p) {
      var cx = c.w / 2, cy = c.h / 2;
      var a = Math.atan2(p.y - cy, p.x - cx) * 180 / Math.PI;
      t = Math.round((a + 360) % 360);
      sl.set(t);
      draw();
    }

    c.fit(); draw();
    var r = ro(host, function () { c.fit(); draw(); });
    return { dispose: function () { drag.dispose(); r.disconnect(); } };
  }

  /* ========================================================= */
  var REG = {
    numberline: { name: "数轴", hint: "在数轴上拖动圆点：向右是正数、向左是负数；离原点越远，绝对值越大。", mount: numberline },
    cube: { name: "正方体", hint: "转一转正方体，看看哪些面相对；展开图里相对的面永远不会相邻。", mount: cubeViz },
    function: { name: "函数图象", hint: "拖 k、b（或 a、b、c）看图象怎么动：k 决定倾斜方向，b 是与 y 轴的交点。", mount: fnViz },
    views: { name: "三视图", hint: "点俯视图的格子给小正方体加高，再对照主视图、左视图看高度怎么变。", mount: viewsViz },
    circle: { name: "圆", hint: "拖圆上的点改变圆心角：弧长、扇形面积随角度按比例变；切到「圆周角定理」看一半关系。", mount: circleViz },
    rotation: { name: "旋转", hint: "把角度拖到 90°、180°：对应点到旋转中心的距离始终相等，图形形状大小不变。", mount: rotationViz },
    refraction: { name: "光的折射", hint: "拖动黄色光点改变入射角：光从空气斜射入水中，折射角总是小于入射角。", mount: refractionViz },
    seasons: { name: "地球公转", hint: "沿着轨道拖动地球：地轴方向不变但始终倾斜，太阳直射点在南北回归线之间移动，就有了四季。", mount: seasonsViz }
  };

  function mountOne(el) {
    var key = el.getAttribute("data-viz");
    var def = REG[key];
    if (!def || el.dataset.mounted) return;
    el.dataset.mounted = "1";
    var showHead = el.getAttribute("data-head") !== "0";
    if (showHead) {
      var head = mk("div", "viz-head");
      head.appendChild(mk("b", "viz-title", def.name + " · 动手试试"));
      head.appendChild(mk("span", "viz-tip", "拖动 / 点按都能互动"));
      el.appendChild(head);
    }
    try {
      var api = def.mount(el);
      items.push({ el: el, api: api });
    } catch (e) {
      el.appendChild(mk("p", "viz-note", "这个图形没能加载：" + e.message));
      if (global.console) console.warn("viz error", key, e);
    }
  }

  function mountAll(root) {
    (root || document).querySelectorAll("[data-viz]").forEach(mountOne);
  }
  function disposeAll(root) {
    items = items.filter(function (it) {
      if (root && !root.contains(it.el)) return true;
      try { it.api.dispose && it.api.dispose(); } catch (e) {}
      return false;
    });
  }

  global.Viz = {
    mountAll: mountAll,
    disposeAll: disposeAll,
    has: function (k) { return !!REG[k]; },
    name: function (k) { return REG[k] ? REG[k].name : ""; },
    hint: function (k) { return REG[k] ? REG[k].hint : ""; },
    registry: REG
  };
})(window);
