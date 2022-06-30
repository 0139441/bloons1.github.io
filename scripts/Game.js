import { Sniper, Superman, Cannon } from './Players.js'
import { drawTrack, getRandomArbitrary, generateTrack, messageToScreen } from './Utils.js'
import { Balloon } from './Balloon.js';
import config from './config.js';

const { PRICES, TRACK_PADDING, DEFAULT_BALANCE, DEFAULT_HP, MIN_BALLOONS } = config;

class Game {
    constructor() {
        this.balloons = [];
        this.balloonsQueue = [];
        this.players = [];
        this.balance = DEFAULT_BALANCE;
        this.hp = DEFAULT_HP;
        this.round = 0;
        this.frames = 0;
        this.interval = getRandomArbitrary(config.BALLOONS_MIN_INTERVAL, config.BALLOONS_MAX_INTERVAL);
        this.track = generateTrack();
        this.generateRound();
    }

    findPlayer(x, y) {
        for (const player of this.players) {
            if (player.isAt(x, y)) {
                return player;
            }
        }
    }

    upgradePlayer(x, y) {
        const player = this.findPlayer(x, y);
        if (player) {
            player.upgrade(this);
        }
    }

    deletePlayer(x, y) {
        const player = this.findPlayer(x, y);
        if (player && window.confirm('Would you like to delete this for a 300$ refund?')) {
            this.balance += config.RESELL_VALUE;
            this.players = this.players.filter((p) => p !== player);
        }
    }

    nameToPlayer(name, x, y) {
        switch (name) {
            case 'sniper':
                return new Sniper(x, y);
            case 'superman':
                return new Superman(x, y);
            case 'cannon':
                return new Cannon(x, y);
            default:
                break;
        }
    }

    addPlayer(player, x, y) {

        if (this.isOnTrack(x, y) || this.hp <= 0) {
            return;
        }

        for (let index = 0; index < this.players.length; index++) {
            const p = this.players[index];
            if (p.isInSpace(x, y)) {
                return;
            }
        }
        if (this.balance - PRICES[player] >= 0) {
            this.players.push(this.nameToPlayer(player, x, y));
            this.balance -= PRICES[player];
        }
    }

    generateRound() {
        this.round++;
        for (let index = 0; index < MIN_BALLOONS + this.round * config.BALLOONS_MULTIPLIER; index++) {
            this.balloonsQueue.push(new Balloon(getRandomArbitrary(config.BALLOON_MIN_DAMAGE, this.round * config.BALLOONS_MULTIPLIER), this.track));
        }
    }

    isOnTrack(x, y) {
        for (let index = 0; index < this.track.length - 1; index++) {
            const [x1, y1] = this.track[index];
            const [x2, y2] = this.track[index + 1];

            if (x1 === x2 && x >= x1 - TRACK_PADDING && x <= x1 + TRACK_PADDING) {
                return y >= y1 - TRACK_PADDING && y <= y2 + TRACK_PADDING || y >= y2 - TRACK_PADDING && y <= y1 + TRACK_PADDING;
            }
            if (y1 === y2 && y >= y1 - TRACK_PADDING && y <= y1 + TRACK_PADDING) {
                if ((x >= x1 - TRACK_PADDING && x <= x2 + TRACK_PADDING) || (x >= x2 - TRACK_PADDING && x <= x1 + TRACK_PADDING)) {
                    return true;
                }
            }
        }
        return false;
    }

    update(context, canvas, cursor, mouseX, mouseY) {
        context.fillStyle = "rgba(75, 237, 124, 0.8)";
        context.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);

        drawTrack(context, this.track);

        if (cursor) {
            const p = this.nameToPlayer(cursor, mouseX, mouseY);
            p.draw(context);
            p.drawRange(context);
        }

        if (this.balloons.length === 0 && this.balloonsQueue.length === 0 && this.frames >= config.ROUND_INTERVAL) {
            this.generateRound();
            this.frames = 0;
        }

        if (this.frames >= this.interval && this.balloonsQueue.length) {
            this.interval = getRandomArbitrary(config.BALLOONS_MIN_INTERVAL, config.BALLOONS_MAX_INTERVAL);
            this.balloons.push(this.balloonsQueue.pop());
            this.frames = 0;
        }

        this.balloons = this.balloons.filter((balloon) => balloon.hp > 0 && !balloon.offScreen);

        this.balloons.forEach((balloon) => {
            balloon.update();
            balloon.draw(context);
            if (balloon.offScreen) {
                this.hp -= balloon.hp;
            }
        });

        this.players.forEach((player) => {
            player.update();
            player.draw(context);

            if (player.isAt(mouseX, mouseY)) {
                player.drawRange(context);
            }

            const closestBalloon = player.getClosestBalloon(this.balloons);
            if (closestBalloon) {
                player.shootAt(closestBalloon.x, closestBalloon.y);
            }
            player.bullets.forEach((bullet) => {
                if (!bullet.hitTarget) {
                    bullet.update();
                    bullet.draw(context);
                    bullet.findHits(this, this.balloons);
                }
            })
        });

        if (this.hp <= 0) {
            messageToScreen(context, 'GAME OVER', 120, config.CANVAS_SIZE[0] / 2, config.CANVAS_SIZE[1] / 2);
        }

        this.frames += 1;
        document.getElementById('hp').innerText = this.hp > 0 ? `HP: ${this.hp}` : 'YOU LOST';
        document.getElementById('round').innerText = `ROUND: ${this.round}`;
        document.getElementById('balance').innerText = `BALANCE: ${this.balance}`;
    }
}

export { Game };