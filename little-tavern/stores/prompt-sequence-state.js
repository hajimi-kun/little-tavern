window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE = (function () {
  const STORAGE_KEY = "pyq_creator_rebuild_prompt_sequence";

  function defaultItems() {
    return [
      {
        id: "character_definition",
        title: "\u89d2\u8272\u5b9a\u4e49",
        type: "dynamic",
        role: "system",
        key: "character_definition",
        enabled: true,
        locked: false,
        content: ""
      },
      {
        id: "persona_description",
        title: "\u7528\u6237 persona",
        type: "dynamic",
        role: "system",
        key: "persona_description",
        enabled: true,
        locked: false,
        content: ""
      },
      {
        id: "chat_history",
        title: "\u804a\u5929\u8bb0\u5f55",
        type: "dynamic",
        role: "user",
        key: "chat_history",
        enabled: true,
        locked: false,
        content: ""
      }
    ];
  }

  function defaultPresets(items) {
    return [
      {
        id: "default",
        name: "default",
        items: items.map((item) => ({ ...item }))
      }
    ];
  }

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const items =
        Array.isArray(parsed.items) && parsed.items.length
          ? parsed.items
          : defaultItems();
      return {
        presetName: parsed.presetName || "default",
        filter: parsed.filter || "",
        selectedType: parsed.selectedType || "all",
        items,
        presets:
          Array.isArray(parsed.presets) && parsed.presets.length
            ? parsed.presets
            : defaultPresets(items)
      };
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read prompt sequence state:", error);
      const items = defaultItems();
      return {
        presetName: "default",
        filter: "",
        selectedType: "all",
        items,
        presets: defaultPresets(items)
      };
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function setPresets(state, presets, currentName) {
    state.presets = presets;
    state.presetName = currentName;
    const current = presets.find((preset) => preset.name === currentName);
    if (current) {
      state.items = current.items.map((item) => ({ ...item }));
    }
  }

  function removePreset(state, presetName) {
    state.presets = state.presets.filter((preset) => preset.name !== presetName);
    if (state.presetName === presetName) {
      state.presetName = state.presets[0]?.name || "default";
      const fallback = state.presets.find((preset) => preset.name === state.presetName);
      if (fallback) {
        state.items = fallback.items.map((item) => ({ ...item }));
      }
    }
  }

  function exportPromptText(state) {
    return state.items
      .filter((item) => item.enabled)
      .map((item, index) => {
        const header = `${index + 1}. [${item.role}] ${item.title}`;
        const body =
          item.type === "static"
            ? item.content || "(empty)"
            : `{{${item.key || "dynamic_key"}}}`;
        return `${header}\n${body}`;
      })
      .join("\n\n");
  }

  function buildPromptMessages(state, contextMap) {
    return state.items
      .filter((item) => item.enabled)
      .map((item) => {
        const content =
          item.type === "static"
            ? item.content || ""
            : contextMap[item.key] || `{{${item.key || "dynamic_key"}}}`;
        return {
          role: item.role || "system",
          content
        };
      })
      .filter((message) => message.content);
  }

  function importFromTavernPresets() {
    if (typeof getPresetNames !== "function" || typeof getPreset !== "function") {
      return [];
    }

    const names = getPresetNames().filter(Boolean);
    const imported = [];

    for (const name of names) {
      let preset = null;
      try {
        preset = getPreset(name);
      } catch (error) {
        preset = null;
      }

      if (!preset || !Array.isArray(preset.prompts)) continue;

      for (const prompt of preset.prompts) {
        if (typeof prompt.content === "string" && prompt.content.trim()) {
          imported.push({
            id: `${name}_${prompt.id || prompt.name || Date.now()}`,
            title: `${name} - ${prompt.name || prompt.id || "Prompt"}`,
            type: "static",
            role:
              prompt.role === "user" || prompt.role === "assistant"
                ? prompt.role
                : "system",
            key: "",
            enabled: prompt.enabled !== false,
            locked: false,
            content: prompt.content
          });
        }
      }
    }

    return imported;
  }

  return {
    read,
    save,
    setPresets,
    removePreset,
    exportPromptText,
    buildPromptMessages,
    importFromTavernPresets
  };
})();
