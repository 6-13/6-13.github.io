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
    'age of war': 'images/ageofwarn.png',
    'burrito bison': 'images/burritobisonOG.png',
    'maze evolution 3': 'images/MazeEvolution3.png',
    'my friend pedro': 'images/myfriendpedro.png',
    'submachine': 'images/submachine.png',
    'super soldier': 'images/supersoldier.png',
    'bloons td 5': 'images/bltd5.png',
    'dadish 3': 'images/dadish.jpg',
    'driving wild': 'images/drivemad.png',
    'eagle ride': 'images/eagleride.png',
    'earn to die': 'images/earntodie.png',
    'earn to die 2': 'images/earntodie2.png',
    'fnaf 4': 'images/fnaf4.png',
    'golf': 'images/golf.png',
    'huecorn': 'images/huecorn.png',
    'minesweeper': 'images/minesweeper.png',
    'monkey mart': 'images/monkeymart.png',
    "papa's bakeria": 'images/burrito.jpg',
    "papa's freezeria": 'images/burrito.jpg',
    "papa's pizzeria": 'images/burrito.jpg',
    "papa's taco mia": 'images/burrito.jpg',
    'pixel speedrun': 'images/pixelspeedrun.png',
    'poopicorn': 'images/poopicorn.png',
    'racing': 'images/racing.png',
    'rainbow': 'images/rainboom.png',
    'unicorn shooter': 'images/unicornshooter.png',
    'wonderful unicorn': 'images/wonderfulunicorn.png',
    'gjallarhorn': 'images/gjallarhorn.png',
    'prismatic prey': 'images/prismaticprey.png',
    'unifrost': 'images/unifrost.png'
};

const DEFAULT_LOGO = 'images/swf-game-logo.svg';

function showError(message) {
    if (playerHost) {
        playerHost.hidden = true;
    }

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

    if (!logoElement) {
        return;
    }

    const logoKey = gameName.toLowerCase();

    logoElement.src = logoPaths[logoKey] || DEFAULT_LOGO;

    logoElement.addEventListener(
        'error',
        () => {
            if (logoElement.src.endsWith(DEFAULT_LOGO)) {
                return;
            }

            logoElement.src = DEFAULT_LOGO;
        },
        { once: true }
    );
}

function setupFullscreen() {
    if (!fullscreenButton || !playerFrame) {
        return;
    }

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
        const isFullscreen =
            document.fullscreenElement === playerFrame;

        const label = isFullscreen
            ? 'Exit fullscreen'
            : 'Enter fullscreen';

        fullscreenButton.setAttribute(
            'aria-label',
            label
        );

        fullscreenButton.title = label;
    };

    document.addEventListener(
        'fullscreenchange',
        updateFullscreenState
    );

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
        console.error(
            `Failed to load SWF: ${loadPath}`,
            error
        );

        showError(
            `Unable to load "${gameName}".`
        );
    }
}

setGameInfo();
setupFullscreen();
loadGame();