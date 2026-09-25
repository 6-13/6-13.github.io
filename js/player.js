const params = new URLSearchParams(window.location.search);

const gamePath = (params.get('game') || '')
.replaceAll('\', '/');

const fileName = gamePath.split('/').pop() || 'SWF game';

const gameName =
params.get('name') ||
fileName.replace(/.swf$/i, '');

const loadPath = gamePath
.split('/')
.map((segment) => encodeURIComponent(segment))
.join('/');

const nameElement = document.querySelector('#game-name');
const logoElement = document.querySelector('#game-logo');
const playerHost = document.querySelector('#player');
const errorElement = document.querySelector('#player-error');
const playerFrame = document.querySelector('#player-frame');
const fullscreenButton = document.querySelector('#fullscreen-button');

// ========================================
// GAME INFORMATION
// ========================================

nameElement.textContent = gameName;
document.title = `Play ${gameName}`;

// ========================================
// GAME LOGOS
//
// Keep these mappings even for games that
// have not been added to index.html yet.
// They will work automatically when you
// add the game later.
// ========================================

const logoPaths = {

// General games
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

"the world's hardest game":
    'images/worlds-hardest-game-logo.svg',


// Current SWF archive
'burrito bison revenge':
    'images/swf-game-logo.svg',

'maze evolution 3':
    'images/swf-game-logo.svg',

'raft wars':
    'images/swf-game-logo.svg',

'submachine':
    'images/swf-game-logo.svg',

'super soldier':
    'images/swf-game-logo.svg',

'age of war':
    'images/swf-game-logo.svg',

'my friend pedro':
    'images/swf-game-logo.svg',


// Current HTML games
'bloons td 5':
    'images/btd5.png',

'dadish 3':
    'images/dadish.jpg',

'eagle ride':
    'images/swf-game-logo.svg',

'earn to die':
    'images/moto2.jpg',

'earn to die 2':
    'images/moto2.jpg',

'fnaf 4':
    'images/scary.jpg',

'minesweeper':
    'images/blockblast.png',

'monkey mart':
    'images/mc.png',

"papa's bakeria":
    'images/burrito.jpg',

"papa's freezeria":
    'images/burrito.jpg',

"papa's pizzeria":
    'images/burrito.jpg',

"papa's taco mia":
    'images/burrito.jpg',

'pixel speedrun':
    'images/geometry-world.png',

// High quality collection
'gjallarhorn':
    'images/tag.png',

'glitter gunfire':
    'images/fnf.png',

'gof':
    'images/geometry-world.png',

'huecorn':
    'images/tag.png',

'poopicorn':
    'images/tag.png',

'racing':
    'images/moto2.jpg',

'rainboom':
    'images/giphy.gif',

'unicorn shooter':
    'images/tag.png',

'wonderful unicorn':
    'images/tag.png',

'just below':
    'images/scary.jpg',

'prismatic prey':
    'images/tag.png',

'unifrost':
    'images/giphy.gif'


};

// Use the matching logo when one exists.
// Otherwise use the generic SWF logo.

const logoKey = gameName.trim().toLowerCase();

logoElement.src =
logoPaths[logoKey] ||
'images/swf-game-logo.svg';

logoElement.addEventListener(
'error',
() => {
logoElement.src = 'images/swf-game-logo.svg';
},
{ once: true }
);

// ========================================
// FULLSCREEN
// ========================================

if (!document.fullscreenEnabled) {
fullscreenButton.hidden = true;
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

document.addEventListener('fullscreenchange', () => {


const isFullscreen =
    document.fullscreenElement === playerFrame;

fullscreenButton.setAttribute(
    'aria-label',
    isFullscreen
        ? 'Exit fullscreen'
        : 'Enter fullscreen'
);

fullscreenButton.title =
    isFullscreen
        ? 'Exit fullscreen'
        : 'Enter fullscreen';


});

// ========================================
// SWF VALIDATION
// ========================================
//
// Valid examples:
//
// swf/Burrito_Bison.swf
// swf/Burrito_Bison_Revenge.swf
// swf/Maze_Evolution_3.swf
// swf/Raft Wars.swf
// swf/Submachine.swf
// swf/Super_Soldier.swf
// swf/age-of-war-6165ed4.swf
// swf/myfriendpedro.swf
//
// Spaces in filenames are supported.
// ========================================

const validSwfPath =
/^swf/[^/]+.swf$/i.test(gamePath);

if (!validSwfPath) {


playerHost.hidden = true;

errorElement.textContent =
    'Invalid or missing SWF game path.';

errorElement.hidden = false;

} else {


const ruffle =
    window.RufflePlayer &&
    window.RufflePlayer.newest();

if (!ruffle) {

    playerHost.hidden = true;

    errorElement.textContent =
        'The Flash player could not be loaded. Check your connection and try again.';

    errorElement.hidden = false;

} else {

    try {

        const player = ruffle.createPlayer();

        player.style.width = '100%';
        player.style.height = '100%';

        playerHost.replaceChildren(player);

        player.load(loadPath).catch((error) => {

            console.error(
                `Failed to load SWF: ${loadPath}`,
                error
            );

            playerHost.hidden = true;

            errorElement.textContent =
                `Unable to load "${gameName}".`;

            errorElement.hidden = false;
        });

    } catch (error) {

        console.error(
            'Unable to create Ruffle player:',
            error
        );

        playerHost.hidden = true;

        errorElement.textContent =
            'Unable to initialize the Flash player.';

        errorElement.hidden = false;
    }
}


}
