export function parseLogisimFile(fileData: string): Circuit {
    let xml = new DOMParser().parseFromString(fileData,"text/xml");
    console.log(xml);

    let message = xml.childNodes[0].textContent.trim();
    console.log(message);
    
    let mainCircuitName = xml.getElementsByTagName("main")[0].attributes.getNamedItem("name").value;
    let circuitsXML = xml.getElementsByTagName("circuit");
    let circuits = {};
    for (let i=0;i<circuitsXML.length;i++){
        let name = circuitsXML[i].attributes.getNamedItem("name").value;
        circuits[name] = parseLogisimXML(circuitsXML[i]);
    }

    return circuits[mainCircuitName];
}

function parseLogisimXML(circuitXML: Element): Circuit {
    let circuit = {
        wires: [],
        components: [],
        camera_position: {x:0,y:0}
    };

    let wiresXML = circuitXML.getElementsByTagName("wire");
    for (let i=0;i<wiresXML.length;i++){
        circuit.wires.push(parseWire(wiresXML[i]));
    }

    let componentsXML = circuitXML.getElementsByTagName("comp");
    for (let i=0;i<componentsXML.length;i++){
            circuit.components.push(parseComponent(componentsXML[i]));
    }

    return circuit;
}

function parseWire(wireXML: Element): Wire {
    let fromRaw = wireXML.attributes.getNamedItem("from").value;
    let toRaw = wireXML.attributes.getNamedItem("to").value;

    let start = parsePos(fromRaw);
    let end = parsePos(toRaw);
    let points: Point[] = [];

    // they only go on x or y axis so only one of the loops will run
    let direction = {x: end.x - start.x, y: end.y - start.y};
    for (let x=0;x<Math.abs(direction.x)+1;x++){
        points.push({
            x: start.x + (Math.sign(direction.x) * x),
            y: start.y
        })
    }
    if (points.length == 0) points.push(start);
    let last = points[points.length - 1];
    
    // last is already there so dont have to start at y=0 to add the start point
    for (let y=1;y<Math.abs(direction.y)+1;y++){
        points.push({
            x: last.x,
            y: last.y + (Math.sign(direction.y) * y)
        })
    }

    return {
        path: points,
        color: 0,
        comment: ""
    };
}

function parseComponent(componentXML: Element): Component {
    let posRaw = componentXML.attributes.getNamedItem("loc").value;
    let name = componentXML.attributes.getNamedItem("name").value;

    return {
        kind: name,
        position: parsePos(posRaw)
    };
}

function parsePos(pos: string){
    let numbers = pos.slice(1, -1).split(",");
    return {x: parseInt(numbers[0]) / 10, y: parseInt(numbers[1]) / 10};
}
