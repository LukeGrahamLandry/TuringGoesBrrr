interface SettingsData {
    scrollZoomSpeed: number;
    keyZoomSpeed: number;
    keyMoveSpeed: number;
    frameRate: number; // TODO: onChange, update draw.ts interval delay
    wireAnimationSpeed: number;
    backgroundColour: string | CanvasGradient | CanvasPattern;
    readonly wireColourPalette: string[];
    readonly debug: boolean
}

export class Settings {
    readonly storageKey = "circuitdisplaysettings";
    default: SettingsData = {
        wireColourPalette: ["orange", "black","black","cyan","black","black","black","purple","black","black","grey","black","black"],
        debug: true,
        backgroundColour: "#32394c",
        wireAnimationSpeed: 1,
        frameRate: 20, 
        keyMoveSpeed: 5,
        keyZoomSpeed: 3,
        scrollZoomSpeed: 0.5
    };
    active: SettingsData;
    onChange: (() => void)[] = [];

    constructor (){
        this.active = this.default;
        this.loadFromStorage();
        document.getElementById("changeSettingsButton").onclick = () => this.queryUserEdit();
    }

    public get(): SettingsData {
        return this.active;
    }

    public addChangeListener(changeListener: () => void){
        this.onChange.push(changeListener);
    }

    private load(encoded: string): boolean {
        if (encoded == null) return false;
        let newSettings: SettingsData = encoded == "" ? this.default : JSON.parse(encoded);
        let valid: boolean = newSettings.wireColourPalette != undefined;
        if (valid){
            this.active = newSettings;
            window.localStorage.setItem(this.storageKey, JSON.stringify(this.active));

            for (let changeListener of this.onChange){
                changeListener();
            }
        } 
        return valid;
    }

    private queryUserEdit() {
        let result = prompt("These are the settings used to render your circuit (json format). Enter a blank string to reset to default.", JSON.stringify(this.active));
        this.load(result);
    }

    private loadFromStorage() {
        this.load(window.localStorage.getItem(this.storageKey));
    }
}

export function settings(): SettingsData {
    return (window as any).TuringGoesBrrr.settings.get()
}
