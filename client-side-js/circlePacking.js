let canvas = document.getElementById("myCanvas");
let c = canvas.getContext("2d");

document.documentElement.style.overflow = 'hidden';  // firefox, chrome
document.body.scroll = "no"; // ie only

canvas.height = innerHeight;
canvas.width = innerWidth;




//########//VARIABLES
let fontSize = innerHeight /45;

let backgroundColour = "#404040";

let circleArray = [];

//let colours = ["#dcf5f5","#f5dcf5","#f5f5dc"]
//let colours = ["#aaffff","#ffaaff","#ffffaa"]

let dark = "99";
let light = "55";

//let colours = [`#${dark}${light}${light}`, `#${light}${dark}${light}`, `#${light}${light}${dark}`]

let colours = ["#668888","#886688","#888866"]
let sepColour = "#00ff00";

let mouse = {
    x: undefined,
    y: undefined,
}; 

let showScore = true;
let showCCArea = false;

let score = {
    colour1hex: colours[0],
    colour2hex: colours[1],
    colour3hex: colours[2],
    colour4hex: sepColour,
    colour1: 0, 
    colour2: 0,
    colour3: 0,
    colour4: 0,
}

let colourChangeArray = [];

let key = {
    keyCode: undefined,
};

let halted = false;
let padding = 2;

let startSize = 1;
let newPerFrame = 50;
let globalStartMode = 1;
let numCircles = 5;
let speedCirclesGrowth = 1;
let maxSize = 1000;




//########//EVENTS
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener("keypress", function(event) {
    key.keyCode = event.keyCode;
    if (key.keyCode == 13) { //ENTER
        showScore = switchBoolean(showScore);
    } else if (key.keyCode == 99) { //c
        showCCArea = switchBoolean(showCCArea);
    } else if (key.keyCode == 32) { //SPACE BAR
        halted = switchBoolean(halted);
    }
    //alert(key.keyCode)
})

window.addEventListener('resize', function(event) {
    canvas.width = innerWidth
    canvas.height = innerHeight

    setup();
})

window.addEventListener('click', function(event) {
    //SOME FUNCTION
});




//########//OBJECTS
function Circle(x, y, radius, mode) {
    this.y = y;
    this.x = x;
    this.rand = Math.floor(Math.random() * colours.length);
    this.colour = colours[this.rand] ;
    this.origColour = this.colour;
    this.radius = radius;
    this.growing = true;
    if (mode != undefined) {
        this.mode = mode;
    } else {
        this.mode = 0;
    }
    
    this.draw = function() {
        c.fillStyle = this.colour;
        c.strokeStyle = this.colour;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2);
        
        if (this.mode == 0) {
            c.stroke();
        } else if (this.mode == 1) {
            c.fill();
        }
        
    }
    
    this.update = function() {
        
        let test = (this.x + this.radius >= innerWidth || this.x - this.radius <= 0 || this.y + this.radius >= innerHeight || this.y - this.radius <= 0)
        
        if (test) {
            this.growing = false;
        }
        
        if (this.radius * 2 > maxSize) {
            this.growing = false;
        }
    
        if (!halted) {
            if (this.growing) {
                this.checkDist();
            }
        }
                
        
        if (!halted) {
            if (this.growing) {
                this.radius = this.radius + speedCirclesGrowth;
            }
        }
        this.draw();
    }
        
    this.checkDist = function() {
        for (let i = 0; i < circleArray.length; i++) {
            if (circleArray[i] != this) {
                let newDist = dist(this.x, this.y, circleArray[i].x, circleArray[i].y);
                if (newDist < this.radius + circleArray[i].radius + padding) {
                    this.growing = false;
                    if (circleArray[i].colour == this.colour) {
                        //this.mode = 0;
                    }
                }
            }
        }
    }
        
}




//########//TEXT DEFINITIONS
function defineText1() {
    //newCCR -> X ; Y ; W ; H
    
    let w = innerWidth/40;
    let h = innerHeight/3;
    let sx = innerWidth/12;
    let sp = innerWidth/30;
    
    //C
    newCCR(sx, h, w, h); // l vert part of C
    newCCR(sx + w, h, (h-w)/2, w); //top horiz of C
    newCCR(sx + w, (h*2)-w, (h-w)/2, w); //bot horiz of C
    
    sx = sx + sp + (h-w)/2 + w;
    
    //O
    newCCR(sx, h, w, h); // l vert part of O
    newCCR(sx + w, h, (h-w)/2, w); //top horiz of O
    newCCR(sx + w, (h*2)-w, (h-w)/2, w); //bot horiz of O
    newCCR(sx+(h-w)/2, h, w, h); // r vert part of O
    
    sx = sx + sp + (h-w)/2 + w;

    //L
    newCCR(sx, h, w, h); // l vert part of L
    newCCR(sx + w, (h*2)-w, (h-w)/2, w); //bot horiz of L
    
    sx = sx + sp + (h-w)/2 + w;
    
    //O
    newCCR(sx, h, w, h); // l vert part of O
    newCCR(sx + w, h, (h-w)/2, w); //top horiz of O
    newCCR(sx + w, (h*2)-w, (h-w)/2, w); //bot horiz of O
    newCCR(sx+(h-w)/2, h, w, h); // r vert part of O
    
    sx = sx + sp + (h-w)/2 + w;
    
    //U
    newCCR(sx, h, w, h); // l vert part of U
    newCCR(sx + w, (h*2)-w, (h-w)/2, w); //bot horiz of U
    newCCR(sx+(h-w)/2, h, w, h); // r vert part of U
    
    sx = sx + sp + (h-w)/2 + w;
    
    //R
    newCCR(sx, h, w, h); // l vert part of R
    newCCR(sx + w, h, (h-w)/2, w); //top horiz of R
    newCCR(sx + w, (h*1.5)-w, (h-w)/2, w); //mid horiz of R
    newCCR(sx+(h-w)/2, h, w, h/2); // r vert part of R
    
    for (let i = 0; i < (h-w)/2 ; i++) {
        newCCR(sx+w+i, ((h*1.5)-w)+i*1.1, 1, w*1.2); // diag of R
    }
    
    
    
    
    
}




//########//FUNCTIONS
function drawCCRs(specArray, targetArray, colour) {
    for (let i = 0; i < targetArray.length; i++) {
        for (let j = 0; j < specArray.length; j++) {
//            c.fillStyle = "#00ff00";
//            c.fillRect(specArray[j][0], specArray[j][2], specArray[j][1]-specArray[j][0], specArray[j][3]-specArray[j][2]);
            if ((targetArray[i].x > specArray[j][0]) && (targetArray[i].x < specArray[j][1])) {
                if ((targetArray[i].y > specArray[j][2]) && (targetArray[i].y < specArray[j][3])) {
                    targetArray[i].colour = colour;
                    
                }
            }
        }
    }
}

function newCCR(x, y, w, h) {
    let x1 = x;
    let x2 = x1 + w;
    let y1 = y;
    let y2 = y1 + h;
    let newArr = [x1, x2, y1, y2];
    colourChangeArray.push(newArr);
}

function drawDetox() {
    c.fillStyle = "brown";
    c.font = `300 ${fontSize*7}px sans-serif`;
    c.fillText("DETOXSLOTH27", innerWidth/2, innerHeight/2, 2000);
}

function findPos(pos) {
    let factX = innerWidth/7.5;
    let padX = factX / 3;
    let pX = padX / 5;
        
    startX = innerWidth - factX + pX;
    endX = innerWidth - pX;
    
    distX = endX - startX;
    colu = distX / 3;
    cPad = colu / 2;
    
    thePos = startX + (colu * pos) - cPad;
    return thePos;
}

function drawScore() {
    let factX = innerWidth/7.5;
    let factY = innerHeight/7;
    c.fillStyle = backgroundColour;
    c.fillRect(innerWidth - factX, 0, factX, factY);
    c.fillStyle = "#ffffff";
    
    let posY = factY / 4;
    let padY = posY / 4;
    
    let padX = factX / 3;
    let pX = padX / 5;
    
    c.textAlign = "center";
    c.font = `normal ${fontSize}px sans-serif`;
    
    c.fillText(`${score.colour1hex}`, findPos(1), (posY * 1)-padY, padX);
    c.fillText(`${score.colour2hex}`, findPos(1), (posY * 2)-padY, padX);
    c.fillText(`${score.colour3hex}`, findPos(1), (posY * 3)-padY, padX);
    c.fillText(`${score.colour4hex}`, findPos(1), (posY * 4)-padY, padX);
    
    c.fillText(`:${score.colour1}`, findPos(3), (posY * 1)-padY, padX);
    c.fillText(`:${score.colour2}`, findPos(3), (posY * 2)-padY, padX);
    c.fillText(`:${score.colour3}`, findPos(3), (posY * 3)-padY, padX);
    c.fillText(`:${score.colour4}`, findPos(3), (posY * 4)-padY, padX);
    
    c.fillStyle = score.colour1hex;
    c.beginPath();
    c.arc(findPos(2), (posY * 1)-padY*2, padY,0,Math.PI*2);
    c.fill();
    
    c.fillStyle = score.colour2hex;
    c.beginPath();
    c.arc(findPos(2), (posY * 2)-padY*2, padY,0,Math.PI*2);
    c.fill();
    
    
    c.fillStyle = score.colour3hex;
    c.beginPath();
    c.arc(findPos(2), (posY * 3)-padY*2, padY,0,Math.PI*2);
    c.fill();
    
    c.fillStyle = score.colour4hex;
    c.beginPath();
    c.arc(findPos(2), (posY * 4)-padY*2, padY,0,Math.PI*2);
    c.fill();
    
    
    
    //c.strokeText("Colour 1:", innerWidth - factX, 12, 120);

}

function countColours() {
    score.colour1 = 0;
    score.colour2 = 0;
    score.colour3 = 0;
    score.colour4 = 0;
    
    for (let i = 0; i < circleArray.length; i++) {
        if (circleArray[i].colour == score.colour1hex) {
            score.colour1++
        } else if (circleArray[i].colour == score.colour2hex) {
            score.colour2++
        } else if (circleArray[i].colour == score.colour3hex) {
            score.colour3++
        } else if (circleArray[i].colour == score.colour4hex) {
            score.colour4++
        }
    }
}

function genNewCircles() {
    for (let i = 0; i < newPerFrame ; i++) {
        let theNewCircle = generateNewCircle();
        if (theNewCircle != null) {
            circleArray.push(theNewCircle)
        }
    }
}

function generateNewCircle() {
    let r = startSize;
    let x = startSize + (Math.random() * (innerWidth-startSize*2));
    let y = startSize + (Math.random() * (innerHeight-startSize*2));
    let m = globalStartMode;

    var valid = true;
    for (var i = 0; i < circleArray.length; i++) {
        var circle = circleArray[i];
        var d = dist(x, y, circle.x, circle.y);
        
        if (d < circle.radius + r) {
            valid = false;
            break;
        }
    }
    if (valid) {
        return new Circle(x, y, r, m);
    } else {
        return null;
    }
}

function dist(x1, y1, x2, y2) {
    dx = x2 - x1;
    dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}

function switchBoolean(theBool) {
    
    return !theBool;
}

function drawCursor() {
    let col = "#ffffff"
    c.fillStyle = col;
    c.strokeStyle = col;
    c.beginPath();
    c.arc(mouse.x, mouse.y, 3, 0, Math.PI*2);
    c.fill();
}

function animate() {
    requestAnimationFrame(animate);
//    c.clearRect(0,0,innerWidth,innerHeight);
    
    c.fillStyle = backgroundColour;
    c.fillRect(0,0,innerWidth, innerHeight);
    
    //drawCursor();
    if (!halted) {
        genNewCircles(); 
    }
    
    
    
    for (let i = 0; i < circleArray.length; i++) {
       circleArray[i].update();
    }
    if (showScore) {
        countColours();
        drawScore();
    }
    //drawDetox();
    if (showCCArea) {
        drawCCRs(colourChangeArray, circleArray, sepColour);
    } else {
        for (let i = 0; i < circleArray.length; i++) {
            circleArray[i].colour = circleArray[i].origColour;
        }
    }
    
}




//########//RUNNING CODE
function setup() {
    c.font = `normal ${fontSize}px sans-serif`;
    
    circleArray = [];
    colourChangeArray = [];
    
    defineText1();
    
    let x = startSize + Math.random() * innerWidth-startSize*2;
    let y = startSize + Math.random() * innerHeight-startSize*2;
    let m = globalStartMode;
    let r = startSize;
    circleArray.push(new Circle(x, y, r, m)); 
    
    genNewCircles();
}

setup();
animate();