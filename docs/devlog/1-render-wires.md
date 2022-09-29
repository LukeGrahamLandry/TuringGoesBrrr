

## Nim

save parsing lib is written in lang that compiles to js

### compression lib
cant use c memory access functions so compression library doesnt work
so just delete it all and have the function definitions to fill in from java script with another impl of that lib


### problems with binary numbers
nim's signed numbers use twos complement for negatives but when passed to javascript its interpreted as a normal number
so just do some subtraction in js to wrap around, any coordinates past 32k are actually small negative numbers

### overflow
cant parse one of the fields but idk what its for so just skip it

## rendering

wires use a different coordinate system