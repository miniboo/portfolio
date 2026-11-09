# Chloe Varelidi portfolio

An editorial portfolio built with semantic HTML, CSS and a small JavaScript parallax controller. Vite serves and builds the site.

## Versions

The selected original editorial identity remains at `/`. Its opening pairs the authorized current-role sentence with the user-supplied entrepreneur history and the newly supplied Follies portrait, followed by a **Selected work** link. Both opening paragraphs share one responsive type size. A single, compact recognition block places the four AIGA50 DC awards and Follies' MoMA catalogue feature beneath the name. The large ring and square have been removed.

The second identity, tab **2**, remains at `/2/`: a warm, serif-led editorial composition informed by the supplied Microsoft AI Style Guide. It retains its previous introduction, original floral-dress portrait, biography, screenshot-only project compositions and appearance. Both routes use the same project titles and screenshot assets, with one portrait per route.

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

The four projects retain their agreed order. Every original project follows the same sequence: number/title, video, then a sparse dotted image composition with staggered screenshots and soft corners. The election section plays the supplied MP4 with native controls, inline playback, a poster and metadata-only preloading; it never autoplays. The other three videos are explicitly labeled, non-interactive placeholders. Copilot Content and AI-Native Tools / Royal Academy also retain honest imagery/copy placeholders. Election and Copilot Discover images are supplied screenshots, not live product demos. Interactive Discover builds and detailed project stories remain deferred.

The About biography is preserved apart from the requested current-role sentence and the authorized entrepreneur/fundraising history, which matches the opening excerpt. The alternative retains its previous biography. MSN audience/revenue figures describe ecosystem scale, not attributable project results.

Project numbers use one shared left rail; headings and video stages align on the neighboring content rail. The image mosaics use the wider section grid and collapse to readable staggered layouts on mobile. The hero introduction aligns with the name. The existing Selected work index uses the reference's vivid-green treatment; the existing footer uses its near-black sparse dots. No extra navigation or filler sections were added.

Parallax moves the portrait and a few media frames, not the readable content; the alternative also retains its layered light backdrop. It respects `prefers-reduced-motion`; a motion toggle is available in the footer. Without JavaScript, all content and anchor navigation remain available, with the single portrait in About.

## Media

Local images are in `public/media/`. The selected original portrait is the exact user-supplied [Follies image](https://www.playfollies.com/cdn/shop/files/146A5215_websize.jpg?v=1695412046&width=1500), stored locally as `chloe-follies.jpg` (1500×1000). Desktop uses a centered portrait crop; mobile shows the full landscape composition. Tab 2 keeps the original website portrait. Project screenshots come from the supplied Figma nodes. No logos, proprietary font files, text, photography or graphic assets from either identity guide are used.

The supplied election MP4 is a regular local video file, not a base64 payload. Captions/transcripts were not supplied.

## Original reference fidelity

The read-only layer audit of AIX file `bKC7mabxsm24F79QfwX54S` found:

| Reference node | Actual source style | Portfolio application |
| --- | --- | --- |
| `277:7106` | `#fefdfa` canvas, `#1e1b1b` text, Verdana Pro AIX Regular 44px/130%, Ionic MT Std Regular 16px/140%, 12px photo corners; 12-column/6-row grid with 70px margins and 56px gutters | Exact canvas/text colors and 12px media corners; responsive, staggered image grids with sparse CSS dots |
| `277:1695` | `#0bb44f` canvas; Verdana Pro AIX Regular 424.557px/110% display, Ionic MT Std 16px/140% body, Verdana Pro 14px/130% labels | Exact green, oversized left-aligned index title and four project links |
| `277:1672` | `#1e1b1b` canvas, `#fefdfa` Verdana Pro 14px/130% labels, pale sparse dot grid | Exact dark/light colors and an original CSS dot pattern in the existing footer |

The source's proprietary Verdana Pro AIX and Ionic MT Std fonts are **not bundled**. The original uses available system **Verdana/Geneva** and **Georgia/Times New Roman** as substitutes, not an exact font match; responsive sizes and spacing adapt the slide-based compositions to a website. No external font service is required. Tab 2 continues to use system Georgia, Arial and monospace with its unchanged palette and authored CSS light backdrop.
