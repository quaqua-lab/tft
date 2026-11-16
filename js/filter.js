document.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.querySelector('.filter-bar');
  const cards = Array.from(document.querySelectorAll('.comp-card'));
  const emptyState = document.getElementById('empty-state');

  if (!filterBar || cards.length === 0) {
    return;
  }

  let activeTier = 'all';
  let activeStyle = 'all';

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardTier = card.dataset.tier || '';
      const cardStyle = card.dataset.style || '';

      const matchTier = activeTier === 'all' || cardTier === activeTier;
      const matchStyle = activeStyle === 'all' || cardStyle === activeStyle;
      const isVisible = matchTier && matchStyle;

      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

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

    if (!filterType || !filterValue || !group) {
      return;
    }

    group.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    if (filterType === 'tier') {
      activeTier = filterValue;
    } else if (filterType === 'style') {
      activeStyle = filterValue;
    }

    applyFilters();
  });

  applyFilters();
});
