(function () {
  const modulePaths = [
    "./app/shell/constants.js",
    "./app/shell/tabs.js",
    "./stores/gen-state.js",
    "./stores/prompt-sequence-state.js",
    "./stores/worldbook-state.js",
    "./stores/float-ball-state.js",
    "./stores/favorites-state.js",
    "./stores/style-state.js",
    "./services/st-context.js",
    "./services/gen-api.js",
    "./services/worldbook-service.js",
    "./services/data-backup.js",
    "./panels/gen-panel.js",
    "./panels/prompt-sequence-panel.js",
    "./panels/worldbook-panel.js",
    "./panels/float-ball-panel.js",
    "./panels/favorites-panel.js",
    "./panels/style-panel.js",
    "./panels/data-panel.js",
    "./app/shell/renderers.js",
    "./app/shell/state.js",
    "./app/shell/app.js"
  ];

  function getBaseUrl() {
    const current = document.currentScript;
    if (current?.src) {
      return current.src.slice(0, current.src.lastIndexOf("/") + 1);
    }

    const scripts = Array.from(document.querySelectorAll("script[src]"));
    const fallback = scripts.find((item) => item.src.includes("/index.js"));
    return fallback?.src
      ? fallback.src.slice(0, fallback.src.lastIndexOf("/") + 1)
      : "";
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  async function boot() {
    const baseUrl = getBaseUrl();
    for (const relativePath of modulePaths) {
      await loadScript(new URL(relativePath, baseUrl).toString());
    }
  }

  boot().catch((error) => {
    console.error("[pyq-rebuild] shell bootstrap failed:", error);
  });
})();
