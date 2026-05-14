window.PYQ_REBUILD_PANELS = window.PYQ_REBUILD_PANELS || {};

window.PYQ_REBUILD_PANELS.gen = function createGenPanel() {
  return {
    title: "\u751f\u6210",
    html:
      '<div class="pyq-rebuild-form" data-gen-root>' +
      '<label class="pyq-rebuild-field"><span>\u0042\u0061\u0073\u0065\u0020\u0055\u0052\u004c</span><input data-gen-input="baseUrl" type="text" placeholder="https://api.example.com"></label>' +
      '<label class="pyq-rebuild-field"><span>\u0041\u0050\u0049\u0020\u004b\u0065\u0079</span><input data-gen-input="apiKey" type="password" placeholder="sk-..."></label>' +
      '<label class="pyq-rebuild-field"><span>\u004d\u006f\u0064\u0065\u006c</span><input data-gen-input="model" type="text" placeholder="gpt-4.1 / custom-model"></label>' +
      '<div class="pyq-rebuild-actions"><button type="button" data-gen-action="models">\u5237\u65b0\u6a21\u578b\u5217\u8868</button></div>' +
      '<label class="pyq-rebuild-field"><span>\u53ef\u7528\u6a21\u578b</span><div class="pyq-rebuild-sequence-list" data-gen-models><div class="pyq-rebuild-sequence-item">\u6682\u65e0\u6a21\u578b\u5217\u8868</div></div></label>' +
      '<label class="pyq-rebuild-field"><span>\u7cfb\u7edf\u63d0\u793a\u8bcd</span><textarea data-gen-input="systemPrompt" rows="4"></textarea></label>' +
      '<label class="pyq-rebuild-field"><span>\u7528\u6237\u63d0\u793a\u8bcd</span><textarea data-gen-input="userPrompt" rows="6"></textarea></label>' +
      '<div class="pyq-rebuild-grid">' +
      '<label class="pyq-rebuild-field"><span>\u8f93\u51fa\u6a21\u5f0f</span><select data-gen-input="outputMode"><option value="text">\u6587\u672c</option><option value="html">HTML</option></select></label>' +
      '<label class="pyq-rebuild-field"><span>\u6d41\u5f0f\u8f93\u51fa</span><select data-gen-input="stream"><option value="false">\u5173</option><option value="true">\u5f00</option></select></label>' +
      '<label class="pyq-rebuild-field"><span>\u4e0a\u4e0b\u6587\u62fc\u63a5</span><select data-gen-input="includeContext"><option value="true">\u5305\u542b SillyTavern \u4e0a\u4e0b\u6587</option><option value="false">\u4ec5\u4f7f\u7528\u8868\u5355\u63d0\u793a\u8bcd</option></select></label>' +
      "</div>" +
      '<label class="pyq-rebuild-field"><span>\u751f\u6210\u72b6\u6001</span><input data-gen-status type="text" value="\u5c31\u7eea" readonly></label>' +
      '<label class="pyq-rebuild-field"><span>\u4efb\u52a1\u5386\u53f2</span><div class="pyq-rebuild-sequence-list" data-gen-tasks><div class="pyq-rebuild-sequence-item">\u6682\u65e0\u751f\u6210\u4efb\u52a1</div></div></label>' +
      '<label class="pyq-rebuild-field"><span>\u5f53\u524d\u8f93\u51fa\u6536\u85cf</span><button type="button" data-gen-action="favorite">\u6536\u85cf\u5f53\u524d\u8f93\u51fa</button></label>' +
      '<div class="pyq-rebuild-grid"><button type="button" data-gen-mode="text">\u6587\u672c\u9884\u89c8</button><button type="button" data-gen-mode="html">HTML \u9884\u89c8</button><button type="button" data-gen-action="fullscreen">\u5168\u5c4f</button><button type="button" data-gen-action="inject-input">\u6ce8\u5165\u8f93\u5165\u6846</button><button type="button" data-gen-action="inject-chat">\u6ce8\u5165\u804a\u5929</button><button type="button" data-gen-action="inject-swipe">\u6ce8\u5165 Swipe</button></div>' +
      '<label class="pyq-rebuild-field"><span>\u8f93\u51fa\u9884\u89c8</span><textarea data-gen-output rows="12" readonly></textarea></label>' +
      '<div class="pyq-rebuild-html-preview pyq-rebuild-hidden" data-gen-html-preview></div>' +
      '<div class="pyq-rebuild-fullscreen pyq-rebuild-hidden" data-gen-fullscreen><div class="pyq-rebuild-fullscreen-card"><button type="button" data-gen-action="close-fullscreen">×</button><div data-gen-fullscreen-body></div></div></div>' +
      '<div class="pyq-rebuild-actions"><button type="button" data-gen-action="generate">\u751f\u6210</button><button type="button" data-gen-action="stop">\u505c\u6b62</button><button type="button" data-gen-action="continue">\u7eed\u5199</button><button type="button" data-gen-action="copy">\u590d\u5236</button></div>' +
      "</div>",
    onMount(container) {
      const config = window.PYQ_REBUILD_GEN_STATE.readConfig();
      let controller = null;
      const tasks = Array.isArray(config.tasks) ? [...config.tasks] : [];

      const elements = {
        baseUrl: container.querySelector('[data-gen-input="baseUrl"]'),
        apiKey: container.querySelector('[data-gen-input="apiKey"]'),
        model: container.querySelector('[data-gen-input="model"]'),
        systemPrompt: container.querySelector('[data-gen-input="systemPrompt"]'),
        userPrompt: container.querySelector('[data-gen-input="userPrompt"]'),
        outputMode: container.querySelector('[data-gen-input="outputMode"]'),
        stream: container.querySelector('[data-gen-input="stream"]'),
        includeContext: container.querySelector('[data-gen-input="includeContext"]'),
        status: container.querySelector("[data-gen-status]"),
        tasks: container.querySelector("[data-gen-tasks]"),
        models: container.querySelector("[data-gen-models]"),
        output: container.querySelector("[data-gen-output]"),
        htmlPreview: container.querySelector("[data-gen-html-preview]"),
        fullscreen: container.querySelector("[data-gen-fullscreen]"),
        fullscreenBody: container.querySelector("[data-gen-fullscreen-body]"),
        generate: container.querySelector('[data-gen-action="generate"]'),
        stop: container.querySelector('[data-gen-action="stop"]'),
        cont: container.querySelector('[data-gen-action="continue"]'),
        copy: container.querySelector('[data-gen-action="copy"]'),
        refreshModels: container.querySelector('[data-gen-action="models"]'),
        injectInput: container.querySelector('[data-gen-action="inject-input"]'),
        injectChat: container.querySelector('[data-gen-action="inject-chat"]'),
        injectSwipe: container.querySelector('[data-gen-action="inject-swipe"]'),
        fullscreenOpen: container.querySelector('[data-gen-action="fullscreen"]'),
        fullscreenClose: container.querySelector('[data-gen-action="close-fullscreen"]'),
        modeText: container.querySelector('[data-gen-mode="text"]'),
        modeHtml: container.querySelector('[data-gen-mode="html"]'),
        favorite: container.querySelector('[data-gen-action="favorite"]')
      };

      function applyConfigToForm() {
        elements.baseUrl.value = config.baseUrl;
        elements.apiKey.value = config.apiKey;
        elements.model.value = config.model;
        elements.systemPrompt.value = config.systemPrompt;
        elements.userPrompt.value = config.userPrompt;
        elements.outputMode.value = config.outputMode;
        elements.stream.value = String(config.stream);
        elements.includeContext.value = String(config.includeContext);
      }

      function renderModels() {
        if (!Array.isArray(config.models) || !config.models.length) {
          elements.models.innerHTML =
            '<div class="pyq-rebuild-sequence-item">\u6682\u65e0\u6a21\u578b\u5217\u8868</div>';
          return;
        }

        elements.models.innerHTML = config.models
          .map(
            (model) =>
              `<div class="pyq-rebuild-sequence-item"><button type="button" data-gen-pick-model="${model}">${model}</button></div>`
          )
          .join("");

        elements.models.querySelectorAll("[data-gen-pick-model]").forEach((node) => {
          node.addEventListener("click", () => {
            config.model = node.getAttribute("data-gen-pick-model") || "";
            elements.model.value = config.model;
            window.PYQ_REBUILD_GEN_STATE.saveConfig(config);
          });
        });
      }

      function syncConfigFromForm() {
        config.baseUrl = elements.baseUrl.value.trim();
        config.apiKey = elements.apiKey.value.trim();
        config.model = elements.model.value.trim();
        config.systemPrompt = elements.systemPrompt.value;
        config.userPrompt = elements.userPrompt.value;
        config.outputMode = elements.outputMode.value;
        config.stream = elements.stream.value === "true";
        config.includeContext = elements.includeContext.value === "true";
        window.PYQ_REBUILD_GEN_STATE.saveConfig(config);
      }

      function setStatus(text) {
        elements.status.value = text;
      }

      function setOutput(text) {
        elements.output.value = text;
        elements.htmlPreview.innerHTML = text;
        elements.fullscreenBody.innerHTML = text;
        const showHtml = config.outputMode === "html";
        elements.htmlPreview.classList.toggle("pyq-rebuild-hidden", !showHtml);
        elements.output.classList.toggle("pyq-rebuild-hidden", showHtml);
      }

      function setButtons(isRunning) {
        elements.generate.disabled = isRunning;
        elements.cont.disabled = isRunning;
        elements.stop.disabled = !isRunning;
      }

      function renderTasks() {
        if (!tasks.length) {
          elements.tasks.innerHTML =
            '<div class="pyq-rebuild-sequence-item">\u6682\u65e0\u751f\u6210\u4efb\u52a1</div>';
          return;
        }

        elements.tasks.innerHTML = tasks
          .slice()
          .reverse()
          .map(
            (task) =>
              `<div class="pyq-rebuild-sequence-item"><button type="button" data-gen-open-task="${task.id}"><strong>${task.status}</strong> · ${task.model} · ${task.time}<br><small>${task.mode || "generate"} · ${task.stream ? "stream" : "non-stream"}</small></button></div>`
          )
          .join("");

        elements.tasks.querySelectorAll("[data-gen-open-task]").forEach((node) => {
          node.addEventListener("click", () => {
            const key = node.getAttribute("data-gen-open-task");
            const target = tasks.find((task) => task.id === key);
            if (!target) return;
            window.PYQ_REBUILD_GEN_STATE.setActiveTask(config, target.id);
            setOutput(target.output || "");
            setStatus(`切换到任务 ${target.time}`);
          });
        });
      }

      async function runGeneration(mode) {
        syncConfigFromForm();

        if (!config.baseUrl || !config.apiKey || !config.model) {
          setStatus("\u8bf7\u5148\u586b\u5199 Base URL / API Key / Model");
          return;
        }

        const context = window.PYQ_REBUILD_ST_CONTEXT.buildContextBlock();
        const contextMap = window.PYQ_REBUILD_ST_CONTEXT.buildContextMap();
        const promptSequenceState = window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.read();
        const finalUserPrompt =
          mode === "continue"
            ? `${elements.output.value}\n\nContinue from the previous response.`
            : config.userPrompt;
        const promptMessages =
          config.includeContext
            ? window.PYQ_REBUILD_PROMPT_SEQUENCE_STATE.buildPromptMessages(
                promptSequenceState,
                contextMap
              )
            : [];

        const mergedPrompt =
          config.includeContext && context.text
            ? `${context.text}\n\nUser request:\n${finalUserPrompt}`
            : finalUserPrompt;

        controller = new AbortController();
        const task = {
          id: `task_${Date.now()}`,
          status: "running",
          model: config.model,
          time: new Date().toLocaleTimeString(),
          output: "",
          mode,
          stream: config.stream
        };

        tasks.push(task);
        window.PYQ_REBUILD_GEN_STATE.pushTask(config, task);
        renderTasks();
        setStatus("\u751f\u6210\u4e2d");
        setOutput("");
        setButtons(true);

        try {
          const output = await window.PYQ_REBUILD_GEN_API.generate({
            baseUrl: config.baseUrl,
            apiKey: config.apiKey,
            model: config.model,
            systemPrompt: config.systemPrompt,
            userPrompt: mergedPrompt,
            promptMessages,
            stream: config.stream,
            signal: controller.signal,
            onUpdate(text) {
              task.output = text;
              setOutput(text);
            }
          });

          task.status = "done";
          task.output = output;
          setOutput(output);
          setStatus("\u751f\u6210\u5b8c\u6210");
        } catch (error) {
          task.status = controller?.signal?.aborted ? "stopped" : "error";
          setStatus(
            controller?.signal?.aborted
              ? "\u5df2\u505c\u6b62"
              : `\u751f\u6210\u5931\u8d25: ${error.message}`
          );
        } finally {
          controller = null;
          config.tasks = tasks;
          window.PYQ_REBUILD_GEN_STATE.saveConfig(config);
          setButtons(false);
          renderTasks();
        }
      }

      elements.generate.addEventListener("click", () => runGeneration("generate"));
      elements.cont.addEventListener("click", () => runGeneration("continue"));
      elements.stop.addEventListener("click", () => {
        if (controller) controller.abort();
      });
      elements.copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(elements.output.value || "");
          setStatus("\u5df2\u590d\u5236");
        } catch (error) {
          setStatus(`\u590d\u5236\u5931\u8d25: ${error.message}`);
        }
      });
      elements.refreshModels.addEventListener("click", async () => {
        syncConfigFromForm();
        if (!config.baseUrl || !config.apiKey) {
          setStatus("\u8bf7\u5148\u586b\u5199 Base URL / API Key");
          return;
        }
        try {
          config.models = await window.PYQ_REBUILD_GEN_API.fetchModels(
            config.baseUrl,
            config.apiKey
          );
          window.PYQ_REBUILD_GEN_STATE.saveConfig(config);
          renderModels();
          setStatus(`\u5df2\u52a0\u8f7d ${config.models.length} \u4e2a\u6a21\u578b`);
        } catch (error) {
          setStatus(`\u6a21\u578b\u5217\u8868\u52a0\u8f7d\u5931\u8d25: ${error.message}`);
        }
      });
      elements.modeText.addEventListener("click", () => {
        config.outputMode = "text";
        window.PYQ_REBUILD_GEN_STATE.saveConfig(config);
        setOutput(elements.output.value);
      });
      elements.modeHtml.addEventListener("click", () => {
        config.outputMode = "html";
        window.PYQ_REBUILD_GEN_STATE.saveConfig(config);
        setOutput(elements.output.value);
      });
      elements.fullscreenOpen.addEventListener("click", () => {
        elements.fullscreen.classList.remove("pyq-rebuild-hidden");
      });
      elements.fullscreenClose.addEventListener("click", () => {
        elements.fullscreen.classList.add("pyq-rebuild-hidden");
      });
      elements.injectInput.addEventListener("click", () => {
        const target = document.getElementById("send_textarea");
        if (!target) {
          setStatus("未找到输入框");
          return;
        }
        target.value = elements.output.value || "";
        target.dispatchEvent(new Event("input", { bubbles: true }));
        setStatus("已注入输入框");
      });
      elements.injectChat.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(elements.output.value || "");
          setStatus("已复制输出，可手动注入聊天");
        } catch (error) {
          setStatus(`注入聊天失败: ${error.message}`);
        }
      });
      elements.injectSwipe.addEventListener("click", () => {
        const target = document.getElementById("send_textarea");
        if (!target) {
          setStatus("未找到 send_textarea");
          return;
        }
        target.value = `/addswipe ${elements.output.value || ""}`;
        target.dispatchEvent(new Event("input", { bubbles: true }));
        setStatus("已注入 Swipe 命令");
      });
      elements.favorite.addEventListener("click", () => {
        const items = window.PYQ_REBUILD_FAVORITES_STATE.read();
        window.PYQ_REBUILD_FAVORITES_STATE.add(items, {
          id: `fav_${Date.now()}`,
          title: "Generated Output",
          characterName: "Current Session",
          content: elements.output.value || ""
        });
        setStatus("已收藏当前输出");
      });

      [
        elements.baseUrl,
        elements.apiKey,
        elements.model,
        elements.systemPrompt,
        elements.userPrompt,
        elements.outputMode,
        elements.stream,
        elements.includeContext
      ].forEach((element) => {
        element.addEventListener("change", syncConfigFromForm);
        element.addEventListener("input", syncConfigFromForm);
      });

      applyConfigToForm();
      renderTasks();
      renderModels();
      setStatus("\u5c31\u7eea");
      setOutput("");
      setButtons(false);
    }
  };
};
