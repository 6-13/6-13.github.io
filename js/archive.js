const search = document.querySelector('#game-search');
const cards = [...document.querySelectorAll('.game-card')];
const filters = [...document.querySelectorAll('.filter-tab')];
const gameCount = document.querySelector('#game-count');

let activeFilter = 'all';

function updateGames() {


const query = search.value.trim().toLowerCase();

let visibleCount = 0;

cards.forEach((card) => {

    const name =
        (card.dataset.name || '').toLowerCase();

    const type =
        card.dataset.type || '';

    const matchesText =
        name.includes(query);

    const matchesType =
        activeFilter === 'all' ||
        type === activeFilter;

    const visible =
        matchesText && matchesType;

    card.hidden = !visible;

    if (visible) {
        visibleCount++;
    }
});


// Update the number shown above the grid.

if (gameCount) {

    const label =
        visibleCount === 1
            ? 'entry'
            : 'entries';

    gameCount.textContent =
        `${visibleCount} ${label}`;
}


}

// Search

search.addEventListener('input', updateGames);

// Filters

filters.forEach((filter) => {


filter.addEventListener('click', () => {

    activeFilter =
        filter.dataset.filter;

    filters.forEach((item) => {

        const selected =
            item === filter;

        item.classList.toggle(
            'selected',
            selected
        );

        item.setAttribute(
            'aria-selected',
            selected ? 'true' : 'false'
        );
    });

    updateGames();
});


});

// Press "/" to focus search

document.addEventListener('keydown', (event) => {

if (
    event.key === '/' &&
    document.activeElement !== search &&
    document.activeElement?.tagName !== 'INPUT' &&
    document.activeElement?.tagName !== 'TEXTAREA'
) {

    event.preventDefault();

    search.focus();
}


});

// Initial count

updateGames();
