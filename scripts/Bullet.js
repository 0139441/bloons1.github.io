import { drawCircle } from './Utils.js'
import config from './config.js'

class Bullet {
    constructor(x, y, targetX, targetY, damage) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.x = x;
        this.y = y;
        this.xRatio = (this.targetX - this.x) / config.BULLET_OFFSET;
        this.yRatio = (this.targetY - this.y) / config.BULLET_OFFSET;
        this.hitTarget = false;
    }

    draw(context) {
        drawCircle(context, this.x, this.y, config.BULLET_SIZE, 'red');
    }

    update() {
        this.x += this.xRatio;
        this.y += this.yRatio;
    }

    isOffScreen() {
        const [width, height] = config.CANVAS_SIZE;
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }

    findHits(game, balloons) {
        balloons.forEach(balloon => {
            if (this.x > balloon.x - balloon.radius && this.x < balloon.x + balloon.radius && this.y > balloon.y - balloon.radius && this.y < balloon.y + balloon.radius) {
                game.balance += this.damage > balloon.hp ? balloon.hp : this.damage;
                balloon.hp -= this.damage;
                this.hitTarget = true;
            }
        });
    }
}

export { Bullet };