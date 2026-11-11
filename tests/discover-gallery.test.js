import test from "node:test";
import assert from "node:assert/strict";
import { mountDiscoverGallery } from "../src/discover-gallery.js";

test("gallery advances once per mouse entry and supports click, keyboard and touch without duplicate activation", t => {
  const documentBefore = globalThis.document;
  const matchMediaBefore = globalThis.matchMedia;
  t.after(() => {
    globalThis.document = documentBefore;
    globalThis.matchMedia = matchMediaBefore;
  });
  const slides = Array.from({ length: 3 }, (_, index) => ({
    inert: index !== 0,
    attributes: { "aria-label": `${index + 1} of 3`, "aria-hidden": String(index !== 0) },
    getAttribute(name) { return this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; },
  }));
  const buttons = [-1, 1].map(step => Object.assign(new EventTarget(), { dataset: { galleryStep: String(step) } }));
  const controls = { hidden: true, querySelectorAll: () => buttons };
  const status = { textContent: "" };
  const gallery = {
    querySelectorAll: () => slides,
    querySelector: selector => selector === ".discover-gallery-controls" ? controls : status,
  };
  let canHover = true;
  globalThis.document = { querySelector: () => gallery };
  globalThis.matchMedia = () => ({ get matches() { return canHover; } });
  mountDiscoverGallery();
  const emit = (button, type, properties = {}) => button.dispatchEvent(Object.assign(new Event(type), properties));
  const active = () => slides.findIndex(slide => !slide.inert);
  const [previous, next] = buttons;

  assert.equal(controls.hidden, false);
  emit(next, "pointerenter", { pointerType: "mouse" });
  assert.equal(active(), 1);
  emit(next, "click", { detail: 1 });
  assert.equal(active(), 1);
  emit(next, "click", { detail: 1 });
  assert.equal(active(), 2);
  emit(next, "pointerleave");
  emit(next, "pointerenter", { pointerType: "mouse" });
  assert.equal(active(), 0);
  emit(previous, "click", { detail: 0 });
  assert.equal(active(), 2);
  emit(next, "pointerleave");
  emit(next, "pointerenter", { pointerType: "touch" });
  assert.equal(active(), 2);
  emit(next, "click", { detail: 1 });
  assert.equal(active(), 0);
  canHover = false;
  emit(next, "pointerenter", { pointerType: "mouse" });
  assert.equal(active(), 0);
  emit(next, "click", { detail: 0 });
  assert.equal(active(), 1);
  assert.equal(status.textContent, "2 of 3");
  assert.deepEqual(slides.map(slide => slide.getAttribute("aria-hidden")), ["true", "false", "true"]);
});
