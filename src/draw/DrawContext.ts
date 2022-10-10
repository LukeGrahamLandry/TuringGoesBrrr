import { settings } from "../settings";

let defaultCanvasId = "myCanvas"

export class DrawContext {
    scale: number = 1;
    offset: Point = {x:0,y:0}; // raw
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    mouse: Point = {x:0,y:0}; // screen
    xMouse: number = 0;
    yMouse: number = 0;
    pressedKeys = {};
    lastTime: number = new Date().getTime();
    deltaTime: number = 0;
    updates = 0;
    cumulativeTime = 0;
    fps = "calculating";
    renderIntervalId;

    constructor (canvas: HTMLCanvasElement = document.getElementById(defaultCanvasId) as HTMLCanvasElement){
        this.canvas = canvas;
        canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        document.addEventListener("mouseup", (e) => this.onMouseUp(e));
        canvas.addEventListener("wheel", (e) => this.onScroll(e));
        canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        this.onSettingsChanged();
        setResizeHandler(() => this.onResize(), 100);
        this.onResize();
        canvas.style.cursor = "grab";
        (window as any).TuringGoesBrrr.settings.addChangeListener(() => this.onSettingsChanged());
    }

    onSettingsChanged(){
        if (this.renderIntervalId != undefined){
            clearInterval(this.renderIntervalId);
        }

        this.renderIntervalId = setInterval(() => this.draw(), 1000 / settings().frameRate);
    }

    onResize(){
        this.canvas.width  = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight - 120;
    }

    onKeyDown(e: KeyboardEvent) {
        this.pressedKeys[e.code] = true;
    }
    onKeyUp(e: KeyboardEvent) {
        this.pressedKeys[e.code] = false;
    }

    onMouseDown(event: MouseEvent){
        if (event.button != 0) return;
        
        this.pressedKeys["MouseLeft"] = true;
        this.canvas.style.cursor = "grabbing"

        // without this the dragging will jump if you click before you ever move the mouse
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY; 
    }
    
    onMouseUp(event: MouseEvent){
        if (event.button != 0) return;

        this.pressedKeys["MouseLeft"] = false;
        this.canvas.style.cursor = "grab";
    }

    onMouseMove(event: MouseEvent){
        if (this.pressedKeys["MouseLeft"]){
            this.offset.x -= (this.mouse.x - event.offsetX) / this.scale;
            this.offset.y -= (this.mouse.y - event.offsetY) / this.scale;
        }
        
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
    }
    
    onScroll(event: WheelEvent){
        let mousePos = this.transformToRaw(this.mouse);
        this.handleZoom(event.deltaY * settings().scrollZoomSpeed / 100, mousePos)
        event.preventDefault();
    }

    handleZoom(scaleDelta: number, focalPoint: Point){
        let oldScale = this.scale;

        // move raw(0, 0) to where my mouse is
        this.offset.x += focalPoint.x;
        this.offset.y += focalPoint.y;

        // update scale based on scroll wheel
        this.scale -= scaleDelta * this.scale;
        this.scale = Math.max(this.scale, 1);
        this.scale = Math.min(this.scale, 800);

        // instead of scaling around screen(0,0) scale around raw(0,0)
        this.offset.x = (this.offset.x * oldScale) / this.scale;
        this.offset.y = (this.offset.y * oldScale) / this.scale;

        // move raw(0, 0) back where it was before
        this.offset.x -= focalPoint.x;
        this.offset.y -= focalPoint.y;
    }

    public draw(imageMode: boolean = false){
        let currentTime = new Date().getTime();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.updates++;
        this.cumulativeTime += this.deltaTime;

        this.handleKeyPresses();
        this.drawBackground();
    }

    drawBackground() {
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = settings().backgroundColour;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    handleKeyPresses() {
        if (this.pressedKeys["KeyA"]) this.offset.x += settings().keyMoveSpeed * this.deltaTime / this.scale * 100;
        if (this.pressedKeys["KeyD"]) this.offset.x -= settings().keyMoveSpeed * this.deltaTime / this.scale * 100;
        if (this.pressedKeys["KeyW"]) this.offset.y += settings().keyMoveSpeed * this.deltaTime / this.scale * 100;
        if (this.pressedKeys["KeyS"]) this.offset.y -= settings().keyMoveSpeed * this.deltaTime / this.scale * 100;
        if (this.pressedKeys["Equal"]) this.handleZoom(-settings().keyZoomSpeed * this.deltaTime, this.rawCenterOfScreen());
        if (this.pressedKeys["Minus"]) this.handleZoom(settings().keyZoomSpeed * this.deltaTime, this.rawCenterOfScreen());
    }

    rawCenterOfScreen(): Point {
        return this.transformToRaw({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        });
    }

    transformToScreen(pos: Point): Point {
        let result = {x: (pos.x + this.offset.x)* this.scale , y: (pos.y + this.offset.y) * this.scale};
        return result;
    }
    transformToRaw(pos: Point): Point {
        let result = {x: (pos.x / this.scale)- this.offset.x , y: (pos.y / this.scale)  - this.offset.y};
        return result;
    }
}

// https://stackoverflow.com/a/30688151
function setResizeHandler(callback, timeout) {
    var timer_id = undefined;
    window.addEventListener("resize", function() {
        if(timer_id != undefined) {
            clearTimeout(timer_id);
            timer_id = undefined;
        }
        timer_id = setTimeout(function() {
            timer_id = undefined;
            callback();
        }, timeout);
    });
}