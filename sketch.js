// @Init program variables
let windowWidth = 800;
let windowHeight = 800;

// Gui of our application
let appGUI;

//Delta time used for our calculations
let dt = 1/5;

//create array for our disks
let disks = [];
let fluids = [];
let mainDisks = [];

let numberOfDisks = 10;
let numberOfMainDisks = 1;


let viscosityBaseFluid = 0.015; 
let baseMainDiskMass = 0;

let optionalDiskCollision = false;
let optionalMainDiskCollision = false;
let optionalMaxSpeedDisk = false;
let optionalGravityDisks = false;
let optionalAerodynamicForce = false;



let maxSpeedDisk = 1000;


//Function that runs on the start of the program
//Used for initing basic stuff for our program like the objects and canvas etc.
function setup() {
  // init canvas for our program
  createCanvas(windowWidth, windowHeight);
  background(0);

  //init the vector to the center of the screen
  pos = createVector(windowWidth/2, windowHeight/2);

  /*
   * - create our main disk which will be the main point of gravity,
   *   the position is attached to the mouse
   * - We can place our disk by pressing the left mouse button 
  */
  addMainDisk();

  for(var i = 0; i < numberOfDisks; i++){
    addRandomDisk();
  }


  /**
   * init 5 diffrent fluids that create 5 diffrent horizontal layers
   * that are used for the aerodynamical force on our disks
   */
  fluids.push(new Fluid(viscosityBaseFluid, 0 , 0 , windowWidth, windowHeight/2));
  fluids.push(new Fluid(viscosityBaseFluid * 1.1, 0, windowHeight/2, windowWidth, windowHeight/8));
  fluids.push(new Fluid(viscosityBaseFluid * 1.5, 0, windowHeight/2 + windowHeight/8, windowWidth, windowHeight/8));
  fluids.push(new Fluid(viscosityBaseFluid * 2, 0, windowHeight/2 + 2*windowHeight/8, windowWidth, windowHeight/8));
  fluids.push(new Fluid(viscosityBaseFluid * 2.5, 0, windowHeight/2 + 3*windowHeight/8, windowWidth, windowHeight/8));

  appGUI = new AppGUI(fluids);

  frameRate(30);
}



//Function that loops itself while the program is running
function draw() {
  //clear the background
  background(0);

  //update all physics that are happening
  updateObjects();
  
  //Render all of our objects on the canvas
  renderObjects();

  //Rendering the GUI that is used on the right side of our application
  appGUI.update(disks.length, mainDisks.length , mainDisks[mainDisks.length - 1].mass, fluids);
}

function updateObjects(){
  //update the movement of our main disk (by pressing q, then moving the mouse)
  mainDisks[mainDisks.length - 1].update(windowWidth, windowHeight);
  
  for(var i = 0; i < disks.length; i++){
    //fluid collision(being inside the fluid) our disk is seen here a a rectangle.
    if(optionalAerodynamicForce){
      for(var j = 0; j < fluids.length; j++){
        if (
            disks[i].pos.x < fluids[j].pos.x + fluids[j].size.x &&
            disks[i].pos.x + disks[i].radius * 2 > fluids[j].pos.x &&
            disks[i].pos.y < fluids[j].pos.y + fluids[j].size.y &&
            disks[i].pos.y + disks[i].radius * 2  > fluids[j].pos.y
        ){
          disks[i].viscosity = fluids[j].viscosity;
        }
      }
    }
    else{
      disks[i].viscosity = 0;
    }
    //update our disk gravity movement with the mainDisks
    for(var j = 0; j < mainDisks.length; j++){
        disks[i].update(mainDisks[j].mass, mainDisks[j].pos.x, mainDisks[j].pos.y, mainDisks[j].radius, dt, optionalMaxSpeedDisk);
    }

    //update our disk gravity movement with the other disks
    if(optionalGravityDisks){
      for(var j = 0; j < disks.length; j++){
        if(j != i)
          disks[i].update(disks[j].mass, disks[j].pos.x, disks[j].pos.y, disks[j].radius, dt, optionalMaxSpeedDisk)
      }
    }

    //check for collision with the border
    disks[i].collisionBorder(windowWidth, windowHeight);
    //check for collision with another disk
    if(optionalDiskCollision){
      for(var j = 0; j < disks.length; j++)
        if(j != i)
          disks[i].checkDiskCollision(disks[j], optionalMaxSpeedDisk);
    }
    //check for collision with a main disk
    if(optionalMainDiskCollision){
        for(var j = 0; j < mainDisks.length; j++)
          disks[i].checkMainDiskCollision(mainDisks[j], optionalMaxSpeedDisk);
    }
    //disks[i].checkDiskCollision(mainDisk);
    //disks[i].limitSpeed(1);
  }

}

function renderObjects(){
  appGUI.render();
  if(optionalAerodynamicForce){
    for(var i = 0; i < fluids.length; i++){
      fluids[i].render();
    }
  }
  for(var i = 0; i < disks.length; i++){
    disks[i].render();
  }
  for(var i = 0; i < mainDisks.length; i++){
    mainDisks[i].render();
  }
}

function keyPressed() {
  //key variable is the char of the pressed key
  //by pressing 'q' make the mainDisk movable with the mouse.
  if (key === 'q') {
    if(!mainDisks[mainDisks.length - 1].movable){
      mainDisks[mainDisks.length - 1].movable = true;
      appGUI.toggleGravityCenterMove(true);//GUIOptionCenterGravity.style.backgroundColor = '#1d1f31';
    }
    else{
      mainDisks[mainDisks.length - 1].movable = false;
      appGUI.toggleGravityCenterMove(false);//GUIOptionCenterGravity.style.backgroundColor = '#222444';
    }
  }
  if (key === 'w'){
    addRandomDisk();
  }
  if (key === 'e'){
    disks.pop();
  }

  if (key === 'r'){
    if(!optionalDiskCollision){
      optionalDiskCollision = true;
      appGUI.toggleDiskCollision(true);
    }
    else{
      optionalDiskCollision = false;
      appGUI.toggleDiskCollision(false);
    }
  }

  if (key === 's'){
    if(!optionalMainDiskCollision){
      optionalMainDiskCollision = true;
      appGUI.toggleMainDiskCollision(true);
    }
    else{
      optionalMainDiskCollision = false;
      appGUI.toggleMainDiskCollision(false);
    }
  }
  if (key === 't'){
    if(!optionalGravityDisks){
      optionalGravityDisks = true;
      appGUI.toggleGravityDisks(true);
    }
    else{
      optionalGravityDisks = false;
      appGUI.toggleGravityDisks(false);
    }
  }
  if (key === 'y'){
    if(!optionalAerodynamicForce){
      optionalAerodynamicForce = true;
      appGUI.toggleAerodynamicForce(true);
    }
    else{
      optionalAerodynamicForce = false;
      appGUI.toggleAerodynamicForce(false);
    }
  }
  if (key === 'u'){
    if(!optionalMaxSpeedDisk){
      optionalMaxSpeedDisk = true;
      appGUI.toggleSpeedLimit(true);
    }
    else{
      optionalMaxSpeedDisk = false;
      appGUI.toggleSpeedLimit(false);
    }
  }
  if(key === ' '){
    addMainDisk(mouseX, mouseY, true);
  }

}

function addMainDisk(posX = pos.x, posY = pos.y, initMovable = false){
  mainDisks.push(new MainDisk(baseMainDiskMass, posX, posY))
  mainDisks[mainDisks.length - 1].movable = initMovable;
}

function addRandomDisk(){
  disks.push(new Disk(
    int(random(5, 50)),
    int(random(50, windowWidth - 50)),
    int(random(50, windowHeight - 50)),
    random(-1, 1),
    random(-1, 1),
    int(random(255)),
    int(random(255)),
    int(random(255))
  ));
}

function mouseWheel(event) {
  mainDisks[mainDisks.length - 1].mass += event.delta/5;
  print(mainDisks[mainDisks.length - 1].mass);
}

