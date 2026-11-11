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

test("résumé folds Spark work into Humans Who Play and keeps the approved current Microsoft AI leadership", async () => {
  const resume = await readFile(new URL("resume/index.html", root), "utf8");
  assert.doesNotMatch(resume, /spark\s*club/i);
  assert.doesNotMatch(resume, /Experienced design leader|Ever hungry to learn|resume-summary/);
  assert.doesNotMatch(resume, /skills-title|<h2[^>]*>Practice<\/h2>/);
  assert.ok(resume.includes("Design leader / researcher / technologist"));
  const currentRole = resume.match(/<article class="resume-role">[\s\S]*?<\/article>/)[0];
  assert.ok(currentRole.includes("<h3>Microsoft AI</h3>"));
  const appointments = [...currentRole.matchAll(/<section class="resume-appointment"[\s\S]*?<\/section>/g)]
    .map(match => match[0]);
  assert.equal(appointments.length, 1);
  const [currentAppointment] = appointments;
  assert.ok(currentAppointment.includes('<p class="resume-date">Current</p>'));
  assert.ok(currentAppointment.includes("Principal Design Manager"));
  assert.doesNotMatch(currentAppointment, /<p>(?:Player-coach|Selected contributions)/);
  const bullets = [...currentAppointment.matchAll(/<li>(.*?)<\/li>/g)].map(match => match[1]);
  assert.deepEqual(bullets, [
    "Leads a team of five owning a $1.4 billion portfolio across news, sports, finance, shopping, and elections.",
    "Player-coach, personally designing, prototyping, and shipping experiences from sketch to pull request",
    "Directly partnering with executive leadership to take entire product features from 0-to-1 and scale across the One Copilot ecosystem.",
    "Leads AI native design through workshops and building new design tools.",
  ]);
  assert.doesNotMatch(currentAppointment, /\b20\d{2}\b|Principal Product Designer/);
  const humansWhoPlay = [...resume.matchAll(/<article class="resume-role">[\s\S]*?<\/article>/g)]
    .map(match => match[0]).find(role => role.includes("<h3>humans who play</h3>"));
  assert.ok(humansWhoPlay.includes("2018–2024"));
  assert.ok(humansWhoPlay.includes("Founder, Design Director"));
  assert.ok(humansWhoPlay.includes("modular AI-powered learning product for non-technical teams"));
  assert.ok(humansWhoPlay.includes("Developed playful behavioral insights design workshops"));
});
