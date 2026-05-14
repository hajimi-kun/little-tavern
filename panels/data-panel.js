window.PYQ_REBUILD_PANELS = window.PYQ_REBUILD_PANELS || {};

window.PYQ_REBUILD_PANELS.data = function createDataPanel() {
  return {
    title: "\u6570\u636e",
    html:
      '<div class="pyq-rebuild-form">' +
      '<label class="pyq-rebuild-field"><span>\u5907\u4efd\u9884\u89c8</span><textarea data-backup-output rows="12" readonly></textarea></label>' +
      '<label class="pyq-rebuild-field"><span>\u5bfc\u5165 JSON</span><textarea data-backup-input rows="8" placeholder="{ }"></textarea></label>' +
      '<div class="pyq-rebuild-actions"><button type="button" data-backup-action="export">\u5bfc\u51fa</button><button type="button" data-backup-action="import">\u5bfc\u5165</button><button type="button" data-backup-action="refresh">\u5237\u65b0</button></div>' +
      "</div>",
    onMount(container) {
      const output = container.querySelector("[data-backup-output]");
      const input = container.querySelector("[data-backup-input]");
      const exportButton = container.querySelector('[data-backup-action="export"]');
      const importButton = container.querySelector('[data-backup-action="import"]');
      const refreshButton = container.querySelector('[data-backup-action="refresh"]');

      function refresh() {
        output.value = JSON.stringify(window.PYQ_REBUILD_DATA_BACKUP.exportAll(), null, 2);
      }

      exportButton.addEventListener("click", () => {
        const payload = window.PYQ_REBUILD_DATA_BACKUP.exportAll();
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "pyq-creator-backup.json";
        anchor.click();
        URL.revokeObjectURL(url);
      });

      importButton.addEventListener("click", () => {
        try {
          const parsed = JSON.parse(input.value);
          window.PYQ_REBUILD_DATA_BACKUP.importAll(parsed);
          refresh();
        } catch (error) {
          output.value = `Import error: ${error.message}`;
        }
      });

      refreshButton.addEventListener("click", refresh);
      refresh();
    }
  };
};
