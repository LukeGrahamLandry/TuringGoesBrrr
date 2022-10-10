export type ExecutableCircuit = Array<ExecutionNode>;
export type WireLabel = number | string;

export interface ExecutionNode {
    in: Array<WireLabel>,
    out: Array<WireLabel>,
    action(data: WireData[]): WireData[]
}


export function parseCircuitToGraph(circuit: Circuit): ExecutableCircuit {
    let graph: ExecutableCircuit = [];

    return graph;
}
