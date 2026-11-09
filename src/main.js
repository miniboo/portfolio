const hero = document.querySelector(".hero");
const portrait = document.querySelector(".portrait");
portrait.querySelector(".portrait-frame").dataset.parallax = "0.025";

if (document.documentElement.dataset.identity === "warm") {
  const header = document.querySelector("#warm-header");
  header.replaceWith(header.content);
  document.querySelector(".hero-illustration").remove();
  const image = portrait.querySelector("img");
  image.loading = "eager";
  image.src = "/media/chloe-portrait.webp";
  image.width = 1767;
  image.height = 2650;
  image.alt = "Chloe Varelidi smiling, seated in a floral dress surrounded by colorful Follies play shapes.";
  hero.append(portrait);
  document.querySelector(".hero-intro").innerHTML = document.querySelector("#warm-introduction").innerHTML;
  document.querySelector(".hero-experience").remove();
  document.querySelector(".work-link-label").textContent = "View work";
  document.querySelector(".career-history").textContent = document.querySelector("#warm-career-history").content.textContent;
  document.querySelector(".bio").append(document.querySelector(".recognition"));
  const ecosystem = document.querySelector(".ecosystem-intro");
  const work = document.querySelector(".work-intro");
  const index = work.querySelector(".project-index");
  work.querySelector("#work-title").innerHTML = ecosystem.querySelector("h2").innerHTML;
  work.insertBefore(ecosystem.querySelector(".work-context"), index);
  work.insertBefore(ecosystem.querySelector(".scale"), index);
  ecosystem.remove();
  work.querySelector(".work-landscape").remove();
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
