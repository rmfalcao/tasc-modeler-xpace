import { getMarkerEnd } from 'react-flow-renderer';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition, // we do not need for our implementation
  targetPosition, // we do not need for our implementation
  style = {},
  data,
  arrowHeadType,
}: any) {
 
  /**
   * Funtion that creates the straight path between the source and the target nodes.
   * @param sourceX 
   * @param sourceY 
   * @param targetX 
   * @param targetY 
   * @returns 
   */
  const getStraightPath=(sourceX: string, sourceY: string, targetX: string, targetY: string)=>{
    return `M${sourceX},${sourceY} ${targetX},${targetY}`;
  }
  const edgePath = getStraightPath(sourceX, sourceY, targetX, targetY);
  const markerEnd = getMarkerEnd(arrowHeadType, 'edge-marker-black');

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text>
        <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          {data.text}
        </textPath>
      </text>
    </>
  );
}