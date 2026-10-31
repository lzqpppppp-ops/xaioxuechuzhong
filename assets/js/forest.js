/* ===========================================================
   forest.js — 成长林：每章一棵树，掌握一个知识点长一片叶
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U;

  var SEASONS = {
    spring: { name: "春天", icon: "🌸", accent: "#F48FB1", ground: "#E7F3DF", ground2: "#D6EBCB", sky: "#F3FAF7", particle: "petal", tip: "春天发芽：学一个知识点，枝头就多一片新叶。" },
    summer: { name: "夏天", icon: "☀️", accent: "#F0B429", ground: "#DFEFCF", ground2: "#CAE6B5", sky: "#F1FAF2", particle: "pollen", tip: "夏天枝繁叶茂：已经长出的叶子不会掉，继续加叶子。" },
    autumn: { name: "秋天", icon: "🍂", accent: "#DE8A2E", ground: "#F6EBD8", ground2: "#EEDFC2", sky: "#FFF8ED", particle: "leaf", tip: "秋天结果：整章掌握后，树上会挂金果。" },
    winter: { name: "冬天", icon: "❄️", accent: "#7FB3D5", ground: "#EDF4F8", ground2: "#DCE8F0", sky: "#F6FAFD", particle: "snow", tip: "冬天休眠：树上的叶子都还在，春天继续长。" }
  };

  function season(pref) {
    if (pref && pref !== "auto" && SEASONS[pref]) return pref;
    var m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5) return "spring";
    if (m >= 6 && m <= 8) return "summer";
    if (m >= 9 && m <= 11) return "autumn";
    return "winter";
  }

  function speciesOf(key) {
    var names = ["round", "pine", "willow", "blossom"];
    return names[U.hashStr(key) % names.length];
  }

  /* ---------- 树的各个部件 ---------- */
  var TRUNK = "#8A5A3B";
  var TRUNK_D = "#6E452C";

  function shadow() {
    return '<ellipse cx="60" cy="150" rx="30" ry="6" fill="rgba(60,45,30,.13)"/>';
  }

  function trunk(w) {
    var hw = (w || 6) / 2;
    return '<path d="M' + (60 - hw) + ' 150 C' + (60 - hw + 1) + ' 130 ' + (60 - hw + 1) + ' 112 ' + (60 - hw + 2) + ' 98 L' + (60 + hw - 2) + ' 98 C' + (60 + hw - 1) + ' 112 ' + (60 + hw - 1) + ' 130 ' + (60 + hw) + ' 150 Z" fill="' + TRUNK + '"/>' +
      '<path d="M60 122 C54 114 48 108 42 102" stroke="' + TRUNK_D + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M60 116 C67 108 72 104 78 99" stroke="' + TRUNK_D + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
  }

  function cluster(cx, cy, r, color, mode) {
    if (mode === "none") {
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="rgba(255,255,255,.28)" stroke="rgba(90,80,60,.22)" stroke-width="1.3" stroke-dasharray="3 4"/>';
    }
    if (mode === "bud") {
      /* 学过但还没掌握：浅一点的嫩叶 */
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.9) + '" fill="' + color + '" opacity=".55" stroke="' + color + '" stroke-width="1" stroke-opacity=".35"/>' +
        '<circle cx="' + (cx - r * .25) + '" cy="' + (cy - r * .3) + '" r="' + (r * .3) + '" fill="rgba(255,255,255,.4)"/>';
    }
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color + '" opacity=".92"/>' +
      '<circle cx="' + (cx - r * .3) + '" cy="' + (cy - r * .35) + '" r="' + (r * .42) + '" fill="rgba(255,255,255,.22)"/>';
  }

  function fruits(color) {
    var pts = [[46, 66], [72, 60], [60, 82]];
    return pts.map(function (p) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4.2" fill="#F2B01E" stroke="#C98A12" stroke-width="1"/>' +
        '<path d="M' + p[0] + ' ' + (p[1] - 4) + ' q2 -3 4 -3" stroke="#4E8A3C" stroke-width="1.6" fill="none"/>';
    }).join("");
  }

  function snowCap() {
    return '<path d="M34 52 q26 -16 52 0 q-26 -6 -52 0" fill="rgba(255,255,255,.85)"/>' +
      '<circle cx="44" cy="62" r="2.4" fill="#fff"/><circle cx="76" cy="60" r="2.2" fill="#fff"/>';
  }

  function sprout(color, species) {
    var extra = "";
    if (species === "pine") {
      extra = '<path d="M60 128 L51 142 L69 142 Z" fill="' + color + '" opacity=".85"/>';
    } else if (species === "blossom") {
      extra = '<circle cx="60" cy="126" r="4.6" fill="#F7A8C4"/><circle cx="60" cy="126" r="2" fill="#FFF1F5"/>';
    } else if (species === "willow") {
      extra = '<path d="M60 132 q-12 4 -16 14" stroke="' + color + '" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>';
    }
    return '<ellipse cx="60" cy="150" rx="15" ry="3.6" fill="rgba(120,90,60,.32)"/>' +
      '<path d="M60 150 C59 137 59 128 60 117" stroke="#6E9B4E" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M60 129 q-15 -2 -18 -14 q15 0 18 14" fill="' + color + '" opacity=".9"/>' +
      '<path d="M60 134 q15 -3 18 -15 q-16 -1 -18 15" fill="' + color + '" opacity=".72"/>' +
      '<path d="M60 121 q-9 -4 -11 -12 q10 1 11 12" fill="' + color + '" opacity=".55"/>' + extra;
  }

  /* 还没开始的树：用虚线画出「将要长成的样子」 */
  function blueprint() {
    return '<circle cx="60" cy="58" r="27" fill="rgba(255,255,255,.35)" stroke="rgba(120,110,90,.24)" stroke-width="1.8" stroke-dasharray="4 5"/>' +
      '<circle cx="42" cy="74" r="13" fill="none" stroke="rgba(120,110,90,.18)" stroke-width="1.5" stroke-dasharray="4 5"/>' +
      '<circle cx="79" cy="72" r="14" fill="none" stroke="rgba(120,110,90,.18)" stroke-width="1.5" stroke-dasharray="4 5"/>' +
      '<path d="M60 150 L60 92" stroke="rgba(120,110,90,.2)" stroke-width="2" stroke-dasharray="3 5"/>';
  }

  /* ---------- 单棵树 ----------
     叶子：学过一个知识点就长一片「嫩叶」（半透明），掌握度到 80% 变成「成叶」（饱和）；
     整章全部掌握才算成树。 */
  function treeSVG(ch, seasonKey, color) {
    var total = ch.total || 0;
    var learned = ch.learned != null ? ch.learned : ch.mastered;
    var mastered = ch.mastered;
    var growth = total ? Math.min(1, (mastered + 0.55 * (learned - mastered)) / total) : 0;
    var fullShare = total ? mastered / total : 0;
    var complete = total > 0 && mastered >= total;
    var species = speciesOf(ch.key);
    var body = "";
    var extra = "";

    if (growth <= 0) {
      body = blueprint() + sprout(color, species);
    } else if (species === "pine") {
      var tiers = [
        { y: 112, w: 34, h: 30 },
        { y: 88, w: 27, h: 28 },
        { y: 66, w: 20, h: 26 }
      ];
      var filledT = Math.max(1, Math.ceil(growth * tiers.length));
      var fullT = Math.floor(fullShare * tiers.length);
      body = '<rect x="57" y="118" width="6" height="32" fill="' + TRUNK + '"/>';
      tiers.forEach(function (t, i) {
        var mode = i >= filledT ? "none" : i < fullT ? "full" : "bud";
        body += '<path d="M60 ' + (t.y - t.h) + ' L' + (60 + t.w) + ' ' + t.y + ' L' + (60 - t.w) + ' ' + t.y + ' Z" fill="' +
          (mode === "none" ? "rgba(255,255,255,.25)" : color) + '" ' +
          (mode === "none" ? 'stroke="rgba(90,80,60,.25)" stroke-width="1.2" stroke-dasharray="3 4"'
            : 'opacity="' + (mode === "full" ? ".92" : ".45") + '"') + "/>";
      });
      if (complete) extra += fruits(color);
    } else if (species === "willow") {
      body = trunk(7);
      body += cluster(60, 62, 30, color, mastered > 0 ? "full" : "bud");
      var strands = [
        [36, 74, 30, 122], [46, 62, 40, 130], [60, 54, 60, 132], [74, 62, 80, 130], [84, 74, 90, 122]
      ];
      var filledS = Math.max(1, Math.ceil(growth * strands.length));
      var fullS = Math.floor(fullShare * strands.length);
      strands.forEach(function (s, i) {
        if (i >= filledS) return;
        var op = i < fullS ? ".78" : ".42";
        body += '<path d="M' + s[0] + ' ' + s[1] + ' Q' + ((s[0] + s[2]) / 2) + ' ' + (s[3] - 10) + ' ' + s[2] + ' ' + s[3] + '" stroke="' + color + '" stroke-width="2.5" fill="none" opacity="' + op + '" stroke-linecap="round"/>';
        for (var k = 1; k <= 3; k++) {
          var t = k / 4;
          var x = (1 - t) * (1 - t) * s[0] + 2 * (1 - t) * t * ((s[0] + s[2]) / 2) + t * t * s[2];
          var y = (1 - t) * (1 - t) * s[1] + 2 * (1 - t) * t * (s[3] - 10) + t * t * s[3];
          body += '<ellipse cx="' + x + '" cy="' + y + '" rx="3.4" ry="2" fill="' + color + '" opacity="' + (i < fullS ? .85 : .5) + '" transform="rotate(20 ' + x + ' ' + y + ')"/>';
        }
      });
    } else if (species === "blossom") {
      body = trunk(6);
      body += '<ellipse cx="60" cy="66" rx="25" ry="21" fill="' + color + '" opacity="' + (0.1 + 0.3 * growth) + '"/>';
      var cs = [[44, 74, 17], [74, 72, 18], [60, 54, 16], [38, 56, 11], [81, 55, 11]];
      var filledB = Math.max(1, Math.ceil(growth * cs.length));
      var fullB = Math.floor(fullShare * cs.length);
      cs.forEach(function (c, i) {
        body += cluster(c[0], c[1], c[2], color, i >= filledB ? "none" : i < fullB ? "full" : "bud");
      });
      if (complete) {
        extra += [[50, 66], [70, 62], [60, 80]].map(function (p) {
          return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#FFF1F5" stroke="#F0A6BE" stroke-width="1"/>';
        }).join("");
      }
    } else {
      body = trunk(7);
      body += '<ellipse cx="60" cy="68" rx="27" ry="23" fill="' + color + '" opacity="' + (0.1 + 0.3 * growth) + '"/>';
      var rc = [[45, 76, 19], [74, 73, 20], [60, 57, 18], [36, 61, 12], [83, 59, 12]];
      var filledR = Math.max(1, Math.ceil(growth * rc.length));
      var fullR = Math.floor(fullShare * rc.length);
      rc.forEach(function (c, i) {
        body += cluster(c[0], c[1], c[2], color, i >= filledR ? "none" : i < fullR ? "full" : "bud");
      });
      if (complete) extra += fruits(color);
    }

    if (seasonKey === "winter" && growth > 0) extra += snowCap();

    return '<svg class="tree-svg" viewBox="0 0 120 160" role="img" aria-label="' + U.escapeHtml(ch.subjectName + " " + ch.grade + " 年级") + '">' +
      shadow() + '<g class="sway">' + body + "</g>" + extra +
      (complete ? '<path d="M60 18 l3 7 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1z" fill="#F2B01E" opacity=".95"/>' : "") +
      "</svg>";
  }

  /* ---------- 章节 ---------- */
  function chapters() {
    var E = global.Engine;
    var out = [];
    E.subjectsWithContent().forEach(function (m) {
      var byGrade = {};
      E.pointsOf(m.key).forEach(function (p) { (byGrade[p.grade] = byGrade[p.grade] || []).push(p); });
      Object.keys(byGrade).map(Number).sort(function (a, b) { return a - b; }).forEach(function (g) {
        var list = byGrade[g];
        out.push({
          key: m.key + "-" + g, subject: m.key, subjectName: m.name, color: m.color,
          grade: g, points: list, total: list.length,
          learned: list.filter(function (p) { return E.isSeen(p.id); }).length,
          mastered: list.filter(function (p) { return E.isMastered(p.id); }).length,
          seen: list.filter(function (p) { return E.isSeen(p.id); }).length
        });
      });
    });
    return out;
  }

  function nearest(list) {
    var open = list.filter(function (c) { return c.mastered < c.total; });
    if (!open.length) return null;
    open.sort(function (a, b) {
      /* 已经开始长的树优先，其次离成树最近的，最后看学习过多少 */
      var sa = a.seen > 0 ? 0 : 1, sb = b.seen > 0 ? 0 : 1;
      if (sa !== sb) return sa - sb;
      var ra = a.total - a.mastered, rb = b.total - b.mastered;
      if (ra !== rb) return ra - rb;
      return b.seen - a.seen;
    });
    return open[0];
  }

  function summary(list) {
    var total = list.length;
    var done = list.filter(function (c) { return c.mastered >= c.total; }).length;
    var leaves = list.reduce(function (n, c) { return n + (c.learned || 0); }, 0);
    var all = list.reduce(function (n, c) { return n + c.total; }, 0);
    var mastered = list.reduce(function (n, c) { return n + c.mastered; }, 0);
    return { trees: total, done: done, leaves: leaves, totalLeaves: all, mastered: mastered };
  }

  /* ---------- 季节粒子（用形状而不是 emoji，渲染更干净） ---------- */
  function particles(seasonKey, n) {
    var out = "";
    for (var i = 0; i < (n || 14); i++) {
      var left = Math.round((i * 71 + 13) % 100);
      var delay = ((i * 37) % 90) / 10;
      var dur = 9 + ((i * 13) % 7);
      var size = 5 + ((i * 7) % 5);
      out += '<i class="sf sf-' + seasonKey + '" style="left:' + left + "%;animation-delay:-" + delay + "s;animation-duration:" + dur + "s;--sz:" + size + 'px"></i>';
    }
    return out;
  }

  global.Forest = {
    SEASONS: SEASONS, season: season, speciesOf: speciesOf,
    treeSVG: treeSVG, chapters: chapters, nearest: nearest, summary: summary, particles: particles
  };
})(window);
