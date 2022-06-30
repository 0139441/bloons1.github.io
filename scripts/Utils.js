import config from "./config.js";

function canvasToImage(canvas) {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    a.download = "image.png";
    a.click();
}

function messageToScreen(context, msg, fontSize, x, y) {
    context.font = `${fontSize}pt Arial, Helvetica, sans-serif`;
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(msg, x, y);
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function drawTrack(context, track) {
    context.lineWidth = 15;
    context.beginPath();
    context.moveTo(track[0][0], track[0][1]);
    for (let index = 1; index < track.length; index++) {
        const [x, y] = track[index];
        context.lineTo(x, y);
    }
    context.stroke();
}

function drawCircle(context, x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.closePath();
}

function generateTrack() {
    const [width, height] = config.CANVAS_SIZE;
    const cellSize = config.PLAYER_SIZE * 2;

    let track = [[cellSize, height]];

    for (let column = 1; column < width / cellSize; column++) {
        const [lastX, lastY] = track.pop();
        const y = getRandomArbitrary(1, (height / cellSize) - 1) * cellSize;

        if (y === lastY) {
            track.push([lastX, lastY]);
            track.push([column * cellSize, y]);
        } else {
            track.push([lastX, lastY]);
            track.push([column * cellSize, lastY]);
            track.push([column * cellSize, y]);
        }
    }

    track.push([width, track[track.length - 1][1]]);
    track.shift();
    return track;
}

export { getRandomArbitrary, drawCircle, drawTrack, canvasToImage, generateTrack, messageToScreen };