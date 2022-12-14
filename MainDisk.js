class MainDisk
{
    constructor(mass, x, y){    
      this.mass = mass;
      this.pos = createVector(x, y);
      this.speed = createVector(0.0, 0.0);
      this.radius = 25;
      this.movable = false;
      this.fillColor = color('hsl(160, 100%, 50%)');
    }
    update(windowWidth, windowHeight, dt){
      if(this.movable){
        this.speed.x = -(this.pos.x - mouseX)/dt;
        this.speed.y = -(this.pos.y - mouseY)/dt;
        //print(this.speed.x + " | " + this.speed.y);

        this.pos.x = mouseX;
        this.pos.y = mouseY;
      }
      else{
        this.pos.x = windowWidth/2;
        this.pos.y = windowHeight/2;
      }
      
      this.fillColor = color('hsl(0, 30%,' + (1000/sqrt(this.mass)) + '%)');
    }

    render(){  
        fill(this.fillColor);
        ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2); 
    }
  
}