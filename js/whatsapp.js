/**
 * ============================================================
 * LOMA ADVENTURES — WHATSAPP INTERACTION SYSTEM (3D FLOATING BUTTON)
 * ============================================================
 * Faili hili linashughulikia:
 * 1. Nambari ya WhatsApp ya mteja (Configurable client phone number)
 * 2. Utengenezaji wa ujumbe wa muktadha kulingana na ukurasa au safari inayotazamwa
 * 3. Kidokezo cha msaada (micro-tooltip: "Planning a trip to Tanzania?")
 * 4. Kuhifadhi hali ya kufunga kidokezo kwenye localStorage ili kutomsumbua mtumiaji
 */

// Nambari ya WhatsApp ya mteja.
// Weka nambari halisi ya LOMA Adventures hapa baadaye mfano: "2557XXXXXXXX"
const WHATSAPP_NUMBER = "[CLIENT_WHATSAPP_NUMBER]";

/**
 * Tengeneza kiungo cha WhatsApp chenye ujumbe maalum
 * @param {string} customContext - Maelezo ya ziada ya safari au eneo
 */
function openWhatsAppChat(customContext = null) {
  let message = "Hello LOMA Adventures, I would like help planning my Tanzania trip.";

  // Angalia kama kuna muktadha maalum (safari fulani au eneo maalum)
  if (customContext) {
    message = `Hello LOMA Adventures, I am interested in: ${customContext}.`;
  } else {
    // Angalia kama kuna sifa ya 'data-tour-title' kwenye ukurasa
    const pageTour = document.querySelector('[data-tour-title]');
    if (pageTour) {
      const tourName = pageTour.getAttribute('data-tour-title');
      message = `Hello LOMA Adventures, I am interested in the ${tourName}.`;
    }
  }

  // Tumia muundo rasmi wa wa.me kufungua WhatsApp
  const encodedMsg = encodeURIComponent(message);
  const targetUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

  // Fungua kwenye tab mpya au programu ya simu
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Anzisha kidokezo cha msaada baada ya sekunde chache
 * Mtumiaji asipoikataa mara ya kwanza, ataikuta mara moja tu
 */
function initWhatsAppMicroInteraction() {
  const tooltip = document.getElementById('whatsappTooltip');
  const closeBtn = document.getElementById('closeWhatsappTooltip');
  const chatNowBtn = document.getElementById('whatsappTooltipChat');
  const mainBtn = document.getElementById('whatsappMainBtn');

  if (!tooltip) return;

  // Angalia kama mtumiaji alikwisha funga kidokezo hiki awali
  const isDismissed = localStorage.getItem('loma_wa_tooltip_dismissed');

  if (!isDismissed) {
    // Subiri sekunde 4 baada ya ukurasa kufunguka kabla ya kuonyesha kidokezo
    setTimeout(() => {
      tooltip.style.display = 'flex';
    }, 4000);
  }

  // Funga kidokezo na hifadhi kwenye localStorage
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.style.display = 'none';
      localStorage.setItem('loma_wa_tooltip_dismissed', 'true');
    });
  }

  // Bonyeza kuanzisha mazungumzo kutoka kwenye kidokezo
  if (chatNowBtn) {
    chatNowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsAppChat();
    });
  }

  // Kitufe kikuu cha 3D
  if (mainBtn) {
    mainBtn.addEventListener('click', () => {
      openWhatsAppChat();
    });
  }
}

// Subiri ukurasa umalize kupakia kabla ya kuanzisha
document.addEventListener('DOMContentLoaded', initWhatsAppMicroInteraction);
