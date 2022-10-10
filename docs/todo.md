# Project Road Map

## File Formats 

- import/export
    - Turing Complete save format
    - logisim
    - .tgb json dump of my data structure 
    - https://nandgame.com
    - https://circuitverse.org https://github.com/CircuitVerse/CircuitVerse
    - maybe https://sebastian.itch.io/digital-logic-sim and someone forked it so that too perhaps
- import only 
    - verilog
        - https://github.com/tilk/digitaljs https://digitaljs.tilk.eu/
        - json format for circuits and simulates in js
        - https://github.com/tilk/yosys2digitaljs converts verilog to that json format. api not frontend 
        - uses https://github.com/YosysHQ/yosys which turns verilog into physical positions of components 
        - but wasm version exists https://www.npmjs.com/package/yosys so i can fork yosys2digitaljs to use that
            - can get it as 6mb of js https://unpkg.com/yosys@0.10.5/dist/yosys.js
            - so i'd have to figure out how to load conditionally, only if they want to use the verilog feature
        - so flow would be verilog code -> (yosys2digitaljs, yosys.js) -> digitaljs json -> (my code) -> circuit object 
        - then instead of writing something that understands verilog i just have to import another circuit layout format
- export only
    - minecraft redstone 
        - to structures nbt format or mod that places the blocks for you
    - brainfuck
        - https://esolangs.org/wiki/Brainfuck#Hello.2C_World.21 
        - also write my own interpreter like https://copy.sh/brainfuck/ 
    - game of life 
        - https://nicholas.carlini.com/writing/2020/digital-logic-game-of-life.html
        - write my own simulator 
        - https://en.wikipedia.org/wiki/Hashlife ? wasm?
        - https://conwaylife.com/wiki/File_formats
    - javascript
        - define custom components with a java script function that gets compiled to wasm so it can be sand boxed

## Features  

- really i should define components in terms of other components from the beginning
- infrastructure for automated tests of your circuits 
    - let me run the same test format for each exported format
        - make a bunch of schematics that get checked every time so i can know i didn't break anything
        - mod that does the same tests in minecraft so i can check the exports work
    - levels where you build a gate from simpler ones and it evaluates performance against some tests
- drop down menus: import, export, edit, run, about
- on import ask if replace circuit or as custom component so should be able to render targeting a different canvas 
- expand out components into different levels of abstraction 
    - so i need optimal solutions to every turing complete level
- when TC lets users define levels, have a way to import them 
    - let people who own the game can just point it at the tc folder and access them all in my program without me sketchily distributing or recrating TC's IP
        - would be good to have a nice UI for exploring these
- compress tc_components.js 
- undo & redo 
- i can overlay html on the canvas and drag it around like circuitverse does http://jsfiddle.net/f5EMT/1/
- drop a file on the canvas to open it based on extension https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
- use webworkers to speed up simulation/life/brainfuck? https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers (same just async script as Service Worker just not specifically for intercepting network requests)
- load/save to google drive / dropbox / one drive 
- figure out how to load js dynamically so you can only load the parsing for the file formats you want 

```javascript
let fileFormatModules = {
    turingcomplete: ["snappyjs.min.js", "save_monger.min.js", "tc_components.js"],
    verilog: ["yosys.js", "yosys2digitaljs.js"]
}

// triggers loading animation and waits until all files are downloaded to continue
requireModule("turingcomplete")
```

## SEO Ideas

- write ups about different the file formats
    - try to SEO "how to open .circ files", "what is a .circ file", ".circ file extension"
    - include a technical explanation of the data format as well
    - for minecraft computers just talk about how to get the base components. gates, memory, clock, lamps. 
- specific pages targeting "open .circ file online", etc. that has upload button that sends you to the main circuit viewer after selecting a file 
- articles about how the components become a computer
    - just describe the solutions to some turing complete levels
    - overview of the architecture of ALUs, registers, addressable memory, stack, CU, etc

## Monetization Ideas 

1. let people white label it to include on their own site
    - should be easy to only allow iframe from certain domains that paid
2. patreon goals for new features
    - sponsor ware; everyone gets those features for free
3. sell premium version 
    - no ads
    - full screen mode 
    - use on mobile (could still be PWA just enable the listeners)
    - uncapped clock speed
    - get source code if i stop maintaining 
        - detailed instructions for building and hosting
        - bundle required libraries
        - let build set env variable to disable payment/auth code
    - just get emailed a magic link for login 
        - use cf workers 
        - server signs message that gets stored in local storage then app checks if its valid
        - only load crypto js if there's something to check or even let people easily exploit if they can deobfuscate the js
    - lifetime vs subscription 
        - subscriptions feel slimy but reoccurring revenue is so much better to keep developing features 
        - maybe like jetbrains where you keep the last version you bought
4. see if relevant products would sponsor it. surely it would be worth more to them than algorithmic ads
    - turingcomplete.game
    - https://computerengineeringforbabies.com
    - https://www.nand2tetris.org/ (courses/book?)
    - management games like factorio or the trains one  
5. ads
    - ugly, slow, makes so little money per view
    - could be incentive to purchase ad free or white label version
    - see if i can get a nice ad network like ethicalads
    - ads for my mod commissions before real network or if adblock or offline
6. charge for server side stuff
    - cloud storage of circuits
    - multi-user editing at the same time
    - build out tools for teachers like https://circuitverse.org/teachers
        - not really an audience likely to pay for stuff?
7. just charge to use it
    - feels less slick than just being free
    - people aren't going to want it without testing it first 
