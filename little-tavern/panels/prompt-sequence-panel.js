window.PYQ_REBUILD_PANELS = window.PYQ_REBUILD_PANELS || {};

window.PYQ_REBUILD_PANELS["prompt-sequence"] = function createPromptSequencePanel() {
  return {
    title: "\u987a\u5e8f",
    html:
      '<div class="pyq-rebuild-form">' +
      '<div class="pyq-rebuild-grid">' +
      '<label class="pyq-rebuild-field"><span>\u5f53\u524d\u9884\u8bbe</span><input data-seq-input="presetName" type="text"></label>' +
      '<label class="pyq-rebuild-field"><span>\u5feb\u901f\u8fc7\u6ee4</span><input data-seq-input="filter" type="text" placeholder="\u641c\u7d22\u6807\u9898"></label>' +
      '<label class="pyq-rebuild-field"><span>\u7c7b\u578b\u7b5b\u9009</span><select data-seq-input="selectedType"><option value="all">all</option><option value="dynamic">dynamic</option><option value="static">static</option></select></label>' +
      "</div>" +
      '<div class="pyq-rebuild-sequence-list" data-seq-list></div>' +
      '<label class="pyq-rebuild-field"><span>\u7f16\u8f91\u9884\u89c8</span><textarea data-seq-preview rows="10" readonly></textarea></label>' +
      '<label class="pyq-rebuild-field"><span>\u9884\u8bbe\u5217\u8868</span><div class="pyq-rebuild-sequence-list" data-seq-presets></div></label>' +
      '<div class="pyq-rebuild-actions">' +
      '<button type="button" data-seq-action="add-static">\u65b0\u589e\u9759\u6001</button>' +
      '<button type="button" data-seq-action="add-dynamic">\u65b0\u589e\u52a8\u6001</button>' +
      '<button type="button" data-seq-action="save-preset">\u4fdd\u5b58\u9884\u8bbe</button>' +
      '<button type="button" data-seq-action="overwrite-preset">\u8986\u76d6\u9884\u8bbe</button>' +
      '<button type="button" data-seq-action="delete-preset">\u5220\u9664\u9884\u8bbe</button>' +
      '<button type="button" data-seq-action="export">\u5bfc\u51fa</button>' +
      '<button type="button" data-seq-action="import-json">\u5bfc\u5165 JSON</button>' +
      '<button type="button" data-seq-action="import-tavern">\u5bfc\u5165\u9152\u9986\u9884\u8bbe</button>' +
      "</div>" +
      "</div>",
    onMount(container) {
      const state = window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.read();
      const elements = {
        presetName: container.querySelector('[data-seq-input="presetName"]'),
        filter: container.querySelector('[data-seq-input="filter"]'),
        selectedType: container.querySelector('[data-seq-input="selectedType"]'),
        list: container.querySelector("[data-seq-list]"),
        preview: container.querySelector("[data-seq-preview]"),
        presets: container.querySelector("[data-seq-presets]"),
        addStatic: container.querySelector('[data-seq-action="add-static"]'),
        addDynamic: container.querySelector('[data-seq-action="add-dynamic"]'),
        savePreset: container.querySelector('[data-seq-action="save-preset"]'),
        overwritePreset: container.querySelector('[data-seq-action="overwrite-preset"]'),
        deletePreset: container.querySelector('[data-seq-action="delete-preset"]'),
        export: container.querySelector('[data-seq-action="export"]'),
        importJson: container.querySelector('[data-seq-action="import-json"]'),
        importTavern: container.querySelector('[data-seq-action="import-tavern"]')
      };

      function persist() {
        window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.save(state);
      }

      function refreshPreview() {
        elements.preview.value =
          window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.exportPromptText(state);
      }

      function renderPresets() {
        elements.presets.innerHTML = state.presets
          .map(
            (preset) =>
              `<div class="pyq-rebuild-sequence-item"><strong>${preset.name}</strong><div class="pyq-rebuild-actions"><button type="button" data-seq-load-preset="${preset.name}">Load</button></div></div>`
          )
          .join("");

        elements.presets.querySelectorAll("[data-seq-load-preset]").forEach((node) => {
          node.addEventListener("click", () => {
            const name = node.getAttribute("data-seq-load-preset");
            const preset = state.presets.find((item) => item.name === name);
            if (!preset) return;
            state.presetName = preset.name;
            state.items = preset.items.map((item) => ({ ...item }));
            persist();
            elements.presetName.value = state.presetName;
            render();
            refreshPreview();
          });
        });
      }

      function render() {
        const keyword = state.filter.trim().toLowerCase();
        const filtered = state.items
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => {
            const matchesKeyword =
              !keyword || item.title.toLowerCase().includes(keyword);
            const matchesType =
              state.selectedType === "all" || item.type === state.selectedType;
            return matchesKeyword && matchesType;
          });

        elements.list.innerHTML = filtered
          .map(({ item, index }) => {
            const body =
              item.type === "static"
                ? item.content || ""
                : `{{${item.key || "dynamic_key"}}}`;
            return (
              `<div class="pyq-rebuild-sequence-item" draggable="true" data-seq-drag="${item.id}">` +
              `<strong>${index + 1}. ${item.title}</strong><br>` +
              `<small>${item.type} · ${item.role} · ${item.enabled ? "enabled" : "disabled"} · ${item.locked ? "locked" : "editable"}</small>` +
              `<textarea data-seq-edit="${item.id}" rows="3">${body}</textarea>` +
              `<div class="pyq-rebuild-actions">` +
              `<button type="button" data-seq-toggle="${item.id}">${item.enabled ? "禁用" : "启用"}</button>` +
              `<button type="button" data-seq-lock="${item.id}">${item.locked ? "解锁" : "锁定"}</button>` +
              `<button type="button" data-seq-up="${index}">上移</button>` +
              `<button type="button" data-seq-down="${index}">下移</button>` +
              `<button type="button" data-seq-preview="${item.id}">预览</button>` +
              `<button type="button" data-seq-delete="${item.id}">删除</button>` +
              `</div>` +
              `</div>`
            );
          })
          .join("");

        elements.list.querySelectorAll("[data-seq-edit]").forEach((node) => {
          node.addEventListener("input", () => {
            const id = node.getAttribute("data-seq-edit");
            const target = state.items.find((item) => item.id === id);
            if (!target || target.locked) return;
            if (target.type === "static") {
              target.content = node.value;
            } else {
              target.key = node.value.replace(/[{}]/g, "").trim();
            }
            persist();
            refreshPreview();
          });
        });

        elements.list.querySelectorAll("[data-seq-toggle]").forEach((node) => {
          node.addEventListener("click", () => {
            const id = node.getAttribute("data-seq-toggle");
            const target = state.items.find((item) => item.id === id);
            if (!target) return;
            target.enabled = !target.enabled;
            persist();
            render();
            refreshPreview();
          });
        });

        elements.list.querySelectorAll("[data-seq-lock]").forEach((node) => {
          node.addEventListener("click", () => {
            const id = node.getAttribute("data-seq-lock");
            const target = state.items.find((item) => item.id === id);
            if (!target) return;
            target.locked = !target.locked;
            persist();
            render();
            refreshPreview();
          });
        });

        elements.list.querySelectorAll("[data-seq-up]").forEach((node) => {
          node.addEventListener("click", () => {
            const index = Number(node.getAttribute("data-seq-up"));
            if (index <= 0) return;
            const [item] = state.items.splice(index, 1);
            state.items.splice(index - 1, 0, item);
            persist();
            render();
            refreshPreview();
          });
        });

        elements.list.querySelectorAll("[data-seq-down]").forEach((node) => {
          node.addEventListener("click", () => {
            const index = Number(node.getAttribute("data-seq-down"));
            if (index >= state.items.length - 1) return;
            const [item] = state.items.splice(index, 1);
            state.items.splice(index + 1, 0, item);
            persist();
            render();
            refreshPreview();
          });
        });

        elements.list.querySelectorAll("[data-seq-preview]").forEach((node) => {
          node.addEventListener("click", () => {
            const id = node.getAttribute("data-seq-preview");
            const target = state.items.find((item) => item.id === id);
            if (!target) return;
            window.alert(
              `${target.title}\n\n${
                target.type === "static" ? target.content || "(empty)" : `{{${target.key}}}`
              }`
            );
          });
        });

        elements.list.querySelectorAll("[data-seq-delete]").forEach((node) => {
          node.addEventListener("click", () => {
            const id = node.getAttribute("data-seq-delete");
            state.items = state.items.filter((item) => item.id !== id || item.locked);
            persist();
            render();
            refreshPreview();
          });
        });

        let draggingId = null;
        elements.list.querySelectorAll("[data-seq-drag]").forEach((node) => {
          node.addEventListener("dragstart", () => {
            draggingId = node.getAttribute("data-seq-drag");
          });
          node.addEventListener("dragover", (event) => {
            event.preventDefault();
          });
          node.addEventListener("drop", () => {
            const targetId = node.getAttribute("data-seq-drag");
            if (!draggingId || !targetId || draggingId === targetId) return;
            const from = state.items.findIndex((item) => item.id === draggingId);
            const to = state.items.findIndex((item) => item.id === targetId);
            if (from < 0 || to < 0) return;
            const [item] = state.items.splice(from, 1);
            state.items.splice(to, 0, item);
            persist();
            render();
            refreshPreview();
          });
        });

        renderPresets();
      }

      elements.presetName.value = state.presetName;
      elements.filter.value = state.filter;
      elements.selectedType.value = state.selectedType;

      elements.presetName.addEventListener("input", () => {
        state.presetName = elements.presetName.value;
        persist();
      });

      elements.filter.addEventListener("input", () => {
        state.filter = elements.filter.value;
        persist();
        render();
      });

      elements.selectedType.addEventListener("change", () => {
        state.selectedType = elements.selectedType.value;
        persist();
        render();
      });

      elements.addStatic.addEventListener("click", () => {
        state.items.push({
          id: `static_${Date.now()}`,
          title: `Static Item ${state.items.length + 1}`,
          type: "static",
          role: "system",
          key: "",
          enabled: true,
          locked: false,
          content: ""
        });
        persist();
        render();
        refreshPreview();
      });

      elements.addDynamic.addEventListener("click", () => {
        state.items.push({
          id: `dynamic_${Date.now()}`,
          title: `Dynamic Item ${state.items.length + 1}`,
          type: "dynamic",
          role: "system",
          key: "dynamic_key",
          enabled: true,
          locked: false,
          content: ""
        });
        persist();
        render();
        refreshPreview();
      });

      elements.savePreset.addEventListener("click", () => {
        const snapshot = {
          id: state.presetName || `preset_${Date.now()}`,
          name: state.presetName || `preset_${Date.now()}`,
          items: state.items.map((item) => ({ ...item }))
        };
        state.presets.push(snapshot);
        persist();
        render();
      });

      elements.overwritePreset.addEventListener("click", () => {
        const snapshot = {
          id: state.presetName || `preset_${Date.now()}`,
          name: state.presetName || `preset_${Date.now()}`,
          items: state.items.map((item) => ({ ...item }))
        };
        const existingIndex = state.presets.findIndex((preset) => preset.name === snapshot.name);
        if (existingIndex >= 0) {
          state.presets[existingIndex] = snapshot;
        } else {
          state.presets.push(snapshot);
        }
        persist();
        render();
      });

      elements.deletePreset.addEventListener("click", () => {
        window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.removePreset(state, state.presetName);
        persist();
        elements.presetName.value = state.presetName;
        render();
        refreshPreview();
      });

      elements.export.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], {
          type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "pyq-prompt-sequence.json";
        anchor.click();
        URL.revokeObjectURL(url);
      });

      elements.importJson.addEventListener("click", () => {
        const json = window.prompt("Paste preset JSON here");
        if (!json) return;
        try {
          const parsed = JSON.parse(json);
          if (Array.isArray(parsed.presets) && parsed.presets.length) {
            window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.setPresets(
              state,
              parsed.presets,
              parsed.currentPresetId || parsed.presets[0].name
            );
          }
          persist();
          elements.presetName.value = state.presetName;
          render();
          refreshPreview();
        } catch (error) {
          window.alert(`Import error: ${error.message}`);
        }
      });

      elements.importTavern.addEventListener("click", () => {
        const imported = window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.importFromTavernPresets();
        if (!imported.length) return;
        state.items = imported;
        persist();
        render();
        refreshPreview();
      });

      render();
      refreshPreview();
    }
  };
};
