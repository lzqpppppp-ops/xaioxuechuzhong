/* 中考通关 · Supabase 邮箱登录与云端进度同步
 *
 * 合并策略（与拾阶共用同一 progress 表）：
 * - 云端 progress.data 为 jsonb；本站只读写 data["zk.learn.v1"]，其它键原样保留。
 * - 首次登录：若云端已有 zk.learn.v1 → 云端优先写入本机并刷新一次；否则把本机进度推上去。
 * - 之后 localStorage.setItem("zk.learn.v1") 防抖推送（先读远程行再 merge upsert）。
 * - 未登录 / 未配置 / CDN 不可用：仅用本机，站点照常工作。
 */
(function () {
  "use strict";

  var STORAGE_KEY = "zk.learn.v1";
  var NS = "zk.learn.v1";
  var PULLED_FLAG = "zk.auth.justPulled";
  var cfg = window.ZK_SUPABASE || {};
  var client = null;
  var syncTimer = null;
  var lastPushed = "";
  var hooked = false;
  var currentUser = null;

  function $(sel, root) { return (root || document).querySelector(sel); }

  function toast(msg) {
    if (window.U && typeof window.U.toast === "function") return window.U.toast(msg);
    if (typeof window.toast === "function") return window.toast(msg);
    console.info("[auth]", msg);
  }

  function ready() {
    return !!(cfg.url && cfg.anonKey && String(cfg.url).indexOf("YOUR_PROJECT") < 0 && String(cfg.anonKey).indexOf("YOUR_") < 0);
  }

  function ensureClient() {
    if (client) return client;
    if (!ready()) return null;
    if (!window.supabase || !window.supabase.createClient) {
      toast("登录组件未加载，请检查网络后刷新");
      return null;
    }
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return client;
  }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || null; }
    catch (e) { return null; }
  }

  function writeLocal(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function setUserChip(user) {
    currentUser = user || null;
    var chip = $("#auth-user-chip");
    var loginBtn = $("#auth-open-login");
    if (chip && loginBtn) {
      if (user) {
        var name = (user.email || "已登录").split("@")[0];
        chip.hidden = false;
        chip.textContent = name;
        chip.title = user.email || name;
        loginBtn.hidden = true;
      } else {
        chip.hidden = true;
        loginBtn.hidden = false;
      }
    }
    refreshSettingsCard();
  }

  function refreshSettingsCard() {
    var status = $("#auth-settings-status");
    var loginBtn = $("#auth-settings-login");
    var logoutBtn = $("#auth-settings-logout");
    var syncBtn = $("#auth-settings-sync");
    if (!status) return;
    if (currentUser) {
      status.textContent = "已登录：" + (currentUser.email || "") + " · 进度会同步到云端（键 zk.learn.v1）";
      if (loginBtn) loginBtn.hidden = true;
      if (logoutBtn) logoutBtn.hidden = false;
      if (syncBtn) syncBtn.hidden = false;
    } else {
      status.textContent = ready()
        ? "未登录：进度仅保存在本机。登录后可换设备继续学。"
        : "云端未配置或不可用：进度仅保存在本机（不影响离线学习）。";
      if (loginBtn) loginBtn.hidden = false;
      if (logoutBtn) logoutBtn.hidden = true;
      if (syncBtn) syncBtn.hidden = true;
    }
  }

  function openModal(mode) {
    var modal = $("#auth-modal");
    if (!modal) return;
    modal.hidden = false;
    modal.dataset.mode = mode || "login";
    var accountMode = mode === "account";
    $("#auth-title").textContent = accountMode ? "账号" : (mode === "register" ? "注册账号" : "登录");
    var form = $("#auth-form");
    var sw = $("#auth-switch");
    var logout = $("#auth-logout");
    var hint = $("#auth-hint");
    if (accountMode) {
      if (form) form.hidden = true;
      if (sw) sw.hidden = true;
      if (logout) logout.hidden = false;
      if (hint) hint.textContent = currentUser ? ("已登录：" + (currentUser.email || "")) : "未登录";
    } else {
      if (form) form.hidden = false;
      if (sw) sw.hidden = false;
      if (logout) logout.hidden = true;
      if (hint) hint.textContent = "登录后进度会同步到云端，换设备也能继续学。未登录仍可离线使用。";
      $("#auth-submit").textContent = mode === "register" ? "注册并登录" : "登录";
      sw.textContent = mode === "register" ? "已有账号？去登录" : "没有账号？去注册";
      $("#auth-error").textContent = "";
      setTimeout(function () { var el = $("#auth-email"); if (el) el.focus(); }, 30);
    }
  }

  function closeModal() {
    var modal = $("#auth-modal");
    if (modal) modal.hidden = true;
  }

  /** 读远程整行 jsonb，失败返回 null */
  async function fetchRemoteRow(userId) {
    var c = ensureClient();
    if (!c) return null;
    var res = await c.from("progress").select("data, updated_at").eq("user_id", userId).maybeSingle();
    if (res.error) throw res.error;
    return res.data || null;
  }

  /**
   * 推送：先读远程 data，只改 NS 键，再 upsert，保留其它应用的键。
   */
  async function pushProgress(userId) {
    var c = ensureClient();
    if (!c) return;
    var local = readLocal();
    if (!local) return;
    var payload = JSON.stringify(local);
    if (payload === lastPushed) return;

    var row = null;
    try { row = await fetchRemoteRow(userId); } catch (e) { /* 无行也没关系 */ }
    var blob = (row && row.data && typeof row.data === "object" && !Array.isArray(row.data))
      ? Object.assign({}, row.data)
      : {};
    blob[NS] = local;

    var res = await c.from("progress").upsert({
      user_id: userId,
      data: blob,
      updated_at: new Date().toISOString()
    });
    if (res.error) throw res.error;
    lastPushed = payload;
  }

  function schedulePush(userId) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      pushProgress(userId).catch(function (e) {
        console.warn("progress sync failed", e);
      });
    }, 1200);
  }

  function hookLocalSave(userId) {
    if (hooked) return;
    hooked = true;
    var raw = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
      raw(key, value);
      if (key === STORAGE_KEY && currentUser) schedulePush(userId);
    };
  }

  /**
   * 登录后首次同步：云端有 NS → 云端优先；否则推本机。
   * 用 sessionStorage 标记，避免本站自己 reload 后再拉一次死循环。
   */
  async function syncOnLogin(userId) {
    var just = sessionStorage.getItem(PULLED_FLAG);
    if (just === userId) {
      sessionStorage.removeItem(PULLED_FLAG);
      lastPushed = JSON.stringify(readLocal() || {});
      return;
    }

    var row = await fetchRemoteRow(userId);
    var remoteNs = row && row.data && row.data[NS] ? row.data[NS] : null;
    var local = readLocal();

    if (remoteNs && typeof remoteNs === "object") {
      var remoteStr = JSON.stringify(remoteNs);
      var localStr = JSON.stringify(local || {});
      if (remoteStr !== localStr) {
        // 云端优先：写入本机并刷新，让 Engine 重新 load
        writeLocal(remoteNs);
        lastPushed = remoteStr;
        sessionStorage.setItem(PULLED_FLAG, userId);
        toast("已同步云端进度");
        setTimeout(function () { location.reload(); }, 450);
        return;
      }
      lastPushed = remoteStr;
      return;
    }

    // 云端无本站进度 → 推本机（若有）
    if (local) {
      await pushProgress(userId);
      toast("本机进度已上传云端");
    }
  }

  async function onAuth(session) {
    var user = session && session.user;
    setUserChip(user);
    if (!user) return;
    hookLocalSave(user.id);
    try {
      await syncOnLogin(user.id);
    } catch (e) {
      console.warn(e);
      toast("拉取云端进度失败，先用本地记录");
    }
  }

  async function submitAuth(e) {
    e.preventDefault();
    var c = ensureClient();
    if (!c) {
      toast("请先配置 supabase-config.js");
      return;
    }
    var email = ($("#auth-email").value || "").trim();
    var password = $("#auth-password").value || "";
    var mode = $("#auth-modal").dataset.mode || "login";
    var err = $("#auth-error");
    err.textContent = "";
    if (!email || password.length < 6) {
      err.textContent = "请填写邮箱，密码至少 6 位";
      return;
    }
    $("#auth-submit").disabled = true;
    try {
      var res;
      if (mode === "register") {
        res = await c.auth.signUp({ email: email, password: password });
      } else {
        res = await c.auth.signInWithPassword({ email: email, password: password });
      }
      if (res.error) throw res.error;
      closeModal();
      toast(mode === "register" ? "注册成功" : "登录成功");
      await onAuth(res.data.session);
    } catch (ex) {
      err.textContent = (ex && ex.message) || "失败，请重试";
    } finally {
      $("#auth-submit").disabled = false;
    }
  }

  async function signOut() {
    var c = ensureClient();
    if (c) await c.auth.signOut();
    currentUser = null;
    setUserChip(null);
    toast("已退出登录（本机进度仍在）");
  }

  async function syncNow() {
    if (!currentUser) {
      openModal("login");
      return;
    }
    try {
      await pushProgress(currentUser.id);
      toast("已同步到云端");
    } catch (e) {
      console.warn(e);
      toast("同步失败，请稍后重试");
    }
  }

  function injectUI() {
    if (!$("#auth-top")) {
      var wrap = document.createElement("div");
      wrap.id = "auth-top";
      wrap.className = "auth-top";
      wrap.innerHTML =
        '<button type="button" class="auth-chip" id="auth-user-chip" hidden></button>' +
        '<button type="button" class="auth-login-btn" id="auth-open-login">登录</button>';
      document.body.appendChild(wrap);
    }

    if (!$("#auth-modal")) {
      var modal = document.createElement("div");
      modal.id = "auth-modal";
      modal.className = "auth-modal";
      modal.hidden = true;
      modal.innerHTML =
        '<div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">' +
        '<button type="button" class="auth-close" id="auth-close" aria-label="关闭">×</button>' +
        '<h2 id="auth-title">登录</h2>' +
        '<p class="auth-hint" id="auth-hint">登录后进度会同步到云端，换设备也能继续学。未登录仍可离线使用。</p>' +
        '<form id="auth-form">' +
        '<label>邮箱<input id="auth-email" type="email" autocomplete="username" required></label>' +
        '<label>密码<input id="auth-password" type="password" autocomplete="current-password" minlength="6" required></label>' +
        '<p class="auth-error" id="auth-error"></p>' +
        '<button type="submit" class="auth-primary" id="auth-submit">登录</button>' +
        '</form>' +
        '<button type="button" class="text-button" id="auth-switch">没有账号？去注册</button>' +
        '<button type="button" class="text-button" id="auth-logout" hidden>退出登录</button>' +
        '</div>';
      document.body.appendChild(modal);

      $("#auth-close").addEventListener("click", closeModal);
      modal.addEventListener("click", function (ev) { if (ev.target === modal) closeModal(); });
      $("#auth-switch").addEventListener("click", function () {
        var mode = $("#auth-modal").dataset.mode === "register" ? "login" : "register";
        openModal(mode);
      });
      $("#auth-form").addEventListener("submit", submitAuth);
      $("#auth-logout").addEventListener("click", async function () {
        await signOut();
        closeModal();
      });
    }

    var openLogin = $("#auth-open-login");
    if (openLogin && !openLogin._zkBound) {
      openLogin._zkBound = true;
      openLogin.addEventListener("click", function () {
        if (!ready()) {
          toast("请先配置 supabase-config.js");
          return;
        }
        openModal("login");
      });
    }
    var chip = $("#auth-user-chip");
    if (chip && !chip._zkBound) {
      chip._zkBound = true;
      chip.addEventListener("click", function () { openModal("account"); });
    }
  }

  function bindSettingsDelegation() {
    if (document._zkAuthClick) return;
    document._zkAuthClick = true;
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest("#auth-settings-login") || t.closest("[data-action='auth-login']")) {
        ev.preventDefault();
        if (!ready()) { toast("请先配置 supabase-config.js"); return; }
        openModal("login");
        return;
      }
      if (t.closest("#auth-settings-logout") || t.closest("[data-action='auth-logout']")) {
        ev.preventDefault();
        signOut();
        return;
      }
      if (t.closest("#auth-settings-sync") || t.closest("[data-action='auth-sync']")) {
        ev.preventDefault();
        syncNow();
      }
    });
  }

  function watchAppRenders() {
    var app = document.getElementById("app");
    if (!app || app._zkAuthObs) return;
    app._zkAuthObs = true;
    var obs = new MutationObserver(function () { refreshSettingsCard(); });
    obs.observe(app, { childList: true });
    window.addEventListener("hashchange", function () {
      setTimeout(refreshSettingsCard, 0);
    });
  }

  async function boot() {
    injectUI();
    bindSettingsDelegation();
    watchAppRenders();

    if (!ready()) {
      console.warn("ZK_SUPABASE 未配置，登录暂不可用（离线学习不受影响）");
      setUserChip(null);
      return;
    }
    var c = ensureClient();
    if (!c) {
      setUserChip(null);
      return;
    }
    try {
      var sessionRes = await c.auth.getSession();
      await onAuth(sessionRes.data.session);
      c.auth.onAuthStateChange(function (_event, session) {
        setUserChip(session && session.user);
        if (session && session.user) hookLocalSave(session.user.id);
      });
    } catch (e) {
      console.warn(e);
      toast("登录服务暂时不可用，先用本机进度");
      setUserChip(null);
    }
  }

  window.ZkAuth = {
    openLogin: function () { openModal("login"); },
    signOut: signOut,
    syncNow: syncNow,
    ready: ready
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
