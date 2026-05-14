window.PYQ_REBUILD_STATE = {
  readState(storageKey) {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        activeTab: parsed.activeTab || "gen",
        debugOpen: Boolean(parsed.debugOpen)
      };
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read state:", error);
      return { activeTab: "gen", debugOpen: false };
    }
  },
  saveState(storageKey, state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }
};
