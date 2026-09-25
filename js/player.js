
const params = new URLSearchParams(window.location.search);

const gamePath = (params.get('game') || '').replaceAll('\\', '/').trim();
const fileName = gamePath.split('/').pop() || 'SWF Game';

const gameName =
    params.get('name')?.trim() ||
    fileName.replace(/\.swf$/i, '') ||
    'SWF Game';

const loadPath = gamePath
    .split('/')
    .map(encodeURIComponent)
    .join('/');

const nameElement = document.querySelector('#game-name');
const logoElement = document.querySelector('#game-logo');
const playerHost = document.querySelector('#player');
const errorElement = document.querySelector('#player-error');
const playerFrame = document.querySelector('#player-frame');
const fullscreenButton = document.querySelector('#fullscreen-button');

const logoPaths = {
    '2048': 'images/2048.png',
    'angry birds': 'images/angrybirds2.png',
    'angry birds 2': 'images/angrybirds2.png',
    'baldi': 'images/baldis.png',
    "baldi's basics": 'images/baldis.png',
    'bad piggies': 'images/badpiggies.jfif',
    'block blast': 'images/blockblast.png',
    'btd5': 'images/btd5.png',
    'burrito bison': 'images/burrito.jpg',
    'clumsy bird': 'images/ck.png',
    'cookie clicker': 'images/giphy.gif',
    'dadish': 'images/dadish.jpg',
    'dadish 2': 'images/dadish2.png',
    'drive mad': 'images/drivemad.png',
    'flappy bird': 'images/flappybird.jfif',
    'friday night funkin': 'images/fnf.png',
    'fruit ninja': 'images/fruitninja.png',
    'geometry dash meltdown': 'images/geometry-world.png',
    'granny': 'images/granny.png',
    'minecraft': 'images/mc.png',
    'moto x3m': 'images/moto2.jpg',
    'plants vs zombies': 'images/pvz.png',
    'pvz': 'images/pvz.png',
    'ragdoll archers': 'images/ragdoll archers.png',
    'ragdoll hit': 'images/ragdollhit.png',
    'scary maze': 'images/scary.jpg',
    'stickman hook': 'images/stickman.png',
    'subway surfers': 'images/subway.png',
    'temple run': 'images/temple.png',
    'ultrakill': 'images/ultrakill.png',
    'learn to fly': 'images/learn-to-fly-logo.svg',
    'red ball 4': 'images/red-ball-4-logo.svg',
    "the world's hardest game": 'images/worlds-hardest-game-logo.svg',

    'burrito bison revenge': 'images/swf-game-logo.svg',
    'maze evolution 3': 'images/swf-game-logo.svg',
    'raft wars': 'images/swf-game-logo.svg',
    'submachine': 'images/swf-game-logo.svg',
    'super soldier': 'images/swf-game-logo.svg',
    'age of war': 'images/swf-game-logo.svg',
    'my friend pedro': 'images/swf-game-logo.svg',

    'bloons td 5': 'images/btd5.png',
    'dadish 3': 'images/dadish.jpg',
    'eagle ride': 'images/swf-game-logo.svg',
    'earn to die': 'images/moto2.jpg',
    'earn to die 2': 'images/moto2.jpg',
    'fnaf 4': 'images/scary.jpg',
    'minesweeper': 'images/blockblast.png',
    'monkey mart': 'images/mc.png',
    "papa's bakeria": 'images/burrito.jpg',
    "papa's freezeria": 'images/burrito.jpg',
    "papa's pizzeria": 'images/burrito.jpg',
    "papa's taco mia": 'images/burrito.jpg',
    'pixel speedrun': 'images/geometry-world.png',

    'gjallarhorn': 'images/tag.png',
    'glitter gunfire': 'images/fnf.png',
    'gof': 'images/geometry-world.png',
    'huecorn': 'images/tag.png',
    'poopicorn': 'images/tag.png',
    'racing': 'images/moto2.jpg',
    'rainboom': 'images/giphy.gif',
    'unicorn shooter': 'images/tag.png',
    'wonderful unicorn': 'images/tag.png',
    'just below': 'images/scary.jpg',
    'prismatic prey': 'images/tag.png',
    'unifrost': 'images/giphy.gif'
};

const DEFAULT_LOGO = 'images/swf-game-logo.svg';

function showError(message) {
    if (playerHost) playerHost.hidden = true;

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
    }
}

function setGameInfo() {
    if (nameElement) {
        nameElement.textContent = gameName;
    }

    document.title = `Play ${gameName}`;

    if (!logoElement) return;

    const logoKey = gameName.toLowerCase();
    logoElement.src = logoPaths[logoKey] || DEFAULT_LOGO;

    logoElement.addEventListener(
        'error',
        () => {
            if (logoElement.src.endsWith(DEFAULT_LOGO)) return;
            logoElement.src = DEFAULT_LOGO;
        },
        { once: true }
    );
}

function setupFullscreen() {
    if (!fullscreenButton || !playerFrame) return;

    if (!document.fullscreenEnabled) {
        fullscreenButton.hidden = true;
        return;
    }

    fullscreenButton.addEventListener('click', async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await playerFrame.requestFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    });

    const updateFullscreenState = () => {
        const isFullscreen = document.fullscreenElement === playerFrame;
        const label = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';

        fullscreenButton.setAttribute('aria-label', label);
        fullscreenButton.title = label;
    };

    document.addEventListener('fullscreenchange', updateFullscreenState);
    updateFullscreenState();
}

function isValidSwfPath(path) {
    return /^swf\/[^/]+\.swf$/i.test(path);
}

async function loadGame() {
    if (!playerHost) {
        console.error('Missing #player element.');
        return;
    }

    if (!isValidSwfPath(gamePath)) {
        showError('Invalid or missing SWF game path.');
        return;
    }

    const ruffle =
        window.RufflePlayer?.newest?.();

    if (!ruffle) {
        showError(
            'The Flash player could not be loaded. Check your connection and try again.'
        );
        return;
    }

    try {
        const player = ruffle.createPlayer();

        player.style.width = '100%';
        player.style.height = '100%';

        playerHost.replaceChildren(player);

        await player.load(loadPath);
    } catch (error) {
        console.error(`Failed to load SWF: ${loadPath}`, error);
        showError(`Unable to load "${gameName}".`);
    }
}

setGameInfo();
setupFullscreen();
loadGame();
