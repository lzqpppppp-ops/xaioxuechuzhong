/* ===========================================================
   view-papers.js — 真题库：卷子列表 + 逐题作答 + 对答案
   =========================================================== */
(function (global) {
  "use strict";
  var U = global.U, E = global.Engine, UI = global.UI;
  global.Views = global.Views || {};

  var SUBJ_COLOR = {
    chinese: "#D9534F", math: "#2F6BFF", english: "#0F9B8E", physics: "#6C5CE7",
    chemistry: "#E8890C", biology: "#3E9B4F", geography: "#1F7A8C",
    history: "#8A6D3B", civics: "#C2410C"
  };
  var showAll = false;

  function index() { return global.EXAM_INDEX || []; }

  function rootPrefix() {
    return /\/tools\//.test(location.pathname.replace(/\\/g, "/")) ? "../" : "";
  }
  function fixSrc(html) {
    if (!html) return "";
    var pre = rootPrefix();
    return pre ? html.replace(/src="assets\//g, 'src="' + pre + 'assets/') : html;
  }

  function paperState(id) {
    var st = E.state();
    if (!st.papers) st.papers = {};
    if (!st.papers[id]) st.papers[id] = { answers: {}, notes: {}, flags: {}, checked: {}, wrong: {}, updated: null, submitted: false, submittedAt: null };
    if (!st.papers[id].checked) st.papers[id].checked = {};
    if (!st.papers[id].wrong) st.papers[id].wrong = {};
    if (st.papers[id].submitted == null) st.papers[id].submitted = false;
    return st.papers[id];
  }

  function videoMeta(id) {
    var map = global.PAPER_VIDEOS || {};
    var m = map[id];
    if (!m) return null;
    if (m.audio || m.audioSrc || m.bvid) return m;
    return null;
  }

  function mediaAudioSrc(meta) {
    if (!meta) return "";
    var raw = meta.audio || meta.audioSrc || "";
    if (!raw) return "";
    var pre = rootPrefix();
    if (pre && raw.indexOf("assets/") === 0) return pre + raw;
    return raw;
  }

  function isAudioMedia(meta) {
    return !!(meta && (meta.audio || meta.audioSrc));
  }

  function isLoggedIn() {
    return !!(global.ZkAuth && typeof global.ZkAuth.getUser === "function" && global.ZkAuth.getUser());
  }

  /** unlock:"open" 进卷即播；默认/submit = 登录且已交卷 */
  function videoUnlockMode(meta) {
    var u = meta && meta.unlock;
    return u === "open" ? "open" : "submit";
  }

  function videoUnlocked(id) {
    var meta = videoMeta(id);
    if (!meta) return false;
    if (videoUnlockMode(meta) === "open") return true;
    var ps = paperState(id);
    return isLoggedIn() && !!ps.submitted;
  }

  function allQuestionsDone(id) {
    var P = global.EXAM_PAPERS && global.EXAM_PAPERS[id];
    var ps = paperState(id);
    if (!P || !P.questions || !P.questions.length) return false;
    for (var i = 0; i < P.questions.length; i++) {
      var q = P.questions[i];
      var ans = ps.answers[q.n];
      var note = ps.notes[q.n];
      if (!(ans || (note && String(note).trim()))) return false;
    }
    return true;
  }

  function playerUrl(bvid) {
    return "https://player.bilibili.com/player.html?bvid=" + encodeURIComponent(bvid) +
      "&page=1&high_quality=1&danmaku=0";
  }

  function videoBlockHtml(id) {
    var meta = videoMeta(id);
    if (!meta) return "";
    var unlocked = videoUnlocked(id);
    var mode = videoUnlockMode(meta);
    var audioSrc = mediaAudioSrc(meta);
    var isAudio = isAudioMedia(meta);
    var bvid = meta.bvid ? String(meta.bvid).replace(/[^A-Za-z0-9]/g, "") : "";
    if (!isAudio && !bvid) return "";
    var title = U.escapeHtml(meta.title || (isAudio ? "听力音频" : "视频讲解"));
    var eyebrow = U.escapeHtml(meta.label || (isAudio ? "听力音频" : "视频讲解"));
    var lockHint = !isLoggedIn()
      ? "完成整卷交卷并登录后解锁"
      : (paperState(id).submitted ? "请重新登录后查看" : "完成整卷交卷并登录后解锁");
    var actions = "";
    if (unlocked && !isAudio && bvid) {
      actions = '<div class="pv-head-actions">' +
        '<button type="button" class="btn primary tiny" data-action="paper-video-play" data-id="' + U.escapeHtml(id) + '">放大播放</button></div>';
    }
    var body;
    if (unlocked && isAudio) {
      body =
        '<div class="pv-audio">' +
        '<audio class="pv-audio-el" controls preload="metadata" controlslist="nodownload" ' +
        'src="' + U.escapeHtml(audioSrc) + '" title="' + title + '">您的浏览器不支持音频播放</audio>' +
        '</div>' +
        '<p class="pv-tip muted">进卷即可收听。音频托管在本站，不经过 B 站，不会打开新标签。</p>' +
        '<div class="pv-audio-sticky" hidden>' +
        '<div class="pv-audio-sticky-inner">' +
        '<span class="pv-audio-sticky-label">' + eyebrow + '</span>' +
        '<audio class="pv-audio-sticky-el" controls preload="none" controlslist="nodownload"></audio>' +
        '</div></div>';
    } else if (unlocked && bvid) {
      var player = playerUrl(bvid);
      body =
        '<div class="pv-frame">' +
        '<iframe src="' + player + '" title="' + title + '" allowfullscreen="true" ' +
        'referrerpolicy="no-referrer-when-downgrade" ' +
        'allow="fullscreen; encrypted-media; autoplay" scrolling="no" border="0" frameborder="no" framespacing="0"></iframe>' +
        "</div>" +
        '<p class="pv-tip muted">' + (mode === "open"
          ? "进卷即可收听/观看。需要登录 B 站解锁清晰度时，点「放大播放」在弹层内完成；本站不会新开标签跳转。"
          : "点「放大播放」全屏观看；清晰度 / 大会员请在播放器内用 B 站账号登录，本站不收集密码、不跳转外链。") + "</p>";
    } else {
      body =
        '<div class="pv-locked">' +
        '<div class="pv-locked-inner"><span class="pv-lock-ico">🔒</span><b>' + lockHint + "</b>" +
        '<p class="muted">先登录，做完整卷后点「交卷」；解锁后永久可用本账号' + (isAudio ? "收听" : "观看") + "。</p></div></div>";
    }
    return '<section class="paper-video' + (isAudio ? " is-audio" : "") + (mode === "open" ? " is-open" : "") + '" data-paper-video="' + U.escapeHtml(id) + '" data-unlock="' + mode + '"' + (isAudio ? ' data-media="audio"' : ' data-media="video"') + '>' +
      '<div class="pv-head"><div><p class="eyebrow">' + eyebrow + "</p><h2>" + title + "</h2></div>" +
      actions + "</div>" +
      body +
      "</section>";
  }

  function submitBarHtml(id) {
    var ps = paperState(id);
    var pr = progress(id);
    var doneAll = allQuestionsDone(id);
    if (ps.submitted) {
      return '<div class="paper-submit is-done">' +
        '<span class="ps-ok">✓ 已交卷</span>' +
        '<span class="muted">已做 ' + pr.done + "/" + pr.total +
        (pr.correct ? " · 对 " + pr.correct : "") +
        (ps.submittedAt ? " · " + String(ps.submittedAt).slice(0, 10) : "") +
        "</span></div>";
    }
    var vm = videoMeta(id);
    var needsSubmitVideo = vm && videoUnlockMode(vm) === "submit";
    var hint;
    if (!doneAll) hint = "还需作答 " + (pr.total - pr.done) + " 题后再交卷";
    else if (!isLoggedIn()) hint = "交卷需先登录；进度会写入云端";
    else if (needsSubmitVideo) hint = "交卷后解锁本卷" + (vm.label || "视频讲解") + "（进度同步到云端）";
    else hint = "交卷后进度同步到云端";
    return '<div class="paper-submit">' +
      '<button class="btn primary" data-action="paper-submit" data-id="' + U.escapeHtml(id) + '"' +
      (doneAll ? "" : " disabled") + ">交卷</button>" +
      '<span class="muted">' + hint + "</span></div>";
  }

  function ansOf(id, n) {
    var A = global.EXAM_ANSWERS && global.EXAM_ANSWERS[id];
    return A ? A[String(n)] : null;
  }
  function isSingle(a) { return /^[A-D]$/.test(String(a || "")); }
  function isMulti(a) { return /^[A-D]{2,4}$/.test(String(a || "")); }
  function sameSet(sel, ans) {
    var x = String(sel || "").split("").sort().join("");
    var y = String(ans || "").split("").sort().join("");
    return x !== "" && x === y;
  }
  function plain(h) {
    return String(h || "").replace(/<img[^>]*>/g, "[图]").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  /* 答错时留一份快照到错题本；答对则移出；只看了答案没作答（null）不记 */
  function recordWrong(id, n, ok) {
    var ps = paperState(id);
    var P = global.EXAM_PAPERS && global.EXAM_PAPERS[id];
    var q = P && P.questions.filter(function (x) { return x.n === n; })[0];
    var A = ansOf(id, n);
    if (ok === false && q && A) {
      ps.wrong[n] = {
        at: U.today(),
        your: ps.answers[n] || "",
        correct: isSingle(A.a) || isMulti(A.a) ? String(A.a) : (Array.isArray(A.a) ? A.a.join(" / ") : "见解析"),
        stem: plain(q.stem).slice(0, 130),
        why: String(A.why || "").slice(0, 180),
        subject: P.subject, title: P.title,
        subjective: !!A.subjective
      };
    } else if (ok === true) {
      delete ps.wrong[n];
    }
    E.save();
  }

  function progress(id) {
    var P = global.EXAM_PAPERS && global.EXAM_PAPERS[id];
    var ps = paperState(id);
    if (!P) return { done: 0, total: 0, correct: 0 };
    var done = 0, correct = 0;
    P.questions.forEach(function (q) {
      if (ps.answers[q.n] || (ps.notes[q.n] && ps.notes[q.n].trim())) done++;
      var ck = ps.checked[q.n];
      if (ck && ck.ok === true) correct++;
    });
    return { done: done, total: P.questions.length, correct: correct };
  }

  function ensurePaper(id, cb) {
    if (global.EXAM_PAPERS && global.EXAM_PAPERS[id]) return cb(true);
    var s = document.createElement("script");
    s.src = "data/papers/" + id + ".js";
    s.onload = function () { cb(true); };
    s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  }
  function ensureAnswers(id, cb) {
    if (global.EXAM_ANSWERS && global.EXAM_ANSWERS[id]) return cb(true);
    var s = document.createElement("script");
    s.src = "data/papers/answers/" + id + ".js";
    s.onload = function () { cb(true); };
    s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  }

  /* ---------------- 列表 ---------------- */
  global.Views.papers = function () {
    var list = index();
    if (!list.length) {
      return '<div class="page">' + UI.empty("📄", "还没有导入真题", "把 docx 放进 ziliao/按科目整理，再运行 tools/build-papers.py。") + "</div>";
    }
    var years = {};
    list.forEach(function (p) { (years[p.year] = years[p.year] || []).push(p); });
    var order = Object.keys(years).map(Number).sort(function (a, b) { return b - a; });
    var totalQ = list.reduce(function (n, p) { return n + p.questions; }, 0);
    var allDone = 0, allCorrect = 0;
    list.forEach(function (p) { var pr = progress(p.id); allDone += pr.done; allCorrect += pr.correct; });

    var body = order.map(function (y) {
      var cards = years[y].map(function (p) {
        var pr = progress(p.id);
        var pct = pr.total ? Math.round((pr.done / pr.total) * 100) : 0;
        return '<a class="paper-card" href="#/papers/' + p.id + '" style="--c:' + (SUBJ_COLOR[p.subject] || "#2F6BFF") + '">' +
          '<span class="paper-subj">' + U.escapeHtml(p.subjectName) + "</span>" +
          "<b>" + p.questions + " 题</b>" +
          '<span class="paper-meta">' + (p.withOptions ? p.withOptions + " 道选择" : "阅读/解答") + "</span>" +
          UI.bar(pct, SUBJ_COLOR[p.subject]) +
          '<span class="paper-done">' + (pr.done ? "已做 " + pr.done + "/" + pr.total + (pr.correct ? " · 对 " + pr.correct : "") : "未开始") + "</span></a>";
      }).join("");
      return '<section class="paper-year"><div class="paper-year-head"><h2>' + y + " 年</h2><span class=\"muted\">" +
        years[y].length + " 套</span></div><div class=\"paper-grid\">" + cards + "</div></section>";
    }).join("");

    return '<div class="page">' +
      '<header class="page-head"><div><p class="eyebrow">真题库</p><h1>历年广西中考真题，逐题做</h1>' +
      '<p class="sub">共 ' + list.length + " 套 " + totalQ + " 题（2023–2026 统考卷）· 已做 " + allDone +
      " 题" + (allCorrect ? " · 答对 " + allCorrect : "") + "</p></div></header>" +
      body +
      '<p class="viz-note">试卷由 Word 原卷自动拆题生成，公式和插图都保留了图片；个别排版可能需要对照原卷。</p>' +
      "</div>";
  };

  /* ---------------- 单套 ---------------- */
  function answerBlock(A, ck, q, ps) {
    if (!A) return "";
    var single = isSingle(A.a), multi = isMulti(A.a);
    var conf = A.conf || "high";
    var confText = conf === "high" ? "较确定" : conf === "mid" ? "把握一般" : "存疑，请核对原卷";
    var head;
    if (single || multi) {
      head = "参考答案：" + (multi ? String(A.a).split("").join("、") : A.a);
      if (ck && ck.ok === true) head += ' <em class="pa-ok">✓ 你答对了</em>';
      else if (ck && ck.ok === false) head += ' <em class="pa-bad">✗ 你选的是 ' + (ps.answers[q.n] || "未选") + "</em>";
    } else if (Array.isArray(A.a)) {
      head = "参考答案：" + A.a.join(" / ");
    } else {
      head = "参考答案（主观题）";
    }
    var body = A.a && !single && !multi && !Array.isArray(A.a) ? '<div class="pa-text">' + U.escapeHtml(A.a).replace(/\n/g, "<br>") + "</div>" : "";
    var self = ((!single && !multi) || (ck && ck.ok === null)) && A.subjective !== false
      ? '<div class="pa-self">自评：<button data-action="paper-self" data-id="' + q._pid + '" data-n="' + q.n + '" data-ok="1">答对了</button>' +
      '<button data-action="paper-self" data-id="' + q._pid + '" data-n="' + q.n + '" data-ok="0">没答对</button></div>'
      : "";
    return '<div class="pq-answer ' + (ck && ck.ok === true ? "ok" : ck && ck.ok === false ? "bad" : "") + '">' +
      '<div class="pa-head">' + head + '<span class="pa-conf conf-' + conf + '">' + confText + "</span>" +
      (A.fig ? '<span class="pa-fig">依赖原图</span>' : "") + "</div>" +
      body +
      (A.why ? '<div class="pa-why"><b>解析</b>' + U.escapeHtml(A.why) + "</div>" : "") +
      self + "</div>";
  }

  function questionHtml(q, P, ps) {
    q._pid = P.id;
    var ans = ps.answers[q.n];
    var flag = ps.flags[q.n];
    var ck = ps.checked[q.n];
    var A = ansOf(P.id, q.n);
    var material = fixSrc((q.material || []).join(""));
    var blocks = q.blocks || [];
    var stem = fixSrc((q.stem || "").replace(/^\s*\d{1,2}\s*[.．、]\s*/, ""));
    var hasOpts = (q.options || []).length >= 2;
    var imgBlocks = [], restBlocks = [];
    blocks.forEach(function (b) {
      if (hasOpts && /^(\s*(<img[^>]*>|<br\s*\/?>)\s*)+$/.test(b)) imgBlocks.push(fixSrc(b));
      else restBlocks.push(fixSrc(b));
    });
    var opts = (q.options || []).map(function (o) {
      var on = String(ans || "").indexOf(o.k) >= 0;
      return '<button class="pq-opt' + (on ? " on" : "") + '" data-action="paper-pick" data-id="' + P.id +
        '" data-n="' + q.n + '" data-k="' + o.k + '"><b>' + o.k + "</b><span>" + fixSrc(o.html) + "</span></button>";
    }).join("");
    var note = ps.notes[q.n] || "";
    var reveal = !!A && (!!ck || showAll);
    return '<article class="pq' + (ck && ck.ok === true ? " is-ok" : ck && ck.ok === false ? " is-bad" : "") + '" id="pq-' + q.n + '">' +
      '<div class="pq-head"><span class="pq-no">' + q.n + "</span>" +
      '<span class="pq-sec"></span>' +
      (A ? '<button class="pq-check" data-action="paper-check" data-id="' + P.id + '" data-n="' + q.n + '">' + (reveal ? "收起答案" : "对答案") + "</button>" : "") +
      '<button class="pq-flag' + (flag ? " on" : "") + '" data-action="paper-flag" data-id="' + P.id + '" data-n="' + q.n + '" title="标记这题">' + (flag ? "★ 已标记" : "☆ 标记") + "</button></div>" +
      (material ? '<div class="pq-material">' + material + "</div>" : "") +
      (q._ref ? '<div class="pq-ref">本题材料见第 <b>' + q._ref + '</b> 题 ↑</div>' : "") +
      '<div class="pq-stem">' + stem + "</div>" +
      (imgBlocks.length ? '<div class="pq-extra">' + imgBlocks.join("") + "</div>" : "") +
      (opts ? '<div class="pq-opts">' + opts + "</div>" : "") +
      (restBlocks.length ? '<div class="pq-extra">' + restBlocks.join("") + "</div>" : "") +
      (reveal ? answerBlock(A, ck, q, ps) : "") +
      '<div class="pq-note"><textarea data-paper-note="' + P.id + '" data-n="' + q.n + '" rows="2" placeholder="' +
      (opts ? "记一笔：思路、易错点…（可留空）" : "写下你的解答要点…") + '">' + U.escapeHtml(note) + "</textarea></div>" +
      "</article>";
  }

  global.Views.paper = function (id) {
    var P = global.EXAM_PAPERS && global.EXAM_PAPERS[id];
    if (!P) {
      ensurePaper(id, function (ok) {
        if (!ok) U.toast("这套卷子加载失败");
        global.App.render();
      });
      return '<div class="page">' + UI.empty("⏳", "正在载入试卷…", "") + "</div>";
    }
    var hasAns = !!(global.EXAM_ANSWERS && global.EXAM_ANSWERS[id]);
    if (!hasAns) {
      ensureAnswers(id, function (ok) {
        if (ok) global.App.render();
      });
    }
    var ps = paperState(id);
    var pr = progress(id);
    var nav = P.questions.map(function (q) {
      var ck = ps.checked[q.n];
      var cls = ps.answers[q.n] || ps.notes[q.n] ? "done" : "";
      if (ck && ck.ok === true) cls += " ok";
      if (ck && ck.ok === false) cls += " bad";
      if (ps.flags[q.n]) cls += " flag";
      return '<a class="pq-dot ' + cls + '" href="#/papers/' + id + '" data-action="paper-jump" data-n="' + q.n + '">' + q.n + "</a>";
    }).join("");

    var body = [];
    var lastSec = "";
    var lastMat = {};
    P.questions.forEach(function (q) {
      var sec = q.section || "";
      if (sec !== lastSec) {
        lastSec = sec;
        if (sec) body.push('<div class="pq-section">' + U.escapeHtml(sec) + "</div>");
      }
      var hasMat = (q.material || []).length > 0;
      if (hasMat) lastMat[sec] = q.n;
      q._ref = 0;
      if (!hasMat && lastMat[sec] && /语段|材料|上文|短文|图中|如图|下表|右图/.test(q.stem || "")) {
        q._ref = lastMat[sec];
      }
      body.push(questionHtml(q, P, ps));
    });

    return '<div class="page paper-reader">' +
      '<div class="paper-bar">' +
      '<a class="icon-btn" href="#/papers">←</a>' +
      '<div class="paper-bar-title"><b>' + U.escapeHtml(P.title) + '</b><span class="muted">' + P.questions.length + " 题</span></div>" +
      '<div class="paper-bar-prog">已做 ' + pr.done + "/" + pr.total + (pr.correct ? " · 对 " + pr.correct : "") + "</div>" +
      "</div>" +
      '<div class="pq-nav">' + nav + "</div>" +
      '<div class="paper-hint">' + (hasAns
        ? "参考答案已就位：选完点「对答案」看解析；解答题给参考答案，自己评「答对了 / 没答对」。"
        : "这套的参考答案还没生成，先把答案选上、难题点 ☆ 标记。") +
      ' <button class="pa-toggle" data-action="paper-showall">' + (showAll ? "隐藏全部答案" : "显示全部答案") + "</button></div>" +
      ((videoMeta(id) && videoUnlockMode(videoMeta(id)) === "open") ? videoBlockHtml(id) : "") +
      body.join("") +
      ((videoMeta(id) && videoUnlockMode(videoMeta(id)) !== "open") ? videoBlockHtml(id) : "") +
      submitBarHtml(id) +
      '<div class="paper-end"><a class="btn ghost" href="#/papers">← 返回真题库</a></div>' +
      "</div>";
  };

  /* ---------------- 交互 ---------------- */
  function refresh(id, n) {
    var ps = paperState(id);
    var art = document.getElementById("pq-" + n);
    if (art) {
      Array.prototype.forEach.call(art.querySelectorAll(".pq-opt"), function (b) {
        b.classList.toggle("on", String(ps.answers[n] || "").indexOf(b.getAttribute("data-k")) >= 0);
      });
      var ck = ps.checked[n];
      art.classList.toggle("is-ok", !!(ck && ck.ok === true));
      art.classList.toggle("is-bad", !!(ck && ck.ok === false));
    }
    var pr = progress(id);
    var el = document.querySelector(".paper-bar-prog");
    if (el) el.textContent = "已做 " + pr.done + "/" + pr.total + (pr.correct ? " · 对 " + pr.correct : "");
    var dot = document.querySelector('.pq-dot[data-n="' + n + '"]');
    if (dot) {
      var c2 = ps.checked[n];
      dot.classList.toggle("done", !!(ps.answers[n] || ps.notes[n]));
      dot.classList.toggle("ok", !!(c2 && c2.ok === true));
      dot.classList.toggle("bad", !!(c2 && c2.ok === false));
    }
  }

  global.Views.paperPick = function (id, n, k) {
    var ps = paperState(id);
    var A = ansOf(id, n);
    if (A && isMulti(A.a)) {
      var cur = String(ps.answers[n] || "");
      var i = cur.indexOf(k);
      ps.answers[n] = i >= 0 ? cur.slice(0, i) + cur.slice(i + 1) : cur + k;
    } else {
      ps.answers[n] = k;
    }
    ps.updated = U.today();
    E.save();
    if (ps.checked[n]) {
      if (A && isSingle(A.a)) ps.checked[n] = { ok: ps.answers[n] === A.a };
      else if (A && isMulti(A.a)) ps.checked[n] = { ok: sameSet(ps.answers[n], A.a) };
      recordWrong(id, n, ps.checked[n].ok);
      global.App.render();
    } else {
      refresh(id, n);
    }
  };
  global.Views.paperFlag = function (id, n) {
    var ps = paperState(id);
    if (ps.flags[n]) delete ps.flags[n]; else ps.flags[n] = 1;
    E.saveNow();
    refresh(id, n);
  };
  global.Views.paperNote = function (id, n, text) {
    var ps = paperState(id);
    if (text && text.trim()) ps.notes[n] = text.trim(); else delete ps.notes[n];
    E.save();
    refresh(id, n);
  };
  global.Views.paperCheck = function (id, n) {
    var ps = paperState(id);
    var A = ansOf(id, n);
    if (!A) return;
    if (ps.checked[n]) { delete ps.checked[n]; }
    else if (isSingle(A.a)) {
      ps.checked[n] = ps.answers[n] ? { ok: ps.answers[n] === A.a } : { ok: null };
    } else if (isMulti(A.a)) {
      ps.checked[n] = ps.answers[n] ? { ok: sameSet(ps.answers[n], A.a) } : { ok: null };
    } else {
      ps.checked[n] = { ok: null };
    }
    if (ps.checked[n]) recordWrong(id, n, ps.checked[n].ok);
    E.save();
    global.App.render();
  };
  global.Views.paperSelf = function (id, n, ok) {
    var ps = paperState(id);
    ps.checked[n] = { ok: !!ok };
    recordWrong(id, n, !!ok);
    E.save();
    global.App.render();
  };
  global.Views.paperShowAll = function () {
    showAll = !showAll;
    global.App.render();
  };
  global.Views.paperJump = function (n) {
    var el = document.getElementById("pq-" + n);
    if (el) el.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  global.Views.paperVideoPlay = function (id) {
    var meta = videoMeta(id);
    if (!meta) return;
    if (isAudioMedia(meta)) {
      U.toast("本卷为站内听力音频，请直接使用上方播放器");
      return;
    }
    if (!videoUnlocked(id)) {
      U.toast(videoUnlockMode(meta) === "open" ? "视频暂不可用" : "请先登录并交卷后再观看");
      return;
    }
    var bvid = String(meta.bvid || "").replace(/[^A-Za-z0-9]/g, "");
    if (!bvid) return;
    var titleRaw = meta.title || meta.label || "视频讲解";
    var title = U.escapeHtml(titleRaw);
    var eyebrow = U.escapeHtml(meta.label || "视频讲解");
    var player = playerUrl(bvid);
    var html =
      '<div class="sheet pv-sheet">' +
      '<div class="sheet-top"><span class="eyebrow">' + eyebrow + '</span>' +
      '<button type="button" class="icon-btn ghost" data-action="close-modal" aria-label="关闭">✕</button></div>' +
      "<h2>" + title + "</h2>" +
      '<p class="sub muted">在下方播放器内登录 B 站即可解锁清晰度；本站不收集 B 站账号或密码，也不会新开标签跳转。</p>' +
      '<div class="pv-modal-frame">' +
      '<iframe src="' + player + '" title="' + title + '" allowfullscreen="true" ' +
      'referrerpolicy="no-referrer-when-downgrade" ' +
      'allow="fullscreen; encrypted-media; autoplay" scrolling="no" border="0" frameborder="no" framespacing="0"></iframe>' +
      "</div>" +
      '<div class="pv-modal-actions">' +
      '<button type="button" class="btn ghost" data-action="close-modal">关闭</button></div></div>';
    if (!global.App || typeof global.App.modal !== "function") {
      U.toast("弹层不可用，请刷新后再试");
      return;
    }
    global.App.modal(html);
    var root = document.getElementById("modal-root");
    var box = root && root.querySelector(".modal");
    if (box) box.classList.add("pv-modal");
  };


  function bindPaperAudioSticky() {
    var sec = document.querySelector("section.paper-video.is-audio");
    if (!sec) return;
    var main = sec.querySelector(".pv-audio-el");
    var sticky = sec.querySelector(".pv-audio-sticky");
    var stickyEl = sec.querySelector(".pv-audio-sticky-el");
    if (!main || !sticky || !stickyEl) return;
    if (main.dataset.stickyBound === "1") return;
    main.dataset.stickyBound = "1";
    /* 吸顶条只做控制镜像：永远静音，真正出声的只有 main，避免双路回音 */
    stickyEl.src = main.getAttribute("src") || "";
    stickyEl.muted = true;
    stickyEl.volume = 0;
    var syncing = false;
    function syncClock(from, to) {
      try {
        if (Math.abs((to.currentTime || 0) - (from.currentTime || 0)) > 0.35) {
          to.currentTime = from.currentTime || 0;
        }
      } catch (err) {}
    }
    function showSticky() {
      sticky.hidden = false;
      stickyEl.muted = true;
      stickyEl.volume = 0;
    }
    function onMainPlay() {
      showSticky();
      syncClock(main, stickyEl);
      if (stickyEl.paused) {
        var p = stickyEl.play();
        if (p && p.catch) p.catch(function () {});
      }
    }
    function onMainPause() {
      syncClock(main, stickyEl);
      if (!stickyEl.paused) stickyEl.pause();
    }
    function onStickyPlay() {
      showSticky();
      stickyEl.muted = true;
      stickyEl.volume = 0;
      syncClock(stickyEl, main);
      if (main.paused) {
        var p = main.play();
        if (p && p.catch) p.catch(function () {});
      }
    }
    function onStickyPause() {
      syncClock(stickyEl, main);
      if (!main.paused) main.pause();
    }
    main.addEventListener("play", onMainPlay);
    main.addEventListener("pause", onMainPause);
    main.addEventListener("seeked", function () { if (!syncing) { syncing = true; syncClock(main, stickyEl); syncing = false; } });
    stickyEl.addEventListener("play", function () {
      if (syncing) return;
      syncing = true;
      onStickyPlay();
      syncing = false;
    });
    stickyEl.addEventListener("pause", function () {
      if (syncing) return;
      syncing = true;
      onStickyPause();
      syncing = false;
    });
    stickyEl.addEventListener("seeked", function () {
      if (syncing) return;
      syncing = true;
      syncClock(stickyEl, main);
      syncing = false;
    });
    main.addEventListener("timeupdate", function () {
      if (syncing || sticky.hidden) return;
      if (Math.abs((stickyEl.currentTime || 0) - (main.currentTime || 0)) > 0.75) {
        syncing = true;
        syncClock(main, stickyEl);
        syncing = false;
      }
    });
  }

  var _papersMo = null;
  function watchPaperAudio() {
    bindPaperAudioSticky();
    if (_papersMo) return;
    var root = document.getElementById("app") || document.body;
    if (!root || typeof MutationObserver !== "function") return;
    _papersMo = new MutationObserver(function () { bindPaperAudioSticky(); });
    _papersMo.observe(root, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchPaperAudio);
  } else {
    watchPaperAudio();
  }

  global.Views.paperSubmit = function (id) {
    if (!id) return;
    if (!isLoggedIn()) {
      U.toast("请先登录，交卷进度才会同步到云端");
      if (global.ZkAuth && typeof global.ZkAuth.openLogin === "function") global.ZkAuth.openLogin();
      return;
    }
    if (!allQuestionsDone(id)) {
      U.toast("请先做完整卷再交卷");
      return;
    }
    var ps = paperState(id);
    if (ps.submitted) {
      U.toast("本卷已交过");
      global.App.render();
      return;
    }
    ps.submitted = true;
    ps.submittedAt = new Date().toISOString();
    ps.updated = U.today();
    E.saveNow();
    if (global.ZkAuth && typeof global.ZkAuth.syncNow === "function") {
      try { global.ZkAuth.syncNow(); } catch (e) { console.warn(e); }
    }
    var vm = videoMeta(id);
    U.toast(vm && videoUnlockMode(vm) === "submit" ? "已交卷，视频讲解已解锁" : "已交卷，进度已同步");
    global.App.render();
  };
})(window);
