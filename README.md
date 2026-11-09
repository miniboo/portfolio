# Chloe Varelidi portfolio

A screenshot-first editorial portfolio built with semantic HTML, CSS and a small JavaScript parallax controller. Vite serves and builds the site.

## Versions

The selected original remains at `/`. Its opening sequence is a dark illustrated biography, a flower-and-mountain Content Intelligence video scene, then a simple coral Selected work index. The compact, header-free opening balances staggered Georgia name lines with a taller botanical illustration on a shared optical baseline and a flower-coral punctuation dot. The authorized leadership and entrepreneur paragraphs share one type size and a maximum 680px measure, followed by supporting AIGA50 DC/MoMA recognition. There is no opening CTA, portrait, ring, square or decorative dot grid. The latest Follies portrait appears once, in About.

The second identity, tab **2**, remains at `/2/`: a warm, serif-led editorial composition informed by the supplied Microsoft AI Style Guide. It retains its previous introduction, original floral-dress portrait and appearance. Both routes share the projects and screenshot assets, with one portrait per route.

The alternative stylesheet is scoped to its route. Without JavaScript, `/2/` falls back to the original complete content and layout.

## Run

Requires Node.js 20.19+.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## Content and motion

The four projects retain their agreed order and the streamlined layouts from before the rejected video-first overhaul. Copilot Content and AI-Native Tools / Royal Academy deliberately contain labeled placeholders. Election and Copilot Discover imagery are supplied design screenshots, not live product demos. Interactive Discover builds, detailed project stories and video presentation remain deferred.

The About biography is preserved apart from the requested current-role sentence and the authorized entrepreneur/fundraising history, which matches the opening excerpt. The original's four user-supplied Content Intelligence figures are 300 million daily desktop users, 50 million mobile users, $1.4 billion annual revenue and 4,000 publishers. They describe ecosystem scale, not attributable personal outcomes. The neutral transformation sentence avoids assigning the old MSN history to the Content Intelligence team. Tab 2 retains its previous biography, narrative and two MSN metrics.

Project numbers use one shared left rail; headings and media align on the neighboring content rail. The hero introduction aligns with the name. The second section places the Microsoft AI heading, Content Intelligence statement and four scale figures over the supplied clip, with a contrast overlay. The single four-project index follows on a plain coral background with a compact heading, no imagery or motion. Captions identify supplied project screenshots, while missing content is labeled once per placeholder.

Parallax moves the opening illustration relative to stationary typography, followed by the landscape backdrop, About portrait and a few media frames. A bounded overlap and scroll-linked image fade blend the opening into the second scene without fading readable text or trapping scroll. The supplied clip replaces the former CSS wind simulation; no hover animation remains. Muted, inline, looping playback is visibility-managed and pauses offscreen or when the document is hidden. The scene's keyboard-accessible Pause motion button and footer toggle control video, parallax and blend together. Blocked autoplay exposes a Play video action; media failure reports the problem and shows the still image.

System reduced motion and manual motion-off disable overlap/fades/parallax, pause the clip and show the original still poster. Without JavaScript, the clip never autoplays and all original content and project-index navigation remain available. Tab 2 retains its previous portrait/backdrop motion and has no new video controls.

## Media

Local media are in `public/media/`. The exact attached landscape clip is `content-intelligence.mp4` (1280×720, 10.005 seconds, approximately 2.3MB); it was inspected as decoded frames and copied without alteration. Its audio is always muted. `work-landscape.jpg` (2000×1125), the earlier inspected text-free Figma image, remains the poster and fallback. Neither is duplicated behind the project index.

The original About uses the exact user-supplied [Follies photo](https://www.playfollies.com/cdn/shop/files/146A5215_websize.jpg?v=1695412046&width=1500), stored as `chloe-follies.jpg` (1500×1000). Tab 2 keeps the original website portrait. Project screenshots come from the supplied Figma nodes. The opening artwork is `editorial-flowers.svg`, exported from mask group `704:67858` in `X6HJ8CzCbnnVsPd82jHHwK`; the requested node `704:67859` is its mask rectangle, not the complete illustration.

No corporate logos, proprietary font files or brandbook copy are reused. The latest editorial reference, `X6HJ8CzCbnnVsPd82jHHwK` node `632:39120`, actually uses Georgia Regular, not Bradford: 128px, 90% line height, zero tracking and left alignment. The original nameplate and Selected work title use system Georgia with that weight, leading and tracking, sized responsively. The larger adjacent flower, staggered name and shared lower edge follow the supplied compact masthead screenshot. All original serif details share Georgia, including section/index numerals, mixed heading accents, the Content Intelligence label and metric suffixes. Body text and captions remain open-source DM Sans. Tab 2 retains its system Georgia/Arial/monospace typography, palette and authored CSS light backdrop.

The original palette is sampled from the unchanged floral SVG: coral `#ff5c39`, stem sage `#aebd80`, peach `#ffa38b` and inner-petal rust `#b94a2b`. Coral colors the project index; sage colors the tools section, dark-canvas link accents and progress indicator. Dark ink on coral has 5.57:1 contrast, and on sage 8.19:1. Rust focus outlines have 4.72:1 against paper and 3.32:1 against the opening; the coral index instead uses dark focus outlines and ink underlines. Pale mint is not used as body text. The second-scene overlay guarantees readable light text, including on mobile.

The supplied election MP4 has been retained locally for a later media pass, but is not embedded in this screenshot-first version. It is a regular video file, not a base64 payload.

## Reference mapping

The earlier frames in `voFVxFCJH528ss63gDWBpi` supplied the dark canvas (`2:18424`), statement composition (`1:12046`) and text-free flower/mountain image (`1:11966`). The user's subsequent direction supersedes their original ordering: the landscape now carries Microsoft AI in the second scene, while the project index follows on the botanical coral. The latest `The Edit` screenshot guides the opening's optical composition; its title and news copy are not copied.

Responsive adaptation keeps text in normal flow. Later project sections retain their streamlined screenshot layouts, with unified Georgia serifs and botanical accents. The original has no site header, reserved header offset or opening circle-arrow CTA; the skip link, actual project index and footer links remain. Tab 2's previous header, opening link, content and layout are reconstructed before the motion controller initializes.
