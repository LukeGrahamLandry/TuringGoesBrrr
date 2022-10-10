import { parseTuringCompleteFile, base64ToUint8 } from './import/turingcomplete';
import { parseLogisimFile } from "./import/logisim"


enum DataFormat {
    BASE_64,
    XML,
    JSON,
    CODE
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
        if (options.import != undefined) this.import = options.import;
        this.name = options.name;
        this.extensions = options.extensions;
        this.dataFormat = options.dataFormat;
        CircuitFileFormat.all.push(this);
    }

    public import(circuitData: string): Circuit{
        throw new Error("Not Implemented");
    }

    public export(circuit: Circuit): string{
        throw new Error("Not Implemented");
    }
}
