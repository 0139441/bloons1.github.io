const config = {
    CANVAS_SIZE: [1600, 800],
    PRICES: { 'sniper': 500, 'cannon': 750, 'superman': 3000 },
    TRACK_PADDING: 30,
    MIN_BALLOONS: 20,
    DEFAULT_BALANCE: 1000 ,
    DEFAULT_HP: 100,
    BALLOON_RADIUS: 25,
    TEXT_OFFSET: 5,
    BALLOON_VELOCITY: 2,
    PLAYER_SIZE: 50,
    BASE_UPGRADE_SIZE: 1500,
    UPGRADE_LEVEL_PRICE: 1500,
    ROUND_INTERVAL: 600,
    BALLOONS_MIN_INTERVAL: 30,
    BALLOONS_MAX_INTERVAL: 80,
    BALLOONS_MULTIPLIER: 5,
    BALLOON_MIN_DAMAGE: 2,
    BALLOONS_COLORS: ['red', 'green', 'blue', 'yellow', 'orange', 'bisque', 'black', 'brown', 'grey', 'pink', 'navy', 'silver', 'tomato', 'violet', 'SeaGreen', 'plum', 'indigo'],
    BULLET_OFFSET: 10,
    UPGRADE_MAX_DAMAGE: 5,
    RESELL_VALUE: 300,
    BULLET_SIZE: 5,
    SNIPER: {
        range: 500,
        damage: 5,
        rate: 60,
        image: '../assets/sniper.png'
    },
    SUPERMAN: {
        range: 150,
        damage: 1,
        rate: 5,
        image: '../assets/superman.png'
    },
    CANNON: {
        range: 150,
        damage: 10,
        rate: 60,
        image: '../assets/cannon.png'
    }

}

export default config;