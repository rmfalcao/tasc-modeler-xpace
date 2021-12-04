interface ContextualElement {
    id: string;
    template_description?: string;
    is_intrinsic: boolean;
}

interface ContextComponent {
    contextual_element_id: string;
    value: string;
}

interface Context {
    instances: ContextComponent[];
}

interface AnalizedTask {
    id: string;
    name: string;
    contexts: Context[];
}

interface Diagram {
    analyzed_tasks: AnalizedTask[];
}

export type { ContextualElement, Diagram , Context, AnalizedTask, ContextComponent  }