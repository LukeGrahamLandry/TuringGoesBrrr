import { parseTuringCompleteFile, base64ToUint8 } from './turingcomplete';
import { parseLogisimFile } from "./logisim"


enum DataFormat {
    BASE_64,
    XML,
    JSON
}

export class CircuitFileFormat {
    name: string;
    extensions: string[];
    dataFormat: DataFormat;

    static all: CircuitFileFormat[] = [];

    static TURING_COMPLETE_GAME = new CircuitFileFormat({
        import: (data) => parseTuringCompleteFile(base64ToUint8(data)),
        name: "turingcomplete",
        extensions: ["data"],
        dataFormat: DataFormat.BASE_64
    });

    static LOGISIM = new CircuitFileFormat({
        import: parseLogisimFile,
        name: "logisim",
        extensions: ["circ"],
        dataFormat: DataFormat.XML
    });

    constructor(options){
        this.import = options.import;
        this.name = options.name;
        this.extensions = options.extensions;
        this.dataFormat = options.dataFormat;
        CircuitFileFormat.all.push(this);
    }

    public import(circuitData: string): Circuit{
        throw new Error("Not Implemented");
    }
}
