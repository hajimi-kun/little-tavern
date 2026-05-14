window.PYQ_REBUILD_WORLDBOOK_STATE = (function () {
  const STORAGE_KEY = "pyq_creator_rebuild_worldbook";

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        worldbookName: parsed.worldbookName || "",
        position: parsed.position || "before_character_definition",
        loadedSummary: parsed.loadedSummary || ""
      };
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read worldbook state:", error);
      return {
        worldbookName: "",
        position: "before_character_definition",
        loadedSummary: ""
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
