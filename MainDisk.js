class MainDisk
{
    constructor(mass, x, y){    
      this.mass = mass;
      this.pos = createVector(x, y);
      this.speed = createVector(0,0);
      this.radius = 25;
      this.movable = false;
      this.fillColor = color('hsl(160, 100%, 50%)');
    }
    update(windowWidth, windowHeight){
      if(this.movable){
        this.pos.x = mouseX;
        this.pos.y = mouseY;
      }
      else{
        this.pos.x = windowWidth/2;
        this.pos.y = windowHeight/2;
      }
      
      this.fillColor = color('hsl(0, 30%,' + (1000/sqrt(this.mass)) + '%)');
    }
    mainDiskCollision(){
        //creating a vector that is the distance between the balls that are checked
        let distanceVector = p5.Vector.sub(otherDisk.pos, this.pos)

        //calculate the magnitude of the vector/value of the distance between disks
        //sqrt(x*x + y*y)
        let distanceVectorMag = distanceVector.mag();

        //Minimum distance to colide from the center of the disks
        let radiusSum = this.radius + otherDisk.radius;


        if (distanceVectorMag < radiusSum) {
            let distanceCorrection = (radiusSum - distanceVectorMag) / 2.0;
            let d = distanceVector.copy();
            let correctionVector = d.normalize().mult(distanceCorrection);

            otherDisk.pos.add(correctionVector);
            this.pos.sub(correctionVector);   

            let theta = distanceVector.heading();
            let sine = sin(theta);
            let cosine = cos(theta);

            let bTemp = [new p5.Vector(), new p5.Vector()];

            bTemp[1].x = cosine * distanceVector.x + sine * distanceVector.y;
            bTemp[1].y = cosine * distanceVector.y - sine * distanceVector.x;
            
            let vTemp = [new p5.Vector(), new p5.Vector()];

            vTemp[0].x = cosine * this.speed.x  + sine * this.speed.y ;
            vTemp[0].y = cosine * this.speed.y  - sine * this.speed.x ;
            vTemp[1].x = cosine * otherDisk.speed.x  + sine * otherDisk.speed.y ;
            vTemp[1].y = cosine * otherDisk.speed.y  - sine * otherDisk.speed.x ;

            let vFinal = [new p5.Vector(), new p5.Vector()];

            // final rotated this.velocity for b[0]
            vFinal[1].x =((otherDisk.mass - this.mass) * vTemp[1].x + 2 * this.mass * vTemp[0].x) / (this.mass + otherDisk.mass);
            vFinal[1].y = vTemp[1].y;

            // hack to avoid clumping
            bTemp[1].x += vFinal[1].x;

            /* Rotate ball this.positions and velocities back
             Reverse signs in trig expressions to rotate 
             in the opposite direction */
            // rotate balls
            let bFinal = [new p5.Vector(), new p5.Vector()];

            bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
            bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

            // update balls to screen this.position
            otherDisk.pos.x = this.pos.x + bFinal[1].x;
            otherDisk.pos.y = this.pos.y + bFinal[1].y;

            // update velocities
            otherDisk.speed.x = cosine * vFinal[1].x - sine * vFinal[1].y;
            otherDisk.speed.y = cosine * vFinal[1].y + sine * vFinal[1].x;
        }
    } 
    render(){  
        fill(this.fillColor);
        ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2); 
    }
  
}