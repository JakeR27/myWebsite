var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d");

document.documentElement.style.overflow = 'hidden';  // firefox, chrome
document.body.scroll = "no"; // ie only

canvas.height = innerHeight;
canvas.width = innerWidth;

var backgroundGrad /*= c.createLinearGradient(innerWidth/2,0,innerWidth/2, innerHeight);*/
//backgroundGrad.addColorStop(0,"#000044");
//backgroundGrad.addColorStop(1,"#0000aa")


var numDroplets = 300;
var speedDroplets = 3;
var sizeDroplets = 1;
var trailLength = 2;
var gravity = 0.2;

var dropletArray = [];

window.addEventListener('resize', function(event) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    setup();
})


function Droplet(x, y,  size, dy) {
    this.size = size
    this.y = y;
    this.x = x;
    this.colour = "#0000ff";
    this.dy = dy;
    this.radius = this.size / 2;
//    this.trail = [];
//    this.trailTemp = [];
//    this.trailColour = "rbga(0,0,0,0)"
    
    this.draw = function() {
        c.fillStyle = this.colour;
        c.strokeStyle = this.colour;
        c.beginPath();
        c.arc(this.x,this.y,this.size,0,Math.PI*2);
        c.fill();
    }
    
    this.update = function() {
//        if (this.trail.length < 4) {
//            this.trail.push(this.y);
//        } else {
//            this.trail.push(this.y);
//            this.trail.shift();
//        }
        this.drawTrailV2();
        this.draw();
        this.y += this.dy;
        this.dy += gravity * (this.size/2);
        
        this.positionPercent = (this.y / innerHeight);
        this.colourCodeR = 128+64 + (this.positionPercent * 64);
        this.colourCodeG = 0 - (this.positionPercent * 0);
        this.colourCodeB = 128+64 + (this.positionPercent * 64);
        
        
        this.colour = `rgb(${this.colourCodeR}, ${this.colourCodeG}, ${this.colourCodeB})`
        if (this.y > innerHeight) {
            this.y = 0;
            this.dy = dy;
            this.x = this.x + (50 - Math.floor(Math.random() * 100))
        }
        
        
        
    }
    
//    this.drawTrail = function() {
//        for (var i = 0; i < this.trail.length; i++) {
//            
//            this.positionPercent = (this.trail[i] / innerHeight);
//            this.colourCodeR = 128+64 + (this.positionPercent * 64);
//            this.colourCodeG = 0 - (this.positionPercent * 0);
//            this.colourCodeB = 128+64 + (this.positionPercent * 64);
//            this.alpha = (i / 5);
//            
//            
//
//
//            this.trailColour = `rgba(${this.colourCodeR}, ${this.colourCodeG}, ${this.colourCodeB}, ${this.alpha}`
//            
//            c.fillStyle = this.trailColour;
//            c.strokeStyle = this.trailColour;
//            c.beginPath();
//            c.arc(this.x,this.trail[i],this.size,0,Math.PI*2);
//            c.fill();
//        }
//    }
    this.drawTrailV2 = function() {
        this.trailGrad = c.createLinearGradient(this.x+this.size*2, this.y, this.x-(this.size*2),this.y-(20*trailLength*this.size));
                
        this.positionPercent = (this.y / innerHeight);
        this.colourCodeR = 128+64 + (this.positionPercent * 64);
        this.colourCodeG = 0 - (this.positionPercent * 0);
        this.colourCodeB = 128+64 + (this.positionPercent * 64);
        
        
        this.trailGrad.addColorStop(0,`rgba(${this.colourCodeR}, ${this.colourCodeG}, ${this.colourCodeB}, 1`);
        this.trailGrad.addColorStop(1,`rgba(${this.colourCodeR}, ${this.colourCodeG}, ${this.colourCodeB}, 0`);
        
        c.fillStyle = this.trailGrad;
        c.strokeStyle = this.trailGrad;
        c.beginPath();
        c.fillRect(this.x-this.size, this.y-(this.size*20*trailLength), this.size*2, this.size*trailLength*20);
        c.fill();
    }
}

function drawBG() {
    c.fillStyle = backgroundGrad;
    c.fillRect(0,0,innerWidth, innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight);
    
    drawBG();
    
    for (var i = 0; i < dropletArray.length; i++) {
        dropletArray[i].update();
    }
}

for (var i = 0; i < numDroplets; i++) {
    
//    var size = sizeDroplets * Math.floor((Math.random() * 3)+1);
//    var x = Math.random() * (innerWidth - this.size);
//    var dy = 1;
//    var y = Math.random() * (innerHeight);
//    
//    if (size/sizeDroplets == 1) {
//        dy = speedDroplets * 2;
//        
//    } else if (size/sizeDroplets == 2) {
//        dy = speedDroplets * 3;
//    } else if (size/sizeDroplets == 3) {
//        dy = speedDroplets * 4;
//    }
    
    if (i < numDroplets/3) {
        var size = sizeDroplets * 1;
        dy = speedDroplets * 2;
    } else if (i > numDroplets/3 && i < (numDroplets/3)*2) {
        var size = sizeDroplets * 2;
        dy = speedDroplets * 3;
    } else if (i > (numDroplets/3)*2 && i < numDroplets) {
        var size = sizeDroplets * 3;
        dy = speedDroplets * 4;
    }
    
    var x = Math.random() * (innerWidth - this.size);
    var y = Math.random() * (innerHeight);

    dropletArray[i] = new Droplet(x, y,  size, dy);
    
}

setup();

function setup() {
    backgroundGrad = c.createLinearGradient(innerWidth/2,0,innerWidth/2, innerHeight);
    backgroundGrad.addColorStop(0,"#000044");
    backgroundGrad.addColorStop(1,"#0000aa");
        
    animate();
}