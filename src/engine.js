
import { parseData } from "./data/parse.js";
import { centroidCalculate, sampleDistance } from "./logic/core.js";
import { plot } from "./utils/plot-data.js";

const k = 3;
const groups = parseData('./assets/training-sample.csv', k);

let keptCentroids = false;
let interateCount = 0

do {
    keptCentroids = true;
    const { centroidMatrix, sampleList } = groups.map(group => {
        const newCentroids = centroidCalculate(group);
        newCentroids.forEach((centroid, index) => {
            if (group.centroids[index] != centroid)
                keptCentroids = false;
        });
        group.centroids = newCentroids;
        return group;
    }).reduce((acc, group) => {
        acc.centroidMatrix.push(group.centroids);
        acc.sampleList = acc.sampleList.concat(group.items);
        return acc;
    }, { centroidMatrix: [], sampleList: [] });

    groups.forEach(group => group.items = []);
    sampleList.forEach(sample => {
        sample = sampleDistance(sample, centroidMatrix);
        const indexofSmallest = sample
            .distanceToCentroids
            .indexOf(Math.min(...sample.distanceToCentroids));

        groups[indexofSmallest].items.push(sample);
    })

    interateCount++;
}
while (!keptCentroids && interateCount < 30);

plot(groups);
