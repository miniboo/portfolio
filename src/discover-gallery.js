export function mountDiscoverGallery() {
  const gallery = document.querySelector("[data-discover-gallery]");
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll(".discover-gallery-slide")];
  if (slides.length < 2) return;
  const controls = gallery.querySelector(".discover-gallery-controls");
  const status = gallery.querySelector("[data-gallery-status]");
  const hover = matchMedia("(any-hover: hover)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const images = slides.map(slide => slide.querySelector("img"));
  images.forEach(image => { image.loading = "eager"; });
  let current = 0;
  let busy = false;
  let pending = 0;

  async function show(step) {
    busy = true;
    gallery.dataset.transitioning = "true";
    const next = (current + step + slides.length) % slides.length;
    try {
      await images[next].decode();
    } catch (error) {
      console.error("Unable to load the Discover gallery design.", error);
      status.textContent = "This design could not load. Please try again.";
      delete gallery.dataset.transitioning;
      busy = false;
      pending = 0;
      return;
    }
    const outgoing = slides[current];
    outgoing.dataset.leaving = "";
    current = next;
    slides.forEach((slide, index) => {
      slide.inert = index !== current;
      slide.setAttribute("aria-hidden", String(index !== current));
    });
    status.textContent = slides[current].getAttribute("aria-label");
    if (!reducedMotion.matches) {
      const options = { duration: 420, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "both" };
      const animations = [
        outgoing.animate([{ transform: "translateX(0)" }, { transform: `translateX(${-step * 100}%)` }], options),
        slides[current].animate([{ transform: `translateX(${step * 100}%)` }, { transform: "translateX(0)" }], options),
      ];
      await Promise.all(animations.map(animation => animation.finished));
      animations.forEach(animation => animation.cancel());
    }
    delete outgoing.dataset.leaving;
    delete gallery.dataset.transitioning;
    busy = false;
    if (pending) {
      const direction = pending;
      pending = 0;
      advance(direction);
    }
  }

  function advance(step) {
    if (busy) {
      pending = step;
      return;
    }
    void show(step);
  }

  controls.hidden = false;
  controls.querySelectorAll("[data-gallery-step]").forEach(button => {
    const step = Number(button.dataset.galleryStep);
    let suppressClickUntil = 0;
    button.addEventListener("pointerenter", event => {
      if (event.pointerType !== "mouse" || !hover.matches) return;
      suppressClickUntil = performance.now() + 600;
      advance(step);
    });
    button.addEventListener("pointerleave", () => { suppressClickUntil = 0; });
    button.addEventListener("click", event => {
      if (event.detail > 0 && performance.now() < suppressClickUntil) {
        suppressClickUntil = 0;
        return;
      }
      advance(step);
    });
  });
}
