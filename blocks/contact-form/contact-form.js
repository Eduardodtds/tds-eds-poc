/**
 * Contact form (presentation only)
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const buttonLabel = block.textContent.trim() || 'Send';

  block.id = 'contact';
  block.innerHTML = `
    <form>
      <div class="contact-form-field">
        <label for="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autocomplete="name">
      </div>
      <div class="contact-form-field">
        <label for="contact-email">Work email</label>
        <input id="contact-email" name="email" type="email" autocomplete="email">
      </div>
      <div class="contact-form-field contact-form-company">
        <label for="contact-company">Agency / company</label>
        <input id="contact-company" name="company" type="text" autocomplete="organization">
      </div>
      <div class="contact-form-field contact-form-message">
        <label for="contact-message">How can we help? (optional)</label>
        <textarea id="contact-message" name="message" rows="4"></textarea>
      </div>
      <button type="button" class="button primary"></button>
    </form>
  `;
  block.querySelector('button').textContent = buttonLabel;
}
