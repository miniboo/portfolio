import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { build } from "vite";

for (const base of ["/", "/portfolio/"]) {
  test(`static build supports direct routes and local links at ${base}`, async () => {
    const result = await build({
      configFile: fileURLToPath(new URL("../vite.config.js", import.meta.url)),
      base,
      logLevel: "silent",
      build: { write: false },
    });
    const assets = new Map(result.output.filter(file => file.type === "asset").map(file => [file.fileName, file.source]));
    assert.equal(assets.get("2/index.html"), assets.get("index.html"));
    assert.ok(assets.has(".nojekyll"));
    for (const route of ["index.html", "2/index.html", "resume/index.html"]) {
      const html = assets.get(route);
      assert.equal(typeof html, "string", `Missing direct route: ${route}`);
      assert.ok(!html.includes("%BASE_URL%"));
      assert.ok(!html.includes("/src/"));
      for (const [, url] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
        if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(url)) continue;
        assert.ok(url.startsWith(base), `${route} escapes ${base}: ${url}`);
      }
    }
    assert.ok(assets.get("index.html").includes(`=== "${base}2"`));
    assert.ok(assets.get("index.html").includes(`href="${base}resume/"`));
    assert.ok(assets.get("resume/index.html").includes(`href="${base}">← Portfolio`));
  });
}
