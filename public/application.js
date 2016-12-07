(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (point) {
        this.x += point.x;
        this.y += point.y;
    };
    return Point;
}());
var Vector = (function (_super) {
    __extends(Vector, _super);
    function Vector() {
        _super.apply(this, arguments);
    }
    Vector.prototype.flipX = function () {
        this.x *= -1;
    };
    Vector.prototype.flipY = function () {
        this.y *= -1;
    };
    return Vector;
}(Point));
var Rect = (function () {
    function Rect(left, top, right, bottom) {
        this.topLeft = new Point(left, top);
        this.bottomRight = new Point(right, bottom);
    }
    Rect.prototype.clone = function () {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
    };
    Rect.prototype.add = function (point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    };
    Rect.prototype.moveTo = function (rect) {
        this.topLeft.x = rect.topLeft.x;
        this.topLeft.y = rect.topLeft.y;
        this.bottomRight.x = rect.bottomRight.x;
        this.bottomRight.y = rect.bottomRight.y;
    };
    Rect.prototype.moveCenterXTo = function (centerX) {
        var left = centerX - this.width() / 2;
        var right = left + this.width();
        this.topLeft.x = left;
        this.bottomRight.x = right;
    };
    Rect.prototype.moveBottomTo = function (bottom) {
        this.topLeft.y = bottom - this.height();
        this.bottomRight.y = bottom;
    };
    Rect.prototype.width = function () {
        return this.bottomRight.x - this.topLeft.x;
    };
    Rect.prototype.height = function () {
        return this.bottomRight.y - this.topLeft.y;
    };
    Rect.prototype.centerX = function () {
        return (this.topLeft.x + this.bottomRight.x) / 2;
    };
    Rect.prototype.centerY = function () {
        return (this.topLeft.y + this.bottomRight.y) / 2;
    };
    Rect.prototype.moveLeft = function (step) {
        this.topLeft.x -= step;
        this.bottomRight.x -= step;
    };
    Rect.prototype.moveRight = function (step) {
        this.topLeft.x += step;
        this.bottomRight.x += step;
    };
    return Rect;
}());
var Side;
(function (Side) {
    Side[Side["None"] = 0] = "None";
    Side[Side["Left"] = 1] = "Left";
    Side[Side["Top"] = 2] = "Top";
    Side[Side["Right"] = 3] = "Right";
    Side[Side["Bottom"] = 4] = "Bottom";
})(Side || (Side = {}));
var Obstacle = (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle() {
        _super.apply(this, arguments);
    }
    Obstacle.prototype.checkCollision = function (anotherRect) {
        var w = 0.5 * (this.width() + anotherRect.width());
        var h = 0.5 * (this.height() + anotherRect.height());
        var dx = this.centerX() - anotherRect.centerX();
        var dy = this.centerY() - anotherRect.centerY();
        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
            var wy = w * dy;
            var hx = h * dx;
            if (wy > hx) {
                return wy > -hx ? Side.Top : Side.Left;
            }
            else {
                return wy > -hx ? Side.Right : Side.Bottom;
            }
        }
        else {
            return Side.None;
        }
    };
    return Obstacle;
}(Rect));
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(sprite, left, top, right, bottom) {
        bottom = bottom || sprite.offsetTop + sprite.offsetHeight;
        right = right || sprite.offsetLeft + sprite.offsetWidth;
        top = top || sprite.offsetTop;
        left = left || sprite.offsetLeft;
        _super.call(this, left, top, right, bottom);
        this.sprite = sprite;
        this.isVisible = true;
    }
    Sprite.prototype.moveTo = function (rect) {
        _super.prototype.moveTo.call(this, rect);
        var _a = this.topLeft, posX = _a.x, posY = _a.y;
        this.sprite.style.left = posX + 'px';
        this.sprite.style.top = posY + 'px';
    };
    Sprite.prototype.hide = function () {
        this.sprite.style.display = 'none';
        this.isVisible = false;
    };
    Sprite.prototype.show = function () {
        this.sprite.style.display = 'block';
        this.isVisible = true;
    };
    Sprite.prototype.checkCollision = function (anotherRect) {
        if (!this.isVisible) {
            return Side.None;
        }
        return _super.prototype.checkCollision.call(this, anotherRect);
    };
    return Sprite;
}(Obstacle));
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(sprite, dir) {
        var radius = parseInt(getComputedStyle(sprite)['border-top-left-radius']);
        _super.call(this, sprite, sprite.offsetLeft, sprite.offsetTop, sprite.offsetLeft + 2 * radius, sprite.offsetTop + 2 * radius);
        this.sprite = sprite;
        this.radius = radius;
        this.velocity = 5;
        this.dir = dir;
    }
    Ball.prototype.calculateNewPosition = function () {
        var newPosition = this.clone();
        newPosition.add(this.dir);
        return newPosition;
    };
    Ball.prototype.bounceHorizontal = function () {
        this.dir.flipY();
    };
    Ball.prototype.bounceVertical = function () {
        this.dir.flipX();
    };
    Ball.prototype.bounceWithAngle = function (angle) {
        angle = angle * (Math.PI / 180);
        this.dir.x = Math.cos(angle) * this.velocity;
        this.dir.y = -Math.sin(angle) * this.velocity;
    };
    return Ball;
}(Sprite));
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle(sprite, maxRight) {
        _super.call(this, sprite);
        this.maxRight = maxRight;
    }
    Paddle.prototype.moveLeft = function (step) {
        var newPosition = this.clone();
        newPosition.moveLeft(step);
        if (newPosition.topLeft.x >= 0) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.moveRight = function (step) {
        var newPosition = this.clone();
        newPosition.moveRight(step);
        if (newPosition.bottomRight.x <= this.maxRight) {
            this.moveTo(newPosition);
        }
    };
    Paddle.prototype.calculateHitAngle = function (ballX, ballRadius) {
        var hitSpot = ballX - this.topLeft.x;
        var maxPaddle = this.width() + ballRadius;
        var minPaddle = -ballRadius;
        var paddleRange = maxPaddle - minPaddle;
        var minAngle = 160;
        var maxAngle = 20;
        var angleRange = maxAngle - minAngle;
        return ((hitSpot * angleRange) / paddleRange) + minAngle;
    };
    return Paddle;
}(Sprite));
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick() {
        _super.apply(this, arguments);
        this.lifeLeft = 1;
    }
    Brick.prototype.oneLifeLeft = function () {
        this.sprite.classList.remove('doublebrick');
    };
    Brick.prototype.wasHit = function () {
        return --this.lifeLeft < 1;
    };
    return Brick;
}(Sprite));
var DoubleBrick = (function (_super) {
    __extends(DoubleBrick, _super);
    function DoubleBrick() {
        _super.apply(this, arguments);
        this.lifeLeft = 2;
    }
    return DoubleBrick;
}(Brick));
var ImmortalBrick = (function (_super) {
    __extends(ImmortalBrick, _super);
    function ImmortalBrick() {
        _super.apply(this, arguments);
    }
    ImmortalBrick.prototype.wasHit = function () {
        return false;
    };
    return ImmortalBrick;
}(DoubleBrick));
var GameState;
(function (GameState) {
    GameState[GameState["Running"] = 0] = "Running";
    GameState[GameState["GameOver"] = 1] = "GameOver";
})(GameState || (GameState = {}));
var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["LEFT"] = 37] = "LEFT";
    KeyCodes[KeyCodes["RIGHT"] = 39] = "RIGHT";
})(KeyCodes || (KeyCodes = {}));
var Game = (function () {
    function Game(ballElement, paddle, bricks, boardElement, livesLabel, scoreLabel, newGameBtn) {
        var _this = this;
        this.livesLabel = livesLabel;
        this.scoreLabel = scoreLabel;
        this.newGameBtn = newGameBtn;
        this.loopInterval = 10;
        this.bricks = [];
        this.keyMap = {};
        this.gameState = GameState.Running;
        this.paddle = new Paddle(paddle, boardElement.offsetWidth);
        this.ball = new Ball(ballElement, new Vector(3, -3));
        for (var i = 0; i < bricks.length; i++) {
            if (bricks[i].classList.contains('doublebrick')) {
                this.bricks.push(new DoubleBrick(bricks[i]));
            }
            else if (bricks[i].classList.contains('immortal')) {
                this.bricks.push(new ImmortalBrick(bricks[i]));
            }
            else {
                this.bricks.push(new Brick(bricks[i]));
            }
        }
        this.createWalls(this.ball.radius, boardElement.offsetWidth, boardElement.offsetHeight);
        this.newGame();
        this.newGameBtn.addEventListener('click', function () { return _this.newGame(); });
    }
    Game.prototype.createWalls = function (radius, maxX, maxY) {
        this.wallLeft = new Obstacle(-radius, -radius, 0, maxY + radius);
        this.wallTop = new Obstacle(-radius, -radius, maxX + radius, 0);
        this.wallRight = new Obstacle(maxX, -radius, maxX + radius, maxY + radius);
        this.wallBottom = new Obstacle(-radius, maxY, maxX + radius, maxY + radius);
    };
    Game.prototype.newGame = function () {
        this.newGameBtn.style.display = 'none';
        this.score = 0;
        this.livesLeft = 3;
        this.livesLabel.innerText = '' + this.livesLeft;
        this.score = 0;
        this.scoreLabel.innerText = '' + this.score;
        this.ball.show();
        this.ball.bounceWithAngle(60);
        var ballPosition = this.ball.clone();
        ballPosition.moveCenterXTo(this.paddle.centerX());
        ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
        this.ball.moveTo(ballPosition);
        this.gameState = GameState.Running;
    };
    Game.prototype.lostLive = function () {
        if (--this.livesLeft) {
            this.ball.bounceWithAngle(60);
            var ballPosition = this.ball.clone();
            ballPosition.moveCenterXTo(this.paddle.centerX());
            ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
            this.ball.moveTo(ballPosition);
        }
        else {
            this.gameState = GameState.GameOver;
            this.ball.hide();
            this.newGameBtn.style.display = 'block';
        }
        this.livesLabel.innerText = '' + this.livesLeft;
    };
    Game.prototype.run = function () {
        var _this = this;
        document.addEventListener('keyup', function (e) { return _this.keyMap[e.keyCode] = false; });
        document.addEventListener('keydown', function (e) { return _this.keyMap[e.keyCode] = true; });
        setInterval(function () {
            if (_this.gameState !== GameState.Running) {
                return;
            }
            var newBallPosition = _this.ball.calculateNewPosition();
            if (_this.keyMap[KeyCodes.LEFT]) {
                _this.paddle.moveLeft(5);
            }
            else if (_this.keyMap[KeyCodes.RIGHT]) {
                _this.paddle.moveRight(5);
            }
            if (_this.wallBottom.checkCollision(newBallPosition)) {
                _this.lostLive();
                return;
            }
            if (_this.wallLeft.checkCollision(newBallPosition) || _this.wallRight.checkCollision(newBallPosition)) {
                _this.ball.bounceVertical();
            }
            if (_this.wallTop.checkCollision(newBallPosition)) {
                _this.ball.bounceHorizontal();
            }
            for (var _i = 0, _a = _this.bricks; _i < _a.length; _i++) {
                var brick = _a[_i];
                var wasHit = false;
                switch (brick.checkCollision(newBallPosition)) {
                    case (Side.Left):
                    case (Side.Right):
                        _this.ball.bounceVertical();
                        wasHit = true;
                        break;
                    case (Side.Top):
                    case (Side.Bottom):
                        _this.ball.bounceHorizontal();
                        wasHit = true;
                }
                if (wasHit) {
                    if (brick.wasHit()) {
                        brick.hide();
                    }
                    else {
                        brick.oneLifeLeft();
                    }
                    _this.score += 20;
                    _this.scoreLabel.innerText = '' + _this.score;
                    break;
                }
            }
            if (_this.paddle.checkCollision(newBallPosition)) {
                _this.ball.bounceWithAngle(_this.paddle.calculateHitAngle(_this.ball.centerX(), _this.ball.radius));
            }
            _this.ball.moveTo(_this.ball.calculateNewPosition());
        }, this.loopInterval);
    };
    return Game;
}());
console.log('Hello from BrickBuster !!!');
var game = new Game(document.getElementsByClassName("ball")[0], document.getElementsByClassName("paddle")[0], document.getElementsByClassName("brick"), document.getElementsByClassName("game-board")[0], document.getElementById('lives'), document.getElementById('score'), document.getElementById('newGame'));
game.run();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUE7SUFHSSxlQUFZLENBQVUsRUFBRSxDQUFTO1FBQzdCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsbUJBQUcsR0FBSCxVQUFJLEtBQVk7UUFDWixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FaQSxBQVlDLElBQUE7QUFFRDtJQUFxQiwwQkFBSztJQUExQjtRQUFxQiw4QkFBSztJQVExQixDQUFDO0lBUEcsc0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELHNCQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFDTCxhQUFDO0FBQUQsQ0FSQSxBQVFDLENBUm9CLEtBQUssR0FRekI7QUFFRDtJQUlJLGNBQVksSUFBYSxFQUFFLEdBQVcsRUFBRSxLQUFhLEVBQUUsTUFBYztRQUNqRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsb0JBQUssR0FBTDtRQUNJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENB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LENBQUMsQ0FBQyxFQUN6QyxRQUFRLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLEVBQzNDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDaEQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFDaEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFDaEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FDbEQsQ0FBQztBQUVGLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBQb2ludCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcih4IDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICBhZGQocG9pbnQ6IFBvaW50KSB7XG4gICAgICAgIHRoaXMueCArPSBwb2ludC54O1xuICAgICAgICB0aGlzLnkgKz0gcG9pbnQueTtcbiAgICB9XG59XG5cbmNsYXNzIFZlY3RvciBleHRlbmRzIFBvaW50IHtcbiAgICBmbGlwWCgpIHtcbiAgICAgICAgdGhpcy54ICo9IC0xO1xuICAgIH1cblxuICAgIGZsaXBZKCkge1xuICAgICAgICB0aGlzLnkgKj0gLTE7XG4gICAgfVxufVxuXG5jbGFzcyBSZWN0IHtcbiAgICB0b3BMZWZ0IDogUG9pbnQ7XG4gICAgYm90dG9tUmlnaHQgOiBQb2ludDtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQgOiBudW1iZXIsIHRvcDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlcikge1xuICAgICAgICB0aGlzLnRvcExlZnQgPSBuZXcgUG9pbnQobGVmdCwgdG9wKTtcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodCA9IG5ldyBQb2ludChyaWdodCwgYm90dG9tKTtcbiAgICB9XG5cbiAgICBjbG9uZSgpIDogUmVjdCB7XG4gICAgICAgIHJldHVybiBuZXcgUmVjdCh0aGlzLnRvcExlZnQueCwgdGhpcy50b3BMZWZ0LnksIHRoaXMuYm90dG9tUmlnaHQueCwgdGhpcy5ib3R0b21SaWdodC55KTtcbiAgICB9XG5cbiAgICBhZGQocG9pbnQ6IFBvaW50KSB7XG4gICAgICAgIHRoaXMudG9wTGVmdC5hZGQocG9pbnQpO1xuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LmFkZChwb2ludCk7XG4gICAgfVxuXG4gICAgbW92ZVRvKHJlY3Q6IFJlY3QpIHtcbiAgICAgICAgdGhpcy50b3BMZWZ0LnggPSByZWN0LnRvcExlZnQueDtcbiAgICAgICAgdGhpcy50b3BMZWZ0LnkgPSByZWN0LnRvcExlZnQueTtcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC54ID0gcmVjdC5ib3R0b21SaWdodC54O1xuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LnkgPSByZWN0LmJvdHRvbVJpZ2h0Lnk7XG4gICAgfVxuXG4gICAgbW92ZUNlbnRlclhUbyhjZW50ZXJYIDogbnVtYmVyKSB7XG4gICAgICAgIHZhciBsZWZ0ID0gY2VudGVyWCAtIHRoaXMud2lkdGgoKSAvIDI7XG4gICAgICAgIHZhciByaWdodCA9IGxlZnQgKyB0aGlzLndpZHRoKCk7XG4gICAgICAgIHRoaXMudG9wTGVmdC54ID0gbGVmdDtcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC54ID0gcmlnaHQ7XG4gICAgfVxuXG4gICAgbW92ZUJvdHRvbVRvKGJvdHRvbTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudG9wTGVmdC55ID0gYm90dG9tIC0gdGhpcy5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC55ID0gYm90dG9tOyBcbiAgICB9XG5cbiAgICB3aWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm90dG9tUmlnaHQueCAtIHRoaXMudG9wTGVmdC54O1xuICAgIH1cblxuICAgIGhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm90dG9tUmlnaHQueSAtIHRoaXMudG9wTGVmdC55O1xuICAgIH1cblxuICAgIGNlbnRlclgoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy50b3BMZWZ0LnggKyB0aGlzLmJvdHRvbVJpZ2h0LngpIC8gMjtcbiAgICB9XG5cbiAgICBjZW50ZXJZKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMudG9wTGVmdC55ICsgdGhpcy5ib3R0b21SaWdodC55KSAvIDI7XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoc3RlcDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMudG9wTGVmdC54IC09IHN0ZXA7XG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQueCAtPSBzdGVwO1xuICAgIH1cblxuICAgIG1vdmVSaWdodChzdGVwOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50b3BMZWZ0LnggKz0gc3RlcDtcbiAgICAgICAgdGhpcy5ib3R0b21SaWdodC54ICs9IHN0ZXA7XG4gICAgfVxufVxuXG5lbnVtIFNpZGUge1xuICAgIE5vbmUsXG4gICAgTGVmdCxcbiAgICBUb3AsXG4gICAgUmlnaHQsIFxuICAgIEJvdHRvbVxufVxuXG5jbGFzcyBPYnN0YWNsZSBleHRlbmRzIFJlY3Qge1xuICAgIGNoZWNrQ29sbGlzaW9uKGFub3RoZXJSZWN0IDogUmVjdCkgOiBTaWRlIHtcbiAgICAgICAgdmFyIHcgPSAwLjUgKiAodGhpcy53aWR0aCgpICsgYW5vdGhlclJlY3Qud2lkdGgoKSk7XG4gICAgICAgIHZhciBoID0gMC41ICogKHRoaXMuaGVpZ2h0KCkgKyBhbm90aGVyUmVjdC5oZWlnaHQoKSk7XG4gICAgICAgIHZhciBkeCA9IHRoaXMuY2VudGVyWCgpIC0gYW5vdGhlclJlY3QuY2VudGVyWCgpO1xuICAgICAgICB2YXIgZHkgPSB0aGlzLmNlbnRlclkoKSAtIGFub3RoZXJSZWN0LmNlbnRlclkoKTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMoZHgpIDw9IHcgJiYgTWF0aC5hYnMoZHkpIDw9IGgpIHtcbiAgICAgICAgICAgIHZhciB3eSA9IHcgKiBkeTtcbiAgICAgICAgICAgIHZhciBoeCA9IGggKiBkeDtcbiAgICAgICAgICAgIGlmICh3eSA+IGh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHd5ID4gLWh4ID8gU2lkZS5Ub3AgOiBTaWRlLkxlZnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB3eSA+IC1oeCA/IFNpZGUuUmlnaHQgOiBTaWRlLkJvdHRvbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBTaWRlLk5vbmU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIFNwcml0ZSBleHRlbmRzIE9ic3RhY2xlIHtcbiAgICBzcHJpdGU6IEhUTUxFbGVtZW50O1xuICAgIGlzVmlzaWJsZTogQm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHNwcml0ZTogSFRNTEVsZW1lbnQsIGxlZnQ/IDogbnVtYmVyLCB0b3A/OiBudW1iZXIsIHJpZ2h0PzogbnVtYmVyLCBib3R0b20/OiBudW1iZXIpIHtcbiAgICAgICAgYm90dG9tID0gYm90dG9tIHx8IHNwcml0ZS5vZmZzZXRUb3AgKyBzcHJpdGUub2Zmc2V0SGVpZ2h0O1xuICAgICAgICByaWdodCA9IHJpZ2h0IHx8IHNwcml0ZS5vZmZzZXRMZWZ0ICsgc3ByaXRlLm9mZnNldFdpZHRoO1xuICAgICAgICB0b3AgPSB0b3AgfHwgc3ByaXRlLm9mZnNldFRvcDtcbiAgICAgICAgbGVmdCA9IGxlZnQgfHwgc3ByaXRlLm9mZnNldExlZnQ7XG5cbiAgICAgICAgc3VwZXIobGVmdCwgdG9wLCByaWdodCwgYm90dG9tKTtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBtb3ZlVG8ocmVjdCA6IFJlY3QpIHtcbiAgICAgICAgc3VwZXIubW92ZVRvKHJlY3QpO1xuXG4gICAgICAgIGxldCB7eDogcG9zWCwgeTogcG9zWX0gPSB0aGlzLnRvcExlZnQ7XG5cblx0ICAgIHRoaXMuc3ByaXRlLnN0eWxlLmxlZnQgPSBwb3NYICsgJ3B4JztcbiAgICAgICAgdGhpcy5zcHJpdGUuc3R5bGUudG9wID0gcG9zWSArICdweCc7ICAgICAgICAgXG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgICB9ICAgIFxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICB9ICAgIFxuXG4gICAgY2hlY2tDb2xsaXNpb24oYW5vdGhlclJlY3QgOiBSZWN0KSA6IFNpZGUge1xuICAgICAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gU2lkZS5Ob25lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5jaGVja0NvbGxpc2lvbihhbm90aGVyUmVjdCk7XG4gICAgfVxufVxuXG5jbGFzcyBCYWxsIGV4dGVuZHMgU3ByaXRlIHtcblxuICAgIHJhZGl1cyA6IG51bWJlcjtcbiAgICBkaXIgIDogVmVjdG9yO1xuICAgIHZlbG9jaXR5OiBudW1iZXI7XG5cbiAgICB3YWxsTGVmdCA6IE9ic3RhY2xlO1xuICAgIHdhbGxUb3A6IE9ic3RhY2xlO1xuICAgIHdhbGxSaWdodDogT2JzdGFjbGU7XG4gICAgd2FsbEJvdHRvbTogT2JzdGFjbGU7XG5cbiAgICBjb25zdHJ1Y3RvcihzcHJpdGU6IEhUTUxFbGVtZW50LCBkaXIgOiBWZWN0b3IpIHtcbiAgICAgICAgdmFyIHJhZGl1cyA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUoc3ByaXRlKVsnYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cyddKTtcbiAgICAgICAgc3VwZXIoc3ByaXRlLCBzcHJpdGUub2Zmc2V0TGVmdCwgc3ByaXRlLm9mZnNldFRvcCwgc3ByaXRlLm9mZnNldExlZnQgKyAyICogcmFkaXVzLCBzcHJpdGUub2Zmc2V0VG9wICsgMiAqIHJhZGl1cyk7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IDU7ICAgICAgICBcbiAgICAgICAgdGhpcy5kaXIgPSBkaXI7ICAgICAgICBcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVOZXdQb3NpdGlvbigpIDogUmVjdCB7XG4gICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgbmV3UG9zaXRpb24uYWRkKHRoaXMuZGlyKTtcbiAgICAgICAgcmV0dXJuIG5ld1Bvc2l0aW9uOyAgICAgICAgXG4gICAgfVxuXG4gICAgYm91bmNlSG9yaXpvbnRhbCgpIHtcbiAgICAgICAgdGhpcy5kaXIuZmxpcFkoKTtcbiAgICB9XG5cbiAgICBib3VuY2VWZXJ0aWNhbCgpIHtcbiAgICAgICAgdGhpcy5kaXIuZmxpcFgoKTtcbiAgICB9IFxuXG4gICAgYm91bmNlV2l0aEFuZ2xlKGFuZ2xlOiBudW1iZXIpIHtcbiAgICAgICAgYW5nbGUgPSBhbmdsZSAqIChNYXRoLlBJIC8gMTgwKTtcbiAgICAgICAgdGhpcy5kaXIueCA9IE1hdGguY29zKGFuZ2xlKSAqIHRoaXMudmVsb2NpdHk7XG4gICAgICAgIHRoaXMuZGlyLnkgPSAtTWF0aC5zaW4oYW5nbGUpICogdGhpcy52ZWxvY2l0eTtcbiAgICB9XG59XG5cbmNsYXNzIFBhZGRsZSBleHRlbmRzIFNwcml0ZSB7XG4gICAgY29uc3RydWN0b3Ioc3ByaXRlOiBIVE1MRWxlbWVudCwgcHVibGljIG1heFJpZ2h0IDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKHNwcml0ZSk7XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoc3RlcD86IG51bWJlcikge1xuICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSB0aGlzLmNsb25lKCk7XG4gICAgICAgIG5ld1Bvc2l0aW9uLm1vdmVMZWZ0KHN0ZXApO1xuXG4gICAgICAgIGlmIChuZXdQb3NpdGlvbi50b3BMZWZ0LnggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8obmV3UG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVJpZ2h0KHN0ZXA/IDogbnVtYmVyKSB7XG4gICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgbmV3UG9zaXRpb24ubW92ZVJpZ2h0KHN0ZXApO1xuXG4gICAgICAgIGlmIChuZXdQb3NpdGlvbi5ib3R0b21SaWdodC54IDw9IHRoaXMubWF4UmlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKG5ld1Bvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbGN1bGF0ZUhpdEFuZ2xlKGJhbGxYIDogbnVtYmVyLCBiYWxsUmFkaXVzIDogbnVtYmVyKSA6IG51bWJlciB7XG4gICAgICAgIHZhciBoaXRTcG90ID0gYmFsbFggLSB0aGlzLnRvcExlZnQueDtcbiAgICAgICAgdmFyIG1heFBhZGRsZSA9IHRoaXMud2lkdGgoKSArIGJhbGxSYWRpdXM7XG4gICAgICAgIHZhciBtaW5QYWRkbGUgPSAtYmFsbFJhZGl1cztcbiAgICAgICAgdmFyIHBhZGRsZVJhbmdlID0gbWF4UGFkZGxlIC0gbWluUGFkZGxlO1xuXG4gICAgICAgIHZhciBtaW5BbmdsZSA9IDE2MDtcbiAgICAgICAgdmFyIG1heEFuZ2xlID0gMjA7XG4gICAgICAgIHZhciBhbmdsZVJhbmdlID0gbWF4QW5nbGUgLSBtaW5BbmdsZTtcblxuICAgICAgICByZXR1cm4gKChoaXRTcG90ICogYW5nbGVSYW5nZSkgLyBwYWRkbGVSYW5nZSkgKyBtaW5BbmdsZTtcbiAgICB9XG59XG5cbmNsYXNzIEJyaWNrIGV4dGVuZHMgU3ByaXRlIHtcbiAgICBsaWZlTGVmdDogbnVtYmVyID0gMTtcbiAgICBvbmVMaWZlTGVmdCgpICB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmNsYXNzTGlzdC5yZW1vdmUoJ2RvdWJsZWJyaWNrJyk7XG4gICAgfVxuICAgIHdhc0hpdCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIC0tdGhpcy5saWZlTGVmdCA8IDE7XG4gICAgfVxufVxuXG5jbGFzcyBEb3VibGVCcmljayBleHRlbmRzIEJyaWNrIHtcbiAgICBsaWZlTGVmdDogbnVtYmVyID0gMjtcbiAgICBcbn1cblxuY2xhc3MgSW1tb3J0YWxCcmljayBleHRlbmRzIERvdWJsZUJyaWNrIHtcbiAgICB3YXNIaXQgKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5lbnVtIEdhbWVTdGF0ZSB7XG4gICAgUnVubmluZyxcbiAgICBHYW1lT3ZlclxufVxuXG5lbnVtIEtleUNvZGVzIHtcbiAgICBMRUZUID0gMzcsXG4gICAgUklHSFQgPSAzOVxufVxuXG5jbGFzcyBHYW1lIHtcbiAgICBsb29wSW50ZXJ2YWw6IG51bWJlciA9IDEwO1xuICAgIGdhbWVTdGF0ZTogR2FtZVN0YXRlO1xuICAgIGJhbGw6IEJhbGw7XG4gICAgcGFkZGxlOiBQYWRkbGU7XG4gICAgYnJpY2tzOiBBcnJheTxCcmljaz4gPSBbXTtcblxuICAgIGtleU1hcCA9IHt9O1xuXG4gICAgd2FsbExlZnQgOiBPYnN0YWNsZTtcbiAgICB3YWxsVG9wOiBPYnN0YWNsZTtcbiAgICB3YWxsUmlnaHQ6IE9ic3RhY2xlO1xuICAgIHdhbGxCb3R0b206IE9ic3RhY2xlOyAgICBcblxuICAgIGxpdmVzTGVmdCA6IG51bWJlcjtcbiAgICBzY29yZTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoYmFsbEVsZW1lbnQgOiBIVE1MRWxlbWVudCwgcGFkZGxlOiBIVE1MRWxlbWVudCwgYnJpY2tzOiBIVE1MQ29sbGVjdGlvbiwgYm9hcmRFbGVtZW50IDogSFRNTEVsZW1lbnQsIHB1YmxpYyBsaXZlc0xhYmVsIDogSFRNTEVsZW1lbnQsXG4gICAgICAgIHB1YmxpYyBzY29yZUxhYmVsOiBIVE1MRWxlbWVudCwgcHVibGljIG5ld0dhbWVCdG46IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLlJ1bm5pbmc7XG4gICAgICAgIHRoaXMucGFkZGxlID0gbmV3IFBhZGRsZShwYWRkbGUsIGJvYXJkRWxlbWVudC5vZmZzZXRXaWR0aCk7XG5cbiAgICAgICAgdGhpcy5iYWxsID0gbmV3IEJhbGwoXG4gICAgICAgICAgICBiYWxsRWxlbWVudCwgICAgICAgICAgICBcbiAgICAgICAgICAgIG5ldyBWZWN0b3IoMywgLTMpIFxuICAgICAgICApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnJpY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZihicmlja3NbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkb3VibGVicmljaycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgRG91YmxlQnJpY2soPEhUTUxFbGVtZW50PmJyaWNrc1tpXSkpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJyaWNrc1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2ltbW9ydGFsJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBJbW1vcnRhbEJyaWNrKDxIVE1MRWxlbWVudD5icmlja3NbaV0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayg8SFRNTEVsZW1lbnQ+YnJpY2tzW2ldKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlV2FsbHModGhpcy5iYWxsLnJhZGl1cywgYm9hcmRFbGVtZW50Lm9mZnNldFdpZHRoLCBib2FyZEVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcblxuICAgICAgICB0aGlzLm5ld0dhbWUoKTtcblxuICAgICAgICB0aGlzLm5ld0dhbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLm5ld0dhbWUoKSk7XG4gICAgfSAgICBcblxuICAgIGNyZWF0ZVdhbGxzKHJhZGl1cyA6IG51bWJlciwgbWF4WCA6IG51bWJlciwgbWF4WSA6IG51bWJlcikge1xuICAgICAgICB0aGlzLndhbGxMZWZ0ID0gbmV3IE9ic3RhY2xlKC1yYWRpdXMsIC1yYWRpdXMsIDAsIG1heFkgKyByYWRpdXMpO1xuICAgICAgICB0aGlzLndhbGxUb3AgPSBuZXcgT2JzdGFjbGUoLXJhZGl1cywgLXJhZGl1cywgbWF4WCArIHJhZGl1cywgMCk7XG4gICAgICAgIHRoaXMud2FsbFJpZ2h0ID0gbmV3IE9ic3RhY2xlKG1heFgsIC1yYWRpdXMsIG1heFggKyByYWRpdXMsIG1heFkgKyByYWRpdXMpO1xuICAgICAgICB0aGlzLndhbGxCb3R0b20gPSBuZXcgT2JzdGFjbGUoLXJhZGl1cywgbWF4WSwgbWF4WCArIHJhZGl1cywgbWF4WSArIHJhZGl1cyk7ICAgICAgICBcbiAgICB9XG5cbiAgICBuZXdHYW1lKCkge1xuICAgICAgICB0aGlzLm5ld0dhbWVCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMubGl2ZXNMZWZ0ID0gMztcbiAgICAgICAgdGhpcy5saXZlc0xhYmVsLmlubmVyVGV4dCA9ICcnICsgdGhpcy5saXZlc0xlZnQ7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlTGFiZWwuaW5uZXJUZXh0ID0gJycgKyB0aGlzLnNjb3JlO1xuICAgICAgICB0aGlzLmJhbGwuc2hvdygpO1xuICAgICAgICB0aGlzLmJhbGwuYm91bmNlV2l0aEFuZ2xlKDYwKTtcbiAgICAgICAgdmFyIGJhbGxQb3NpdGlvbiA9IHRoaXMuYmFsbC5jbG9uZSgpO1xuICAgICAgICBiYWxsUG9zaXRpb24ubW92ZUNlbnRlclhUbyh0aGlzLnBhZGRsZS5jZW50ZXJYKCkpO1xuICAgICAgICBiYWxsUG9zaXRpb24ubW92ZUJvdHRvbVRvKHRoaXMucGFkZGxlLnRvcExlZnQueSAtIDQpO1xuICAgICAgICB0aGlzLmJhbGwubW92ZVRvKGJhbGxQb3NpdGlvbik7XG4gICAgICAgIHRoaXMuZ2FtZVN0YXRlID0gR2FtZVN0YXRlLlJ1bm5pbmc7XG4gICAgfVxuXG4gICAgbG9zdExpdmUoKSB7XG4gICAgICAgIGlmICgtLXRoaXMubGl2ZXNMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmJhbGwuYm91bmNlV2l0aEFuZ2xlKDYwKTtcbiAgICAgICAgICAgIHZhciBiYWxsUG9zaXRpb24gPSB0aGlzLmJhbGwuY2xvbmUoKTtcbiAgICAgICAgICAgIGJhbGxQb3NpdGlvbi5tb3ZlQ2VudGVyWFRvKHRoaXMucGFkZGxlLmNlbnRlclgoKSk7XG4gICAgICAgICAgICBiYWxsUG9zaXRpb24ubW92ZUJvdHRvbVRvKHRoaXMucGFkZGxlLnRvcExlZnQueSAtIDQpO1xuICAgICAgICAgICAgdGhpcy5iYWxsLm1vdmVUbyhiYWxsUG9zaXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nYW1lU3RhdGUgPSBHYW1lU3RhdGUuR2FtZU92ZXI7XG4gICAgICAgICAgICB0aGlzLmJhbGwuaGlkZSgpOyAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJzsgIFxuICAgICAgICB9XG4gICAgICAgIHRoaXMubGl2ZXNMYWJlbC5pbm5lclRleHQgPSAnJyArIHRoaXMubGl2ZXNMZWZ0O1xuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4gdGhpcy5rZXlNYXBbZS5rZXlDb2RlXSA9IGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB0aGlzLmtleU1hcFtlLmtleUNvZGVdID0gdHJ1ZSk7XG5cbiAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lU3RhdGUgIT09IEdhbWVTdGF0ZS5SdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG5ld0JhbGxQb3NpdGlvbiA9IHRoaXMuYmFsbC5jYWxjdWxhdGVOZXdQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5rZXlNYXBbS2V5Q29kZXMuTEVGVF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZGRsZS5tb3ZlTGVmdCg1KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5rZXlNYXBbS2V5Q29kZXMuUklHSFRdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWRkbGUubW92ZVJpZ2h0KDUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy53YWxsQm90dG9tLmNoZWNrQ29sbGlzaW9uKG5ld0JhbGxQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvc3RMaXZlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy53YWxsTGVmdC5jaGVja0NvbGxpc2lvbihuZXdCYWxsUG9zaXRpb24pIHx8IHRoaXMud2FsbFJpZ2h0LmNoZWNrQ29sbGlzaW9uKG5ld0JhbGxQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhbGwuYm91bmNlVmVydGljYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLndhbGxUb3AuY2hlY2tDb2xsaXNpb24obmV3QmFsbFBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFsbC5ib3VuY2VIb3Jpem9udGFsKCk7XG4gICAgICAgICAgICB9ICAgICBcblxuICAgICAgICAgICAgZm9yIChsZXQgYnJpY2sgb2YgdGhpcy5icmlja3MpIHtcbiAgICAgICAgICAgICAgICBsZXQgd2FzSGl0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGJyaWNrLmNoZWNrQ29sbGlzaW9uKG5ld0JhbGxQb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAoU2lkZS5MZWZ0KTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAoU2lkZS5SaWdodCk6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGwuYm91bmNlVmVydGljYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhc0hpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIChTaWRlLlRvcCk6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgKFNpZGUuQm90dG9tKTogICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsLmJvdW5jZUhvcml6b250YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhc0hpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHdhc0hpdCkge1xuICAgICAgICAgICAgICAgICAgICBpZihicmljay53YXNIaXQoKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJpY2suaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJpY2sub25lTGlmZUxlZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29yZSArPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY29yZUxhYmVsLmlubmVyVGV4dCA9ICcnICsgdGhpcy5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5wYWRkbGUuY2hlY2tDb2xsaXNpb24obmV3QmFsbFBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFsbC5ib3VuY2VXaXRoQW5nbGUodGhpcy5wYWRkbGUuY2FsY3VsYXRlSGl0QW5nbGUodGhpcy5iYWxsLmNlbnRlclgoKSwgdGhpcy5iYWxsLnJhZGl1cykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJhbGwubW92ZVRvKHRoaXMuYmFsbC5jYWxjdWxhdGVOZXdQb3NpdGlvbigpKTtcbiAgICAgICB9LCB0aGlzLmxvb3BJbnRlcnZhbCkgXG4gICAgfVxufVxuXG5jb25zb2xlLmxvZygnSGVsbG8gZnJvbSBCcmlja0J1c3RlciAhISEnKTtcblxudmFyIGdhbWUgPSBuZXcgR2FtZShcbiAgICA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJhbGxcIilbMF0sXG4gICAgPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYWRkbGVcIilbMF0sXG4gICAgPEhUTUxDb2xsZWN0aW9uPmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJicmlja1wiKSxcbiAgICA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdhbWUtYm9hcmRcIilbMF0sXG4gICAgPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXZlcycpLFxuICAgIDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmUnKSxcbiAgICA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ld0dhbWUnKSAgICBcbik7XG5cbmdhbWUucnVuKCk7Il19
