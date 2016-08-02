
var tilesHeight = 83;
var tilesWidth = 101;

/* the speed multiplicator essentially is a multiplication factor on deltatime and the randomized speed integer
 * or in other words it represents how many times the speed integer is being multiplied to the time difference in
 * calculating the new x position
 */

var speedMultiplicator = (100 / 3);
var numberOfEnemies = 6;
var topOffset = tilesHeight / 2;

/* player icons and enemey icons, while they have the same height as the tiles for them to be alligned correctly
 * on the tiles we need to substract the y position with an offset set to half of the height of the "visual tile",
 * not the underlying picture height.
 */

var Enemy = function(row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = row * tilesHeight - topOffset;
    this.speed = speed * speedMultiplicator;
};

/* Function i found to pick a random number in an interval, used to dertermine row & speed of bugs */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Either adds new position based on speed or randomizes new speed and row if bug is outofbounds*/
Enemy.prototype.update = function(dt) {
    /* bugs are one directionally creatues, only leaping forward in life, hence we only have to check the upper bound */
    if (this.x > 505) {
        this.y = (getRandomInt(1, 4)) * tilesHeight - topOffset;
        this.speed = getRandomInt(1, 6) * speedMultiplicator;
        this.x = 0;
    }
    this.x = this.x + dt * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var allEnemies = [];
(function randomizeEnemies() {
    for (n = 0; n < numberOfEnemies; n++) {
        var row = getRandomInt(1, 4);
        var speed = getRandomInt(1, 6);
        allEnemies.push(new Enemy(row, speed));
    }
})();

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = tilesWidth * 2;
    this.y = 5 * tilesHeight - topOffset;
};

Player.prototype.handleInput = function(allowedKey) {
    switch (allowedKey) {
        case 'left':
            this.update(-tilesWidth, 0);
            break;
        case 'right':
            this.update(tilesWidth, 0);
            break;
        case 'up':
            this.update(0, -tilesHeight);
            break;
        case 'down':
                this.update(0, tilesHeight);
            break;
        default:
            this.x = this.x;
            this.y = this.y;
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(xDiff, yDiff) {
    if (this.x + xDiff < 505 && this.x + xDiff > -tilesWidth) {
        this.x = this.x + xDiff;
    }
    if (this.y + yDiff <= 5 * tilesHeight - topOffset && this.y + yDiff >= -topOffset) {
        this.y = this.y + yDiff;
    }
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
