import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const original = html.replace(/<template[^>]*>.*?<\/template>/gs, "");

test("Copilot Discover and Edge Discover lead the retained project sequence", () => {
  const titles = [...original.matchAll(/class="project-heading".*?<h2[^>]*>(.*?)<\/h2>/gs)].map(([, title]) => title.replace(/<[^>]*>/g, ""));
  assert.deepEqual(titles, ["Copilot Discover", "Discover on the Edge Browser", "Midterm Elections", "AI-native design flows."]);
  const numbers = [...original.matchAll(/class="section-number"[^>]*>(\d+)</g)].map(([, number]) => number);
  assert.deepEqual(numbers, ["01", "02", "03", "04"]);
});

test("the biography preserves its wording apart from authorized role and entrepreneur updates", () => {
  assert.ok(html.includes("Chloe Varelidi is a design and technology startup veteran with over 12+ years of experience building consumer products. She is a recognized expert in using the power of play to drive impact and innovation."));
  assert.ok(html.includes("She currently leads the Content Intelligence team at Microsoft, focusing on generative user interfaces across Microsoft’s billion-user ecosystem in verticals such as news, finance, sports, and games."));
  const paragraphs = [...html.matchAll(/<div class="bio">\s*<p>(.*?)<\/p>\s*<p>(.*?)<\/p>\s*<p>(.*?)<\/p>/gs)][0];
  assert.ok(paragraphs);
  assert.equal(paragraphs[2].replaceAll("&amp;", "&").replace(/<\/?span[^>]*>/g, ""), "Previously, as the Founder and Managing Director at humans who play, Chloe worked with organizations like The LEGO Foundation, General Motors, and The New York Public Schools to bring learning & technology products and services to more than 500,000 caregivers, children, and teachers around the world. As the inventor of Follies, she introduced art into the toy industry, earning a prestigious TOTY nomination. As an entrepreneur, she has raised more than $4 million to bring STEM to more than 90,000 students in rural Kenya and previously held leadership positions at Mozilla, littleBits (acquired by Sphero), and the Quest to Learn school.");
  assert.equal(paragraphs[3], "In addition to her industry roles, Chloe is an Adjunct Professor at GW's Corcoran School of Art and Design, where she mentors the next generation of interaction designers. She holds an MFA from Parson’s Design and Technology program. Most recently she was named one of AIGA50 in Washington, DC, for her contributions to design and innovation.");
  assert.ok(!html.includes("Principal Product Designer on"));
  assert.ok(!html.includes("permanent collection"));
});

test("every image is local, present and has alternative text and dimensions", async () => {
  for (const match of html.matchAll(/<img ([^>]+)>/g)) {
    const attributes = match[1];
    const source = attributes.match(/src="([^"]+)"/)[1];
    assert.ok(source.startsWith("/media/"));
    if (attributes.includes('aria-hidden="true"')) assert.match(attributes, /alt=""/);
    else assert.match(attributes, /alt="[^"]+"/);
    assert.match(attributes, /width="\d+"/);
    assert.match(attributes, /height="\d+"/);
    await access(fileURLToPath(new URL(`public${source}`, root)));
  }
});

test("all in-page links target existing IDs", () => {
  const ids = new Set([...original.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
  for (const match of original.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(match[1]), `Missing anchor target: ${match[1]}`);
  }
});

test("the original ends at project04 without About, portrait or contact footer", async () => {
  assert.ok(!original.includes('id="about"'));
  assert.ok(!original.includes('class="portrait"'));
  assert.ok(!original.includes('class="site-footer'));
  assert.ok(!original.includes("Let’s connect"));
  assert.ok(!original.includes('href="#about"'));
  assert.ok(html.includes('<template id="warm-about">'));
  assert.ok(html.includes('<template id="warm-footer">'));
  const script = await readFile(new URL("src/main.js", root), "utf8");
  assert.ok(script.includes("about.replaceWith(about.content)"));
  assert.ok(script.includes("footer.replaceWith(footer.content)"));
  assert.ok(script.indexOf('const portrait = document.querySelector(".portrait")') > script.indexOf('dataset.identity === "warm"'));
});

test("original placeholder projects are replaced by the reference-based AI-native design practice", async () => {
  assert.ok(!original.includes("AI Generated Content"));
  assert.ok(!original.includes("Royal Academy"));
  assert.equal([...original.matchAll(/class="project-placeholder"/g)].length, 0);
  assert.ok(original.includes('id="ai-content" aria-hidden="true"'));
  assert.ok(original.includes('id="discover-title" aria-hidden="true"'));
  const practice = original.match(/<section class="project project-tools.*?<\/section>/s)[0];
  assert.equal([...practice.matchAll(/class="ai-native-marker"/g)].length, 4);
  for (const topic of ["Design in code", "Build, tinker, learn", "Research, craft &amp; judgment", "Share &amp; grow ownership"]) assert.ok(practice.includes(topic));
  assert.ok(practice.includes("A frontier-lab approach to design"));
  for (const process of ["working experiences we can use, test and refine", "hands-on experiments", "Sketching stays part of the process", "ownership across the design cycle"]) assert.ok(practice.includes(process));
  for (const removed of ["publisher content", "chat history", "daily brief", "AI-curated experiences"]) assert.ok(!practice.includes(removed));
  assert.ok(practice.includes('src="/media/ai-native-design-practice.png" width="921" height="522"'));
  assert.ok(!practice.includes("chloe-follies.jpg"));
  assert.ok(html.includes('id="warm-tools-project"'));
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.match(styles, /html:not\(\[data-identity="warm"\]\) \.project-tools \{[^}]*background: #fefdfa;/);
  assert.ok(!html.includes("figma.com/api/mcp/asset"));
});

test("the later project design stays restored and the selected portrait remains available", async () => {
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  const script = await readFile(new URL("src/main.js", root), "utf8");
  for (const value of ["--paper: #f7f5ef;", "--ink: #211e1d;", "--green: #04b455;", '--sans: "DM Sans", "Helvetica Neue", Arial, sans-serif;', '--serif: "Instrument Serif", Georgia, serif;']) {
    assert.ok(styles.includes(value));
  }
  assert.ok(html.includes('src="/media/chloe-follies.jpg" width="1500" height="1000"'));
  assert.ok(script.includes('image.src = "/media/chloe-portrait.webp"'));
  assert.ok(!html.includes('class="project-images'));
});

test("the opening is followed directly by the Discover panels without an orange index", async () => {
  const sections = [...original.matchAll(/<section class="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sections.slice(0, 5), ["hero section-pad", "ecosystem-intro section-pad", "project project-copilot discover-cover dark section-pad", "discover-statement section-pad", "daily-brief section-pad"]);
  const hero = html.match(/<section class="hero section-pad".*?<\/section>/s)[0];
  assert.ok(hero.includes('src="/media/editorial-flowers.svg"'));
  assert.ok(!hero.includes('class="portrait"'));
  assert.ok(!hero.includes("chloe-follies.jpg"));
  const about = html.match(/<section class="about section-pad".*?<\/section>/s)[0];
  assert.ok(about.includes('src="/media/chloe-follies.jpg"'));
  assert.equal([...original.matchAll(/largest transformation of MSN/g)].length, 1);
  assert.ok(!original.includes('class="project-index"'));
  assert.ok(!original.includes("Selected work"));
  assert.ok(original.includes('<div id="work">'));
  assert.ok(!html.includes("Lorem ipsum"));
  assert.ok(!html.includes("We build for Mondays"));
  await access(new URL("public/media/work-landscape.jpg", root));
});

test("the original has a Georgia editorial title and no rendered header or dot grids", async () => {
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  const script = await readFile(new URL("src/main.js", root), "utf8");
  const header = html.match(/<template id="warm-header">.*?<\/template>/s)?.[0];
  assert.ok(header?.includes('<header class="site-header">'));
  assert.ok(!html.replace(header, "").includes('<header class="site-header">'));
  assert.ok(script.includes("header.replaceWith(header.content)"));
  assert.ok(script.includes('document.querySelector(".hero-illustration").remove()'));
  assert.match(styles, /html:not\(\[data-identity="warm"\]\) \.hero h1 \{[^}]*font-family: var\(--serif\);[^}]*font-weight: 400;[^}]*line-height: \.9;/);
  assert.match(styles, /html:not\(\[data-identity="warm"\]\) \{ --serif: Georgia, "Times New Roman", serif;[^}]*scroll-padding-top: 0;/);
  assert.ok(!html.includes("dot-grid"));
  assert.ok(!styles.includes("radial-gradient"));
  assert.ok(html.includes('class="skip-link" href="#main"'));
});

test("project headings and media use one shared layout without repeated filler", () => {
  assert.equal([...original.matchAll(/class="project-heading"/g)].length, 4);
  assert.equal([...original.matchAll(/class="project-body(?: [^"]*)?"/g)].length, 4);
  for (const removed of ["Chloe Varelidi / Portfolio", "Microsoft AI / Selected work", "Space for the story", "Results.<br />Coverage.", "A more<br />", "Next chapter", "what comes"]) {
    assert.ok(!html.includes(removed), `Redundant copy remains: ${removed}`);
  }
});

test("original module introductions use a stacked rail and centered, uncropped media", async () => {
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.ok(styles.includes('.project .project-body { width: 100%; max-width: 1400px; margin-inline: auto; }'));
  assert.ok(styles.includes('.project .project-heading { display: flex; flex-direction: column; gap: 20px; }'));
  assert.ok(original.includes("Edge / New tab page"));
  assert.ok(original.includes("MSN / Election coverage"));
});

test("Edge has the four confirmed personalized cards with live source text and appropriate attribution", () => {
  const news = original.match(/<section class="edge-news".*?<\/section>/s)[0];
  assert.ok(news.includes('<h3 id="edge-news-title">AI-curated news for you</h3>'));
  assert.equal([...news.matchAll(/<article /g)].length, 4);
  assert.equal([...news.matchAll(/<h4 /g)].length, 4);
  assert.equal([...news.matchAll(/Curated by Copilot/g)].length, 2);
  assert.equal([...news.matchAll(/<span>Vexel<\/span>/g)].length, 2);
  assert.equal([...news.matchAll(/data-curated-reaction=/g)].length, 8);
  assert.equal([...news.matchAll(/aria-pressed="false" disabled/g)].length, 8);
  for (const copy of ["A frosty start to your morning", "Schiaparelli gives your London trip a cultural anchor", "Microsoft's earnings reveal an interesting AI trade-off", "The key pressure point ahead of kickoff", "You follow the 49ers", "238.78", "3.97%"]) assert.ok(news.includes(copy));
  for (const removed of ["The Universe Is Coming Into Focus", "Congress Returns to Washington", "curated-universe", "curated-congress", "curated-capitol"]) assert.ok(!original.includes(removed));
  for (const asset of ["curated-weather.jpg", "curated-travel.jpg", "curated-football.jpg", "curated-vexel.png"]) assert.ok(news.includes(`/media/${asset}`));
  for (const removed of ["edge-news-finance", "edge-news-football", "edge-news-spiderman", "edge-news-sponsored", "edge-news-weather.png", "edge-news-travel.png", "edge-news-congress.png", "edge-news-universe.png"]) assert.ok(!news.includes(removed));
  assert.ok(!news.includes("section-number"));
  assert.ok(!news.includes("<a "));
  assert.ok(!news.includes("<video"));
});

test("both original election surfaces reuse the actual NTP paper and ink tokens", async () => {
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.ok(styles.includes('html:not([data-identity="warm"]) :is(.project-edge, .project-elections, .election-details-page) { background: var(--paper); color: var(--ink); }'));
  assert.ok(!styles.includes("border-radius: 8px; background: #f7f7f7;"));
});

test("news cards replace the fan with source prompt editors and honest local actions", async () => {
  const main = await readFile(new URL("src/main.js", root), "utf8");
  const script = await readFile(new URL("src/curated-cards.js", root), "utf8");
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.ok(main.includes("mountCuratedCards()"));
  assert.ok(!main.includes("mountCardEntrance"));
  for (const copy of ["Make this card more relevant to you", "Describe topics, sources or any updates", "Cancel", "Update card", "stories do not regenerate"]) assert.ok(script.includes(copy));
  assert.ok(script.includes('toggle.setAttribute("aria-controls", editor.id)'));
  assert.ok(script.includes("card.inert = open"));
  assert.ok(script.includes("editor.inert = !open"));
  assert.ok(script.includes('event.key !== "Escape"'));
  assert.ok(script.includes('event.pointerType !== "mouse"'));
  assert.ok(script.includes('card.dataset.prompt = textarea.value'));
  assert.ok(!script.includes("fetch("));
  assert.ok(!script.includes("localStorage"));
  assert.ok(styles.includes('.curated-turn[data-side="editor"] { transform: rotateY(-180deg); }'));
  assert.ok(styles.includes('html[data-motion="off"] .curated-turn > :is(.curated-card, .curated-editor) { transition: none; }'));
  assert.ok(styles.includes("transition: opacity 0s 275ms"));
});

test("Midterm leads with the genuine video then individual source pieces and preserves the warm gallery", async () => {
  const elections = original.match(/<section class="project project-elections.*?<\/section>/s)[0];
  assert.ok(elections.indexOf('id="elections-video"') < elections.indexOf('class="election-details-page"'));
  assert.ok(elections.includes('src="/media/midterm-elections-results.mp4"'));
  assert.ok(elections.includes('controls muted playsinline preload="none"'));
  assert.ok(!elections.includes("elections-overview.png"));
  assert.ok(elections.includes('poster="/media/elections-results.png"'));
  const details = elections.slice(elections.indexOf('class="election-details-page"'));
  assert.ok(!details.includes("elections-results.png"));
  assert.ok(!elections.includes('class="election-map"'));
  assert.equal([...elections.matchAll(/<img /g)].length, 5);
  assert.ok(html.includes('id="warm-elections-project"'));
  const script = await readFile(new URL("src/main.js", root), "utf8");
  assert.ok(script.includes('document.querySelector("#warm-elections-project").content'));
  assert.ok(script.includes('[electionsVideo, "elections-video-status", "Midterm Elections"]'));
  await access(new URL("public/media/midterm-elections-results.mp4", root));
  await access(new URL("public/media/elections-results.png", root));
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

test("the original opening foregrounds leadership and the authorized entrepreneur history", () => {
  const hero = html.match(/<section class="hero section-pad".*?<\/section>/s)[0];
  const bio = html.match(/<div class="bio">\s*<p>(.*?)<\/p>/s)[1];
  const currentRole = bio.slice(bio.indexOf("She currently leads")).replace(/^She /, "Chloe ");
  assert.ok(hero.includes(`<p class="hero-intro">${currentRole}</p>`));
  const experience = hero.match(/<p class="hero-experience">(.*?)<\/p>/)[1];
  assert.ok(experience.includes("raised more than $4 million to bring STEM to more than 90,000 students in rural Kenya"));
  assert.ok(experience.includes("leadership positions at Mozilla and littleBits (acquired by Sphero)"));
  assert.ok(experience.includes("At littleBits, she led product lines with Lucasfilm and Marvel."));
  assert.ok(experience.includes("She started her career in tech—and learned most of what she knows—by helping start the public school Quest to Learn."));
  assert.equal([...experience.matchAll(/Quest to Learn/g)].length, 1);
  assert.ok(hero.includes('class="recognition"'));
  assert.ok(hero.indexOf('class="hero-intro"') < hero.indexOf('class="hero-experience"'));
  assert.ok(hero.indexOf('class="hero-experience"') < hero.indexOf('class="recognition"'));
  const warmLink = hero.match(/<template id="warm-work-link">.*?<\/template>/s)?.[0];
  assert.ok(warmLink?.includes('class="scroll-link'));
  assert.ok(!hero.replace(warmLink, "").includes('class="scroll-link'));
  assert.match(hero, /src="\/media\/editorial-flowers\.svg"[^>]*data-parallax="-0\.1"/);
  assert.equal([...html.matchAll(/class="recognition"/g)].length, 1);
  assert.ok(hero.includes("AIGA50 DC"));
  assert.ok(hero.includes("MoMA"));
  assert.ok(hero.includes("Featured<br />Designer"));
  assert.ok(!hero.includes("orbit-ring"));
  assert.ok(!hero.includes("orbit-square"));
  assert.ok(!hero.includes("Head of Design"));
  assert.ok(!hero.includes("300"));
  assert.ok(!hero.includes("$1.4"));
});

test("the landscape remains the second scene without a duplicated backdrop", async () => {
  const ecosystem = html.match(/<section class="ecosystem-intro section-pad".*?<\/section>/s)[0];
  const work = html.match(/<section class="work-intro dark section-pad".*?<\/section>/s)[0];
  assert.ok(ecosystem.includes('class="landscape-parallax" data-parallax="0.04"'));
  assert.ok(ecosystem.includes("She is leading the largest transformation of MSN in its 20-year history"));
  assert.ok(ecosystem.includes('class="scale"'));
  assert.ok(!work.includes("landscape"));
  assert.equal([...html.matchAll(/class="landscape-image"/g)].length, 1);
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.ok(!styles.includes("botanical-breeze"));
  assert.ok(ecosystem.includes('class="landscape-video" muted playsinline preload="none"'));
  assert.ok(!ecosystem.includes(" loop"));
  assert.ok(ecosystem.includes('src="/media/content-intelligence.mp4" type="video/mp4"'));
  await access(new URL("public/media/content-intelligence.mp4", root));
});

test("the Content Intelligence scene retains all metrics and the confirmed MSN history", () => {
  const scene = html.match(/<section class="ecosystem-intro section-pad".*?<\/section>/s)[0].replace(/<template[^>]*>.*?<\/template>/gs, "");
  const metrics = [...scene.matchAll(/<dt>(.*?)<\/dt><dd>(.*?)<\/dd>/g)].map(([, value, label]) => [value.replace(/<\/?span>/g, ""), label]);
  assert.deepEqual(metrics, [["300m", "Daily desktop users"], ["50m", "Mobile users"], ["$1.4bn", "Annual revenue"], ["4,000", "Publishers"]]);
  assert.ok(scene.includes("She is leading the largest transformation of MSN in its 20-year history"));
  const narrative = scene.match(/class="work-context">(.*?)<\/div>/s)[1];
  assert.equal([...narrative.matchAll(/<p>/g)].length, 1);
  for (const detail of ["generative user interfaces", "news, finance, sports, and games", "Microsoft’s billion-user ecosystem"]) assert.ok(narrative.includes(detail));
  assert.ok(scene.includes('class="statement-label">Content Intelligence</p>'));
  assert.ok(html.includes('id="warm-ecosystem"'));
});

test("Discover has the exact personalized-brief title and supplied replacement design", async () => {
  const story = original.match(/<section class="discover-statement.*?<\/section>/s)[0];
  for (const copy of ["Copilot Discover", "desktop app and One Copilot", "chat history and memory", "current publishers and AI-curated sources", "generative UI model", "adds augments to stories"]) assert.ok(story.includes(copy));
  assert.ok(story.includes('<h3 id="discover-story-title">A daily brief made just for you.</h3>'));
  assert.ok(story.includes('src="/media/discover-personalized-brief.png" width="1128" height="1605" loading="lazy"'));
  assert.ok(story.includes("Zahra Bello's profile, publisher attribution"));
  assert.ok(!story.includes("Thursday"));
  assert.ok(story.includes('href="/media/discover-personalized-brief.png" target="_blank" rel="noopener"'));
  assert.ok(!original.includes("Browser prototype pending."));
  assert.ok(!story.includes("discover-video-placeholder"));
  const image = await readFile(new URL("public/media/discover-personalized-brief.png", root));
  assert.equal(createHash("sha256").update(image).digest("hex"), "a4ef8876673bcb69cf31b2322466818bc7aef2d855d71eaa5d903172caf4f5d9");
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.match(styles, /html:not\(\[data-identity="warm"\]\) \.discover-statement \{[^}]*background: #f6f5f3;/);
  assert.ok(!story.includes("<video"));
  assert.equal([...original.matchAll(/src="\/media\/discover-desktop.png"/g)].length, 0);
  assert.ok(!original.match(/id="ai-content".*?<\/section>/s)[0].includes("Copilot Discover"));
});

test("Discover walkthrough uses the real backdrop and one browser toolbar without cropping the recording", async () => {
  const cover = original.match(/<section class="project project-copilot.*?<\/section>/s)[0];
  assert.ok(cover.includes('src="/media/discover-wallpaper.png" width="1920" height="1080"'));
  assert.ok(cover.includes('src="/media/discover-browser-toolbar.png" width="1440" height="92"'));
  assert.ok(cover.includes('id="copilot-discover-video" controls muted playsinline preload="none"'));
  assert.ok(cover.includes('width="2386" height="1440"'));
  assert.ok(cover.includes('src="/media/discover-desktop.mp4" type="video/mp4"'));
  assert.ok(cover.includes('poster="/media/discover-desktop-poster.jpg"'));
  assert.ok(!cover.includes("autoplay"));
  assert.ok(!cover.includes("data-parallax"));
  for (const name of ["discover-desktop.mp4", "discover-wallpaper.png", "discover-browser-toolbar.png", "discover-desktop-poster.jpg"]) await access(new URL(`public/media/${name}`, root));
});

test("Discover principles are integrated into the existing narrative beside the design", async () => {
  const story = original.match(/<section class="discover-statement.*?<\/section>/s)[0];
  const description = story.match(/<div class="discover-description">(.*?)<\/div>/s)[1];
  assert.equal([...description.matchAll(/<p>/g)].length, 3);
  for (const text of ["agentic experience centered on human voices", "Real voices and clear provenance", "format, length, and knowledge level", "guiding intent is to earn your trust"]) assert.ok(description.includes(text));
  assert.ok(!original.includes("discover-principles"));
  assert.ok(!original.includes("Design principles"));
  assert.ok(!story.includes("<dl"));
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.ok(!styles.includes("discover-principle"));
  assert.ok(!styles.includes("#502d35"));
  assert.match(original, /<section class="daily-brief.*?<\/section>\s*<\/div>\s*<section class="project project-edge/s);
});

test("Daily Brief groups all three actual Figma mocks in one visuals-only section", async () => {
  const work = original.match(/<div id="work">(.*?)<\/div>\s*<section class="project project-edge/s)[1];
  assert.match(work, /class="discover-statement.*?<\/section>\s*<section class="daily-brief/s);
  const brief = work.match(/<section class="daily-brief.*?<\/section>/s)[0];
  assert.ok(brief.includes('id="daily-brief-title" aria-label="Copilot Discover daily brief"'));
  assert.ok(brief.includes('role="group" tabindex="0"'));
  const sources = [...brief.matchAll(/src="\/media\/(.*?)"/g)].map(match => match[1]);
  const mocks = [
    ["discover-daily-brief.png", "b53f0408ef0642950cb8a9f4b1c7c39304749b4f5be806174960e6526a52f6ff"],
    ["discover-daily-brief-feed.png", "32dc1e0e624d4609cf4af4d8a54f83e94721e7dec87c29d13c8bd85fc6e0c3a0"],
    ["discover-daily-brief-agents.png", "4cdb6f0d39c99b526aeac666c2fc2f5253f63f82ad811c37ce74483a36b5ac11"],
  ];
  assert.deepEqual(sources, mocks.map(([name]) => name));
  assert.equal([...brief.matchAll(/width="393" height="852" loading="lazy"/g)].length, 3);
  for (const [name, hash] of mocks) {
    const image = await readFile(new URL(`public/media/${name}`, root));
    assert.equal(createHash("sha256").update(image).digest("hex"), hash);
  }
  assert.ok(!brief.includes("<source"));
  assert.ok(!brief.includes("discover-feed.png"));
  assert.ok(!brief.includes("discover-mobile-feed.png"));
  assert.ok(!/<h[1-6]\b|<p\b|figcaption/.test(brief));
  assert.ok(!brief.includes('class="section-number"'));
  assert.ok(!brief.includes("figcaption"));
  assert.ok(!brief.includes("data-parallax"));
});

test("the opening has the exact two-line credibility labels and genuine linked logos", async () => {
  const script = await readFile(new URL("src/main.js", root), "utf8");
  assert.ok(original.includes("Featured<br />Designer"));
  assert.ok(original.includes("Work published<br />in"));
  assert.ok(original.includes("AIGA50 DC"));
  assert.ok(original.includes('alt="TODAY"'));
  assert.ok(original.includes('alt="Fast Company"'));
  assert.ok(!original.includes('id="press-motion-toggle"'));
  assert.ok(!script.includes("setInterval"));
  assert.ok(script.includes("pressFinished = true"));
  assert.ok(script.includes("pressArea.contains(document.activeElement)"));
  assert.ok(script.includes("document.hidden"));
  assert.ok(script.includes('document.querySelector(".recognition-press").remove()'));
});

test("the first two Discover phones progressively enhance into independent source-based interactions", async () => {
  const script = await readFile(new URL("src/discover-phones.js", root), "utf8");
  const main = await readFile(new URL("src/main.js", root), "utf8");
  assert.ok(main.indexOf("mountDiscoverPhones();") > main.indexOf('document.querySelector(".discover-cover").closest("#work").remove()'));
  for (const text of ["Bay Area Family events", "Boo at the Zoo returns this Saturday", "Spooky Science takes over Chabot", "Market Watch", "Local family events", "Back to categories", "Add and view"]) assert.ok(script.includes(text));
  assert.ok(script.includes('feedMarkup("daily-news-feed")'));
  assert.ok(script.includes('feedMarkup("welcome-agent-feed")'));
  assert.ok(script.includes('viewport.scrollTo({ top: target'));
  assert.ok(!script.includes("scrollIntoView"));
  assert.ok(!script.includes("fetch("));
  assert.ok(!script.includes("localStorage"));
  assert.ok(!script.includes("setInterval"));
  assert.ok(script.includes('matchMedia("(prefers-reduced-motion: reduce)")'));
  assert.ok(!script.includes("Make it your own"));
  assert.ok(!script.includes("phone-custom"));
  assert.ok(!script.includes("Math.min(3,"));
  assert.ok(script.includes("categories.length - 1"));
  assert.ok(!script.includes("screens[2]."));
  const names = new Set([...script.matchAll(/["']((?:feed-|welcome-|phone-)[\w-]+\.(?:png|jpg))["']/g)].map(match => match[1]));
  assert.ok(names.size >= 20);
  for (const name of names) await access(new URL(`public/media/${name}`, root));
});

test("the first phone uses a hover-driven depth orbit and compact native pagination", async () => {
  const script = await readFile(new URL("src/discover-phones.js", root), "utf8");
  const styles = await readFile(new URL("src/discover-phones.css", root), "utf8");
  for (const text of ["translate3d(", "rotateY(", "Math.cos(angle)", "pointerenter", "pointerleave", "Math.round(phase)", "Google Research · 5h ago", "Microsoft · 8h ago"]) assert.ok(script.includes(text));
  assert.ok(script.includes('type="range" min="0" max="${categories.length - 1}"'));
  assert.ok(!script.includes("animateFan"));
  assert.ok(!script.includes('{ translate: "0 12px"'));
  assert.ok(styles.includes("perspective: 152.67176cqw"));
  assert.ok(styles.includes("width: 58px; height: 32px"));
  assert.ok(styles.includes("gap: 6px"));
  assert.ok(script.includes("progress ** 3 * (progress * (progress * 6 - 15) + 10)"));
  assert.ok(script.includes("if (moving) return"));
  assert.ok(script.includes("if (current !== currentStory)"));
  assert.ok(script.includes("image.decode()"));
  assert.ok(!script.includes("setTimeout"));
  assert.ok(script.includes('event.target !== fan'));
  assert.ok(script.includes('(now - start) / 700'));
  assert.ok(script.includes('* 60 * (1 - .7 * overlap)'));
});

test("the first phone reveals its accessible greeting once on visibility using the Copilot cadence", async () => {
  const script = await readFile(new URL("src/discover-phones.js", root), "utf8");
  const styles = await readFile(new URL("src/discover-phones.css", root), "utf8");
  assert.ok(script.includes('aria-label="What would you like to keep up with?"'));
  assert.ok(script.includes('phone.dataset.greetingPresented = "true"'));
  assert.ok(script.includes('entry.target === heading && entry.isIntersecting'));
  assert.ok(script.includes('observer.unobserve(heading)'));
  assert.ok(styles.includes("500ms cubic-bezier(0, 0, 0, 1) both"));
  assert.ok(styles.includes("150ms + var(--letter-index) * 10ms"));
  assert.ok(styles.includes('.interactive-phone h2[data-reveal] .phone-letter { opacity: 1; animation: none; }'));
});

test("custom motion controls are absent and decorative video is finite with a still fallback", async () => {
  const script = await readFile(new URL("src/main.js", root), "utf8");
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  assert.ok(html.includes('poster="/media/work-landscape.jpg"'));
  for (const id of ["motion-toggle", "scene-motion-toggle", "press-motion-toggle"]) assert.ok(!original.includes(`id="${id}"`));
  assert.ok(html.includes('id="video-status" class="video-status" role="status" hidden'));
  assert.ok(script.includes('error.name === "NotAllowedError"'));
  assert.ok(script.includes('video.pause()'));
  assert.ok(script.includes("}, 4000)"));
  assert.ok(script.includes('landscapeSurface.style.opacity'));
  assert.ok(styles.includes('html[data-motion="off"] .landscape-surface { opacity: 1 !important; mask-image: none; }'));
  assert.ok(styles.includes('.hero .name-period { color: var(--orange); }'));
});

test("the second-screen film replays on hover and press logos rotate only after meaningful visibility", async () => {
  const script = await readFile(new URL("src/main.js", root), "utf8");
  assert.ok(script.includes("function restartLandscape(explicit = false)"));
  assert.ok(script.includes('landscapeScene.addEventListener("pointerenter"'));
  assert.ok(script.includes('landscapeScene.addEventListener("pointerleave"'));
  assert.ok(script.includes("restartLandscape(true)"));
  assert.ok(script.includes("request !== videoRequest"));
  assert.ok(script.includes('video.addEventListener("ended", pauseLandscape)'));
  assert.ok(script.includes("entry.intersectionRatio >= .8"));
  assert.ok(script.includes("if (visible && !pressVisible) pressFinished = false"));
  assert.ok(script.includes('logo.querySelector("img").decode()'));
  assert.ok(script.includes("index === next"));
});

test("Edge has a native controlled video and the authorized problem, intervention and outcome", async () => {
  const edge = original.match(/<section class="project project-edge.*?<\/section>/s)[0];
  assert.ok(edge.includes('controls muted playsinline preload="none"'));
  assert.ok(!edge.includes("autoplay"));
  assert.ok(edge.includes("Close the revenue gap while changing the business model."));
  assert.ok(edge.includes("A linear feed with a personalized left section."));
  assert.ok(edge.includes("<strong>11%</strong> increase in engagement and a closed revenue gap."));
  for (const file of ["discover-edge.mp4", "discover-edge-poster.jpg"]) await access(new URL(`public/media/${file}`, root));
});

test("redundant image metadata captions are removed but missing-media status remains honest", () => {
  const captions = [...original.matchAll(/<figcaption[^>]*>(.*?)<\/figcaption>/gs)].map(([, caption]) => caption);
  assert.deepEqual(captions, []);
});

test("original accent colors come from the artwork and retain accessible contrast", async () => {
  const svg = await readFile(new URL("public/media/editorial-flowers.svg", root), "utf8");
  const styles = await readFile(new URL("src/style.css", root), "utf8");
  const palette = { green: "#aebd80", orange: "#ff5c39", pink: "#ffa38b", rust: "#b94a2b" };
  for (const [name, color] of Object.entries(palette)) {
    assert.ok(svg.toLowerCase().includes(`fill="${color}"`));
    assert.ok(styles.includes(`--${name}: ${color};`));
  }
  const luminance = hex => hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const contrast = (first, second) => {
    const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (values[0] + .05) / (values[1] + .05);
  };
  assert.ok(contrast("#211e1d", palette.green) >= 4.5);
  assert.ok(contrast("#1e1b1b", palette.orange) >= 4.5);
  assert.ok(contrast(palette.rust, "#f7f5ef") >= 3);
  assert.ok(contrast(palette.rust, "#1e1b1b") >= 3);
  assert.ok(contrast("#fefdfa", "#444444") >= 4.5);
});
