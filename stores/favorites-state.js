window.PYQ_REBUILD_FAVORITES_STATE = (function () {
  const STORAGE_KEY = "pyq_creator_rebuild_favorites";

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read favorites:", error);
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function add(items, entry) {
    items.push(entry);
    save(items);
  }

  return {
    read,
    save,
    add
  };
})();
