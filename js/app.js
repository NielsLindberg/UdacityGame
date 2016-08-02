var tilesHeight = 83;
var tilesWidth = 101;

/* the speed multiplicator essentially is a multiplication factor on deltatime and the randomized speed integer
 * or in other words it represents how many times the speed integer is being multiplied to the time difference in
 * calculating the new x position
 */
var speedMultiplicator = (100 / 3);
var numberOfEnemies = 6;
var topOffset = tilesHeight / 2;

/* Function i found to pick a random number in an interval, used to dertermine row & speed of bugs */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* The superclass Unit holds the properties and methods that are in common between the enemy and the player
 * In this case it is simply the variable for the image, the x & y positions and the render method
 */
var Unit = function(x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

// Draw the Unit on the screen, required method for game
Unit.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Enemy = function(row, speed) {
    Unit.call(this, 0, row * tilesHeight - topOffset, 'images/enemy-bug.png');
    this.speed = speed;
};

Enemy.prototype = Object.create(Unit.prototype);
Enemy.prototype.constructor = Enemy;

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

var Player = function() {
    Unit.call(this, tilesWidth * 2, 5 * tilesHeight - topOffset, 'images/char-boy.png');
};

Player.prototype = Object.create(Unit.prototype);
Player.prototype.constructor = Player;
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

/* updates the player positons with xDiff & yDiff if that doesnt put the player icon out of bounds */
Player.prototype.update = function(xDiff, yDiff) {
    if (this.x + xDiff < 505 && this.x + xDiff > -tilesWidth) {
        this.x = this.x + xDiff;
    }
    if (this.y + yDiff <= 5 * tilesHeight - topOffset && this.y + yDiff >= -topOffset) {
        this.y = this.y + yDiff;
    }
};

/* Initiate enemies */
var allEnemies = [];
/* runs an anonymous self-invoking function. that creates the initial enemies */
(function randomizeEnemies() {
    for (n = 0; n < numberOfEnemies; n++) {
        var row = getRandomInt(1, 4);
        var speed = getRandomInt(1, 6);
        allEnemies.push(new Enemy(row, speed * speedMultiplicator));
    }
})();

/* initiate player */
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
