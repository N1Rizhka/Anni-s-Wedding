const invitationStage = document.querySelector(".invitation-stage");
const openEnvelopeButton = document.querySelector("[data-open-envelope]");
const weddingCard = document.querySelector("#wedding-card");
const rsvpForm = document.querySelector("[data-rsvp-form]");
const confirmation = document.querySelector("[data-rsvp-confirmation]");
const confirmationName = document.querySelector("[data-confirmation-name]");
const confirmationDetails = document.querySelector("[data-confirmation-details]");
const editRsvpButton = document.querySelector("[data-edit-rsvp]");

const RSVP_STORAGE_KEY = "ani-zviadi-rsvp";

function openInvitation() {
  invitationStage.classList.add("is-open");
  openEnvelopeButton.setAttribute("aria-expanded", "true");
  weddingCard.setAttribute("aria-hidden", "false");

  window.setTimeout(() => {
    weddingCard.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    weddingCard.focus({ preventScroll: true });
  }, 650);
}

function saveRsvp(response) {
  localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(response));
}

function getSavedRsvp() {
  const savedResponse = localStorage.getItem(RSVP_STORAGE_KEY);

  if (!savedResponse) {
    return null;
  }

  try {
    return JSON.parse(savedResponse);
  } catch {
    localStorage.removeItem(RSVP_STORAGE_KEY);
    return null;
  }
}

function showConfirmation(response) {
  confirmationName.textContent = `Thank you, ${response.name}!`;
  confirmationDetails.textContent = `${response.attendance} · ${response.guests} ${
    response.guests === "1" ? "guest" : "guests"
  }${response.message ? ` · "${response.message}"` : ""}`;

  rsvpForm.hidden = true;
  confirmation.hidden = false;
}

function showForm() {
  confirmation.hidden = true;
  rsvpForm.hidden = false;
}

function fillForm(response) {
  rsvpForm.elements.name.value = response.name;
  rsvpForm.elements.attendance.value = response.attendance;
  rsvpForm.elements.guests.value = response.guests;
  rsvpForm.elements.message.value = response.message || "";
}

openEnvelopeButton.addEventListener("click", openInvitation);

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const response = {
    name: formData.get("name").trim(),
    attendance: formData.get("attendance"),
    guests: formData.get("guests"),
    message: formData.get("message").trim(),
  };

  saveRsvp(response);
  showConfirmation(response);
});

editRsvpButton.addEventListener("click", () => {
  showForm();
  rsvpForm.elements.name.focus();
});

const savedRsvp = getSavedRsvp();

if (savedRsvp) {
  fillForm(savedRsvp);
  showConfirmation(savedRsvp);
}
