/**
 * ============================================================
 * LOMA ADVENTURES — FORMS & INQUIRY HANDLING
 * ============================================================
 * Ushughulikiaji wa fomu za maombi ya safari na mawasiliano:
 * - Ukaguzi wa uingizaji sahihi wa data (Client-side validation)
 * - Hali ya kupakia (Loading state spinner)
 * - Ujumbe wa mafanikio (Success state alert)
 * - Ujumbe wa makosa (Error handling)
 * - Usajili wa jarida la barua pepe (Newsletter Subscription)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fomu Kuu ya Maombi ya Safari na Mawasiliano (Trip Inquiry Form)
  const contactForm = document.getElementById('lomaTripInquiryForm');
  const formFeedback = document.getElementById('inquiryFormFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Thibitisha kwamba vigezo vya lazima vimejazwa
      const name = contactForm.querySelector('[name="fullName"]')?.value.trim();
      const email = contactForm.querySelector('[name="email"]')?.value.trim();
      const country = contactForm.querySelector('[name="country"]')?.value.trim();

      if (!name || !email || !country) {
        showFeedback(formFeedback, 'error', 'Please fill in all required fields (Name, Email, and Country of Residence).');
        return;
      }

      // Onyesha hali ya kupakia (Loading State)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Processing Request...</span>
      `;

      // Iga utumaji wa taarifa kwenda kwenye seva ya backend (API Endpoint)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        contactForm.reset();

        showFeedback(formFeedback, 'success', 
          'Asante sana! Your journey request has been received. A dedicated LOMA Adventure Specialist will review your details and contact you via email and WhatsApp within 12 hours.'
        );
      }, 1200);
    });
  }

  // 2. Usajili wa Jarida la Barua Pepe (Newsletter Subscription)
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = newsletterForm.querySelector('button');
        const orig = btn.innerText;
        btn.innerText = 'Subscribed!';
        btn.style.backgroundColor = 'var(--color-success)';
        input.value = '';
        setTimeout(() => {
          btn.innerText = orig;
          btn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }

  function showFeedback(el, type, message) {
    if (!el) return;
    el.style.display = 'block';
    if (type === 'success') {
      el.style.backgroundColor = 'rgba(46, 125, 50, 0.12)';
      el.style.color = '#1b5e20';
      el.style.border = '1px solid rgba(46, 125, 50, 0.3)';
    } else {
      el.style.backgroundColor = 'rgba(198, 40, 40, 0.12)';
      el.style.color = '#b71c1c';
      el.style.border = '1px solid rgba(198, 40, 40, 0.3)';
    }
    el.innerHTML = message;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
