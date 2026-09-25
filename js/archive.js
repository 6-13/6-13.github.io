
const search = document.querySelector('#game-search');
const cards = Array.from(document.querySelectorAll('.game-card'));
const filters = Array.from(document.querySelectorAll('.filter-tab'));
const gameCount = document.querySelector('#game-count');

let activeFilter = 'all';

const normalizedCards = cards.map((card) => ({
    element: card,
    name: (card.dataset.name || '').trim().toLowerCase(),
    type: (card.dataset.type || '').trim().toLowerCase()
}));

function updateGames() {
    const query = search?.value.trim().toLowerCase() || '';
    let visibleCount = 0;

    for (const { element, name, type } of normalizedCards) {
        const visible =
            (!query || name.includes(query)) &&
            (activeFilter === 'all' || type === activeFilter);

        element.hidden = !visible;

        if (visible) {
            visibleCount++;
        }
    }

    if (gameCount) {
        gameCount.textContent =
            `${visibleCount} ${visibleCount === 1 ? 'entry' : 'entries'}`;
    }
}

function setActiveFilter(filter) {
    const value = filter.dataset.filter?.trim().toLowerCase();

    if (!value) return;

    activeFilter = value;

    for (const item of filters) {
        const selected = item === filter;

        item.classList.toggle('selected', selected);
        item.setAttribute('aria-selected', String(selected));
    }

    updateGames();
}

search?.addEventListener('input', updateGames);

for (const filter of filters) {
    filter.addEventListener('click', () => {
        setActiveFilter(filter);
    });
}

document.addEventListener('keydown', (event) => {
    if (
        event.key !== '/' ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return;
    }

    const target = event.target;

    if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
    ) {
        return;
    }

    event.preventDefault();
    search?.focus();
});

updateGames();

