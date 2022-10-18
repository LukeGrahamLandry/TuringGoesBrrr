# TuringGoesBrrr

View logic circuits in your web browser! 

## Features

- load circuit files
    - Turing Complete game saves
    - Logisim or Logisim Evolution (.circ)
    - render the positions of wires and components 
- export your circuit as an image (.png)
- install progressive web app for offline use

## Code Structure 

When you upload a circuit file, the string is passed to the appropriate `CircuitFileFormat` which parses it into a `Circuit` which gets parsed into an `ExecutableCircuit` which gets run by a `CircuitSimulation` whose state is queried by a `CircuitDrawContext` which draws to the screen. `CircuitFileFormat` will also have methods to convert a `Circuit` back into a string of a supported format. Each file format has a devlog entry that explains the code. 

## Build

Run `./scripts/build.sh` (it must be run from the base project directory). Then open `dist/index.html` in a browser. Building on windows is not supported. See `scripts/README.md` to for info on environment variables that must be set for the build to work. These are used for secrets (like API keys) that cannot be committed to the repo. 
