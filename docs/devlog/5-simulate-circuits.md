# Simulating the Circuits (DEV LOG 5)

## Evaluating Circuit Graphs 

each component reads and writes values to a variables dictionary where each entry represents the state of a wire

## Generating Circuit Graphs 

fetch component pin offsets from [turing-complete-interface](https://github.com/MegaIng/turing-complete-interface)

PLAN:
each component type gets offset vectors for where wires connect to ins/outs
each wire gets a variable name 
components with ins/outs at each point of the wire are assigned to that name
ins and outs need special names so i can reference them 
distinction between static circuits and those with memory that have to keep ticking 

## Tests

started writing tests for things. run when click a button and log which ones fail

- check that my base64 encode and decode functions are inverses of each other


