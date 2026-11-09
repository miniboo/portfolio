# Chloe Varelidi portfolio

A screenshot-first editorial portfolio built with semantic HTML, CSS and a small JavaScript parallax controller. Vite serves and builds the site.

## Versions

The selected original editorial identity remains at `/`. Its opening pairs the authorized current-role sentence with the user-supplied entrepreneur history and the selected Follies portrait, followed by a **Selected work** link. Both opening paragraphs share one responsive type size. A single, compact recognition block places the four AIGA50 DC awards and Follies' MoMA catalogue feature beneath the name. The large ring and square have been removed.

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

The four projects retain their agreed order. Copilot Content and AI-Native Tools / Royal Academy deliberately contain labeled placeholders. Election and Copilot Discover imagery are supplied design screenshots, not live product demos. Interactive Discover builds, detailed project stories and video presentation are deferred for the design-and-flow first pass.

The About biography is preserved apart from the requested current-role sentence and the authorized entrepreneur/fundraising history, which matches the opening excerpt. The alternative retains its previous biography. MSN audience/revenue figures describe ecosystem scale, not attributable project results.

Project numbers use one shared left rail; headings and media align on the neighboring content rail. The hero introduction aligns with the name. Captions identify the supplied screenshots, while missing content is labeled once per placeholder.

Parallax moves the portrait and a few media frames, not the readable content; the alternative also retains its layered light backdrop. It respects `prefers-reduced-motion`; a motion toggle is available in the footer. Without JavaScript, all content and anchor navigation remain available, with the single portrait in About.

## Media

Local images are in `public/media/`. The selected original uses the exact user-supplied [Follies photo](https://www.playfollies.com/cdn/shop/files/146A5215_websize.jpg?v=1695412046&width=1500), stored locally as `chloe-follies.jpg` (1500×1000). Tab 2 keeps the original website portrait. Project screenshots come from the supplied Figma nodes. No logos, proprietary font files, text, photography or graphic assets from either identity guide are used. The original uses the open-source DM Sans and Instrument Serif fonts with system fallbacks. Tab 2 uses system Georgia and Arial, the new guide's documented fallback typefaces, with system monospace for small labels. Its light backdrop is authored in CSS rather than exported from the restricted guide.

The latest font/color, green-index and video-first mosaic overhaul has been reverted. The original again uses its earlier warm off-white/near-black backgrounds, streamlined screenshot layouts and plain footer; the accepted biography, recognition and new photo remain.

The supplied election MP4 has been retained locally for a later media pass, but is not embedded in this screenshot-first version. It is a regular video file, not a base64 payload.
