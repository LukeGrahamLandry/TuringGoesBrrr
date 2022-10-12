# Importing Save Files from turingcomplete.game

September 28

## Nim

```
curl https://nim-lang.org/choosenim/init.sh -sSf | sh
export PATH=~/.nimble/bin:$PATH
```

save parsing lib is written in lang that compiles to js

```
nim js -d:release --hints:off save_monger.nim 
```

If I load that output from a script tag, the library's functions are just defined globally so I can access `parse_state` from my other JavaScript code.

### Snap Compression Library

The suppersnappy compression library wants to use low level memory manipulation but Nim only defines those functions on the c backend (not the js ones). So I deleted the bodies of the compress and uncompress method, just leaving the function header and use the `{.importc.}` schema to tell it that the function will be provided by javascript. 

Then in the html file I import [snappyjs](https://github.com/zhipeng-jia/snappyjs) which implements the same compression system. It doesn't give the functions the same signature nim expects. They're in the `SnappyJS` namespace, `uncompress` wants you to pass a max size, and O need to wrap the values from Nim to make a `Uint8Array`. So instead of changing the Nim code, I have a script tag that globally defines the methods Nim expects and wraps the `SnappyJS` method calls. 

```javascript
function compress(input){
    return SnappyJS.compress(new Uint8Array(input));
}

function uncompress(input){
    return SnappyJS.uncompress(new Uint8Array(input), Number.MAX_SAFE_INTEGER);
}
```

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

