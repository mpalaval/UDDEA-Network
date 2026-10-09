// src/js/opportunities.js
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.opt-filter-btn');
    const cards = document.querySelectorAll('.opportunity-card');
    const nearCheckbox = document.getElementById('nearFilter');

    function applyFilters() {
        const activeCategory = document.querySelector('.opt-filter-btn.active').textContent.toLowerCase();
        const nearOnly = nearCheckbox ? nearCheckbox.checked : false;

        cards.forEach(card => {
            const categoryTag = card.querySelector('.tag-category, .badge-premium');
            const locationTag = card.querySelector('.tag-location');

            const categoryText = categoryTag ? categoryTag.textContent.toLowerCase() : '';
            const locationText = locationTag ? locationTag.textContent.toLowerCase() : '';

            const matchesCategory = activeCategory === 'todas' || categoryText.includes(activeCategory);
            const matchesLocation = !nearOnly || locationText.includes('cercano') || locationText.includes('madrid');

            if (matchesCategory && matchesLocation) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyFilters();
        });
    });

    if (nearCheckbox) {
        nearCheckbox.addEventListener('change', applyFilters);
    }
});