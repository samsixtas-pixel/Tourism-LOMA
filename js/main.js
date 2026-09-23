/**
 * ============================================================
 * LOMA ADVENTURES — MAIN APPLICATION SCRIPTS
 * ============================================================
 * Kuanzisha vipengele vikuu vya ukurasa:
 * - Kufuatilia usogaji wa ukurasa (IntersectionObserver kwa Scroll Reveals)
 * - Kushughulikia viungo vya urambazaji laini (Smooth anchor jumps)
 * - Kuanzisha mifumo ya kadi na vidokezo
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Huisha uhuishaji taratibu wa vipengele wakati vinapoingia kwenye skrini (Scroll Reveal)
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.reveal-fade').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Kwa vivinjari vya zamani visivyo na IntersectionObserver
    document.querySelectorAll('.reveal-fade').forEach(el => {
      el.classList.add('is-revealed');
    });
  }

  // 2. Weka mwaka wa sasa kwenye sehemu ya hakimiliki (Copyright year)
  const copyrightYearEl = document.getElementById('currentYear');
  if (copyrightYearEl) {
    copyrightYearEl.innerText = new Date().getFullYear();
  }
});
