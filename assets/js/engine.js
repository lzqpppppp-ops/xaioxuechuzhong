/* ===========================================================
   engine.js — 进度存储、间隔复习、每日任务、经验与徽章
   =========================================================== */
(function (global) {
  "use strict";

  var U = global.U;
  var KEY = "zk.learn.v1";
  var MASTERED = 80;

  function freshState() {
    return {
      v: 1,
      profile: null,
      xp: 0,
      streak: { days: 0, last: null, best: 0 },
      days: {},
      points: {},
      wrong: {},
      badges: {},
      exams: [],
      papers: {},
      counters: { answered: 0, correct: 0, sessions: 0, reviews: 0, minutes: 0 },
      subjectLast: {},
      settings: { sound: true, anim: true, season: "auto" },
      eggs: { date: null, ids: {} },
      daily: null,
      unlocked: []
    };
  }

  var state = freshState();
  var C = { all: [], byId: {}, bySubject: {} };
  var saveTimer = null;

  /* ---------------- 课程索引 ---------------- */
  function buildCurriculum() {
    var parts = global.CURRICULUM_PARTS || {};
    var meta = global.SUBJECT_META || [];
    var all = [];
    meta.forEach(function (m) {
      var pts = [];
      (m.parts || []).forEach(function (k) {
        if (parts[k] && parts[k].points) pts = pts.concat(parts[k].points);
      });
      pts = pts.slice().sort(function (a, b) {
        return (a.grade - b.grade) || 0;
      });
      pts.forEach(function (p, i) {
        p.subject = m.key;
        p.order = i;
        p._missing = !(p.title && p.explain && p.quiz && p.quiz.length);
      });
      C.bySubject[m.key] = pts;
      all = all.concat(pts);
    });
    C.all = all;
    C.byId = {};
    all.forEach(function (p) { C.byId[p.id] = p; });
    return C;
  }

  /* ---------------- 存取 ---------------- */
  function load() {
    try {
      var raw = global.localStorage.getItem(KEY);
      if (raw) {
        var obj = JSON.parse(raw);
        if (obj && obj.v === 1) state = Object.assign(freshState(), obj);
      }
    } catch (e) {
      console.warn("读取进度失败，使用空白进度", e);
    }
    ["points", "wrong", "badges", "days", "subjectLast"].forEach(function (k) {
      if (!state[k] || typeof state[k] !== "object") state[k] = {};
    });
    if (!state.counters) state.counters = freshState().counters;
    if (!state.settings) state.settings = { sound: true, anim: true, season: "auto" };
    if (!state.settings.season) state.settings.season = "auto";
    if (!state.eggs) state.eggs = { date: null, ids: {} };
    if (!state.papers) state.papers = {};
    if (!state.streak) state.streak = { days: 0, last: null, best: 0 };
    if (!Array.isArray(state.unlocked)) state.unlocked = [];
    if (!Array.isArray(state.exams)) state.exams = [];
    return state;
  }

  function persist() {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("保存失败（浏览器存储可能已满）", e);
    }
  }
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 120);
  }
  function saveNow() { clearTimeout(saveTimer); persist(); }

  /* ---------------- 查询 ---------------- */
  function point(id) { return C.byId[id]; }
  function pointsOf(key) { return C.bySubject[key] || []; }
  function subjectsWithContent() {
    return (global.SUBJECT_META || []).filter(function (m) {
      return (C.bySubject[m.key] || []).length > 0;
    });
  }
  function prog(id) {
    if (!state.points[id]) {
      state.points[id] = { seen: 0, mastery: 0, reps: 0, lapses: 0, interval: 0, due: null, last: null, tries: 0, correct: 0 };
    }
    return state.points[id];
  }
  function isSeen(id) { return !!(state.points[id] && state.points[id].seen); }
  function mastery(id) { return state.points[id] ? state.points[id].mastery : 0; }
  function isMastered(id) { return mastery(id) >= MASTERED; }
  function isUnlocked(p) {
    if (!p) return false;
    if (!state.profile) return p.grade <= 1;
    if (p.grade <= state.profile.grade + 1) return true;
    return state.unlocked.indexOf(p.id) >= 0;
  }
  function duePoints(day) {
    var t = day || U.today();
    return C.all.filter(function (p) {
      var r = state.points[p.id];
      return r && r.seen && r.due && r.due <= t && !isMastered(p.id);
    }).sort(function (a, b) {
      return String(state.points[a.id].due).localeCompare(String(state.points[b.id].due));
    });
  }
  function wrongList() {
    return Object.keys(state.wrong).map(function (qid) {
      return { qid: qid, pointId: state.wrong[qid].point, at: state.wrong[qid].at };
    }).filter(function (w) { return C.byId[w.pointId]; });
  }
  /* 真题错题：保存在 state.papers[*].wrong 里，按卷子分组 */
  function paperWrongs() {
    var out = [];
    Object.keys(state.papers || {}).forEach(function (pid) {
      var ps = state.papers[pid];
      if (!ps || !ps.wrong) return;
      Object.keys(ps.wrong).forEach(function (n) {
        var w = ps.wrong[n];
        out.push({
          paperId: pid, n: Number(n), at: w.at || "",
          your: w.your || "", correct: w.correct || "",
          stem: w.stem || "", why: w.why || "",
          subject: w.subject || pid.split("-")[1] || "",
          title: w.title || pid, subjective: !!w.subjective
        });
      });
    });
    out.sort(function (a, b) { return String(b.at).localeCompare(String(a.at)); });
    return out;
  }
  function paperWrongCount() {
    return paperWrongs().length;
  }
  function masteredCount(key) {
    var list = key ? pointsOf(key) : C.all;
    return list.filter(function (p) { return isMastered(p.id); }).length;
  }
  function seenCount(key) {
    var list = key ? pointsOf(key) : C.all;
    return list.filter(function (p) { return isSeen(p.id); }).length;
  }

  /* ---------------- 每日任务 ---------------- */
  function newTarget() {
    var m = state.profile ? state.profile.dailyMinutes : 20;
    if (m <= 10) return 2;
    if (m <= 20) return 3;
    if (m <= 35) return 4;
    return 5;
  }

  function buildPlan() {
    var t = U.today();
    var grade = state.profile ? state.profile.grade : 1;
    var subs = subjectsWithContent();
    var plan = { date: t, new: [], review: [], wrong: [], createdAt: t };

    /* 复习：到期 + 未掌握 */
    duePoints(t).slice(0, 6).forEach(function (p) { plan.review.push(p.id); });

    /* 错题：最多 4 道 */
    var wrongs = wrongList().sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); }).slice(0, 4);
    plan.wrong = wrongs.map(function (w) { return w.qid; });

    /* 新学：同学段优先，各科轮转；还没到起始年级的科目不硬塞 */
    var target = newTarget();
    var pool = [];
    subs.forEach(function (m) {
      var list = pointsOf(m.key).filter(function (p) {
        return !isSeen(p.id) && isUnlocked(p) && !p._missing;
      });
      var ready = list.filter(function (p) { return p.grade <= grade; });
      if (!ready.length) return;
      var sameGrade = ready.filter(function (p) { return p.grade === grade; });
      var pick;
      if (sameGrade.length) pick = sameGrade[0];
      else {
        ready.sort(function (a, b) { return b.grade - a.grade; });
        pick = ready[0];
      }
      pool.push({ sub: m.key, last: state.subjectLast[m.key] || "", p: pick });
    });
    pool.sort(function (a, b) { return String(a.last).localeCompare(String(b.last)); });
    for (var i = 0; i < pool.length && plan.new.length < target; i++) {
      plan.new.push(pool[i].p.id);
    }
    /* 学科不够时，用同年级/低年级的未学点补足（不推更高年级） */
    if (plan.new.length < target) {
      var extra = C.all.filter(function (p) {
        return !isSeen(p.id) && isUnlocked(p) && !p._missing && p.grade <= grade && plan.new.indexOf(p.id) < 0;
      }).sort(function (a, b) {
        var sa = a.grade === grade ? 0 : 1, sb = b.grade === grade ? 0 : 1;
        return (sa - sb) || (b.grade - a.grade);
      });
      for (var j = 0; j < extra.length && plan.new.length < target; j++) plan.new.push(extra[j].id);
    }
    return plan;
  }

  function ensureDaily() {
    var t = U.today();
    if (!state.daily || state.daily.date !== t) {
      state.daily = buildPlan();
      state.daily.done = { new: {}, review: {}, wrong: {} };
      save();
    }
    if (!state.daily.done) state.daily.done = { new: {}, review: {}, wrong: {} };
    return state.daily;
  }

  function regenerateDaily() {
    state.daily = buildPlan();
    state.daily.done = { new: {}, review: {}, wrong: {} };
    save();
  }

  function planProgress() {
    var d = ensureDaily();
    var newDone = d.new.filter(function (id) { return d.done.new && d.done.new[id]; }).length;
    var revDone = d.review.filter(function (id) { return d.done.review && d.done.review[id]; }).length;
    var wrongDone = d.wrong.length && Object.keys(d.done.wrong || {}).length ? 1 : 0;
    var total = d.new.length + d.review.length + (d.wrong.length ? 1 : 0);
    var done = newDone + revDone + wrongDone;
    done = Math.min(done, total);
    return { total: total, done: done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function markDone(kind, id) {
    var d = ensureDaily();
    d.done[kind][id] = 1;
    var p = planProgress();
    if (p.total > 0 && p.done >= p.total && !state.dailyAllDoneOn) {
      state.dailyAllDoneOn = U.today();
      addXp(20, "今日任务全部完成");
    }
    save();
  }

  /* ---------------- 经验 / 等级 / 连续天数 ---------------- */
  function addXp(n, reason) {
    state.xp = Math.max(0, state.xp + n);
    if (reason && global.U.toast) {
      /* 由调用方决定是否提示，此处只累计 */
    }
    save();
  }
  function levelInfo() {
    var lv = global.LEVELS || [{ at: 0, name: "新手" }];
    var idx = 0;
    for (var i = 0; i < lv.length; i++) if (state.xp >= lv[i].at) idx = i;
    var cur = lv[idx];
    var next = lv[idx + 1];
    var span = next ? next.at - cur.at : 1;
    var into = state.xp - cur.at;
    return {
      level: idx + 1, name: cur.name,
      into: into, span: span, next: next ? next.at : null,
      pct: next ? Math.min(100, Math.round((into / span) * 100)) : 100
    };
  }
  function touchStreak() {
    var t = U.today(), s = state.streak;
    if (s.last === t) return;
    if (s.last && U.daysBetween(s.last, t) === 1) s.days = (s.days || 0) + 1;
    else s.days = 1;
    s.last = t;
    s.best = Math.max(s.best || 0, s.days);
    save();
  }
  function dayStat(day) {
    var t = day || U.today();
    if (!state.days[t]) state.days[t] = { xp: 0, quiz: 0, correct: 0, minutes: 0, points: [], reviews: 0 };
    return state.days[t];
  }

  /* ---------------- 答题与结算 ---------------- */
  function recordAnswer(pointId, qid, correct) {
    var p = prog(pointId);
    p.tries++;
    if (correct) p.correct++;
    var d = dayStat();
    d.quiz++;
    if (correct) { d.correct++; state.counters.correct++; }
    state.counters.answered++;
    if (correct) addXp(2);
    if (!correct) {
      state.wrong[qid] = { point: pointId, at: U.today(), times: ((state.wrong[qid] || {}).times || 0) + 1 };
    } else if (state.wrong[qid]) {
      delete state.wrong[qid];
    }
    save();
  }

  function reviewSrs(p, accuracy) {
    if (accuracy >= 0.8) {
      p.reps = (p.reps || 0) + 1;
      p.interval = p.interval ? Math.min(p.interval * 2, 45) : 2;
    } else {
      p.reps = 0;
      p.interval = 1;
      p.lapses = (p.lapses || 0) + 1;
    }
    p.due = U.addDays(U.today(), p.interval);
    p.last = U.today();
  }

  function finishSession(info) {
    /* info: {pointId, results:[bool], mode, seconds} */
    var p = C.byId[info.pointId];
    if (!p) return null;
    var r = prog(p.id);
    var total = info.results.length || 1;
    var correct = info.results.filter(Boolean).length;
    var acc = correct / total;
    var before = r.mastery || 0;
    var gain = (acc - 0.55) * 46;
    if (before === 0) gain += 14;
    if (acc === 1) gain += 5;
    var after = Math.round(U.clamp(before + gain, 0, 100));
    r.mastery = after;
    r.seen = 1;
    if (!r.firstAt) r.firstAt = U.today();
    reviewSrs(r, acc);

    var d = dayStat();
    d.minutes += Math.round((info.seconds || 0) / 60);
    state.counters.minutes += Math.round((info.seconds || 0) / 60);
    state.counters.sessions++;
    if (info.mode === "review") { d.reviews = (d.reviews || 0) + 1; state.counters.reviews++; }
    if (d.points.indexOf(p.id) < 0) d.points.push(p.id);
    state.subjectLast[p.subject] = U.today();

    var xp = 8 + (acc === 1 ? 6 : 0) + (before < 60 && after >= 60 ? 6 : 0);
    d.xp += xp;
    addXp(xp);
    touchStreak();

    if (info.mode === "new") markDone("new", p.id);
    else if (info.mode === "review") markDone("review", p.id);

    var gotBadges = checkBadges({ acc: acc, pointId: p.id });
    saveNow();
    return { xp: xp, before: before, after: after, acc: acc, due: r.due, interval: r.interval, badges: gotBadges };
  }

  function checkBadges(ctx) {
    var got = [];
    function unlock(id) { if (!state.badges[id]) { state.badges[id] = U.today(); got.push(id); } }
    if (seenCount() >= 1) unlock("first");
    if (ctx && ctx.acc === 1) unlock("perfect");
    if (state.streak.days >= 3) unlock("five");
    if (state.streak.days >= 7) unlock("week");
    if (masteredCount() >= 10) unlock("ten");
    if (masteredCount() >= 50) unlock("fifty");
    if (state.counters.correct >= 100) unlock("hundred");
    if (state.counters.reviews >= 20) unlock("review");
    var subs = subjectsWithContent();
    if (subs.length && subs.every(function (m) { return masteredCount(m.key) >= 1; })) unlock("allsub");
    return got;
  }

  /* ---------------- 中考模拟 ---------------- */
  function buildExam(subjectKey, count) {
    var list = pointsOf(subjectKey).filter(function (p) { return p.quiz && p.quiz.length; });
    if (!list.length) return [];
    var seen = list.filter(function (p) { return isSeen(p.id); });
    var pool = seen.length >= 5 ? seen : list;
    var seed = U.hashStr(subjectKey + "|" + U.today() + "|" + Date.now());
    var chosen = U.shuffle(pool, seed).slice(0, Math.min(count, pool.length));
    var qs = [];
    chosen.forEach(function (p) {
      var picks = U.shuffle(p.quiz.map(function (q, i) { return i; }), seed + p.id.length);
      var take = p.quiz.length >= 3 ? 2 : 1;
      picks.slice(0, take).forEach(function (qi) {
        qs.push({ pointId: p.id, qi: qi, q: p.quiz[qi] });
      });
    });
    return U.shuffle(qs, seed + 7).slice(0, count);
  }

  function gradeFor(ratio) {
    var bands = global.GRADE_BANDS || [];
    for (var i = 0; i < bands.length; i++) if (ratio >= bands[i].min) return bands[i].grade;
    return "E";
  }

  function saveExam(rec) {
    state.exams.unshift(rec);
    state.exams = state.exams.slice(0, 30);
    var crit = ["A+", "A"];
    if (crit.indexOf(rec.grade) >= 0) { state.badges.examA = state.badges.examA || U.today(); }
    saveNow();
  }

  /* ---------------- 导入导出 ---------------- */
  function exportJSON() {
    return JSON.stringify({
      app: "zk-learn", v: 1, exportedAt: new Date().toISOString(), state: state
    }, null, 2);
  }
  function importJSON(text) {
    var obj = JSON.parse(text);
    var s = obj && obj.state ? obj.state : obj;
    if (!s || typeof s !== "object" || !s.v) throw new Error("文件格式不对");
    state = Object.assign(freshState(), s);
    saveNow();
    return true;
  }
  function resetAll() {
    state = freshState();
    saveNow();
  }
  function setProfile(p) {
    state.profile = Object.assign({ createdAt: U.today() }, p);
    state.daily = null;
    saveNow();
  }
  function unlockPoint(id) {
    if (state.unlocked.indexOf(id) < 0) state.unlocked.push(id);
    save();
  }

  global.Engine = {
    MASTERED: MASTERED,
    load: load, save: save, saveNow: saveNow, persist: persist,
    buildCurriculum: buildCurriculum, curriculum: function () { return C; },
    state: function () { return state; },
    point: point, pointsOf: pointsOf, subjectsWithContent: subjectsWithContent,
    prog: prog, isSeen: isSeen, mastery: mastery, isMastered: isMastered, isUnlocked: isUnlocked,
    duePoints: duePoints, wrongList: wrongList, paperWrongs: paperWrongs, paperWrongCount: paperWrongCount,
    masteredCount: masteredCount, seenCount: seenCount,
    ensureDaily: ensureDaily, regenerateDaily: regenerateDaily, planProgress: planProgress,
    newTarget: newTarget, markDone: markDone,
    addXp: addXp, levelInfo: levelInfo, touchStreak: touchStreak, dayStat: dayStat,
    recordAnswer: recordAnswer, finishSession: finishSession, checkBadges: checkBadges,
    buildExam: buildExam, gradeFor: gradeFor, saveExam: saveExam,
    exportJSON: exportJSON, importJSON: importJSON, resetAll: resetAll, setProfile: setProfile,
    unlockPoint: unlockPoint
  };
})(window);
