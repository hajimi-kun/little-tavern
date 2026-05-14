window.PYQ_REBUILD_DATA_BACKUP = (function () {
  function exportAll() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      gen: window.PYQ_REBUILD_GEN_STATE.readConfig(),
      promptSequence: window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.read(),
      worldbook: window.PYQ_REBUILD_WORLDBOOK_STATE.read(),
      floatBall: window.PYQ_REBUILD_FLOAT_BALL_STATE.read(),
      favorites: window.PYQ_REBUILD_FAVORITES_STATE.read(),
      style: window.PYQ_REBUILD_STYLE_STATE.read()
    };
  }

  function importAll(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid backup payload");
    }

    if (payload.gen) window.PYQ_REBUILD_GEN_STATE.saveConfig(payload.gen);
    if (payload.promptSequence) window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.save(payload.promptSequence);
    if (payload.worldbook) window.PYQ_REBUILD_WORLDBOOK_STATE.save(payload.worldbook);
    if (payload.floatBall) window.PYQ_REBUILD_FLOAT_BALL_STATE.save(payload.floatBall);
    if (payload.favorites) window.PYQ_REBUILD_FAVORITES_STATE.save(payload.favorites);
    if (payload.style) window.PYQ_REBUILD_STYLE_STATE.save(payload.style);
  }

  return {
    exportAll,
    importAll
  };
})();
