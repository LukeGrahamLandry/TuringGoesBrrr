import { uint8ToBase64 } from './format/turingcomplete';
import {runTests} from "./tests/tests"
import {getDemoCircuits} from "./tests/demoCircuits"
import {Settings, settings} from "./settings"
import { DrawContext } from './draw';
import  { CircuitFileFormat } from './format';
import { initProgressiveWebApp } from "./offline"

function getVersionHash(): string {
    return (window as any).TuringGoesBrrr.versionHash;
}

let versionElement = document.getElementById("versionhash") as HTMLAnchorElement;
versionElement.href = "https://github.com/LukeGrahamLandry/TuringGoesBrrr/commit/" + getVersionHash();
versionElement.innerText = getVersionHash().slice(0, 7);

(window as any).TuringGoesBrrr.settings = new Settings();
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
        writeLocalStorage(circuitData, CircuitFileFormat.TURING_COMPLETE_GAME);
        displayFromStorage();
    }
    reader.readAsArrayBuffer(file);
}

function openLogisimFile(){
    var file = (document.getElementById("logisimFileInput") as HTMLInputElement).files[0];
    var reader = new FileReader();
    reader.onload = function(readerEvt: ProgressEvent<FileReader>) {
        let circuitData = readerEvt.target.result as string;
        writeLocalStorage(circuitData, CircuitFileFormat.LOGISIM);
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
    circuitType: string,
    circuitData: string
}

function readLocalStorage(): Circuit {
    let storageData = window.localStorage.getItem(CIRCUIT_STORAGE_KEY);
    if (storageData == undefined || storageData == null || storageData == "") return blankCircuit();

    let data = JSON.parse(storageData) as StorageData;

    for (let format of CircuitFileFormat.all){
        if (data.circuitType == format.name) return format.import(data.circuitData);
    }
    
    return blankCircuit();
}

function displayFromStorage(){
    importCircuit(readLocalStorage());
}

function writeLocalStorage(circuitData: string, circuitType: CircuitFileFormat){
    let data: StorageData = {
        circuitData: circuitData,
        circuitType: circuitType.name
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
    writeLocalStorage(encoded, CircuitFileFormat.TURING_COMPLETE_GAME);
    displayFromStorage();
}

function exportBase64TC(){
    // TODO: fix me
    prompt("Copy this base64 string. It represents a Turing Complete circuit save file.", window.localStorage.getItem(CIRCUIT_STORAGE_KEY))
}

function loadExample(){
    writeLocalStorage(getDemoCircuits()[3].circuitData, CircuitFileFormat.TURING_COMPLETE_GAME);
    displayFromStorage();
}

document.getElementById("exportBase64Button").onclick = exportBase64TC;
document.getElementById("importBase64Button").onclick = importBase64TC;
document.getElementById("clearCanvasButton").onclick = clearCanvas;
document.getElementById("runTestsButton").onclick = runTests;
document.getElementById("loadExampleButton").onclick = loadExample;
document.getElementById("turingCompleteGameFileInput").onchange = openTCfile;
document.getElementById("logisimFileInput").onchange = openLogisimFile;
document.getElementById("canvasdownloadlink").addEventListener('click', downloadCanvasImage);
document.getElementById("fitToScreenButton").onclick = () => drawContext.transformToFitOnScreen();

function blankCircuit(): Circuit {
    return {
        wires: [],
        components: [],
        camera_position: {x:0,y:0}
    };
}

initProgressiveWebApp();