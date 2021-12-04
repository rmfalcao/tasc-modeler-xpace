
interface Node {
    id: string;
    data: {
        label: any;
    };
    position: {
        x: number;
        y: number;
    };
    style: {
        borderColor: string;
        background: string;
        border?: string;
        borderRadius?: string;
        color?: string;
    }
}

interface Edge {
    id: string;
    source: any;
    target: any;
    animated: boolean;
    type: string;
    data: {
        text: string;
    };
    arrowHeadType: string;
}


export type { Node, Edge}