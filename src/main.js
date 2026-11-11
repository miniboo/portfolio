import { mountDiscoverPhones } from "./discover-phones.js";
import { mountCuratedCards } from "./curated-cards.js";

const hero = document.querySelector(".hero");
if (document.documentElement.dataset.identity === "warm") {
  document.querySelector(".portfolio-nav").remove();
  const layout = document.querySelector(".hero-layout");
  layout.replaceWith(...layout.childNodes);
  const about = document.querySelector("#warm-about");
  about.replaceWith(about.content);
  const footer = document.querySelector("#warm-footer");
  footer.replaceWith(footer.content);
  const portrait = document.querySelector(".portrait");
  portrait.querySelector(".portrait-frame").dataset.parallax = "0.025";
  const header = document.querySelector("#warm-header");
  header.replaceWith(header.content);
  document.querySelector(".hero-illustration").remove();
  document.querySelector(".hero-photo").remove();
  document.querySelector(".selected-projects").remove();
  document.querySelector(".recognition-press").remove();
  document.querySelector(".recognition-moma").nextElementSibling.innerHTML = "Follies featured<br />in the catalogue";
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
  document.querySelector(".hero-origin").remove();
  document.querySelector(".work-link-label").textContent = "View work";
  document.querySelector(".career-history").textContent = document.querySelector("#warm-career-history").content.textContent;
  document.querySelector(".bio").append(document.querySelector(".recognition"));
  const workIndex = document.querySelector("#warm-work-index");
  workIndex.replaceWith(workIndex.content);
  const ecosystem = document.querySelector(".ecosystem-intro");
  const work = document.querySelector(".work-intro");
  const index = work.querySelector(".project-index");
  document.querySelector(".discover-cover").closest("#work").remove();
  work.after(document.querySelector("#warm-copilot-project").content);
  document.querySelector("#ai-native").before(document.querySelector("#warm-discover-project").content);
  document.querySelector("#ai-native").replaceWith(document.querySelector("#warm-tools-project").content);
  document.querySelector("#edge-discover").remove();
  document.querySelector("#midterm-elections").replaceWith(document.querySelector("#warm-elections-project").content);
  document.querySelector(".project-elections .section-number").textContent = "02";
  document.querySelector(".project-tools .section-number").textContent = "04";
  document.querySelectorAll(".warm-image-caption").forEach(template => template.replaceWith(template.content));
  const previous = document.querySelector("#warm-ecosystem").content;
  work.querySelector("#work-title").innerHTML = ecosystem.querySelector("h2").innerHTML;
  work.querySelector("#work-title .green").append(".");
  work.insertBefore(previous.querySelector(".work-context"), index);
  work.insertBefore(previous.querySelector(".scale"), index);
  ecosystem.remove();
}

mountDiscoverPhones();
mountCuratedCards();

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionToggle = document.querySelector("#motion-toggle");
const progress = document.querySelector(".reading-progress");
const video = document.querySelector("#content-landscape-video");
const videoStatus = document.querySelector("#video-status");
const landscapeScene = document.querySelector(".ecosystem-intro");
const landscapeSurface = document.querySelector(".landscape-surface");
if (landscapeScene) {
  const opening = document.createElement("div");
  opening.className = "opening-scenes";
  hero.before(opening);
  opening.append(hero, landscapeScene);
  opening.prepend(landscapeSurface);
}
const botanical = document.querySelector(".hero-illustration img");
const edgeVideo = document.querySelector("#edge-discover-video");
const discoverVideo = document.querySelector("#copilot-discover-video");
const electionsVideo = document.querySelector("#elections-video");
const landscapePlay = video ? document.createElement("button") : null;
const press = document.querySelector(".recognition-press");
const pressLogos = [...document.querySelectorAll(".press-logo")];
const pressArea = document.querySelector("#press-logos");
const pressToggle = press ? document.createElement("button") : null;
const layers = [...document.querySelectorAll("[data-parallax]")].map(element => ({
  element,
  scene: element.closest("section") || landscapeScene,
  speed: Number(element.dataset.parallax),
}));

let motionEnabled = !motionPreference.matches;
let scheduled = false;
let sceneVisible = false;
let introAttempted = false;
let introFinished = false;
let introTimer;
let videoRequest = 0;
let manualPlayback = false;
let videoUnavailable = false;
let pressVisible = false;
let pressHovered = false;
let pressPaused = false;
let pressTimer;
let pressReady = false;

function advancePress(focus = false, direction = 1) {
  const next = (pressLogos.findIndex(logo => logo.dataset.active === "true") + direction + pressLogos.length) % pressLogos.length;
  pressLogos.forEach((logo, index) => {
    const active = index === next;
    logo.dataset.active = String(active);
    logo.setAttribute("aria-hidden", String(!active));
    logo.tabIndex = active ? 0 : -1;
    logo.inert = !active;
  });
  if (focus) pressLogos[next].focus({ preventScroll: true });
}

function syncPress() {
  if (!press) return;
  clearTimeout(pressTimer);
  pressToggle.hidden = !motionEnabled;
  if (!motionEnabled || !pressReady || pressPaused || !pressVisible || document.hidden || pressHovered || press.contains(document.activeElement)) return;
  pressTimer = setTimeout(() => {
    advancePress();
    syncPress();
  }, 2100);
}

function pauseLandscape() {
  clearTimeout(introTimer);
  videoRequest += 1;
  video.pause();
  manualPlayback = false;
  if (introAttempted) introFinished = true;
}

function restartLandscape(explicit = false) {
  if (videoUnavailable || (!motionEnabled && !explicit)) return;
  pauseLandscape();
  introAttempted = false;
  introFinished = false;
  manualPlayback = explicit;
  if (video.readyState >= 1) video.currentTime = 0;
  syncVideo();
}

function reportVideoFailure(error) {
  if (videoUnavailable) return;
  videoUnavailable = true;
  pauseLandscape();
  landscapePlay.disabled = true;
  video.dataset.ready = "false";
  videoStatus.textContent = "The video is unavailable. The landscape image is shown instead.";
  videoStatus.hidden = false;
  console.error("Content Intelligence video playback failed", error);
}

function syncVideo() {
  if (!video) return;
  const bounds = landscapeScene.getBoundingClientRect();
  const visibleHeight = Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0);
  sceneVisible = visibleHeight >= Math.min(bounds.height * .4, innerHeight * .4);
  if ((!motionEnabled && !manualPlayback) || !sceneVisible || document.hidden || videoUnavailable) {
    pauseLandscape();
    if (!motionEnabled) video.dataset.ready = "false";
    return;
  }
  if (introAttempted || introFinished) return;
  introAttempted = true;
  const request = ++videoRequest;
  video.muted = true;
  videoStatus.hidden = true;
  video.play().then(() => {
    if (request !== videoRequest) return;
    video.dataset.ready = "true";
    delete landscapePlay.dataset.blocked;
    introTimer = setTimeout(() => {
      pauseLandscape();
    }, 4000);
  }).catch(error => {
    if (request !== videoRequest) return;
    introFinished = true;
    if (error.name === "NotAllowedError") {
      landscapePlay.dataset.blocked = "true";
      videoStatus.textContent = "Select Play background video to start the muted film. The still landscape remains available.";
      videoStatus.hidden = false;
      console.warn("Background video requires explicit playback in this browser.", error);
    } else {
      reportVideoFailure(error);
    }
  });
}

function renderScroll() {
  scheduled = false;
  const viewport = window.innerHeight;
  const available = document.documentElement.scrollHeight - viewport;
  const ratio = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
  progress.style.transform = `scaleX(${ratio})`;
  layers.forEach(({ element, scene, speed }) => {
    if (!motionEnabled) {
      element.style.removeProperty("transform");
      return;
    }
    const bounds = scene.getBoundingClientRect();
    const distance = viewport / 2 - (bounds.top + bounds.height / 2);
    const offset = Math.max(-65, Math.min(65, distance * speed));
    element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
  if (landscapeScene) {
    if (motionEnabled) {
      const start = Math.max(0, landscapeScene.getBoundingClientRect().top + window.scrollY - viewport);
      const phase = Math.min(1, Math.max(0, (window.scrollY - start) / (viewport * .7)));
      const blend = phase * phase * (3 - 2 * phase);
      landscapeSurface.style.opacity = String(blend);
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
  if (motionToggle) {
    motionToggle.setAttribute("aria-pressed", String(motionEnabled));
    motionToggle.disabled = motionPreference.matches;
    motionToggle.setAttribute("aria-label", motionPreference.matches
      ? "Parallax motion disabled by system preference"
      : motionEnabled ? "Turn off parallax motion" : "Turn on parallax motion");
    motionToggle.innerHTML = `Motion ${motionEnabled ? "on" : "off"} <span aria-hidden="true">◎</span>`;
  }
  syncVideo();
  syncPress();
  scheduleScroll();
}

if (motionToggle) {
  motionToggle.hidden = false;
  motionToggle.addEventListener("click", () => {
    motionEnabled = !motionEnabled && !motionPreference.matches;
    updateMotion();
  });
}
if (press) {
  pressToggle.type = "button";
  pressToggle.tabIndex = 0;
  pressToggle.className = "press-rotation-toggle sr-only";
  pressToggle.textContent = "Pause rotation";
  pressToggle.setAttribute("aria-controls", "press-logos");
  pressToggle.addEventListener("click", () => {
    pressPaused = !pressPaused;
    pressToggle.textContent = pressPaused ? "Resume rotation" : "Pause rotation";
    syncPress();
  });
  press.append(pressToggle);
  Promise.all(pressLogos.map(logo => logo.querySelector("img").decode())).then(() => {
    pressReady = true;
    syncPress();
  }, error => console.warn("Press-logo rotation is unavailable because a source logo could not decode.", error));
  press.addEventListener("pointerenter", event => {
    if (event.pointerType !== "mouse") return;
    pressHovered = true;
    syncPress();
  });
  press.addEventListener("pointerleave", () => { pressHovered = false; syncPress(); });
  press.addEventListener("focusin", syncPress);
  press.addEventListener("focusout", () => queueMicrotask(syncPress));
  pressArea.addEventListener("keydown", event => {
    if (!pressReady || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    advancePress(true, event.key === "ArrowLeft" ? -1 : 1);
    syncPress();
  });
  new IntersectionObserver(([entry]) => {
    const visible = entry.isIntersecting && entry.intersectionRatio >= .8;
    pressVisible = visible;
    syncPress();
  }, { threshold: [0, .8] }).observe(press);
}
if (video) {
  landscapePlay.type = "button";
  landscapePlay.className = "landscape-play";
  landscapePlay.textContent = "Play background video";
  landscapePlay.addEventListener("click", () => restartLandscape(true));
  landscapeScene.append(landscapePlay);
  landscapeScene.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse") restartLandscape();
  });
  landscapeScene.addEventListener("pointerleave", event => {
    if (event.pointerType === "mouse") pauseLandscape();
  });
  video.addEventListener("ended", pauseLandscape);
  video.addEventListener("error", () => reportVideoFailure(video.error));
  video.querySelector("source").addEventListener("error", () => reportVideoFailure(new Error("The supplied video source could not load")));
  new IntersectionObserver(syncVideo, { threshold: Array.from({ length: 11 }, (_, index) => index / 10) }).observe(landscapeScene);
}
for (const [player, statusId, name] of [
  [edgeVideo, "edge-video-status", "Edge Discover"],
  [discoverVideo, "copilot-video-status", "Copilot Discover"],
  [electionsVideo, "elections-video-status", "Midterm Elections"],
]) {
  if (!player) continue;
  let failed = false;
  let owner = null;
  let request = 0;
  let visible = false;
  let previousLoop = null;
  let previousControls = null;
  const status = document.getElementById(statusId);
  const hoverEnabled = document.documentElement.dataset.identity !== "warm";
  const restorePreview = () => {
    if (previousLoop === null) return;
    player.loop = previousLoop;
    player.controls = previousControls;
    previousLoop = null;
    previousControls = null;
  };
  const stop = (hoverOnly = false) => {
    if (hoverOnly && owner !== "hover") return;
    request += 1;
    if (owner === "hover") owner = null;
    restorePreview();
    player.pause();
  };
  const takeControl = () => {
    request += 1;
    restorePreview();
    player.controls = true;
    owner = "user";
  };
  const reportFailure = (error = player.error) => {
    if (failed) return;
    failed = true;
    stop();
    status.textContent = `The ${name} video could not load. Its poster and case-study description remain available.`;
    status.hidden = false;
    console.error(`${name} video playback failed`, error);
  };
  const reportPlayFailure = (error, currentRequest, preview) => {
    if (currentRequest !== request) return;
    stop(preview);
    if (error.name === "NotAllowedError") {
      status.textContent = `Use the video’s Play control to start ${name}. Playback is blocked by this browser.`;
      status.hidden = false;
      console.warn(`${name} video requires explicit playback in this browser.`, error);
    } else {
      reportFailure(error);
    }
  };
  player.addEventListener("error", () => reportFailure());
  player.querySelector("source").addEventListener("error", () => reportFailure());
  if (hoverEnabled) {
    player.tabIndex = 0;
    player.addEventListener("pointerenter", event => {
      if (event.pointerType !== "mouse" || !motionEnabled || !visible || document.hidden || failed
        || owner === "user" || !player.paused || !player.muted || player.ended) return;
      owner = "hover";
      previousLoop = player.loop;
      previousControls = player.controls;
      player.loop = true;
      player.controls = false;
      const currentRequest = ++request;
      player.play().then(() => {
        if (currentRequest !== request && owner === null) player.pause();
        if (currentRequest === request) status.hidden = true;
      }).catch(error => reportPlayFailure(error, currentRequest, true));
    });
    player.addEventListener("pointerleave", event => {
      if (event.pointerType === "mouse") stop(true);
    });
    player.addEventListener("pointerdown", takeControl);
    player.addEventListener("focus", takeControl);
    player.addEventListener("keydown", event => {
      takeControl();
      if ((event.key !== " " && event.key !== "Enter") || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      if (!player.paused) {
        stop();
        return;
      }
      const currentRequest = request;
      player.play().then(() => {
        if (currentRequest === request) status.hidden = true;
      }).catch(error => reportPlayFailure(error, currentRequest, false));
    }, true);
    player.addEventListener("keyup", event => {
      if ((event.key === " " || event.key === "Enter") && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    player.addEventListener("play", () => {
      if (!visible || document.hidden) stop();
    });
    player.addEventListener("pause", () => {
      if (owner === "hover" && player.paused) takeControl();
    });
    player.addEventListener("volumechange", () => {
      if (!player.muted) takeControl();
    });
    motionPreference.addEventListener("change", () => {
      if (motionPreference.matches) stop(true);
    });
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stop();
  }).observe(player);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
}
document.addEventListener("visibilitychange", () => {
  syncVideo();
  syncPress();
});
motionPreference.addEventListener("change", () => {
  manualPlayback = false;
  motionEnabled = !motionPreference.matches;
  updateMotion();
});
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
window.addEventListener("load", scheduleScroll);
updateMotion();
