import { parseTuringCompleteFile, getComponentName, base64ToUint8, uint8ToBase64 } from './format/turingcomplete';
import {runTests} from "./tests/tests"
import {getDemoCircuits} from "./tests/demoCircuits"
import {Settings, settings} from "./settings"
import { DrawContext } from './draw';

(window as any).TuringGoesBrrr.settings = new Settings(reDrawCircuit);
let drawContext = new DrawContext();
drawContext.drawBackground();

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
    drawContext.circuit = circuit;
    drawContext.transformToFitOnScreen();

    // log & save new
    debugLog("Loaded Circuit!");
    debugLog(circuit);
    window.localStorage.setItem(TURINGCOMPLETE_SAVE_KEY, uint8ToBase64(circuitData));
}

function downloadCanvasImage() {
    drawContext.draw(true);
    var c = document.getElementById("myCanvas")  as HTMLCanvasElement;
    var dt = c.toDataURL('image/png');
    this.href = dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
};
document.getElementById("canvasdownloadlink").addEventListener('click', downloadCanvasImage, false);

function clearCanvas(){
    drawContext.circuit = undefined;
    drawContext.drawBackground();
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

document.getElementById("fitToScreenButton").onclick = () => drawContext.transformToFitOnScreen();
