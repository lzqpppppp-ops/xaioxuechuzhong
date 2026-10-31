/* ===========================================================
   view-home.js — 今日任务
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U, E = global.Engine, UI = global.UI;
  global.Views = global.Views || {};

  function greeting() {
    var h = new Date().getHours();
    if (h < 6) return "夜深了";
    if (h < 11) return "早上好";
    if (h < 14) return "中午好";
    if (h < 18) return "下午好";
    return "晚上好";
  }

  function encourage(pct) {
    if (pct >= 100) return "今日任务全部完成，明天同一时间见。";
    if (pct >= 60) return "已经过半，剩下的很快就能拿下。";
    if (pct > 0) return "开局不错，保持这个节奏。";
    return "先做一题，开了头就顺了。";
  }

  function taskRow(id, kind, doneFlag, overdue) {
    var p = E.point(id);
    if (!p) return "";
    var subj = UI.subject(p.subject);
    return '<li class="task' + (doneFlag ? " done" : "") + '">' +
      '<button class="task-hit" data-action="start-point" data-id="' + p.id + '" data-mode="' + kind + '">' +
      '<span class="task-mark' + (doneFlag ? " on" : "") + '">' + (doneFlag ? "✓" : "") + "</span>" +
      '<span class="task-body">' +
      '<span class="task-title">' + UI.stateDot(p.id) + U.escapeHtml(p.title) + "</span>" +
      '<span class="task-sub">' + UI.subjectTag(p.subject) +
      (overdue ? '<em class="late">该复习了</em>' : "") +
      "<span>" + U.escapeHtml(p.tag || "") + "</span><span>" + p.minutes + " 分钟</span>" + UI.diffDots(p.difficulty) + "</span>" +
      "</span>" +
      '<span class="task-go">' + (doneFlag ? "再练" : "开始") + " →</span>" +
      "</button></li>";
  }

  function weekBars() {
    var out = ["一", "二", "三", "四", "五", "六", "日"];
    var days = [];
    for (var i = 6; i >= 0; i--) days.push(U.addDays(U.today(), -i));
    var max = 1;
    days.forEach(function (d) {
      var s = E.state().days[d];
      max = Math.max(max, s ? (s.quiz || 0) : 0);
    });
    return '<div class="week">' + days.map(function (d, i) {
      var s = E.state().days[d] || { quiz: 0 };
      var h = Math.round(Math.sqrt((s.quiz || 0) / max) * 100);
      var isToday = d === U.today();
      return '<div class="week-col' + (isToday ? " now" : "") + '">' +
        '<div class="week-bar"><i style="height:' + Math.max(4, h) + '%"></i></div>' +
        '<span>' + (isToday ? "今" : U.weekdayCN(d)) + "</span></div>";
    }).join("") + "</div>";
  }

  global.Views.home = function () {
    var st = E.state();
    if (global.App && global.App.partsLoading) {
      return '<div class="page parts-loading"><div class="parts-loading-card">' +
        '<div class="parts-spinner" aria-hidden="true"></div>' +
        '<h2>正在准备今日任务…</h2>' +
        '<p class="sub">正在按科目加载知识点</p></div></div>';
    }
    if (!E.curriculum().all.length) {
      return '<div class="page">' + UI.empty("📦", "还没有知识点数据", "把 data/parts 下的知识点文件放进来，刷新即可。") + "</div>";
    }
    var d = E.ensureDaily();
    var pp = E.planProgress();
    var lv = E.levelInfo();
    var day = E.dayStat();
    var acc = day.quiz ? Math.round((day.correct / day.quiz) * 100) : 0;
    var name = (st.profile && st.profile.name) || "同学";

    var groups = "";
    function doneIn(list, map) {
      return list.filter(function (id) { return map && map[id]; }).length;
    }
    if (d.new.length) {
      groups += '<div class="task-group"><h3><span>新学</span><small>' + doneIn(d.new, d.done.new) + "/" + d.new.length + "</small></h3><ul class=\"task-list\">" +
        d.new.map(function (id) { return taskRow(id, "new", !!d.done.new[id], false); }).join("") + "</ul></div>";
    }
    if (d.review.length) {
      groups += '<div class="task-group"><h3><span>复习</span><small>' + doneIn(d.review, d.done.review) + "/" + d.review.length + "</small></h3><ul class=\"task-list\">" +
        d.review.map(function (id) { return taskRow(id, "review", !!d.done.review[id], true); }).join("") + "</ul></div>";
    }
    if (d.wrong.length) {
      var wDone = Object.keys(d.done.wrong).length > 0;
      groups += '<div class="task-group"><h3><span>错题重练</span><small>' + d.wrong.length + " 题</small></h3>" +
        '<button class="wrong-cta' + (wDone ? " done" : "") + '" data-action="start-wrong">' +
        '<span class="wrong-ico">🩹</span><span><b>' + (wDone ? "今天已经重练过" : "把做错的题再打一遍") + "</b><small>" + d.wrong.length + " 道错题在等你</small></span><span class=\"task-go\">" + (wDone ? "再练" : "开始") + " →</span></button></div>";
    }
    if (!groups) {
      groups = UI.empty("🎉", "今天的任务都完成了", "想多学一点？去知识地图挑一个感兴趣的点。",
        '<a class="btn primary" href="#/map">打开知识地图</a>');
    }

    return '<div class="page">' +
      '<header class="page-head">' +
      "<div>" +
      '<p class="eyebrow">' + U.prettyDate(U.today()) + " · 连续 " + (st.streak.days || 0) + " 天</p>" +
      "<h1>" + greeting() + "，" + U.escapeHtml(name) + "</h1>" +
      '<p class="sub">' + lv.name + " Lv." + lv.level + " · 累计 " + st.xp + " 经验 · 已掌握 " + E.masteredCount() + " 个知识点</p>" +
      "</div>" +
      '<div class="lv-pill"><span>' + lv.name + "</span><b>Lv." + lv.level + "</b>" + UI.bar(lv.pct) + "</div>" +
      "</header>" +

      '<section class="hero card">' +
      '<div class="hero-left">' + UI.ring(pp.pct, 108, pp.done + "/" + pp.total + "&nbsp;") + "</div>" +
      '<div class="hero-mid">' +
      '<p class="eyebrow">今日进度</p>' +
      "<h2>" + (pp.pct >= 100 ? "收工，漂亮！" : pp.pct === 0 ? "开始今天的第一课" : "还差 " + (pp.total - pp.done) + " 项") + "</h2>" +
      "<p class=\"sub\">" + encourage(pp.pct) + "</p>" +
      '<div class="hero-btns">' +
      '<button class="btn primary" data-action="continue">' + (pp.done ? "继续学习" : "开始学习") + "</button>" +
      '<button class="btn ghost" data-action="regen">换一组任务</button>' +
      '<a class="btn ghost" href="#/forest">🌳 去成长林</a>' +
      "</div></div>" +
      '<div class="hero-week"><p class="eyebrow">最近 7 天答题</p>' + weekBars() + "</div>" +
      "</section>" +

      '<section class="card tasks">' +
      '<div class="card-head"><h2>今日任务</h2><span class="muted">每天 ' + ((st.profile && st.profile.dailyMinutes) || 20) + " 分钟</span></div>" +
      groups + "</section>" +

      '<section class="grid-2">' +
      '<div class="card stat-mini"><p class="eyebrow">今日答题</p><h3>' + day.quiz + " <small>题</small></h3><p class=\"sub\">正确率 " + acc + "% · 学习 " + day.minutes + " 分钟</p></div>" +
      '<div class="card stat-mini"><p class="eyebrow">下一个目标</p><h3>' + (lv.next ? "Lv." + (lv.level + 1) : "满级") + "</h3><p class=\"sub\">" +
      (lv.next ? "再得 " + (lv.next - st.xp) + " 经验升级" : "你已经是传说级选手") + "</p>" + UI.bar(lv.pct) + "</div>" +
      "</section>" +
      "</div>";
  };
})(window);
