const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

let entries = [];

function parseEntries(line) {
    let parsedEntries = line.split(" ").map(s => parseInt(s));
    entries = entries.concat(...parsedEntries);
}

function buildNode(entries) {
    let node = {
        childNodes: [], metadataEntries: []
    };
    let numChildNodes = entries.shift();
    let numMetadataEntries = entries.shift();
    for (let i = 0; i < numChildNodes; i++) {
        node.childNodes.push(buildNode(entries));
    }
    for (let i2 = 0; i2 < numMetadataEntries; i2++) {
        node.metadataEntries.push(entries.shift());
    }
    return node;
}

function processMetadata(tree) {
    let metadataSum = tree.metadataEntries.reduce((acum, curr) => acum + curr, 0);
    let childrenSum = tree.childNodes.reduce((acum, curr) => acum + processMetadata(curr), 0);
    tree.metadataSum = metadataSum;
    tree.childrenSum = childrenSum;
    return metadataSum + childrenSum;
}

function getNodeValue(node) {
    if (node.childNodes.length == 0) {
        return node.metadataSum;
    }
    let savedValues = {};
    let nodeValue = node.metadataEntries.reduce((acum, curr) => {
        let childNode = node.childNodes[curr-1];
        if (childNode) {
            let childNodeValue;
            if (savedValues[curr]) {
                childNodeValue = savedValues[curr];
            }
            else {
                childNodeValue = getNodeValue(childNode);
                savedValues[curr] = childNodeValue;
            }
            return acum + childNodeValue;
        }
        return acum;
    }, 0);
    return nodeValue;
}

function processEntries(entries) {
    let tree = buildNode(entries);
    let finalSum = processMetadata(tree);

    // console.log(tree);
    console.log(getNodeValue(tree));
}

rl.on('line', line => parseEntries(line))
    .on('close', () => processEntries(entries));
