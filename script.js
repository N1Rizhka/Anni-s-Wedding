const openInvitationButton = document.getElementById("openInvitation");
const invitationContent = document.getElementById("invitationContent");
const rsvpForm = document.getElementById("rsvpForm");
const rsvpSuccess = document.getElementById("rsvpSuccess");

if (openInvitationButton && invitationContent) {
  openInvitationButton.addEventListener("click", () => {
    openInvitationButton.classList.add("is-open");
    openInvitationButton.setAttribute("aria-expanded", "true");
    openInvitationButton.disabled = true;

    window.setTimeout(() => {
      invitationContent.classList.remove("hidden");
      invitationContent.classList.add("is-visible");
      invitationContent.setAttribute("aria-hidden", "false");
      invitationContent.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 550);
  });
}

if (rsvpForm && rsvpSuccess) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(rsvpForm);
    const payload = {
      name: formData.get("name"),
      attendance: formData.get("attendance"),
      guests: formData.get("guests"),
      message: formData.get("message"),
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem("ani-zviadi-rsvp", JSON.stringify(payload));

    rsvpForm.reset();
    rsvpSuccess.classList.remove("hidden");
  });
}
