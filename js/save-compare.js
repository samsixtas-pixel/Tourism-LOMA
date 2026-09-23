/**
 * ============================================================
 * LOMA ADVENTURES — SAVE & COMPARE SYSTEM
 * ============================================================
 * Huwezesha wasafiri kuhifadhi safari wanazopenda na kuzilinganisha
 * kwa kutumia hifadhi ya kivinjari (localStorage):
 * - Kitufe cha Moyo (Save trip)
 * - Kitufe cha Mizani (Compare trip)
 * - Upau wa kulinganisha unaojitokeza chini ya skrini (Bottom Drawer)
 */

document.addEventListener('DOMContentLoaded', () => {
  const saveButtons = document.querySelectorAll('.btn-action-save');
  const compareButtons = document.querySelectorAll('.btn-action-compare');
  const compareDrawer = document.getElementById('compareDrawer');
  const compareCountEl = document.getElementById('compareCount');
  const clearCompareBtn = document.getElementById('clearCompare');

  let savedTrips = JSON.parse(localStorage.getItem('loma_saved_trips') || '[]');
  let compareTrips = JSON.parse(localStorage.getItem('loma_compare_trips') || '[]');

  // Sawazisha hali ya vitufe kulingana na data iliyohifadhiwa
  function syncButtonStates() {
    saveButtons.forEach(btn => {
      const id = btn.getAttribute('data-tour-id');
      if (savedTrips.includes(id)) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from saved trips');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Save this trip');
      }
    });

    compareButtons.forEach(btn => {
      const id = btn.getAttribute('data-tour-id');
      if (compareTrips.some(t => t.id === id)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    updateCompareDrawer();
  }

  // Badilisha hali ya safari iliyohifadhiwa (Toggle Save)
  saveButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-tour-id');
      const title = btn.getAttribute('data-tour-title') || id;

      if (savedTrips.includes(id)) {
        savedTrips = savedTrips.filter(t => t !== id);
      } else {
        savedTrips.push(id);
      }

      localStorage.setItem('loma_saved_trips', JSON.stringify(savedTrips));
      syncButtonStates();
    });
  });

  // Ongeza au toa kwenye orodha ya kulinganisha (Toggle Compare)
  compareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-tour-id');
      const title = btn.getAttribute('data-tour-title') || id;
      const price = btn.getAttribute('data-tour-price') || '$1,850';
      const days = btn.getAttribute('data-tour-days') || '7 Days';

      const existingIndex = compareTrips.findIndex(t => t.id === id);
      if (existingIndex >= 0) {
        compareTrips.splice(existingIndex, 1);
      } else {
        if (compareTrips.length >= 3) {
          alert('You can compare up to 3 safari packages at once.');
          return;
        }
        compareTrips.push({ id, title, price, days });
      }

      localStorage.setItem('loma_compare_trips', JSON.stringify(compareTrips));
      syncButtonStates();
    });
  });

  function updateCompareDrawer() {
    if (!compareDrawer) return;

    if (compareTrips.length > 0) {
      compareDrawer.classList.add('active');
      if (compareCountEl) compareCountEl.innerText = compareTrips.length;
      
      const previewEl = document.getElementById('compareItemsList');
      if (previewEl) {
        previewEl.innerHTML = compareTrips.map(t => `
          <div style="background: var(--color-bg-alt); padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <strong>${t.title}</strong> (${t.days}, ${t.price})
          </div>
        `).join('');
      }
    } else {
      compareDrawer.classList.remove('active');
    }
  }

  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', () => {
      compareTrips = [];
      localStorage.setItem('loma_compare_trips', JSON.stringify(compareTrips));
      syncButtonStates();
    });
  }

  syncButtonStates();
});
