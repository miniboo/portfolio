# Chloe Varelidi portfolio

A screenshot-first editorial portfolio built with semantic HTML, CSS and a small JavaScript parallax controller. Vite serves and builds the site.

## Versions

The selected original remains at `/`. Its opening sequence is a dark illustrated biography, a flower-and-mountain Content Intelligence video scene, then the Copilot Discover story and Daily Brief display. The standalone orange Selected work index has been removed; `#work` now targets the retained Discover presentation. The compact, header-free opening balances staggered Georgia name lines with a taller botanical illustration on a shared optical baseline and a flower-coral punctuation dot. The authorized leadership and entrepreneur paragraphs share one type size and a maximum 680px measure, followed by AIGA50 DC/MoMA recognition and a compact rotating press-logo slot. There is no opening CTA, portrait, ring, square or decorative dot grid. The latest Follies portrait appears once, in About.

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

The user explicitly selected Copilot Discover as project 01, replacing the empty Copilot Content section, then added Discover on the Edge Browser as project 02. Midterm Elections, AI Generated Content Consumption and AI-Native Tools / Royal Academy follow as 03–05. The latter two have honest details/imagery placeholders rather than duplicating the Discover story. The existing Discover desktop screenshot belongs to its dark first-project cover; the light second panel is titled “A daily brief made just for you.” and presents the approved consumer/desktop app/One Copilot description beside the actual requested Figma design. This replaces the orange prototype placeholder and its obsolete pending status. It is an honest static design, not a fake running prototype; its link opens the original full-resolution image for native browser zoom, including on mobile. Tab 2 retains its original four projects, index, placeholders and desktop/mobile Discover gallery.

Edge Discover has a native, user-controlled video followed by the authorized Problem / Approach / Outcome narrative: closing the revenue gap while changing the business model; a linear feed with a personalized left section; an 11% increase in engagement and a closed revenue gap. No financial delta, baseline, methodology or time range is invented.

Directly after the personalized-brief presentation, one visuals-only Daily Brief slide remains inside the Copilot Discover case study. It presents all three actual 393×852 screens together in source order: Welcome, Feed and Your agents. There is no surrounding heading, narrative or caption; original UI text remains within the mocks. Desktop shows all three aligned side by side, never larger than native size. At 1000px and below, the same three complete screens form a keyboard-focusable, touch-scrollable horizontal group. No alternate mock, invented device bezel, rounded crop, automatic carousel or fake controls are added. The existing deep link `#daily-brief-title` targets the labeled section.

The human-centered, adaptable and trusted design principles are woven into the existing three body paragraphs beside the creator-led design under “A daily brief made just for you.” The prose retains the desktop app/One Copilot scope, personalization, publishers/AI-curated sources and generative UI augments, while explaining human voices, clear provenance, adaptation and trust as design intent rather than new measured outcomes. The rejected standalone burgundy section, extra heading and three-column principle layout are removed completely. The phone gallery stays visuals-only and flows directly into Edge.

The About biography is preserved apart from the requested current-role sentence and the authorized entrepreneur/fundraising history, which matches the opening excerpt. The original's four user-supplied Content Intelligence figures are 300 million daily desktop users, 50 million mobile users, $1.4 billion annual revenue and 4,000 publishers. They describe ecosystem scale, not attributable personal outcomes. The user expressly confirmed the historical claim: “Leading the largest transformation of MSN in its 20-year history.” It refers to MSN, not the age of the Content Intelligence team. Tab 2 retains its previous biography, narrative and two MSN metrics.

Project numbers use one shared left rail; later headings and media align on the neighboring content rail. The Discover cover uses a wider screenshot for legibility. The hero introduction aligns with the name. The second section places the Microsoft AI heading, a readable single Content Intelligence paragraph elaborating the MSN transformation, and four scale figures over the supplied clip, with a contrast overlay. Redundant under-image source/design-preview captions are removed; descriptive alt text and honest missing-media status remain.

Parallax moves the opening illustration relative to stationary typography, followed by the landscape backdrop, About portrait and a few media frames. A bounded overlap and scroll-linked image fade blend the opening into the second scene without fading readable text or trapping scroll. A static bottom gradient blends that scene into the following dark Discover cover without adding a band or obscuring media controls. The supplied landscape clip replaces the former CSS wind simulation; no hover animation remains. It plays once, muted, when at least half the scene becomes visible, then freezes within four seconds. It never loops or repeats automatically. Offscreen/hidden-document state can end it earlier; blocked autoplay reports the still fallback, while media failure explicitly reports the problem.

All custom motion/pause widgets have been removed from the original. System reduced motion disables overlap/fades/parallax, skips background-video downloading/playback and shows the still. Edge playback remains a deliberate user action with standard native controls, including without JavaScript. Tab 2 retains its previous portrait/backdrop motion and original footer toggle.

The three opening credentials have matched 64×40 symbol/logo footprints and deliberately two-line labels: AIGA50 DC / Award winner; Featured / Designer beside MoMA; Work published / in beside genuine press logos. Desktop labels share font size, line height and baseline; mobile uses three compact symbol-above-label columns. The press slot uses actual TODAY and Fast Company assets and links from the original portfolio's Select Press Features section. Transparent margins were trimmed and the images resized to 320px, without redrawing the marks. It makes one brief crossfade after 2.5 seconds and then stops, with no custom Pause UI or indefinite animation. Logo hover/keyboard focus, offscreen state and hidden-document state defer that one transition; reduced motion/no JavaScript show a static linked logo. Tab 2 keeps its previous Follies wording and no press slot.

## Media

Local media are in `public/media/`. The exact attached landscape clip is `content-intelligence.mp4` (1280×720, 10.005 seconds, approximately 2.3MB); it was inspected as decoded frames and copied without alteration. Its decorative playback is limited to four seconds and always muted. `work-landscape.jpg` (2000×1125), the earlier inspected text-free Figma image, remains the poster and fallback.

`discover-edge.mp4` is a web-optimized 1920×1080 derivative of the user's complete 3840×2160 clip. Native AVFoundation export preserves its full 23.3667-second duration and reduces 111,450,068 bytes to 27,891,187 bytes, safely below GitHub's 100MiB per-file limit. The huge original is not added to Git. `discover-edge-poster.jpg` is a genuine decoded frame. The native player has no autoplay, starts muted, uses `preload="none"` and pauses if offscreen or the document is hidden. The preview server responds to byte-range requests with HTTP 206; deployment must preserve normal MP4 range support.

The original About uses the exact user-supplied [Follies photo](https://www.playfollies.com/cdn/shop/files/146A5215_websize.jpg?v=1695412046&width=1500), stored as `chloe-follies.jpg` (1500×1000). Tab 2 keeps the original website portrait. Project screenshots come from the supplied Figma nodes. The opening artwork is `editorial-flowers.svg`, exported from mask group `704:67858` in `X6HJ8CzCbnnVsPd82jHHwK`; the requested node `704:67859` is its mask rectangle, not the complete illustration.

No AIX brandbook logos, proprietary font files or brandbook copy are reused. The requested press logos come from the user's existing portfolio, not the brandbook. The latest editorial reference, `X6HJ8CzCbnnVsPd82jHHwK` node `632:39120`, actually uses Georgia Regular, not Bradford: 128px, 90% line height, zero tracking and left alignment. The original nameplate uses system Georgia with that weight, leading and tracking, sized responsively. The larger adjacent flower, staggered name and shared lower edge follow the supplied compact masthead screenshot. All original serif details share Georgia, including section numerals, mixed heading accents, the Content Intelligence label and metric suffixes. Body text and captions remain open-source DM Sans. Tab 2 retains its system Georgia/Arial/monospace typography, palette and authored CSS light backdrop.

The original palette is sampled from the unchanged floral SVG: coral `#ff5c39`, stem sage `#aebd80`, peach `#ffa38b` and inner-petal rust `#b94a2b`. Sage colors the tools section, dark-canvas link accents and progress indicator. Dark ink on coral has 5.57:1 contrast, and on sage 8.19:1. Rust focus outlines have 4.72:1 against paper and 3.32:1 against the opening. Pale mint is not used as body text. The second-scene overlay guarantees readable light text, including on mobile.

The supplied election MP4 has been retained locally for a later media pass, but is not embedded in this screenshot-first version. It is a regular video file, not a base64 payload.

## Reference mapping

The corrected Daily Brief reference is `voFVxFCJH528ss63gDWBpi` node `3:21484`, an opacity-zero metadata layer inside Welcome screen `3:21461`. Its enclosing board `3:21460` was reinspected and contains exactly the requested related trio: “Original Welcome · small logo only,” “Feed · identity + one line only” and “Your agents · cardless / interactive.” All three assets are lossless 393×852 crops of the same inspected 1390×1012 board render, starting at (0, 140), (463, 140) and (926, 140); pixel comparison verifies each crop against the source. Full screen framing, zero corner radius and native navigation are preserved. Board notes and presentation labels are omitted. The older `discover-feed.png` and `discover-mobile-feed.png` substitutions are not rendered in this section.

The current replacement design is `voFVxFCJH528ss63gDWBpi` node `16:104702`, “Page,” inspected as a screenshot and full layer tree. It replaces the entire earlier Thursday/September 8 mock, not an article image within it. Its unchanged export is `discover-personalized-brief.png` (1128×1605, including the frame's rendered edge/shadow; the Figma page is 1122×1599). The creator-led design shows Zahra Bello's profile, publisher attribution, Support this voice/Follow actions, topic chips, the three-column mixed-media feed and an “Ask about any story” composer. Original framing is preserved without cropping, added rounding or simulated working controls. The surrounding presentation still has the title “A daily brief made just for you.”, stacks at 1000px and below, and retains a full-size image link for reading fine details on smaller screens. Its section background matches the current Page and Feed solid fill exactly: `#f6f5f3` (RGB 246, 245, 243), not the internal white cards or the older site paper. The mock export was refreshed with the same updated fill; other sections and `/2/` retain their existing colors.

The frames in `voFVxFCJH528ss63gDWBpi` were reinspected for the Discover story: `2:18424` is an almost-empty `#1e1b1b` canvas, adapted into its readable dark screenshot cover; `1:12046` supplied the `#fefdfa` background and narrow left description rail for the consumer story. Its former orange panel is now replaced by the user-requested design above. Proprietary Verdana Pro AIX/Ionic MT Std text is adapted with existing DM Sans/Georgia, not downloaded font binaries. No brandbook labels or prose are copied. The earlier `1:11966` supplied the second scene's still landscape. The `The Edit` screenshot continues to guide the opening's optical composition.

Responsive adaptation keeps text in normal flow and stacks the Discover description and full-frame design on narrow screens. Later projects retain their streamlined layouts, unified Georgia serifs and botanical accents. The original has no site header, reserved header offset, project index or opening circle-arrow CTA; its skip link, retained project IDs and footer links remain. Tab 2's previous header, opening link, index, projects and layout are reconstructed from inert templates before motion initializes.
