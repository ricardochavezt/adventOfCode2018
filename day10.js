const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

function parseLine(line) {
    let parsedVector = /position=<(.*), (.*)> velocity=<(.*), (.*)>/.exec(line);
    return {
        position: { x: parseInt(parsedVector[1]), y: parseInt(parsedVector[2]) },
        velocity: { x: parseInt(parsedVector[3]), y: parseInt(parsedVector[4]) }
    };
}

function calculateSetup(vectorList, second) {
    let setup = {
        xMax: -Infinity, xMin: Infinity, yMax: -Infinity, yMin: Infinity,
        points: {}
    };
    vectorList.forEach(vector => {
        let point = {
            x: vector.position.x + vector.velocity.x * second,
            y: vector.position.y + vector.velocity.y * second
        };
        setup.points[`${point.x},${point.y}`] = 1;
        if (point.x < setup.xMin) {
            setup.xMin = point.x;
        }
        if (point.x > setup.xMax) {
            setup.xMax = point.x;
        }
        if (point.y < setup.yMin) {
            setup.yMin = point.y;
        }
        if (point.y > setup.yMax) {
            setup.yMax = point.y;
        }
    });

    return setup;
}

function displaySetup(setup) {
    // console.log("(", setup.xMin,",", setup.yMin, ")", setup.xMax, ",", setup.yMax);
    for (let y = setup.yMin; y <= setup.yMax; y++) {
        let line = [];
        for (let x = setup.xMin; x <= setup.xMax; x++) {
            if (setup.points[`${x},${y}`]) {
                line.push("#");
            }
            else {
                line.push(" ");
            }
        }
        console.log(line.join(""));
    }
}

function findMessage(vectorList) {
    let second = 0;
    let areaDecreasing = true;
    let previousArea = Infinity;
    while (areaDecreasing) {
        let setup = calculateSetup(vectorList, second);
        if (setup.xMin == 0 && setup.yMin == 0) {
            console.log("reached (0,0) at second", second);
        }
        let area = (setup.xMax - setup.xMin) * (setup.yMax - setup.yMin);
        areaDecreasing = area < previousArea;
        if (areaDecreasing) {
            second++;
            previousArea = area;
        }
        else {
            console.log("area stopped decreasing at second ", second);
            displaySetup(calculateSetup(vectorList, second-1));
        }
    }
}

let vectorList = [];

rl.on('line', line => vectorList.push(parseLine(line)))
    .on('close', () => {
        if (process.argv.length > 2) {
            let second = parseInt(process.argv[2]);
            displaySetup(calculateSetup(vectorList, second));
        }
        else {
            findMessage(vectorList);
        }
    });
