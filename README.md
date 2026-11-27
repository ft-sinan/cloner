# monsoon.exe

A hand-coded Y2K personal homepage — live (soon) at **[sinaan.neocities.org](https://sinaan.neocities.org)** on [Neocities](https://neocities.org).

Five pages, one stylesheet, one small JavaScript file, zero dependencies, zero trackers.
Everything you see in `site/` is what gets uploaded; there is no build step.

```
site/
├── index.html          the front door (hero, updates, button wall, guestbook preview)
├── journal.html        7 "field notes" — long-form writing with photos
├── shrines.html        4 shrines: tea, frogs, lo-fi machines, the old web
├── guestbook.html      the guestbook + a working (local) sign form
├── about.html          about me, the manifesto, 16 curated links, colophon
├── 404.html            a friendly lost page
├── style.css           the whole design system (~30 kb)
├── js/main.js          rain canvas, typewriter, guestbook, poll, mixer, settings
├── fonts/              self-hosted woff2 (SIL OFL 1.1, licences included)
├── img/                banner, mascot, photos, 16 × 88×31 buttons, thumbnails
├── robots.txt          politely tells AI crawlers to go away
└── sitemap.xml
```

## Publish it to Neocities

1. Create a Neocities account — your username becomes `https://USERNAME.neocities.org`.
2. Go to **<https://neocities.org/settings>**, pick your site, click **API key → create**, copy it.
3. Point the site's own links (buttons, sitemap, canonical URLs) at your username:

   ```bash
   ./deploy/set-sitename.sh sinaan   # already done; run it again if the username changes
   ```

4. From this repo:

   ```bash
   NEOCITIES_API_KEY=your_key_here ./deploy/deploy.sh
   ```

   The script checks the key, lists what is already on the server, uploads **only changed
   files** in small batches (with a pause, per Neocities' "be a good neighbour" guidance),
   and prints your live URL. Add `--dry-run` to preview, `--prune` to delete remote files
   that no longer exist locally.

   Prefer the official Ruby CLI? `gem install neocities && NEOCITIES_API_KEY=... neocities push site`.

> The API key is a password for your site files: keep it out of the repo, out of chat, and
> pass it through the environment (or `--api-key`, which stays out of `.bash_history` only if
> you prefix the command with a space). If `deploy.sh` cannot reach `neocities.org` from a
> sandboxed machine, upload `site/` with the web editor or drag-and-drop instead — the folder
> is already exactly what should be on the server.

There is nothing to configure — the site is fully static. Neocities cannot run server code,
but none of the interactive bits need a server (see below).

## Preview locally

```bash
python3 -m http.server 8080 --directory site
# then open http://localhost:8080
```

Opening `site/index.html` directly from the filesystem also works.

## What's interactive (and how honest it is)

| Feature | How it works | Needs a server? |
|---|---|---|
| Rain on the hero, sparkle cursor trail | `<canvas>` + `requestAnimationFrame` | no |
| Typewriter welcome line | vanilla JS | no |
| Visitor counter + settings + poll votes | `localStorage` (this browser only) | no |
| Guestbook entries you sign | `localStorage`; 4 seed entries ship with the page | no |
| "Rain sound" ambience | **synthesized live** with the Web Audio API — no audio files | no |
| Buttons, marquees, CRT scanlines, chrome UI | pure CSS | no |
| Keyboard: `R` rain, `S` scanlines | JS key handler + persisted settings | no |

The guestbook is deliberately a *local* guestbook: a static host has no database, so nothing
you type is transmitted anywhere. If you want real, shared entries, the cheapest honest route
is a form-to-email/form-to-Google-Sheet endpoint (Formspree, Basin, a Cloudflare Worker) —
swap the `initGuestbook()` submit handler and keep everything else.

## Accessibility & performance notes

- Semantic landmarks, skip link, real heading order, visible focus rings.
- Every image has `alt` text (decorative ones are `alt=""`).
- `prefers-reduced-motion` turns off rain, sparkles, tickers and blinking.
- A settings panel (bottom right) with manual switches for rain / scanlines / sparkles.
- No web fonts from third parties (self-hosted woff2), no analytics, no iframes, no embeds.
- Total page weight of the home page: **≈ 1.2 MB**, most of it the banner image; HTML+CSS+JS
  together are under 100 kb.

## Credits

- Typefaces: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P),
  [VT323](https://fonts.google.com/specimen/VT323),
  [Courier Prime](https://fonts.google.com/specimen/Courier+Prime) — all SIL OFL 1.1,
  licences in `site/fonts/licenses/`.
- 88×31 buttons, banner, thumbnails: generated for this project (ImageMagick + AI-assisted art,
  then hand-tuned), no third-party assets.
- Hosting: [Neocities](https://neocities.org) — no ads, no AI data selling, static only.
- This is a fan-made tribute site. "Neocities" is used descriptively; it is not affiliated.
