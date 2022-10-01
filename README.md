# TuringGoesBrrr

## Features

- load Turing Complete Game save files 
    - render the positions of wires and components 
- export your circuit as an image (.png)

## globals accessible from console

- `TuringGoesBrrr`
    - `settings`: wire colour pallette, debug mode, etc
- `SaveMonger` 
    - `parse_state`: accesses the nim function that parses binary Turing Complete Game save files into a usable object. Note that this does not preform normalization
- `SnappyJS`
    - `uncompress`: used by save_monger
    - `compress`
