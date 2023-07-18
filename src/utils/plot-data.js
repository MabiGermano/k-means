import * as fs from 'fs';
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

function _formatToPlot(groups) {
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return {
        datasets: groups.reduce((acc, group) => {
           const groupData = [{
                label: `Grupo ${group.name}`,
                data: group.items.map(item => {
                    return {
                        x: item.attributes[0],
                        y: item.attributes[1],
                    }
                }),
                backgroundColor: randomColor()
            },
            {
                    label: `Grupo ${group.name} centroid`,
                    data: [{
                        x: group.centroids[0],
                        y: group.centroids[1],
                        r: 10
                    }],
                    backgroundColor: randomColor()
            }];
            return acc.concat(groupData);
        }, [])
    };
}

async function _generateImage(configuration) {

    const width = 700;
    const height = 500;
    const backgroundColour = 'white';

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
    const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
    const base64Image = dataUrl

    var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");


    fs.writeFile("./assets/chart-output.png", base64Data, 'base64', function (err) {
        if (err)
            console.log(err);

    });
    return dataUrl
}

export function plot(groups) {
    const data = _formatToPlot(groups);
    const configuration = {
        type: 'bubble',
        data: data,
        options: {}
    }
    _generateImage(configuration);
}