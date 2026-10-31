/* ===========================================================
   view-forest.js — 成长林页面
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U, E = global.Engine, UI = global.UI, F = global.Forest;
  global.Views = global.Views || {};

  var EGG_MSG = {
    bird: "小鸟被书声吸引，落在枝头听了一会儿。",
    clover: "在草丛里找到一棵四叶草，运气 +5。",
    snowman: "堆了个小雪人陪你看书。",
    mushroom: "树下冒出一朵小蘑菇，秋天到了。",
    bee: "小蜜蜂来采蜜，说明你这片林子开花了。",
    butterfly: "一只蝴蝶停在叶子上，别惊动它。"
  };

  function seasonBtn(key, cur, label, name) {
    return '<button class="season-btn' + (cur === key ? " on" : "") + '" data-action="season" data-s="' + key + '" title="' + name + '">' + label + "</button>";
  }

  function eggFor(c, i) {
    /* 彩蛋按日期 + 章节稳定出现，不会每次刷新乱跳 */
    var seed = U.hashStr(U.today() + c.key);
    if (seed % 9 !== i % 9) return "";
    var kind = c.mastered >= c.total ? "butterfly" : seed % 2 ? "bee" : "clover";
    return '<button class="egg-tree" data-action="egg" data-egg="' + kind + '" title="点我">' +
      (kind === "clover" ? "🌿" : kind === "bee" ? "🐝" : "🦋") + "</button>";
  }

  function treeCard(c, i) {
    var st = E.state();
    var seasonKey = F.season(st.settings.season);
    var done = c.mastered >= c.total;
    var meta = done ? c.total + "/" + c.total + " 叶 · 已成树"
      : c.learned ? "已学 " + c.learned + "/" + c.total + " 叶" + (c.mastered ? " · 掌握 " + c.mastered : "")
        : "待发芽 · 0/" + c.total;
    return '<div class="tree-card' + (done ? " done" : "") + '">' +
      '<button class="tree-hit" data-action="chapter" data-key="' + c.key + '">' +
      '<span class="tree-holder">' + F.treeSVG(c, seasonKey, c.color) + "</span>" +
      "<b>" + c.grade + " 年级</b>" +
      '<span class="tree-meta">' + meta + "</span>" +
      "</button>" + eggFor(c, i) + "</div>";
  }

  global.Views.forest = function () {
    var st = E.state();
    var seasonKey = F.season(st.settings.season);
    var S = F.SEASONS[seasonKey];
    var chs = F.chapters();
    var sum = F.summary(chs);
    var near = F.nearest(chs);

    var bySubject = [];
    E.subjectsWithContent().forEach(function (m) {
      var list = chs.filter(function (c) { return c.subject === m.key; });
      if (!list.length) return;
      var doneN = list.filter(function (c) { return c.mastered >= c.total; }).length;
      bySubject.push({ meta: m, list: list, done: doneN });
    });

    var sections = bySubject.map(function (g) {
      return '<section class="subject-forest">' +
        '<div class="sf-head">' +
        '<span class="tag subj" style="--c:' + g.meta.color + ";--bg:" + g.meta.soft + '">' + U.escapeHtml(g.meta.name) + "</span>" +
        '<span class="sf-progress">' + g.done + "/" + g.list.length + " 棵成树 · 叶子 " +
        g.list.reduce(function (n, c) { return n + c.mastered; }, 0) + "/" + g.list.reduce(function (n, c) { return n + c.total; }, 0) + "</span>" +
        "</div>" +
        '<div class="trees">' + g.list.map(treeCard).join("") + "</div>" +
        "</section>";
    }).join("");

    var guide = near
      ? '<b>园丁建议</b><p>离成树最近的是 <em>' + U.escapeHtml(near.subjectName) + " · " + near.grade + " 年级</em>，" +
        "还差 <em>" + (near.total - near.mastered) + "</em> 个知识点掌握（已学 " + near.learned + "/" + near.total + " 叶）。</p>"
      : '<b>整片林子都成树了</b><p>所有章节都已掌握，去「中考」做一张模拟卷检验一下？</p>';

    var seasonPick = seasonBtn("spring", seasonKey, "春", "春天") +
      seasonBtn("summer", seasonKey, "夏", "夏天") +
      seasonBtn("autumn", seasonKey, "秋", "秋天") +
      seasonBtn("winter", seasonKey, "冬", "冬天") +
      '<button class="season-btn auto' + (st.settings.season === "auto" ? " on" : "") + '" data-action="season" data-s="auto" title="跟随真实季节">自动</button>';

    return '<div class="page forest-page season-' + seasonKey + '" style="--s-accent:' + S.accent + '">' +
      '<div class="season-fx" aria-hidden="true">' + F.particles(seasonKey, 14) + "</div>" +
      '<header class="page-head">' +
      "<div><p class=\"eyebrow\">成长林 · " + S.icon + " " + S.name + "</p>" +
      "<h1>学一点，长一片叶；学完一章，长成一棵树</h1>" +
      '<p class="sub">共 ' + sum.trees + " 棵，已成树 " + sum.done + " 棵 · 叶子 " + sum.leaves + "/" + sum.totalLeaves +
      " 片（已掌握 " + sum.mastered + "）· " + S.tip + "</p></div>" +
      '<div class="season-pick">' + seasonPick + "</div>" +
      "</header>" +

      '<section class="card guide-card">' +
      '<div class="guide-emoji">🌱</div>' +
      "<div class=\"guide-text\">" + guide + "</div>" +
      (near
        ? '<button class="btn primary" data-action="go-chapter" data-key="' + near.key + '">去种这棵 →</button>'
        : '<a class="btn primary" href="#/exam">做模拟卷</a>') +
      "</section>" +

      '<div class="forest-tip">点任意一棵树，能看到这一章的知识点；学完一个知识点就长一片浅绿的新叶，掌握度到 80% 叶子变深，整章都掌握就成树结果。</div>' +

      sections +

      '<div class="forest-eggs">' +
      '<button class="egg egg-bird" data-action="egg" data-egg="bird" title="点我试试">🐦</button>' +
      '<span class="egg-hint">林子里藏了几个小东西，点一点有惊喜。</span>' +
      "</div>" +
      "</div>";
  };

  global.Views.chapterSheet = function (key) {
    var chs = F.chapters();
    var c = chs.filter(function (x) { return x.key === key; })[0];
    if (!c) return "";
    var pts = c.points.slice().sort(function (a, b) { return (a.difficulty || 0) - (b.difficulty || 0); });
    var next = pts.filter(function (p) { return !E.isMastered(p.id); })[0];
    return '<div class="sheet chapter-sheet">' +
      '<div class="sheet-top">' + UI.subjectTag(c.subject) + '<span class="muted">' + c.grade + " 年级 · 已学 " + c.learned + "/" + c.total + " 叶 · 掌握 " + c.mastered + "</span>" +
      '<button class="icon-btn ghost" data-action="close-modal">✕</button></div>' +
      "<h2>" + U.escapeHtml(c.subjectName) + " · " + c.grade + " 年级</h2>" +
      '<div class="chapter-bar">' + UI.bar(c.total ? Math.round((c.mastered / c.total) * 100) : 0, c.color) + "</div>" +
      '<div class="chapter-map">' +
      '<div class="cm-root">' + U.escapeHtml(c.subjectName) + " " + c.grade + " 年级</div>" +
      '<ul class="cm-list">' + pts.map(function (p) {
        var m = E.mastery(p.id), seen = E.isSeen(p.id);
        var cls = m >= 80 ? "ok" : seen ? "mid" : "";
        return '<li class="' + cls + '"><button data-action="point-sheet" data-id="' + p.id + '">' +
          '<i class="cm-leaf"></i><span class="cm-title">' + U.escapeHtml(p.title) + "</span>" +
          '<span class="cm-pct">' + (m ? m + "%" : "未学") + "</span></button></li>";
      }).join("") + "</ul></div>" +
      (c.mastered >= c.total
        ? '<p class="viz-note">这一章已经成树了，可以回头复习，或去别的树看看。</p>'
        : '<p class="viz-note">掌握度到 80% 就算长出一片叶；整章都到 80%，树就成材。</p>') +
      '<div class="learn-actions">' +
      (next ? '<button class="btn primary" data-action="start-point" data-id="' + next.id + '" data-mode="' + (E.isSeen(next.id) ? "review" : "new") + '">' + (E.isSeen(next.id) ? "复习下一课" : "学下一课") + "</button>" : "") +
      '<button class="btn ghost" data-action="close-modal">关闭</button></div>' +
      "</div>";
  };
})(window);
