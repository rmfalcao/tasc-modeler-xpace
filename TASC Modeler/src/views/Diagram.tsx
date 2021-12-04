import  { useCallback, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    isNode,
    ReactFlowProvider,
    Position,
    ConnectionLineType,
} from 'react-flow-renderer';
import dagre from 'dagre';
import CustomEdge from './CustomEdge';
import { createDiagramElementsJSONByMatrix } from '../utils/DiagramElements';
import { MarkerDefinition } from './MarkerDefinition';
import { getContextualElementsIds, transformJsonToMatrix } from '../utils/jsonMatrixTransformation';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 200;
const nodeHeight = 50;

const getLayoutedElements = (elements: any, direction = 'LR') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    elements.forEach((el: any) => {
        if (isNode(el)) {
            dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
        } else {
            dagreGraph.setEdge(el.source, el.target);
        }
    });

    dagre.layout(dagreGraph);

    return elements.map((el: any) => {
        if (isNode(el)) {

            const nodeWithPosition = dagreGraph.node(el.id);
            el.targetPosition = isHorizontal ? Position.Left : Position.Top;
            el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

            // unfortunately we need this little hack to pass a slighltiy different position
            // to notify react flow about the change. More over we are shifting the dagre node position
            // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
            el.position = {
                x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
                y: nodeWithPosition.y - nodeHeight / 2,
            };
        }

        return el;
    });
};

const edgeTypes = {
    custom: CustomEdge,
};

const Diagram = (data: any) => {
    const { dataJSONDiagram, contextual_element } = data.data;
    const matrix = transformJsonToMatrix(dataJSONDiagram, contextual_element);
    const contextual_element_ids = getContextualElementsIds(dataJSONDiagram, contextual_element);
    const newDiagramELements = createDiagramElementsJSONByMatrix(matrix, contextual_element_ids);
    const layoutedElements = getLayoutedElements(newDiagramELements);
    const [elements, setElements] = useState<any>(layoutedElements);

    const onLayout = useCallback(
        (direction) => {
            const layoutedElements = getLayoutedElements(elements, direction);
            setElements(layoutedElements);
        },
        [elements]
    );

    return (
        <div className="layoutflow">
            <ReactFlowProvider>
                <div style={{ height: '100vh' }}>
                    <ReactFlow
                        elements={elements}
                        connectionLineType={ConnectionLineType.SmoothStep}
                        snapToGrid={true}
                        edgeTypes={edgeTypes}
                        key="edges"
                    >
                        <MarkerDefinition id="edge-marker-black" color="black" />
                        <MiniMap nodeColor={(n) => {
                            return '#000000';
                        }} />
                        <Controls />
                        <Background />
                    </ReactFlow>
                </div>
                <div className="controls">
                    <button onClick={() => onLayout('TB')}>vertical layout</button>
                    <button onClick={() => onLayout('LR')}>horizontal layout</button>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

export default Diagram;