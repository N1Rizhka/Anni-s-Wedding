import "./styles.css";

const envelopeStage = document.querySelector("[data-envelope]");
const envelopeButton = document.querySelector("[data-open-envelope]");
const brochure = document.querySelector("[data-brochure]");
const rsvpForm = document.querySelector("[data-rsvp-form]");
const rsvpConfirmation = document.querySelector("[data-rsvp-confirmation]");

const RSVP_STORAGE_KEY = "ani-zviadi-wedding-rsvp";

function openInvitation() {
  if (!envelopeStage || !envelopeButton || !brochure) {
    return;
  }

  envelopeStage.classList.add("is-open");
  envelopeButton.setAttribute("aria-expanded", "true");

  window.setTimeout(() => {
    brochure.hidden = false;
    brochure.classList.add("is-visible");
    brochure.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 560);
}

function formatAttendance(attendance) {
  return attendance === "joyfully attending"
    ? "We cannot wait to celebrate with you."
    : "Thank you for sending your love.";
}

function renderConfirmation(response) {
  if (!rsvpConfirmation) {
    return;
  }

  const guestLabel = Number(response.guests) === 1 ? "guest" : "guests";
  rsvpConfirmation.replaceChildren();

  const heading = document.createElement("strong");
  heading.textContent = `Thank you, ${response.name}!`;

  const lineBreak = document.createElement("br");
  const details = document.createTextNode(
    ` Your RSVP has been saved: ${response.attendance} for ${response.guests} ${guestLabel}. ${formatAttendance(response.attendance)}`,
  );

  rsvpConfirmation.append(heading, lineBreak, details);
}

function getFormControl(name) {
  return rsvpForm?.elements.namedItem(name);
}

function restoreSavedRsvp() {
  const savedResponse = window.localStorage.getItem(RSVP_STORAGE_KEY);

  if (!savedResponse || !rsvpForm) {
    return;
  }

  try {
    const response = JSON.parse(savedResponse);
    getFormControl("name").value = response.name ?? "";
    getFormControl("guests").value = response.guests ?? "";
    getFormControl("message").value = response.message ?? "";

    rsvpForm
      .querySelectorAll('[name="attendance"]')
      .forEach((option) => {
        option.checked = option.value === response.attendance;
      });

    renderConfirmation(response);
  } catch {
    window.localStorage.removeItem(RSVP_STORAGE_KEY);
  }
}

envelopeButton?.addEventListener("click", openInvitation);

rsvpForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const response = {
    name: String(formData.get("name") ?? "").trim(),
    attendance: String(formData.get("attendance") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    message: String(formData.get("message") ?? "").trim(),
    submittedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(response));
  renderConfirmation(response);
  rsvpForm.reset();
});

restoreSavedRsvp();
