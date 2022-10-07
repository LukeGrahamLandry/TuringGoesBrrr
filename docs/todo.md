- circuits
    - render
         - expand out components into different levels of abstraction 
            - so i need optimal solutions to every turing complete level
    - edit
        - ui for defining custom components 
    - simulate
        - my component definitions should have type info on the inputs then i can check if graph definition is valid and have good error messages 
- import/export
    - minecraft redstone 
        - to structures nbt format or mod that places the blocks for you
    - Turing Complete save format
    - logisim
    - verilog 
        - turing complete can also export to this? but i think it doesn't do position data so wouldn't be visually the same circuit
    - javascript
        - define custom components with a java script function that gets compiled to wasm so it can be sand boxed
    - .tgb json dump of my data structure 
    - https://nandgame.com
    - https://circuitverse.org https://github.com/CircuitVerse/CircuitVerse
    - maybe https://sebastian.itch.io/digital-logic-sim and someone forked it so that too perhaps
    - https://github.com/tilk/digitaljs https://digitaljs.tilk.eu/
        - json format for circuits and simulates in js
        - https://github.com/tilk/yosys2digitaljs converts verilog to that json format. api not frontend 
        - uses https://github.com/YosysHQ/yosys which turns verilog into physical positions of components 
        - but wasm version exists https://www.npmjs.com/package/yosys so i can fork yosys2digitaljs to use that
            - can get it as 6mb of js https://unpkg.com/yosys@0.10.5/dist/yosys.js
            - so i'd have to figure out how to load conditionally, only if they want to use the verilog feature
        - so flow would be verilog code -> (yosys2digitaljs, yosys.js) -> digitaljs json -> (my code) -> circuit object 
        - then instead of writing something that understands verilog i just have to import another circuit layout format 
- infrastructure for automated tests of your circuits 
    - let me run the same test format for each exported format
        - make a bunch of schematics that get checked every time so i can know i didn't break anything
        - mod that does the same tests in minecraft so i can check the exports work
    - levels where you build a gate from simpler ones and it evaluates performance against some tests
- ui
    - drop down menus
        - import
            - ask if replace circuit or as custom component so should be able to render targeting a different canvas 
        - export
        - edit
            - move
            - move and keep wire connections
            - pan canvas
            - delete
            - add component: menus for bit sizes and show custom components 
        - run
            - some way to give it test definitions 
            - warning when a circuit component isn't supported yet
        - about: links to docs md
    - rendering elements above the canvas for setting inputs
- when TC lets users define levels, have a way to import them 
    - let people who own the game can just point it at the tc folder and access them all in my program without me sketchily distributing or recrating TC's IP
        - would be good to have a nice UI for exploring these
- write ups about different the file formats
    - try to SEO "how to open .circ files", "what is a .circ file", ".circ file extension"
    - include a technical explanation of the data format as well
- compress tc_components.js 
- tools for teachers like https://circuitverse.org/teachers
- undo & redo 
- i can overlay html on the canvas and drag it around like circuitverse does http://jsfiddle.net/f5EMT/1/
- drop a file on the canvas to open it based on extension https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
- figure out how to load js dynamically so you can only load the parsing for the file formats you want 

```javascript
let fileFormatModules = {
    turingcomplete: ["snappyjs.min.js", "save_monger.min.js", "tc_components.js"],
    verilog: ["yosys.js", "yosys2digitaljs.js"]
}

// triggers loading animation and waits until all files are downloaded to continue
requireModule("turingcomplete")
```
