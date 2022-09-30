

## Nim

```
curl https://nim-lang.org/choosenim/init.sh -sSf | sh
export PATH=~/.nimble/bin:$PATH
```

save parsing lib is written in lang that compiles to js

### compression lib

cant use c memory access functions so compression library doesnt work
so just delete it all and have the function definitions to fill in from java script with another impl of that lib

just importing that library and then have a script that where i globally define the compress & uncompress functions the nim code expects. in nim i just write the function header and use the `{.importc.}` schema to tell it that the function will be provided by javascript


### problems with binary numbers
nim's signed numbers use twos complement for negatives but when passed to javascript its interpreted as a normal number
so just do some subtraction in js to wrap around, any coordinates past 32k are actually small negative numbers

it just pads with 0s to get to the 32 bits or whatever it wants. 

### overflow
cant parse one of the fields but idk what its for so just skip it

## Rendering Circuits 

The TC save files use a different coordinate system than the HTML canvas (axises are flipped). For the positions of the components I can just transform their coordinates but wires are more complicated. The wire's path is stored as an array of points on the circuit object but in the binary format they're stored as a start point and then the direction offset to get to the next point. Naively transforming the points to the new coordinate system ends up with each wire reflected. Instead, I have to recompute that list of offsets, transform each offset vector to the new coordinate system and then recompute the points with the correct system. 

For now I'm just drawing the components as circles with their `kind` number as text above them. I'll have to create real textures and map them to their numbers at some point. 

The `comment` field on wires comes in as a array of numbers (that were bytes) and gets interpreted as a utf-8 string.

