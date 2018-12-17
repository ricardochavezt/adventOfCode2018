const readline = require('readline');

function parseClaim(claimString) {
    let parsedClaim = /#(\d+) @ (\d+),(\d+)\: (\d+)x(\d+)/.exec(claimString);
    let rect = {
        id: parseInt(parsedClaim[1]),
        left: parseInt(parsedClaim[2]),
        top: parseInt(parsedClaim[3]),
        width: parseInt(parsedClaim[4]),
        height: parseInt(parsedClaim[5])
    };
    rect.right = rect.left + rect.width - 1;
    rect.bottom = rect.top + rect.height - 1;
    return rect;
}

function rectsIntersect(rect1, rect2) {
    return !(rect2.top > rect1.bottom || rect1.top > rect2.bottom || rect2.left > rect1.right || rect1.left > rect2.right);
}

function intersectionRect(rect1, rect2) {
    let resultRect = {
        left: Math.max(rect1.left, rect2.left),
        top: Math.max(rect1.top, rect2.top),
        right: Math.min(rect1.right, rect2.right),
        bottom: Math.min(rect1.bottom, rect2.bottom)
    };
    resultRect.height = resultRect.bottom - resultRect.top + 1;
    resultRect.width = resultRect.right - resultRect.left + 1;
    return resultRect;
}

// let rect1 = parseClaim(process.argv[2]);
// let rect2 = parseClaim(process.argv[3]);

// if (rectsIntersect(rect1, rect2)) {
//     console.log("se intersectan");
//     console.log(intersectionRect(rect1, rect2));
// }
// else {
//     console.log("no se intersectan");
// }

function processClaims(claims) {
    let occupiedTiles = {};
    claims.forEach(claim => {
        for (let x = claim.left; x <= claim.right; x++) {
            for (let y = claim.top; y <= claim.bottom; y++) {
                occupiedTiles[`${x},${y}`] = (occupiedTiles[`${x},${y}`] || 0) + 1;
            }
        }
    });
    return Object.values(occupiedTiles).reduce((accum, curr) => curr > 1 ? accum+1 : accum, 0);
}

function findLoneClaim(claims) {
    for (let i = 0; i < claims.length; i++) {
        let loneClaim = true;
        for (let j = 0; j < claims.length; j++) {
            if (i === j) continue;
            if (rectsIntersect(claims[i], claims[j])) {
                loneClaim = false;
                break;
            }
        }
        if (loneClaim) {
            return claims[i];
        }
    }
}

const rl = readline.createInterface({ input: process.stdin });
let claims = [];
rl.on('line', line => claims.push(parseClaim(line))).on('close', () => console.log(findLoneClaim(claims)));
