/* ===========================================================
   ui.js — 复用组件
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U;

  function subject(key) { return (global.SUBJECT_MAP || {})[key] || { name: key, color: "#666", soft: "#eee", short: "?" }; }

  function subjectTag(key, extra) {
    var s = subject(key);
    return '<span class="tag subj" style="--c:' + s.color + ';--bg:' + s.soft + '"' + (extra || "") + '>' + U.escapeHtml(s.name) + "</span>";
  }

  function ring(pct, size, label) {
    var sz = size || 96;
    var r = 44;
    var c = 2 * Math.PI * r;
    var off = c * (1 - U.clamp(pct, 0, 100) / 100);
    return '<svg class="ring" viewBox="0 0 100 100" style="width:' + sz + "px;height:" + sz + 'px" aria-hidden="true">' +
      '<circle class="ring-bg" cx="50" cy="50" r="' + r + '"/>' +
      '<circle class="ring-fg" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      (label == null ? "" : '<text x="50" y="54" text-anchor="middle" class="ring-txt">' + label + "</text>") +
      "</svg>";
  }

  function bar(pct, color) {
    return '<div class="bar"><i style="width:' + U.clamp(pct, 0, 100) + "%;background:" + (color || "var(--brand)") + '"></i></div>';
  }

  function diffDots(n) {
    var out = '<span class="dots" title="难度 ' + n + '/5">';
    for (var i = 1; i <= 5; i++) out += '<i class="' + (i <= n ? "on" : "") + '"></i>';
    return out + "</span>";
  }

  function empty(icon, title, desc, action) {
    return '<div class="empty"><div class="empty-ico">' + icon + "</div><h3>" + U.escapeHtml(title) + "</h3><p>" + U.escapeHtml(desc || "") + "</p>" + (action || "") + "</div>";
  }

  function masteryLabel(m) {
    if (m >= 90) return "很熟练";
    if (m >= 80) return "已掌握";
    if (m >= 60) return "快掌握";
    if (m >= 30) return "在进步";
    if (m > 0) return "刚起步";
    return "未开始";
  }

  function stateDot(id) {
    var E = global.Engine;
    if (E.isSeen(id)) {
      var m = E.mastery(id);
      var cls = m >= 80 ? "ok" : m >= 40 ? "mid" : "low";
      return '<i class="dot ' + cls + '" title="' + masteryLabel(m) + '"></i>';
    }
    return '<i class="dot none" title="未开始"></i>';
  }

  function medalRow() {
    var st = global.Engine.state();
    return (global.BADGES || []).map(function (b) {
      var got = !!st.badges[b.id];
      return '<div class="medal ' + (got ? "got" : "lock") + '"><span class="medal-ico">' + b.icon + '</span><b>' + b.name + "</b><small>" + (got ? "已获得" : b.desc) + "</small></div>";
    }).join("");
  }

  /* 阅读类知识点：例题本身就是语段，做题时要把材料一起带出来 */
  var PASSAGE_RE = /^(阅读下面|读下面|阅读语段|阅读短文|读短文|阅读材料|读材料|阅读[:：]|短文[:：])/;
  function isPassage(p) {
    return !!(p && p.example && p.example.stem && PASSAGE_RE.test(String(p.example.stem).trim()));
  }
  function passageBlock(p) {
    if (!isPassage(p)) return "";
    var text = String(p.example.stem);
    /* 例题里的「问：……」属于例题本身，做题时去掉，只保留阅读材料 */
    var cut = text.search(/\n\s*问[:：]/);
    if (cut > 30) text = text.slice(0, cut);
    return '<details class="q-material" open><summary>题目材料</summary><div class="rich">' + global.U.renderRich(text) + "</div></details>";
  }

  global.UI = {
    subject: subject, subjectTag: subjectTag, ring: ring, bar: bar, diffDots: diffDots,
    empty: empty, masteryLabel: masteryLabel, stateDot: stateDot, medalRow: medalRow,
    isPassage: isPassage, passageBlock: passageBlock
  };
})(window);
