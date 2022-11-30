class AppGUI{
    constructor(fluids){
        this.numberOfElements = document.getElementById("number_of_elemets");
        this.numberOfDisks = document.getElementById("number_of_disks");
        this.numberOfMainDisks = document.getElementById("number_of_main_disks");
        this.massOfLastMainDisk = document.getElementById("main_disk_mass");
        this.GUINumberOfFluids = document.getElementById("number_of_fluids");
        this.GUIViscosityOfFluids = document.getElementById("viscosity_table");
        
        this.isGravityCenterMovable = document.getElementById("gravity-center");
        this.isCollisionDisksEnable = document.getElementById("collision-disk");
        this.isCollisionMainDisksEnable = document.getElementById("collision-main-disk");
        this.isAerodynamicForceEnable = document.getElementById("aerodynamic-force");
        this.isSpeedLimitEnable = document.getElementById("speed-limit");
        this.isGravityDisksEnable = document.getElementById("gravity-disks");

        this.optionBackgroundColorOn = '#1d1f31';
        this.optionBackgroundColorOff = '#222444';

        for(var i = 0; i < fluids.length; i++){
            var node = document.createElement("p");

            node.id = "viscosity_" + i;
            node.innerHTML = fluids[i].viscosity;
            this.GUIViscosityOfFluids.appendChild(node);
        };
    }

    update(disksLength, mainDisksLength, mainDiskMass, fluids){
        this.numberOfElements.innerHTML = disksLength + mainDisksLength;
        this.numberOfDisks.innerHTML = disksLength;
        this.numberOfMainDisks.innerHTML = mainDisksLength;
        this.massOfLastMainDisk.innerHTML = mainDiskMass

        this.GUINumberOfFluids.innerHTML = fluids.length; 
        
    }
    render(){

    }
    toggleGravityCenterMove(boolInput){
        if(boolInput)
            this.isGravityCenterMovable.style.backgroundColor = this.optionBackgroundColorOn;
        else 
            this.isGravityCenterMovable.style.backgroundColor = this.optionBackgroundColorOff;
    }
    toggleDiskCollision(boolInput){
        if(boolInput)
            this.isCollisionDisksEnable.style.backgroundColor = this.optionBackgroundColorOn;
        else
            this.isCollisionDisksEnable.style.backgroundColor = this.optionBackgroundColorOff;
    }
    toggleMainDiskCollision(boolInput){
        if(boolInput)
            this.isCollisionMainDisksEnable.style.backgroundColor = this.optionBackgroundColorOn;
        else
            this.isCollisionMainDisksEnable.style.backgroundColor = this.optionBackgroundColorOff;
    }
    toggleAerodynamicForce(boolInput){
        if(boolInput)
            this.isAerodynamicForceEnable.style.backgroundColor = this.optionBackgroundColorOn;
        else
            this.isAerodynamicForceEnable.style.backgroundColor = this.optionBackgroundColorOff;
    }
    toggleSpeedLimit(boolInput){
        if(boolInput)
            this.isSpeedLimitEnable.style.backgroundColor = this.optionBackgroundColorOn;
        else
            this.isSpeedLimitEnable.style.backgroundColor = this.optionBackgroundColorOff;
    }
    toggleGravityDisks(boolInput){
        if(boolInput)
        this.isGravityDisksEnable.style.backgroundColor = this.optionBackgroundColorOn;
    else
        this.isGravityDisksEnable.style.backgroundColor = this.optionBackgroundColorOff;
    }

}
