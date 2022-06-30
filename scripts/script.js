import { Game } from './Game.js';
import { canvasToImage, messageToScreen } from './Utils.js';
import config from './config.js';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const game = new Game();

let pause = false;
let cursor, mouseX, mouseY;

function windowPosToCanvasPos(x, y) {
    return [x - canvas.getBoundingClientRect().left, y - canvas.getBoundingClientRect().top];
}

canvas.addEventListener('mousemove', (event) => {
    [mouseX, mouseY] = windowPosToCanvasPos(event.clientX, event.clientY);
});

canvas.addEventListener('click', (event) => {
    const [targetX, targetY] = windowPosToCanvasPos(event.clientX, event.clientY);
    if (cursor) {
        game.addPlayer(cursor, targetX, targetY);
        cursor = undefined;
    } else {
        game.deletePlayer(targetX, targetY);
    };
});

canvas.addEventListener('contextmenu', (event) => {
    const [targetX, targetY] = windowPosToCanvasPos(event.clientX, event.clientY);
    event.preventDefault();
    game.upgradePlayer(targetX, targetY);
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
        pause = !pause;
    }
    else if (event.key === 's') {
        canvasToImage(canvas);
    }
    else if (event.key === 'Escape') {
        cursor = undefined;
    }
});

document.getElementById('cannon').innerText = `Buy for ${config.PRICES.cannon}$`;
document.getElementById('superman').innerText = `Buy for ${config.PRICES.superman}$`;
document.getElementById('sniper').innerText = `Buy for ${config.PRICES.sniper}$`;

document.getElementById('sniper').addEventListener('click', (event) => {
    if (event.target.className === 'buy') {
        cursor = (cursor === 'sniper') ? undefined : 'sniper'
    }
});

document.getElementById('superman').addEventListener('click', (event) => {
    if (event.target.className === 'buy') {
        cursor = (cursor === 'superman') ? undefined : 'superman'
    }
});

document.getElementById('cannon').addEventListener('click', (event) => {
    if (event.target.className === 'buy') {
        cursor = (cursor === 'cannon') ? undefined : 'cannon';
    }
});

function gameLoop() {
    canvas.style.cursor = cursor ? 'crosshair' : 'pointer';
    if (pause) {
        messageToScreen(context, 'PAUSED', 120, config.CANVAS_SIZE[0] / 2, config.CANVAS_SIZE[1] / 2);
    } else {
        game.update(context, canvas, cursor, mouseX, mouseY);
    }
    window.requestAnimationFrame(gameLoop);
}

gameLoop();