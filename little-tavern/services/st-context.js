window.PYQ_REBUILD_ST_CONTEXT = (function () {
  function getSafeContext() {
    try {
      return window.SillyTavern?.getContext?.() || null;
    } catch (error) {
      console.warn("[pyq-rebuild] Failed to read ST context:", error);
      return null;
    }
  }

  function getPersona(ctx) {
    if (!ctx) return "";
    if (typeof ctx.persona === "string" && ctx.persona.trim()) return ctx.persona.trim();

    const personaEl = document.getElementById("persona_description");
    if (personaEl && typeof personaEl.value === "string" && personaEl.value.trim()) {
      return personaEl.value.trim();
    }

    return "";
  }

  function getCharacter(ctx) {
    if (!ctx) return { name: "", description: "", personality: "" };
    const character =
      ctx.characters && typeof ctx.characterId === "number"
        ? ctx.characters[ctx.characterId]
        : null;

    return {
      name: character?.name || "",
      description: character?.description || character?.scenario || "",
      personality: character?.personality || ""
    };
  }

  function getChatHistory(ctx) {
    if (!ctx || !Array.isArray(ctx.chat)) return "";
    return ctx.chat
      .slice(-12)
      .map((item) => {
        const name = item?.name || item?.role || "unknown";
        const text = item?.mes || item?.message || item?.content || "";
        return `${name}: ${text}`.trim();
      })
      .filter(Boolean)
      .join("\n");
  }

  function buildContextBlock() {
    const ctx = getSafeContext();
    const persona = getPersona(ctx);
    const character = getCharacter(ctx);
    const chatHistory = getChatHistory(ctx);

    const parts = [];
    if (character.name) parts.push(`Character: ${character.name}`);
    if (character.description) parts.push(`Character description: ${character.description}`);
    if (character.personality) parts.push(`Character personality: ${character.personality}`);
    if (persona) parts.push(`User persona: ${persona}`);
    if (chatHistory) parts.push(`Recent chat history:\n${chatHistory}`);

    return {
      rawContext: ctx,
      text: parts.join("\n\n")
    };
  }

  function buildContextMap() {
    const ctx = getSafeContext();
    const persona = getPersona(ctx);
    const character = getCharacter(ctx);
    const chatHistory = getChatHistory(ctx);

    return {
      character_definition: [character.name, character.description]
        .filter(Boolean)
        .join("\n"),
      persona_description: persona,
      char_personality: character.personality,
      chat_history: chatHistory
    };
  }

  return {
    buildContextBlock,
    buildContextMap
  };
})();
