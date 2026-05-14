window.PYQ_REBUILD_PANELS = window.PYQ_REBUILD_PANELS || {};

window.PYQ_REBUILD_PANELS.worldbook = function createWorldbookPanel() {
  return {
    title: "\u4e16\u754c\u4e66",
    html:
      '<div class="pyq-rebuild-form">' +
      '<label class="pyq-rebuild-field"><span>\u4e16\u754c\u4e66\u540d\u79f0</span><input data-worldbook-input="name" type="text" placeholder="Worldbook name"></label>' +
      '<label class="pyq-rebuild-field"><span>\u63d2\u5165\u4f4d\u7f6e</span><select data-worldbook-input="position"><option value="before_character_definition">before_character_definition</option><option value="after_character_definition">after_character_definition</option></select></label>' +
      '<label class="pyq-rebuild-field"><span>\u52a0\u8f7d\u7ed3\u679c</span><textarea data-worldbook-output rows="12" readonly></textarea></label>' +
      '<div class="pyq-rebuild-actions"><button type="button" data-worldbook-action="load">\u52a0\u8f7d</button><button type="button" data-worldbook-action="save">\u4fdd\u5b58</button></div>' +
      "</div>",
    onMount(container) {
      const state = window.PYQ_REBUILD_WORLDBOOK_STATE.read();
      const elements = {
        name: container.querySelector('[data-worldbook-input="name"]'),
        position: container.querySelector('[data-worldbook-input="position"]'),
        output: container.querySelector("[data-worldbook-output]"),
        load: container.querySelector('[data-worldbook-action="load"]'),
        save: container.querySelector('[data-worldbook-action="save"]')
      };

      elements.name.value = state.worldbookName;
      elements.position.value = state.position;
      elements.output.value = state.loadedSummary;

      elements.save.addEventListener("click", () => {
        state.worldbookName = elements.name.value.trim();
        state.position = elements.position.value;
        state.loadedSummary = elements.output.value;
        window.PYQ_REBUILD_WORLDBOOK_STATE.save(state);
      });

      elements.load.addEventListener("click", async () => {
        elements.output.value = "loading...";
        try {
          const loaded = await window.PYQ_REBUILD_WORLDBOOK_SERVICE.loadWorldbook(
            elements.name.value
          );
          state.worldbookName = loaded.name;
          state.loadedSummary = loaded.summary;
          elements.output.value = loaded.summary;
          window.PYQ_REBUILD_WORLDBOOK_STATE.save(state);
        } catch (error) {
          elements.output.value = `Error: ${error.message}`;
        }
      });
    }
  };
};
