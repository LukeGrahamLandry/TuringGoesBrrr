interface Circuit {
    wires: Array<Wire>;
    components: Array<Component>;
    camera_position: Point;
}

interface Wire {
    path: Array<Point>,
    color: number,
    comment: string
}

interface Component {
    position: Point,
    kind: number
}

interface Point {
    x: number,
    y: number
}

interface ComponentWirePoint {
    offset: Point,
    type: 1 | 8 | 16 | 32 | 64
}

type WireData = Boolean | number;

interface ComponentKind {
    id: number,
    inputs: ComponentWirePoint[],
    outputs: ComponentWirePoint[],
    action(input: WireData[]): WireData[]
}
