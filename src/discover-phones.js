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
  { title: "AI Daily News", images: ["welcome-ai-1.jpg", "welcome-ai-2.jpg", "welcome-ai-3.jpg"], stories: [["OpenAI · 1h ago", "GPT-6.1 Terra starts rolling out"], ["Google Research · 5h ago", "Google explores a “sleep” phase for AI"], ["Microsoft · 8h ago", "Microsoft tests AI diagnosis step by step"]] },
  { title: "Market Watch", images: ["welcome-market-1.jpg", "welcome-market-2.jpg", "welcome-market-3.jpg"], stories: [["Reuters · After close", "Stocks extend their rebound"], ["CNBC · After close", "Chipmakers lead again"], ["WSJ · After close", "US oil slips below $100"]] },
  { title: "Local family events", images: ["welcome-family-zoo.jpg", "feed-goblin.jpg", "welcome-family-3.jpg"], stories: [["SF Funcheap · Sat Oct 31", "Halloween at San Francisco Zoo"], ["Bay Area Kid Fun · Sat Oct 31", "A costume weekend at Oakland Zoo"], ["Marin IJ · Sun Nov 1", "A hands-on Halloween in Sausalito"]] },
];
const cardOrbits = new Set();
const image = (name, width, height) => `<img src="${import.meta.env.BASE_URL}media/${name}" width="${width}" height="${height}" alt="" aria-hidden="true" loading="lazy" draggable="false" />`;
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
      ${plan}<div class="phone-agent-card"><h4>${categories[category].title}</h4><small>${category === 0 ? "First briefing ready · Daily at 9 AM" : adapted.schedule}</small><button type="button" class="phone-action phone-add">Add and view</button></div>
    </div>
    <form class="phone-refine"><input aria-label="Refine the plan in this local preview" placeholder="Refine the plan" required maxlength="200" /><button type="submit" aria-label="Add refinement to this local preview">↑</button></form>
    ${bottom()}
  </div>`;
}

function mountWelcome(phone, initialCategory = 0) {
  let letterIndex = 0;
  const greeting = ["What would you like to", "keep up with?"].map(line => line.split(" ").map(word => `<span>${Array.from(word).map(letter => `<span class="phone-letter" style="--letter-index:${letterIndex++}">${letter}</span>`).join("")}</span>`).join(" ")).join("<br />");
  const cards = categories.map((category, index) => `<div class="phone-category" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${categories.length}: ${category.title}">
    <h3>${category.title}</h3>
    <button type="button" class="phone-fan" aria-label="Rotate featured images for ${category.title}">${category.images.map(name => image(name, 84, 84)).join("")}</button>
    <div class="phone-preview"><small>${category.stories[0][0]}</small><p>${category.stories[0][1]}</p></div>
    <button type="button" class="phone-action phone-start" data-category="${index}">Get started</button>
  </div>`).join("");
  phone.innerHTML = `<div class="phone-welcome">
    <div class="phone-chrome">${image("phone-welcome-chrome.png", 393, 116)}</div>
    <h2 aria-label="What would you like to keep up with?" data-reveal="${phone.dataset.greetingPresented ? "done" : "pending"}"><span aria-hidden="true">${greeting}</span></h2>
    <div class="phone-carousel" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Discover group categories" aria-description="Swipe or drag between categories, use the arrow keys, or choose a category below.">${cards}</div>
    <div class="phone-pagination"><label class="phone-page-control"><span class="phone-pagination-dots" aria-hidden="true">${categories.map((_, index) => `<span data-page="${index}" data-active="${index === initialCategory}"></span>`).join("")}</span><input type="range" min="0" max="${categories.length - 1}" step="1" value="${initialCategory}" aria-label="Choose a Discover category" aria-valuetext="${categories[initialCategory].title}" /></label></div>
    ${bottom()}
  </div>`;
  const carousel = phone.querySelector(".phone-carousel");
  const slides = [...phone.querySelectorAll(".phone-category")];
  const pagination = phone.querySelector(".phone-pagination input");
  const dots = [...phone.querySelectorAll("[data-page]")];
  const orbits = slides.map((slide, index) => mountCardOrbit(slide, categories[index]));
  let active = initialCategory;
  let requestedCategory;
  const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const renderActive = () => {
    pagination.value = active;
    pagination.setAttribute("aria-valuetext", categories[active].title);
    dots.forEach((dot, index) => dot.dataset.active = String(index === active));
    slides.forEach((slide, index) => slide.inert = index !== active);
  };
  const select = (index, behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth") => {
    if (step() <= 0) return;
    requestedCategory = index;
    carousel.scrollTo({ left: index * step(), behavior });
    if (behavior === "instant") sync();
  };
  const sync = () => {
    if (step() <= 0) return;
    const next = Math.max(0, Math.min(categories.length - 1, Math.round(carousel.scrollLeft / step())));
    if (requestedCategory !== undefined && Math.abs(carousel.scrollLeft - requestedCategory * step()) < 1) requestedCategory = undefined;
    if (active !== next) {
      active = next;
      orbits.forEach((orbit, index) => { if (index !== active) orbit.stop(true); });
    }
    renderActive();
  };
  pagination.addEventListener("input", () => select(Number(pagination.value)));
  pagination.addEventListener("pointerup", event => {
    const index = Math.max(0, Math.min(categories.length - 1, Math.round((event.clientX - pagination.getBoundingClientRect().left - 15) / 14)));
    pagination.value = index;
    select(index);
  });
  carousel.addEventListener("scroll", sync, { passive: true });
  carousel.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === "Home" ? 0 : event.key === "End" ? categories.length - 1 : Math.max(0, Math.min(categories.length - 1, (requestedCategory ?? active) + (event.key === "ArrowRight" ? 1 : -1)));
    select(index);
  });
  let drag;
  carousel.addEventListener("wheel", () => requestedCategory = undefined, { passive: true });
  carousel.addEventListener("pointerdown", event => {
    requestedCategory = undefined;
    if (event.pointerType !== "mouse" || event.target.closest("button:not(.phone-fan)")) return;
    drag = { x: event.clientX, left: carousel.scrollLeft, moved: false };
  });
  carousel.addEventListener("pointermove", event => {
    if (!drag || !event.buttons) return;
    if (!drag.moved && Math.abs(event.clientX - drag.x) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      orbits.forEach(orbit => orbit.stop());
      carousel.style.scrollSnapType = "none";
      carousel.setPointerCapture(event.pointerId);
    }
    carousel.scrollLeft = drag.left + drag.x - event.clientX;
  });
  const finishDrag = () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = undefined;
    if (!moved) return;
    const index = Math.max(0, Math.min(categories.length - 1, Math.round(carousel.scrollLeft / step())));
    carousel.style.scrollSnapType = "";
    select(index);
  };
  carousel.addEventListener("pointerup", finishDrag);
  carousel.addEventListener("pointerleave", finishDrag);
  carousel.addEventListener("pointercancel", finishDrag);
  phone.querySelectorAll(".phone-start").forEach(button => button.addEventListener("click", () => {
    const category = Number(button.dataset.category);
    orbits.forEach(orbit => orbit.destroy());
    observer.disconnect();
    layoutObserver.disconnect();
    phone.innerHTML = planMarkup(category);
    phone.querySelector(".phone-back").addEventListener("click", () => {
      mountWelcome(phone, category);
      phone.querySelectorAll(".phone-start")[category].focus({ preventScroll: true });
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
  const heading = phone.querySelector("h2");
  const letters = heading.querySelectorAll(".phone-letter");
  heading.addEventListener("animationend", event => {
    if (event.target === letters[letters.length - 1]) heading.dataset.reveal = "done";
  });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === phone && !entry.isIntersecting) orbits.forEach(orbit => orbit.stop());
      if (entry.target === heading && entry.isIntersecting && heading.dataset.reveal === "pending") {
        phone.dataset.greetingPresented = "true";
        heading.dataset.reveal = matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "playing";
        observer.unobserve(heading);
      }
    }
    if (!phone.isConnected) observer.disconnect();
  });
  observer.observe(phone);
  if (heading.dataset.reveal === "pending") observer.observe(heading);
}

function mountCardOrbit(slide, category) {
  const fan = slide.querySelector(".phone-fan");
  const images = [...fan.querySelectorAll("img")];
  const preview = slide.querySelector(".phone-preview");
  const byline = preview.querySelector("small");
  const title = preview.querySelector("p");
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  let phase = 0;
  let hovered = false;
  let frame;
  let moving = false;
  let ready = false;
  let requested = false;
  let currentStory = -1;
  let pointerType;
  const render = () => {
    const turn = phase - Math.floor(phase);
    const overlap = Math.sin(Math.PI * turn) ** 2;
    images.forEach((image, index) => {
      const angle = (index - phase) * Math.PI * 2 / 3;
      const depth = Math.cos(angle);
      image.style.transform = `translate3d(${Math.sin(angle) * 60 * (1 - .7 * overlap) / 3.93}cqw,${-2 * (1 - depth) / 3.93}cqw,${24 * (depth - 1) / 3.93}cqw) rotateY(${-Math.sin(angle) * 10}deg) rotateZ(${Math.sin(angle) * 7}deg) scale(${.9 + .1 * (depth + 1) / 2})`;
      image.style.opacity = 1 - .65 * overlap * (1 - (depth + 1) / 2);
    });
    const current = (Math.round(phase) % 3 + 3) % 3;
    if (current !== currentStory) {
      currentStory = current;
      byline.textContent = category.stories[current][0];
      title.textContent = category.stories[current][1];
      fan.setAttribute("aria-label", `Rotate featured stories for ${category.title}. Showing ${category.stories[current][1]}`);
    }
    preview.style.opacity = Math.cos(Math.PI * turn) ** 2;
  };
  const move = target => {
    moving = true;
    fan.dataset.rotating = "true";
    const from = phase;
    const start = performance.now();
    const tick = now => {
      if (!fan.isConnected || document.hidden) return;
      const progress = Math.min(1, (now - start) / 700);
      const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
      phase = from + (target - from) * eased;
      render();
      if (progress < 1) frame = requestAnimationFrame(tick);
      else {
        moving = false;
        delete fan.dataset.rotating;
      }
    };
    if (reducedMotion()) {
      phase = target;
      moving = false;
      delete fan.dataset.rotating;
      render();
    } else frame = requestAnimationFrame(tick);
  };
  const advance = () => {
    if (!fan.isConnected || document.hidden) return;
    if (!ready) {
      requested = true;
      return;
    }
    if (moving) return;
    requested = false;
    move(Math.floor(phase + 1.00001));
  };
  const stop = (immediate = false) => {
    hovered = false;
    requested = false;
    if (immediate || reducedMotion()) {
      cancelAnimationFrame(frame);
      moving = false;
      delete fan.dataset.rotating;
      phase = Math.round(phase);
      render();
    } else if (!moving) delete fan.dataset.rotating;
  };
  const orbit = {
    stop,
    destroy() {
      hovered = false;
      cancelAnimationFrame(frame);
      cardOrbits.delete(orbit);
    },
  };
  fan.addEventListener("pointerenter", event => {
    if (event.target !== fan || event.pointerType !== "mouse" || hovered || reducedMotion()) return;
    hovered = true;
    advance();
  });
  fan.addEventListener("pointerleave", () => stop());
  fan.addEventListener("blur", () => stop());
  fan.addEventListener("pointerdown", event => pointerType = event.pointerType);
  fan.addEventListener("click", event => {
    if (event.detail === 0 || pointerType !== "mouse") advance();
  });
  cardOrbits.add(orbit);
  render();
  Promise.all(images.map(image => {
    image.loading = "eager";
    image.decoding = "async";
    return image.decode();
  })).then(() => {
    ready = true;
    if (hovered || requested) advance();
  }, error => {
    console.error("Unable to decode Discover featured images.", error);
    fan.setAttribute("aria-label", "Featured story images unavailable");
  });
  return orbit;
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
    cardOrbits.forEach(orbit => orbit.stop(true));
    screens[0].querySelector('h2[data-reveal="playing"]')?.setAttribute("data-reveal", "done");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cardOrbits.forEach(orbit => orbit.stop(true));
  });
}
