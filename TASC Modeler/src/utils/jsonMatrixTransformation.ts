import { ContextualElement, Diagram, AnalizedTask, Context} from '../models/Matrix';


enum NODES {
    WHEN= "WHEN",
    THEN="THEN",
    WITH="WITH",
  }

/**
 * We assume that the contextual elements are sorted by instrisec value. First no instrisec CE, then instrisex CE.
 * @param diagram 
 * @returns list of ids of the header of the matrix
 */
export const getMatrixHeaderIds = (diagram: Diagram, contextual_elements: ContextualElement[]): any[] => {
    const { analyzed_tasks } = diagram;
    // number 3 is comung from WHEN, THEN, THIS NODES
    const numberOfExceptionalNodes = 3;
    const numberOfInstrisecContextualElement = contextual_elements.reduce((total, ce)=> (ce.is_intrinsic?total+1: total), 0 );
    const contextualElementsIds: any[] = new Array(contextual_elements.length + analyzed_tasks.length + numberOfExceptionalNodes).fill(null);
    //First position always WHEN
    contextualElementsIds[0] = NODES.WHEN;
    contextual_elements.every((ce, index) => {
        if (!ce.is_intrinsic) {
            contextualElementsIds[index + 1] = ce.id;
            return true;
        } else {
            contextualElementsIds[index + 1] = NODES.THEN

            const startTasksIndex = index + 2;
            // from here we need to fullfill the tasks
            analyzed_tasks.forEach((task, index) => {
                contextualElementsIds[startTasksIndex + index] = task.id;
            });

            // after task we set the WITH position
            contextualElementsIds[startTasksIndex + analyzed_tasks.length] = NODES.WITH;

            //  now we fullfill the array with the intrisec contextual elements
            const startIntrinsecContextualElementIndex = startTasksIndex + analyzed_tasks.length  +  1;
            for(var j=0; j < numberOfInstrisecContextualElement; j++){
                contextualElementsIds[startIntrinsecContextualElementIndex + j] = contextual_elements[index + j].id;
            }
            return false;
        }
    });
    return contextualElementsIds;
};

export const getContextualElementsIds = (data: Diagram, contextual_elements: ContextualElement[])=> {
    const matrixHeaderIDs = getMatrixHeaderIds(data, contextual_elements);

    // we need to replace the nodes WHEN, THEN and WITH to null
    return matrixHeaderIDs.map(header=> Object.values(NODES).indexOf(header) > -1 ? null: header );
}

const createRow = (context: Context, task: AnalizedTask, contextualElementsIds: any[], contextual_elements: ContextualElement[]): any[] => {
    const newRow = new Array(contextualElementsIds.length).fill(null);

    context.instances.forEach(cc => {
        const contextualElementObject = contextual_elements.find(c_e => c_e.id === cc.contextual_element_id);
        const index = contextualElementsIds.indexOf(cc.contextual_element_id);
        const taskIndex = contextualElementsIds.indexOf(task.id);
        const thenIndex = contextualElementsIds.indexOf(NODES.THEN);
        newRow[0] = NODES.WHEN ;
        newRow[index] = cc.value;
        newRow[taskIndex] = task.name;
        newRow[thenIndex] = NODES.THEN;

        // Only when a contextual element is intrinsic we have to use WITH
        if(contextualElementObject?.is_intrinsic){
            newRow[taskIndex+1] = NODES.WITH;
        }
        
    })
    return newRow;
};



export const transformJsonToMatrix = (data: Diagram, contextual_elements: ContextualElement[]): any[] => {
    const { analyzed_tasks } = data;
    const matrixHeaderIDs = getMatrixHeaderIds(data, contextual_elements);
    const rows: any[] = [];
    analyzed_tasks[0].contexts.forEach((context: any) => {
        rows.push(createRow(context, analyzed_tasks[0], matrixHeaderIDs, contextual_elements));
    })
    console.table(rows);
    return rows;
}