# Credits to Dependencies 

## turingcomplete.game

[Turing Complete](turingcomplete.game) is a super cool game that leads you through building a computer with different levels where you unlock each component by building it from previous ones. We use their save format for circuits so they can be imported.  

Helpfully they provide a library for parsing their save files: [save_monger](https://github.com/Stuffe/save_monger) ([License: CC0](https://github.com/Stuffe/save_monger/blob/ff830c5d215b5ca4614b692359c638be034f1c07/README.md#license)). save_monger gets compiled to JavaScript when this project is built.  

save_monger uses suppersnappy ([License: MIT](https://github.com/Stuffe/save_monger/blob/ff830c5d215b5ca4614b692359c638be034f1c07/libraries/supersnappy/LICENSE)) which breaks when compiled to JavaScript so instead i use [snappyjs](https://github.com/zhipeng-jia/snappyjs) ([License: MIT](https://github.com/zhipeng-jia/snappyjs/blob/3ccc1b6cd959c8618f3dc943f296f9f5ba5ccaf9/LICENSE)).  

[turing-complete-interface](https://github.com/MegaIng/turing-complete-interface) ([License: MIT](https://github.com/MegaIng/turing-complete-interface/blob/7f79ca13e1965f7ac9c509437def57dc28d62303/LICENSE)) has a list of the offsets for the pins of each component.  

## logisim

[Logisim](http://www.cburch.com/logisim/) (or the maintained version, [Logisim Evolution](https://github.com/logisim-evolution/logisim-evolution)) is a program for designing and simulating digital logic circuits. It's GPL so i don't want to commit to using any of their code but its a giant pile of java classes that i couldn't use in this context anyway. So I'm just manually going through the XML of some .circ files it generates to figure out how to import them. They represent wires and components very similarly to Turing Complete just as XML instead of a custom binary thing. 

## build tools

- typescript
- webpack
- terser 
- nim
- python markdown
