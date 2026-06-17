# Ani & Zviadi Wedding Invitation

A self-contained wedding invitation website with an animated envelope opening,
event details, dress code guidance, location link, and a client-side RSVP flow.

## Open locally

Open `index.html` directly in a browser, or serve the folder with any static file
server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## RSVP behavior

The RSVP form validates guest responses and saves the confirmation in the
visitor's browser with `localStorage`. To collect real submissions, connect the
form in `script.js` to your preferred backend, form service, or email workflow.
