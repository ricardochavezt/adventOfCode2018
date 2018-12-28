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

function calculateTotalPowerLevel(gridSerialNumber, xIni, yIni) {
    let totalPowerLevel = 0;
    for (let x = xIni; x < xIni+3; x++) {
        for(let y = yIni; y < yIni+3; y++) {
            totalPowerLevel += calculatePowerLevel(gridSerialNumber, x, y);
        }
    }
    return totalPowerLevel;
}

let squareTop, squareLeft;
let maxPower = -Infinity;

for (let i = 1; i <= 298; i++) {
    for (let j = 1; j <= 298; j++) {
        let totalPower = calculateTotalPowerLevel(gridSerialNumber, i, j);
        if (totalPower > maxPower) {
            maxPower = totalPower;
            squareTop = i; squareLeft = j;
        }
    }
}

console.log(squareTop, squareLeft);
