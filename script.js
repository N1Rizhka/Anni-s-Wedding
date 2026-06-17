const STORAGE_KEY = "ani-zviadi-rsvp";

const openEnvelopeButton = document.getElementById("openEnvelope");
const envelope = document.getElementById("envelope");
const brochure = document.getElementById("brochure");
const addCalendarButton = document.getElementById("addCalendar");
const invitationLinks = document.querySelectorAll('a[href="#details"], a[href="#rsvp-panel"]');

const rsvpForm = document.getElementById("rsvpForm");
const rsvpResult = document.getElementById("rsvpResult");
const rsvpSummary = document.getElementById("rsvpSummary");
const copyRsvpButton = document.getElementById("copyRsvp");
const shareRsvpButton = document.getElementById("shareRsvp");
const resetRsvpButton = document.getElementById("resetRsvp");

const openInvitation = () => {
  document.body.classList.add("invitation-open");
  envelope.setAttribute("aria-expanded", "true");
};

const scrollToTarget = (selector) => {
  const target = document.querySelector(selector);

  if (!target) {
    return;
  }

  window.setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 220);
};

const buildRsvpSummary = (formData) => {
  const message = formData.guestMessage?.trim()
    ? `Message: ${formData.guestMessage.trim()}`
    : "Message: —";
  const contact = formData.guestContact?.trim()
    ? `Contact: ${formData.guestContact.trim()}`
    : "Contact: —";

  return [
    "Ani & Zviadi wedding RSVP",
    `Name: ${formData.guestName.trim()}`,
    `Attendance: ${formData.attendance}`,
    `Guests: ${formData.guestCount}`,
    contact,
    message,
  ].join("\n");
};

const showRsvpSummary = (savedData) => {
  rsvpSummary.textContent = buildRsvpSummary(savedData);
  rsvpResult.hidden = false;
};

const persistRsvp = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadSavedRsvp = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const hydrateForm = (savedData) => {
  if (!savedData) {
    return;
  }

  rsvpForm.guestName.value = savedData.guestName || "";
  rsvpForm.guestContact.value = savedData.guestContact || "";
  rsvpForm.guestCount.value = savedData.guestCount || "1";
  rsvpForm.guestMessage.value = savedData.guestMessage || "";

  const attendanceInput = rsvpForm.querySelector(
    `input[name="attendance"][value="${savedData.attendance}"]`,
  );

  if (attendanceInput) {
    attendanceInput.checked = true;
  }

  showRsvpSummary(savedData);
};

const downloadCalendarInvite = () => {
  const start = "20260905T130000Z";
  const end = "20260905T200000Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ani and Zviadi Wedding//EN",
    "BEGIN:VEVENT",
    "UID:ani-zviadi-wedding-20260905@invitation",
    "DTSTAMP:20260617T000000Z",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    "SUMMARY:Ani and Zviadi Wedding",
    "LOCATION:Garden of Ilia, Davit Aghmashenebeli Avenue 73, Tbilisi",
    "DESCRIPTION:Celebrate the wedding of Ani and Zviadi. Dress code: Summer Chic.",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ani-zviadi-wedding-invitation.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

openEnvelopeButton.addEventListener("click", () => {
  openInvitation();
  scrollToTarget("#brochure");
});

envelope.addEventListener("click", () => {
  openInvitation();
  scrollToTarget("#brochure");
});

addCalendarButton.addEventListener("click", downloadCalendarInvite);

invitationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openInvitation();
    scrollToTarget(link.getAttribute("href"));
  });
});

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const savedData = Object.fromEntries(formData.entries());
  persistRsvp(savedData);
  showRsvpSummary(savedData);
  rsvpResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

copyRsvpButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(rsvpSummary.textContent);
    copyRsvpButton.textContent = "Copied";
    window.setTimeout(() => {
      copyRsvpButton.textContent = "Copy RSVP";
    }, 1600);
  } catch (error) {
    copyRsvpButton.textContent = "Copy failed";
    window.setTimeout(() => {
      copyRsvpButton.textContent = "Copy RSVP";
    }, 1600);
  }
});

shareRsvpButton.addEventListener("click", async () => {
  if (!navigator.share) {
    shareRsvpButton.textContent = "Share not supported";
    window.setTimeout(() => {
      shareRsvpButton.textContent = "Share RSVP";
    }, 1800);
    return;
  }

  try {
    await navigator.share({
      title: "Ani & Zviadi Wedding RSVP",
      text: rsvpSummary.textContent,
    });
  } catch (error) {
    // User-cancelled shares should not produce noisy UI.
  }
});

resetRsvpButton.addEventListener("click", () => {
  rsvpResult.hidden = true;
  localStorage.removeItem(STORAGE_KEY);
  rsvpForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

const savedRsvp = loadSavedRsvp();

if (savedRsvp) {
  openInvitation();
  hydrateForm(savedRsvp);
}
