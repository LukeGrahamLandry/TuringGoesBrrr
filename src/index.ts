import { parseTuringCompleteFile, getComponentName, base64ToUint8, uint8ToBase64 } from './format/turingcomplete';
import {runTests} from "./tests/tests"
import {getDemoCircuits} from "./tests/demoCircuits"
import {Settings, settings} from "./settings"

(window as any).TuringGoesBrrr.settings = new Settings(reDrawCircuit);

const TURINGCOMPLETE_SAVE_KEY = "turingcompletegamesave";

if (window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY) != null){
    debugLog("Restoring circuit from local storage!");
    handleTC(base64ToUint8(window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY)));
}

function debugLog(s){
    if (settings().debug){
        console.log(s);
    }
}

function openTCfile(){
    var file = (document.getElementById("turingCompleteGameFileInput") as HTMLInputElement).files[0];
    var reader = new FileReader();
    reader.onload = function(readerEvt: ProgressEvent<FileReader>) {
        handleTC(new Uint8Array(readerEvt.target.result as ArrayBuffer));
    }
    reader.readAsArrayBuffer(file);
}

function handleTC(circuitData){
    // log old
    debugLog("Clearing Circuit!")
    debugLog(window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY));
    
    // load & draw new
    let circuit = parseTuringCompleteFile(circuitData);
    drawCircuit(circuit);

    // log & save new
    debugLog("Loaded Circuit!");
    debugLog(circuit);
    window.localStorage.setItem(TURINGCOMPLETE_SAVE_KEY, uint8ToBase64(circuitData));
}

function drawCircuit(circuit: Circuit, canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement){
    var ctx = canvas.getContext("2d");

    ctx.canvas.width  = window.innerWidth * 0.9;
    ctx.canvas.height = window.innerHeight - 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = settings().backgroundColour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let scale = 10;
    let xOffset = 150;
    let yOffset = 250;

    function drawComponent(component: Component){
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(component.position.x * scale + xOffset, component.position.y * scale + yOffset, 10, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.strokeStyle = "magenta";
        ctx.fillStyle = "magenta";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(getComponentName(component.kind), component.position.x * scale + xOffset, component.position.y * scale + yOffset + 5);
    }

    circuit.components.forEach(drawComponent);

    function drawWire(wire: Wire){
        ctx.strokeStyle = settings().wireColourPalette[wire.color];

        ctx.beginPath();
        
        ctx.moveTo(wire.path[0].x * scale + xOffset, wire.path[0].y * scale + yOffset);
        let skip = true;
        wire.path.forEach(point => {
            if (!skip){
                ctx.lineTo(point.x * scale + xOffset, point.y * scale + yOffset);
            } else {
                skip = false;
            }
        });
        ctx.stroke();
        

        wire.path.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x * scale + xOffset, point.y * scale + yOffset, 3, 0, 2 * Math.PI);
            ctx.stroke();
        });
    }

    circuit.wires.forEach(drawWire);
}

function downloadCanvasImage() {
    var c = document.getElementById("myCanvas")  as HTMLCanvasElement;
    var dt = c.toDataURL('image/png');
    this.href = dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
};
document.getElementById("canvasdownloadlink").addEventListener('click', downloadCanvasImage, false);

function clearCanvas(){
    var c = document.getElementById("myCanvas") as HTMLCanvasElement;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    debugLog("Clearing Circuit!")
    debugLog(window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY));
    window.localStorage.removeItem(TURINGCOMPLETE_SAVE_KEY);
}

function importBase64TC(){
    let encoded = prompt("Paste a base64 encoded Turing Complete circuit save file. ");
    if (encoded == null || encoded == "") return;
    handleTC(base64ToUint8(encoded));
}

function exportBase64TC(){
    prompt("Copy this base64 string. It represents a Turing Complete circuit save file.", window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY))
}

function reDrawCircuit(){
    handleTC(base64ToUint8(window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY)));
}

function loadExample(){
    handleTC(base64ToUint8(getDemoCircuits()[3].circuitData))
}

document.getElementById("exportBase64Button").onclick = exportBase64TC;
document.getElementById("importBase64Button").onclick = importBase64TC;
document.getElementById("clearCanvasButton").onclick = clearCanvas;
document.getElementById("runTestsButton").onclick = runTests;
document.getElementById("loadExampleButton").onclick = loadExample;
document.getElementById("turingCompleteGameFileInput").onchange = openTCfile;
