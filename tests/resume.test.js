import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("original-only professional navigation opens a standalone private-source-safe résumé", async () => {
  const [portfolio, resume, script, config] = await Promise.all(
    ["index.html", "resume/index.html", "src/main.js", "vite.config.js"].map(path => readFile(new URL(path, root), "utf8")),
  );
  const nav = portfolio.match(/<nav class="portfolio-nav"[\s\S]*?<\/nav>/)[0];
  assert.ok(nav.includes('href="/resume/"'));
  assert.ok(nav.includes('href="https://www.linkedin.com/in/chloevarelidi/"'));
  assert.ok(script.includes('document.querySelector(".portfolio-nav").remove()'));
  assert.ok(config.includes('new URL("./resume/index.html", import.meta.url)'));
  assert.ok(resume.includes('<main id="resume" tabindex="-1">'));
  assert.equal([...resume.matchAll(/<h1\b/g)].length, 1);
  assert.ok(resume.includes('href="/">← Portfolio</a>'));
  assert.ok(resume.includes('href="mailto:chloe@varelidi.com"'));
  assert.ok(!resume.includes("/src/main.js"));
  assert.ok(!resume.includes(".pdf"));
  assert.ok(!resume.includes("tel:"));
  assert.ok(!/\b\d{3}[ .-]\d{3}[ .-]\d{4}\b/.test(resume));
  for (const id of [...resume.matchAll(/href="#([^"]+)"/g)].map(match => match[1])) {
    assert.ok(resume.includes(`id="${id}"`));
  }
});
