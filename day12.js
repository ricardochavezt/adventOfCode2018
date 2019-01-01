const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

let initialState = "";
let generationRules = {};

function parseGenerationRule(line, generationRules) {
    let parsedLine = /([.#]{5}) => ([.#])/.exec(line);
    // we only consider the rules that generate a plant
    // if a sequence is not here, it is assumed that no plant will be there
    // in the next generation
    if (parsedLine[2] == "#") {
        generationRules[parsedLine[1]] = "#";
    }
}

function getNextState(previousState, generationRules, startIndex) {
    let nextState = "", nextStartIndex = startIndex - 2;
    let inputState = "...." + previousState + "....";
    for (let i = 0; i < inputState.length - 4; i++) {
        let slice = inputState.slice(i, i+5);
        if (generationRules[slice]) {
            nextState = nextState.concat("#");
        }
        else {
            nextState = nextState.concat(".");
        }
    }
    let firstPlantIndex = nextState.indexOf("#"), lastPlantIndex = nextState.lastIndexOf("#");
    nextState = nextState.substring(firstPlantIndex, lastPlantIndex+1);
    nextStartIndex += firstPlantIndex;
    return {nextState, nextStartIndex};
}

function calculatePositionSum(startIndex, state) {
    let index = startIndex, positionSum = 0;
    for (let pot of state) {
        if (pot == "#") {
            positionSum += index;
        }
        index++;
    }
    return positionSum;
}

function solveGenerations(initialState, generationRules, numberOfGenerations) {
    let previousState = initialState;
    let currentState = "", startIndex = 0;
    let positionSum = calculatePositionSum(startIndex, initialState);
    console.log("initialState:", initialState, ", positionSum: ", positionSum);
    for (let generation = 1; generation <= numberOfGenerations; generation++) {
        ({nextState: currentState, nextStartIndex: startIndex} = getNextState(previousState, generationRules, startIndex));
        // console.log("currentState: ", currentState, ", startIndex:", startIndex);
        previousState = currentState;
        // if (generation % 10000 == 0) {
        //     console.log('generation: ', generation);
        // }
        let nextPositionSum = calculatePositionSum(startIndex, currentState);
        console.log(generation, nextPositionSum, nextPositionSum - positionSum);
        positionSum = nextPositionSum;
    }
    // console.log(calculatePositionSum(startIndex, currentState));
}

const NUMBER_OF_GENERATIONS = Number('1000');

rl.on('line', line => {
    if (line.length == 0) {
        return;
    }
    if (line.startsWith("initial state: ")) {
        initialState = line.substring(15);
    }
    else {
        parseGenerationRule(line, generationRules);
    }
}).on('close', () => solveGenerations(initialState, generationRules, NUMBER_OF_GENERATIONS));

/******************
 *                *
 *     Part 2     *
 *                *
 ******************/

// After testing with 1000 generations, we find that after generation 98 the difference of the position sum between generations becomes constant
// (with the value of 25)
// So with this simple function we can calculate the final sum after N generations, with no waiting around

let calculateFinalSum = (generation) => 3441 + (generation - 98)*25;
