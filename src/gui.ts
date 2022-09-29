
class Entity {

}

class Empty extends Entity {

}

class Wire extends Entity {

}

class Toggle extends Entity {

}

type int = number;

// use for placeable schematics as well 
class GridSection {
    width: int;
    height: int;
    contents: Entity[][];
    constructor(width: int = 256, height: int = 256){
        this.height = height;
        this.width = width;
        for (let i=0;i<this.width;i++){
            for (let j=0;i<this.height;j++){
                this.contents[i][j] = new Empty();
            }
        }
    }
}

class GuiDataHandler {
    gridScale: number;
    gridOffsetX: number;
    gridOffsetY: number;
    currentlyPlacableObject: Entity;
    data: GridSection;

    constructor() {
        this.gridScale = 20;
        this.gridOffsetX = 0;
        this.gridOffsetY = 0;
        this.data = new GridSection();
    }

    getGridPos(mouseX: int, mouseY: int): [int, int]{
        return [(mouseX + this.gridOffsetX) * this.gridScale, (mouseY + this.gridOffsetY) * this.gridScale]
    }

    getSection(gridX: int, gridY: int): GridSection{
        return this.data;
    }

    getEntity(gridX: int, gridY: int){
        let section = this.getSection(gridX, gridY);
        let relX = gridX % section.width;
        let relY = gridY % section.height;
        return section.contents[relX][relY];
    }
}

class RenderEvents extends GuiDataHandler {
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
    }
    render(){

    }

    onClickPress(mouseX: int, mouseY: int){
    
    }

    onClickRelease(mouseX: int, mouseY: int){
    
    }

    onKeyPress(key){

    }
}