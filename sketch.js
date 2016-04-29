var density = 1;

//INTERFACE 
var initBTN;
var initSketch = false;
var zipInput;
var weatherReloaded = false;

//WEATHER DATA VARS
var zip = 11249;
var weather, url;
var temperature, cloudAmt, condition, humidity, conditionCode;
var sunriseDate,sunriseHours,sunsetDate,sunsetHours,dataDate,dataHours;
var nighttime = false;

//TYPOGRAPHY VARS
var calibre;
var textSizeFinal = 300;
var displayText = 'NEW YORK';
var textIsGood = false;
//COLOR VARS
var color1,color2,color3,colorBase,colorTime,colorTimeInv,cloudShadow;

//SHADOW VARS
var shadowBuffer;
var shadowRefresh = true;

//WAVEFORM VARS
var textMask, toMask, toMaskImg;
var wave,wave2,wave3,yPos;
  var t = 0;
  var delta = 0;
  var freq = 0;
  var waveOffset = 20;
  var wavePulse = 40;
  var waveUpper, waveLower,wiggleAmt = 0;
  
//CLOUD VARS
var cloudsLarge = [];
var cloudsSmall = [];

//PRECIP VARS 
var makePrecip = false;
var makePrecipSmall = false;
var precip = [];
var precipSmall = [];
var precipAmt = 0;
var precipType = 'Rain';

var rain1 = [300,301,310,312];
var rain2 = [200,230,313,314,500,511];
var rain3 = [201,231,321,501,520,521];
var rain4 = [202,232,502,503,504,522,531];
var snow1 = [600];
var snow2 = [601,620];
var snow3 = [602,621];
var snow4 = [622];


//WIND VARS


function preload() {
  calibre = loadFont('assets/Calibre-Black.otf');
  url = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + '&units=imperial&APPID=dbc1eb3f8bcd39cf9ae676b83e2e514c';
  loadJSON(url, gotWeather);
}

function openINIT() {
  zipInput = createInput('');
  zipInput.attribute("placeholder", "ZIP CODE");
  zipInput.addClass('zipInput');
  zipInput.attribute("onkeydown", "if (event.keyCode == 13) document.getElementById('initBTN').click()");
  initBTN = createButton("GET WEATHER");
  initBTN.addClass('initBTN')
  initBTN.attribute("id", "initBTN");
  initBTN.mousePressed(reloadWeather);
  
}

function setup() {
  density= displayDensity();
  pixelDensity(density);
  createCanvas(windowWidth*density,windowHeight*density);
  frameRate(40);
  colorSys();
  openINIT();
}

function reloadWeather() {
  zip = zipInput.value();
  url = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + '&units=imperial&APPID=dbc1eb3f8bcd39cf9ae676b83e2e514c';
  loadJSON(url, gotWeather);
}

function runSketch() {
  if (weatherReloaded) {
    textIsGood = false;
    cloudsSmall.splice(0,cloudsSmall.length);
    cloudsLarge.splice(0,cloudsLarge.length);
    
  shadowRefresh = true;
  initSketch = true;
  }
}

function draw() {
  if (initSketch) {
  textSizeUpdate();
  
  
  if (textIsGood) {
  fill(colorTime);
  rect(-10,-10,windowWidth*1.1,windowHeight*1.1);
  var minutes = minute();
  if (minutes === 0) {
    colorSys();
    gotWeather();
  }
  
  makeWaves();
  if (shadowRefresh) {
  shadow();
  }
  image(toMaskImg);
  
 var cloudCount = map(cloudAmt,0,100,0,30);
 

  if (cloudAmt>10) {
    if (cloudsSmall.length < cloudCount){
      for (var i=0; i<=cloudCount; i++) {
        cloudsSmall.push(new Cloud(random(0,windowWidth),0,.5,true));
        
        precipSmall[i] = [];

    if (precipSmall[i].length < precipAmt/2) {
    for (var r=0; r<=precipAmt/2; r++) {
      if (r % 2 ===0) {
      precipSmall[i].push(new window[precipType](cloudsSmall[i].x,cloudsSmall[i].y,cloudsSmall[i].cloudLength,cloudsSmall[i].cloudSize,colorTimeInv,1));
    }
    else {
      precipSmall[i].push(new window[precipType](cloudsSmall[i].x,cloudsSmall[i].y,cloudsSmall[i].cloudLength,cloudsSmall[i].cloudSize,colorTime,1));
    }
    }
  }
      }
    }
  for ( i=0; i<cloudsSmall.length; i++) {
    if (makePrecipSmall){
    for (r=0; r<precipAmt/2; r++) {
      precipSmall[i][r].rainDropDisplay();
      precipSmall[i][r].rainDropMove(cloudsSmall[i].x);
    }
    }
    cloudsSmall[i].drawCloud();
    cloudsSmall[i].move();
  }
  
  
  
  //LARGE CLOUDS
  if (cloudAmt > 30) {
  if (cloudsLarge.length < cloudCount/4){
      for (var i=0; i<=cloudCount/4; i++) {
        cloudsLarge.push(new Cloud(random(0,windowWidth),0,1,true));
        
       
    precip[i] = [];

    if (precip[i].length < precipAmt) {
    for (var r=0; r<=precipAmt; r++) {
      if (r % 2 ===0) {
      precip[i].push(new window[precipType](cloudsLarge[i].x,cloudsLarge[i].y,cloudsLarge[i].cloudLength,cloudsLarge[i].cloudSize,colorTimeInv,2));
    }
    else {
      precip[i].push(new window[precipType](cloudsLarge[i].x,cloudsLarge[i].y,cloudsLarge[i].cloudLength,cloudsLarge[i].cloudSize,colorTime,2));
    }
    }
  }
   }
}

  for ( i=0; i<cloudsLarge.length; i++) {
    if (makePrecip){
    for (r=0; r<precipAmt; r++) {
      precip[i][r].rainDropDisplay();
      precip[i][r].rainDropMove(cloudsLarge[i].x);
    }
    }
    cloudsLarge[i].drawCloud();
    cloudsLarge[i].move();
  }
  
  
  
 }
 }


 statsDisp();
  
  if (nighttime) {
    blendMode(MULTIPLY);
    fill(255,223,171);
    rect(-10,-10,windowWidth*1.1,windowHeight*1.1);
    blendMode(NORMAL);
  }

}
}
}


//PARSE WEATHER DATA
function gotWeather(weatherI) {
  temperature = weatherI.main.temp;
  //temperature = 50;

  cloudAmt = weatherI.clouds.all;
  
  displayText = weatherI.name;
  //displayText = displayText.toUpperCase();
  //displayText = 'visualizer      ';
  condition = String(weatherI.weather[0].description);
  condition = condition.toUpperCase();
  
  conditionCode = weatherI.weather[0].id;
  //conditionCode = 622;
  
  makePrecip = false;
  makePrecipSmall = false;
  
  for (i=0; i<=rain1.length;i++) {
  if (conditionCode === rain1[i]) {
    makePrecip = true;
    precipType = 'Rain';
    precipAmt = 20;
  }}
  
  for (i=0; i<=rain2.length;i++) {
  if (conditionCode === rain2[i]) {
    makePrecip = true;
    precipType = 'Rain';
    precipAmt = 50;
  }}
  
  for (i=0; i<=rain3.length;i++) {
  if (conditionCode === rain3[i]) {
    makePrecip = true;
    makePrecipSmall = true;
    precipType = 'Rain';
    precipAmt = 30;
  }}
  
  for (i=0; i<=rain4.length;i++) {
  if (conditionCode === rain4[i]) {
    makePrecip = true;
    makePrecipSmall = true;
    precipType = 'Rain';
    precipAmt = 80;
  }}
  
  for (i=0; i<=snow1.length;i++) {
  if (conditionCode === snow1[i]) {
    makePrecip = true;
    precipType = 'Snow';
    precipAmt = 20;
  }}
  for (i=0; i<=snow2.length;i++) {
  if (conditionCode === snow2[i]) {
    makePrecip = true;
    precipType = 'Snow';
    precipAmt = 50;
  }}
  for (i=0; i<=snow3.length;i++) {
  if (conditionCode === snow3[i]) {
    makePrecip = true;
    makePrecipSmall = true;
    precipType = 'Snow';
    precipAmt = 30;
  }}
  for (i=0; i<=snow4.length;i++) {
  if (conditionCode === snow4[i]) {
    makePrecip = true;
    makePrecipSmall = true;
    precipType = 'Snow';
    precipAmt = 80;
  }}
  
  
  humidity = weatherI.main.humidity;
  
  sunriseDate = new Date(weatherI.sys.sunrise*1000);
  sunriseHours = sunriseDate.getHours() ;
  sunsetDate = new Date(weatherI.sys.sunset*1000);
  sunsetHours = sunsetDate.getHours();
  dataDate = new Date(weatherI.dt*1000);
  dataHours = dataDate.getHours() ;
  //dataHours = 0;
    colorSys();
    
    weatherReloaded = true;
    runSketch();
}

function statsDisp() {
  noStroke();
  textSize(20);
  textFont(calibre);
  fill(colorTimeInv);
  text('TEMP:\20' + int(temperature) + '\xB0',10,windowHeight-100);
  text(condition,10,windowHeight-75);
  text('HUMIDITY:\20' + humidity + '%',10,windowHeight-50);
}


//SET COLOR SCHEME


function colorSys() {
  cloudShadow = color(0,220);
  
  if (sunriseHours<dataHours && dataHours<sunsetHours) {
    colorTime = color(255);
    colorTimeInv = color(0);
    nighttime = false;
  }
  else if (dataHours<sunriseHours || dataHours>=sunsetHours) {
    colorTime = color(0);
    colorTimeInv = color(255);
    nighttime = true;
  }
  
  if (temperature < 40) {
    color1 = color(136,255,227);
    color2 = color(98,231,233);
    color3 = color(45,197,241);
    colorBase = color(colorTime);
    wiggleAmt = map(temperature,-30,60,0.5,0.01);
    freq = map(temperature,-30,40,.03,.06);
  }
  else if (temperature >= 40 && temperature <70) {
    color3 = color(255,248,0);
    color2 = color(195,252,114);
    color1 = color(136,255,227);
    colorBase = colorTime;
    wiggleAmt = map(temperature,-30,60,0.5,0.01);
    freq = map(temperature,40,60,.06,.085);
  }
  else if (temperature >= 70 && temperature < 80) {
    color1 = color(255,66,0);
    color2 = color(255,157,0);
    color3 = color(255,248,0);
    colorBase = colorTime;
    wiggleAmt  = map(temperature,60,120,0.01,0.3);
    freq = map(temperature,60,120,.085,.02);
  }
  else if (temperature >= 80) {
    color1 = color(colorTime);
    color3 = color(255,157,0);
    color2 = color(255,248,0);
    colorBase = color(255,66,0);
    wiggleAmt  = map(temperature,60,120,0.01,0.3);
    freq = map(temperature,60,120,.05,.02);
  }
}


// Extend p5.Image, adding the converse of "mask", naming it "punchOut":
p5.Image.prototype.punchOut = function(p5Image) {
 
    if(p5Image === undefined){
        p5Image = this;
    }
    var currBlend = this.drawingContext.globalCompositeOperation;
 
    var scaleFactor = density;
    if (p5Image instanceof p5.Graphics) {
        scaleFactor = p5Image._pInst._pixelDensity;
    }
 
    var copyArgs = [
        p5Image,
        0,
        0,
        scaleFactor*p5Image.width,
        scaleFactor*p5Image.height,
        0,
        0,
        this.width,
        this.height
    ];
 
    this.drawingContext.globalCompositeOperation = "destination-out";
    this.copy.apply(this, copyArgs);
    this.drawingContext.globalCompositeOperation = currBlend;
};

//DRAW TEXT SHADOW

function shadow() {
  textMask =  createGraphics(windowWidth,windowHeight);
  textMask.pixelDensity(2);
  textMask.noStroke();
  //textMask.fill(0);
  //textMask.rect(-10,-10,textMask.width*1.1,textMask.height*1.1);
  textMask.fill(255);
  textSize(textSizeFinal);
  textMask.textFont(calibre);
  textAlign(CENTER,CENTER);
  textMask.text(displayText,textMask.width/2,textMask.height/2);
  
  shadowBuffer = createGraphics(windowWidth*density,windowHeight*density);
  shadowBuffer.pixelDensity(2);
  shadowBuffer.fill(colorTime);
  shadowBuffer.rect(-10,-10,shadowBuffer.width*1.1,shadowBuffer.height*1.1);
  shadowBuffer.textSize(textSizeFinal);
  shadowBuffer.textFont(calibre);
  textAlign(CENTER,CENTER);
  shadowBuffer.strokeWeight(2.5);
  if (sunriseHours<dataHours && dataHours<sunsetHours) {
    //daylight
    shadowBuffer.stroke(colorTimeInv);
    shadowBuffer.fill(colorTimeInv);
    for (var i=50; i>=0; i-=1) {
      if (i===0) {
        shadowBuffer.strokeWeight(3.5);
      }
      shadowBuffer.text(displayText,windowWidth/2+i*.9,windowHeight/2+i*1.8);
    }
  }
  else if (dataHours<sunriseHours || dataHours>sunsetHours) {
    //nighttime
  shadowBuffer.stroke(colorTimeInv);
  shadowBuffer.fill(colorTime);
  for (var i=12; i>=0; i-=3) {
    if (i===0) {
      shadowBuffer.noStroke();
    }
    shadowBuffer.text(displayText,windowWidth/2+i*.9,windowHeight/2+i*1.8);
  }
  }

  noStroke();
  
  toMask = createGraphics(windowWidth*2,windowHeight*2);
  toMask.pixelDensity(density);
  toMask.background(colorBase);
  toMask.image(shadowBuffer,0,0,windowWidth,windowHeight);

  toMaskImg = toMask.get();
  toMaskImg.punchOut(textMask._renderer);
  
  shadowRefresh = false;
}


//DRAW INNER WAVES
function makeWaves() {
  fill(colorBase);
  rect(-10,10,windowWidth*1.1,windowHeight*1.1);
  //wave = createGraphics(windowWidth*density,windowHeight*density);
    beginShape();
    fill(color3);
    noStroke();
    vertex(0,height/2);
    for (i=-10; i<=windowWidth; i+=windowWidth*freq) {
      yPos = map(noise(i),0,1,waveUpper,waveLower);
       delta = map(noise(i+t),0,1,-wavePulse,wavePulse);
      curveVertex(i,yPos+delta);
    }
    vertex(width,height+20);
    vertex(-20,height+20);
    endShape(CLOSE);
    
    beginShape();
    fill(color2);
    noStroke();
    vertex(0,height/2+waveOffset);
    for ( i=-10; i<=windowWidth; i+=windowWidth*freq) {
       yPos = map(noise(i),0,1,waveUpper,waveLower);
       delta = map(noise(i+t),0,1,-wavePulse,wavePulse);
      curveVertex(i,yPos+delta+waveOffset);
    }
    vertex(width,height+20+waveOffset);
    vertex(-20,height+20+waveOffset);
    endShape(CLOSE);
    
    beginShape();
    fill(color1);
    noStroke();
    vertex(0,height/2+waveOffset*2);
    for ( i=-10; i<=windowWidth; i+=windowWidth*freq) {
       yPos = map(noise(i),0,1,waveUpper,waveLower);
       delta = map(noise(i+t),0,1,-wavePulse,wavePulse);
      curveVertex(i,yPos+delta+waveOffset*2);
    }
    vertex(width,height+20+waveOffset*2);
    vertex(-20,height+20+waveOffset*2);
    endShape(CLOSE);
    
    t+=.01;
    
  //image(wave,0,0,windowWidth,windowHeight);
  }
  
  
//CLOUD OBJECTS
  function Cloud(xPos,yPos,cloudScale,cloudShadowOn) {
    this.cloudScale = cloudScale;
    this.x = random(-500,windowWidth);
    this.y = random(windowHeight/2-textSizeFinal*cloudScale,windowHeight/2+textSizeFinal*.5*cloudScale);
    this.cloudShadowOn = cloudShadowOn;
    this.cloudLength = random(windowWidth*.04*cloudScale,windowWidth*.2*cloudScale);
    this.cloudSize= random(textSizeFinal*.3*cloudScale,textSizeFinal*.4*cloudScale);
    
    this.drawCloud = function() {
      strokeCap(ROUND);
      if (cloudShadowOn) {
      stroke(cloudShadow);
      strokeWeight(this.cloudSize);
      line(this.x+this.cloudSize*.5,this.y+this.cloudSize*.3,this.x+this.cloudLength+this.cloudSize*.5,this.y+this.cloudSize*.3);
      }
      stroke(colorTimeInv);
      strokeWeight(this.cloudSize);
      line(this.x,this.y,this.x+this.cloudLength,this.y);
      stroke(colorTime);
      strokeWeight(this.cloudSize-2.5);
      line(this.x,this.y,this.x+this.cloudLength,this.y);
    
      }
      
    this.move = function() {
      this.x=this.x + map(this.cloudSize,0,80,0,windowWidth*.0003)*density;
      if (this.x >windowWidth) {
        this.x = random(-400,-200);
      }
    }
  }


//RAIN FUNCTIONS
function Rain(cloudX,cloudY,cloudLength,cloudSize,rainColor,strokeSize) {
  
  this.x2 = random(0,cloudLength);
  this.x1 = cloudX+this.x2;
  
  this.maxLength = cloudSize;
  this.posY = cloudY-cloudSize*0.25;
  this.speed = random(1,5);
  
  this.dropSize = random(1,cloudSize*0.4);
  
  
  
  this.rainDropDisplay = function() {
    strokeWeight(strokeSize);
    noFill();
    stroke(rainColor);
    strokeCap(ROUND);
    //ellipse(this.x1,this.posY,5,5);
    line(this.x1,this.posY,this.x1-this.dropSize/3,this.posY+this.dropSize)
  }
  
  this.rainDropMove =  function(newCloudPos) {
    this.x1 = this.x1+map(cloudSize,0,80,0,windowWidth*.0003)/3*density;
    
    this.posY = this.posY+this.speed;
    if (this.posY > windowHeight) {
      this.posY = cloudY-cloudSize*0.25;
      //if (this.x1 > windowWidth || this.x1 < 0) {
        this.x1 = newCloudPos+this.x2;
      //}
    }
  }
  
}

function Snow(cloudX,cloudY,cloudLength,cloudSize,rainColor,strokeSize) {
  
  this.x2 = random(0,cloudLength);
  this.x1 = cloudX+this.x2;
  
  this.maxLength = cloudSize;
  this.posY = cloudY-cloudSize*0.25;
  this.speed = random(windowWidth*.0003,windowWidth*.001);
  
  this.dropSize = random(1,cloudSize*0.4);
  

  this.rainDropDisplay = function() {
    if (strokeSize === 2) {strokeWeight(1); stroke(0);}
    else {noStroke();}
    fill(255)
    ellipse(this.x1,this.posY,3*strokeSize,3*strokeSize);
    //line(this.x1,this.posY,this.x1-this.dropSize/3,this.posY+this.dropSize)
  }
  
  this.rainDropMove =  function(newCloudPos) {
    
    if (this.posY > this.posY+cloudSize/2) {
      this.acc = random(-100,10);
      this.x1 = this.x1+map(cloudSize,0,80,0,windowWidth*.0003)/3*density+this.acc;
    }
    
    else {
      this.x1 = this.x1+map(cloudSize,0,80,0,windowWidth*.0003)/3*density;
    }
    
    this.posY = this.posY+this.speed;
    if (this.posY > windowHeight) {
      this.posY = cloudY-cloudSize*0.25;
      //if (this.x1 > windowWidth || this.x1 < 0) {
        this.x1 = newCloudPos+this.x2;
      //}
    }
  }
  
}


//RESPONSIVE FUNCTIONALITY
function windowResized() {
  resizeCanvas(windowWidth*density, windowHeight*density);
  
  textIsGood = false;
    cloudsSmall.splice(0,cloudsSmall.length);
    cloudsLarge.splice(0,cloudsLarge.length);
    
  shadowRefresh = true;
}

function textSizeUpdate() {
  textSize(textSizeFinal);
  var contentWidth = textWidth(displayText);
  
  if (contentWidth > windowWidth*.9) {
    textSizeFinal = textSizeFinal-10;
  }
  
  else if (windowWidth > 400) {
   if (contentWidth < windowWidth*.8 && textSizeFinal < 350) {
    textSizeFinal = textSizeFinal+10;
  }
  }
  
  if (windowWidth > 400  && contentWidth<windowWidth*.9) {
    textIsGood = true;
  }
  else if (windowWidth<400) {
    textIsGood = true;
  }
  
   waveOffset = textSizeFinal*0.08;
   waveUpper = windowHeight/2-textSizeFinal*.75;
   waveLower = windowHeight/2+textSizeFinal*.08;
   wavePulse = windowWidth*wiggleAmt;
}