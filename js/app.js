var TILES_HEIGHT = 83;
var TILES_WIDTH = 101;
var SPEED_MULTIPLICATOR = (100 / 3);
var NUMBER_OF_ENEMIES = 6;
var TOP_OFFSET = TILES_HEIGHT / 2;
var WHITESPACE_BUG = 2;
var WHITESPACE_PLAYER = 20;

/* Function i found to pick a random number in an interval, used to dertermine row & speed of bugs */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* The unit is a super class holding the common properties and methods between all units (players & enemies) in the game */
var Unit = function(x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};

/* Draw the Unit on the screen, required method for game */
Unit.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* the enemy class is constructed as a subclass of Unit with the addition of a speed parameter */
var Enemy = function(row, speed) {
    Unit.call(this, 0, row * TILES_HEIGHT - TOP_OFFSET, 'images/enemy-bug.png');
    this.speed = speed;
};

/* The enemy's prototype chains is referenced to the unit's giving acces to the render functionality */
Enemy.prototype = Object.create(Unit.prototype);
Enemy.prototype.constructor = Enemy;

/* The enemy update method either adds new position based on speed or randomizes new speed and row if bug is outofbounds*/
Enemy.prototype.update = function(dt) {
    /* bugs are one directionally creatues, only leaping forward in life, hence we only have to check the upper bound */
    /* if the bug is out of bounds randomize new row & speed for it
     */
    if (this.x > 505) {
        this.y = getRandomInt(1, 4) * TILES_HEIGHT - TOP_OFFSET;
        this.speed = getRandomInt(1, 6) * SPEED_MULTIPLICATOR;
        this.x = 0;
    }
    this.x = this.x + dt * this.speed;
    this.checkCollisions();
};

/* since the Y positions only have a small set of possible outcomes and we know that
 * for a player and an enemy to be on the same row they must have exactly the same y value
 * we test for this collision first afterwards we check if the enemy is colliding on
 * the horizontal pane with the player
 * the bug has approximatly 2px whitespacing on each side and the player has approx 20px.
 */
Enemy.prototype.checkCollisions = function() {
    if (player.y == this.y) {
        /* the collideFromBefore represents a check on if there is a collision where the starting point of the bug is with a lower x value than the starting point
         * of the player. the collideFromAfter represents a check if there is a collision where the starting point of the bug is larger than the starting point
         * of the player
         */
        var collideFromBefore = (this.x + WHITESPACE_BUG < player.x + WHITESPACE_PLAYER && this.x + TILES_WIDTH - WHITESPACE_BUG > player.x + WHITESPACE_PLAYER);
        var collideFromAfter = (this.x + WHITESPACE_BUG > player.x + WHITESPACE_PLAYER && this.x + WHITESPACE_BUG < player.x + TILES_WIDTH - WHITESPACE_PLAYER);
        if (collideFromBefore || collideFromAfter) {
            /* reset player x & y positions to start */
            player.reset();
        }
    }
};

/* the Player class is a subclass of the Unit class, it doesn't hold any unique properties however it has a
 * couple of methods specific to its subclass.
 */
var Player = function() {
    Unit.call(this, TILES_WIDTH * 2, 5 * TILES_HEIGHT - TOP_OFFSET, 'images/char-boy.png');
};

Player.prototype = Object.create(Unit.prototype);
Player.prototype.constructor = Player;
/* the handle input calls the player update method with the x&y differences, each allowed keystroke
 * has a corresponding x / y difference defined in the TITLES_WIDTH & TITLES_HEIGHT variables
 */
Player.prototype.handleInput = function(allowedKey) {
    switch (allowedKey) {
        case 'left':
            this.update(-TILES_WIDTH, 0);
            break;
        case 'right':
            this.update(TILES_WIDTH, 0);
            break;
        case 'up':
            this.update(0, -TILES_HEIGHT);
            break;
        case 'down':
            this.update(0, TILES_HEIGHT);
            break;
        default:
            this.x = this.x;
            this.y = this.y;
    }
};

/* updates the player positons with xDiff & yDiff if that doesnt put the player icon out of bounds */
Player.prototype.update = function(xDiff, yDiff) {
    if (this.x + xDiff < 505 && this.x + xDiff > -TILES_WIDTH) {
        this.x = this.x + xDiff;
    }
    if (this.y + yDiff <= 5 * TILES_HEIGHT - TOP_OFFSET && this.y + yDiff >= -TOP_OFFSET) {
        this.y = this.y + yDiff;
    }
    this.checkWinCondition();
};

/* if player's y value reaches the -TOP_OFFSET value it means that the player icon reached the water row and thereby won
 * if the player has won the icon is simply reset to the initial position
 */
Player.prototype.checkWinCondition = function() {
    if (this.y == -TOP_OFFSET) {
        this.reset();
    }
};

Player.prototype.reset = function() {
    this.x = TILES_WIDTH * 2;
    this.y = 5 * TILES_HEIGHT - TOP_OFFSET;
};

/* Initiate enemies */
var allEnemies = [];
/* runs an anonymous self-invoking function. that creates the initial enemies */
(function randomizeEnemies() {
    for (n = 0; n < NUMBER_OF_ENEMIES; n++) {
        var row = getRandomInt(1, 4);
        var speed = getRandomInt(1, 6);
        allEnemies.push(new Enemy(row, speed * SPEED_MULTIPLICATOR));
    }
})();

/* initiate player */
var player = new Player();

/* This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
