if (document.documentElement.dataset.identity === "collage") {
  const hero = document.querySelector(".hero");
  const collage = document.createElement("div");
  collage.className = "hero-collage";
  const portrait = document.querySelector(".portrait");
  portrait.querySelector(".portrait-frame").dataset.parallax = "0.025";
  collage.append(portrait);

  // Reuse project images as decorative previews, without duplicating their captions.
  for (const [selector, className, speed] of [
    [".discover-desktop img", "collage-discover", "0.02"],
    [".election-map img", "collage-election", "-0.02"],
  ]) {
    const tile = document.createElement("div");
    tile.className = className;
    tile.setAttribute("aria-hidden", "true");
    tile.dataset.parallax = speed;
    const image = document.querySelector(selector).cloneNode();
    image.alt = "";
    image.loading = "eager";
    tile.append(image);
    collage.append(tile);
  }
  hero.append(collage);
}

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector("#motion-toggle");
const progress = document.querySelector(".reading-progress");
const layers = [...document.querySelectorAll("[data-parallax]")].map((element) => ({
  element,
  scene: element.closest("section"),
  speed: Number(element.dataset.parallax),
}));

let motionEnabled = !motionPreference.matches;
let scheduled = false;

function renderScroll() {
  scheduled = false;
  const viewport = window.innerHeight;
  const scrollableHeight = document.documentElement.scrollHeight - viewport;
  const fraction = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
  progress.style.transform = `scaleX(${fraction})`;

  for (const { element, scene, speed } of layers) {
    if (!motionEnabled) {
      element.style.removeProperty("transform");
      continue;
    }
    const bounds = scene.getBoundingClientRect();
    // Measure the stationary section, not the moving layer, to avoid feedback.
    const distance = viewport / 2 - (bounds.top + bounds.height / 2);
    const offset = Math.max(-65, Math.min(65, distance * speed));
    element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }
}

function scheduleScroll() {
  if (!scheduled) {
    scheduled = true;
    window.requestAnimationFrame(renderScroll);
  }
}

function updateMotion() {
  document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
  motionToggle.setAttribute("aria-pressed", String(motionEnabled));
  motionToggle.disabled = motionPreference.matches;
  motionToggle.setAttribute("aria-label", motionPreference.matches
    ? "Parallax motion disabled by system preference"
    : motionEnabled ? "Turn off parallax motion" : "Turn on parallax motion");
  motionToggle.innerHTML = `Motion ${motionEnabled ? "on" : "off"} <span aria-hidden="true">◎</span>`;
  scheduleScroll();
}

motionToggle.hidden = false;
motionToggle.addEventListener("click", () => {
  // The system's reduced-motion preference always takes priority.
  motionEnabled = !motionEnabled && !motionPreference.matches;
  updateMotion();
});
motionPreference.addEventListener("change", () => {
  motionEnabled = !motionPreference.matches;
  updateMotion();
});
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
window.addEventListener("load", scheduleScroll);
updateMotion();
