window.PYQ_REBUILD_GEN_API = (function () {
  async function fetchModels(baseUrl, apiKey) {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
    }

    const json = await response.json();
    if (Array.isArray(json.data)) {
      return json.data.map((item) => item.id || item.model || item.name).filter(Boolean);
    }
    if (Array.isArray(json.models)) {
      return json.models.map((item) => item.id || item.model || item.name).filter(Boolean);
    }
    return [];
  }

  async function readStream(response, onUpdate) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let output = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload);
          const delta =
            parsed.choices?.[0]?.delta?.content ||
            parsed.choices?.[0]?.message?.content ||
            "";
          if (!delta) continue;
          output += delta;
          onUpdate(output);
        } catch (error) {
          console.warn("[pyq-rebuild] Failed to parse stream chunk:", error);
        }
      }
    }

    return output;
  }

  async function generate(options) {
    const {
      baseUrl,
      apiKey,
      model,
      systemPrompt,
      userPrompt,
      stream,
      signal,
      onUpdate
    } = options;

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        stream,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      }),
      signal
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
    }

    if (stream) {
      return readStream(response, onUpdate);
    }

    const json = await response.json();
    const output =
      json.choices?.[0]?.message?.content ||
      json.choices?.[0]?.text ||
      "";
    onUpdate(output);
    return output;
  }

  return {
    generate,
    fetchModels
  };
})();
