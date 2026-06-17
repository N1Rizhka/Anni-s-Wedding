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
  var COUPLE_EMAIL = "ani.and.zviadi@example.com"; // used for the mailto fallback
  var WEDDING_DATE = new Date("2026-09-05T17:00:00+04:00"); // Tbilisi time (GMT+4)

  /* ---------- helpers ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };

  /* =====================================================
     1. Floating petals
  ===================================================== */
  (function petals() {
    var layer = $(".petals");
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var colors = ["#e26d5a", "#f3a683", "#f6c453", "#7fa05b", "#6cb2c4", "#d98ca7"];
    var COUNT = 14;
    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.setProperty("--c", colors[i % colors.length]);
      var size = 8 + Math.random() * 12;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.animationDuration = (9 + Math.random() * 9) + "s";
      p.style.animationDelay = (-Math.random() * 12) + "s";
      p.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
      layer.appendChild(p);
    }
  })();

  /* =====================================================
     2. Envelope opening
  ===================================================== */
  var envelope = $("#envelope");
  var cover = $("#cover");
  var invitation = $("#invitation");
  var opened = false;

  function openInvitation() {
    if (opened) return;
    opened = true;

    envelope.classList.add("is-open");

    // After the letter has lifted, fade out the cover and reveal the card.
    window.setTimeout(function () {
      cover.classList.add("is-open");
    }, 1500);

    window.setTimeout(function () {
      cover.style.display = "none";
      invitation.classList.add("is-visible");
      invitation.setAttribute("aria-hidden", "false");
      revealOnScroll();
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 2300);
  }

  if (envelope) {
    envelope.addEventListener("click", openInvitation);
    envelope.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvitation(); }
    });
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
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
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
      if (diff <= 0) { el.textContent = "Today is the day — we can't wait to celebrate with you! ♥"; return; }
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
    function fmt(d) {
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var end = new Date(WEDDING_DATE.getTime() + 5 * 3600000); // ~5h celebration
      var ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//AniZviadi//Wedding//EN",
        "BEGIN:VEVENT",
        "UID:" + Date.now() + "@ani-zviadi-wedding",
        "DTSTAMP:" + fmt(new Date()),
        "DTSTART:" + fmt(WEDDING_DATE),
        "DTEND:" + fmt(end),
        "SUMMARY:Wedding of Ani & Zviadi",
        "DESCRIPTION:Join us to celebrate the wedding of Ani & Zviadi. Dress code: Summer Chic.",
        "LOCATION:Garden of Ilia, Davit Aghmashenebeli Avenue 73, Tbilisi, Georgia",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");
      var blob = new Blob([ics], { type: "text/calendar" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "Ani-and-Zviadi-Wedding.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

    // Hide guest count when declining.
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
      thankYouTitle.textContent = attending ? "We can't wait to see you!" : "We'll miss you!";
      thankYouMsg.textContent = attending
        ? "Thank you, " + data.name + ". Your RSVP is confirmed for " + (data.guests || 1) +
          " guest" + ((data.guests || 1) > 1 ? "s" : "") + ". See you on 5 September!"
        : "Thank you for letting us know, " + data.name + ". You'll be missed — sending love your way.";
      thankYou.hidden = false;
      thankYou.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (editBtn) {
      editBtn.addEventListener("click", function () {
        thankYou.hidden = true;
        form.hidden = false;
        setNote("", null);
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

      // Always keep a local copy as a safety net.
      try {
        localStorage.setItem("rsvp:ani-zviadi", JSON.stringify({ when: Date.now(), data: data }));
      } catch (err) { /* ignore */ }

      // Option A — Formspree endpoint configured: POST it.
      if (FORMSPREE_ENDPOINT) {
        setNote("Sending your RSVP…", "info");
        var btn = $('button[type="submit"]', form);
        if (btn) btn.disabled = true;
        fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: fd
        }).then(function (res) {
          if (res.ok) { showThankYou(data); }
          else { throw new Error("bad response"); }
        }).catch(function () {
          setNote("Something went wrong. Please try the email option below.", "error");
          emailFallback(data);
        }).finally(function () {
          if (btn) btn.disabled = false;
        });
        return;
      }

      // Option B — no backend: open a pre-filled email to the couple.
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
      var href = "mailto:" + COUPLE_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      // Open in a new step so it works after the click handler.
      var a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  })();
})();
