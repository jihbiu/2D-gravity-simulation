class Disk 
{
    constructor(mass, posX, posY, velX, velY, r, g, b){
      this.mass = mass;
      this.color = color;
      this.pos = createVector(posX, posY);
      this.speed = createVector(velX, velY);
      this.forceVec = createVector(0, 0);
      this.rColor = r;
      this.gColor = g;
      this.bColor = b;
    
      this.viscosity;
      this.speedLimit = 50;

      this.radius = sqrt(mass * 3);
    }  

    update(otherMass, otherPosX, otherPosY, otherDiskRadius, dt, optionalMaxSpeedDisk){
        //the same function as is written below, does the same, takes less code
        //const distance = Math.sqrt(pow(otherPosX - this.pos.x, 2) + pow(otherPosY - this.pos.y, 2))
        const distance = dist(this.pos.x, this.pos.y, otherPosX, otherPosY);

        //creating a aditional vector to know the direction of the force
        const tVector = createVector(
          (otherPosX - this.pos.x),
          (otherPosY - this.pos.y)
        );
        
        //updating the force vector with the gravity to the mainDisk object
        this.forceVec.set(
          6.67 * this.mass * otherMass * tVector.x / pow(pow(distance, 2) + 10, 3.0/2.0),
          6.67 * this.mass * otherMass * tVector.y / pow(pow(distance, 2) + 10, 3.0/2.0)
        );
        

        //adding the aerodynamic force of the "liquid" our disk are in
        this.forceVec.add(
          -6 * PI * this.speed.x * this.viscosity * this.radius,
          -6 * PI * this.speed.y * this.viscosity * this.radius
        );
    
        //add to our current speed the force we got on our object divided by the mass
        this.speed.add(
          this.forceVec.x * dt  / this.mass,
          this.forceVec.y * dt / this.mass
        );

        if(optionalMaxSpeedDisk){
          this.limitSpeed(this.speedLimit);
        }

        this.pos.add(
          dt* this.speed.x,
          dt* this.speed.y
        );
        
    }

    collisionBorder(windowWidth, windowHeight){
        if (this.pos.x > windowWidth - this.radius) {
          this.pos.x = windowWidth - this.radius;
          this.speed.x *= -1;
        }
        else if (this.pos.x < this.radius) {
          this.pos.x = this.radius;
          this.speed.x *= -1;
        } 
        else if (this.pos.y > windowHeight - this.radius) {
          this.pos.y = windowHeight - this.radius;
          this.speed.y *= -1;
        } 
        else if (this.pos.y < this.radius) {
          this.pos.y = this.radius;
          this.speed.y *= -1;
        }
    }

    checkDiskCollision(otherDisk, optionalMaxSpeedDisk){
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

            vFinal[0].x =
            ((this.mass - otherDisk.mass) * vTemp[0].x + 2 * otherDisk.mass * vTemp[1].x) /
            (this.mass + otherDisk.mass);
            vFinal[0].y = vTemp[0].y;

            // final rotated this.velocity for b[0]
            vFinal[1].x =((otherDisk.mass - this.mass) * vTemp[1].x + 2 * this.mass * vTemp[0].x) / (this.mass + otherDisk.mass);
            vFinal[1].y = vTemp[1].y;

            // hack to avoid clumping
            bTemp[0].x += vFinal[0].x;
            bTemp[1].x += vFinal[1].x;

            /* Rotate ball this.positions and velocities back
             Reverse signs in trig expressions to rotate 
             in the opposite direction */
            // rotate balls
            let bFinal = [new p5.Vector(), new p5.Vector()];

            bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
            bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
            bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
            bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

            // update balls to screen this.position
            otherDisk.pos.x = this.pos.x + bFinal[1].x;
            otherDisk.pos.y = this.pos.y + bFinal[1].y;

            this.pos.add(bFinal[0]);

            // update velocities
            this.speed.x = cosine * vFinal[0].x - sine * vFinal[0].y;
            this.speed.y = cosine * vFinal[0].y + sine * vFinal[0].x;
            otherDisk.speed.x = cosine * vFinal[1].x - sine * vFinal[1].y;
            otherDisk.speed.y = cosine * vFinal[1].y + sine * vFinal[1].x;

            if(optionalMaxSpeedDisk){
              this.limitSpeed(this.speedLimit);
            }
        }
    }
    
      checkMainDiskCollision(otherDisk, optionalMaxSpeedDisk){
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

          vFinal[0].x =
          ((this.mass - otherDisk.mass) * vTemp[0].x + 2 * otherDisk.mass * vTemp[1].x) /
          (this.mass + otherDisk.mass);
          vFinal[0].y = vTemp[0].y;

          // final rotated this.velocity for b[0]
          vFinal[1].x =((otherDisk.mass - this.mass) * vTemp[1].x + 2 * this.mass * vTemp[0].x) / (this.mass + otherDisk.mass);
          vFinal[1].y = vTemp[1].y;

          // hack to avoid clumping
          bTemp[0].x += vFinal[0].x;
          bTemp[1].x += vFinal[1].x;

          /* Rotate ball this.positions and velocities back
           Reverse signs in trig expressions to rotate 
           in the opposite direction */
          // rotate balls
          let bFinal = [new p5.Vector(), new p5.Vector()];

          bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
          bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
          bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
          bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

          // update balls to screen this.position
          this.pos.add(bFinal[0]);

          // update velocities
          this.speed.x = cosine * vFinal[0].x - sine * vFinal[0].y;
          this.speed.y = cosine * vFinal[0].y + sine * vFinal[0].x;


          print(this.speed.x + " | " + this.speed.y);

          if(optionalMaxSpeedDisk){
            this.limitSpeed(this.speedLimit);
          }
        }
    }
    
    limitSpeed(speedLimit){
        if(this.speed.x > speedLimit){
            this.speed.x = speedLimit;
        }
        if(this.speed.x < -speedLimit){
            this.speed.x = -speedLimit;
        }
        if(this.speed.y > speedLimit){
            this.speed.y = speedLimit;
        }
        if(this.speed.y < -speedLimit){
            this.speed.y = -speedLimit;
        }
    }
    
    render(){
      stroke(255);
      strokeWeight(2);
      fill(this.rColor, this.gColor, this.bColor);
      ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }
}