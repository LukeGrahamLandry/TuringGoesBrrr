import { settings } from "../settings";
import { DrawContext } from './DrawContext';
import { CircuitSimulation } from "../evaluate/CircuitSimulation"

export class CircuitDrawContext extends DrawContext {
    circuit: Circuit = undefined;
    simulation: CircuitSimulation;
    wirePositionData = [];
    wireProgress = 0;

    public setCircuit(circuit: Circuit){
        this.circuit = circuit;
        this.simulation = new CircuitSimulation(circuit);
    }

    public draw(imageMode: boolean = false){
        if (this.noCircuit() || document.hidden) return;

        super.draw(imageMode);
       
        this.circuit.wires.forEach((e) => this.drawWire(e));
        this.circuit.components.forEach((e) => this.drawComponent(e));
        if (this.scale > 5) this.animateElectronFlow();
        
        if (!imageMode) this.displayDebugInfo();
    }

    displayDebugInfo(){
        this.ctx.strokeStyle = "white";
        this.ctx.fillStyle = "white";
        this.ctx.font = "10px Arial";
        this.ctx.textAlign = "left";
        let pos = this.transformToRaw(this.mouse);
        this.ctx.fillText(`Mouse: (${pos.x.toFixed(0)}, ${pos.y.toFixed(0)})`, 0, 10);
        this.ctx.fillText(`Scale: ${this.scale.toFixed(2)}x`, 0, 20);
        this.ctx.fillText(`FPS: ${this.fps}`, 0, 30);

        // consider displaying decimal (this.updates/this.cumulativeTime) if you get less than 1 frame per second 
        // but at that point i should just try to fix performance or nobody will use it ever
        if (this.cumulativeTime > 1){
            this.fps = this.updates.toFixed(0);
            this.cumulativeTime = 0;
            this.updates = 0;
        }
    }

    drawComponent(component: Component){
        this.ctx.lineWidth = this.scale * 1/10;
        let pos = this.transformToScreen(component.position);
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, this.scale * 1, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = "magenta";
        this.ctx.fillStyle = "magenta";
        this.ctx.font = (this.scale * 1) + "px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(component.kind, pos.x, pos.y);
    }

    // draw a line from each point to the next
    // draw a circle around the start and end points
    drawWire(wire: Wire){
        this.ctx.strokeStyle = settings().wireColourPalette[wire.color];

        this.ctx.beginPath();
        
        this.ctx.lineWidth = this.scale * 1/10 * 2;
        let pos = this.transformToScreen(wire.path[0]);
        this.ctx.moveTo(pos.x, pos.y);
        let skip = true;
        wire.path.forEach(point => {
            if (!skip){
                pos = this.transformToScreen(point);
                this.ctx.lineTo(pos.x, pos.y);
            } else {
                skip = false;
            }
        });
        this.ctx.stroke();

        this.ctx.lineWidth = this.scale * 1/10;
        [wire.path[0], wire.path[wire.path.length - 1]].forEach(point => {
            this.ctx.beginPath();
            let pos = this.transformToScreen(point);
            this.ctx.arc(pos.x, pos.y, this.scale * (1/3), 0, 2 * Math.PI);
            this.ctx.stroke();
        });
    }

    // note: sometimes i will have to negate the wireProgress because they don't always flow in the order placed
    // order of wire.path depends on which order you clicked the ends when drawing
    // the simulation needs to decide which end emits electrons 
    animateElectronFlow() {
        this.ctx.fillStyle = "green";

        for (let i=0;i<this.circuit.wires.length;i++){
            let points = this.circuit.wires[i].path;
            if (points.length < 2) continue;
            for (let j=0;j<points.length-1;j++){

                // start point + direction to next point scaled by progress
                let pos = this.transformToScreen({
                    x: points[j].x + ((points[j + 1].x - points[j].x) * this.wireProgress),
                    y: points[j].y + ((points[j + 1].y - points[j].y) * this.wireProgress)
                });

                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, this.scale * (1/9), 0, 2 * Math.PI);
                this.ctx.fill()
            }   
        }

        this.wireProgress += settings().wireAnimationSpeed * this.deltaTime;
        while (this.wireProgress >= 1){
            this.wireProgress -= 1;
        }
    }


    // keep around for numbers perhaps
    animateDataFlowSingle() {
        this.ctx.fillStyle = "green";

        if (this.wirePositionData.length != this.circuit.wires.length){
            this.wirePositionData = [];
            this.circuit.wires.forEach((wire) => this.wirePositionData.push({
                index: 0,
                progress: 0
            }));
        }

        for (let i=0;i<this.circuit.wires.length;i++){
            let points = this.circuit.wires[i].path;
            let data = this.wirePositionData[i];

            let pos = this.transformToScreen({
                x: points[data.index].x + ((points[data.index + 1].x - points[data.index].x) * data.progress),
                y: points[data.index].y + ((points[data.index + 1].y - points[data.index].y) * data.progress)
            });
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, this.scale * (1/3), 0, 2 * Math.PI);
            this.ctx.fill()

            // only have to travel n-1 units
            data.progress += settings().wireAnimationSpeed * (points.length - 1);
            if (data.progress >= 1){
                data.progress -= 1;
                data.index++;
                if (data.index == points.length - 1) {
                    data.index = 0;
                }
            }
        }
    }

    noCircuit(): boolean {
        return this.circuit == undefined || this.canvas == undefined;
    }

    public transformToFitOnScreen(){
        if (this.noCircuit()) return;

        // calculate min and max point of the circuit
        let max = {x: -Infinity, y: -Infinity};
        let min = {x: Infinity, y: Infinity};

        let update = (pos: Point) => {
            if (pos.x > max.x) max.x = pos.x;
            if (pos.y > max.y) max.y = pos.y;
            if (pos.x < min.x) min.x = pos.x;
            if (pos.y < min.y) min.y = pos.y;
        }

        this.circuit.wires.forEach((e) => e.path.forEach(update));
        this.circuit.components.forEach((e) => update(e.position));

        // move the min point to the top left corner
        this.offset.x = -min.x;
        this.offset.y = -min.y;

        // determine how much zoom to fill the canvas (100px padding) in both x and y dimensions
        let circuitWidth = max.x - min.x;
        let wTargetScale = (this.canvas.width - 100) / circuitWidth;
        let circuitHeight = max.y - min.y;
        let hTargetScale = (this.canvas.height - 100) / circuitHeight;

        // pick the smaller scale so both dimensions fit
        this.scale = Math.min(wTargetScale, hTargetScale)

        // center the circuit in the canvas along the x axis
        let rawCanvasWidth = this.canvas.width / this.scale;
        let widthDif = rawCanvasWidth - circuitWidth;
        this.offset.x += widthDif / 2;

        // center the circuit in the canvas along the y axis
        let rawCanvasHeight = this.canvas.height / this.scale;
        let heightDif = rawCanvasHeight - circuitHeight;
        this.offset.y += heightDif / 2;
    }
}
