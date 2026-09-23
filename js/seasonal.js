/**
 * ============================================================
 * LOMA ADVENTURES — 12-MONTH SEASONAL GUIDE MATRIX
 * ============================================================
 * Huwezesha wasafiri kuelewa hali ya hewa na mazingira ya Tanzania
 * kwa kila mwezi wa mwaka (Januari hadi Desemba):
 * - Hali ya Safari & Wanyamapori (Serengeti Migration n.k.)
 * - Kupanda Mlima Kilimanjaro (Kiwango cha theluji & wingu)
 * - Likizo ya Visiwani Zanzibar (Joto, upepo & maji safi)
 * - Wingi wa Wageni (Crowds: Low, Moderate, Peak)
 * - Mvua (Rainfall: Dry, Short rains, Long rains)
 */

document.addEventListener('DOMContentLoaded', () => {
  const monthButtons = document.querySelectorAll('.month-btn');
  if (monthButtons.length === 0) return;

  // Taarifa halisi za kihistoria za misimu ya Tanzania
  const seasonalData = {
    JAN: {
      name: "January",
      safari: "Excellent. Calving season begins in Southern Serengeti.",
      kilimanjaro: "Clear skies & warm temperatures. Ideal climbing season.",
      zanzibar: "Warm sunny days, calm turquoise water (approx 30°C).",
      crowds: "Moderate to High",
      rainfall: "Low / Occasional light showers"
    },
    FEB: {
      name: "February",
      safari: "Prime wildlife spectacle: 8,000+ wildebeest born daily in Ndutu.",
      kilimanjaro: "One of the best months to summit. Warm and dry.",
      zanzibar: "Peak beach season. Superb diving & snorkeling conditions.",
      crowds: "High",
      rainfall: "Dry & warm"
    },
    MAR: {
      name: "March",
      safari: "Lush green landscapes, migratory birds, fewer crowds.",
      kilimanjaro: "Good early month; clouds begin to form later.",
      zanzibar: "Warm tropical days; light humidity increasing.",
      crowds: "Low to Moderate",
      rainfall: "Late March marks the onset of long rains"
    },
    APR: {
      name: "April",
      safari: "Emerald season: dramatic skies, discounted rates, baby animals.",
      kilimanjaro: "Challenging conditions due to rain & summit snow.",
      zanzibar: "Quiet off-peak month; occasional heavy rains.",
      crowds: "Low (Quiet Season)",
      rainfall: "High (Long Rains)"
    },
    MAY: {
      name: "May",
      safari: "Serengeti transforms into vibrant green; predator action high.",
      kilimanjaro: "Wet at lower elevations, summit cold and quiet.",
      zanzibar: "Occasional showers with beautiful sunny interludes.",
      crowds: "Low",
      rainfall: "Moderate to High"
    },
    JUN: {
      name: "June",
      safari: "Dry season begins. Animals gather around waterholes.",
      kilimanjaro: "Crisp clear skies return. Excellent trekking.",
      zanzibar: "Pleasant breeze, sunny skies, mild 26°C weather.",
      crowds: "Moderate",
      rainfall: "Very Dry"
    },
    JUL: {
      name: "July",
      safari: "Peak Safari: Grumeti River crossings in Western Serengeti.",
      kilimanjaro: "Superb visibility; colder nighttime temperatures at high altitude.",
      zanzibar: "Ideal beach weather with gentle trade winds.",
      crowds: "High",
      rainfall: "Completely Dry"
    },
    AUG: {
      name: "August",
      safari: "Iconic Mara River crossings in Northern Serengeti!",
      kilimanjaro: "Crisp dry conditions, popular summit month.",
      zanzibar: "Perfect dry beach weather, crystal-clear sea visibility.",
      crowds: "Peak",
      rainfall: "Dry"
    },
    SEP: {
      name: "September",
      safari: "Spectacular wildlife concentrations across all northern parks.",
      kilimanjaro: "Warm, dry and clear skies across all routes.",
      zanzibar: "Calm warm seas, ideal for kitesurfing and dolphin tours.",
      crowds: "High",
      rainfall: "Dry"
    },
    OCT: {
      name: "October",
      safari: "Great predator sightings; herds gather before short rains.",
      kilimanjaro: "Clear days, pleasant trekking temperatures.",
      zanzibar: "Warm waters, excellent scuba diving and snorkeling.",
      crowds: "Moderate",
      rainfall: "Dry / Brief showers late month"
    },
    NOV: {
      name: "November",
      safari: "Short rains arrive, refreshing plains and attracting birds.",
      kilimanjaro: "Trekking possible; afternoon clouds common.",
      zanzibar: "Warm tropical weather with brief refreshing showers.",
      crowds: "Low to Moderate",
      rainfall: "Moderate (Short Rains)"
    },
    DEC: {
      name: "December",
      safari: "Herds return to Southern Serengeti. Holiday festive atmosphere.",
      kilimanjaro: "Popular festive climb season with good summit windows.",
      zanzibar: "Festive season peak; vibrant island vibes and sunshine.",
      crowds: "Peak (Holidays)",
      rainfall: "Low to Moderate"
    }
  };

  const monthNameEl = document.getElementById('seasonMonthName');
  const safariEl = document.getElementById('seasonSafariVal');
  const kiliEl = document.getElementById('seasonKiliVal');
  const zanzibarEl = document.getElementById('seasonZanzibarVal');
  const crowdsEl = document.getElementById('seasonCrowdsVal');
  const rainEl = document.getElementById('seasonRainVal');

  function updateMonth(code) {
    const data = seasonalData[code];
    if (!data) return;

    if (monthNameEl) monthNameEl.innerText = `${data.name} in Tanzania`;
    if (safariEl) safariEl.innerText = data.safari;
    if (kiliEl) kiliEl.innerText = data.kilimanjaro;
    if (zanzibarEl) zanzibarEl.innerText = data.zanzibar;
    if (crowdsEl) crowdsEl.innerText = data.crowds;
    if (rainEl) rainEl.innerText = data.rainfall;

    monthButtons.forEach(btn => {
      if (btn.getAttribute('data-month') === code) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  monthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-month');
      updateMonth(code);
    });
  });

  // Weka mwezi wa sasa au mwezi maarufu wa Julai (JUL) kama msingi
  updateMonth('JUL');
});
