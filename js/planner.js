/**
 * ============================================================
 * LOMA ADVENTURES — TRIP PLANNER WIDGET
 * ============================================================
 * Kazi ya faili hili ni kuwezesha fomu ya upangaji safari
 * iliyo mbele ya ukurasa (Hero Overlap Planner):
 * - Kuchagua Eneo (Serengeti, Ngorongoro, Kilimanjaro, Zanzibar)
 * - Muda wa Safari (Days: 3-5, 6-8, 9-12, 14+)
 * - Idadi ya Wasafiri (Solo, Couple, Family, Group)
 * - Tarehe ya Safari
 *
 * Mtumiaji akibonyeza "FIND MY TRIP", fomu inachakata vigezo
 * na kumuelekeza kwenye kifurushi kinachofaa au fomu ya mawasiliano.
 */

document.addEventListener('DOMContentLoaded', () => {
  const plannerForm = document.getElementById('tripPlannerForm');

  if (plannerForm) {
    plannerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const destination = document.getElementById('plannerDest')?.value;
      const duration = document.getElementById('plannerDuration')?.value;
      const travelers = document.getElementById('plannerTravelers')?.value;
      const travelDate = document.getElementById('plannerDate')?.value;

      // Hapa tunatengeneza muhtasari wa ombi la safari
      // Baadaye taarifa hizi zitatumwa kwenye API ya utafutaji (Booking Engine)
      const queryParams = new URLSearchParams({
        dest: destination || 'all',
        duration: duration || 'any',
        travelers: travelers || '2',
        date: travelDate || ''
      });

      // Huisha mtumiaji kwa kumuonyesha kifurushi au kumpeleka kwenye ukurasa wa safari
      const targetUrl = `pages/safari.html?${queryParams.toString()}`;
      
      // Mfano wa mabadiliko ya kifungo ili mtumiaji aone maendeleo (Loading state)
      const submitBtn = plannerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Searching...</span>`;
        submitBtn.disabled = true;

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      }
    });
  }
});
