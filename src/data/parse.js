import * as fs from 'fs';
import * as path from 'path';

const _regex = { newLine: /\r?\n/ }

export function parseData(trainingSamplePath, k, callback = _grouping, charDelimiter = ';') {

    const fileLoaded = fs.readFileSync(path.resolve(trainingSamplePath), 'utf-8');
             return fileLoaded.split(_regex.newLine).reduce((acc, line) => {
                 const attributeList = _retrieveAttributes(line, charDelimiter);
                 return callback(acc, {
                     classType: attributeList.pop().toString(),
                     attributes: attributeList,
                     distanceToCentroids: []
                 });
             },
                 Array.from({ length: k }, (_, index) => {
                     return {
                         name: index + 1,
                         items: [],
                         centroids: []
                     }
                 }));
}
function _grouping(groups, sample) {
    const randomIndex = Math.floor(Math.random() * groups.length);
    groups[randomIndex].items.push(sample);
    return groups;
}

function _retrieveAttributes(line, charDelimiter) {
    return line.split(charDelimiter).map(item => parseFloat(item));
}
