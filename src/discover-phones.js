import "./discover-phones.css";

const aiStories = [
  ["Google unveils Gemini 4 Carbon", "The new model targets coding and cyber defense, with access starting through trusted partners before a wider rollout.", "feed-gemini.png"],
  ["NVIDIA opens Nemotron 3.5 Transcribe", "The speech model supports 40 languages, speaker labels and translation, with prompts that control transcript style.", "feed-nvidia.png"],
  ["Rime launches Prism for voice agents", "The speech-to-speech model pairs live audio with inspectable text, tool calls and options for enterprise fine-tuning.", "feed-rime.png"],
  ["Claude adds a legal artifacts gallery", "Ready-to-use tools help lawyers review contracts, check citations and track regulations, with links back to sources.", "feed-claude.png"],
];
const familyStories = [
  ["Boo at the Zoo returns this Saturday", "Oct 31 · San Francisco Zoo. Join the 11am costume parade, crafts and animal pumpkin treats. Activities included with zoo admission.", "feed-zoo.jpg"],
  ["One last day of Goblin Jamboree", "Oct 31 · Sausalito. Mix spooky brews and build a creepy creature at Bay Area Discovery Museum. Opens 9am; event tickets required.", "feed-goblin.jpg"],
  ["Free Halloween Hoopla at the Gardens", "Oct 31, noon–3pm · San Francisco. Circus Bella, crafts and a costume parade fill Yerba Buena’s Children’s Garden. For kids under 10.", "feed-hoopla-event.jpg"],
  ["Spooky Science takes over Chabot", "Oct 31 · Oakland. Try gooey experiments and pumpkin engineering, then watch the 1:30pm pumpkin drop. Check Chabot’s admission options.", "feed-chabot-science.jpg"],
];
const categories = [
  { title: "AI Daily News", images: ["welcome-ai-1.jpg", "welcome-ai-2.jpg", "welcome-ai-3.jpg"], byline: "OpenAI · 1h ago", story: "GPT-6.1 Terra starts rolling out" },
  { title: "Market Watch", images: ["welcome-market-1.jpg", "welcome-market-2.jpg", "welcome-market-3.jpg"], byline: "Reuters · After close", story: "Stocks extend their rebound" },
  { title: "Local family events", images: ["welcome-family-zoo.jpg", "feed-goblin.jpg", "welcome-family-3.jpg"], byline: "SF Funcheap · Sat Oct 31", story: "Halloween at San Francisco Zoo" },
  { title: "Make it your own", story: "Choose your topics and sources, and AI will keep you up to date." },
];
const image = (name, width, height) => `<img src="/media/${name}" width="${width}" height="${height}" alt="" aria-hidden="true" loading="lazy" draggable="false" />`;
const bottom = () => `<div class="phone-bottom">${image("phone-bottom-chrome.png", 393, 80)}</div>`;
const familyIcon = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="5" r="2"/><circle cx="14" cy="7" r="1.5"/><path d="M2 16v-3a5 5 0 0 1 10 0v3m1-5a4 4 0 0 1 5 4v1"/></svg>`;

function feedMarkup(id) {
  const stories = list => list.map(([title, summary, thumbnail]) => `<article class="phone-story"><div><h4>${title}</h4><p>${summary} <span class="phone-see-more">See more</span></p></div>${image(thumbnail, 64, 64)}</article>`).join("");
  return `<div class="phone-feed">
    <div class="phone-chrome">${image("phone-feed-chrome.png", 393, 116)}</div>
    <nav class="phone-topics" aria-label="Feed topics">
      <button type="button" data-topic="all" aria-pressed="false" aria-controls="${id}">All</button>
      <button type="button" data-topic="ai" aria-pressed="true" aria-controls="${id}">AI Daily News</button>
      <button type="button" data-topic="family" aria-pressed="false" aria-controls="${id}">${familyIcon}Bay Area Family events</button>
    </nav>
    <div class="phone-feed-scroll" id="${id}" tabindex="0" role="region" aria-label="AI Daily News and Bay Area family events feed">
      <div class="phone-topic-section" data-section="ai"><h3>AI Daily News</h3>${stories(aiStories)}</div>
      <div class="phone-topic-section" data-section="family"><h3>Bay area family events</h3>${stories(familyStories)}</div>
    </div>
    ${bottom()}
  </div>`;
}

function wireFeed(phone) {
  const viewport = phone.querySelector(".phone-feed-scroll");
  const topics = [...phone.querySelectorAll("[data-topic]")];
  const family = phone.querySelector('[data-section="family"]');
  const familyOffset = () => family.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop;
  let allSelected = false;
  const sync = () => {
    const active = allSelected && viewport.scrollTop < 1 ? "all" : viewport.scrollTop >= familyOffset() - 2 ? "family" : "ai";
    topics.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.topic === active)));
  };
  topics.forEach(button => button.addEventListener("click", () => {
    allSelected = button.dataset.topic === "all";
    const target = button.dataset.topic === "family" ? familyOffset() : 0;
    viewport.scrollTo({ top: target, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    sync();
  }));
  viewport.addEventListener("scroll", sync, { passive: true });
}

function planMarkup(category) {
  const adapted = category === 1 ? {
    prompt: "Keep me up to date on the markets.", title: "Market Watch",
    intro: "A market briefing before the open and after close, from Reuters, CNBC and WSJ.",
    schedule: "Before the open and after close",
    topics: ["US markets", "Tech stocks", "Market moves and their catalysts"],
    sources: ["Reuters", "CNBC", "WSJ"],
  } : {
    prompt: "Keep me up to date on local family events.", title: "Local family events",
    intro: "Family-friendly things to do around the Bay Area, with dates, cost and booking details.",
    schedule: "Every Friday",
    topics: ["Bay Area family events", "Dates, cost and booking details"],
    sources: ["SF Funcheap", "Bay Area Kid Fun", "Marin IJ"],
  };
  const plan = category === 0 ? `
      <p class="phone-prompt">Keep me up to date on AI news.</p>
      <p>I’ll set up a Discover agent to keep an eye on AI news and bring you a short briefing. Here’s the plan:</p>
      <hr />
      <h3>Schedule</h3><ul><li>9 AM daily · 3–5 stories, ranked by relevance to your work</li></ul>
      <h3>Topics</h3><ul><li><strong>Models:</strong> new releases compared on benchmarks, context and price</li><li><strong>Building with AI:</strong> API/SDK changes and dev tools like Copilot, Cursor, MCP</li><li><strong>Big picture:</strong> papers, compute costs, funding and policy — each with a quick take</li></ul>
      <h3>Sources</h3><ul><li><strong>Official &amp; research:</strong> lab blogs, changelogs, arXiv</li><li><strong>News &amp; community:</strong> The Verge, TechCrunch, Hacker News, GitHub</li></ul>
      <p>Your first briefing based on this plan is ready. Tell me if you’d like to change anything, or add your agent and start reading now.</p>` : `
      <p class="phone-prompt">${adapted.prompt}</p><p>${adapted.intro}</p><hr />
      <h3>Schedule</h3><ul><li>${adapted.schedule}</li></ul>
      <h3>Topics</h3><ul>${adapted.topics.map(topic => `<li>${topic}</li>`).join("")}</ul>
      <h3>Sources</h3><ul>${adapted.sources.map(source => `<li>${source}</li>`).join("")}</ul>`;
  return `<div class="phone-plan">
    <div class="phone-chrome phone-plan-chrome">${image("phone-status-chrome.png", 393, 62)}<div><button type="button" class="phone-back" aria-label="Back to categories">‹</button><span aria-hidden="true">···</span></div></div>
    <div class="phone-plan-scroll" tabindex="0" role="region" aria-label="${categories[category].title} agent setup">
      ${category === 3 ? `<form class="phone-custom-form"><label>Topics<input name="topics" required maxlength="120" placeholder="What would you like to keep up with?" /></label><label>Sources<input name="sources" required maxlength="160" placeholder="Choose your sources" /></label><label>Schedule<select name="schedule"><option>Every morning</option><option>Every Friday</option></select></label><button class="phone-action" type="submit">Preview your brief</button><p class="phone-custom-status" role="status" hidden></p></form>` : `${plan}<div class="phone-agent-card"><h4>${categories[category].title}</h4><small>${category === 0 ? "First briefing ready · Daily at 9 AM" : adapted.schedule}</small><button type="button" class="phone-action phone-add">Add and view</button></div>`}
    </div>
    ${category === 3 ? "" : `<form class="phone-refine"><input aria-label="Refine the plan in this local preview" placeholder="Refine the plan" required maxlength="200" /><button type="submit" aria-label="Add refinement to this local preview">↑</button></form>`}
    ${bottom()}
  </div>`;
}

function mountWelcome(phone, initialCategory = 0) {
  const cards = categories.map((category, index) => `<div class="phone-category" role="group" aria-roledescription="slide" aria-label="${index + 1} of 4: ${category.title}">
    <h3>${category.title}</h3>
    <div class="phone-fan" aria-hidden="true">${(category.images || categories[0].images).map(name => image(name, 84, 84)).join("")}</div>
    <div class="phone-preview">${category.byline ? `<small>${category.byline}</small>` : ""}<p>${category.story}</p></div>
    <button type="button" class="phone-action phone-start" data-category="${index}">${index === 3 ? "Create your own" : "Get started"}</button>
  </div>`).join("");
  phone.innerHTML = `<div class="phone-welcome">
    <div class="phone-chrome">${image("phone-welcome-chrome.png", 393, 116)}</div>
    <h2>What would you like to<br />keep up with?</h2>
    <div class="phone-carousel" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Discover group categories" aria-description="Swipe or drag between categories, use the arrow keys, or choose a category below.">${cards}</div>
    <div class="phone-pagination" role="group" aria-label="Choose a category">${categories.map((category, index) => `<button type="button" aria-label="${category.title}" aria-pressed="${index === 0}" data-page="${index}"><span></span></button>`).join("")}</div>
    ${bottom()}
  </div>`;
  const carousel = phone.querySelector(".phone-carousel");
  const slides = [...phone.querySelectorAll(".phone-category")];
  const pagination = [...phone.querySelectorAll("[data-page]")];
  let active = initialCategory;
  const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const renderActive = () => {
    pagination.forEach((button, index) => button.setAttribute("aria-pressed", String(index === active)));
    slides.forEach((slide, index) => slide.inert = index !== active);
  };
  const select = (index, behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth") => {
    if (step() <= 0) return;
    carousel.scrollTo({ left: index * step(), behavior });
  };
  const sync = () => {
    if (step() <= 0) return;
    const next = Math.max(0, Math.min(3, Math.round(carousel.scrollLeft / step())));
    if (active !== next) {
      active = next;
      slides[active].querySelector(".phone-fan").getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      animateFan(slides[active]);
    }
    renderActive();
  };
  pagination.forEach(button => button.addEventListener("click", () => select(Number(button.dataset.page))));
  carousel.addEventListener("scroll", sync, { passive: true });
  carousel.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === "Home" ? 0 : event.key === "End" ? 3 : Math.max(0, Math.min(3, active + (event.key === "ArrowRight" ? 1 : -1)));
    select(index);
  });
  let drag;
  carousel.addEventListener("pointerdown", event => {
    if (event.pointerType !== "mouse" || event.target.closest("button")) return;
    drag = { x: event.clientX, left: carousel.scrollLeft };
    carousel.style.scrollSnapType = "none";
    carousel.setPointerCapture(event.pointerId);
  });
  carousel.addEventListener("pointermove", event => {
    if (!drag || !event.buttons) return;
    carousel.scrollLeft = drag.left + drag.x - event.clientX;
  });
  const finishDrag = () => {
    if (!drag) return;
    drag = undefined;
    const index = Math.max(0, Math.min(3, Math.round(carousel.scrollLeft / step())));
    carousel.style.scrollSnapType = "";
    select(index);
  };
  carousel.addEventListener("pointerup", finishDrag);
  carousel.addEventListener("pointerleave", finishDrag);
  carousel.addEventListener("pointercancel", finishDrag);
  phone.querySelectorAll(".phone-start").forEach(button => button.addEventListener("click", () => {
    const category = Number(button.dataset.category);
    phone.innerHTML = planMarkup(category);
    phone.querySelector(".phone-back").addEventListener("click", () => {
      mountWelcome(phone, category);
      phone.querySelectorAll(".phone-start")[category].focus({ preventScroll: true });
    });
    phone.querySelector(".phone-custom-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const status = form.querySelector(".phone-custom-status");
      status.textContent = `${data.get("topics")} · ${data.get("schedule")} · ${data.get("sources")}. Preview only; no agent has been created.`;
      status.hidden = false;
    });
    phone.querySelector(".phone-refine")?.addEventListener("submit", event => {
      event.preventDefault();
      const input = event.currentTarget.querySelector("input");
      const note = document.createElement("p");
      note.textContent = `Refinement for this preview: ${input.value}`;
      phone.querySelector(".phone-plan-scroll").append(note);
      input.value = "";
      const viewport = phone.querySelector(".phone-plan-scroll");
      viewport.scrollTop = viewport.scrollHeight;
    });
    phone.querySelector(".phone-add")?.addEventListener("click", () => {
      phone.innerHTML = feedMarkup("welcome-agent-feed");
      if (category === 1) {
        phone.querySelector(".phone-topics").remove();
        phone.querySelector(".phone-feed-scroll").innerHTML = `<div class="phone-topic-section"><h3>Market Watch</h3>${[
          ["Stocks extend their rebound", "Reuters · After close", "welcome-market-1.jpg"],
          ["Chipmakers lead again", "CNBC · After close", "welcome-market-2.jpg"],
          ["US oil slips below $100", "WSJ · After close", "welcome-market-3.jpg"],
        ].map(([title, byline, name]) => `<article class="phone-story"><div><h4>${title}</h4><p>${byline}</p></div>${image(name, 64, 64)}</article>`).join("")}</div>`;
        phone.querySelector(".phone-feed-scroll").setAttribute("aria-label", "Market Watch source story preview");
      } else {
        wireFeed(phone);
        if (category === 2) phone.querySelector('[data-topic="family"]').click();
      }
      const chrome = phone.querySelector(".phone-chrome");
      chrome.innerHTML = `${image("phone-status-chrome.png", 393, 62)}<button type="button" class="phone-back phone-feed-back" aria-label="Back to categories">‹</button>`;
      chrome.querySelector("button").addEventListener("click", () => {
        mountWelcome(phone, category);
        phone.querySelectorAll(".phone-start")[category].focus({ preventScroll: true });
      });
      phone.querySelector(".phone-feed-scroll").focus({ preventScroll: true });
    });
    phone.querySelector(".phone-back").focus({ preventScroll: true });
  }));
  renderActive();
  const layoutObserver = new ResizeObserver(() => {
    if (!carousel.isConnected) {
      layoutObserver.disconnect();
      return;
    }
    select(active, "instant");
    sync();
  });
  layoutObserver.observe(carousel);
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    animateFan(slides[0]);
    observer.disconnect();
  }, { threshold: .6 });
  observer.observe(phone);
}

function animateFan(slide) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  slide.querySelectorAll(".phone-fan img").forEach((image, index) => {
    image.animate([
      { translate: "0 12px", opacity: .4 },
      { translate: `${index === 0 ? "-8px" : index === 2 ? "8px" : "0"} -8px`, opacity: 1, offset: .6 },
      { translate: "0 0", opacity: 1 },
    ], { duration: 1200, delay: index * 100, easing: "ease-out" });
  });
}

export function mountDiscoverPhones() {
  const screens = document.querySelectorAll(".daily-brief-screen");
  if (screens.length !== 3) return;
  screens[0].classList.add("interactive-phone");
  screens[1].classList.add("interactive-phone");
  mountWelcome(screens[0]);
  screens[1].innerHTML = feedMarkup("daily-news-feed");
  wireFeed(screens[1]);
  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", event => {
    if (!event.matches) return;
    document.querySelectorAll(".phone-fan img").forEach(image => image.getAnimations().forEach(animation => animation.cancel()));
  });
}
