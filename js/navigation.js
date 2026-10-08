/**
 * ============================================================
 * LOMA ADVENTURES — RESPONSIVE NAVIGATION & DRAWER
 * ============================================================
 * Features:
 *   1. Sticky header scroll state
 *   2. Mobile drawer open / close
 *   3. Blurred backdrop behind the drawer (injected via JS)
 *   4. iOS-safe background scroll lock
 *   5. Close on tap outside (backdrop click)
 *   6. Close with Escape key
 *   7. Swipe-right-to-close gesture
 *   8. Accordion sub-menus with +/− indicator
 *   9. Auto-close on link tap
 */

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader    = document.querySelector('.site-header');
  const toggleBtn     = document.getElementById('mobileNavToggle');
  const mobileDrawer  = document.getElementById('mobileNavDrawer');
  const drawerCloseBtn= document.getElementById('closeMobileDrawer');

  /* ---------- 1. Header scroll state ---------- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) siteHeader?.classList.add('scrolled');
    else siteHeader?.classList.remove('scrolled');
  }, { passive: true });

  /* If this page has no drawer, stop here */
  if (!mobileDrawer) return;

  /* ---------- 2. Inject backdrop styles ---------- */
  const BACKDROP_ID = 'mobileNavBackdrop';
  const STYLE_ID    = 'mobileNavBackdropStyles';

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .mobile-nav-backdrop {
        position: fixed;
        inset: 0;
        /* one level below --z-drawer (1100) so the drawer sits on top */
        z-index: 1099;
        background: rgba(13, 40, 28, 0.45);
        backdrop-filter: blur(6px) saturate(140%);
        -webkit-backdrop-filter: blur(6px) saturate(140%);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          visibility 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: none;
      }
      .mobile-nav-backdrop.active {
        opacity: 1;
        visibility: visible;
      }
      /* Prevent the drawer itself from rubber-banding the page */
      .mobile-nav-drawer {
        overscroll-behavior: contain;
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------- 3. Inject the backdrop element ---------- */
  let backdrop = document.getElementById(BACKDROP_ID);
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = BACKDROP_ID;
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  /* ---------- 4. iOS-safe scroll lock ---------- */
  let savedScrollY = 0;

  function lockBackgroundScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${savedScrollY}px`;
    document.body.style.left     = '0';
    document.body.style.right    = '0';
    document.body.style.width    = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockBackgroundScroll() {
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.left     = '';
    document.body.style.right    = '';
    document.body.style.width    = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  }

  /* ---------- 5. Open / close ---------- */
  function openDrawer() {
    mobileDrawer.classList.add('active');
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    lockBackgroundScroll();
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    unlockBackgroundScroll();
  }

  /* ---------- 6. Triggers ---------- */
  toggleBtn?.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('active')) closeDrawer();
    else openDrawer();
  });

  drawerCloseBtn?.addEventListener('click', closeDrawer);

  /* Tap on the blurred area (outside the drawer) closes it */
  backdrop.addEventListener('click', closeDrawer);
  backdrop.addEventListener('touchstart', closeDrawer, { passive: true });

  /* Escape key closes it */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  /* Swipe right on the drawer closes it */
  let touchStartX = 0;
  let touchCurrentX = 0;
  mobileDrawer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
  }, { passive: true });
  mobileDrawer.addEventListener('touchmove', (e) => {
    touchCurrentX = e.touches[0].clientX;
  }, { passive: true });
  mobileDrawer.addEventListener('touchend', () => {
    if (touchCurrentX - touchStartX > 80) closeDrawer(); // ≥80px swipe-right
  }, { passive: true });

  /* ---------- 7. Accordion sub-menus ---------- */
  document.querySelectorAll('.mobile-nav-expandable > .mobile-link-head').forEach((head) => {
    head.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = head.parentElement;
      parent.classList.toggle('expanded');
      const indicator = head.querySelector('span');
      if (indicator) {
        indicator.textContent = parent.classList.contains('expanded') ? '−' : '+';
      }
    });
  });

  /* ---------- 8. Auto-close when a link is tapped ---------- */
  document.querySelectorAll('.mobile-drawer-body a:not(.mobile-link-head)').forEach((link) => {
    link.addEventListener('click', () => {
      setTimeout(closeDrawer, 120); // allow navigation to begin
    });
  });
});