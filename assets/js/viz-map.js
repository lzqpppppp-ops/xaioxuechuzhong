/* ===========================================================
   viz-map.js — 哪些知识点配哪种可视化 + 针对性的提示语
   =========================================================== */
(function (global) {
  "use strict";

  /* 精确指定（按知识点 id），比按标题猜更可靠 */
  var BY_ID = {
    "mp-001": { key: "numberline" },   /* 10以内数的认识与比较 */
    "mp-031": { key: "numberline" },   /* 负数的初步认识 */
    "mj-001": { key: "numberline" },   /* 有理数 */
    "mj-005": { key: "numberline" },   /* 不等式与不等式组 */
    "mp-030": { key: "cube" },         /* 长方体和正方体 */
    "mj-018": { key: "function", type: "linear" },  /* 一次函数 */
    "mj-020": { key: "function", type: "quad" },    /* 二次函数 */
    "mj-023": { key: "function", type: "inv" },     /* 反比例函数 */
    "mj-029": { key: "function", type: "linear" },  /* 函数综合 */
    "mp-035": { key: "circle" },       /* 圆（小学） */
    "mj-022": { key: "circle" },       /* 圆（初中） */
    "mj-021": { key: "rotation" },     /* 旋转 */
    "mj-025": { key: "views" },        /* 投影与视图 */
    "ph-002": { key: "refraction" },   /* 光的反射与折射 */
    "dl-003": { key: "seasons" }       /* 地球的自转与公转 */
  };

  var EXTRA_HINT = {
    "mj-001": "先看正负：0 右边是正数、左边是负数；-3 和 3 到原点的距离一样，它们是相反数。",
    "mj-005": "不等式的解集在数轴上是一段或一条射线：含等号画实心点，不含等号画空心圈。",
    "mp-031": "负数在 0 的左边；-5 比 -2 更靠左，所以 -5 < -2，别被「5 比 2 大」带偏。",
    "mp-030": "转一转正方体：相对的面不会相邻。展开图里隔一个面的两个面才是相对面。",
    "mj-018": "k 是斜率：k 越大线越陡；b 是截距：线一定经过 (0, b)。",
    "mj-020": "a 决定开口方向和胖瘦，对称轴是 x = -b/(2a)，顶点就在对称轴上。",
    "mj-023": "反比例函数的图象是两支曲线，永远不会与坐标轴相交。",
    "mj-022": "同弧所对的圆周角是圆心角的一半；直径所对的圆周角是 90°。",
    "mp-035": "圆周率 π≈3.14，周长 = 2πr，面积 = πr²；半径变成 2 倍，面积变成 4 倍。",
    "mj-021": "旋转的三要素：旋转中心、旋转方向、旋转角。对应点到中心的距离相等。",
    "mj-025": "主视图看「长和高」，左视图看「宽和高」，俯视图看「长和宽」；长对正、高平齐、宽相等。"
  };

  function byTitle(p) {
    var t = p.title || "";
    if (t.indexOf("数轴") >= 0) return { key: "numberline" };
    if (t.indexOf("旋转") >= 0) return { key: "rotation" };
    if (t.indexOf("投影") >= 0 || t.indexOf("视图") >= 0) return { key: "views" };
    if (t.indexOf("正方体") >= 0 || t.indexOf("长方体") >= 0) return { key: "cube" };
    if (t.indexOf("函数") >= 0 && t.indexOf("三角函数") < 0) {
      var type = t.indexOf("二次") >= 0 ? "quad" : t.indexOf("反比例") >= 0 ? "inv" : "linear";
      return { key: "function", type: type };
    }
    if (t.indexOf("圆") >= 0 && t.indexOf("圆柱") < 0 && t.indexOf("圆锥") < 0) return { key: "circle" };
    return null;
  }

  function of(p) {
    if (!p) return null;
    var hit = BY_ID[p.id];
    if (!hit) {
      if (p.subject !== "math") return null;
      hit = byTitle(p);
    }
    if (!hit) return null;
    return { key: hit.key, type: hit.type || "", hint: EXTRA_HINT[p.id] || (global.Viz ? global.Viz.hint(hit.key) : "") };
  }

  global.VizMap = { of: of };
})(window);
