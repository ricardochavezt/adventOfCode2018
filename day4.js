// The input file has been previously sorted with
// sort -k1,16 ~/Downloads/input_day4.txt > ~/Downloads/input_day4_sorted.txt

function parseRecord(line) {
    let parsedRecord = /\[\d{4}-\d{2}-\d{2} \d{2}\:(\d{2})\] (.*)/.exec(line);
    let eventText = parsedRecord[2];
    let event = {
        minute: parseInt(parsedRecord[1])
    };

    let beginEventResult = /Guard #(\d+) begins shift/.exec(eventText);
    if (beginEventResult) {
        event.type = 'begin';
        event.guardId = parseInt(beginEventResult[1]);
    }
    else if (eventText == 'falls asleep') {
        event.type = 'sleep';
    }
    else if (eventText == 'wakes up') {
        event.type = 'wakeUp';
    }
    return event;
}

function chooseGuard(guardsInfo) {
    let chosenGuard = { totalMinutes: 0 };
    for (let guard of Object.values(guardsInfo)) {
        if (guard.totalMinutes > chosenGuard.totalMinutes) {
            chosenGuard = guard;
        }
    }
    let maxOcurrences = 0;
    let chosenMinute = -1;
    for (let minute of Object.keys(chosenGuard.minuteMap)) {
        if (chosenGuard.minuteMap[minute] > maxOcurrences) {
            chosenMinute = minute;
            maxOcurrences = chosenGuard.minuteMap[minute];
        }
    }

    console.log(chosenGuard.id * chosenMinute);
}

function chooseGuard2(guardsInfo) {
    let maxOcurrencesPerMinute = 0;
    let chosenGuard = {};
    let chosenMinute = -1;
    for (let guard of Object.values(guardsInfo)) {
        let maxOcurrencesGuard = 0;
        let chosenMinuteGuard = -1;
        for (let minute of Object.keys(guard.minuteMap)) {
            if (guard.minuteMap[minute] > maxOcurrencesGuard) {
                maxOcurrencesGuard = guard.minuteMap[minute];
                chosenMinuteGuard = minute;
            }
        }
        if (maxOcurrencesGuard > maxOcurrencesPerMinute) {
            maxOcurrencesPerMinute = maxOcurrencesGuard;
            chosenGuard = guard;
            chosenMinute = chosenMinuteGuard;
        }
    }

    console.log(chosenGuard.id * chosenMinute);
}

const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

let guardsInfo = {};
let currentGuard, minuteAsleep;
rl.on('line', line => {
    let event = parseRecord(line);
    if (event.type == 'begin') {
        if (guardsInfo[event.guardId]) {
            currentGuard = guardsInfo[event.guardId];
        }
        else {
            currentGuard = { id: event.guardId, totalMinutes: 0, minuteMap: {}};
            guardsInfo[event.guardId] = currentGuard;
        }
    }
    else if (event.type == 'sleep') {
        minuteAsleep = event.minute;
    }
    else if (event.type == 'wakeUp') {
        for (let min = minuteAsleep; min < event.minute; min++) {
            currentGuard.minuteMap[min] = (currentGuard.minuteMap[min] || 0) + 1;
        }
        currentGuard.totalMinutes += event.minute - minuteAsleep;
    }
}).on('close', () => chooseGuard2(guardsInfo));
