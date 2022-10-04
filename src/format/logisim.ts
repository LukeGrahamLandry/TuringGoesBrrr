
export function parseLogisimFile(fileData: string): Circuit {
    console.log(fileData);
    let xml = new DOMParser().parseFromString(fileData,"text/xml");

    let circuitsXML = xml.getElementsByTagName("circuit");
    let circuits: Circuit[] = [];
    for (let i=0;i<circuitsXML.length;i++){
        circuits.push(parseLogisimXML(circuitsXML[i]));
    }

    return circuits[0];
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


    console.log(fromRaw, toRaw)


    return {
        path: [{x:0,y:0}],
        color: 0,
        comment: ""
    };
}

function parseComponent(componentXML: Element): Component {
    return {
        kind: 0,
        position: {x: 0, y: 0}
    };
}

