/* ============================================================
   Ani & Zviadi — Wedding Invitation · interactions
   ============================================================ */

(function () {
  "use strict";

  /* -------- CONFIG -------------------------------------------------
     To collect RSVPs by email, create a free form at https://formspree.io
     and paste the endpoint URL below (e.g. "https://formspree.io/f/abcdwxyz").
     If left empty, the form falls back to opening the guest's email client.
  ------------------------------------------------------------------ */
  var FORMSPREE_ENDPOINT = "";
  var COUPLE_EMAIL = "ani.and.zviadi@example.com";
  var WEDDING_DATE = new Date("2026-09-05T17:00:00+04:00"); // Tbilisi time (GMT+4)

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================
     1. Gold dust
  ===================================================== */
  (function dust() {
    var layer = $(".dust");
    if (!layer || reduceMotion) return;
    var COUNT = 10;
    for (var i = 0; i < COUNT; i++) {
      var m = document.createElement("span");
      m.className = "mote";
      m.style.left = Math.random() * 100 + "vw";
      var size = 3 + Math.random() * 5;
      m.style.width = size + "px";
      m.style.height = size + "px";
      m.style.animationDuration = (12 + Math.random() * 10) + "s";
      m.style.animationDelay = (-Math.random() * 16) + "s";
      m.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
      layer.appendChild(m);
    }
  })();

  /* =====================================================
     2. Envelope — slide-out card
  ===================================================== */
  var envelope = $("#envelope");
  var slip = $("#slip");
  var cover = $("#cover");
  var invitation = $("#invitation");

  var opened = false;
  var currentPull = 0;
  var maxPull = 0;
  var openThreshold = 0;

  function recalc() {
    if (!envelope) return;
    var w = envelope.offsetWidth;
    maxPull = w * 0.62;       // how far the card travels when fully opened
    openThreshold = w * 0.22; // drag past this and it springs open
  }
  recalc();
  window.addEventListener("resize", recalc);

  function setPull(px) {
    currentPull = px;
    if (slip) slip.style.setProperty("--pull", px + "px");
  }

  function openInvitation() {
    if (opened) return;
    opened = true;
    if (slip) slip.classList.remove("dragging");
    envelope.classList.add("is-open");
    setPull(maxPull);

    window.setTimeout(function () { cover.classList.add("is-open"); }, 650);
    window.setTimeout(function () {
      cover.style.display = "none";
      invitation.classList.add("is-visible");
      invitation.setAttribute("aria-hidden", "false");
      revealOnScroll();
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 1350);
  }

  if (envelope) {
    /* keyboard */
    envelope.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvitation(); }
    });

    /* pointer drag */
    var dragging = false, startX = 0, base = 0, moved = 0;

    var onDown = function (e) {
      if (opened) return;
      dragging = true;
      moved = 0;
      startX = e.clientX;
      base = currentPull;
      if (slip) slip.classList.add("dragging");
      if (envelope.setPointerCapture && e.pointerId != null) {
        try { envelope.setPointerCapture(e.pointerId); } catch (err) {}
      }
    };

    var onMove = function (e) {
      if (!dragging || opened) return;
      var d = e.clientX - startX;
      moved = Math.max(moved, Math.abs(d));
      var next = Math.max(0, Math.min(maxPull, base + d));
      setPull(next);
    };

    var onUp = function () {
      if (!dragging) return;
      dragging = false;
      if (slip) slip.classList.remove("dragging");
      if (moved < 8) { openInvitation(); return; }          // treat as a tap
      if (currentPull >= openThreshold) { openInvitation(); } // pulled far enough
      else { setPull(0); }                                    // snap back
    };

    if (window.PointerEvent) {
      envelope.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    } else {
      envelope.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      envelope.addEventListener("touchstart", function (e) { onDown(e.touches[0]); }, { passive: true });
      window.addEventListener("touchmove", function (e) { onMove(e.touches[0]); }, { passive: true });
      window.addEventListener("touchend", onUp);
    }
  }

  /* =====================================================
     3. Reveal-on-scroll
  ===================================================== */
  function revealOnScroll() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* =====================================================
     4. Countdown
  ===================================================== */
  (function countdown() {
    var el = $("#countdown");
    if (!el) return;
    function tick() {
      var diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) { el.textContent = "Today we celebrate — with all our love."; return; }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      el.textContent = days + " days · " + hours + " hours until we say \u201CI do\u201D";
    }
    tick();
    window.setInterval(tick, 60000);
  })();

  /* =====================================================
     5. Add to Calendar (.ics download)
  ===================================================== */
  (function calendar() {
    var btn = $("#calendarBtn");
    if (!btn) return;
    function fmt(d) { return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; }
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var end = new Date(WEDDING_DATE.getTime() + 5 * 3600000);
      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AniZviadi//Wedding//EN",
        "BEGIN:VEVENT",
        "UID:" + Date.now() + "@ani-zviadi-wedding",
        "DTSTAMP:" + fmt(new Date()),
        "DTSTART:" + fmt(WEDDING_DATE),
        "DTEND:" + fmt(end),
        "SUMMARY:Wedding of Ani & Zviadi",
        "DESCRIPTION:Join us to celebrate the wedding of Ani & Zviadi. Dress code: Summer Chic.",
        "LOCATION:Garden of Ilia, Davit Aghmashenebeli Avenue 73, Tbilisi, Georgia",
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      var blob = new Blob([ics], { type: "text/calendar" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "Ani-and-Zviadi-Wedding.ics";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  })();

  /* =====================================================
     6. RSVP form
  ===================================================== */
  (function rsvp() {
    var form = $("#rsvpForm");
    if (!form) return;
    var note = $("#rsvpNote");
    var thankYou = $("#thankYou");
    var thankYouTitle = $("#thankYouTitle");
    var thankYouMsg = $("#thankYouMsg");
    var guestsField = $(".field--guests");
    var editBtn = $("#editRsvp");

    form.addEventListener("change", function (e) {
      if (e.target.name === "attending") {
        var declining = e.target.value.indexOf("declines") !== -1;
        guestsField.classList.toggle("is-hidden", declining);
      }
    });

    function setNote(msg, type) {
      note.textContent = msg || "";
      note.className = "rsvp__note" + (type ? " is-" + type : "");
    }

    function showThankYou(data) {
      form.hidden = true;
      var attending = data.attending && data.attending.indexOf("declines") === -1;
      thankYouTitle.textContent = attending ? "We can't wait to see you" : "You'll be missed";
      var g = parseInt(data.guests, 10) || 1;
      thankYouMsg.textContent = attending
        ? "Thank you, " + data.name + ". Your place" + (g > 1 ? "s are" : " is") +
          " reserved for " + g + " guest" + (g > 1 ? "s" : "") + ". See you on 5 September."
        : "Thank you for letting us know, " + data.name + ". We'll miss you — sending love your way.";
      thankYou.hidden = false;
      thankYou.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (editBtn) {
      editBtn.addEventListener("click", function () {
        thankYou.hidden = true; form.hidden = false; setNote("", null);
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setNote("", null);
      var fd = new FormData(form);
      var data = {
        name: (fd.get("name") || "").trim(),
        contact: (fd.get("contact") || "").trim(),
        attending: fd.get("attending"),
        guests: fd.get("guests"),
        message: (fd.get("message") || "").trim()
      };
      if (!data.name) { setNote("Please enter your name.", "error"); return; }
      if (!data.contact) { setNote("Please add an email or phone so we can reach you.", "error"); return; }
      if (!data.attending) { setNote("Please let us know if you can attend.", "error"); return; }

      try { localStorage.setItem("rsvp:ani-zviadi", JSON.stringify({ when: Date.now(), data: data })); } catch (err) {}

      if (FORMSPREE_ENDPOINT) {
        setNote("Sending your RSVP…", "info");
        var btn = $('button[type="submit"]', form);
        if (btn) btn.disabled = true;
        fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: fd })
          .then(function (res) { if (res.ok) { showThankYou(data); } else { throw new Error("bad"); } })
          .catch(function () { setNote("Something went wrong. Please try the email option below.", "error"); emailFallback(data); })
          .finally(function () { if (btn) btn.disabled = false; });
        return;
      }

      emailFallback(data);
      showThankYou(data);
    });

    function emailFallback(data) {
      var subject = "Wedding RSVP — " + data.name;
      var body =
        "Name: " + data.name + "\n" +
        "Contact: " + data.contact + "\n" +
        "Attending: " + data.attending + "\n" +
        "Guests: " + (data.guests || 1) + "\n" +
        "Message: " + (data.message || "—");
      var href = "mailto:" + COUPLE_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var a = document.createElement("a");
      a.href = href; a.target = "_blank";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
  })();
})();
