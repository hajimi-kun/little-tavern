window.PYQ_REBUILD_PANELS = window.PYQ_REBUILD_PANELS || {};

window.PYQ_REBUILD_PANELS.favorites = function createFavoritesPanel() {
  return {
    title: "\u6536\u85cf",
    html:
      '<div class="pyq-rebuild-form">' +
      '<div class="pyq-rebuild-sequence-list" data-favorites-list></div>' +
      '<div class="pyq-rebuild-actions"><button type="button" data-favorites-action="add-demo">\u65b0\u589e\u793a\u4f8b</button><button type="button" data-favorites-action="export">\u5bfc\u51fa</button></div>' +
      "</div>",
    onMount(container) {
      const items = window.PYQ_REBUILD_FAVORITES_STATE.read();
      const list = container.querySelector("[data-favorites-list]");
      const addDemo = container.querySelector('[data-favorites-action="add-demo"]');
      const exportButton = container.querySelector('[data-favorites-action="export"]');

      function persist() {
        window.PYQ_REBUILD_FAVORITES_STATE.save(items);
      }

      function render() {
        if (!items.length) {
          list.innerHTML =
            '<div class="pyq-rebuild-sequence-item">\u6682\u65e0\u6536\u85cf\u5185\u5bb9</div>';
          return;
        }
        list.innerHTML = items
          .map(
            (item) =>
              `<div class="pyq-rebuild-sequence-item"><strong>${item.title}</strong><br><small>${item.characterName || "unknown"}</small></div>`
          )
          .join("");
      }

      addDemo.addEventListener("click", () => {
        items.push({
          id: `fav_${Date.now()}`,
          title: `Favorite ${items.length + 1}`,
          characterName: "Demo Character"
        });
        persist();
        render();
      });

      exportButton.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(items, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "pyq-favorites.json";
        anchor.click();
        URL.revokeObjectURL(url);
      });

      render();
    }
  };
};
