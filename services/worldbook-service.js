window.PYQ_REBUILD_WORLDBOOK_SERVICE = (function () {
  async function loadWorldbook(name) {
    if (!name.trim()) {
      throw new Error("Worldbook name is required");
    }

    if (!window.SillyTavern?.loadWorldInfo) {
      throw new Error("SillyTavern.loadWorldInfo is not available");
    }

    const result = await window.SillyTavern.loadWorldInfo(name.trim());
    const text =
      typeof result === "string"
        ? result
        : JSON.stringify(result, null, 2);

    return {
      name: name.trim(),
      summary: text.slice(0, 1200)
    };
  }

  return {
    loadWorldbook
  };
})();
