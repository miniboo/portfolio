# Chloe Varelidi portfolio

A screenshot-first editorial portfolio built with semantic HTML, CSS and a small JavaScript parallax controller. Vite serves and builds the site.

## Versions

The original editorial identity remains at `/`. The second identity, tab **2**, is at `/2/`: a warm, serif-led editorial composition informed by the supplied Microsoft AI Style Guide. It replaces the earlier dot-grid mosaic with cream and earthy tonal fields, fine rules, small monospaced labels and an original CSS light-and-shadow backdrop. Both routes share the same content and project assets; the alternative moves the existing portrait into its hero without duplicating any text or images.

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

The About biography is preserved apart from the requested current-role sentence. MSN audience/revenue figures describe ecosystem scale, not attributable project results.

Project numbers use one shared left rail; headings and media align on the neighboring content rail. The hero introduction aligns with the name. Captions identify the supplied screenshots, while missing content is labeled once per placeholder.

Parallax moves the hero accent and a few media frames, not the readable content. It respects `prefers-reduced-motion`; a motion toggle is available in the footer. Without JavaScript, all content and anchor navigation remain available.

## Media

Local images are in `public/media/`. Chloe's actual portrait comes from her existing website; project screenshots come from the supplied Figma nodes. No logos, proprietary font files, text, photography or graphic assets from either identity guide are used. The original uses the open-source DM Sans and Instrument Serif fonts with system fallbacks. Tab 2 uses system Georgia and Arial, the new guide's documented fallback typefaces, with system monospace for small labels. Its light backdrop is authored in CSS rather than exported from the restricted guide.

The supplied election MP4 has been retained locally for a later media pass, but is not embedded in this screenshot-first version. It is a regular video file, not a base64 payload.
