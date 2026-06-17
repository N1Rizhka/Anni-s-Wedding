# Ani &amp; Zviadi — Wedding Invitation

An elegant, interactive online wedding invitation in a mature **emerald &amp; gold**
palette. Guests meet a deep forest-green envelope with gold **A** and **Z**
medallions and a cream card peeking out. They **slide the card out** (drag it, or
press <kbd>Enter</kbd> / <kbd>Space</kbd>) to reveal the full invitation and **RSVP**.

> **Date:** Saturday, 5 September 2026 · 17:00
> **Venue:** Garden of Ilia, Davit Aghmashenebeli Avenue 73, Tbilisi, Georgia
> **Dress code:** Summer Chic — bright colours, elegant, joyful summer spirit

## Features

- ✉️ **Forest-green envelope** with gold initial medallions, short love phrases,
  and subtle paw &amp; flourish motifs (matching the reference card).
- 🎴 **Slide-to-open** cream card — drag it out manually (mouse/touch) or press
  <kbd>Enter</kbd> / <kbd>Space</kbd>; it snaps back if you don't pull far enough.
- 💌 Luxurious invitation card with a gold monogram crest, calligraphy names, a
  gold ornamental divider, and elegant detail columns with gold line icons.
- 📝 **RSVP form** (attendance, guest count, note) on a rich green panel.
- 🗓️ **Add to Calendar** (`.ics`) and **View Map** buttons; live **countdown**.
- ✨ Subtle floating gold dust, fully responsive, and `prefers-reduced-motion` aware.

## Run it locally

It's a plain static site — no build step. Open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Collecting RSVPs

By default, submitting the RSVP opens the guest's email app with a pre-filled
message to the couple (and saves a local copy in the browser). To collect replies
automatically instead:

1. Create a free form at [formspree.io](https://formspree.io) and copy its endpoint
   (e.g. `https://formspree.io/f/abcdwxyz`).
2. Open `script.js` and set:
   ```js
   var FORMSPREE_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   var COUPLE_EMAIL = "you@example.com"; // used for the email fallback
   ```

## Customizing

All content lives in `index.html`; colours and fonts are CSS variables at the top of
`styles.css`.

| What | Where |
| --- | --- |
| Names, date, venue, dress code | `index.html` |
| Initials in the medallions (`A` / `Z`) | `.medallion__letter` in `index.html` |
| Love phrases on the envelope | `.phrase--a` / `.phrase--z` in `index.html` |
| Wedding date/time (countdown, calendar) | `WEDDING_DATE` in `script.js` |
| Colour palette / fonts | `:root` in `styles.css` |
| How far the card slides / open threshold | `recalc()` in `script.js` |
| Decorative art (icons, flourishes, paw) | `assets/*.svg` |

## Deploy

Upload the folder to any static host:

- **GitHub Pages:** push to a repo and enable Pages on the branch.
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the folder.

## Files

```
index.html      # cover envelope, slide-out card, invitation, RSVP
styles.css      # emerald & gold theme + slide mechanics
script.js       # slide/drag interaction, RSVP, countdown, calendar
assets/         # gold SVG icons, flourishes, paw, favicon
```
