const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

let coordinateList = [];

function parseLine(line) {
    let parsedLine = /(\d+),\s+(\d+)/.exec(line);
    return {
        x: parseInt(parsedLine[1]), y: parseInt(parsedLine[2])
    };
}

function calculateBounds(pointList) {
    let bounds = pointList.reduce((acum, curr) => {
        if (curr.x < acum.xMin) {
            acum.xMin = curr.x;
        }
        if (curr.x > acum.xMax) {
            acum.xMax = curr.x;
        }
        if (curr.y < acum.yMin) {
            acum.yMin = curr.y;
        }
        if (curr.y > acum.yMax) {
            acum.yMax = curr.y;
        }
        return acum;
    }, { xMin: Infinity, xMax: 0, yMin: Infinity, yMax: 0 });
    return bounds;
}

function calculateDistance(p1, p2) {
    // Manhattan distance
    return Math.abs(p1.x-p2.x) + Math.abs(p1.y-p2.y);
}

function findNearestPoint(point, pointList) {
    let minDistance = Infinity;
    let equidistant = 0;
    let nearestPoint;
    for (let point2 of pointList) {
        let distance = calculateDistance(point, point2);
        if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = point2;
            equidistant = 0;
        }
        else if (distance == minDistance) {
            equidistant++;
        }
    }
    if (equidistant == 0) {
        return nearestPoint;
    }
}

function pointIsUneligible(point, bounds) {
    return bounds[`${point.x},${point.y}`];
}

function findLargestArea(pointList) {
    let bounds = calculateBounds(pointList);
    // TODO order pointList to make search more efficient (??)
    let areaMap = {};
    let uneligiblePoints = {};
    for (let x = bounds.xMin; x <= bounds.xMax; x++) {
        for (let y = bounds.yMin; y <= bounds.yMax; y++) {
            let nearestPoint = findNearestPoint({x, y}, pointList);
            if (nearestPoint) {
                areaMap[`${nearestPoint.x},${nearestPoint.y}`] = (areaMap[`${nearestPoint.x},${nearestPoint.y}`] || 0) + 1;
                if (x == bounds.xMin || x == bounds.xMax || y == bounds.yMin || y == bounds.yMax) {
                    uneligiblePoints[`${nearestPoint.x},${nearestPoint.y}`] = 1;
                }
            }
        }
    }
    let maxArea = 0;
    pointList.forEach(point => {
        if (pointIsUneligible(point, uneligiblePoints)) {
            return;
        }
        if (areaMap[`${point.x},${point.y}`]) {
            if (areaMap[`${point.x},${point.y}`] > maxArea) {
                maxArea = areaMap[`${point.x},${point.y}`];
            }
        }
    });
    console.log(maxArea);
}

rl.on('line', line => coordinateList.push(parseLine(line)))
    .on('close', () => findLargestArea(coordinateList));
