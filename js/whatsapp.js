/**
 * ============================================================
 * LOMA ADVENTURES — WHATSAPP INTERACTION SYSTEM
 * ============================================================
 * Handles:
 *   1. Client WhatsApp number
 *   2. Context-aware message building
 *   3. Professional message formatting from form data
 *   4. Redirect success modal with fallback link
 *   5. Micro-tooltip interaction
 *   6. Global helpers exposed on window
 */

/* Real LOMA Adventures WhatsApp number (international format, no + or spaces) */
const WHATSAPP_NUMBER = "255752610756";

/* ------------------------------------------------------------------
 * 1. CORE MESSAGING
 * ------------------------------------------------------------------ */

function openWhatsAppChat(customContext = null) {
  let message = "Hello LOMA Adventures, I would like help planning my Tanzania trip.";

  if (customContext) {
    message = `Hello LOMA Adventures, I am interested in: ${customContext}.`;
  } else {
    const pageTour = document.querySelector('[data-tour-title]');
    if (pageTour) {
      const tourName = pageTour.getAttribute('data-tour-title');
      message = `Hello LOMA Adventures, I am interested in the ${tourName}.`;
    }
  }

  sendWhatsAppMessage(message);
}

function formatWhatsAppMessage({ title, intro, fields = [], notes, outro } = {}) {
  const lines = [];
  lines.push("Hello LOMA Adventures,");
  lines.push("");

  if (title) lines.push(`*${title}*`);
  if (intro) lines.push(intro);

  const cleanFields = (fields || []).filter(
    (f) => f && f.value !== undefined && f.value !== null && String(f.value).trim() !== ""
  );

  if (cleanFields.length) {
    lines.push("");
    cleanFields.forEach(({ label, value }) => {
      lines.push(`*${label}:* ${value}`);
    });
  }

  if (notes && String(notes).trim() !== "") {
    lines.push("");
    lines.push("*Additional Notes:*");
    lines.push(String(notes).trim());
  }

  if (outro) {
    lines.push("");
    lines.push(outro);
  }

  lines.push("");
  lines.push("Thank you.");

  return lines.join("\n");
}

/**
 * Opens WhatsApp AND shows the redirect modal with a fallback link.
 * @param {string} message
 */
function sendWhatsAppMessage(message) {
  const text = typeof message === "string" ? message : String(message || "");
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Show the modal FIRST so the user sees feedback instantly
  showWhatsAppRedirectModal(url);

  // Attempt to open WhatsApp in a new tab/app
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (err) {
    /* Silently ignored — the modal's fallback link covers this case */
  }

  return { url, message: text };
}

/* ------------------------------------------------------------------
 * 2. REDIRECT SUCCESS MODAL
 * ------------------------------------------------------------------ */

const WA_MODAL_STYLE_ID = "lomaWaModalStyles";
const WA_MODAL_ID = "lomaWaModal";
let waModalAutoCloseTimer = null;

/** Injects the modal CSS once into the document head. */
function injectWhatsAppModalStyles() {
  if (document.getElementById(WA_MODAL_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = WA_MODAL_STYLE_ID;
  style.textContent = `
    .loma-wa-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(13, 40, 28, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .loma-wa-modal.active {
      opacity: 1;
      visibility: visible;
    }
    .loma-wa-modal-card {
      position: relative;
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border-radius: 24px;
      padding: 40px 32px 32px;
      text-align: center;
      box-shadow:
        0 30px 60px -15px rgba(13, 40, 28, 0.45),
        0 12px 24px -8px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
      transform: translateY(20px) scale(0.96);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .loma-wa-modal.active .loma-wa-modal-card {
      transform: translateY(0) scale(1);
    }
    .loma-wa-modal-close {
      position: absolute;
      top: 14px;
      right: 16px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: transparent;
      color: #5e6f66;
      font-size: 22px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
      border: none;
    }
    .loma-wa-modal-close:hover {
      background: #f3efe6;
      color: #0d281c;
    }
    .loma-wa-modal-icon {
      width: 78px;
      height: 78px;
      border-radius: 50%;
      margin: 0 auto 20px;
      background: radial-gradient(circle at 35% 30%, #5bf08d 0%, #25d366 45%, #189e49 85%, #0f7032 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 12px 28px rgba(37, 211, 102, 0.4),
        0 4px 10px rgba(0, 0, 0, 0.15),
        inset 0 3px 6px rgba(255, 255, 255, 0.6),
        inset 0 -4px 8px rgba(0, 0, 0, 0.25);
      position: relative;
      animation: lomaWaPulse 1.6s ease-in-out infinite;
    }
    .loma-wa-modal-icon::before {
      content: "";
      position: absolute;
      top: 8px;
      left: 16px;
      width: 42px;
      height: 22px;
      background: radial-gradient(ellipse at 50% 30%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 75%);
      border-radius: 50%;
      pointer-events: none;
    }
    .loma-wa-modal-icon svg {
      width: 42px;
      height: 42px;
      fill: #ffffff;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      position: relative;
      z-index: 1;
    }
    @keyframes lomaWaPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 12px 28px rgba(37, 211, 102, 0.4), 0 4px 10px rgba(0, 0, 0, 0.15), inset 0 3px 6px rgba(255, 255, 255, 0.6), inset 0 -4px 8px rgba(0, 0, 0, 0.25); }
      50% { transform: scale(1.05); box-shadow: 0 18px 36px rgba(37, 211, 102, 0.55), 0 6px 14px rgba(0, 0, 0, 0.2), inset 0 3px 6px rgba(255, 255, 255, 0.7), inset 0 -4px 8px rgba(0, 0, 0, 0.3); }
    }
    .loma-wa-modal-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #0d281c;
      margin: 0 0 10px;
      line-height: 1.2;
    }
    .loma-wa-modal-text {
      font-size: 0.95rem;
      color: #5e6f66;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .loma-wa-modal-fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px 22px;
      border-radius: 14px;
      background: linear-gradient(180deg, #25d366 0%, #1eb559 100%);
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      text-decoration: none;
      border: none;
      cursor: pointer;
      box-shadow:
        0 8px 20px rgba(37, 211, 102, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        inset 0 -2px 4px rgba(0, 0, 0, 0.15);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
    }
    .loma-wa-modal-fallback:hover {
      transform: translateY(-2px);
      box-shadow:
        0 14px 28px rgba(37, 211, 102, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -2px 4px rgba(0, 0, 0, 0.15);
    }
    .loma-wa-modal-fallback:active {
      transform: translateY(0) scale(0.98);
    }
    .loma-wa-modal-hint {
      margin: 18px 0 0;
      font-size: 0.78rem;
      color: #8b9c92;
      line-height: 1.5;
    }
    @media (max-width: 480px) {
      .loma-wa-modal-card {
        padding: 36px 24px 28px;
        border-radius: 20px;
      }
      .loma-wa-modal-icon { width: 68px; height: 68px; }
      .loma-wa-modal-icon svg { width: 36px; height: 36px; }
      .loma-wa-modal-title { font-size: 1.3rem; }
      .loma-wa-modal-text { font-size: 0.9rem; }
    }
  `;
  document.head.appendChild(style);
}

/** Injects the modal HTML once into the document body. */
function injectWhatsAppModalMarkup() {
  if (document.getElementById(WA_MODAL_ID)) return;

  const modal = document.createElement("div");
  modal.id = WA_MODAL_ID;
  modal.className = "loma-wa-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "lomaWaModalTitle");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="loma-wa-modal-card">
      <button type="button" class="loma-wa-modal-close" aria-label="Close">&times;</button>

      <div class="loma-wa-modal-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.3 1.1 1.2-4.2-.3-.5a11.6 11.6 0 1 1 9.4 5.5zm6.4-8.6c-.3-.2-2-.9-2.3-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1a8.9 8.9 0 0 1-4.2-3.6c-.3-.5.3-.5.9-1.7.1-.2 0-.4 0-.5s-.7-1.7-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.9 1.2 3.4 1.4 3.6 2.4 3.7 5.8 5.1c.8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.5z"/>
        </svg>
      </div>

      <h3 class="loma-wa-modal-title" id="lomaWaModalTitle">Opening WhatsApp…</h3>

      <p class="loma-wa-modal-text">
        Please continue the chat in the WhatsApp app to complete your inquiry with our team.
      </p>

      <a href="#" class="loma-wa-modal-fallback" id="lomaWaModalFallback" target="_blank" rel="noopener noreferrer">
        Open WhatsApp manually
      </a>

      <p class="loma-wa-modal-hint">
        Didn't see WhatsApp open? Tap the button above, or use the green icon at the bottom-right of the page.
      </p>
    </div>
  `;
  document.body.appendChild(modal);

  // Close handlers
  modal.querySelector(".loma-wa-modal-close")?.addEventListener("click", hideWhatsAppRedirectModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) hideWhatsAppRedirectModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      hideWhatsAppRedirectModal();
    }
  });
}

/** Displays the modal with the given WhatsApp URL bound to the fallback link. */
function showWhatsAppRedirectModal(waUrl) {
  injectWhatsAppModalStyles();
  injectWhatsAppModalMarkup();

  const modal = document.getElementById(WA_MODAL_ID);
  const fallback = document.getElementById("lomaWaModalFallback");
  if (!modal) return;

  if (fallback && waUrl) {
    fallback.href = waUrl;
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Auto-close after 8 seconds so the user returns to the page naturally
  if (waModalAutoCloseTimer) clearTimeout(waModalAutoCloseTimer);
  waModalAutoCloseTimer = setTimeout(hideWhatsAppRedirectModal, 8000);
}

function hideWhatsAppRedirectModal() {
  const modal = document.getElementById(WA_MODAL_ID);
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (waModalAutoCloseTimer) {
    clearTimeout(waModalAutoCloseTimer);
    waModalAutoCloseTimer = null;
  }
}

/* ------------------------------------------------------------------
 * 3. MICRO-TOOLTIP + GLOBAL EXPORTS
 * ------------------------------------------------------------------ */

function initWhatsAppMicroInteraction() {
  const tooltip = document.getElementById('whatsappTooltip');
  const closeBtn = document.getElementById('closeWhatsappTooltip');
  const chatNowBtn = document.getElementById('whatsappTooltipChat');
  const mainBtn = document.getElementById('whatsappMainBtn');

  if (!tooltip) return;

  const isDismissed = localStorage.getItem('loma_wa_tooltip_dismissed');

  if (!isDismissed) {
    setTimeout(() => {
      tooltip.style.display = 'flex';
    }, 4000);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.style.display = 'none';
      localStorage.setItem('loma_wa_tooltip_dismissed', 'true');
    });
  }

  if (chatNowBtn) {
    chatNowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsAppChat();
    });
  }

  if (mainBtn) {
    mainBtn.addEventListener('click', () => {
      openWhatsAppChat();
    });
  }
}

window.openWhatsAppChat = openWhatsAppChat;
window.formatWhatsAppMessage = formatWhatsAppMessage;
window.sendWhatsAppMessage = sendWhatsAppMessage;
window.showWhatsAppRedirectModal = showWhatsAppRedirectModal;
window.hideWhatsAppRedirectModal = hideWhatsAppRedirectModal;

document.addEventListener('DOMContentLoaded', initWhatsAppMicroInteraction);
