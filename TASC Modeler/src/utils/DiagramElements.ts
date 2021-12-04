import { Edge, Node } from "../models/DiagramElementModels";


let dictionaryNodeColors = new Map()
let numberOfRecursiveCallsForRandomColorAvaiable = 5;

const connectorNodeStyle = {
    color: '#333',
    border: '1px solid #222138',
    borderRadius: '50%'
}

const nodeStyle = {
    border: '1px solid #ffffff'
}

function calculateHLSParameter(max: number, min: number, interval: number) {
    const randomNumberWithinMaxMinInterval = (Math.random() * (max - min)) + min;
    const parameter = Math.floor(randomNumberWithinMaxMinInterval - (randomNumberWithinMaxMinInterval % interval));
    return parameter;
}

function generateRandomPastelColor(colorsInUse: string[]): string {
    const hue           = calculateHLSParameter(300,0,20);
    const saturation    = calculateHLSParameter(100,50,10);
    const light         = calculateHLSParameter(100,60,10);
    let color = 'hsl(' + hue + ', ' + saturation + '%, ' + light +'%)'

    if (numberOfRecursiveCallsForRandomColorAvaiable > 0) {
        if (colorsInUse.includes(color)) {
            numberOfRecursiveCallsForRandomColorAvaiable--;
            color =  generateRandomPastelColor(colorsInUse);
        } 
    }
    return color
}

/**
 * Assign a random color to the node.
 * @param createdNode 
 * @param dictionaryNodeColors 
 * @param contextId if null means is WHEN, THEN, THIS (connector node)
 * @returns 
 */
const assignNodeColor = (createdNode: any, dictionaryNodeColors: Map<string, string>, contextId: string | null) => {
    if (contextId === null) {
        createdNode = { ...createdNode, style: connectorNodeStyle }
    } else {
        const alreadyAssignedColor = dictionaryNodeColors.get(contextId);
        if (alreadyAssignedColor) {
            createdNode = { ...createdNode, style: { background: alreadyAssignedColor, ...nodeStyle } }
        } else {
            const randomColor = generateRandomPastelColor(Array.from(dictionaryNodeColors.values()));
            dictionaryNodeColors.set(contextId, randomColor)
            createdNode = { ...createdNode, style: { background: randomColor, ...nodeStyle } }
        }

    }
    return createdNode;
}

export function createNode(node_id: string, nodeLabel: string, contextId: string | null): Node {
    const position = { x: 0, y: 0 };
    let createdNode = { id: node_id, data: { label: nodeLabel }, position, style: { borderColor: 'white', background: 'red' } };
    createdNode = assignNodeColor(createdNode, dictionaryNodeColors, contextId);
    return createdNode;
}

export function createEdge(node_id: string, another_node_id: string): Edge {
    return {
        id: `${node_id}${another_node_id}`,
        source: node_id,
        target: another_node_id,
        animated: false,
        type: 'custom',
        data: { text: '' },
        arrowHeadType: 'arrowclosed'
    }

}

function areArraysEqual(array1: any[], array2: string | any[]) {
    return array1.length === array2.length && array1.every((value: any, index: any) => value === array2[index]);
}

function createNodeId(i: string | number, j: string | number) {
    return "ID-" + i + "-" + j;
}

export function createDiagramElementsJSONByMatrix(matrix: any[], contextual_element_ids: any[]) {
    let isNew;
    let diagramElements = [];

    for (let i = 0; i < matrix.length; i++) {
        // new line, clear last_referred_node
        let previous_cell_id = "";
        let next_cell_id = "";
        for (let j = 0; j < matrix[i].length; j++) {
            let hasSameEnd = false;
            isNew = true;
            const cell = matrix[i][j];

            if (cell) {
                for (let ii = 0; ii < i; ii++) {
                    const previous_occurrence = matrix[ii][j];

                    //if (typeof previous_occurrence !== "undefined")  {
                    if (previous_occurrence) {
                        if (previous_occurrence === cell) {
                            // there is an equal previous_occurrence. Check whether the line is equal so far
                            if (areArraysEqual(matrix[i].slice(0, j), matrix[ii].slice(0, j))) {
                                isNew = false;
                                previous_cell_id = createNodeId(ii, j);
                                break;
                            } else if (areArraysEqual(matrix[i].slice(j), matrix[ii].slice(j))) {
                                isNew = false;
                                hasSameEnd = true;
                                next_cell_id = createNodeId(ii, j);
                                break;
                            }

                        }
                    }
                }

                if (isNew) {
                    const cell_id = "ID-" + i + "-" + j;
                    const createdNode = createNode(cell_id, cell, contextual_element_ids[j]);
                    diagramElements.push(createdNode);

                    if (previous_cell_id) {
                        const createdEdge = createEdge(previous_cell_id, cell_id)
                        diagramElements.push(createdEdge);
                    }

                    previous_cell_id = cell_id;

                } else if (hasSameEnd) {
                    const createdEdge = createEdge(previous_cell_id, next_cell_id);
                    diagramElements.push(createdEdge);

                    break;
                }

            }


        }
    }
    return diagramElements;
}