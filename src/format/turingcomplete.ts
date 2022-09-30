function parse_state(data: Uint8Array): Circuit {
    return (window as any).SaveMonger.parse_state(data);
}

export function parseTuringCompleteFile(circuitData: Uint8Array): Circuit {
    let circuit = parse_state(circuitData);

    function fixSign(point){
        point.x = -(point.x < 2**15 ? point.x : (point.x-(2**16)))
        point.y = -(point.y < 2**15 ? point.y : (point.y-(2**16)))
    }
    fixSign(circuit.camera_position);
    circuit.components.forEach(element => {
        fixSign(element.position);
    });

    // the binary save format stores the wire points in terms of directions from the previous point
    // but their coordinate system is different like right/left and up/down are flipped
    // so this recomputes the directions, translates them to the html canvas coordinate system, then recomputes the positions
    circuit.wires.forEach(element => {
        let lastPoint = undefined;
        let newLastPoint = undefined;
        let newPoints = [];
        element.path.forEach(point => {
            fixSign(point);
            if (lastPoint != undefined){
                let direction = {
                    x: -(point.x - lastPoint.x),
                    y: -(point.y - lastPoint.y)
                }
                
                newPoints.push({
                    x: (newLastPoint.x + direction.x),
                    y: (newLastPoint.y + direction.y)
                });
                lastPoint = point;;
                newLastPoint = newPoints[newPoints.length - 1];
            } else {
                newPoints.push(point);
                lastPoint = point;
                newLastPoint = point;
            }
        });
        element.path = newPoints;

        if (element.comment.length > 0){
            element.comment = new TextDecoder("utf-8").decode(Uint8Array.from(element.comment as any));
        } else {
            element.comment = "";
        }
    });

    return circuit;
}