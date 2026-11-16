document.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.querySelector('.filter-bar');
  const searchInput = document.getElementById('champ-search');
  const cards = Array.from(document.querySelectorAll('.champ-card'));
  const emptyState = document.getElementById('champ-empty-state');
  const countEl = document.getElementById('champ-count');

  if (!filterBar || cards.length === 0) {
    return;
  }

  let activeCost = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCost = card.dataset.cost || '';
      const cardText = (card.dataset.search || card.textContent || '').toLowerCase();

      const matchCost = activeCost === 'all' || cardCost === activeCost;
      const matchSearch = !searchTerm || cardText.includes(searchTerm);
      const isVisible = matchCost && matchSearch;

      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (countEl) {
      countEl.textContent = `目前顯示 ${visibleCount} / ${cards.length} 位英雄`;
    }

    if (emptyState) {
      emptyState.classList.toggle('is-hidden', visibleCount > 0);
    }
  };

  filterBar.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (!button) {
      return;
    }

    const filterType = button.dataset.filterType;
    const filterValue = button.dataset.filterValue;
    const group = button.closest('.filter-group');

    if (filterType !== 'cost' || !filterValue || !group) {
      return;
    }

    group.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    activeCost = filterValue;
    applyFilters();
  });

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  applyFilters();
});
