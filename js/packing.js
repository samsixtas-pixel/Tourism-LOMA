/**
 * ============================================================
 * LOMA ADVENTURES — PACKING ASSISTANT
 * ============================================================
 * "What Should I Pack?"
 * Hutoa orodha iliyopendekezwa ya nguo na vifaa muhimu kulingana na:
 * 1. Aina ya Safari (Wildlife Safari, Kilimanjaro Climb, Zanzibar Beach)
 * 2. Mwezi wa safari (Kiangazi au Masika)
 * 3. Idadi ya siku
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('packingAssistantForm');
  const resultsContainer = document.getElementById('packingAssistantResults');

  if (!form || !resultsContainer) return;

  const packingKnowledge = {
    safari: [
      { category: "Clothing & Footwear", items: ["Neutral color clothing (khaki, olive, beige - avoid dark blue/black)", "Lightweight long-sleeve safari shirts", "Comfortable walking boots or sneakers", "Wide-brim safari sun hat & UV sunglasses", "Warm fleece jacket for chilly morning game drives"] },
      { category: "Gear & Photography", items: ["High-power binoculars (8x42 or 10x42)", "Camera with zoom telephoto lens (200-400mm+)", "Extra camera batteries & memory cards", "Universal plug adapter (Type G / UK standard)"] },
      { category: "Health & Toiletries", items: ["DEET-based insect repellent", "SPF 50+ broad-spectrum sunscreen & lip balm", "Malaria prophylaxis medication (consult doctor)", "Personal first aid kit & wet wipes"] }
    ],
    kilimanjaro: [
      { category: "Mountain Technical Gear", items: ["Waterproof 4-season trekking boots (broken-in)", "Down jacket (-10°C to -20°C rated)", "Thermal base layers (Merino wool recommended)", "Windproof & waterproof Gore-Tex outer shell", "Four-season sleeping bag (-15°C comfort limit)"] },
      { category: "Head & Hand Wear", items: ["Warm fleece beanie & balaclava", "Heavy insulated waterproof mittens", "Lightweight trekking liner gloves", "Headlamp with extra rechargeable batteries"] },
      { category: "Hydration & Health", items: ["Hydration bladder (3L) + insulated tube", "Water purification tablets or filter", "Altitude sickness prevention (Diamox - consult doctor)", "Electrolyte hydration packs & energy bars"] }
    ],
    zanzibar: [
      { category: "Beach & Resort Wear", items: ["Light breathable linen shirts & shorts", "Swimwear & UV rash guard", "Flip-flops & water shoes for coral reefs", "Modest attire covering knees/shoulders for Stone Town"] },
      { category: "Island Essentials", items: ["Reef-safe biodegradable sunscreen", "Waterproof dry bag for boat excursions", "Snorkeling mask (or rent on-site)", "Insect repellent for evening dinners"] }
    ]
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tripType = document.getElementById('packingTripType')?.value || 'safari';
    const month = document.getElementById('packingMonth')?.value || 'any';
    const duration = document.getElementById('packingDuration')?.value || '7';

    const selectedList = packingKnowledge[tripType] || packingKnowledge.safari;

    const html = `
      <div style="margin-bottom: 1.25rem;">
        <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--color-accent); letter-spacing: 0.08em;">Personalized Checklist</span>
        <h4 style="font-size: 1.15rem; color: var(--color-primary-dark); font-weight: 700; margin-top: 0.25rem;">
          Recommended Packing for ${tripType.charAt(0).toUpperCase() + tripType.slice(1)} (${duration} Days)
        </h4>
      </div>
      ${selectedList.map(group => `
        <div class="packing-category-group" style="margin-bottom: 1rem;">
          <div class="packing-category-title" style="font-weight: 700; color: var(--color-primary); font-size: 0.85rem; margin-bottom: 0.4rem;">
            ✦ ${group.category}
          </div>
          <ul class="packing-item-list" style="list-style: none; padding-left: 0; display: grid; grid-template-columns: 1fr; gap: 0.35rem;">
            ${group.items.map(item => `
              <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: var(--color-text-main);">
                <span style="color: var(--color-accent); font-weight: bold;">✓</span> ${item}
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
      <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px dashed var(--color-border); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.75rem; color: var(--color-text-muted);">Luggage tip: Soft duffel bags are required on internal bush flights (max 15kg).</span>
        <button type="button" onclick="window.print()" class="btn btn-outline-dark btn-sm">Print Checklist</button>
      </div>
    `;

    resultsContainer.innerHTML = html;
  });
});
