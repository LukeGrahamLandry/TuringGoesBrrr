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