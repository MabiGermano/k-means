import { parseData } from "./parse.js";

const k = 2;
function grouping(groups, sample) {
    const randomIndex = Math.floor(Math.random() * groups.length);
    groups[randomIndex].items.push(sample);
    return groups;
}

const groups = parseData('./assets/training-sample.csv', k, grouping);

function centroidCalculate(group) {
    const totalItems = group.items.length;
    return group.items.reduce((acc, groupItem) => {
        for (let index = 0; index < groupItem.attributes.length; index++) {
            acc[index] = acc[index] ?
                acc[index] + groupItem.attributes[index] :
                groupItem.attributes[index];
        }
        return acc;
    }, [])
        .map(attributeAmount => attributeAmount / totalItems);
}

function sampleDistance(sample, centroidMatrix) {
    if (sample.attributes.length != centroidMatrix[0].length)
        throw new Error("Attributes size is different from centroids's")

    for (let index = 0; index < sample.attributes.length; index++) {
        sample.distanceToCentroids[index] = Math.sqrt(sample.attributes.reduce(
            (sum, attribute, attributeIndex) => {
                sum = sum + Math.pow(centroidMatrix[index][attributeIndex] - attribute, 2);
                return sum;
            }, 0));
    }
    return sample;
}

let keptCentroids = false;
let interateCount = 0

do {
    keptCentroids = true;
    const { centroidMatrix, sampleList } =  groups.map(group => {
        const newCentroids = centroidCalculate(group);
        newCentroids.forEach((centroid, index) => {
            if (group.centroids[index] != centroid)
                keptCentroids = false;
        });
        group.centroids = newCentroids;
        return group;
    })
    .reduce((acc, group) => {
        acc.centroidMatrix.push(group.centroids);
        acc.sampleList = acc.sampleList.concat(group.items);
        return acc;
    }, { centroidMatrix: [], sampleList: []})

    groups.forEach(group => group.items = []);
    sampleList.forEach(sample => {
        sample = sampleDistance(sample, centroidMatrix);
        const indexofSmallest = sample
            .distanceToCentroids
            .indexOf(Math.min(...sample.distanceToCentroids));
        groups[indexofSmallest].items.push(sample);
    })



    // groups()
    // .then(arrayGroups => {
    //     return arrayGroups.map(group => {
    //         const newCentroids = centroidCalculate(group);
    //         newCentroids.forEach((centroid, index) => {
    //             if (group.centroids[index] != centroid)
    //                 keptCentroids = false;
    //         });
    //         group.centroids = newCentroids;
    //         return group;
    //     })
    // })
    //     .then((arrayGroups) => {
    //         return arrayGroups.reduce((acc, group) => {
    //             acc.centroidMatrix.push(group.centroids);
    //             acc.sampleList = acc.sampleList.concat(group.items);
    //             return acc;
    //         }, { centroidMatrix: [], sampleList: [], arrayGroups: arrayGroups })
    //     })
    //     .then(({ centroidMatrix, sampleList, arrayGroups }) => {
    //         arrayGroups = arrayGroups.map(group => {
    //             group.items = [];
    //             return group
    //         });
    //         sampleList.map(sample => {
    //             sample = sampleDistance(sample, centroidMatrix);
    //             const indexofSmallest = sample
    //                 .distanceToCentroids
    //                 .indexOf(Math.min(...sample.distanceToCentroids));
    //             arrayGroups[indexofSmallest].items.push(sample);
    //         })
    //         groups(arrayGroups)
    //         return arrayGroups;
    //     }).then(arr => {
    //         r = arr})
    interateCount++;
}
while (!keptCentroids && interateCount < 30);


