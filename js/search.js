/**
 * ============================================================
 * LOMA ADVENTURES — GLOBAL SEARCH MODAL
 * ============================================================
 * Mfumo wa kutafuta taarifa kwa haraka kote kwenye tovuti:
 * - Safari (Tours)
 * - Maeneo (Destinations)
 * - Matukio (Experiences)
 * - Miongozo ya Kusafiri (Travel Guides)
 *
 * Mtumiaji anaweza kufungua dirisha hili kwa kubonyeza ikoni
 * au kubonyeza mkato wa kibodi (kama 'Cmd+K' au 'Ctrl+K').
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchTriggers = document.querySelectorAll('.search-trigger-btn');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('globalSearchInput');
  const searchResults = document.getElementById('searchResultsArea');

  // Mkusanyiko wa maudhui ya kielelezo (Mock indexed data kwa ajili ya frontend)
  // Baadaye taarifa hizi zitatafutwa kupitia API ya ElasticSearch au Database
  const searchableData = [
    { title: "7-Day Northern Safari", category: "Tour Package", link: "tours/7-day-northern-safari.html", tags: "tarangire serengeti ngorongoro private" },
    { title: "Serengeti National Park", category: "Destination", link: "pages/destinations.html#serengeti", tags: "wildlife migration lions plains" },
    { title: "Ngorongoro Crater", category: "Destination", link: "pages/destinations.html#ngorongoro", tags: "caldera big five caldera rhino" },
    { title: "Kilimanjaro Machame Route", category: "Climbing Tour", link: "pages/kilimanjaro.html#machame", tags: "summit trekking uhuru peak camping" },
    { title: "Zanzibar Beaches & Stone Town", category: "Beach Holiday", link: "pages/zanzibar.html", tags: "ocean turquoise sand spices culture" },
    { title: "Tanzania Visa & Entry Requirements", category: "Travel Guide", link: "pages/travel-guide.html#visa", tags: "passport visa entry arrival requirements" },
    { title: "What to Pack for Safari", category: "Travel Essentials", link: "pages/travel-guide.html#packing", tags: "packing clothes boots camera safari gear" },
    { title: "Best Time to Visit Tanzania", category: "Seasonal Guide", link: "pages/travel-guide.html#season", tags: "weather migration rain months dry season" }
  ];

  // Fungua dirisha la utafutaji
  searchTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  // Funga dirisha la utafutaji
  searchClose?.addEventListener('click', closeSearch);

  // Funga kwa kubonyeza nje ya kontena au kitufe cha ESC
  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal?.classList.contains('active')) {
      closeSearch();
    }
    // Mkato wa Cmd+K au Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal?.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  });

  function openSearch() {
    searchModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 100);
  }

  function closeSearch() {
    searchModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Utaratibu wa kuchuja matokeo kulingana na maandishi yaliyoandikwa
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderDefaultSuggestions();
      return;
    }

    const matches = searchableData.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.tags.toLowerCase().includes(query)
    );

    renderSearchResults(matches, query);
  });

  function renderDefaultSuggestions() {
    if (!searchResults) return;
    searchResults.innerHTML = `
      <div class="search-empty-state">
        <p style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.5rem;">Popular Searches</p>
        <div class="search-tag-group">
          <span class="search-tag" onclick="quickFillSearch('Serengeti')">Serengeti</span>
          <span class="search-tag" onclick="quickFillSearch('Kilimanjaro')">Kilimanjaro</span>
          <span class="search-tag" onclick="quickFillSearch('Zanzibar')">Zanzibar</span>
          <span class="search-tag" onclick="quickFillSearch('7-Day Northern')">Northern Safari</span>
          <span class="search-tag" onclick="quickFillSearch('Visa')">Visa & Entry</span>
          <span class="search-tag" onclick="quickFillSearch('Packing')">Packing List</span>
        </div>
      </div>
    `;
  }

  function renderSearchResults(matches, query) {
    if (!searchResults) return;
    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">
          <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
          <p style="font-size: 0.85rem;">Try searching for <em>Serengeti</em>, <em>Kilimanjaro</em>, or <em>Visa</em>.</p>
        </div>
      `;
      return;
    }

    const itemsHtml = matches.map(item => `
      <a href="${item.link}" class="search-result-item" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-radius: var(--radius-md); border-bottom: 1px solid var(--color-border); transition: background 0.2s;">
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--color-primary-dark);">${escapeHtml(item.title)}</h4>
          <span style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; text-transform: uppercase;">${escapeHtml(item.category)}</span>
        </div>
        <span style="font-size: 0.85rem; color: var(--color-text-muted);">View &rarr;</span>
      </a>
    `).join('');

    searchResults.innerHTML = `<div style="display: flex; flex-direction: column; gap: 0.25rem;">${itemsHtml}</div>`;
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }

  window.quickFillSearch = function(text) {
    if (searchInput) {
      searchInput.value = text;
      searchInput.dispatchEvent(new Event('input'));
    }
  };

  renderDefaultSuggestions();
});
