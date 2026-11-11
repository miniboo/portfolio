import test from "node:test";
import assert from "node:assert/strict";
import { mountDiscoverGallery } from "../src/discover-gallery.js";

test("gallery advances once per mouse entry and supports click, keyboard and touch without duplicate activation", async t => {
  const documentBefore = globalThis.document;
  const matchMediaBefore = globalThis.matchMedia;
  t.after(() => {
    globalThis.document = documentBefore;
    globalThis.matchMedia = matchMediaBefore;
  });
  const slides = Array.from({ length: 3 }, (_, index) => ({
    dataset: {},
    querySelector: () => ({ decode: async () => {} }),
    inert: index !== 0,
    attributes: { "aria-label": `${index + 1} of 3`, "aria-hidden": String(index !== 0) },
    getAttribute(name) { return this.attributes[name]; },
    setAttribute(name, value) { this.attributes[name] = value; },
  }));
  const buttons = [-1, 1].map(step => Object.assign(new EventTarget(), { dataset: { galleryStep: String(step) } }));
  const controls = { hidden: true, querySelectorAll: () => buttons };
  const status = { textContent: "" };
  const gallery = {
    dataset: {},
    querySelectorAll: () => slides,
    querySelector: selector => selector === ".discover-gallery-controls" ? controls : status,
  };
  let canHover = true;
  globalThis.document = { querySelector: () => gallery };
  globalThis.matchMedia = query => ({ get matches() { return query.includes("reduced-motion") || canHover; } });
  mountDiscoverGallery();
  const emit = async (button, type, properties = {}) => {
    button.dispatchEvent(Object.assign(new Event(type), properties));
    await new Promise(resolve => setImmediate(resolve));
  };
  const active = () => slides.findIndex(slide => !slide.inert);
  const [previous, next] = buttons;

  assert.equal(controls.hidden, false);
  await emit(next, "pointerenter", { pointerType: "mouse" });
  assert.equal(active(), 1);
  await emit(next, "click", { detail: 1 });
  assert.equal(active(), 1);
  await emit(next, "click", { detail: 1 });
  assert.equal(active(), 2);
  await emit(next, "pointerleave");
  await emit(next, "pointerenter", { pointerType: "mouse" });
  assert.equal(active(), 0);
  await emit(previous, "click", { detail: 0 });
  assert.equal(active(), 2);
  await emit(next, "pointerleave");
  await emit(next, "pointerenter", { pointerType: "touch" });
  assert.equal(active(), 2);
  await emit(next, "click", { detail: 1 });
  assert.equal(active(), 0);
  canHover = false;
  await emit(next, "pointerenter", { pointerType: "mouse" });
  assert.equal(active(), 0);
  await emit(next, "click", { detail: 0 });
  assert.equal(active(), 1);
  assert.equal(status.textContent, "2 of 3");
  assert.deepEqual(slides.map(slide => slide.getAttribute("aria-hidden")), ["true", "false", "true"]);
});
