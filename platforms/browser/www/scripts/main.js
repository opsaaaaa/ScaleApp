// JavaScript Document

// to do list:
// * create function that sets the sizes in terms of game units
// * animate scale

// these are ment to be stardered screen size stuff.
// its to keep everything looking the same scale with diffrent size screens
// use (w,h * 0~1) for locations of objects and matching to screen size
// use (wh * 0~1) to set the size of objects
var w = window.innerWidth/2;
var h = window.innerHeight/2;
var gu = (w+h)/400; // game unit

function getDifference(a,b){ return Math.abs(a - b); }

// idk what i am going to use this for yet
function lineDistance (point1, point2) {
  var xs = 0,
      ys = 0;

    xs = Math.pow(point2.x - point1.x, 2);
    ys = Math.pow(point2.y - point1.y, 2);

    return Math.sqrt(xs + ys);
}

// RETURNS RANDOM NUMBER
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// returns a string between the locations of two parts of a string
// im using this to get the 30 from a string "rotate(30deg)"
function getStringBetween(s,b1,b2) {
  // var currentRotateString = document.getElementById("beam").style.transform;
  var b1Loc = s.lastIndexOf(b1) + b1.length,
      b2Loc = s.lastIndexOf(b2),
      numString = "";
  for(var i = b1Loc;i < b2Loc;i++){
    numString = numString + s[i];
  };
  return numString;
}

// ok im done for now, so note to self:
// this is to convert width and height to gameunits,
// maybe throught transform: scale(). maybe by reassiging the width idk.
// a thought i could test in the css is doing that. assign a width and then scale that with transform
// i need to figureout canvis size, yea idk yet
// also need to handle posistioning.
// dont feel like doing that right now tho.
function convertToGameUnits() {
  var elems = document.getElementsByClassName("gameUnit");
  var theCSSprop = window.getComputedStyle(elems[0], null).getPropertyValue("width");
  var dontmethod = elems[0].style.width;
  console.log(theCSSprop);
}
convertToGameUnits();

var weights

var scale = {
  tilt: 0,
  friction: 5,
  stoped: 0,
  acceleration: 0,
  speed: 0,
  onLeftPan: 10, //max 100 min 0
  onRightPan: 50,
  // positive 1 right -1 left
  tiltAim: -1.0, // a value between -1 and 1, times 30 to get the rotation of the sacla
  getRotation: function(){
    // ok i need to get the current rotaton and then add r to the current rotation
    return Number(getStringBetween( // the indentation is so i can see it ez
      document.getElementById("beam").style.transform ,"(" , "deg"
    ));
  },
  updateRotation: function(){this.tilt = this.getRotation()/30;},
  setRotation: function(r) {
    //get scale emelemtns and set thier rotation
    document.getElementById("beam").style.transform = " rotate(" + r + "deg)";
    document.getElementById("rightPan").style.transform = " rotate(" + (-r) + "deg)";
    document.getElementById("leftPan").style.transform = " rotate(" + (-r) + "deg)";
    this.updateRotation();
    // console.log(document.getElementById("beam"));
  },
  addRotation: function(r) {
    this.setRotation(this.getRotation() + r)
    this.updateRotation();
    // console.log(currentRot + " " + r);
  },
  comparePans: function(){
      if (this.onLeftPan === this.onRightPan){
        this.tiltAim = 0;
        // console.log("middle")
      }else if((this.onLeftPan - this.onRightPan) > 100){
        this.tiltAim = 1;
        // console.log("right");
      }else if((this.onLeftPan - this.onRightPan) < -100){
        this.tiltAim = -1;
        // console.log("left");
      }else{
        this.tiltAim = (this.onLeftPan - this.onRightPan)/100;
        // console.log("someplace");
      }
  },
  balanceLoop: function() {
    this.updateRotation();
    this.comparePans();
    this.friction = Math.pow(this.speed,3);
    if (this.stoped > 10){
      this.speed = 0;
      this.friction = 0;
      this.acceleration = 0;
      // console.log("stoping");
      this.stoped = 0;
      this.setRotation(this.tiltAim*30);
    } else if (this.tilt > this.tiltAim-0.01 && this.tilt < this.tiltAim+0.01
        && Math.abs(this.acceleration) < 0.05){
      this.acceleration = (this.tilt - this.tiltAim) + ((this.friction*0.01)+this.speed/2);
      if(this.tilt != this.tiltAim){this.stoped++;}
      // this.setRotation(this.tiltAim*30);
    } else {
      this.acceleration = (this.tilt - this.tiltAim) + (this.friction*0.01);
    }
    this.speed = this.speed - this.acceleration;
    this.addRotation(this.speed);
    // force stop when balacned enough
    // console.log(Math.abs(this.acceleration));
  },
  readout: function(){
    document.getElementById("readout").innerHTML =
      "Readout. speed:" + this.speed +
      " acceleration:" + this.acceleration +
      " friction:" + this.friction +
      " Stop loop:" + this.stoped;

  }

}

var game = {
  init: function() {
      $('#gameCotain').css({width: w+'px', height: h+'px'});
      // $('#cloud').css({width: w+'px', height: h+'px'});
  },
  loop: function() {
    // scale.addRotation(0);
    scale.balanceLoop();
    scale.readout();
  }

}
scale.setRotation(30);
// scale.setRotation(30);
// scale.addRotation(30);
// https://www.w3schools.com/js/js_timing.asp
// this calls the game.loop function draw loop i guess, i dont really know naming convention for it.
var rotLoop = window.setInterval(game.loop, 40);
