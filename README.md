# Chloe Varelidi portfolio

A screenshot-first editorial portfolio built with semantic HTML, CSS and a small JavaScript parallax controller. Vite serves and builds the site.

## Versions

The selected original remains at `/`. Its first three page-like sections follow the user's confirmed link order: dark biography opening, warm-white/orange Microsoft AI introduction, then a flower-backed Selected work index. The compact, header-free opening pairs a Georgia editorial nameplate with the supplied botanical illustration directly beside it. The authorized leadership and entrepreneur paragraphs share one type size and a maximum 680px measure, followed by supporting AIGA50 DC/MoMA recognition and Selected work. Its height follows the content rather than adding a viewport-sized empty band. There is no opening portrait, ring, square or decorative dot grid. The latest Follies portrait appears once, in About.

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

The About biography is preserved apart from the requested current-role sentence and the authorized entrepreneur/fundraising history, which matches the opening excerpt. The alternative retains its previous biography. MSN audience/revenue figures describe ecosystem scale, not attributable project results.

Project numbers use one shared left rail; headings and media align on the neighboring content rail. The hero introduction aligns with the name. The second section pairs the existing MSN scale with its transformation statement in the reference's orange panel. The existing project index, not a second navigation list, occupies the third section. Captions identify the supplied screenshots, while missing content is labeled once per placeholder.

Parallax moves the opening illustration relative to its stationary typography, followed by the flower backdrop, About portrait and a few media frames; the alternative retains its previous hero portrait and layered light backdrop. Readable content does not move. The opening reserves space below the illustration for its bounded scroll movement. Motion respects `prefers-reduced-motion`; a motion toggle is available in the footer. Without JavaScript, all original content and anchor navigation remain available, with the single portrait in About.

## Media

Local images are in `public/media/`. The selected original uses the exact user-supplied [Follies photo](https://www.playfollies.com/cdn/shop/files/146A5215_websize.jpg?v=1695412046&width=1500), stored locally as `chloe-follies.jpg` (1500×1000). Tab 2 keeps the original website portrait. Project screenshots come from the supplied Figma nodes. The flower background is the inspected, text-free image fill from the supplied cover frame, exported separately from its labels and stored as `work-landscape.jpg` (2000×1125). A contrast overlay preserves readable navigation. The opening artwork is `editorial-flowers.svg`, exported from mask group `704:67858` in `X6HJ8CzCbnnVsPd82jHHwK`: the requested node `704:67859` is its mask rectangle, not the complete illustration.

No corporate logos, proprietary font files or brandbook copy are reused. The latest editorial reference, `X6HJ8CzCbnnVsPd82jHHwK` node `632:39120`, actually uses Georgia Regular, not Bradford: 128px, 90% line height, zero tracking and left alignment. The original nameplate and Selected work title use system Georgia with that weight, leading and tracking, sized responsively. The adjacent flower and stacked name follow the supplied compact masthead screenshot. All other original serif details share that same Georgia token, including section/index numerals, mixed heading accents, the orange panel's label and metric suffixes. Its warm source canvas is adapted to the user's retained dark opening and flower cover. Body text remains open-source DM Sans; Georgia replaces the earlier thin Instrument Serif without changing sans-serif captions or body copy. The earlier references' proprietary fonts are not exact matches. Tab 2 uses its unchanged system Georgia/Arial/monospace typography, palette and authored CSS light backdrop.

The supplied election MP4 has been retained locally for a later media pass, but is not embedded in this screenshot-first version. It is a regular video file, not a base64 payload.

## Opening reference mapping

The three new source frames in `voFVxFCJH528ss63gDWBpi` were inspected as screenshots and read-only layers before implementation. The user explicitly chose the exact link order rather than their top-to-bottom canvas order:

| Frame | Source evidence | Portfolio section |
| --- | --- | --- |
| `2:18424` | Flat `#1e1b1b` canvas; 44px Verdana Pro AIX heading and 16px Ionic subtitle are nearly the same color as the background | Dark name/bio opening, with accessible light text rather than reproducing invisible reference text |
| `1:12046` | `#fefdfa` canvas, narrow left column, large `#ff712e` statement panel with 12px corners, 150px/100% sans statement and small serif label | Microsoft AI heading and MSN scale at left, existing transformation statement in the orange panel |
| `1:11966` | Edge-to-edge flower/mountain image, 175px Bradford LL serif title, smaller sans body and mono labels | Flower-backed Selected work title and the existing four-link project index; no repeated name, lorem ipsum or slide metadata |

Responsive adaptation keeps text in normal flow and stacks the orange layout on mobile. Later project sections and the footer retain the restored pre-overhaul design, without decorative dot grids. The original has no rendered site header or reserved header offset; its skip link, Selected work CTA, project index and footer links remain. Tab 2's previous header, content and layout are reconstructed before the motion controller initializes.
