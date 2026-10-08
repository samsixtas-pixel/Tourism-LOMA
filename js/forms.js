/**
 * LOMA ADVENTURES — CONTACT & INQUIRY FORM
 * Composes a professional WhatsApp message and opens WhatsApp.
 */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('lomaTripInquiryForm');
  const formFeedback = document.getElementById('inquiryFormFeedback');

  const tripTypeLabels = {
    safari: "Northern Wildlife Safari",
    kilimanjaro: "Mount Kilimanjaro Climb",
    zanzibar: "Zanzibar Island Retreat",
    combined: "Combined Bush & Beach (Safari + Zanzibar)",
    custom: "Fully Custom Adventure"
  };
  const travelerLabels = {
    "1": "1 Solo Traveler",
    "2": "2 Adults (Couple / Friends)",
    family: "Family with Children",
    group: "Small Group (4–8+)"
  };
  const budgetLabels = {
    comfort: "Mid-Range / Comfort Lodges",
    luxury: "Classic Luxury Tented Safari",
    ultra: "Ultra-Luxury / Exclusive Wilderness"
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const get = (name) =>
        contactForm.querySelector(`[name="${name}"]`)?.value.trim() || "";

      const name = get('fullName');
      const email = get('email');
      const country = get('country');
      const whatsapp = get('whatsappNumber');
      const tripType = get('tripType');
      const travelers = get('travelersCount');
      const travelDate = get('travelDate');
      const budget = get('budget');
      const message = get('message');

      if (!name || !email || !country) {
        showFeedback(
          formFeedback,
          'error',
          'Please fill in all required fields (Name, Email, and Country of Residence).'
        );
        return;
      }

      const waMessage = window.formatWhatsAppMessage({
        title: "New Tailor-Made Trip Inquiry",
        intro: "I would like to request a personalised Tanzania itinerary. Details below:",
        fields: [
          { label: "Full Name", value: name },
          { label: "Email", value: email },
          { label: "Country of Residence", value: country },
          { label: "WhatsApp", value: whatsapp },
          { label: "Trip Interest", value: tripTypeLabels[tripType] || tripType },
          { label: "Number of Travelers", value: travelerLabels[travelers] || travelers },
          { label: "Estimated Travel Date", value: travelDate },
          { label: "Accommodation Style", value: budgetLabels[budget] || budget }
        ],
        notes: message,
        outro: "Looking forward to your detailed quotation and recommendations."
      });

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const original = submitBtn ? submitBtn.innerHTML : null;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Sending to WhatsApp…</span>
        `;
      }

      setTimeout(() => {
        window.sendWhatsAppMessage(waMessage);

        if (submitBtn && original !== null) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = original;
        }
        contactForm.reset();

        showFeedback(
          formFeedback,
          'success',
          'Asante sana! Your inquiry has been prepared and opened in WhatsApp. If it did not open automatically, please tap the WhatsApp icon on this page to continue.'
        );
      }, 600);
    });
  }

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
