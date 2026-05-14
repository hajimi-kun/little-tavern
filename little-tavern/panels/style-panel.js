window.PYQ_REBUILD_PANELS = window.PYQ_REBUILD_PANELS || {};

window.PYQ_REBUILD_PANELS.style = function createStylePanel() {
  return {
    title: "\u6837\u5f0f",
    html:
      '<div class="pyq-rebuild-form">' +
      '<label class="pyq-rebuild-field"><span>Primary</span><input data-style-input="primary" type="color"></label>' +
      '<label class="pyq-rebuild-field"><span>Accent</span><input data-style-input="accent" type="color"></label>' +
      '<label class="pyq-rebuild-field"><span>Radius</span><input data-style-input="radius" type="number" min="8" max="32"></label>' +
      '<div class="pyq-rebuild-actions"><button type="button" data-style-action="apply">\u5e94\u7528</button></div>' +
      "</div>",
    onMount(container) {
      const state = window.PYQ_REBUILD_STYLE_STATE.read();
      const elements = {
        primary: container.querySelector('[data-style-input="primary"]'),
        accent: container.querySelector('[data-style-input="accent"]'),
        radius: container.querySelector('[data-style-input="radius"]'),
        apply: container.querySelector('[data-style-action="apply"]')
      };

      elements.primary.value = state.primary;
      elements.accent.value = state.accent;
      elements.radius.value = String(state.radius);

      elements.apply.addEventListener("click", () => {
        state.primary = elements.primary.value;
        state.accent = elements.accent.value;
        state.radius = Number(elements.radius.value) || 16;
        window.PYQ_REBUILD_STYLE_STATE.save(state);
        document.documentElement.style.setProperty("--pyq-rebuild-primary", state.primary);
        document.documentElement.style.setProperty("--pyq-rebuild-accent", state.accent);
        document.documentElement.style.setProperty("--pyq-rebuild-radius", `${state.radius}px`);
      });
    }
  };
};
