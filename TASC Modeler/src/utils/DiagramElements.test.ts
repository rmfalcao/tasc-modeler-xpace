import { createDiagramElementsJSONByMatrix, createEdge, createNode } from './DiagramElements';
describe("MATRIX Tests", () => {
    describe("CREATE NODE", () => {
        test('Should create a connector node', () => {
            // Fot this type of node should be null
            let contextId: string | null = null;

            // WHEN NODE
            let node_id: string = "ID-1-1";
            let nodeLabel: string = "WHEN";
            let createdNode = createNode(node_id, nodeLabel, contextId);
            expect(createdNode.style.border).toBe("1px solid #222138");
            expect(createdNode.style.borderRadius).toBe("50%");
            expect(createdNode.data.label).toBe(nodeLabel);

            // WITH NODE
            node_id = "ID-1-2";
            nodeLabel = "WITH";
            createdNode = createNode(node_id, nodeLabel, contextId);
            expect(createdNode.style.border).toBe("1px solid #222138");
            expect(createdNode.style.borderRadius).toBe("50%");
            expect(createdNode.data.label).toBe(nodeLabel);

            // THEN NODE
            node_id = "ID-1-3";
            nodeLabel = "THEN";
            createdNode = createNode(node_id, nodeLabel, contextId);
            expect(createdNode.style.border).toBe("1px solid #222138");
            expect(createdNode.style.borderRadius).toBe("50%");
            expect(createdNode.data.label).toBe(nodeLabel);
        });

        test('Should create a contextual element node', () => {
            // Fot this type of node should be null
            let contextId: string | null = "TIME_DIFFERENCE_BETWEEN_COMMENT_AND_EVENT_START_TIME";
            let node_id: string = "ID-1-1";
            let nodeLabel: string = "Current time is between 12h before event start time and 3h before event start time";
            let createdNode = createNode(node_id, nodeLabel, contextId);
            expect(createdNode.style.border).toBe("1px solid #ffffff");
            expect(createdNode.style.borderRadius).toBeUndefined();
            expect(createdNode.data.label).toBe(nodeLabel);
        });

        test('Should not create a contextual element node', () => {
            // Fot this type of node should be null
            let contextId: string | null = null;
            let node_id: string = "ID-1-1";
            let nodeLabel: string = "Current time is between 12h before event start time and 3h before event start time";
            let createdNode = createNode(node_id, nodeLabel, contextId);
            expect(createdNode.style.border).not.toBe("1px solid #ffffff");
            expect(createdNode.style.borderRadius).toBeDefined();
            expect(createdNode.data.label).toBe(nodeLabel);
        });
    });

    describe("CREATE EDGE", () => {
        test('Should create an edge', () => {
            let node_id: string = "ID-1-1";
            let another_node_id: string = "ID-1-2";
            let createdEdge = createEdge(node_id, another_node_id);
            const { id, source, target, animated, type, arrowHeadType } = createdEdge;
            expect(id).toBe(node_id.concat(another_node_id));
            expect(source).toBe(node_id);
            expect(target).toBe(another_node_id);
            expect(animated).toBe(false);
            expect(type).toBe("custom");
            expect(arrowHeadType).toBe("arrowclosed");
        });
    });

    describe("CREATE JSON OF DIAGRAM ELEMENTS", () => {
        const contextual_element_ids: any[] = [
            null,
            "TIME_DIFFERENCE_BETWEEN_COMMENT_AND_EVENT_START_TIME",
            "USER_IS_AUTHOR",
            "USER_ACCOUNT_TYPE",
            null,
            "USER_CREATES_COMMENT",
            null,
            "CONTENT_TYPE"
        ];
        const matrixManual = [
            ["WHEN", "Current time is between 1h15m after event start time and 5h30m after event start time", null, null, "THEN", "User creates a comment", "WITH", "Content type = GRATITUDE"],
            ["WHEN", "Current time is between 10h before event start time and 2h before event start time", "The user is not the post author", null, "THEN", "User creates a comment", "WITH", "Content type = REMINDER"],
            ["WHEN", "Current time is between 12h before event start time and 3h before event start time", null, "The user account is test", "THEN", "User creates a comment", null, null]];

        test('Should create the matrix', () => {
            let createdDiagramElements = createDiagramElementsJSONByMatrix(matrixManual, contextual_element_ids);
            const createdNodes = createdDiagramElements.filter((diagramElement: any) => diagramElement.data.label);
            const createdEdges = createdDiagramElements.filter((diagramElement: any) => diagramElement.source && diagramElement.target);
            let numberWHENNodes = 0;
            let numberTHENNodes = 0;
            let numberWITHNodes = 0;
            createdNodes.forEach((node: any) => {
                switch (node.data.label) {
                    case "WHEN":
                        numberWHENNodes++;
                        break;
                    case "THEN":
                        numberTHENNodes++;
                        break;
                    case "WITH":
                        numberWITHNodes++;
                        break;
                        case "WITH":
                            numberWITHNodes++;
                            break;
                    default:
                        break;
                }

            })
            expect(createdNodes.length).toBe(16);
            expect(createdEdges.length).toBe(15);
            expect(numberWHENNodes).toBe(1);
            expect(numberTHENNodes).toBe(3);
            expect(numberWITHNodes).toBe(2);
        });
    });


});

