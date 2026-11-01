/* 中考试卷 → 讲解媒体（paperId → 视频 bvid 或站内听力 audio）。
 * label: 区块眉标，默认「视频讲解」；英语听力可用「听力讲解」。
 * unlock: "open" = 进卷即播（无需登录/交卷）；"submit"（默认）= 登录且交卷后解锁。
 * audio / audioSrc: 站内 HTML5 音频路径（相对站点根，如 assets/listening/2023-english.mp3）。
 * bvid: B 站视频（数学等讲解）；有 audio 时优先站内音频，不嵌入 B 站。
 */
window.PAPER_VIDEOS = {
  "2023-math": {
    bvid: "BV1g8411R7KK",
    title: "2023年广西中考数学试卷讲解",
    unlock: "submit",
    url: "https://www.bilibili.com/video/BV1g8411R7KK/"
  },
  "2023-english": {
    audio: "assets/listening/2023-english.mp3",
    title: "2023年广西中考英语听力",
    label: "听力音频",
    unlock: "open"
  },
  "2024-english": {
    audio: "assets/listening/2024-english.mp3",
    title: "2024广西省中考英语听力",
    label: "听力音频",
    unlock: "open"
  },
  "2025-english": {
    audio: "assets/listening/2025-english.mp3",
    title: "2025年广西省中考英语听力",
    label: "听力音频",
    unlock: "open"
  }
};
