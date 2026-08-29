# Portfolio — Dora Cvetković

Static portfolio site. No framework, no build step, no CDN: plain HTML, CSS and
JavaScript. Open `index.html` in a browser and it works — from disk or from a server.

## Structure

```
index.html            all markup, one page
css/tokens.css        colours, type scale, spacing, motion — change the look here
css/base.css          reset, @font-face, base typography, a11y utilities
css/layout.css        container, header, hero, grid, footer, mobile nav
css/components.css    buttons, chips, cards, lightbox, list blocks
js/data.js            ALL content: projects, education, experience, skills, links
js/i18n.js            HR/EN strings and the locale switcher
js/work.js            renders the grid, the filter and the About lists
js/lightbox.js        project viewer (keyboard accessible)
js/main.js            boot, mobile nav, sticky header, scroll reveal
assets/work/          project imagery (currently SVG placeholders)
assets/fonts/         self-hosted Fraunces + Inter (woff2, latin + latin-ext)
assets/cv/            the downloadable CV
```

## Adding a real project

1. Drop the images into `assets/work/`. **Use descriptive, lowercase, hyphenated
   filenames** — `agromativ-vizualni-identitet-01.jpg`, never `IMG_2841.jpg`.
   Search engines and AI crawlers read the filename and the alt text; that is all
   they can see of a picture.
2. Open `js/data.js` and copy one of the objects in `projects`. Fill in:

   | field      | notes                                                      |
   |------------|------------------------------------------------------------|
   | `id`       | unique, lowercase, hyphenated                              |
   | `category` | one of the ids in `SITE.categories`                        |
   | `ratio`    | CSS aspect ratio for the card, e.g. `"4 / 5"`              |
   | `cover`    | path to the card image                                     |
   | `images`   | the gallery shown in the lightbox                          |
   | `placeholder` | **delete this line** on real projects                   |

3. Every visible string is `{ hr: "...", en: "..." }`. Fill in both — Croatian is
   the source of truth, English sits next to it.
4. Reload. Nothing else to touch.

To add a new category, add an entry to `SITE.categories` and use its `id` on projects.

## Adding profile links

`SITE.links` in `js/data.js`. Entries with an empty `href` are not rendered, so
fill in the ones that exist and delete the rest.

## Editing the interface text

`js/i18n.js` — one flat table per locale. Markup carries the Croatian copy as its
literal content, so the page reads correctly even before JavaScript runs.

## Fonts

Fraunces (display, 600) and Inter (body, 400/500) are committed as woff2, split
into `latin` and `latin-ext` subsets. **latin-ext is what carries č ć ž š đ** — do
not drop it. To change typefaces, replace the files and the `@font-face` blocks in
`css/base.css`, and the `--f-display` / `--f-body` tokens.

## Deploying (Vercel)

It is a plain static directory — no config file needed. Point Vercel at the repo
with no framework preset, no build command, and the repo root as the output
directory. Everything uses relative paths, so it works at any base path.

## Notes

- `assets/cv/dora-cvetkovic-cv.pdf` is the CV exactly as supplied and **contains a
  phone number**, which becomes publicly downloadable once deployed. The page
  itself deliberately shows only the email. To remove it, replace that one file
  with a phone-free export — no code change needed.
- Placeholder markers: cards with `placeholder: true` get a dashed outline, and
  `assets/work/placeholder-*.svg` are obviously synthetic. Both disappear as real
  projects replace them.

## Tests

```
npm install     # once — jsdom, the only devDependency
npm test        # content checks, then behaviour checks
npm run serve   # http://localhost:4321
```

- `test/content.test.js` — plain Node, no dependencies. Verifies every i18n key
  resolves in **both** languages, every referenced file exists, every project has
  a valid category and complete hr/en text, no image is over budget, and nothing
  loads from an external host. **Run this after adding a project.**
- `test/dom.test.js` — loads the page in jsdom and drives it: rendering, the
  language toggle, the filter, the lightbox (keyboard included), the mobile nav
  and accessibility basics.

## Image budget

There is no build step, so nothing resizes your exports for you. The tests fail
if you go over:

| what        | max width | format          | budget  |
|-------------|-----------|-----------------|---------|
| card cover  | 1600 px   | WebP or JPEG ~80% | 300 KB |
| gallery image | 2000 px | WebP or JPEG ~80% | 800 KB |

Export from Illustrator/Photoshop with *Export As → WebP* (or *Save for Web →
JPEG*). Full-resolution masters do not belong in this repo.

## Still to do

- [ ] **Approve or rewrite the copy.** The hero and About paragraphs are drafted
      from the CV but not written by Dora, and they make claims the CV does not
      literally make. They are placeholders for her own words. Text lives in
      `js/i18n.js` under `hero.*` and `about.*`.
- [ ] Real projects in `js/data.js`, replacing the six placeholders.
- [ ] A portrait at `assets/img/`, replacing `portrait-placeholder.svg`.
- [ ] Profile URLs in `SITE.links`.
- [ ] An `og:image` — **PNG or JPEG, 1200×630**. SVG does not work; no social
      platform renders it. Best made from a real project shot. Once it exists,
      add the meta tag back and set `twitter:card` to `summary_large_image`.
- [ ] Once the domain is known: `<link rel="canonical">`, `robots.txt` and
      `sitemap.xml`. Deliberately omitted for now — a wrong canonical URL is
      worse than none.
- [ ] Enable **Vercel Web Analytics** in the project dashboard. It is cookieless,
      so no consent banner is needed and nothing has to change in the code.

## Deliberate omissions

- **No English URL.** The language toggle is client-side only, so search engines
  index the Croatian text and there is no `?lang=en` link to share. Accepted:
  the audience is the Zagreb market and the toggle is a courtesy for visitors.
- **No case-study structure.** Projects are cover + gallery + one-line summary.
  Logos, packaging and social visuals read at a glance and do not need a
  process narrative.
- **Hobbies, volunteering, the piano schooling and the art prize** are in the CV
  PDF only, to keep the page strictly about design capability.
