import { mountDiscoverPhones } from "./discover-phones.js";

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

document.querySelectorAll(".curated-card").forEach(card => {
  const buttons = [...card.querySelectorAll("[data-curated-reaction]")];
  buttons.forEach(button => {
    button.disabled = false;
    button.addEventListener("click", () => {
      const selected = button.getAttribute("aria-pressed") !== "true";
      buttons.forEach(reaction => reaction.setAttribute("aria-pressed", String(reaction === button && selected)));
    });
  });
});

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
const finishCardEntrance = mountCardEntrance();

function mountCardEntrance() {
  const gallery = document.querySelector(".edge-news-gallery");
  if (!gallery || !motionEnabled || !Element.prototype.animate) return () => {};
  const cards = [...gallery.querySelectorAll(".curated-card")];
  const bounds = gallery.getBoundingClientRect();
  const boxes = cards.map(card => {
    const box = card.getBoundingClientRect();
    return { x: box.left - bounds.left, y: box.top - bounds.top, width: box.width, height: box.height };
  });
  const mobile = boxes.every(box => Math.abs(box.x - boxes[0].x) < 1);
  const firstRowHeight = Math.max(...boxes.filter(box => Math.abs(box.y - boxes[0].y) < 1).map(box => box.height));
  const pivot = {
    x: (Math.min(...boxes.map(box => box.x)) + Math.max(...boxes.map(box => box.x + box.width))) / 2,
    y: mobile ? bounds.height / 2 : firstRowHeight,
  };
  const spacing = Math.min(boxes[0].width * .6, (Math.max(...boxes.map(box => box.x + box.width)) - Math.min(...boxes.map(box => box.x))) / 6);
  const frames = boxes.map((box, index) => {
    const step = index - (cards.length - 1) / 2;
    const frame = (x, y, angle) => {
      let dx = x - box.x - box.width / 2;
      let dy = y - box.y - box.height;
      const radians = angle * Math.PI / 180;
      const cosine = Math.cos(radians);
      const sine = Math.sin(radians);
      const edges = [0, box.width].flatMap(cx => [0, box.height].map(cy =>
        bounds.left + pivot.x + cosine * (box.x + dx + cx - pivot.x) - sine * (box.y + dy + cy - pivot.y)));
      const shift = Math.max(0, 16 - Math.min(...edges)) + Math.min(0, innerWidth - 16 - Math.max(...edges));
      dx += cosine * shift;
      dy -= sine * shift;
      return { transform: `rotate(${angle}deg) translate3d(${dx}px, ${dy}px, 0)`, easing: "cubic-bezier(.4, 0, .2, 1)" };
    };
    return [
      { ...frame(mobile ? box.x + box.width / 2 : pivot.x + step * spacing, mobile ? box.y + box.height - index * 36 : pivot.y, step * (mobile ? .6 : 4)), offset: 0 },
      { ...frame(mobile ? box.x + box.width / 2 : pivot.x + (box.x + box.width / 2 - pivot.x) * .88, mobile ? box.y + box.height - index * 14 : pivot.y + (box.y + box.height - pivot.y) * .82, step * (mobile ? .8 : 6)), offset: .38 },
      { transform: "rotate(0deg) translate3d(0, 0, 0)", offset: 1 },
    ];
  });
  let finished = false;
  let prepared = false;
  let preparing = false;
  const animations = [];
  gallery.dataset.entrance = "pending";
  cards.forEach((card, index) => {
    card.style.transformOrigin = `${pivot.x - boxes[index].x}px ${pivot.y - boxes[index].y}px`;
    card.style.transform = frames[index][0].transform;
    card.style.zIndex = String(index + 1);
  });

  function finish() {
    if (finished) return;
    finished = true;
    animations.forEach(animation => animation.cancel());
    cards.forEach(card => {
      for (const property of ["transform", "transform-origin", "will-change", "z-index"]) card.style.removeProperty(property);
    });
    gallery.dataset.entrance = "settled";
    observer.disconnect();
    resizeObserver.disconnect();
    gallery.removeEventListener("focusin", finish);
    document.removeEventListener("visibilitychange", sync);
    window.removeEventListener("resize", sync);
  }

  function sync() {
    if (finished) return;
    const current = gallery.getBoundingClientRect();
    const visibleHeight = Math.min(current.bottom, innerHeight) - Math.max(current.top, 0);
    if (document.hidden || visibleHeight <= 0) {
      animations.forEach(animation => animation.pause());
      return;
    }
    if (animations.length) {
      animations.forEach(animation => { if (animation.playState === "paused") animation.play(); });
      return;
    }
    if (visibleHeight < Math.min(firstRowHeight * .65, innerHeight * .4)) return;
    if (!prepared) {
      if (preparing) return;
      preparing = true;
      Promise.all([...gallery.querySelectorAll("img")].map(image => {
        image.loading = "eager";
        return image.decode();
      })).then(() => {
        prepared = true;
        sync();
      }, error => {
        console.warn("News-card entrance skipped because a source image could not be decoded.", error);
        finish();
      });
      return;
    }
    gallery.dataset.entrance = "running";
    cards.forEach((card, index) => {
      card.style.willChange = "transform";
      const animation = card.animate(frames[index], { duration: 990, delay: index * 70, fill: "both" });
      animation.onfinish = () => {
        if (animations.every(item => item.playState === "finished")) finish();
      };
      animations.push(animation);
    });
  }

  const observer = new IntersectionObserver(sync, { threshold: Array.from({ length: 101 }, (_, index) => index / 100) });
  const resizeObserver = new ResizeObserver(([entry]) => {
    if (Math.abs(entry.contentRect.width - bounds.width) > 1 || Math.abs(entry.contentRect.height - bounds.height) > 1) finish();
  });
  gallery.addEventListener("focusin", finish);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", sync, { passive: true });
  observer.observe(gallery);
  resizeObserver.observe(gallery);
  return finish;
}

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
  if (!motionEnabled) finishCardEntrance();
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
