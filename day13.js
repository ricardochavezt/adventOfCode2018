const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

let carts = [];
let trackMap = {};

const VERTICAL_TRACK = "|";
const HORIZONTAL_TRACK = "-";
const INTERSECTION = "+";
const RIGHT_TURN = "/";
const LEFT_TURN = "\\";

const LEFT = "<", RIGHT = ">", UP = "^", DOWN = "v";

const TURN_LEFT = "<|", TURN_RIGHT = "|>", KEEP_STRAIGHT = "==";

let maxXCoord = 0, maxYCoord = 0;

function parseLine(lineNumber, line) {
    let yCoord = lineNumber, xCoord = 0;
    for (let segment of line) {
        switch (segment) {
        case "-":
            trackMap[`${xCoord},${yCoord}`] = HORIZONTAL_TRACK;
            break;
        case "|":
            trackMap[`${xCoord},${yCoord}`] = VERTICAL_TRACK;
            break;
        case "/":
            trackMap[`${xCoord},${yCoord}`] = RIGHT_TURN;
            break;
        case "\\":
            trackMap[`${xCoord},${yCoord}`] = LEFT_TURN;
            break;
        case "+":
            trackMap[`${xCoord},${yCoord}`] = INTERSECTION;
            break;
        case "<":
            trackMap[`${xCoord},${yCoord}`] = HORIZONTAL_TRACK;
            carts.push({ direction: LEFT, x: xCoord, y: yCoord, action: TURN_LEFT});
            break;
        case ">":
            trackMap[`${xCoord},${yCoord}`] = HORIZONTAL_TRACK;
            carts.push({ direction: RIGHT, x: xCoord, y: yCoord, action: TURN_LEFT});
            break;
        case "v":
            trackMap[`${xCoord},${yCoord}`] = VERTICAL_TRACK;
            carts.push({ direction: DOWN, x: xCoord, y: yCoord, action: TURN_LEFT});
            break;
        case "^":
            trackMap[`${xCoord},${yCoord}`] = VERTICAL_TRACK;
            carts.push({ direction: UP, x: xCoord, y: yCoord, action: TURN_LEFT});
            break;
        }
        xCoord++;
    }
    if (xCoord > maxXCoord) { maxXCoord = xCoord; }
    if (yCoord > maxYCoord) { maxYCoord = yCoord; }
}

function nextAction(currentAction) {
    switch(currentAction) {
    case TURN_LEFT:
        return KEEP_STRAIGHT;
    case KEEP_STRAIGHT:
        return TURN_RIGHT;
    case TURN_RIGHT:
        return TURN_LEFT;
    }
}

function moveCart(cart, action) {
    switch (action) {
    case TURN_LEFT:
        switch (cart.direction) {
        case UP:
            cart.direction = LEFT;
            break;
        case DOWN:
            cart.direction = RIGHT;
            break;
        case LEFT:
            cart.direction = DOWN;
            break;
        case RIGHT:
            cart.direction = UP;
            break;
        }
        break;
    case TURN_RIGHT:
        switch (cart.direction) {
        case UP:
            cart.direction = RIGHT;
            break;
        case DOWN:
            cart.direction = LEFT;
            break;
        case LEFT:
            cart.direction = UP;
            break;
        case RIGHT:
            cart.direction = DOWN;
            break;
        }
        break;
    }
    switch (cart.direction) {
    case UP:
        cart.y -= 1;
        break;
    case DOWN:
        cart.y += 1;
        break;
    case LEFT:
        cart.x -= 1;
        break;
    case RIGHT:
        cart.x += 1;
        break;
    }
}

function takeCurve(track, direction) {
    if (track == LEFT_TURN) { // '\'
        switch (direction) {
        case UP:
        case DOWN:
            return TURN_LEFT;
        case RIGHT:
        case LEFT:
            return TURN_RIGHT;
        }
    }
    else if (track == RIGHT_TURN) { // '/'
        switch (direction) {
        case UP:
        case DOWN:
            return TURN_RIGHT;
        case RIGHT:
        case LEFT:
            return TURN_LEFT;
        }
    }
    return KEEP_STRAIGHT; // no debería suceder, pero por si las dudas
}

function getAction(track, cart) {
    let action;
    switch(track) {
    case HORIZONTAL_TRACK:
    case VERTICAL_TRACK:
        action = KEEP_STRAIGHT;
        break;
    case INTERSECTION:
        action = cart.action;
        cart.action = nextAction(cart.action);
        break;
    case LEFT_TURN:
    case RIGHT_TURN:
        action = takeCurve(track, cart.direction);
        break;
    }
    return action;
}

function findFirstCrash(carts, trackMap) {
    let padLengthX = maxXCoord.toString().length, padLengthY = maxYCoord.toString().length;

    let crashed = false;
    let tick = 0;
    while (!crashed) {
        carts.forEach((cart, i) => {
            if (crashed) { return; }
            let track = trackMap[`${cart.x},${cart.y}`];
            let action = getAction(track, cart);
            moveCart(cart, action);
            if (carts.some((cart2, j) => i != j && cart.x == cart2.x && cart.y == cart2.y)) {
                // crash!!
                crashed = true;
                console.log(cart.x, cart.y);
                return;
            }
        });
        carts.sort((c1, c2) => {
            if (c1.y == c2.y) {
                return c1.x - c2.x;
            }
            return c1.y - c2.y;
        });
        tick++;
    }
    console.log('reached solution at tick', tick);
}

let lineNumber = 0;
rl.on('line', line => {
    parseLine(lineNumber, line);
    lineNumber++;
}).on('close', () => findFirstCrash(carts, trackMap));
