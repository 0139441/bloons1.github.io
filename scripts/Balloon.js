import config from './config.js'
import { drawCircle, getRandomArbitrary } from './Utils.js'

const { BALLOONS_COLORS } = config;

class Balloon {
    constructor(hp, track) {
        this.track = track;
        this.trackIndex = 0;
        [this.x, this.y] = this.track[this.trackIndex];
        this.hp = hp;
        this.radius = config.BALLOON_RADIUS;
        this.offScreen = false;
        this.velocity = config.BALLOON_VELOCITY;
        this.color = BALLOONS_COLORS[getRandomArbitrary(0, BALLOONS_COLORS.length)];
    }

    draw(context) {
        drawCircle(context, this.x, this.y, this.radius, this.color);
        context.font = '12pt Arial, Helvetica, sans-serif';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(`${this.hp}`, this.x, this.y + config.TEXT_OFFSET);
    }

    update() {
        const [trackX, trackY] = this.track[this.trackIndex % this.track.length];

        if (this.trackIndex === this.track.length) {
            this.offScreen = true;
            return;
        }
        if (this.x >= trackX && this.y === trackY) {
            this.trackIndex++;
            return;
        }

        if (this.y < trackY) {
            this.y = this.y + this.velocity >= trackY ? trackY : this.y + this.velocity;
        }

        if (this.y > trackY) {
            this.y = this.y - this.velocity < - trackY ? trackY : this.y - this.velocity;
        }

        this.x = this.x + this.velocity >= trackX ? trackX : this.x + this.velocity;
    }
}

export { Balloon };