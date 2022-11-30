class Fluid{
    constructor(viscosity, posX, posY, sizeX, sizeY){
        this.pos = createVector(posX, posY);
        this.size = createVector(sizeX, sizeY);
        this.viscosity = viscosity;
    }

    render(){
        stroke(255);
        strokeWeight(2);
        fill(100, 100, 200, (pow(this.viscosity, 1.35) * 10000));
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}