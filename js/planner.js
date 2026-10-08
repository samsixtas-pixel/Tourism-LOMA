/**
 * LOMA ADVENTURES — HERO TRIP PLANNER
 * Sends a professionally formatted WhatsApp message instead of redirecting.
 */
document.addEventListener('DOMContentLoaded', () => {
  const plannerForm = document.getElementById('tripPlannerForm');
  if (!plannerForm) return;

  const destLabels = {
    all: "All Tanzania Destinations",
    serengeti: "Serengeti & Northern Parks",
    kilimanjaro: "Mount Kilimanjaro Trek",
    zanzibar: "Zanzibar Island Retreat",
    combined: "Bush & Beach (Safari + Zanzibar)"
  };
  const durationLabels = {
    any: "Flexible",
    "3-5": "3 – 5 Days",
    "6-8": "6 – 8 Days",
    "9-12": "9 – 12 Days",
    "14+": "14+ Days Comprehensive"
  };
  const travelerLabels = {
    "1": "1 Solo Traveler",
    "2": "2 Travelers (Couple / Friends)",
    "3-4": "3 – 4 Family / Group",
    "5+": "5+ Private Group"
  };
  const monthLabels = {
    "": "Flexible / Anytime",
    "jun-oct": "Jun – Oct (Dry Season & Migration)",
    "dec-feb": "Dec – Feb (Calving & Warmth)",
    "nov": "November (Short Rains)",
    "mar-may": "Mar – May (Emerald Season)"
  };

  plannerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dest = document.getElementById('plannerDest')?.value || 'all';
    const duration = document.getElementById('plannerDuration')?.value || 'any';
    const travelers = document.getElementById('plannerTravelers')?.value || '2';
    const month = document.getElementById('plannerDate')?.value || '';

    const waMessage = window.formatWhatsAppMessage({
      title: "New Trip Plan Request — Hero Planner",
      intro: "I would like to plan a Tanzania journey. Here are my preferences:",
      fields: [
        { label: "Destination", value: destLabels[dest] || dest },
        { label: "Preferred Duration", value: durationLabels[duration] || duration },
        { label: "Number of Travelers", value: travelerLabels[travelers] || travelers },
        { label: "Preferred Travel Month", value: monthLabels[month] || "Flexible / Anytime" }
      ],
      outro: "Could you please share a detailed itinerary and quotation for this trip?"
    });

    const submitBtn = plannerForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Opening WhatsApp…</span>`;
      setTimeout(() => {
        window.sendWhatsAppMessage(waMessage);
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
      }, 300);
    } else {
      window.sendWhatsAppMessage(waMessage);
    }
  });
});
