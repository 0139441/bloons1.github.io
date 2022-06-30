import { drawCircle } from './Utils.js'
import { Bullet } from './Bullet.js';
import config from './config.js';


class Player {
    constructor(x, y, range, damage, rate, image) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.damage = damage;
        this.rate = rate;
        this.bullets = [];
        this.size = config.PLAYER_SIZE;
        this.frames = 0;
        this.level = 1;
        this.image = image;
    }

    update() {
        this.bullets = this.bullets.filter((bullet) => !bullet.isOffScreen() || !bullet.hitTarget);
    }

    draw(context) {
        const pImage = new Image();
        pImage.src = this.image;
        context.drawImage(pImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        this.frames += 1;
    }

    drawRange(context) {
        context.font = '12pt Arial, Helvetica, sans-serif';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(`${this.level}`, this.x, this.y + config.TEXT_OFFSET);
        drawCircle(context, this.x, this.y, this.range, 'rgba(53, 53, 53, 0.1)');
    }

    shootAt(targetX, targetY) {
        if (this.frames >= this.rate) {
            this.bullets.push(new Bullet(this.x, this.y, targetX, targetY, this.damage));
            this.frames = 0;
        }
    }

    getClosestBalloon(balloons) {
        let closestDistance = this.range;
        let closestBalloon;
        balloons.forEach((balloon) => {
            const d = Math.sqrt(Math.pow(balloon.x - this.x, 2) + Math.pow(balloon.y - this.y, 2)) - config.PLAYER_SIZE / 2;
            if (d < closestDistance) {
                closestDistance = d;
                closestBalloon = balloon;
            }
        });
        return closestBalloon;
    }

    isInSpace(playerX, playerY) {
        if (playerX < this.x - this.size || playerX > this.x + this.size) {
            return false;
        }
        if (playerY < this.y - this.size || playerY > this.y + this.size) {
            return false;
        }
        return true;
    }

    isAt(cX, cY) {
        cX += this.size / 2;
        cY += this.size / 2;
        return cX >= this.x && cX <= this.x + this.size && cY >= this.y && cY <= this.y + this.size;
    }

    upgrade(game) {
        const price = config.BASE_UPGRADE_SIZE + (this.level - 1) * config.UPGRADE_LEVEL_PRICE;
        const upgradeValue = this.level % config.UPGRADE_MAX_DAMAGE;
        if (confirm(`Would you like to upgrade damage by ${upgradeValue} for ${price}$?`) && game.balance - price >= 0) {
            game.balance -= price;
            this.damage += upgradeValue;
            this.level += 1;
        }
    }
}

class Sniper extends Player {
    constructor(x, y) {
        super(x, y, config.SNIPER.range, config.SNIPER.damage, config.SNIPER.rate, config.SNIPER.image);
    }
}

class Cannon extends Player {
    constructor(x, y) {
        super(x, y, config.CANNON.range, config.CANNON.damage, config.CANNON.rate, config.CANNON.image);
    }
}

class Superman extends Player {
    constructor(x, y) {
        super(x, y, config.SUPERMAN.range, config.SUPERMAN.damage, config.SUPERMAN.rate, config.SUPERMAN.image);
    }
}


export { Player, Sniper, Cannon, Superman };