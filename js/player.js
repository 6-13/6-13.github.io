const params = new URLSearchParams(window.location.search);
const gamePath = (params.get('game') || '').replaceAll('\\', '/');
const fileName = gamePath.split('/').pop() || 'SWF game';
const gameName = params.get('name') || fileName.replace(/\.swf$/i, '');
const loadPath = gamePath.split('/').map((segment) => encodeURIComponent(segment)).join('/');
const nameElement = document.querySelector('#game-name');
const logoElement = document.querySelector('#game-logo');
const playerHost = document.querySelector('#player');
const errorElement = document.querySelector('#player-error');
const playerFrame = document.querySelector('#player-frame');
const fullscreenButton = document.querySelector('#fullscreen-button');

nameElement.textContent = gameName;
document.title = `Play ${gameName}`;
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
    "the world's hardest game": 'images/worlds-hardest-game-logo.svg'
};
logoElement.src = logoPaths[gameName.toLowerCase()] || 'images/swf-game-logo.svg';
logoElement.addEventListener('error', () => {
    logoElement.src = 'images/swf-game-logo.svg';
}, { once: true });

if (!document.fullscreenEnabled) {
    fullscreenButton.hidden = true;
}

fullscreenButton.addEventListener('click', async () => {
    if (document.fullscreenElement) {
        await document.exitFullscreen();
    } else {
        await playerFrame.requestFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    const isFullscreen = document.fullscreenElement === playerFrame;
    fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    fullscreenButton.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
});

if (!/^swf\/[^/]+\.swf$/i.test(gamePath)) {
    playerHost.hidden = true;
    errorElement.hidden = false;
} else {
    const ruffle = window.RufflePlayer && window.RufflePlayer.newest();
    if (!ruffle) {
        playerHost.hidden = true;
        errorElement.textContent = 'The Flash player could not be loaded. Check your connection and try again.';
        errorElement.hidden = false;
    } else {
        const player = ruffle.createPlayer();
        player.style.width = '100%';
        player.style.height = '100%';
        playerHost.replaceChildren(player);
        player.load(loadPath).catch(() => {
            playerHost.hidden = true;
            errorElement.hidden = false;
        });
    }
}
