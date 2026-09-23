/**
 * ============================================================
 * LOMA ADVENTURES — RESPONSIVE NAVIGATION & DRAWER
 * ============================================================
 * Mfumo wa uendeshaji wa menyu za tovuti:
 * 1. Kufungua na kufunga droo ya simu (Mobile Navigation Drawer)
 * 2. Kufungua menyu ndogo kwenye simu (Accordion Sub-menus)
 * 3. Kurekebisha urefu wa ubao wa juu wakati wa kuteremsha ukurasa (Sticky Header)
 * 4. Kuzuia kusonga kwa ukurasa wakati menyu imefunguliwa (Body scroll lock)
 */

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.querySelector('.site-header');
  const toggleBtn = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const drawerCloseBtn = document.getElementById('closeMobileDrawer');

  // 1. Badili muonekano wa Header wakati mtumiaji anateremsha ukurasa (Scroll)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Fungua droo ya simu wakati hamburger inapobonyezwa
  if (toggleBtn && mobileDrawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  // 3. Funga droo ya simu
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  function openDrawer() {
    mobileDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden'; // Zuia kusonga kwa ukurasa chini
    toggleBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    document.body.style.overflow = ''; // Rudisha usogaji wa ukurasa
    toggleBtn?.setAttribute('aria-expanded', 'false');
  }

  // 4. Menyu ndogo zinazofunguka kwenye simu (Expandable Accordion)
  const expandableLinks = document.querySelectorAll('.mobile-nav-expandable > .mobile-link-head');
  expandableLinks.forEach(head => {
    head.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = head.parentElement;
      parent.classList.toggle('expanded');
    });
  });

  // Funga droo iwapo kiungo chochote kimebonyezwa
  const drawerLinks = document.querySelectorAll('.mobile-drawer-body a:not(.mobile-link-head)');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
});
