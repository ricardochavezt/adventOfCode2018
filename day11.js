let gridSerialNumber = parseInt(process.argv[2]);
// let cellX = parseInt(process.argv[3]);
// let cellY = parseInt(process.argv[4]);

function calculatePowerLevel(gridSerialNumber, x, y) {
    let rackId = x + 10;
    let powerLevel = rackId * y;
    powerLevel += gridSerialNumber;
    powerLevel *= rackId;
    powerLevel = (Math.floor(powerLevel / 100) % 10) - 5;
    return powerLevel;
}

function calculateTotalPowerLevel(gridSerialNumber, xIni, yIni, size, powerGrid) {
    // if (!powerGrid) {
    //     console.log('No pre-calculated power grid provided');
    // }
    let totalPowerLevel = 0;
    for (let x = xIni; x < xIni+size; x++) {
        for(let y = yIni; y < yIni+size; y++) {
            if (powerGrid) {
                totalPowerLevel += powerGrid[x-1][y-1];
            }
            else {
                totalPowerLevel += calculatePowerLevel(gridSerialNumber, x, y);
            }
        }
    }
    return totalPowerLevel;
}

const GRID_SIZE = 300;

function maxSquareOfSize(size, gridSerialNumber, powerGrid) {
    let squareTop, squareLeft;
    let maxPower = -Infinity;
    for (let i = 1; i <= GRID_SIZE-size; i++) {
        for (let j = 1; j <= GRID_SIZE-size; j++) {
            let totalPower = calculateTotalPowerLevel(gridSerialNumber, i, j, size, powerGrid);
            if (totalPower > maxPower) {
                maxPower = totalPower;
                squareTop = i; squareLeft = j;
            }
        }
    }

    return {squareTop, squareLeft};
}

function initPowerGrid(gridSerialNumber) {
    console.log("initializing power grid");
    let powerGrid = new Array(GRID_SIZE);
    for (let i = 0; i < GRID_SIZE; i++) {
        powerGrid[i] = new Array(GRID_SIZE);
        for (let j = 0; j < GRID_SIZE; j++) {
            powerGrid[i][j] = calculatePowerLevel(gridSerialNumber, i+1, j+1);
        }
    }
    return powerGrid;
}

function part1() {
    let size = 3;
    let powerGrid = initPowerGrid(gridSerialNumber);
    return maxSquareOfSize(size, gridSerialNumber, powerGrid);
}

function part2() {
    let powerGrid = initPowerGrid(gridSerialNumber);
    let maxPower = -Infinity;
    let squareTop, squareLeft;
    let maxSize = 0;

    for (let n = 1; n <= 300; n++) {
        console.log("calculating max square of size", n);
        let maxSquare = maxSquareOfSize(n, gridSerialNumber, powerGrid);
        if (maxSquare.totalPower > maxPower) {
            maxPower = maxSquare.totalPower;
            squareTop = maxSquare.top; squareLeft = maxSquare.left;
            maxSize = n;
        }
    }

    return `${squareLeft},${squareTop},${maxSize}`;
}

console.log(part2());
