window.PYQ_REBUILD_STYLE_STATE = (function () {
  const STORAGE_KEY = "pyq_creator_rebuild_style";

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        primary: parsed.primary || "#155eef",
        accent: parsed.accent || "#0f766e",
        radius: parsed.radius || 16
      };
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read style state:", error);
      return {
        primary: "#155eef",
        accent: "#0f766e",
        radius: 16
      };
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  return {
    read,
    save
  };
})();
