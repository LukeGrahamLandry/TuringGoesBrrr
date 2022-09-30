import {parseTuringCompleteFile} from "./format/turingcomplete"
import {checkEvalCircuit} from "./evaluate"
import {Settings} from "./settings"

checkEvalCircuit();

const base64ToUint8 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
const uint8ToBase64 = (arr) => btoa(Array(arr.length).fill('').map((_, i) => String.fromCharCode(arr[i])).join(''));
const settings = new Settings(reDrawCircuit);
(window as any).TuringGoesBrrr = {
    settings: settings
}

const TURINGCOMPLETE_SAVE_KEY = "turingcompletegamesave";

if (window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY) != null){
    debugLog("Restoring circuit from local storage!");
    handleTC(base64ToUint8(window.localStorage.getItem(TURINGCOMPLETE_SAVE_KEY)))
}

function debugLog(s){
    if (settings.get().debug){
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

function drawCircuit(circuit){
    var c = document.getElementById("myCanvas") as HTMLCanvasElement;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    let scale = 10;
    let xOffset = 150;
    let yOffset = 250;

    circuit.components.forEach(element => {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(element.position.x * scale + xOffset, element.position.y * scale + yOffset, 10, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.strokeStyle = "magenta";
        ctx.fillStyle = "magenta";
        ctx.font = "15px Arial";
        ctx.fillText(element.kind, element.position.x * scale + xOffset - (element.kind > 99 ? 13 : element.kind > 9 ? 8 : 4), element.position.y * scale + yOffset + 5);
    });

    circuit.wires.forEach(wire => {
        ctx.strokeStyle = settings.get().wireColourPalette[wire.color];

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
    });
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

document.getElementById("exportBase64Button").onclick = exportBase64TC;
document.getElementById("importBase64Button").onclick = importBase64TC;
document.getElementById("clearCanvasButton").onclick = clearCanvas;
document.getElementById("turingCompleteGameFileInput").onchange = openTCfile;
