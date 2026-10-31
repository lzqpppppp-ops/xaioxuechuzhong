# 写入 supabase-config.js（家长 / parent 操作）

本站登录依赖 `assets/js/supabase-config.js`。仓库里只有占位值，**不要把真实 key 提交进 git**。

## 方式 A：安全表单 + write-config.html

1. 用浏览器打开本目录旁的 `tools/write-supabase-config.html`（或 `/workspace/zk-auth-patch/write-config.html`）。
2. 用聊天里的临时 Secure Form 字段填入：
   - `supabase_url`
   - `supabase_publishable_key`
3. 点「生成并下载」，把下载的 `supabase-config.js` 覆盖到：
   `E:\Porject\AI\xaioxuechuzhong\assets\js\supabase-config.js`
4. 刷新学习网页，点右上角「登录」测试。

## 方式 B：手动

复制 `assets/js/supabase-config.example.js` 为 `supabase-config.js`，把：

```js
window.ZK_SUPABASE = {
  url: "https://YOUR_PROJECT.supabase.co",
  anonKey: "YOUR_PUBLISHABLE_OR_ANON_KEY"
};
```

换成真实 Project URL 与 publishable/anon key。

## 合并策略（已实现）

- 云端表 `progress.data` 为 jsonb；本站只读写 `data["zk.learn.v1"]`，不覆盖其它应用（如拾阶）的键。
- 首次登录：若云端已有该键则 **云端优先** 写入本机并刷新一次；否则把本机进度推上去。
- 之后本机每次写入 `zk.learn.v1` 会防抖推送到云端（合并整行 jsonb）。
- 未登录 / 未配置 / CDN 失败：仅用 localStorage，站点照常可用。
