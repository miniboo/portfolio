export function mountCuratedCards() {
  const gallery = document.querySelector(".edge-news-gallery");
  if (!gallery || gallery.closest("[hidden]")) return;
  const hint = document.createElement("p");
  hint.className = "curated-editor-note";
  hint.textContent = "Hover over or tap a card to edit its prompt. Local prototype: edits are kept for this visit; stories do not regenerate.";
  gallery.before(hint);
  const status = document.createElement("p");
  status.className = "sr-only";
  status.setAttribute("role", "status");
  gallery.after(status);
  const hover = matchMedia("(any-hover: hover)");

  gallery.querySelectorAll(".curated-card").forEach((card, index) => {
    const reactions = [...card.querySelectorAll("[data-curated-reaction]")];
    reactions.forEach(button => {
      button.disabled = false;
      button.addEventListener("click", () => {
        const selected = button.getAttribute("aria-pressed") !== "true";
        reactions.forEach(reaction => reaction.setAttribute("aria-pressed", String(reaction === button && selected)));
      });
    });

    const title = card.querySelector("h4").textContent;
    const shell = document.createElement("div");
    shell.className = "curated-shell";
    const turn = document.createElement("div");
    turn.className = "curated-turn";
    turn.dataset.side = "story";
    const editor = document.createElement("div");
    editor.className = "curated-editor";
    editor.id = `curated-editor-${index}`;
    editor.innerHTML = `
      <div class="curated-editor-intro">
        <h5 id="curated-editor-heading-${index}">Make this card more relevant to you</h5>
        <p>Tell us what you’re interested in. Your input will shape what you see in this card</p>
      </div>
      <form aria-labelledby="curated-editor-heading-${index}">
        <textarea name="prompt" required maxlength="2000" placeholder="Describe topics, sources or any updates you would like to see here..."></textarea>
        <div class="curated-editor-actions">
          <button type="button" class="curated-editor-cancel">Cancel</button>
          <button type="submit" class="curated-editor-update">Update card</button>
        </div>
      </form>`;
    editor.inert = true;
    editor.setAttribute("aria-hidden", "true");
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "curated-editor-toggle";
    toggle.textContent = "Edit prompt";
    toggle.setAttribute("aria-label", `Edit prompt for ${title}`);
    toggle.setAttribute("aria-controls", editor.id);
    toggle.setAttribute("aria-expanded", "false");
    const textarea = editor.querySelector("textarea");
    textarea.setAttribute("aria-label", `Prompt for ${title}`);
    textarea.value = `${card.querySelector(".curated-topic").innerText.replace(/\s+/g, " ").trim()}\n${card.querySelector(".curated-summary > p").textContent}`;
    const form = editor.querySelector("form");
    let open = false;
    let suppressHover = false;
    let hoverTimer;

    function showEditor(next, focus = false) {
      clearTimeout(hoverTimer);
      const restoreFocus = !next && editor.contains(document.activeElement);
      open = next;
      turn.dataset.side = open ? "editor" : "story";
      card.inert = open;
      card.setAttribute("aria-hidden", String(open));
      editor.inert = !open;
      editor.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      if (restoreFocus) toggle.focus({ preventScroll: true });
      if (open && focus) textarea.focus({ preventScroll: true });
      if (!open) suppressHover = true;
    }

    toggle.addEventListener("click", () => showEditor(true, true));
    card.addEventListener("click", event => {
      if (event.target.closest("button, a") || getSelection()?.isCollapsed === false) return;
      showEditor(true, true);
    });
    editor.querySelector(".curated-editor-cancel").addEventListener("click", () => showEditor(false));
    editor.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      showEditor(false);
    });
    textarea.addEventListener("input", () => {
      textarea.setCustomValidity(textarea.value.trim() ? "" : "Describe a topic, source or update first.");
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      card.dataset.prompt = textarea.value;
      status.textContent = `Prompt saved for ${title}. This local prototype does not regenerate stories.`;
      showEditor(false);
    });
    card.addEventListener("pointerover", event => {
      clearTimeout(hoverTimer);
      // Leave the source reaction controls usable without opening the editor.
      if (event.pointerType !== "mouse" || !hover.matches || suppressHover || event.target.closest("button")) return;
      hoverTimer = setTimeout(() => showEditor(true), 160);
    });
    card.addEventListener("pointerleave", () => clearTimeout(hoverTimer));
    shell.addEventListener("pointerleave", () => { suppressHover = false; });
    card.before(shell);
    shell.append(turn);
    card.append(toggle);
    turn.append(card, editor);
  });
}
