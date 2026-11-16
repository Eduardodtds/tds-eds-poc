const PROD_API_URL = 'https://tds-leads-api.tds-leads-api.workers.dev/leads';
const LOCAL_API_URL = 'http://localhost:8787/leads';

function apiUrl() {
  return window.location.hostname === 'localhost' ? LOCAL_API_URL : PROD_API_URL;
}

function showErrors(form, errors = {}) {
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  form.querySelectorAll('.contact-form-error').forEach((el) => el.remove());
  Object.entries(errors).forEach(([name, message]) => {
    const field = form.elements[name];
    if (!field) return;
    field.setAttribute('aria-invalid', 'true');
    const error = document.createElement('p');
    error.className = 'contact-form-error';
    error.id = `${field.id}-error`;
    error.textContent = message;
    field.setAttribute('aria-describedby', error.id);
    field.after(error);
  });
}

async function submit(form, status) {
  const button = form.querySelector('button');
  const data = Object.fromEntries(new FormData(form));
  data.pageUrl = window.location.href;

  button.disabled = true;
  status.textContent = 'Sending…';
  showErrors(form);

  try {
    const res = await fetch(apiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      const thanks = document.createElement('p');
      thanks.className = 'contact-form-success';
      thanks.setAttribute('role', 'status');
      thanks.textContent = 'Thanks! We got your message and will get back to you soon.';
      form.replaceWith(thanks);
      return;
    }
    if (res.status === 400 && json.errors) {
      showErrors(form, json.errors);
      status.textContent = 'Please check the highlighted fields.';
    } else {
      status.textContent = 'Something went wrong. Please try again in a moment.';
    }
  } catch {
    status.textContent = 'Something went wrong. Please try again in a moment.';
  }
  button.disabled = false;
}

/**
 * Contact form
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const buttonLabel = block.textContent.trim() || 'Send';

  block.id = 'contact';
  block.innerHTML = `
    <form novalidate>
      <div class="contact-form-field">
        <label for="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autocomplete="name" required maxlength="100">
      </div>
      <div class="contact-form-field">
        <label for="contact-email">Work email</label>
        <input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="200">
      </div>
      <div class="contact-form-field contact-form-company">
        <label for="contact-company">Agency / company</label>
        <input id="contact-company" name="company" type="text" autocomplete="organization" required maxlength="150">
      </div>
      <div class="contact-form-field contact-form-message">
        <label for="contact-message">How can we help? (optional)</label>
        <textarea id="contact-message" name="message" rows="4" maxlength="2000"></textarea>
      </div>
      <div class="contact-form-hp" aria-hidden="true">
        <label for="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off">
      </div>
      <button type="submit" class="button primary"></button>
      <p class="contact-form-status" role="status" aria-live="polite"></p>
    </form>
  `;
  const form = block.querySelector('form');
  const status = form.querySelector('.contact-form-status');
  form.querySelector('button').textContent = buttonLabel;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // native checks first
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    submit(form, status);
  });
}
