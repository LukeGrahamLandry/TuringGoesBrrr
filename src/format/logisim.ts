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


    console.log(fromRaw, toRaw)


    return {
        path: [{x:0,y:0}],
        color: 0,
        comment: ""
    };
}

function parseComponent(componentXML: Element): Component {
    let posRaw = componentXML.attributes.getNamedItem("loc").value;
    let name = componentXML.attributes.getNamedItem("name").value;

    return {
        kind: 0,
        position: {x: 0, y: 0}
    };
}

