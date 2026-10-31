/* ===========================================================
   parts-loader.js — 按科目懒加载 data/parts/*.js
   =========================================================== */
(function (global) {
  "use strict";

  var PART_DIR = "data/parts/";
  var loaded = {};
  var inflight = {};
  var allPromise = null;

  function partKeys() {
    var keys = [];
    (global.SUBJECT_META || []).forEach(function (m) {
      (m.parts || []).forEach(function (k) {
        if (keys.indexOf(k) < 0) keys.push(k);
      });
    });
    return keys;
  }

  function subjectPartKeys(subjectKey) {
    var m = (global.SUBJECT_MAP || {})[subjectKey];
    return (m && m.parts) ? m.parts.slice() : [];
  }

  function markKnown() {
    var parts = global.CURRICULUM_PARTS || {};
    Object.keys(parts).forEach(function (k) { loaded[k] = true; });
  }

  function isPartLoaded(key) {
    if (loaded[key]) return true;
    if (global.CURRICULUM_PARTS && global.CURRICULUM_PARTS[key]) {
      loaded[key] = true;
      return true;
    }
    return false;
  }

  function isSubjectLoaded(subjectKey) {
    var keys = subjectPartKeys(subjectKey);
    if (!keys.length) return false;
    for (var i = 0; i < keys.length; i++) {
      if (!isPartLoaded(keys[i])) return false;
    }
    return true;
  }

  function isAllLoaded() {
    var keys = partKeys();
    if (!keys.length) return false;
    for (var i = 0; i < keys.length; i++) {
      if (!isPartLoaded(keys[i])) return false;
    }
    return true;
  }

  function rebuild() {
    if (global.Engine && typeof global.Engine.buildCurriculum === "function") {
      global.Engine.buildCurriculum();
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(src); };
      s.onerror = function () {
        reject(new Error("无法加载 " + src + "（若用 file:// 打开失败，请改用本地服务器）"));
      };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  function loadPart(key) {
    markKnown();
    if (isPartLoaded(key)) return Promise.resolve(key);
    if (inflight[key]) return inflight[key];
    var src = PART_DIR + key + ".js";
    inflight[key] = loadScript(src).then(function () {
      loaded[key] = true;
      delete inflight[key];
      return key;
    }, function (err) {
      delete inflight[key];
      throw err;
    });
    return inflight[key];
  }

  function loadParts(keys) {
    var list = keys || [];
    if (!list.length) return Promise.resolve([]);
    return Promise.all(list.map(loadPart));
  }

  function loadSubject(subjectKey) {
    return loadParts(subjectPartKeys(subjectKey)).then(function (keys) {
      rebuild();
      return keys;
    });
  }

  function loadAll() {
    if (isAllLoaded()) {
      rebuild();
      return Promise.resolve(partKeys());
    }
    if (allPromise) return allPromise;
    allPromise = loadParts(partKeys()).then(function (keys) {
      allPromise = null;
      rebuild();
      return keys;
    }, function (err) {
      allPromise = null;
      throw err;
    });
    return allPromise;
  }

  /** 若已就绪返回 { ready:true }；否则 { ready:false, promise } */
  function ensureSubject(subjectKey) {
    markKnown();
    if (isSubjectLoaded(subjectKey)) {
      rebuild();
      return { ready: true, promise: Promise.resolve() };
    }
    return { ready: false, promise: loadSubject(subjectKey) };
  }

  function ensureAll() {
    markKnown();
    if (isAllLoaded()) {
      rebuild();
      return { ready: true, promise: Promise.resolve() };
    }
    return { ready: false, promise: loadAll() };
  }

  global.PartsLoader = {
    PART_DIR: PART_DIR,
    partKeys: partKeys,
    subjectPartKeys: subjectPartKeys,
    loadPart: loadPart,
    loadParts: loadParts,
    loadSubject: loadSubject,
    loadAll: loadAll,
    ensureSubject: ensureSubject,
    ensureAll: ensureAll,
    isPartLoaded: isPartLoaded,
    isSubjectLoaded: isSubjectLoaded,
    isAllLoaded: isAllLoaded,
    rebuild: rebuild
  };
})(window);