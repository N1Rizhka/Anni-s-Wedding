# Ani &amp; Zviadi — Wedding Invitation

A romantic, interactive online wedding invitation with a **summer-chic** theme.
Guests are greeted by a sealed envelope; tapping the wax seal opens the flap, lifts
the letter, and reveals the full invitation and **RSVP** form.

> **Date:** Saturday, 5 September 2026 · 17:00
> **Venue:** Garden of Ilia, Davit Aghmashenebeli Avenue 73, Tbilisi, Georgia
> **Dress code:** Summer Chic — bright colors, elegant, joyful summer spirit

## Features

- ✉️ **Animated envelope** that opens on tap/click (keyboard accessible).
- 💌 Elegant invitation card with all the wedding details.
- 🎨 Visual **dress-code palette** so guests know the "summer chic" vibe.
- 📝 **RSVP form** with attendance, guest count, and a note to the couple.
- 🗓️ **Add to Calendar** (downloads an `.ics` file) and **View Map** buttons.
- ⏳ Live **countdown** to the big day.
- 🌸 Floating petals, florals, and responsive design (looks great on phones).
- ♿ Respects `prefers-reduced-motion`.

## Run it locally

It's a plain static site — no build step. Just open `index.html`, or serve it:

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
3. Replies will be delivered to the email tied to your Formspree form.

## Customizing

All content lives in `index.html`; colors and fonts are CSS variables at the top of
`styles.css`. Key things you may want to change:

| What | Where |
| --- | --- |
| Names, date, venue, dress code | `index.html` |
| Wedding date/time (countdown, calendar) | `WEDDING_DATE` in `script.js` |
| Color palette / fonts | `:root` in `styles.css` |
| Monogram on the wax seal | `.seal__monogram` text in `index.html` |
| Floral / decorative art | `assets/*.svg` |

> **Style references:** the task mentioned style references, but no images came
> through. The current design follows the "summer chic" brief (coral, peach, sunny
> gold, garden green, sky blue, blush) with a garden-floral motif. Share any
> reference images and the palette/decor can be matched precisely.

## Deploy

Upload the folder to any static host:

- **GitHub Pages:** push to a repo and enable Pages on the branch.
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the folder.

## Files

```
index.html      # markup: envelope, invitation, RSVP
styles.css      # summer-chic theme + envelope animation
script.js       # opening interaction, RSVP, countdown, calendar
assets/         # SVG florals, leaf, favicon
```
