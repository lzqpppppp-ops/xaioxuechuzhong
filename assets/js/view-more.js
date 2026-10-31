/* ===========================================================
   view-more.js — 错题本 / 中考 / 实验室 / 数据 / 设置 / 引导
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U, E = global.Engine, UI = global.UI;
  global.Views = global.Views || {};

  /* ============ 中考 ============ */
  global.Views.facts = function () {
    var f = global.EXAM_FACTS;
    var subs = global.SUBJECT_META || E.subjectsWithContent();
    var rows = f.rows.map(function (r) {
      return "<tr><td>" + U.escapeHtml(r.name) + "</td><td class=\"num\">" + r.score + "</td><td class=\"muted\">" + U.escapeHtml(r.note) + "</td></tr>";
    }).join("");
    var cover = subs.map(function (s) {
      var all = E.pointsOf(s.key).length;
      var m = E.masteredCount(s.key);
      var seen = E.seenCount(s.key);
      return '<div class="cover-row">' + UI.subjectTag(s.key) +
        '<div class="cover-bar">' + UI.bar(U.pct(m, all), s.color) + "</div>" +
        '<span class="muted">' + m + "/" + all + "</span></div>";
    }).join("");
    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">检验标准</p><h1>' + f.title + "</h1>" +
      '<p class="sub">' + U.escapeHtml(f.subtitle) + " · 总分 " + f.total + " 分</p></div>" +
      '<a class="btn primary" href="#/exam">做一次模拟考</a></header>' +

      '<section class="grid-2">' +
      '<div class="card"><div class="card-head"><h2>各科分值</h2><span class="muted">原始分</span></div>' +
      '<table class="table">' + rows + "</table></div>" +
      '<div class="card"><div class="card-head"><h2>成绩等级</h2><span class="muted">8 个等级</span></div>' +
      '<div class="grade-row">' + f.grades.map(function (g) { return '<span class="grade-chip">' + g + "</span>"; }).join("") + "</div>" +
      '<div class="card-head" style="margin-top:18px"><h2>我的覆盖度</h2></div>' + cover +
      "</div></section>" +

      '<section class="card"><div class="card-head"><h2>记住这几条</h2></div><ul class="notes">' +
      f.notes.map(function (n) { return "<li>" + U.escapeHtml(n) + "</li>"; }).join("") + "</ul></section>" +
      "</div>";
  };

  /* ============ 模拟考：设置页 ============ */
  global.Views.exam = function () {
    var subs = global.SUBJECT_META || E.subjectsWithContent();
    var cards = subs.map(function (s) {
      var all = E.pointsOf(s.key).length;
      var seen = E.seenCount(s.key);
      return '<button class="exam-subj" data-action="start-exam" data-key="' + s.key + '" style="--c:' + s.color + ';--bg:' + s.soft + '">' +
        '<span class="exam-subj-top">' + UI.subjectTag(s.key) + '<b>' + s.exam.score + " 分</b></span>" +
        "<h4>" + U.escapeHtml(s.name) + "模拟卷</h4>" +
        '<p class="muted">已学 ' + seen + "/" + all + " 个知识点 · " + s.exam.time + "</p>" +
        '<span class="btn tiny primary">开始</span></button>';
    }).join("");

    var hist = E.state().exams.slice(0, 6).map(function (r) {
      return "<tr><td>" + U.escapeHtml(r.subjectName) + '</td><td class="num">' + r.score + "/" + r.total +
        '</td><td><b class="g-' + r.grade.replace("+", "p") + '">' + r.grade + "</b></td><td class=\"muted\">" + r.date + "</td></tr>";
    }).join("");

    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">中考模拟</p><h1>按中考题型抽题，限时作答</h1>' +
      '<p class="sub">题目从你学过的知识点里抽，按正确率换成 A+ 到 E 的等级</p></div></header>' +
      '<div class="exam-grid">' + (cards || UI.empty("📝", "还没有可考的内容", "先去学几个知识点吧")) + "</div>" +
      (hist ? '<section class="card"><div class="card-head"><h2>最近成绩</h2></div><table class="table">' + hist + "</table></section>" : "") +
      "</div>";
  };

  /* ============ 模拟考：答题页 ============ */
  global.Views.examRun = function () {
    var X = global.App.exam;
    if (!X) return global.Views.exam();
    var item = X.qs[X.i];
    var q = item.q;
    var ans = X.answers[X.i];
    var body = "";
    if (q.type === "choice") {
      body = '<div class="opts">' + (q.options || []).map(function (o, idx) {
        return '<button class="opt' + (ans === idx ? " picked" : "") + '" data-action="exam-pick" data-i="' + idx + '">' +
          '<b class="opt-key">' + "ABCD".charAt(idx) + "</b><span>" + U.escapeHtml(o) + "</span></button>";
      }).join("") + "</div>";
    } else {
      body = '<div class="fill-row"><input id="exam-fill" class="fill-input" type="text" autocomplete="off" placeholder="在这里写答案" value="' +
        U.escapeHtml(ans == null ? "" : ans) + '" /></div>';
    }
    var nav = X.qs.map(function (_, i) {
      var cls = i === X.i ? "now" : X.answers[i] != null ? "done" : "";
      return '<button class="qdot ' + cls + '" data-action="exam-jump" data-i="' + i + '">' + (i + 1) + "</button>";
    }).join("");
    var mm = Math.floor(X.left / 60), ss = X.left % 60;
    return '<div class="page exam-run">' +
      '<div class="learn-bar"><button class="icon-btn" data-action="exam-quit">←</button>' +
      '<div class="learn-crumb">' + UI.subjectTag(X.key) + "<b>" + U.escapeHtml(X.subjectName) + "模拟卷</b></div>" +
      '<div class="timer" id="exam-timer">' + mm + ":" + (ss < 10 ? "0" + ss : ss) + "</div></div>" +
      '<article class="card learn-card quiz">' +
      '<div class="quiz-top"><span>第 ' + (X.i + 1) + " / " + X.qs.length + " 题</span><span class=\"muted\">不定项已排除，单选</span></div>" +
      '<div class="q-stem">' + U.renderRich(q.stem) + "</div>" + body +
      '<div class="exam-nav">' + nav + "</div>" +
      '<div class="learn-actions">' +
      (X.i > 0 ? '<button class="btn ghost" data-action="exam-prev">上一题</button>' : "") +
      (X.i + 1 < X.qs.length ? '<button class="btn primary" data-action="exam-next">下一题</button>' : '<button class="btn primary" data-action="exam-submit">交卷</button>') +
      '<button class="btn ghost" data-action="exam-submit">提前交卷</button>' +
      "</div></article></div>";
  };

  global.Views.examResult = function () {
    var R = global.App.examResult;
    if (!R) return global.Views.exam();
    var wrongs = R.detail.filter(function (d) { return !d.correct; });
    var seenPoints = {};
    return '<div class="page">' +
      '<div class="learn-bar"><button class="icon-btn" data-action="exam-quit">←</button>' +
      '<div class="learn-crumb">' + UI.subjectTag(R.key) + "<b>" + U.escapeHtml(R.subjectName) + "模拟卷结果</b></div></div>" +
      '<article class="card result-card">' +
      UI.ring(Math.round((R.score / R.total) * 100), 140, R.score + "/" + R.total) +
      '<div class="grade-big g-' + R.grade.replace("+", "p") + '">' + R.grade + "</div>" +
      '<p class="sub">正确率 ' + Math.round((R.score / R.total) * 100) + "% · 用时 " + R.used + " 分 " + R.usedSec + " 秒</p>" +
      '<div class="result-grid"><div><b>' + R.score + "</b><span>答对</span></div><div><b>" + (R.total - R.score) + "</b><span>答错</span></div><div><b>" + R.grade + "</b><span>等级</span></div></div>" +
      '<div class="learn-actions"><a class="btn primary" href="#/exam">再考一次</a><a class="btn ghost" href="#/home">回到今日</a></div>' +
      "</article>" +
      (wrongs.length ? '<section class="card"><div class="card-head"><h2>错题回顾</h2><span class="muted">' + wrongs.length + " 题</span></div>" +
        wrongs.map(function (d) {
          var extra = "";
          var p = E.point(d.point);
          if (p && !seenPoints[p.id] && UI.isPassage && UI.isPassage(p)) { seenPoints[p.id] = 1; extra = UI.passageBlock(p); }
          return '<div class="rev-q">' + extra + '<p class="rev-stem">' + U.renderRich(d.q.stem) + "</p>" +
            '<p class="rev-line">你答：<b class="bad">' + U.escapeHtml(d.given) + "</b> · 正确：<b class=\"ok\">" + U.escapeHtml(d.right) + "</b></p>" +
            '<p class="rev-why">' + U.renderRich(d.q.why || "") + "</p></div>";
        }).join("") + "</section>" : '<section class="card">' + UI.empty("🎉", "全对！", "这张卷子没有错题，可以挑战更多知识点后再来。") + "</section>") +
      "</div>";
  };

  /* ============ 错题本 ============ */
  global.Views.review = function () {
    var list = E.wrongList();
    var byPoint = {};
    list.forEach(function (w) { (byPoint[w.pointId] = byPoint[w.pointId] || []).push(w); });
    var ids = Object.keys(byPoint);
    var body = ids.map(function (pid) {
      var p = E.point(pid);
      var items = byPoint[pid];
      return '<div class="rev-group"><div class="rev-head">' + UI.subjectTag(p.subject) + "<b>" + U.escapeHtml(p.title) + "</b>" +
        '<span class="muted">' + items.length + " 道</span></div>" + (UI.passageBlock ? UI.passageBlock(p) : "") +
        items.map(function (w) {
          var qi = parseInt(String(w.qid).split("#")[1], 10) || 0;
          var q = p.quiz[qi];
          if (!q) return "";
          return '<div class="rev-q"><p class="rev-stem">' + U.renderRich(q.stem) + "</p>" +
            '<p class="rev-line">正确答案：<b class="ok">' + U.escapeHtml(q.type === "choice" ? (q.options[q.answer] || "") : (q.answer || []).join(" / ")) + "</b></p>" +
            '<p class="rev-why">' + U.renderRich(q.why || "") + "</p>" +
            '<button class="btn tiny" data-action="start-wrong-one" data-id="' + p.id + '" data-qi="' + qi + '">只练这题</button></div>';
        }).join("") + "</div>";
    }).join("");

    var total = list.length;
    var hasAny = total > 0;
    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">错题本</p><h1>做错的题，正是提分的地方</h1>' +
      '<p class="sub">共 ' + total + " 道 · 答对一次就自动移出</p></div>" +
      (list.length ? '<button class="btn primary" data-action="start-wrong">重练知识点错题</button>' : "") +
      "</header>" +
      (hasAny ? body
        : '<div class="card">' + UI.empty("✨", "错题本是空的", "说明你最近答得不错，继续保持。", '<a class="btn ghost" href="#/home">回到今日任务</a>') + "</div>") +
      "</div>";
  };

  /* ============ 实验室 ============ */
  global.Views.lab = function () {
    var items = [
      { key: "numberline", title: "数轴", desc: "拖圆点看正负与绝对值" },
      { key: "cube", title: "正方体", desc: "旋转观察相对面与展开图" },
      { key: "function", title: "函数图象", desc: "拖参数看一次 / 二次 / 反比例", type: "linear" },
      { key: "views", title: "三视图", desc: "点俯视图加高，对照三视图" },
      { key: "circle", title: "圆", desc: "圆心角、弧长与圆周角" },
      { key: "rotation", title: "旋转", desc: "旋转中心、方向与角度" },
      { key: "refraction", title: "光的折射", desc: "拖入射光，观察折射角" },
      { key: "seasons", title: "地球公转", desc: "沿轨道拖地球，看四季变化" }
    ];
    var cards = items.map(function (it) {
      var hint = (global.Viz && global.Viz.hint) ? global.Viz.hint(it.key) : "";
      return '<section class="card lab-card">' +
        '<div class="lab-head"><h2>' + U.escapeHtml(it.title) + '</h2><span class="muted">' + U.escapeHtml(it.desc) + "</span></div>" +
        (hint ? '<p class="sub">' + U.escapeHtml(hint) + "</p>" : "") +
        '<div class="viz" data-viz="' + it.key + '"' + (it.type ? ' data-viz-type="' + it.type + '"' : "") + "></div>" +
        "</section>";
    }).join("");
    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">实验室</p><h1>动手看，比死记更牢</h1>' +
      '<p class="sub">8 个可交互图形：拖一拖、点一点，图上的数字和关系会跟着变</p></div></header>' +
      '<div class="lab-grid">' + cards + "</div></div>";
  };

  /* ============ 数据 / 成就 ============ */
  global.Views.stats = function () {
    var st = E.state();
    var lv = E.levelInfo();
    var mastered = E.masteredCount();
    var seen = E.seenCount();
    var all = (global.C && global.C.all ? global.C.all.length : 0) || seen;
    try { if (E.pointsOf) { all = 0; E.subjectsWithContent().forEach(function (s) { all += E.pointsOf(s.key).length; }); } } catch (e) {}
    var wrongN = E.wrongList().length;
    var subs = E.subjectsWithContent().map(function (s) {
      var a = E.pointsOf(s.key).length;
      var m = E.masteredCount(s.key);
      return '<div class="cover-row">' + UI.subjectTag(s.key) +
        '<div class="cover-bar">' + UI.bar(U.pct(m, a), s.color) + "</div>" +
        '<span class="muted">' + m + "/" + a + "</span></div>";
    }).join("");
    var badges = (global.BADGES || []).map(function (b) {
      var got = !!(st.badges && st.badges[b.id]);
      return '<div class="card stat" style="opacity:' + (got ? "1" : ".45") + '"><b>' + U.escapeHtml(b.icon || "🏅") + " " + U.escapeHtml(b.name) + "</b>" +
        "<span>" + U.escapeHtml(b.desc) + (got ? " · 已获得" : "") + "</span></div>";
    }).join("");
    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">我的数据</p><h1>' + U.escapeHtml((st.profile && st.profile.name) || "同学") + "的学习档案</h1>" +
      '<p class="sub">' + lv.name + " Lv." + lv.level + " · " + st.xp + " EXP · 连续 " + ((st.streak && st.streak.days) || 0) + " 天</p></div></header>" +
      '<section class="grid-2">' +
      '<div class="card stat"><b>' + mastered + "</b><span>已掌握知识点</span></div>" +
      '<div class="card stat"><b>' + seen + "</b><span>已学过</span></div>" +
      '<div class="card stat"><b>' + wrongN + "</b><span>错题本</span></div>" +
      '<div class="card stat"><b>' + ((st.exams && st.exams.length) || 0) + "</b><span>模拟考次数</span></div>" +
      "</section>" +
      '<section class="card"><div class="card-head"><h2>等级进度</h2><span class="muted">' + lv.into + " / " + (lv.next ? (lv.next - (lv.next - lv.span)) : "—") + "</span></div>" +
      UI.bar(lv.pct) + '<p class="sub" style="margin-top:8px">再获得 ' + (lv.next ? (lv.next - st.xp) : 0) + " EXP 升到下一级</p></section>" +
      '<section class="card"><div class="card-head"><h2>各科掌握</h2></div>' + subs + "</section>" +
      '<section class="card"><div class="card-head"><h2>徽章</h2><span class="muted">' + Object.keys(st.badges || {}).length + " / " + (global.BADGES || []).length + "</span></div>" +
      '<div class="grid-2">' + badges + "</div></section>" +
      "</div>";
  };

  /* ============ 设置 ============ */
  global.Views.settings = function () {
    var st = E.state();
    var p = st.profile || { name: "", grade: 7, dailyMinutes: 25 };
    var s = st.settings || { sound: true, anim: true };
    var grades = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (g) {
      return '<button class="grade-pick' + (Number(p.grade) === g ? " on" : "") + '" data-action="set-grade" data-g="' + g + '"><b>' + g + "</b><span>" + (g <= 6 ? "小学" : "初中") + "</span></button>";
    }).join("");
    var mins = [15, 25, 40].map(function (m) {
      return '<button class="ob-min' + (Number(p.dailyMinutes) === m ? " on" : "") + '" data-action="set-minutes" data-m="' + m + '"><b>' + m + " 分钟</b></button>";
    }).join("");
    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">设置</p><h1>学习偏好与数据</h1>' +
      '<p class="sub">本机始终可离线学习；登录后进度还会同步到云端（可换设备）</p></div></header>' +

      '<section class="card"><div class="card-head"><h2>个人资料</h2></div>' +
      '<label class="field"><span>昵称</span><input id="set-name" type="text" maxlength="12" value="' + U.escapeHtml(p.name || "") + '" /></label>' +
      '<div class="field"><span>年级</span><div class="grade-grid">' + grades + "</div></div>" +
      '<div class="field"><span>每天学习时长</span><div class="ob-mins">' + mins + "</div></div>" +
      '<button class="btn primary" data-action="save-profile">保存资料</button></section>' +

      '<section class="card"><div class="card-head"><h2>体验</h2></div>' +
      '<div class="field" style="display:flex;align-items:center;justify-content:space-between;gap:12px">' +
      "<div><b>音效</b><p class=\"sub\">答对答错时的提示音</p></div>" +
      '<button class="switch' + (s.sound ? " on" : "") + '" data-action="toggle-sound" aria-label="音效"><i></i></button></div>' +
      '<div class="field" style="display:flex;align-items:center;justify-content:space-between;gap:12px">' +
      "<div><b>动效</b><p class=\"sub\">撒花与过渡动画</p></div>" +
      '<button class="switch' + (s.anim !== false ? " on" : "") + '" data-action="toggle-anim" aria-label="动效"><i></i></button></div>' +
      "</section>" +

      '<section class="card" id="auth-settings-card"><div class="card-head"><h2>云端账号</h2><span class="muted">可选</span></div>' +
      '<p class="sub" id="auth-settings-status">未登录：进度仅保存在本机。</p>' +
      '<div class="learn-actions auth-settings-row">' +
      '<button type="button" class="btn primary" id="auth-settings-login" data-action="auth-login">登录 / 注册</button>' +
      '<button type="button" class="btn ghost" id="auth-settings-logout" data-action="auth-logout" hidden>退出登录</button>' +
      '<button type="button" class="btn ghost" id="auth-settings-sync" data-action="auth-sync" hidden>立即同步</button>' +
      '</div></section>' +

      '<section class="card"><div class="card-head"><h2>数据备份</h2></div>' +
      '<p class="sub">导出一个 JSON 文件；换电脑或重装浏览器后，在这里导入即可恢复。</p>' +
      '<div class="learn-actions">' +
      '<button class="btn primary" data-action="export">导出进度</button>' +
      '<label class="btn ghost" style="cursor:pointer">导入进度<input id="import-file" type="file" accept="application/json,.json" style="display:none" /></label>' +
      "</div></section>" +

      '<section class="card"><div class="card-head"><h2>危险操作</h2></div>' +
      '<p class="sub">清空本机全部学习进度，不可恢复（除非你事先导出过）。</p>' +
      '<button class="btn danger" data-action="reset">清空全部进度</button></section>' +
      "</div>";
  };

  /* ============ 首次引导 ============ */
  global.Views.onboarding = function () {
    var ob = (global.App && global.App.ob) || { grade: 7, minutes: 25 };
    var grades = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (g) {
      return '<button class="grade-pick' + (ob.grade === g ? " on" : "") + '" data-action="ob-grade" data-g="' + g + '"><b>' + g + "</b><span>" + (g <= 6 ? "小学" : "初中") + "</span></button>";
    }).join("");
    var mins = [15, 25, 40].map(function (m, i) {
      return '<button class="ob-min' + (ob.minutes === m ? " on" : "") + '" data-action="ob-min" data-m="' + m + '"><b>' + m + " 分钟</b><span>" +
        (i === 0 ? "轻量，2 个知识点" : i === 1 ? "标准，3 个知识点" : "冲刺，4-5 个知识点") + "</span></button>";
    }).join("");
    return '<div class="onboard">' +
      '<div class="ob-card card">' +
      '<p class="eyebrow">开始之前，30 秒设置</p>' +
      "<h1>你的中考学习计划</h1>" +
      '<p class="sub">按广西中考的知识范围，从小学到初中由浅入深。每天完成一组任务，进度自动保存在本机。</p>' +
      '<label class="field"><span>怎么称呼你</span><input id="ob-name" type="text" maxlength="12" placeholder="输入昵称，比如「小宇」" /></label>' +
      '<div class="field"><span>现在读几年级</span><div class="grade-grid">' + grades + "</div></div>" +
      '<div class="field"><span>每天能学多久</span><div class="ob-mins">' + mins + "</div></div>" +
      '<button class="btn primary big" data-action="ob-start">生成我的今日任务</button>' +
      '<p class="hint">进度默认保存在本机；登录后可云端同步。换设备前也可在「设置」里导出备份。</p>' +
      "</div></div>";
  };
})(window);
