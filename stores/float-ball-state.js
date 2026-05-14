window.PYQ_REBUILD_FLOAT_BALL_STATE = (function () {
  const STORAGE_KEY = "pyq_creator_rebuild_float_ball";

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        enabled: parsed.enabled !== false,
        text: parsed.text || "Pyq",
        size: parsed.size || 52,
        opacity: parsed.opacity || 0.92
      };
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read float ball state:", error);
      return {
        enabled: true,
        text: "Pyq",
        size: 52,
        opacity: 0.92
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
