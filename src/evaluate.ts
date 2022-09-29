// like an adjacency list generated from the tc save
// start with the static input components and add their connections in order
// no obligation that the action be a pure function
let circuit = [
    {
        in: [],
        out: [1],
        action: (data, parentInputData) => [parentInputData[0]]
    },
    {
        in: [],
        out: [2],
        action: (data, parentInputData) => [parentInputData[1]]
    },
    {
        in: [1, 2],
        out: ["output"],
        action: (data, parentInputData) => [data[0] || data[1]]
    }, 
    {
        in: ["output"],
        out: [],
        action: (a, b) => undefined
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
            let outputData = component.action(inputData, parentInputData, parentInputData);

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

// compiles a circuit to a javascript functions
// outputVariableNames are the circuit variables whose value the js function will output (as an array)
export function wrapCircuit(circuit, outputVariableNames){
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
export function testCircuit(circuit, testSpec){
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

