



scroll wheel event that changes zoom

There's no way to check which keys are currently held down so i listen for up and down events and save the current state of each key in a map.  

### rendering

keep track of a zoom number and an offset x,y to use when rendering a circuit
scale the size of text and circles and lines based on the zoom 
offset determines which part of the circuit is in view

culling: perhaps get more performance by not trying to render things i know are out of the view port but for now it really doesn't matter

### scroll to zoom

have some tricky transformations stuff to zoom in on the mouse instead of 0,0

### frame rate

calculate deltaTime for actions that should happen at a certain speed so it doesnt matter if you're lagging

count updates per second to display

### wasd to move

### +/- to zoom

### animate electrons

### dont render all wire points

### fit to screen
