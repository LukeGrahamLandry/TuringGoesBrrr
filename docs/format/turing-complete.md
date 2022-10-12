# Understanding the Turing Complete Game File Format (.data)

[Turing Complete](https://turingcomplete.game) is a game that guides you through building a computer from simple logic games. In each level you build a circuit that passes the given tests to unlock that as a component for future levels. Your solution to each level is stored in a (.data) file that can be opened online with [TuringGoesBrr](/circuit). With this site, you can even export your Turing Complete circuits to other formats such as Logisim (.circ) or even Minecraft redstone (.nbt). 

## Where to find my .data files

To find your game save folder, open Turing Complete, select "Settings" from the main menu and scroll down to the bottom. 

The default setting depends on your operating system:

- Windows:
- MacOS: `~/Library/Application Support/godot/app_userdata/Turing Complete`
- Linux:

Within your save folder, the `schematics` folder has a subfolder for each level. The `circuit.data` file is your latest save from that level. With the other `circuit_backup_n.data` files storing previous iterations of your design. 

## Binary Format (Technical Details)

The .data file is a raw binary file that cannot be viewed in normal text editors. It uses [Google's Snappy compression](https://en.wikipedia.org/wiki/Snappy_(compression)) format to reduce file size. The first byte is never compressed and indicates the version of the save format used (from 1 to 6, in October 2022). The game's creator provides a library, called [save_monger](https://github.com/Stuffe/save_monger), written in Nim (can be compiled to JavaScript or native assembly code via C) that parses the binary file into a useable object representation. 

## Object Format (Technical Details)

