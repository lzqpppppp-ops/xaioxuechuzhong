/* ===========================================================
   app.js — 外壳、路由、事件、模拟考计时
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U, E = global.Engine, UI = global.UI;

  var ICONS = {
    home: '<path d="M12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1"/><circle cx="12" cy="12" r="3.6"/>',
    map: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    review: '<path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H20v18H6.2A2.2 2.2 0 0 1 4 18.8z"/><path d="M4 17.2A2.2 2.2 0 0 1 6.2 15H20"/><path d="M8.5 7.5h6"/>',
    facts: '<path d="M6 21V4"/><path d="M6 4.5h10.5L15 8.5l1.5 4H6"/>',
    stats: '<path d="M4 20h16"/><rect x="5" y="10" width="3.2" height="10" rx="1"/><rect x="10.4" y="4" width="3.2" height="16" rx="1"/><rect x="15.8" y="13" width="3.2" height="7" rx="1"/>',
    lab: '<path d="M9 3h6"/><path d="M10 3v5.2L4.9 17a2.4 2.4 0 0 0 2.1 3.5h10a2.4 2.4 0 0 0 2.1-3.5L14 8.2V3"/><path d="M7.4 14h9.2"/>',
    tree: '<path d="M12 2.6 6.4 9.4h2.4L5 14.6h5v6.8h4v-6.8h5l-3.8-5.2h2.4z"/>',
    settings: '<circle cx="12" cy="12" r="3.1"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7"/>'
  };

  var NAV = [
    { k: "home", t: "今日", s: "今日", i: "home" },
    { k: "forest", t: "成长林", s: "森林", i: "tree" },
    { k: "map", t: "知识地图", s: "地图", i: "map" },
    { k: "lab", t: "实验室", s: "实验", i: "lab" },
    { k: "review", t: "错题本", s: "错题", i: "review" },
    { k: "facts", t: "中考", s: "中考", i: "facts" },
    { k: "stats", t: "数据", s: "数据", i: "stats" },
    { k: "settings", t: "设置", s: "设置", i: "settings" }
  ];

  function icon(name) {
    return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  var App = {
    session: null,
    exam: null,
    examResult: null,
    ob: { grade: 7, minutes: 25 },
    mapFilter: { unmastered: false },
    _timer: null,
    partsLoading: false,
    partsError: null,
    partsLabel: "",
    _loadGen: 0,
    _hydratedPlan: false
  };
  var PL = global.PartsLoader;

  /* ---------------- 外壳 ---------------- */
  function shell(page, html) {
    var st = E.state();
    var lv = E.levelInfo();
    var active = { home: "home", forest: "forest", map: "map", lab: "lab", learn: "map", papers: "facts", review: "review", facts: "facts", exam: "facts", stats: "stats", settings: "settings" }[page] || "home";
    var wrongN = E.wrongList().length + (E.paperWrongCount ? E.paperWrongCount() : 0);

    var side = '<aside class="sidebar">' +
      '<a class="brand" href="#/home"><span class="brand-mark">中</span><span><b>中考通关</b><small>小学 → 初中</small></span></a>' +
      '<nav class="nav">' + NAV.map(function (n) {
        return '<a class="nav-item' + (active === n.k ? " on" : "") + '" href="#/' + n.k + '">' + icon(n.i) +
          "<span>" + n.t + "</span>" + (n.k === "review" && wrongN ? '<em class="dot-num">' + wrongN + "</em>" : "") + "</a>";
      }).join("") + "</nav>" +
      '<div class="side-foot">' +
      '<div class="lv-card"><div class="lv-row"><b>' + lv.name + " Lv." + lv.level + "</b><span>" + st.xp + " EXP</span></div>" + UI.bar(lv.pct) +
      '<div class="lv-row small"><span>连续 ' + (st.streak.days || 0) + " 天</span><span>掌握 " + E.masteredCount() + " 点</span></div></div>" +
      "</div></aside>";

    var tabs = '<nav class="tabbar">' + NAV.map(function (n) {
      return '<a class="tab' + (active === n.k ? " on" : "") + '" href="#/' + n.k + '">' + icon(n.i) + "<span>" + (n.s || n.t) + "</span>" +
        (n.k === "review" && wrongN ? '<em class="dot-num">' + wrongN + "</em>" : "") + "</a>";
    }).join("") + "</nav>";

    return side + '<main class="main" id="main">' + html + "</main>" + tabs;
  }

  /* ---------------- 路由 ---------------- */
  function parseHash() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    return { page: parts[0] || "home", params: parts.slice(1) };
  }

  function partsLoadingHtml(label) {
    return '<div class="page parts-loading"><div class="parts-loading-card">' +
      '<div class="parts-spinner" aria-hidden="true"></div>' +
      '<h2>正在加载' + (label ? U.escapeHtml(label) : '知识点') + '…</h2>' +
      '<p class="sub">第一次打开会稍等一下，已加载过的科目会直接用缓存</p>' +
      '</div></div>';
  }

  function partsErrorHtml() {
    return '<div class="page">' + UI.empty('⚠️', '知识点加载失败', App.partsError || '请检查网络或改用「启动本地服务器.bat」再打开',
      '<button class="btn primary" data-action="retry-parts">重试</button>') + '</div>';
  }

  function afterPartsReady() {
    if (PL) PL.rebuild();
    var st = E.state();
    if (!st.profile) return;
    var d = st.daily;
    var today = U.today();
    if (!d || d.date !== today) {
      E.ensureDaily();
      App._hydratedPlan = true;
      return;
    }
    var bad = (d.new || []).some(function (id) { return !E.point(id); }) ||
      (d.review || []).some(function (id) { return !E.point(id); });
    if (bad) {
      E.regenerateDaily();
      App._hydratedPlan = true;
      return;
    }
    if (!App._hydratedPlan && !(d.new && d.new.length) && E.curriculum().all.length) {
      E.regenerateDaily();
      App._hydratedPlan = true;
      return;
    }
    App._hydratedPlan = true;
  }

  function ensurePartsForRoute(r) {
    var page = r.page;
    if (page === "onboarding") return { ready: true, promise: Promise.resolve(), label: "" };
    if (!PL) return { ready: true, promise: Promise.resolve(), label: "" };

    if (page === "map" && r.params[0] && r.params[0] !== "all" && global.SUBJECT_MAP[r.params[0]]) {
      var sub = global.SUBJECT_MAP[r.params[0]];
      var one = PL.ensureSubject(r.params[0]);
      return { ready: one.ready, promise: one.promise, label: sub.name || r.params[0] };
    }
    if (page === "exam" && r.params[0] === "run" && App.exam && App.exam.key) {
      var ex = PL.ensureSubject(App.exam.key);
      return { ready: ex.ready, promise: ex.promise, label: App.exam.subjectName || App.exam.key };
    }
    if (page === "exam" && r.params[0] === "result" && App.examResult && App.examResult.key) {
      var er = PL.ensureSubject(App.examResult.key);
      return { ready: er.ready, promise: er.promise, label: App.examResult.subjectName || App.examResult.key };
    }
    var all = PL.ensureAll();
    return { ready: all.ready, promise: all.promise, label: "全部科目" };
  }

  function paint(page, html) {
    var app = document.getElementById("app");
    var r = parseHash();
    var key = page + "/" + r.params.join("/");
    var keepScroll = App._lastKey === key ? window.scrollY : 0;

    if (global.Viz) global.Viz.disposeAll();
    app.innerHTML = shell(page, html);
    if (global.Viz) global.Viz.mountAll(app);
    var mainEl = document.getElementById("main");
    if (mainEl && App._lastKey !== key) mainEl.classList.add("fade");
    App._lastKey = key;
    if (keepScroll) window.scrollTo(0, keepScroll);
    if (page !== "exam" || r.params[0] !== "run") stopTimer();
    if (page === "exam" && r.params[0] === "run") startTimer();

    var fill = document.getElementById("fill-input");
    if (fill) fill.focus();
    var fb = document.querySelector(".fb");
    if (fb && fb.scrollIntoView) {
      try { fb.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) { fb.scrollIntoView(); }
    }
  }

  function viewHtml(page, params) {
    switch (page) {
      case "home": return global.Views.home();
      case "forest": return global.Views.forest();
      case "map": return global.Views.map(params);
      case "learn": return global.Learn.render();
      case "review": return global.Views.review();
      case "exam":
        if (params[0] === "run") return global.Views.examRun();
        if (params[0] === "result") return global.Views.examResult();
        return global.Views.exam();
      case "facts": return global.Views.facts();
      case "lab": return global.Views.lab();
      case "stats": return global.Views.stats();
      case "settings": return global.Views.settings();
      case "onboarding": return global.Views.onboarding();
      default: return global.Views.home();
    }
  }

  function render() {
    var st = E.state();
    var r = parseHash();

    if (!st.profile && r.page !== "onboarding") {
      location.hash = "#/onboarding";
      return;
    }
    if (r.page === "exam/run") r.page = "exam";
    if (r.page === "papers") { location.hash = "#/facts"; return; }

    var page = r.page;
    var gen = ++App._loadGen;
    var need = ensurePartsForRoute(r);

    function finishOk() {
      if (gen !== App._loadGen) return;
      App.partsLoading = false;
      App.partsError = null;
      afterPartsReady();
      paint(page, viewHtml(page, r.params));
    }

    function finishErr(err) {
      if (gen !== App._loadGen) return;
      App.partsLoading = false;
      App.partsError = String((err && err.message) || err || "加载失败");
      paint(page, partsErrorHtml());
    }

    if (need.ready) {
      finishOk();
      return;
    }

    App.partsLoading = true;
    App.partsError = null;
    App.partsLabel = need.label || "";
    paint(page, partsLoadingHtml(need.label));
    need.promise.then(finishOk, finishErr);
  }

  /* ---------------- 模拟考 ---------------- */
  function startExam(key) {
    var s = global.SUBJECT_MAP[key];
    function go() {
      var qs = E.buildExam(key, 10);
      if (!qs.length) { U.toast("这个科目还没有题目"); return; }
      App.exam = {
        key: key, subjectName: s ? s.name : key, qs: qs,
        answers: new Array(qs.length).fill(null), i: 0,
        left: 15 * 60, started: Date.now()
      };
      App.examResult = null;
      if (location.hash === "#/exam/run") render();
      else { location.hash = "#/exam/run"; render(); }
    }
    if (!PL || PL.isSubjectLoaded(key)) { go(); return; }
    App.partsLoading = true;
    paint("exam", partsLoadingHtml(s ? s.name : key));
    PL.loadSubject(key).then(function () {
      App.partsLoading = false;
      go();
    }, function (err) {
      App.partsLoading = false;
      App.partsError = String((err && err.message) || err);
      paint("exam", partsErrorHtml());
    });
  }

  function readFill() {
    var el = document.getElementById("exam-fill");
    if (el && App.exam) App.exam.answers[App.exam.i] = el.value;
  }

  function startTimer() {
    stopTimer();
    App._timer = setInterval(function () {
      var X = App.exam;
      if (!X) return stopTimer();
      X.left--;
      var t = document.getElementById("exam-timer");
      if (t) {
        var mm = Math.floor(Math.max(0, X.left) / 60), ss = Math.max(0, X.left) % 60;
        t.textContent = mm + ":" + (ss < 10 ? "0" + ss : ss);
        t.classList.toggle("hot", X.left <= 120);
      }
      if (X.left <= 0) submitExam(true);
    }, 1000);
  }
  function stopTimer() { if (App._timer) { clearInterval(App._timer); App._timer = null; } }

  function answerText(q, given) {
    if (given == null || given === "") return "未作答";
    if (q.type === "choice") return String.fromCharCode(65 + Number(given)) + ". " + (q.options[given] || "");
    return String(given);
  }
  function rightText(q) {
    if (q.type === "choice") return String.fromCharCode(65 + q.answer) + ". " + (q.options[q.answer] || "");
    return (q.answer || []).join(" / ");
  }

  function submitExam(auto) {
    var X = App.exam;
    if (!X) return;
    readFill();
    stopTimer();
    var score = 0;
    var detail = X.qs.map(function (item, i) {
      var q = item.q;
      var given = X.answers[i];
      var correct = q.type === "choice" ? Number(given) === q.answer : U.sameAnswer(given, q.answer || []);
      if (correct) score++;
      if (!correct) E.recordAnswer(item.pointId, item.pointId + "#" + item.qi, false);
      else E.recordAnswer(item.pointId, item.pointId + "#" + item.qi, true);
      return { q: q, given: answerText(q, given), right: rightText(q), correct: correct, point: item.pointId };
    });
    var used = Math.max(1, Math.round((15 * 60 - X.left) / 60));
    var R = {
      key: X.key, subjectName: X.subjectName, score: score, total: X.qs.length,
      grade: E.gradeFor(score / X.qs.length), detail: detail,
      used: Math.floor(used), usedSec: (15 * 60 - X.left) % 60, date: U.today()
    };
    App.examResult = R;
    E.saveExam({ key: R.key, subjectName: R.subjectName, score: R.score, total: R.total, grade: R.grade, date: R.date });
    App.exam = null;
    if (auto) U.toast("时间到，已自动交卷");
    location.hash = "#/exam/result";
  }

  /* ---------------- 弹层 ---------------- */
  function modal(html) {
    var root = document.getElementById("modal-root");
    if (global.Viz) global.Viz.disposeAll(root);
    root.innerHTML = '<div class="modal-mask"><div class="modal" role="dialog">' + html + "</div></div>";
    root.classList.add("open");
    if (global.Viz) global.Viz.mountAll(root);
    var mask = root.querySelector(".modal-mask");
    mask.addEventListener("click", function (ev) { if (ev.target === mask) closeModal(); });
  }
  function closeModal() {
    var root = document.getElementById("modal-root");
    if (global.Viz) global.Viz.disposeAll(root);
    root.classList.remove("open");
    root.innerHTML = "";
  }

  /* 练习时的「提示」：有图给图，没图给「怎么想 + 本课要点」，都不给答案 */
  function showHint(id) {
    var p = E.point(id);
    if (!p) return;
    var v = global.VizMap && global.VizMap.of(p);
    var h = global.Hint ? global.Hint.forPoint(p) : { tips: [], bullets: [] };
    var top = '<div class="sheet-top">' + UI.subjectTag(p.subject) + '<span class="muted">提示 · 不是答案</span>' +
      '<button class="icon-btn ghost" data-action="close-modal">✕</button></div>';

    var html = '<div class="sheet hint-sheet">' + top +
      "<h2>" + U.escapeHtml(p.title) + "</h2>" +
      '<p class="sub">' + (v ? U.escapeHtml(v.hint) : "卡住时按这个顺序想，别急着猜答案：") + "</p>";

    if (v) {
      html += '<div class="viz" data-viz="' + v.key + '" data-head="0"' + (v.type ? ' data-viz-type="' + v.type + '"' : "") + "></div>";
    }
    if (h.tips && h.tips.length) {
      html += '<div class="hint-sec"><h4>怎么想</h4><ul>' +
        h.tips.map(function (t) { return "<li>" + U.renderRich(t) + "</li>"; }).join("") + "</ul></div>";
    }
    if (h.bullets && h.bullets.length) {
      html += '<div class="hint-sec"><h4>本课要点</h4><ul>' +
        h.bullets.map(function (t) { return "<li>" + U.renderRich(t) + "</li>"; }).join("") + "</ul></div>";
    }
    if (!v && !(h.tips || []).length && !(h.bullets || []).length) {
      html += '<p class="viz-note">这一课暂时没有额外提示，回到上面「讲解」再看一遍就好。</p>';
    }
    html += '<p class="viz-note">看完再作答；实在不会就选一个，解析会讲清楚为什么。</p>' +
      '<div class="learn-actions"><button class="btn primary" data-action="close-modal">回去试试</button></div>' +
      "</div>";
    modal(html);
  }

  /* 成长林：从章节直接进入下一课 */
  function startChapter(key) {
    var F = global.Forest;
    if (!F) return;
    var c = F.chapters().filter(function (x) { return x.key === key; })[0];
    if (!c) return;
    var next = c.points.filter(function (x) { return !E.isMastered(x.id); })[0] || c.points[0];
    if (next) global.Learn.start(next.id, E.isSeen(next.id) ? "review" : "new");
  }

  /* 森林里的小彩蛋：每天每种只给一次奖励 */
  var EGG_MSG = {
    bird: "小鸟被书声吸引，落在枝头听了一会儿。",
    clover: "在草丛里找到一棵四叶草，运气 +5 经验。",
    snowman: "堆了个小雪人陪你看书。",
    mushroom: "树下冒出一朵小蘑菇，秋天到了。",
    bee: "小蜜蜂来采蜜，说明你这片林子开花了。",
    butterfly: "一只蝴蝶停在叶子上，别惊动它。"
  };
  function playEgg(kind) {
    var st = E.state();
    if (!st.eggs || st.eggs.date !== U.today()) st.eggs = { date: U.today(), ids: {} };
    if (st.eggs.ids[kind]) { U.toast("今天已经和它打过招呼了，明天再来"); return; }
    st.eggs.ids[kind] = 1;
    E.addXp(5);
    E.saveNow();
    U.beep("ok");
    U.toast(EGG_MSG[kind] || "发现一个小惊喜，+5 经验");
  }

  function pointSheet(id) {
    var p = E.point(id);
    if (!p) return;
    var r = E.prog(p.id);
    var locked = !E.isUnlocked(p);
    var gradeName = (p.grade <= 6 ? p.grade + " 年级" : p.grade - 6 + " 年级（初中）");
    modal('<div class="sheet">' +
      '<div class="sheet-top">' + UI.subjectTag(p.subject) + '<span class="muted">' + gradeName + "</span>" +
      '<button class="icon-btn ghost" data-action="close-modal">✕</button></div>' +
      "<h2>" + U.escapeHtml(p.title) + "</h2>" +
      '<p class="sub">' + U.escapeHtml(p.tag || "") + " · 难度 " + UI.diffDots(p.difficulty) + " · 约 " + p.minutes + " 分钟</p>" +
      '<div class="sheet-stat"><span>掌握度</span><b>' + r.mastery + "%</b>" + UI.bar(r.mastery) + "</div>" +
      (r.due ? '<p class="hint">下次复习：' + r.due + (r.interval ? "（间隔 " + r.interval + " 天）" : "") + "</p>" : "") +
      '<div class="rich clamp">' + U.renderRich(p.explain) + "</div>" +
      (locked
        ? '<p class="hint">这个知识点在更后面的年级，先学扎实再挑战；也可以现在就提前学。</p><div class="learn-actions"><button class="btn primary" data-action="unlock-point" data-id="' + p.id + '">提前解锁</button><button class="btn ghost" data-action="close-modal">再等等</button></div>'
        : '<div class="learn-actions">' +
        '<button class="btn primary" data-action="start-here" data-id="' + p.id + '" data-mode="' + (r.seen ? "review" : "new") + '">' + (r.seen ? "复习这一课" : "开始学习") + "</button>" +
        (global.VizMap && global.VizMap.of(p) ? '<button class="btn ghost" data-action="show-hint" data-id="' + p.id + '">💡 先看图</button>' : "") +
        '<button class="btn ghost" data-action="close-modal">关闭</button></div>') +
      "</div>");
  }

  /* ---------------- 事件 ---------------- */
  function onClick(ev) {
    var t = ev.target.closest("[data-action]");
    if (!t) return;
    var a = t.getAttribute("data-action");
    var d = t.dataset;

    switch (a) {
      case "continue": {
        var daily = E.ensureDaily();
        var next = null, kind = "new";
        for (var i = 0; i < daily.new.length; i++) if (!daily.done.new[daily.new[i]]) { next = daily.new[i]; kind = "new"; break; }
        if (!next) for (var j = 0; j < daily.review.length; j++) if (!daily.done.review[daily.review[j]]) { next = daily.review[j]; kind = "review"; break; }
        if (next) global.Learn.start(next, kind);
        else if (daily.wrong.length && !Object.keys(daily.done.wrong).length) global.Learn.startWrong();
        else location.hash = "#/map";
        break;
      }
      case "regen": E.regenerateDaily(); render(); U.toast("已换一组任务"); break;
      case "toggle-unmastered":
        App.mapFilter.unmastered = !App.mapFilter.unmastered;
        render();
        break;
      case "start-point": global.Learn.start(d.id, d.mode || "new"); break;
      case "start-wrong": global.Learn.startWrong(); break;
      case "start-wrong-one": global.Learn.startWrong(d.id + "#" + d.qi); break;
      case "point-sheet": pointSheet(d.id); break;
      case "show-hint": showHint(d.id); break;
      case "chapter":
        if (global.Views.chapterSheet) modal(global.Views.chapterSheet(d.key));
        break;
      case "go-chapter": startChapter(d.key); break;
      case "season":
        E.state().settings.season = d.s;
        E.saveNow();
        render();
        break;
      case "egg": playEgg(d.egg); break;
      case "unlock-point": E.unlockPoint(d.id); closeModal(); render(); U.toast("已解锁，可以从这课开始"); break;
      case "start-here": closeModal(); global.Learn.start(d.id, d.mode || "new"); break;
      case "close-modal": closeModal(); break;
      case "exit-learn": global.Learn.exit(); break;
      case "to-example": global.Learn.toExample(); break;
      case "reveal-step": global.Learn.revealStep(); break;
      case "to-quiz": global.Learn.toQuiz(); break;
      case "pick": global.Learn.pick(Number(d.i)); break;
      case "submit-fill": {
        var inp = document.getElementById("fill-input");
        global.Learn.submitFill(inp ? inp.value : "");
        break;
      }
      case "next-q": global.Learn.next(); break;
      case "again": global.Learn.again(); break;

      case "start-exam": startExam(d.key); break;
      case "retry-parts":
        App.partsError = null;
        if (PL) { PL.rebuild(); }
        render();
        break;
      case "exam-pick":
        readFill();
        App.exam.answers[App.exam.i] = Number(d.i);
        render();
        break;
      case "exam-next": readFill(); if (App.exam.i + 1 < App.exam.qs.length) { App.exam.i++; render(); } break;
      case "exam-prev": readFill(); if (App.exam.i > 0) { App.exam.i--; render(); } break;
      case "exam-jump": readFill(); App.exam.i = Number(d.i); render(); break;
      case "exam-submit": submitExam(false); break;
      case "exam-quit":
        stopTimer();
        if (App.exam && !confirm("退出后本次不记录成绩，确定吗？")) { startTimer(); return; }
        App.exam = null;
        location.hash = "#/exam";
        break;

      case "set-grade": {
        var p = E.state().profile;
        E.setProfile(Object.assign({}, p, { grade: Number(d.g) }));
        render(); U.toast("已切到 " + d.g + " 年级");
        break;
      }
      case "set-minutes": {
        var p2 = E.state().profile;
        E.setProfile(Object.assign({}, p2, { dailyMinutes: Number(d.m) }));
        render(); U.toast("每日任务量已更新");
        break;
      }
      case "toggle-sound": {
        var s = E.state().settings; s.sound = !s.sound; E.saveNow(); render();
        if (s.sound) U.beep("ok");
        break;
      }
      case "toggle-anim": {
        var s2 = E.state().settings; s2.anim = !s2.anim; E.saveNow(); render();
        break;
      }
      case "save-profile": {
        var nameEl = document.getElementById("set-name");
        var prof = Object.assign({}, E.state().profile, { name: (nameEl && nameEl.value || "").trim() || "同学" });
        E.setProfile(prof); render(); U.toast("设置已保存");
        break;
      }
      case "export": {
        var blob = new Blob([E.exportJSON()], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a2 = document.createElement("a");
        a2.href = url;
        a2.download = "中考通关-进度-" + U.today() + ".json";
        document.body.appendChild(a2); a2.click(); document.body.removeChild(a2);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        U.toast("已导出，请妥善保存");
        break;
      }
      case "reset":
        if (confirm("会清空所有学习进度，且无法恢复。确定吗？")) {
          E.resetAll();
          App.session = null; App.exam = null;
          location.hash = "#/onboarding";
          render();
        }
        break;

      case "ob-grade": App.ob.grade = Number(d.g); render(); break;
      case "ob-min": App.ob.minutes = Number(d.m); render(); break;
      case "ob-start": {
        var nEl = document.getElementById("ob-name");
        var name = (nEl && nEl.value || "").trim();
        if (!name) { U.toast("先写个昵称吧"); if (nEl) nEl.focus(); return; }
        E.setProfile({ name: name, grade: App.ob.grade, dailyMinutes: App.ob.minutes });
        E.ensureDaily();
        U.confetti(28);
        location.hash = "#/home";
        render();
        break;
      }
      default: break;
    }
  }

  function onKey(ev) {
    if (ev.key !== "Enter") return;
    var id = ev.target && ev.target.id;
    if (id === "fill-input") {
      ev.preventDefault();
      global.Learn.submitFill(ev.target.value);
    } else if (id === "exam-fill") {
      ev.preventDefault();
      readFill();
      if (App.exam && App.exam.i + 1 < App.exam.qs.length) { App.exam.i++; render(); }
    }
  }

  function onImport(ev) {
    var file = ev.target.files && ev.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        E.importJSON(String(reader.result));
        U.toast("导入成功");
        location.hash = "#/home";
        render();
      } catch (err) {
        U.toast("导入失败：文件格式不对");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  /* ---------------- 启动 ---------------- */
  App.render = render;
  App.startExam = startExam;
  App.modal = modal;
  App.closeModal = closeModal;

  function boot() {
    E.buildCurriculum();
    E.load();
    var st = E.state();
    if (st.profile) { App.ob.grade = st.profile.grade; App.ob.minutes = st.profile.dailyMinutes; }
    if (!location.hash) location.hash = st.profile ? "#/home" : "#/onboarding";

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    document.addEventListener("change", function (ev) {
      var t = ev.target;
      if (!t) return;
      if (t.id === "import-file") onImport(ev);
    });
    window.addEventListener("hashchange", render);
    window.addEventListener("beforeunload", function () { E.saveNow(); });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") E.saveNow();
    });

    render();
  }

  global.App = App;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
