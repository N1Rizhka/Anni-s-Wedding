const inviteStage = document.getElementById("inviteStage");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
const invitationCard = document.getElementById("invitationCard");
const rsvpSection = document.getElementById("rsvpSection");
const jumpToRsvpBtn = document.getElementById("jumpToRsvpBtn");
const rsvpForm = document.getElementById("rsvpForm");
const rsvpResponse = document.getElementById("rsvpResponse");
const countdown = document.getElementById("countdown");

const weddingDate = new Date("2026-09-05T17:00:00+04:00");

function revealRsvp() {
  rsvpSection.classList.add("rsvp-section--visible");
}

function openEnvelope() {
  inviteStage.classList.add("is-open");
  openEnvelopeBtn.setAttribute("aria-expanded", "true");

  setTimeout(() => {
    invitationCard.focus();
  }, 700);

  setTimeout(() => {
    revealRsvp();
  }, 1000);
}

function updateCountdown() {
  const now = new Date();
  const ms = weddingDate.getTime() - now.getTime();

  if (ms <= 0) {
    countdown.textContent = "Today is the day. See you at Garden of Ilia!";
    return;
  }

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);

  countdown.textContent = `${days} days, ${hours} hours, ${minutes} minutes to go.`;
}

openEnvelopeBtn.addEventListener("click", openEnvelope);

jumpToRsvpBtn.addEventListener("click", () => {
  revealRsvp();
  rsvpSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const name = formData.get("name").toString().trim();
  const attendance = formData.get("attendance");
  const guests = formData.get("guests");

  if (!name || !attendance) {
    rsvpResponse.textContent = "Please complete all required RSVP fields.";
    return;
  }

  const responseMessage = attendance === "yes"
    ? `Thank you, ${name}! We are excited to celebrate with you and ${guests} guest(s).`
    : `Thank you, ${name}. We will miss you and truly appreciate your wishes.`;

  rsvpResponse.textContent = responseMessage;
  rsvpForm.reset();
  rsvpForm.elements.guests.value = "1";
});

updateCountdown();
setInterval(updateCountdown, 1000 * 30);
