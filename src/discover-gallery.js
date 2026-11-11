export function mountDiscoverGallery() {
  const gallery = document.querySelector("[data-discover-gallery]");
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll(".discover-gallery-slide")];
  if (slides.length < 2) return;
  const controls = gallery.querySelector(".discover-gallery-controls");
  const status = gallery.querySelector("[data-gallery-status]");
  const hover = matchMedia("(any-hover: hover)");
  let current = 0;

  function advance(step) {
    current = (current + step + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.inert = index !== current;
      slide.setAttribute("aria-hidden", String(index !== current));
    });
    status.textContent = slides[current].getAttribute("aria-label");
  }

  controls.hidden = false;
  controls.querySelectorAll("[data-gallery-step]").forEach(button => {
    const step = Number(button.dataset.galleryStep);
    let advancedOnEntry = false;
    button.addEventListener("pointerenter", event => {
      if (event.pointerType !== "mouse" || !hover.matches) return;
      advancedOnEntry = true;
      advance(step);
    });
    button.addEventListener("pointerleave", () => { advancedOnEntry = false; });
    button.addEventListener("click", event => {
      if (event.detail > 0 && advancedOnEntry) {
        advancedOnEntry = false;
        return;
      }
      advance(step);
    });
  });
}
