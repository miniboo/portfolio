const hero = document.querySelector(".hero");
const portrait = document.querySelector(".portrait");
portrait.querySelector(".portrait-frame").dataset.parallax = "0.025";

if (document.documentElement.dataset.identity === "warm") {
  const header = document.querySelector("#warm-header");
  header.replaceWith(header.content);
  document.querySelector(".hero-illustration").remove();
  const heading = document.querySelector(".hero-heading");
  heading.replaceWith(heading.querySelector("h1"));
  const workLink = document.querySelector("#warm-work-link");
  workLink.replaceWith(workLink.content);
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
  const previous = document.querySelector("#warm-ecosystem").content;
  work.querySelector("#work-title").innerHTML = ecosystem.querySelector("h2").innerHTML;
  work.insertBefore(previous.querySelector(".work-context"), index);
  work.insertBefore(previous.querySelector(".scale"), index);
  ecosystem.remove();
}

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector("#motion-toggle");
const progress = document.querySelector(".reading-progress");
const video = document.querySelector("#content-landscape-video");
const sceneToggle = document.querySelector("#scene-motion-toggle");
const videoStatus = document.querySelector("#video-status");
const landscapeScene = document.querySelector(".ecosystem-intro");
const landscapeSurface = document.querySelector(".landscape-surface");
const botanical = document.querySelector(".hero-illustration img");
const layers = [...document.querySelectorAll("[data-parallax]")].map((element) => ({
  element,
  scene: element.closest("section"),
  speed: Number(element.dataset.parallax),
}));

let motionEnabled = !motionPreference.matches;
let scheduled = false;
let sceneVisible = false;
let autoplayBlocked = false;
let videoUnavailable = false;
let playRevision = 0;

function updateSceneControl() {
  if (!sceneToggle) return;
  sceneToggle.disabled = motionPreference.matches || videoUnavailable;
  sceneToggle.textContent = videoUnavailable ? "Still image"
    : motionPreference.matches ? "Motion off"
    : autoplayBlocked && motionEnabled ? "Play video"
    : motionEnabled ? "Pause motion" : "Play motion";
  sceneToggle.setAttribute("aria-pressed", String(motionEnabled && !autoplayBlocked && !videoUnavailable));
  sceneToggle.setAttribute("aria-label", videoUnavailable ? "Video unavailable; still image shown" : motionPreference.matches
    ? "Video and parallax disabled by system preference"
    : sceneToggle.textContent === "Play video" ? "Play landscape video"
    : motionEnabled ? "Pause video and parallax motion" : "Play video and parallax motion");
}

function reportVideoFailure(error) {
  if (videoUnavailable) return;
  videoUnavailable = true;
  video.pause();
  video.dataset.ready = "false";
  videoStatus.textContent = "The video is unavailable. The landscape image is shown instead.";
  videoStatus.hidden = false;
  console.error("Content Intelligence video playback failed", error);
  updateSceneControl();
}

function syncVideo() {
  if (!video) return;
  if (!motionEnabled || !sceneVisible || document.hidden || videoUnavailable) {
    playRevision++;
    video.pause();
    video.dataset.ready = "false";
    return;
  }
  if (autoplayBlocked || !video.paused) return;
  const revision = ++playRevision;
  video.play().catch(error => {
    // Ignore a play request superseded by a visibility or motion change.
    if (revision !== playRevision) return;
    if (error.name === "NotAllowedError") {
      autoplayBlocked = true;
      videoStatus.textContent = "Your browser paused the video. Select Play video to start it.";
      videoStatus.hidden = false;
      updateSceneControl();
    } else {
      reportVideoFailure(error);
    }
  });
}

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
  if (landscapeScene) {
    if (motionEnabled) {
      const start = Math.max(0, landscapeScene.getBoundingClientRect().top + window.scrollY - viewport);
      const blend = Math.min(1, Math.max(0, (window.scrollY - start) / (viewport * .7)));
      landscapeSurface.style.opacity = String(.6 + blend * .4);
      botanical.style.opacity = String(1 - blend * .55);
    } else {
      landscapeSurface.style.removeProperty("opacity");
      botanical.style.removeProperty("opacity");
    }
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
  let label = motionEnabled ? "Turn off parallax motion" : "Turn on parallax motion";
  if (video) label = motionEnabled ? "Pause video and parallax motion" : "Play video and parallax motion";
  if (motionPreference.matches) label = video ? "Video and parallax disabled by system preference" : "Parallax motion disabled by system preference";
  motionToggle.setAttribute("aria-label", label);
  motionToggle.innerHTML = `Motion ${motionEnabled ? "on" : "off"} <span aria-hidden="true">◎</span>`;
  if (video && !motionEnabled && !videoUnavailable) videoStatus.hidden = true;
  updateSceneControl();
  syncVideo();
  scheduleScroll();
}

motionToggle.hidden = false;
function toggleMotion() {
  // The system's reduced-motion preference always takes priority.
  motionEnabled = !motionEnabled && !motionPreference.matches;
  if (motionEnabled) autoplayBlocked = false;
  updateMotion();
}
motionToggle.addEventListener("click", toggleMotion);
if (video) {
  video.muted = true;
  sceneToggle.hidden = false;
  sceneToggle.addEventListener("click", () => {
    if (autoplayBlocked && motionEnabled) {
      autoplayBlocked = false;
      videoStatus.hidden = true;
      updateMotion();
    } else {
      toggleMotion();
    }
  });
  video.addEventListener("playing", () => {
    if (motionEnabled && sceneVisible && !document.hidden) {
      video.dataset.ready = "true";
      videoStatus.hidden = true;
    }
  });
  video.addEventListener("error", () => reportVideoFailure(video.error));
  video.querySelector("source").addEventListener("error", () => reportVideoFailure(new Error("The supplied video source could not load")));
  new IntersectionObserver(([entry]) => {
    sceneVisible = entry.isIntersecting && entry.intersectionRatio >= .05;
    syncVideo();
  }, { threshold: [0, .05] }).observe(landscapeScene);
  document.addEventListener("visibilitychange", syncVideo);
}
motionPreference.addEventListener("change", () => {
  motionEnabled = !motionPreference.matches;
  updateMotion();
});
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
window.addEventListener("load", scheduleScroll);
updateMotion();
