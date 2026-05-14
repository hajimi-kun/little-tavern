(function () {
  const { EXTENSION_ID, MENU_ITEM_ID, PANEL_ID, STORAGE_KEY } =
    window.PYQ_REBUILD_CONSTANTS;
  const panelRenderers = window.PYQ_REBUILD_RENDERERS;
  const TABS = window.PYQ_REBUILD_TABS;
  const { readState, saveState } = window.PYQ_REBUILD_STATE;

  function getScriptIdSafe() {
    try {
      if (typeof getScriptId === "function") return getScriptId();
    } catch (error) {
      console.warn("[pyq-rebuild] getScriptId unavailable:", error);
    }
    return EXTENSION_ID;
  }

  function createShell() {
    const state = readState(STORAGE_KEY);
    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.className = "pyq-rebuild-panel pyq-rebuild-hidden";
    panel.setAttribute("data-script-id", getScriptIdSafe());

    panel.innerHTML =
      '<div class="pyq-rebuild-backdrop" data-role="backdrop"></div>' +
      '<section class="pyq-rebuild-dialog" role="dialog" aria-modal="true" aria-label="\\u5c0f\\u5267\\u573a\\u751f\\u6210\\u5668">' +
      '<header class="pyq-rebuild-header">' +
      '<div class="pyq-rebuild-title">' +
      '<span class="pyq-rebuild-badge">Rebuild</span>' +
      "<div><h2>\\u5c0f\\u5267\\u573a\\u751f\\u6210\\u5668</h2><p>Phase 2 Source Shell</p></div>" +
      "</div>" +
      '<button type="button" class="pyq-rebuild-close" data-role="close" aria-label="Close">×</button>' +
      "</header>" +
      '<div class="pyq-rebuild-body">' +
      '<aside class="pyq-rebuild-nav" data-role="nav"></aside>' +
      '<main class="pyq-rebuild-content">' +
      '<section class="pyq-rebuild-card">' +
      '<div class="pyq-rebuild-card-header"><h3 data-role="panel-title"></h3><span class="pyq-rebuild-status">phase-2 shell</span></div>' +
      '<div class="pyq-rebuild-card-body" data-role="panel-body"></div>' +
      "</section>" +
      '<section class="pyq-rebuild-card">' +
      '<div class="pyq-rebuild-card-header"><h3>\\u57fa\\u7840\\u72b6\\u6001</h3></div>' +
      '<div class="pyq-rebuild-card-body">' +
      '<label class="pyq-rebuild-toggle"><input type="checkbox" data-role="debug-toggle"><span>\\u663e\\u793a\\u8c03\\u8bd5\\u8bf4\\u660e</span></label>' +
      `<div class="pyq-rebuild-debug ${state.debugOpen ? "" : "pyq-rebuild-hidden"}" data-role="debug-box">` +
      "<p>\\u8fd9\\u4e2a\\u6e90\\u7801\\u58f3\\u5c42\\u5df2\\u7ecf\\u5b8c\\u6210\\uff1a</p>" +
      "<ul><li>\\u6269\\u5c55\\u5165\\u53e3\\u6ce8\\u5165</li><li>\\u4e3b\\u9762\\u677f\\u6253\\u5f00 / \\u5173\\u95ed</li><li>\\u5bfc\\u822a\\u5207\\u6362</li><li>\\u672c\\u5730\\u72b6\\u6001\\u6301\\u4e45\\u5316</li><li>\\u540e\\u7eed\\u9762\\u677f\\u6e90\\u7801\\u5316\\u843d\\u70b9</li></ul>" +
      "</div></div></section></main></div></section>";

    const nav = panel.querySelector('[data-role="nav"]');
    const title = panel.querySelector('[data-role="panel-title"]');
    const body = panel.querySelector('[data-role="panel-body"]');
    const debugToggle = panel.querySelector('[data-role="debug-toggle"]');
    const debugBox = panel.querySelector('[data-role="debug-box"]');

    function renderTab(tabKey) {
      const renderer = panelRenderers[tabKey] || panelRenderers.gen;
      const rendered = renderer();
      title.textContent = rendered.title;
      body.innerHTML = rendered.html;
      if (typeof rendered.onMount === "function") {
        rendered.onMount(body);
      }

      for (const button of nav.querySelectorAll("button")) {
        button.classList.toggle("active", button.dataset.tab === tabKey);
      }

      state.activeTab = tabKey;
      saveState(STORAGE_KEY, state);
    }

    TABS.forEach((tab) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.tab = tab.key;
      button.textContent = tab.label;
      button.addEventListener("click", () => renderTab(tab.key));
      nav.appendChild(button);
    });

    debugToggle.checked = state.debugOpen;
    debugToggle.addEventListener("change", () => {
      state.debugOpen = debugToggle.checked;
      debugBox.classList.toggle("pyq-rebuild-hidden", !state.debugOpen);
      saveState(STORAGE_KEY, state);
    });

    panel.querySelector('[data-role="close"]').addEventListener("click", closePanel);
    panel.querySelector('[data-role="backdrop"]').addEventListener("click", closePanel);

    document.body.appendChild(panel);
    renderTab(state.activeTab);
    return panel;
  }

  function ensurePanel() {
    return document.getElementById(PANEL_ID) || createShell();
  }

  function openPanel() {
    ensurePanel().classList.remove("pyq-rebuild-hidden");
  }

  function closePanel() {
    const panel = document.getElementById(PANEL_ID);
    if (panel) panel.classList.add("pyq-rebuild-hidden");
  }

  function findMenuContainer() {
    return (
      document.querySelector("#extensionsMenu .list-group") ||
      document.querySelector("#extensionsMenu") ||
      document.querySelector("#extensions_menu .list-group") ||
      document.querySelector("#extensions_menu")
    );
  }

  function ensureMenuItem() {
    let button = document.getElementById(MENU_ITEM_ID);
    if (button) return button;

    const container = findMenuContainer();
    if (!container) return null;

    button = document.createElement("div");
    button.id = MENU_ITEM_ID;
    button.className = "list-group-item flex-container flexGap5";
    button.title = "\\u5c0f\\u5267\\u573a\\u751f\\u6210\\u5668\\uff08\\u6e90\\u7801\\u58f3\\u5c42\\uff09";
    button.innerHTML =
      '<i class="fa-solid fa-wand-magic-sparkles extensionsMenuExtensionButton"></i>\\u5c0f\\u5267\\u573a\\u751f\\u6210\\u5668';
    button.addEventListener("click", openPanel);
    container.appendChild(button);
    return button;
  }

  function registerGlobalEvents() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePanel();
    });

    const host = document.querySelector("#extensionsMenuButton") || document.body;
    if (host) {
      host.addEventListener("click", () => {
        window.setTimeout(ensureMenuItem, 0);
      });
    }
  }

  function boot() {
    ensureMenuItem();
    ensurePanel();
    registerGlobalEvents();
    console.log("[pyq-rebuild] source shell mounted");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
