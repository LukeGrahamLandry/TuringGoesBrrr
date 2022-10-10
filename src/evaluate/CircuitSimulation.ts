import { parseCircuitToGraph, WireLabel, ExecutableCircuit } from "../format/export/ExecutableCircuit";

type VariableStore = Map<WireLabel, WireData>

export class CircuitSimulation {
    circuit: Circuit; 
    circuitGraph: ExecutableCircuit;
    variables: VariableStore = new Map();

    constructor(circuit: Circuit){
        this.circuit = circuit;
        this.circuitGraph = parseCircuitToGraph(this.circuit);
    }

    public tick(){

    }
}



//////////////////////////////////////////////////////////////////////////

let circuit: ExecutableCircuit = [
    {
        in: ["in0"],
        out: [1],
        action: (data) => data
    },
    {
        in: ["in1"],
        out: [2],
        action: (data) => data
    },
    {
        in: [1, 2],
        out: ["output"],
        action: (data) => [data[0] || data[1]]
    }, 
    {
        in: ["output"],
        out: [],
        action: (a) => undefined
    }
]

function nandAction(input: WireData[]): WireData[]{
    return [!(input[0] && input[1])];
}

let NOT: ExecutableCircuit = [
    {
        in: ["in0"],
        out: [1],
        action: (data) => data
    },
    {
        in: [1, 2],
        out: ["output"],
        action: nandAction
    }, 
    {
        in: ["output"],
        out: [],
        action: (a) => undefined
    }
]

let NESTED_NOT: ExecutableCircuit = [
    {
        in: ["in0"],
        out: [1],
        action: (data) => data
    },
    {
        in: [1, 2],
        out: ["output"],
        action: circuitToAction(NOT)
    }, 
    {
        in: ["output"],
        out: [],
        action: (a) => undefined
    }
]

// runs a circuit with the given inputs
// returns the values of all variables at the end of execution
export function evaluateCircuit(circuit, parentInputData){
    // each variable is the state of a wire so the object mixes types but each entry should be a static type
    let variables = {

    }
    // which components have already been processed
    let completed = [];

    for (let i=0;i<parentInputData.length;i++){
        variables["in" + i] = parentInputData[i];
    }

    while (completed.length < circuit.length){
        for (let c=0;c<circuit.length;c++){
            if (completed.indexOf(c) != -1) continue;
            let component = circuit[c];
            
            // read variables into input array
            let inputData = [];
            let error = false;
            for (let i=0;i<component.in.length;i++){
                let name = component.in[i];
                let value = variables[name];
                if (value == undefined){
                    error = true;
                    break;
                } else {
                    inputData.push(value);
                }
            }
            if (error) continue;

            // evaluate
            let outputData = component.action(inputData);

            // write output array into variables
            for (let i=0;i<component.out.length;i++){
                let name = component.out[i];
                let value = outputData[i];
                variables[name] = value;
            }

            completed.push(c);
        }
    }
    
    return variables;
}

type CircuitAction = (data: WireData[]) => WireData[];

// converts a circuit to an action that may be used as a component in other circuits
function circuitToAction(circuit: ExecutableCircuit): CircuitAction {
    // collect all output components
    let names = [];
    for (let component of circuit){
        if (component.out.length == 0){
            names = [...names, ...component.in];
        }
    }

    // wrap and return those values
    let circ = wrapCircuit(circuit, names);
    return (input: WireData[]) => {
        return circ(input);
    }
}

// compiles a circuit to a javascript functions
// outputVariableNames are the circuit variables whose value the js function will output (as an array)
function wrapCircuit(circuit, outputVariableNames){
    return (inputs) => {
        let endingVariables = evaluateCircuit(circuit, inputs);
        let outputs = [];
        outputVariableNames.forEach(name => {
            outputs.push(endingVariables[name]);
        });
        return outputs;
    }
}

// run a circuit with the inputs testSpec.in and compare the output to testSpec.out
// returns true if the circuit's output matches the desired one
function testCircuit(circuit, testSpec){
    let endingVariables = evaluateCircuit(circuit, testSpec.in);
    let success = true;
    for (let name in testSpec.out) {
        if (endingVariables[name] != testSpec.out[name]) {
            success = false;
            break;
        }
    }

    return success;
}

function iterateBits(){
    return [true, false];
}

export function checkEvalCircuit(){
    console.log("testing circuit evaluate.ts");

    // test whether my example circuit behaves the same as the OR operator for every combination of input bits
    let count = 0;
    for (let a in iterateBits()){
        for (let b in iterateBits()){
            let scenario = {
                in: [a, b],
                out: {"output": (a || b)}
            };
            if (testCircuit(circuit, scenario)){
                count++;
            }
        }
    }
    console.log("or gate passed " + count + "/4 tests");

    let orGateFunction = wrapCircuit(circuit, ["output"]);
    console.log(orGateFunction([true, false]))
}

