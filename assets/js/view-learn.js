/* ===========================================================
   view-learn.js — 学习流程：讲解 → 例题 → 练习 → 结算
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U, E = global.Engine, UI = global.UI;
  global.Views = global.Views || {};

  var Learn = {};
  var S = null; /* 当前学习会话 */

  function seedOf(s) { return U.hashStr(s.id + "|" + U.today()); }

  function start(id, mode) {
    var p = E.point(id);
    if (!p) { U.toast("找不到这个知识点"); return; }
    var qs = p.quiz.map(function (q, i) { return { qi: i, q: q, pointId: p.id }; });
    if (mode === "review") qs = U.shuffle(qs, seedOf(p));
    S = {
      id: p.id, mode: mode || "new", step: "explain",
      qs: qs, i: 0, results: [], answered: false, chosen: null, input: "",
      lastCorrect: null, reveal: 0, started: Date.now(), result: null, badges: []
    };
    global.App.session = S;
    location.hash = "#/learn";
    global.App.render();
  }

  function startWrong(onlyQid) {
    var list = E.wrongList();
    if (onlyQid) list = list.filter(function (w) { return w.qid === onlyQid; });
    if (!list.length) { U.toast("错题本已经空了"); return; }
    var qs = list.map(function (w) {
      var p = E.point(w.pointId);
      var qi = parseInt(String(w.qid).split("#")[1], 10) || 0;
      return { qi: qi, q: p.quiz[qi], pointId: p.id, qid: w.qid };
    }).filter(function (x) { return x.q; });
    S = {
      id: null, mode: "wrong", step: "quiz", qs: U.shuffle(qs, Date.now()),
      i: 0, results: [], answered: false, chosen: null, input: "",
      lastCorrect: null, reveal: 0, started: Date.now(), result: null, badges: []
    };
    global.App.session = S;
    location.hash = "#/learn";
    global.App.render();
  }

  function resume() { S = global.App.session; return S; }

  /* ---------- 顶部 ---------- */
  function head() {
    var p = S.id ? E.point(S.id) : null;
    var label = p ? U.escapeHtml(p.title) : "错题重练";
    var sub = p ? UI.subjectTag(p.subject) : '<span class="tag subj" style="--c:#D9534F;--bg:#FDECEC">错题本</span>';
    var steps = S.mode === "wrong" ? ["练习", "结算"] : ["讲解", "例题", "练习", "结算"];
    var curIdx = S.mode === "wrong" ? (S.step === "result" ? 1 : 0) : ["explain", "example", "quiz", "result"].indexOf(S.step);
    return '<div class="learn-bar">' +
      '<button class="icon-btn" data-action="exit-learn" title="退出">←</button>' +
      '<div class="learn-crumb">' + sub + "<b>" + label + "</b></div>" +
      '<button class="icon-btn ghost" data-action="exit-learn" title="关闭">✕</button>' +
      "</div>" +
      '<div class="learn-steps">' + steps.map(function (t, i) {
        return '<span class="' + (i === curIdx ? "now" : i < curIdx ? "done" : "") + '">' + t + "</span>";
      }).join("") + "</div>";
  }

  /* ---------- 讲解 ---------- */
  function vizOf(p) {
    return (global.VizMap && global.VizMap.of(p)) || null;
  }

  function explainView(p) {
    var r = E.prog(p.id);
    var v = vizOf(p);
    return '<div class="learn-wrap">' + head() +
      '<article class="card learn-card">' +
      '<div class="learn-meta">' + UI.subjectTag(p.subject) +
      "<span>难度 " + UI.diffDots(p.difficulty) + "</span><span>约 " + p.minutes + " 分钟</span>" +
      "<span>" + U.escapeHtml(p.tag || "") + "</span></div>" +
      '<h1 class="learn-title">' + U.escapeHtml(p.title) + "</h1>" +
      (r.seen ? '<p class="sub">当前掌握度 ' + r.mastery + "% · " + UI.masteryLabel(r.mastery) + (r.due ? " · 下次复习 " + r.due : "") + "</p>"
        : '<p class="sub">第一次学也没关系，跟着三步走：看懂 → 照着做 → 自己做。</p>') +
      '<div class="rich">' + U.renderRich(p.explain) + "</div>" +
      (v ? '<div class="viz-block"><p class="viz-lead">🖐 先动手看看：拖一拖、点一点，图上的数字会跟着变。</p>' +
        '<div class="viz" data-viz="' + v.key + '"' + (v.type ? ' data-viz-type="' + v.type + '"' : "") + "></div></div>" : "") +
      (p.prereq && p.prereq.length ? '<p class="hint">这个点会用到：' + p.prereq.map(function (id) {
        var q = E.point(id); return q ? U.escapeHtml(q.title) : "";
      }).join("、") + "</p>" : "") +
      '<div class="learn-actions">' +
      '<button class="btn primary" data-action="to-example">看一道例题</button>' +
      '<button class="btn ghost" data-action="to-quiz">我已经会了，直接练</button>' +
      "</div></article></div>";
  }

  /* ---------- 例题 ---------- */
  function exampleView(p) {
    var ex = p.example || { stem: "", steps: [], answer: "" };
    var steps = ex.steps || [];
    var shown = Math.min(steps.length, S.reveal);
    var allShown = shown >= steps.length;
    return '<div class="learn-wrap">' + head() +
      '<article class="card learn-card">' +
      '<p class="eyebrow">例题 · 跟着一步步来</p>' +
      '<div class="q-stem">' + U.renderRich(ex.stem || "") + "</div>" +
      '<ol class="steps">' + steps.map(function (s, i) {
        return i < shown
          ? '<li><span class="step-no">' + (i + 1) + "</span><div>" + U.renderRich(s) + "</div></li>"
          : '<li class="dim"><span class="step-no">' + (i + 1) + '</span><div class="blur">' + U.renderRich(s) + "</div></li>";
      }).join("") + "</ol>" +
      (allShown ? '<div class="answer-box"><span>答案</span><b>' + U.escapeHtml(ex.answer || "") + "</b></div>" : "") +
      '<div class="learn-actions">' +
      (!allShown
        ? '<button class="btn primary" data-action="reveal-step">' + (shown === 0 ? "看第一步" : "下一步") + "</button>"
        : '<button class="btn primary" data-action="to-quiz">开始练习</button>') +
      '<button class="btn ghost" data-action="to-quiz">跳过例题</button>' +
      "</div></article></div>";
  }

  /* ---------- 练习 ---------- */
  function optionClass(idx, q) {
    if (!S.answered) return "opt";
    if (idx === q.answer) return "opt correct";
    if (idx === S.chosen) return "opt wrong";
    return "opt muted";
  }

  function quizView() {
    var item = S.qs[S.i];
    var q = item.q;
    var p = E.point(item.pointId);
    var isChoice = q.type === "choice";
    var v = p ? vizOf(p) : null;
    var body = "";

    if (isChoice) {
      var opts = q.options || [];
      body = '<div class="opts' + (opts.length <= 3 ? " short" : "") + '">' + opts.map(function (o, idx) {
        return '<button class="' + optionClass(idx, q) + '" data-action="pick" data-i="' + idx + '"' + (S.answered ? " disabled" : "") + ">" +
          '<b class="opt-key">' + (opts.length <= 3 ? "" : "ABCD".charAt(idx)) + "</b><span>" + U.escapeHtml(o) + "</span></button>";
      }).join("") + "</div>";
    } else {
      body = '<div class="fill-row">' +
        '<input id="fill-input" class="fill-input" type="text" autocomplete="off" placeholder="在这里写答案" value="' + U.escapeHtml(S.input || "") + '"' + (S.answered ? " disabled" : "") + " />" +
        (S.answered ? "" : '<button class="btn primary" data-action="submit-fill">提交</button>') +
        "</div>";
    }

    var fb = "";
    if (S.answered) {
      var right = S.lastCorrect;
      fb = '<div class="fb ' + (right ? "ok" : "bad") + '">' +
        '<div class="fb-head">' + (right ? "✓ 答对了" : "✗ 不对，看看原因") + "</div>" +
        '<div class="fb-why">' + U.renderRich(q.why || "") + "</div>" +
        (!right && !isChoice ? '<div class="fb-ans">正确答案：<b>' + U.escapeHtml((q.answer || []).join(" / ")) + "</b></div>" : "") +
        '<button class="btn primary" data-action="next-q">' + (S.i + 1 >= S.qs.length ? "看看结果" : "下一题") + "</button>" +
        "</div>";
    }

    var pct = Math.round(((S.i + (S.answered ? 1 : 0)) / S.qs.length) * 100);
    var h = (p && global.Hint) ? global.Hint.forPoint(p) : { tips: [], bullets: [] };
    var canHint = !!(p && (v || h.tips.length || h.bullets.length));
    var hintBtn = (canHint && !S.answered)
      ? '<button class="hint-btn" data-action="show-hint" data-id="' + p.id + '" title="卡住了？看提示">💡 提示</button>'
      : "";
    return '<div class="learn-wrap">' + head() +
      '<article class="card learn-card quiz">' +
      '<div class="quiz-top"><span>第 ' + (S.i + 1) + " / " + S.qs.length + " 题</span>" +
      '<span class="quiz-top-right"><span class="muted">' + (p ? U.escapeHtml(p.title) : "错题") + "</span>" + hintBtn + "</span></div>" +
      UI.bar(pct) + UI.passageBlock(p) +
      '<div class="q-stem">' + U.renderRich(q.stem) + "</div>" +
      body + fb +
      "</article></div>";
  }

  /* ---------- 结算 ---------- */
  function resultView() {
    var res = S.result || { xp: 0, before: 0, after: 0, acc: 0, due: "" };
    var total = S.results.length || 1;
    var correct = S.results.filter(Boolean).length;
    var perfect = correct === total;
    if (S.mode === "wrong") {
      return '<div class="learn-wrap">' + head() +
        '<article class="card result-card">' +
        UI.ring(Math.round((correct / total) * 100), 132, correct + "/" + total) +
        "<h2>错题重练完成</h2>" +
        '<p class="sub">' + (perfect ? "全对！这些题已经不会再绊倒你了。" : "把错的题再看一遍解析，明天它们还会出现。") + "</p>" +
        '<div class="result-grid">' +
        "<div><b>" + correct + "</b><span>答对</span></div>" +
        "<div><b>" + (total - correct) + "</b><span>仍需复习</span></div>" +
        "<div><b>" + E.wrongList().length + "</b><span>错题本剩余</span></div>" +
        "</div>" +
        '<div class="learn-actions"><a class="btn primary" href="#/home">回到今日</a>' +
        '<a class="btn ghost" href="#/review">看看错题本</a></div>' +
        "</article></div>";
    }
    var p = E.point(S.id);
    var ch = null;
    if (global.Forest) {
      ch = global.Forest.chapters().filter(function (c) { return c.subject === p.subject && c.grade === p.grade; })[0];
    }
    return '<div class="learn-wrap">' + head() +
      '<article class="card result-card">' +
      UI.ring(Math.round(res.acc * 100), 132, correct + "/" + total) +
      "<h2>" + (perfect ? "全对，稳！" : res.acc >= 0.6 ? "过关，继续加油" : "再练一遍会更牢") + "</h2>" +
      '<p class="sub">' + U.escapeHtml(p.title) + "</p>" +
      '<div class="result-grid">' +
      "<div><b>+" + res.xp + "</b><span>经验</span></div>" +
      "<div><b>" + res.before + "→" + res.after + "</b><span>掌握度</span></div>" +
      "<div><b>" + (res.interval || 1) + " 天</b><span>下次复习</span></div>" +
      "<div><b>" + U.clamp(Math.round(res.acc * 100), 0, 100) + "%</b><span>正确率</span></div>" +
      "</div>" +
      (ch ? '<a class="result-tree" href="#/forest">🌿 成长林：' + U.escapeHtml(ch.subjectName) + " " + ch.grade + " 年级 " +
        (ch.total - ch.learned > 0
          ? "已长 " + ch.learned + "/" + ch.total + " 片叶，还差 " + (ch.total - ch.learned) + " 片 →"
          : "叶子长满 " + ch.total + "/" + ch.total + "，就等它成树 →") + "</a>" : "") +
      (S.badges && S.badges.length ? '<div class="new-badges">' + S.badges.map(function (id) {
        var b = (global.BADGES || []).filter(function (x) { return x.id === id; })[0];
        return b ? '<span class="badge-pop">' + b.icon + " " + b.name + "</span>" : "";
      }).join("") + "</div>" : "") +
      '<div class="learn-actions">' +
      '<button class="btn primary" data-action="again">再练一遍</button>' +
      '<a class="btn ghost" href="#/home">回到今日</a>' +
      '<a class="btn ghost" href="#/map/' + p.subject + '">看知识地图</a>' +
      "</div></article></div>";
  }

  /* ---------- 对外 ---------- */
  Learn.render = function () {
    S = resume();
    if (!S) return global.Views.home();
    if (S.mode === "wrong") {
      if (S.step === "result") return resultView();
      if (!S.qs.length) return global.Views.home();
      return quizView();
    }
    var p = E.point(S.id);
    if (!p) return global.Views.home();
    if (S.step === "explain") return explainView(p);
    if (S.step === "example") return exampleView(p);
    if (S.step === "quiz") {
      if (!S.qs.length) return global.Views.home();
      return quizView();
    }
    return resultView();
  };

  Learn.toExample = function () {
    var p = E.point(S.id);
    var n = ((p.example || {}).steps || []).length;
    S.reveal = n ? 1 : 0;
    S.step = "example";
    global.App.render();
  };
  Learn.revealStep = function () {
    var p = E.point(S.id);
    var n = ((p.example || {}).steps || []).length;
    S.reveal = Math.min(n, S.reveal + 1);
    global.App.render();
  };
  Learn.toQuiz = function () { S.step = "quiz"; global.App.render(); };

  Learn.pick = function (idx) {
    if (S.answered) return;
    var item = S.qs[S.i];
    var q = item.q;
    var correct = idx === q.answer;
    S.answered = true; S.chosen = idx; S.lastCorrect = correct;
    S.results.push(correct);
    E.recordAnswer(item.pointId, item.pointId + "#" + item.qi, correct);
    if (correct) { U.beep("ok"); if (E.state().settings.anim) U.confetti(10); }
    else U.beep("bad");
    global.App.render();
  };

  Learn.submitFill = function (text) {
    if (S.answered) return;
    var item = S.qs[S.i];
    var q = item.q;
    S.input = text;
    var correct = U.sameAnswer(text, q.answer || []);
    S.answered = true; S.chosen = null; S.lastCorrect = correct;
    S.results.push(correct);
    E.recordAnswer(item.pointId, item.pointId + "#" + item.qi, correct);
    if (correct) { U.beep("ok"); if (E.state().settings.anim) U.confetti(10); }
    else U.beep("bad");
    global.App.render();
  };

  Learn.next = function () {
    if (S.i + 1 < S.qs.length) {
      S.i++; S.answered = false; S.chosen = null; S.input = ""; S.lastCorrect = null;
      global.App.render();
      return;
    }
    S.step = "result";
    if (S.mode === "wrong") {
      E.markDone("wrong", "all");
      E.saveNow();
      if (S.results.every(Boolean)) U.confetti(24);
    } else {
      var wasSeen = E.isSeen(S.id);
      var beforeM = E.mastery(S.id);
      var res = E.finishSession({
        pointId: S.id, results: S.results, mode: S.mode,
        seconds: Math.round((Date.now() - S.started) / 1000)
      });
      S.result = res;
      S.badges = res && res.badges ? res.badges : [];
      if (res && res.acc === 1) U.confetti(24);
      /* 成长林反馈：第一次学 → 长新叶；跨过 80% → 叶子长熟 */
      var pt2 = E.point(S.id);
      var subj2 = (global.SUBJECT_MAP || {})[pt2.subject] || { name: "" };
      if (!wasSeen) {
        setTimeout(function () { U.toast("🌿 " + subj2.name + " · " + pt2.grade + " 年级，长出一片新叶"); }, 500);
      } else if (beforeM < E.MASTERED && E.mastery(S.id) >= E.MASTERED) {
        setTimeout(function () { U.toast("🍃 这片叶子长熟了，这棵树离成树更近一步"); }, 500);
      }
    }
    global.App.render();
  };

  Learn.again = function () {
    if (S.mode === "wrong") Learn.startWrong();
    else start(S.id, "extra");
    global.App.render();
  };

  Learn.exit = function () {
    global.App.session = null;
    location.hash = "#/home";
    global.App.render();
  };

  Learn.start = start;
  Learn.startWrong = startWrong;
  Learn.session = function () { return S; };
  global.Learn = Learn;
})(window);
