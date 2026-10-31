/* ===========================================================
   config.js — 科目元数据、中考事实、等级、徽章
   =========================================================== */
(function (global) {
  "use strict";

  var SUBJECT_META = [
    {
      key: "math", name: "数学", short: "数", color: "#2F6BFF", soft: "#E8EEFF",
      parts: ["math-primary", "math-junior"],
      exam: { score: 120, time: "120 分钟", forms: "选择题 · 填空题 · 解答题" },
      tip: "中考数学拉分在解答题步骤，先把基础题做到不丢分。"
    },
    {
      key: "chinese", name: "语文", short: "语", color: "#D9534F", soft: "#FDECEC",
      parts: ["chinese-primary", "chinese-junior"],
      exam: { score: 120, time: "150 分钟", forms: "积累运用 · 阅读 · 写作" },
      tip: "古诗文默写和字音字形是稳拿的分，每天 10 分钟就够。"
    },
    {
      key: "english", name: "英语", short: "英", color: "#0F9B8E", soft: "#E3F6F3",
      parts: ["english-primary", "english-junior"],
      exam: { score: 120, time: "120 分钟", forms: "听力 30 分 · 笔试 90 分" },
      tip: "听力 30 分每天磨耳朵，语法填空靠错题本反复过。"
    },
    {
      key: "physics", name: "物理", short: "物", color: "#6C5CE7", soft: "#EEEAFD",
      parts: ["physics"],
      exam: { score: 100, time: "90 分钟", forms: "选择 · 填空 · 实验探究 · 计算" },
      tip: "公式记牢不算会，能说清每个量的单位和方向才算会。"
    },
    {
      key: "chemistry", name: "化学", short: "化", color: "#E8890C", soft: "#FDF0DE",
      parts: ["chemistry"],
      exam: { score: 100, time: "90 分钟", forms: "选择 · 填空 · 实验探究 · 计算" },
      tip: "化学方程式要配平、标条件、标气体沉淀，一步都不能省。"
    },
    {
      key: "biology", name: "生物", short: "生", color: "#3E9B4F", soft: "#E6F4E6",
      parts: ["biology"],
      exam: { score: 60, time: "八年级考，折半计入", forms: "选择 · 综合题" },
      tip: "结构与功能对应着记：看到器官先想它负责什么。"
    },
    {
      key: "geography", name: "地理", short: "地", color: "#1F7A8C", soft: "#E2F1F4",
      parts: ["geography"],
      exam: { score: 60, time: "八年级考，折半计入", forms: "选择 · 综合题" },
      tip: "读图先定方向、再定位置，最后想规律（纬度、海陆、地形）。"
    },
    {
      key: "civics", name: "道德与法治", short: "道", color: "#C2410C", soft: "#FCEDE4",
      parts: ["civics"],
      exam: { score: 75, time: "与历史同堂分卷", forms: "选择 · 简答 · 材料分析" },
      tip: "答题按「是什么—为什么—怎么做」三段走，别写成一团。"
    },
    {
      key: "history", name: "历史", short: "史", color: "#8A6D3B", soft: "#F4EFE3",
      parts: ["history"],
      exam: { score: 75, time: "与道法同堂分卷", forms: "选择 · 材料题 · 简答" },
      tip: "时间轴是骨架：先记朝代顺序，再记每个朝代的关键事件。"
    }
  ];

  /* 广西中考（全区统一命题）关键事实，2025 年起执行 */
  var EXAM_FACTS = {
    title: "广西初中学业水平考试（中考）",
    subtitle: "自治区招生考试院统一命题 · 2025 年起九年级道法、历史各 75 分",
    total: 830,
    rows: [
      { name: "语文", score: 120, note: "150 分钟" },
      { name: "数学", score: 120, note: "120 分钟" },
      { name: "英语", score: 120, note: "含听力 30 分" },
      { name: "物理", score: 100, note: "含物理实验" },
      { name: "化学", score: 100, note: "含化学实验" },
      { name: "道德与法治", score: 75, note: "与历史同堂分卷" },
      { name: "历史", score: 75, note: "与道法同堂分卷" },
      { name: "体育与健康", score: 60, note: "实践测试，5 月底前完成" },
      { name: "地理 + 生物", score: 60, note: "八年级各 60 分，折半计入" }
    ],
    grades: ["A+", "A", "B+", "B", "C+", "C", "D", "E"],
    notes: [
      "九年级笔试一般在 6 月 24—26 日，八年级地理、生物在 6 月 27 日。",
      "语文、数学、英语、物理、化学、道德与法治、历史、地理、生物 9 科全区统一命题。",
      "成绩以 A+、A、B+、B、C+、C、D、E 八个等级呈现；2026 年起八年级地理、生物改为 A—E 五个等级。",
      "以上为 2025 年方案，2026 年以自治区与各市教育部门当年文件为准。"
    ]
  };

  /* 等级换算：按正确率（用于模拟卷） */
  var GRADE_BANDS = [
    { min: 0.95, grade: "A+" }, { min: 0.90, grade: "A" },
    { min: 0.82, grade: "B+" }, { min: 0.74, grade: "B" },
    { min: 0.66, grade: "C+" }, { min: 0.58, grade: "C" },
    { min: 0.45, grade: "D" }, { min: 0, grade: "E" }
  ];

  var LEVELS = [
    { at: 0, name: "新手" }, { at: 100, name: "勤学" }, { at: 260, name: "小成" },
    { at: 480, name: "进阶" }, { at: 760, name: "精进" }, { at: 1100, name: "通达" },
    { at: 1500, name: "学霸" }, { at: 2000, name: "学神" }, { at: 2600, name: "传说" }
  ];

  var BADGES = [
    { id: "first", icon: "🌱", name: "启程", desc: "完成第一个知识点" },
    { id: "perfect", icon: "🎯", name: "一次全对", desc: "某个知识点练习全对" },
    { id: "five", icon: "🔥", name: "连学三天", desc: "连续学习 3 天" },
    { id: "week", icon: "🌟", name: "一周不断", desc: "连续学习 7 天" },
    { id: "ten", icon: "📚", name: "十点达成", desc: "掌握 10 个知识点" },
    { id: "fifty", icon: "🏔️", name: "半百", desc: "掌握 50 个知识点" },
    { id: "hundred", icon: "🧠", name: "百题斩", desc: "累计答对 100 题" },
    { id: "review", icon: "🔁", name: "复习达人", desc: "完成 20 次复习" },
    { id: "examA", icon: "🏅", name: "模拟 A 等", desc: "中考模拟拿到 A 或以上" },
    { id: "allsub", icon: "🧩", name: "全面开花", desc: "每个科目都掌握 1 个知识点" }
  ];

  global.SUBJECT_META = SUBJECT_META;
  global.EXAM_FACTS = EXAM_FACTS;
  global.GRADE_BANDS = GRADE_BANDS;
  global.LEVELS = LEVELS;
  global.BADGES = BADGES;

  global.SUBJECT_MAP = {};
  SUBJECT_META.forEach(function (s) { global.SUBJECT_MAP[s.key] = s; });
})(window);
