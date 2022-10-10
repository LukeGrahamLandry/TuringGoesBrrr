# TuringGoesBrrr

## Features

- load Turing Complete Game save files 
    - render the positions of wires and components 
- export your circuit as an image (.png)

## Code Structure 

When you upload a circuit file, the string is passed to the appropriate `CircuitFileFormat` which parses it into a `Circuit` which gets parsed into an `ExecutableCircuit` which gets run by a `CircuitSimulation` whose state is queried by a `CircuitDrawContext` which draws to the screen. `CircuitFileFormat` will also have methods to convert a `Circuit` back into a string of a supported format. Each file format has a devlog entry that explains the code. 

## Build

Run `./build.sh` then open `dist/index.html` in a browser. 
