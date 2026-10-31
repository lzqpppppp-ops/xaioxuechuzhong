/* ===========================================================
   view-map.js — 知识地图
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U, E = global.Engine, UI = global.UI;
  global.Views = global.Views || {};

  var GRADE_NAME = { 1: "一年级", 2: "二年级", 3: "三年级", 4: "四年级", 5: "五年级", 6: "六年级", 7: "七年级", 8: "八年级", 9: "九年级" };

  function card(p) {
    var locked = !E.isUnlocked(p);
    var m = E.mastery(p.id);
    var done = E.isSeen(p.id);
    return '<article class="pcard' + (locked ? " locked" : "") + (done ? " started" : "") + '" data-action="point-sheet" data-id="' + p.id + '" style="--c:' + UI.subject(p.subject).color + '">' +
      '<div class="pcard-top">' + UI.stateDot(p.id) +
      (locked ? '<span class="lock">🔒</span>' : "") +
      "<span class=\"pcard-grade\">" + (GRADE_NAME[p.grade] || p.grade + "年级") + "</span>" +
      "</div>" +
      "<h4>" + U.escapeHtml(p.title) + "</h4>" +
      '<div class="pcard-meta">' + UI.subjectTag(p.subject) + "<span>" + U.escapeHtml(p.tag || "") + "</span></div>" +
      '<div class="pcard-foot">' + UI.bar(m, UI.subject(p.subject).color) + "<span>" + m + "%</span></div>" +
      "</article>";
  }

  global.Views.map = function (params) {
    var subs = global.SUBJECT_META || E.subjectsWithContent();
    var cur = (params && params[0]) || "all";
    if (cur !== "all" && !subs.some(function (s) { return s.key === cur; })) cur = "all";

    var onlyTodo = !!(global.App && global.App.mapFilter && global.App.mapFilter.unmastered);

    var baseList = cur === "all" ? E.curriculum().all : E.pointsOf(cur);
    if (cur !== "all") baseList = baseList.filter(function (p) { return p.subject === cur; });
    var list = onlyTodo ? baseList.filter(function (p) { return !E.isMastered(p.id); }) : baseList;

    var byGrade = {};
    list.forEach(function (p) { (byGrade[p.grade] = byGrade[p.grade] || []).push(p); });
    var grades = Object.keys(byGrade).map(Number).sort(function (a, b) { return a - b; });
    var profileGrade = (E.state().profile && E.state().profile.grade) || 1;

    var tabs = '<a class="pill' + (cur === "all" ? " on" : "") + '" href="#/map/all">全部</a>' +
      subs.map(function (s) {
        return '<a class="pill' + (cur === s.key ? " on" : "") + '" href="#/map/' + s.key + '" style="--c:' + s.color + '">' +
          '<i class="pdot"></i>' + U.escapeHtml(s.name) + "</a>";
      }).join("") +
      '<button class="pill filter' + (onlyTodo ? " on" : "") + '" data-action="toggle-unmastered">' + (onlyTodo ? "✓ " : "") + "只看未掌握</button>";

    var body = grades.map(function (g, idx) {
      var items = byGrade[g];
      var mastered = items.filter(function (p) { return E.isMastered(p.id); }).length;
      var hasSeen = items.some(function (p) { return E.isSeen(p.id); });
      var open = g === profileGrade || hasSeen || idx === 0;
      return '<details class="grade-block"' + (open ? " open" : "") + ">" +
        '<summary class="grade-head"><h3>' + (GRADE_NAME[g] || g + "年级") + "</h3>" +
        '<span class="muted">' + mastered + "/" + items.length + " 已掌握</span></summary>" +
        '<div class="pcards">' + items.map(card).join("") + "</div>" +
        "</details>";
    }).join("");

    if (!body) body = UI.empty("🗺️", onlyTodo ? "都掌握了" : "这个科目还没有内容",
      onlyTodo ? "当前筛选下没有未掌握的知识点，关掉筛选看看全部。" : "换一个科目看看，或者去今日任务。");

    var total = baseList.length, masteredAll = baseList.filter(function (p) { return E.isMastered(p.id); }).length;
    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">知识地图</p><h1>从简单到难，一格一格点亮</h1>' +
      '<p class="sub">共 ' + total + " 个知识点，已掌握 " + masteredAll + " 个 · 点击卡片查看详情</p></div>" +
      '<div class="map-legend"><span><i class="dot ok"></i>已掌握</span><span><i class="dot mid"></i>学习中</span><span><i class="dot none"></i>未开始</span><span>🔒 未解锁</span></div>' +
      "</header>" +
      '<div class="pills">' + tabs + "</div>" +
      body +
      "</div>";
  };
})(window);
