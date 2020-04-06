var canvas = document.getElementById("myCanvas");
var c = canvas.getContext("2d");

document.documentElement.style.overflow = 'hidden';  // firefox, chrome
document.body.scroll = "no"; // ie only

canvas.height = innerHeight;
canvas.width = innerWidth;

c.lineWidth = 30;
c.font = "100px sans-serif";
c.textAlign = "center";




//######//COLORS -- CIRCLES
//#//Standard colour scheme - Black, light blue & purple, dark blue & purple
var colA = ["#1c2133", "#2b6ea8", "#5d99bf", "#333968", "#000000"];
//
////"MutedTones" colour scheme - Gold, light gold, white, black
var colB = ["#c0b283", "#dcd0c0", /*"#f4f4f4",*/ "#373737"];
//
////"Neon" colour scheme - Vdark purple, pink, purple, white
var colC= ["#0e0b16", "#a239ca", "#4717f6", /*"#e7dfdd"*/];
//
////"Clean" colour scheme - light blue, light grey, light red, white
var colD = [/*"#caebf2", "#a9a9a9", */"#ff3b3f", /*"#efefef"*/];

//"Luxury" colour scheme - dark blue, gold, light red, white
//var colE = ["#0f1626", "#ab987a", "#ff533d", "#333968"];

var temp = [];
var coloursA = temp.concat(colA,colB,colC,colD/*,colE*/)

var backgroundColour = 0;




//######//VARIABLES

////////CLOCK
var xCenter = innerWidth / 2;
var yCenter = innerHeight / 2;

var colours = [];
colours = ["#000000","#062f4f","#814772","#b82601", "#ffffff"];


////////CIRCLES
var numCircles = ((innerHeight * innerWidth) / 10000) * 20

var mouse = {
    x: undefined,
    y: undefined,
}; 

var key = {
    keyCode: undefined,
}

var circleArray = [];

//Set to 0 for growth near mouse, set to 1 for shrinkage near mouse
var growShrink = 0

//Grow distance for x
var gDx = 50;
var gDxa = 50;
//Grow distance for y
var gDy = 50;
var gDya = 50;




//######//EVENTS -- CIRCLES
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener("keypress", function(event) {
    key.keyCode = event.keyCode;
    if (key.keyCode == 32) {
        switchBg();
    }
    if (key.keyCode == 13) {
        switchGrow();        
    }
    if (key.keyCode == 109) {
        growthShrink();
    }
})




//######//FUNCTIONS

////////CLOCK
function NewCircle(pos, end, colour) {
    this.startPoint = degToRad(0)
    this.endPoint = end
    
    if (innerHeight < innerWidth) {
        this.radius = yCenter / (pos + 0.5);
    } else {
        this.radius = xCenter / (pos + 0.5);
    }
    
    c.beginPath();
    c.strokeStyle = colour;
    c.arc(xCenter, yCenter, this.radius, this.startPoint, end);
    c.stroke();
}

function drawTimeString(text) {
    if (backgroundColour == 0) {
        c.fillStyle = colours[0];
    } else if (backgroundColour == 1) {
        c.fillStyle = colours[4];
    }
    
    this.tLength = text.length;
    c.fillText(text, xCenter, yCenter/4);
    }

function degToRad(deg) {
    var f = Math.PI / 180;
    return (f * deg);
}

function calcAngleMillis(mil) {
    var factor = (360 / 1000) / 60;
    var result = degToRad(factor * mil);
    return result;
}

function calcAngleSeconds(secs) {
    var factor = 360 / 60;
    var result = degToRad(factor * secs);
    return result;
}

function calcAngleMinutes(mins) {
    var factor = 360 / 60;
    var result = degToRad(factor * mins);
    return result;
}

function calcAngleHours(hrs) {
    var factor = 360 / 24;
    var result = degToRad(factor * hrs);
    return result;
}

function calcAngleDays(days) {
    var factor = 360 /7;
    var result = degToRad(factor * days);
    return result;
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight)
    
    /////////CLOCK
    var now = new Date();
    var milliseconds = now.getMilliseconds();
    var seconds = now.getSeconds();
    var minutes = now.getMinutes();
    var hours = now.getHours();
    var day = now.getDay();
    
    var angleMillis = calcAngleMillis(milliseconds) - degToRad(1);
    var angleSeconds = calcAngleSeconds(seconds - degToRad(1));
    var angleMinutes = calcAngleMinutes(minutes) - degToRad(1);
    var angleHours = calcAngleHours(hours) - degToRad(1);
    var angleDays = calcAngleDays(day) - degToRad(1);
    
    ////////CIRCLES
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }   
    
    ////////CLOCK
    if (backgroundColour == 0) {
        new NewCircle(1,angleMillis+angleSeconds,colours[0]);
    } else if (backgroundColour == 1) {
        new NewCircle(1,angleMillis+angleSeconds,colours[4]);
    }
    
    new NewCircle(1.5,angleMinutes,colours[1]);
    new NewCircle(2.5,angleHours,colours[2]);
    new NewCircle(5,angleDays,colours[3]);
    
    drawTimeString(now.toLocaleTimeString());
}


////////CIRCLES
function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.n = Math.floor(Math.random()*coloursA.length);
    this.fill = coloursA[this.n];
    this.minSize = 6 - Math.floor(Math.random() * 4);
    this.maxSize = (50 - Math.random() * 20);
    this.shrinkRate = Math.floor(Math.random() * 3);
    this.expandRate = Math.floor(Math.random() * 3);
    
    this.draw = function() {
        c.fillStyle = this.fill;
        c.strokeStyle = this.colour;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2);
        c.fill();
    }
    
    this.update = function() {
        
        //Bounce off the edges
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        
        //Move circle
        this.x += this.dx;
        this.y += this.dy;
        
        if (growShrink == 0) {
            if (this.x - mouse.x < gDx && this.x - mouse.x > -gDx) {
                if (this.y - mouse.y < gDy && this.y - mouse.y > -gDy) {
                    if (this.radius < this.maxSize) {
                        this.radius += 1  
                    }
                }
            } else if (this.radius > this.minSize) {
                this.radius -= 1
            } 
        } else if (growShrink == 1) {
            if (this.x - mouse.x < gDx && this.x - mouse.x > -gDx) {
                if (this.y - mouse.y < gDy && this.y - mouse.y > -gDy) {
                    if (this.radius > 0) {
                        this.radius -= 1  
                    }
                }
            } else if (this.radius < this.minSize) {
                this.radius += 1
            }
        }
        
        //Draw the circle after all calculations have been made
        this.draw();
        
    }
}

function switchBg() {
    if (backgroundColour == 0) {
        document.body.style.backgroundColor = "black"
        backgroundColour = 1
    } else if (backgroundColour == 1) {
        document.body.style.backgroundColor = "white"
        backgroundColour = 0
    }
}

function switchGrow() {
    if (gDx == gDxa) {
        gDx = 0;
        gDy = 0;
    } else if (gDx == 0) {
        gDx = gDxa;
        gDy = gDya;
    }
}

function growthShrink() {
    if (growShrink == 1) {
        growShrink = 0;
    } else if (growShrink == 0) {
        growShrink = 1;
    }
}




//######//RUNNING CODE
for (var i = 0; i < numCircles; i++) {
    
    var radius = Math.floor(50 - Math.random() * 20);
    var x = radius + (Math.random() * (innerWidth - (radius * 2)));
    var y = radius + (Math.random() * (innerHeight - (radius * 2)));

    var dx = (Math.random() * 3) - 1.5;
    var dy = (Math.random() * 3) - 1.5;

    circleArray[i] = new Circle(x, y, dx, dy, radius);
    
}

animate();