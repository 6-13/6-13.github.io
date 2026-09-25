const search = document.querySelector('#game-search');
const cards = [...document.querySelectorAll('.game-card')];
const filters = [...document.querySelectorAll('.filter-tab')];
let activeFilter = 'all';

function updateGames() {
    const query = search.value.trim().toLowerCase();
    cards.forEach((card) => {
        const matchesText = card.dataset.name.toLowerCase().includes(query);
        const matchesType = activeFilter === 'all' || card.dataset.type === activeFilter;
        card.hidden = !(matchesText && matchesType);
    });
}

search.addEventListener('input', updateGames);
filters.forEach((filter) => {
    filter.addEventListener('click', () => {
        activeFilter = filter.dataset.filter;
        filters.forEach((item) => item.classList.toggle('selected', item === filter));
        updateGames();
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== search) {
        event.preventDefault();
        search.focus();
    }
});
