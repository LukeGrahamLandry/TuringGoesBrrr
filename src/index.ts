import { parseTuringCompleteFile, getComponentName, base64ToUint8, uint8ToBase64 } from './format/turingcomplete';
import {runTests} from "./tests/tests"
import {getDemoCircuits} from "./tests/demoCircuits"
import {Settings, settings} from "./settings"
import { DrawContext } from './draw';
import { parseLogisimFile } from './format/logisim';

enum CircuitFileType {
    TURING_COMPLETE_GAME="turingcomplete", 
    LOGISIM="logisim"
}

(window as any).TuringGoesBrrr.settings = new Settings(() => console.log("settings updated"));
let drawContext = new DrawContext();
drawContext.drawBackground();

const CIRCUIT_STORAGE_KEY = "circuitdata";

displayFromStorage();

function debugLog(s){
    if (settings().debug){
        console.log(s);
    }
}

function openTCfile(){
    var file = (document.getElementById("turingCompleteGameFileInput") as HTMLInputElement).files[0];
    var reader = new FileReader();
    reader.onload = function(readerEvt: ProgressEvent<FileReader>) {
        let circuitData = uint8ToBase64(new Uint8Array(readerEvt.target.result as ArrayBuffer));
        writeLocalStorage(circuitData, CircuitFileType.TURING_COMPLETE_GAME);
        displayFromStorage();
    }
    reader.readAsArrayBuffer(file);
}

function openLogisimFile(){
    var file = (document.getElementById("logisimFileInput") as HTMLInputElement).files[0];
    var reader = new FileReader();
    reader.onload = function(readerEvt: ProgressEvent<FileReader>) {
        let circuitData = readerEvt.target.result as string;
        writeLocalStorage(circuitData, CircuitFileType.LOGISIM);
        displayFromStorage();
    }
    reader.readAsText(file);
}

function importCircuit(circuit: Circuit){
    debugLog(["Previous Circuit: ", drawContext.circuit]);
    drawContext.circuit = circuit;
    drawContext.transformToFitOnScreen();
    debugLog(["Loaded Circuit: ", drawContext.circuit]);
}

interface StorageData {
    circuitType: CircuitFileType,
    circuitData: string
}

function readLocalStorage(): Circuit {
    let storageData = window.localStorage.getItem(CIRCUIT_STORAGE_KEY);
    if (storageData == undefined || storageData == null || storageData == "") return blankCircuit();

    let data = JSON.parse(storageData) as StorageData;
    
    let result;
    switch (data.circuitType){
        case CircuitFileType.TURING_COMPLETE_GAME:
            result = parseTuringCompleteFile(base64ToUint8(data.circuitData));
            break;
        case CircuitFileType.LOGISIM:
            result = parseLogisimFile(data.circuitData);
            break;
        default:
            result = blankCircuit();
            break;
    }

    return result;
}

function displayFromStorage(){
    importCircuit(readLocalStorage());
}

function writeLocalStorage(circuitData: string, circuitType: CircuitFileType){
    let data: StorageData = {
        circuitData: circuitData,
        circuitType: circuitType
    }

    let storageData = JSON.stringify(data);
    window.localStorage.setItem(CIRCUIT_STORAGE_KEY, storageData);
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
    debugLog(window.localStorage.getItem(CIRCUIT_STORAGE_KEY));
    window.localStorage.removeItem(CIRCUIT_STORAGE_KEY);
}

function importBase64TC(){
    let encoded = prompt("Paste a base64 encoded Turing Complete circuit save file. ");
    if (encoded == null || encoded == "") return;
    writeLocalStorage(encoded, CircuitFileType.TURING_COMPLETE_GAME);
    displayFromStorage();
}

function exportBase64TC(){
    // TODO: fix me
    prompt("Copy this base64 string. It represents a Turing Complete circuit save file.", window.localStorage.getItem(CIRCUIT_STORAGE_KEY))
}

function loadExample(){
    writeLocalStorage(getDemoCircuits()[3].circuitData, CircuitFileType.TURING_COMPLETE_GAME);
    displayFromStorage();
}

document.getElementById("exportBase64Button").onclick = exportBase64TC;
document.getElementById("importBase64Button").onclick = importBase64TC;
document.getElementById("clearCanvasButton").onclick = clearCanvas;
document.getElementById("runTestsButton").onclick = runTests;
document.getElementById("loadExampleButton").onclick = loadExample;
document.getElementById("turingCompleteGameFileInput").onchange = openTCfile;
document.getElementById("logisimFileInput").onchange = openLogisimFile;

document.getElementById("fitToScreenButton").onclick = () => drawContext.transformToFitOnScreen();

function blankCircuit(): Circuit {
    return {
        wires: [],
        components: [],
        camera_position: {x:0,y:0}
    };
}

