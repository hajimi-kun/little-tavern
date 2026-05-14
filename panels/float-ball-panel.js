window.PYQ_REBUILD_PANELS = window.PYQ_REBUILD_PANELS || {};

window.PYQ_REBUILD_PANELS["float-ball"] = function createFloatBallPanel() {
  return {
    title: "\u60ac\u6d6e\u7403",
    html:
      '<div class="pyq-rebuild-form">' +
      '<label class="pyq-rebuild-field"><span>\u542f\u7528</span><select data-float-input="enabled"><option value="true">\u662f</option><option value="false">\u5426</option></select></label>' +
      '<label class="pyq-rebuild-field"><span>\u6587\u672c</span><input data-float-input="text" type="text"></label>' +
      '<label class="pyq-rebuild-field"><span>\u5927\u5c0f</span><input data-float-input="size" type="number" min="32" max="120"></label>' +
      '<label class="pyq-rebuild-field"><span>\u900f\u660e\u5ea6</span><input data-float-input="opacity" type="number" min="0.2" max="1" step="0.01"></label>' +
      '<div class="pyq-rebuild-actions"><button type="button" data-float-action="save">\u4fdd\u5b58</button></div>' +
      "</div>",
    onMount(container) {
      const state = window.PYQ_REBUILD_FLOAT_BALL_STATE.read();
      const elements = {
        enabled: container.querySelector('[data-float-input="enabled"]'),
        text: container.querySelector('[data-float-input="text"]'),
        size: container.querySelector('[data-float-input="size"]'),
        opacity: container.querySelector('[data-float-input="opacity"]'),
        save: container.querySelector('[data-float-action="save"]')
      };

      elements.enabled.value = String(state.enabled);
      elements.text.value = state.text;
      elements.size.value = String(state.size);
      elements.opacity.value = String(state.opacity);

      elements.save.addEventListener("click", () => {
        state.enabled = elements.enabled.value === "true";
        state.text = elements.text.value;
        state.size = Number(elements.size.value) || 52;
        state.opacity = Number(elements.opacity.value) || 0.92;
        window.PYQ_REBUILD_FLOAT_BALL_STATE.save(state);
      });
    }
  };
};
