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
    'btd5': 'images/bltd5.png',
    'bloons td 5': 'images/bltd5.png',

    'burrito bison': 'images/burritobisonOG.png',

    'clumsy bird': 'images/ck.png',
    'cookie clicker': 'images/giphy.gif',

    'dadish': 'images/dadish.jpg',
    'dadish 2': 'images/dadish2.png',
    'dadish 3': 'images/dadish.jpg',

    'drive mad': 'images/drivemad.png',
    'driving wild': 'images/drivemad.png',

    'eagle ride': 'images/eagleride.png',

    'earn to die': 'images/earntodie.png',
    'earn to die 2': 'images/earntodie2.png',

    'flappy bird': 'images/flappybird.jfif',
    'friday night funkin': 'images/fnf.png',
    'fruit ninja': 'images/fruitninja.png',

    'geometry dash meltdown': 'images/geometry-world.png',

    'golf': 'images/golf.png',
    'granny': 'images/granny.png',

    'minecraft': 'images/mc.png',
    'moto x3m': 'images/moto2.jpg',

    'plants vs zombies': 'images/pvz.png',
    'pvz': 'images/pvz.png',

    'ragdoll archers': 'images/ragdoll archers.png',
    'ragdoll hit': 'images/ragdoll hit.png',

    'scary maze': 'images/scary.jpg',
    'stickman hook': 'images/stickman.png',
    'subway surfers': 'images/subway.png',
    'temple run': 'images/temple.png',
    'ultrakill': 'images/ultrakill.png',

    'learn to fly': 'images/learn-to-fly-logo.svg',
    'red ball 4': 'images/red-ball-4-logo.svg',
    "the world's hardest game": 'images/worlds-hardest-game-logo.svg',

    // SWF archive
    'age of war': 'images/ageofwarn.png',
    'maze evolution 3': 'images/MazeEvolution3.png',
    'my friend pedro': 'images/myfriendpedro.png',
    'submachine': 'images/submachine.png',
    'super soldier': 'images/supersoldier.png',

    // HTML games
    'fnaf 4': 'images/fnaf4.png',
    'minesweeper': 'images/minesweeper.png',
    'monkey mart': 'images/monkeymart.png',

    "papa's bakeria": 'images/burrito.jpg',
    "papa's freezeria": 'images/burrito.jpg',
    "papa's pizzeria": 'images/burrito.jpg',
    "papa's taco mia": 'images/burrito.jpg',

    'pixel speedrun': 'images/pixelspeedrun.png',

    // High-quality collection
    'gjallarhorn': 'images/gjallarhorn.png',
    'prismatic prey': 'images/prismaticprey.png',
    'unifrost': 'images/unifrost.png',

    'huecorn': 'images/huecorn.png',
    'poopicorn': 'images/poopicorn.png',
    'racing': 'images/racing.png',
    'rainbow': 'images/rainboom.png',
    'unicorn shooter': 'images/unicornshooter.png',
    'wonderful unicorn': 'images/wonderfulunicorn.png'
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