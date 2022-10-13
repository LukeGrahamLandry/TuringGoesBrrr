# Improving Circuit Rendering Canvas

October 3

I'm working on making my circuit rendering in the canvas more interactive. Most of this behaviour is in `DrawContext` with the circuit specific animation/drawing code split off into `CircuitDrawContext` so I can reuse the same event handling and render transformation logic for later canvas based stuff. 

### key binds

There's no way to check which keys are currently held down so i listen for up and down events and save the current state of each key in a map.  
same for mouse

### drawing

keep track of a zoom number and an offset x,y to use when rendering a circuit
scale the size of text and circles and lines based on the zoom 
offset determines which part of the circuit is in view

todo
culling: perhaps get more performance by not trying to render things i know are out of the view port but for now it really doesn't matter

### scroll to zoom

have some tricky transformations stuff to zoom in on the mouse instead of 0,0

### drag to move

when the mouse moves (and is pressed), get the delta between the current mouse position and the last mouse position
scale that back to raw coords and update the offset

css pointer looks like the grabbing hand

### frame rate

calculate deltaTime for actions that should happen at a certain speed so it doesnt matter if you're lagging

count updates per second to display

### wasd to move

just change offset on key press. 
divide by zoom so you move at a consistent screen speed instead of super fast when zoomed in
since this happens every update instead of on an event, have to multiply by deltaTime as well

### +/- to zoom

change zoom on key press. multiply by deltaTime
refactor previous zoom method so i can input a focal point instead of always centering on the mouse so when using keys you zoom in on the middle of the screen 

### animate electrons

tried one moving along each wire and restarting when it got to the end. 
got direction to next node and lerped there
since i had them all go at the same speed it looked strange that some components emitted more electrons depending on the length of the wire

tried them all moving at different speeds so they traversed their wire in the same time.
speed divided by length-1 (fences not fence posts)
that was better but strange that apparent resistance was inversely dependent on wire length

decided to render one on each wire segment
still looks strange cause faster on diagonals but subtle and hard to deal with i think cause i'd have to actually simulate moving along the whole wire instead of just looping over the one segment repeatedly

todo
still the problem of flowing based on the order you dragged the wire when building circuit instead of based on inputs and outputs of components. 
will fix when i simulate

### dont render all wire points

instead of rendering circles at every point along the wire, i just draw the line segments and circles on the ends. 

todo
when i integrate the component pin positions, should draw those as circles and just have line segment wires

### fit to screen

calculate the min and max point of a circuit
scale so that the whole thing fits on the canvas (with a bit of padding)
translate the min corner to the top left 
i do this automatically when you import a file so you can actually see it

todo
make sure the whole rendering of the component and pins fit, not just one corner of it

### Component Name Map

In save_monger I can export the `component_kind` enum so I can access the names for each component ID number from JavaScript and render those strings to make debugging easier once I get to simulating the circuits. 

```nim
for kind in component_kind:
  SaveMonger.component_kinds[$kind] = kind
```
