window.PYQ_REBUILD_GEN_STATE = (function () {
  const CONFIG_KEY = "pyq_creator_rebuild_gen_config";

  function readConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        baseUrl: parsed.baseUrl || "",
        apiKey: parsed.apiKey || "",
        model: parsed.model || "",
        models: Array.isArray(parsed.models) ? parsed.models : [],
        systemPrompt:
          parsed.systemPrompt ||
          "You are a creative writing assistant for SillyTavern users.",
        userPrompt: parsed.userPrompt || "",
        outputMode: parsed.outputMode || "text",
        stream: Boolean(parsed.stream),
        includeContext: parsed.includeContext !== false,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        activeTaskId: parsed.activeTaskId || ""
      };
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read gen config:", error);
      return {
        baseUrl: "",
        apiKey: "",
        model: "",
        models: [],
        systemPrompt: "You are a creative writing assistant for SillyTavern users.",
        userPrompt: "",
        outputMode: "text",
        stream: false,
        includeContext: true,
        tasks: [],
        activeTaskId: ""
      };
    }
  }

  function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  function pushTask(config, task) {
    const nextTasks = [...(config.tasks || []), task].slice(-20);
    config.tasks = nextTasks;
    config.activeTaskId = task.id;
    saveConfig(config);
  }

  function setActiveTask(config, taskId) {
    config.activeTaskId = taskId;
    saveConfig(config);
  }

  return {
    readConfig,
    saveConfig,
    pushTask,
    setActiveTask
  };
})();
