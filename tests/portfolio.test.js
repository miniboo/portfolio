import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");

test("the agreed four projects retain their titles and order", () => {
  const titles = ["Copilot Content", "Midterm Elections", "AI Generated Content Consumption", "AI-Native Tools / Royal Academy"];
  const links = [...html.matchAll(/<a href="#(?:copilot-content|midterm-elections|ai-content|ai-native)">.*?<span>(.*?)<\/span>/g)].map((match) => match[1]);
  assert.deepEqual(links, titles);
});

test("the original biography is preserved except the current-role sentence", () => {
  assert.ok(html.includes("Chloe Varelidi is a design and technology startup veteran with over 12+ years of experience building consumer products. She is a recognized expert in using the power of play to drive impact and innovation."));
  assert.ok(html.includes("She currently leads the Content Intelligence team at Microsoft, focusing on generative user interfaces across Microsoft’s billion-user ecosystem in verticals such as news, finance, sports, and games."));
  const paragraphs = [...html.matchAll(/<div class="bio">\s*<p>(.*?)<\/p>\s*<p>(.*?)<\/p>\s*<p>(.*?)<\/p>/gs)][0];
  assert.ok(paragraphs);
  assert.equal(paragraphs[2].replaceAll("&amp;", "&"), "Previously, as the Founder and Managing Director at humans who play, Chloe worked with organizations like The LEGO Foundation, General Motors, and The New York Public Schools to bring learning & technology products and services to more than 500,000 caregivers, children, and teachers around the world. As the inventor of Follies, she introduced art into the toy industry, earning a prestigious TOTY nomination. She has held product leadership positions at Mozilla, the startup littleBits (acq. by Sphero) and Quest to Learn, where she was also a founding staff.");
  assert.equal(paragraphs[3], "In addition to her industry roles, Chloe is an Adjunct Professor at GW's Corcoran School of Art and Design, where she mentors the next generation of interaction designers. She holds an MFA from Parson’s Design and Technology program. Most recently she was named one of AIGA50 in Washington, DC, for her contributions to design and innovation.");
  assert.ok(!html.includes("Principal Product Designer on"));
  assert.ok(!html.includes("permanent collection"));
});

test("every image is local, present and has alternative text and dimensions", async () => {
  for (const match of html.matchAll(/<img ([^>]+)>/g)) {
    const attributes = match[1];
    const source = attributes.match(/src="([^"]+)"/)[1];
    assert.ok(source.startsWith("/media/"));
    assert.match(attributes, /alt="[^"]+"/);
    assert.match(attributes, /width="\d+"/);
    assert.match(attributes, /height="\d+"/);
    await access(fileURLToPath(new URL(`public${source}`, root)));
  }
});

test("all in-page links target existing IDs", () => {
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(match[1]), `Missing anchor target: ${match[1]}`);
  }
});

test("unprovided case studies remain explicit placeholders", () => {
  assert.ok(html.includes("Images, video &amp; project details to follow."));
  assert.ok(html.includes("Project details &amp; imagery to follow."));
  assert.equal([...html.matchAll(/class="project-placeholder dot-grid"/g)].length, 2);
  assert.ok(!html.includes("figma.com/api/mcp/asset"));
});

test("project headings and media use one shared layout without repeated filler", () => {
  assert.equal([...html.matchAll(/class="project-heading"/g)].length, 4);
  assert.equal([...html.matchAll(/class="project-body(?: [^"]*)?"/g)].length, 4);
  for (const removed of ["Chloe Varelidi / Portfolio", "Microsoft AI / Selected work", "Space for the story", "Results.<br />Coverage.", "A more<br />", "Next chapter", "what comes"]) {
    assert.ok(!html.includes(removed), `Redundant copy remains: ${removed}`);
  }
});

test("the second identity uses a distinct route and a scoped stylesheet", async () => {
  const warm = await readFile(new URL("src/warm.css", root), "utf8");
  const script = await readFile(new URL("src/main.js", root), "utf8");
  assert.ok(html.includes('=== "/2"'));
  assert.ok(html.includes('document.title = "2"'));
  assert.ok(script.includes('if (document.documentElement.dataset.identity === "warm")'));
  assert.ok(warm.includes('html[data-identity="warm"] .hero .portrait'));
  assert.ok(warm.includes('--serif: Georgia, "Times New Roman", serif;'));
  assert.ok(!script.includes("cloneNode"));
  assert.ok(!warm.includes('data-identity="collage"'));
  assert.ok(!warm.includes("background-image: radial-gradient"));
  for (const [, selector] of warm.matchAll(/([^{}]+)\{/g)) {
    assert.ok(selector.trim().startsWith('html[data-identity="warm"]') || selector.trim().startsWith("@media"), `Unscoped alternative rule: ${selector}`);
  }
  assert.equal([...html.matchAll(/class="bio"/g)].length, 1);
  assert.equal([...html.matchAll(/class="portrait"/g)].length, 1);
});

test("the original opening foregrounds leadership without altering the full biography", () => {
  const hero = html.match(/<section class="hero section-pad".*?<\/section>/s)[0];
  const bio = html.match(/<div class="bio">\s*<p>(.*?)<\/p>/s)[1];
  const currentRole = bio.slice(bio.indexOf("She currently leads"));
  assert.ok(hero.includes(`<p class="hero-intro">${currentRole}</p>`));
  assert.ok(hero.includes("Previously, Founder and Managing Director at humans who play; product leadership at Mozilla, littleBits and Quest to Learn."));
  assert.ok(hero.includes('<span class="work-link-label">Selected work</span>'));
  assert.ok(!hero.includes("orbit-ring"));
  assert.ok(!hero.includes("orbit-square"));
  assert.ok(!hero.includes("Head of Design"));
  assert.ok(!hero.includes("300"));
  assert.ok(!hero.includes("$1.4"));
});
