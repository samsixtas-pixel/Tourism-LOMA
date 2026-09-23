/**
 * ============================================================
 * LOMA ADVENTURES — INTERACTIVE TRIP BUILDER SIMULATION
 * ============================================================
 * "Build Your Tanzania Journey"
 * Huruhusu msafiri wa kimataifa kujaribu kupanga safari yake kwa mikono yake:
 * - Kuongeza au kuondoa vituo (Arusha, Tarangire, Ngorongoro, Serengeti, Zanzibar)
 * - Kuhesabu kiotomatiki makadirio ya siku na bei (Dynamic estimates)
 * - Kubonyeza kitufe cha WhatsApp ili kutuma ratiba iliyoundwa moja kwa moja!
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tripBuilderApp');
  if (!container) return;

  // Orodha ya vituo vyote vinavyopatikana Tanzania
  const availableStops = [
    { id: 'arusha', name: 'Arusha (Arrival & Gateway)', days: 1, basePrice: 220, defaultSelected: true },
    { id: 'tarangire', name: 'Tarangire National Park (Elephants & Baobabs)', days: 2, basePrice: 580, defaultSelected: true },
    { id: 'ngorongoro', name: 'Ngorongoro Crater (Big Five Caldera)', days: 2, basePrice: 650, defaultSelected: true },
    { id: 'serengeti', name: 'Serengeti Plains (Great Migration)', days: 3, basePrice: 950, defaultSelected: true },
    { id: 'zanzibar', name: 'Zanzibar Island (Spice & Turquoise Coast)', days: 3, basePrice: 600, defaultSelected: false }
  ];

  // Hali ya sasa ya vituo vilivyochaguliwa (State)
  let selectedStops = availableStops.filter(s => s.defaultSelected);

  function renderBuilder() {
    const listEl = document.getElementById('builderItineraryList');
    const availableOptionsEl = document.getElementById('builderAvailableOptions');
    const totalDaysEl = document.getElementById('builderTotalDays');
    const totalPriceEl = document.getElementById('builderTotalPrice');
    const routeSummaryEl = document.getElementById('builderRouteSummary');
    const waTripBtn = document.getElementById('builderWhatsAppBtn');

    if (!listEl) return;

    // Hesabu jumla ya siku na makadirio ya kuanzia ya bei
    const totalDays = selectedStops.reduce((sum, item) => sum + item.days, 0);
    const totalPrice = selectedStops.reduce((sum, item) => sum + item.basePrice, 0);
    const routeNames = selectedStops.map(s => s.name.split(' (')[0]).join(' → ');

    if (totalDaysEl) totalDaysEl.innerText = `${totalDays} Days`;
    if (totalPriceEl) totalPriceEl.innerText = `$${totalPrice.toLocaleString()}`;
    if (routeSummaryEl) routeSummaryEl.innerText = routeNames;

    // Sasisha kiungo cha WhatsApp ili kitume muhtasari wa ratiba iliyochaguliwa
    if (waTripBtn) {
      const waText = `Hello LOMA Adventures, I built a custom Tanzania itinerary (${totalDays} Days): ${routeNames}. Could you please send me a detailed quotation?`;
      waTripBtn.onclick = (e) => {
        e.preventDefault();
        openWhatsAppChat(waText);
      };
    }

    // Onyesha orodha ya vituo vilivyomo kwenye safari
    listEl.innerHTML = selectedStops.map((stop, index) => `
      <div class="builder-step-node" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.25rem; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 0.65rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--color-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;">
            ${index + 1}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--color-primary-dark);">${stop.name}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${stop.days} Days • From $${stop.basePrice}/person</div>
          </div>
        </div>
        <div>
          ${selectedStops.length > 2 ? `
            <button type="button" class="btn-remove-stop" data-id="${stop.id}" style="color: var(--color-error); font-size: 0.75rem; font-weight: 600; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(198,40,40,0.2);">
              Remove
            </button>
          ` : `<span style="font-size: 0.7rem; color: var(--color-text-muted);">Required</span>`}
        </div>
      </div>
    `).join('');

    // Onyesha vituo ambavyo bado havijaongezwa ili mtumiaji aweze kuvibofya
    const unselectedStops = availableStops.filter(s => !selectedStops.some(sel => sel.id === s.id));
    if (availableOptionsEl) {
      if (unselectedStops.length === 0) {
        availableOptionsEl.innerHTML = `<span style="font-size: 0.8rem; color: var(--color-text-muted);">All major destinations currently added to your route!</span>`;
      } else {
        availableOptionsEl.innerHTML = unselectedStops.map(stop => `
          <button type="button" class="btn-add-stop" data-id="${stop.id}" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; border-radius: var(--radius-full); background: #ffffff; border: 1px dashed var(--color-accent); font-size: 0.75rem; font-weight: 600; color: var(--color-primary-dark); cursor: pointer;">
            + Add ${stop.name.split(' (')[0]} (${stop.days}d)
          </button>
        `).join(' ');
      }
    }

    // Unganisha matukio ya vitufe vya kutoa kituo
    listEl.querySelectorAll('.btn-remove-stop').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        selectedStops = selectedStops.filter(s => s.id !== id);
        renderBuilder();
      });
    });

    // Unganisha matukio ya vitufe vya kuongeza kituo
    if (availableOptionsEl) {
      availableOptionsEl.querySelectorAll('.btn-add-stop').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const toAdd = availableStops.find(s => s.id === id);
          if (toAdd) {
            selectedStops.push(toAdd);
            renderBuilder();
          }
        });
      });
    }
  }

  renderBuilder();
});
