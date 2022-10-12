# Understanding the Logisim File Format (.circ)

[Logisim](http://www.cburch.com/logisim/) is a Java application for creating and simulating logic circuits. Logisim stopped receiving updates in 2014, however a fork called [Logisim Evolution](https://github.com/logisim-evolution/logisim-evolution) is still maintained. Since Logisim was released under the [GNU General Public License](https://www.gnu.org/licenses/quick-guide-gplv3.html), the source code for it and all forks is freely available. Anyone may choose to develop and release their own version. 

## What is a .circ file?

Logisim stores the data for circuits you create as files with the .circ extension. These files store the positions of all the wires and components that make up the circuit. They are XML files with a custom extension. 

## How to open .circ files?

Since the base format of .circ files is XML, they can be opened by any text editor. However, you'll just see their raw content and not an easily understandable graphical representation of the circuit. 

Of course .circ files may be opened by the program that generated them (Logisim or Logisim Evolution). This will allow you to view, edit and simulate the circuits. However, if you'd rather not wait to download an application to see your circuits, they can be opened online by [TuringGoesBrrr](/circuit). TuringGoesBrrr can even export your circuit to be simulated in different games such as Minecraft redstone (.nbt), [Turing Complete](turing-complete) or Conway's Game of Life. This lets you use Logisim as a simple editor to create complex working computers in sandbox games. 

## .circ XML Structure (Technical Details)

