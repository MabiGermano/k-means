export function centroidCalculate(group) {
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

export function sampleDistance(sample, centroidMatrix) {
    if (sample.attributes.length != centroidMatrix[0].length)
        throw new Error("Attributes size is different from centroids's");

    for (let index = 0; index < centroidMatrix.length; index++) {
        sample.distanceToCentroids[index] = Math.sqrt(sample.attributes.reduce(
            (sum, attribute, attributeIndex) => {
                sum = sum + Math.pow(centroidMatrix[index][attributeIndex] - attribute, 2);
                return sum;
            }, 0));
    }
    return sample;
}