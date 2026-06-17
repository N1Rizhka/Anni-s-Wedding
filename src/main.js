const STAGES = {
  envelope: 'envelope-stage',
  invitation: 'invitation-stage',
  rsvp: 'rsvp-stage',
};

const envelope = document.getElementById('envelope');
const envelopeStage = document.getElementById('envelope-stage');
const invitationStage = document.getElementById('invitation-stage');
const rsvpStage = document.getElementById('rsvp-stage');
const btnOpenRsvp = document.getElementById('btn-open-rsvp');
const btnBack = document.getElementById('btn-back');
const btnBackSuccess = document.getElementById('btn-back-success');
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');
const successMessage = document.getElementById('success-message');
const guestCountGroup = document.getElementById('guest-count-group');
const dietaryGroup = document.getElementById('dietary-group');
const btnSubmit = document.getElementById('btn-submit');

function showStage(stageId) {
  Object.values(STAGES).forEach((id) => {
    const el = document.getElementById(id);
    const isTarget = id === stageId;
    el.classList.toggle('active', isTarget);
    el.hidden = !isTarget;
  });
}

function openEnvelope() {
  if (envelope.classList.contains('opening')) return;

  envelope.classList.add('opening');

  setTimeout(() => {
    showStage(STAGES.invitation);
  }, 1400);
}

envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openEnvelope();
  }
});

btnOpenRsvp.addEventListener('click', () => {
  showStage(STAGES.rsvp);
  document.getElementById('guest-name').focus();
});

btnBack.addEventListener('click', () => {
  showStage(STAGES.invitation);
});

btnBackSuccess.addEventListener('click', () => {
  rsvpSuccess.hidden = true;
  rsvpForm.hidden = false;
  showStage(STAGES.invitation);
});

function toggleAttendingFields(attending) {
  const showExtras = attending === 'yes';
  guestCountGroup.classList.toggle('hidden', !showExtras);
  dietaryGroup.classList.toggle('hidden', !showExtras);
}

rsvpForm.querySelectorAll('input[name="attending"]').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    toggleAttendingFields(e.target.value);
  });
});

function clearErrors() {
  document.getElementById('error-name').textContent = '';
  document.getElementById('error-attending').textContent = '';
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name = document.getElementById('guest-name').value.trim();
  if (!name) {
    document.getElementById('error-name').textContent = 'Please enter your name';
    valid = false;
  }

  const attending = rsvpForm.querySelector('input[name="attending"]:checked');
  if (!attending) {
    document.getElementById('error-attending').textContent = 'Please let us know if you can attend';
    valid = false;
  }

  return { valid, name, attending: attending?.value };
}

function saveRsvp(data) {
  const existing = JSON.parse(localStorage.getItem('wedding-rsvps') || '[]');
  existing.push({ ...data, submittedAt: new Date().toISOString() });
  localStorage.setItem('wedding-rsvps', JSON.stringify(existing));
}

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const { valid, name, attending } = validateForm();
  if (!valid) return;

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Sending...';

  const formData = new FormData(rsvpForm);
  const rsvpData = {
    name,
    attending,
    guestCount: attending === 'yes' ? formData.get('guestCount') : '0',
    dietary: attending === 'yes' ? formData.get('dietary') || '' : '',
    message: formData.get('message') || '',
  };

  await new Promise((resolve) => setTimeout(resolve, 800));

  saveRsvp(rsvpData);

  const msg =
    attending === 'yes'
      ? `Thank you, ${name}! We can't wait to celebrate with you.`
      : `Thank you, ${name}. We'll miss you, but appreciate you letting us know.`;

  successMessage.textContent = msg;
  rsvpForm.hidden = true;
  rsvpSuccess.hidden = false;

  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Send RSVP';
  rsvpForm.reset();
  toggleAttendingFields('yes');
});

toggleAttendingFields('yes');
