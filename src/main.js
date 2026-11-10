import { mountDiscoverPhones } from "./discover-phones.js";
import { mountCuratedCards } from "./curated-cards.js";

const hero = document.querySelector(".hero");
if (document.documentElement.dataset.identity === "warm") {
  const about = document.querySelector("#warm-about");
  about.replaceWith(about.content);
  const footer = document.querySelector("#warm-footer");
  footer.replaceWith(footer.content);
  const portrait = document.querySelector(".portrait");
  portrait.querySelector(".portrait-frame").dataset.parallax = "0.025";
  const header = document.querySelector("#warm-header");
  header.replaceWith(header.content);
  document.querySelector(".hero-illustration").remove();
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
const botanical = document.querySelector(".hero-illustration img");
const edgeVideo = document.querySelector("#edge-discover-video");
const discoverVideo = document.querySelector("#copilot-discover-video");
const electionsVideo = document.querySelector("#elections-video");
const press = document.querySelector(".recognition-press");
const pressLogos = [...document.querySelectorAll(".press-logo")];
const pressArea = document.querySelector("#press-logos");
const layers = [...document.querySelectorAll("[data-parallax]")].map(element => ({
  element,
  scene: element.closest("section"),
  speed: Number(element.dataset.parallax),
}));

let motionEnabled = !motionPreference.matches;
let scheduled = false;
let sceneVisible = false;
let introAttempted = false;
let introFinished = false;
let introTimer;
let videoUnavailable = false;
let pressVisible = false;
let pressHovered = false;
let pressFinished = false;
let pressTimer;

function syncPress() {
  if (!press) return;
  clearTimeout(pressTimer);
  if (!motionEnabled || pressFinished || !pressVisible || document.hidden || pressHovered || pressArea.contains(document.activeElement)) return;
  pressTimer = setTimeout(() => {
    pressFinished = true;
    pressLogos.forEach((logo, index) => {
      const active = index === 1;
      logo.dataset.active = String(active);
      logo.setAttribute("aria-hidden", String(!active));
      logo.tabIndex = active ? 0 : -1;
      logo.inert = !active;
    });
  }, 2500);
}

function reportVideoFailure(error) {
  if (videoUnavailable) return;
  videoUnavailable = true;
  clearTimeout(introTimer);
  video.pause();
  video.dataset.ready = "false";
  videoStatus.textContent = "The video is unavailable. The landscape image is shown instead.";
  videoStatus.hidden = false;
  console.error("Content Intelligence video playback failed", error);
}

function syncVideo() {
  if (!video) return;
  if (!motionEnabled || !sceneVisible || document.hidden || videoUnavailable) {
    clearTimeout(introTimer);
    video.pause();
    if (introAttempted) introFinished = true;
    if (!motionEnabled) video.dataset.ready = "false";
    return;
  }
  if (introAttempted || introFinished) return;
  introAttempted = true;
  video.muted = true;
  video.play().then(() => {
    if (introFinished || !motionEnabled || !sceneVisible || document.hidden) {
      video.pause();
      return;
    }
    video.dataset.ready = "true";
    introTimer = setTimeout(() => {
      introFinished = true;
      video.pause();
    }, 4000);
  }).catch(error => {
    if (error.name === "AbortError" && (!motionEnabled || !sceneVisible || document.hidden)) return;
    introFinished = true;
    if (error.name === "NotAllowedError") {
      videoStatus.textContent = "Your browser is showing the still landscape instead of background video.";
      videoStatus.hidden = false;
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
  pressArea.addEventListener("pointerenter", () => { pressHovered = true; syncPress(); });
  pressArea.addEventListener("pointerleave", () => { pressHovered = false; syncPress(); });
  pressArea.addEventListener("focusin", syncPress);
  pressArea.addEventListener("focusout", () => queueMicrotask(syncPress));
  new IntersectionObserver(([entry]) => {
    pressVisible = entry.isIntersecting;
    syncPress();
  }).observe(press);
}
if (video) {
  video.addEventListener("error", () => reportVideoFailure(video.error));
  video.querySelector("source").addEventListener("error", () => reportVideoFailure(new Error("The supplied video source could not load")));
  new IntersectionObserver(([entry]) => {
    sceneVisible = entry.isIntersecting && entry.intersectionRatio >= .5;
    syncVideo();
  }, { threshold: [0, .5] }).observe(landscapeScene);
}
for (const [player, statusId, name] of [
  [edgeVideo, "edge-video-status", "Edge Discover"],
  [discoverVideo, "copilot-video-status", "Copilot Discover"],
  [electionsVideo, "elections-video-status", "Midterm Elections"],
]) {
  if (!player) continue;
  let failed = false;
  const reportFailure = () => {
    if (failed) return;
    failed = true;
    const status = document.getElementById(statusId);
    status.textContent = `The ${name} video could not load. Its poster and case-study description remain available.`;
    status.hidden = false;
    console.error(`${name} video playback failed`, player.error);
  };
  player.addEventListener("error", reportFailure);
  player.querySelector("source").addEventListener("error", reportFailure);
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) player.pause();
  }).observe(player);
}
document.addEventListener("visibilitychange", () => {
  syncVideo();
  syncPress();
  if (document.hidden && edgeVideo) edgeVideo.pause();
  if (document.hidden && discoverVideo) discoverVideo.pause();
  if (document.hidden && electionsVideo) electionsVideo.pause();
});
motionPreference.addEventListener("change", () => {
  motionEnabled = !motionPreference.matches;
  updateMotion();
});
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
window.addEventListener("load", scheduleScroll);
updateMotion();
