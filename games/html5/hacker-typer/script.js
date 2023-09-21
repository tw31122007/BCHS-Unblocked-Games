String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function sleep(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

var text = document.getElementById("text");
var info = document.getElementById("infoText");

var cursor = document.getElementById("mock-cursor");

var buyHackerL = document.getElementById("buyHacker");
var buyKiddieL = document.getElementById("buyKiddie");
var buyInsiderL = document.getElementById("buyInsider");
var buyTechL = document.getElementById("buyTech");
var buyCryptL = document.getElementById("buyCrypto");

var upTypeSpeedL = document.getElementById("upTypeSpeed");
var upWorkSpeedL = document.getElementById("upWorkSpeed");
var upBufferL = document.getElementById("upBufferSize");

var hacks = ["DigitalInputActiveLow.java","Drive.java","Lifter.java","LimitedSpeedController.java","Logitech.java","Robot.java","Shooter.java","Vars.java","XBoxController.java","ResourcePack.java","Utils.java","LevelEditor.java","AttackBlueAndOrange1.java","Item.java"];

var currHack = "";
var index = 0;
var currIndex = 0;
var currAutoIndex = 0;

var step = 10;

var score = 0;

text.innerText = "";

var hackerCount = 0;
var kiddieCount = 0;
var insiderCount = 0;
var techCount = 0;
var cryptCount = 0;

var timer = 0;

var upTypeIndex = 0;
var upWorkIndex = 0;
var upBufferIndex = 0;

var typeSpeed = 30;
var workerSpeedMod = 1;
var bufferSizeMod = 1;

setInterval(function(){
    tick();
}, 20);

currHack = "Start Typing......";

index = 14;

document.getElementById('saveBox').onkeydown = function(e){
    e.preventDefault();
}

function isNumeric(num){
    return !isNaN(num)
}

function loadFromBox(){
    var raw = document.getElementById('loadBox').value;
    
    var spl = raw.split(" ");
    
    var da = parseInt(spl[0]); //score
    var db = parseInt(spl[1]); //kiddies
    var dc = parseInt(spl[2]); //techs
    var dd = parseInt(spl[3]); //hacktivists
    var de = parseInt(spl[4]); //insiders
    var df = parseInt(spl[5]); //cryptographers
    var dg = parseInt(spl[6]); //typeSpeedLv
    var dh = parseInt(spl[7]); //workSpeedLv
    var di = parseInt(spl[8]); //bufferLv
   
    if(isNumeric(da) && isNumeric(db) && isNumeric(dc) && isNumeric(dd) && isNumeric(de) && isNumeric(df) && isNumeric(dg) && isNumeric(dh) && isNumeric(di)){
        load(da, db, dc, dd, de, df, dg, dh, di);
    }else{
        alert("Invalid data: '" + raw + "'");
    }
    document.getElementById('loadBox').value = "";
}

function load(sc, kiddies, techs, hackers, insiders, cryptographers, typeSpeedLv, workSpeedLv, bufferLv){
    score = sc;
    kiddieCount = kiddies;
    techCount = techs;
    hackerCount = hackers;
    insiderCount = insiders;
    cryptCount = cryptographers;
    
    upTypeIndex = typeSpeedLv;
    upWorkIndex = workSpeedLv;
    upBufferIndex = bufferLv;
    
    bufferMod = 1 + (0.5 * upBufferIndex);
    workerSpeedMod = 1 + (0.25 * upWorkIndex);
    typeSpeed = 30;
    for(var i = 0; i < upTypeIndex; i++){
        typeSpeed *= (3/4);
    }
}

function save(){
    //alert("load(" +  + ")");
    document.getElementById("saveBox").innerText = score + " " + kiddieCount + " " + techCount + " " + hackerCount + " " + insiderCount + " " + cryptCount + " " + upTypeIndex + " " + upWorkIndex + " " + upBufferIndex;
}

var enabledColor = "#00FF00";
var disabledColor = "red";
var maxUpgradeColor = "gold"

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

function tick(){
    //console.log(currIndex + " / " + index + "  " + hackerCount);
    
    var size = 16;
    
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    size = x / 80;
    
    if(size > 16) size = 16;
    
    text.style.fontSize = size;
    cursor.style.fontSize = size;
    
    for(var v = 0; v < hackerCount; v++){
        if((timer + Math.floor((v/hackerCount)*Math.floor(40/workerSpeedMod))) % Math.floor(40/workerSpeedMod) == 0) nextWord(true);
    }
   
    for(var v = 0; v < kiddieCount; v++){
        if((timer + Math.floor((v/kiddieCount)*Math.floor(100/workerSpeedMod))) % Math.floor(100/workerSpeedMod) == 0) nextWord(true);
    }
    
    for(var v = 0; v < insiderCount; v++){
        if((timer + Math.floor((v/insiderCount)*Math.floor(20/workerSpeedMod))) % Math.floor(40/workerSpeedMod) == 0) nextWord(true);
    }
    
    for(var v = 0; v < cryptCount; v++){
        if((timer + Math.floor((v/cryptCount)*Math.floor(10/workerSpeedMod))) % Math.floor(20/workerSpeedMod) == 0) nextWord(true);
    }
    
    for(var v = 0; v < techCount; v++){
        if((timer + Math.floor((v/techCount)*Math.floor(70/workerSpeedMod))) % Math.floor(70/workerSpeedMod) == 0) nextWord(true);
    }
    
    if(Math.round(currIndex) < index){
        var change = (index - currIndex) / typeSpeed;
        if(change < 1 - (typeSpeed/100)) change = 1 - (typeSpeed/100);
        
        if(currIndex + change > currHack.length){
            changeDoc();
        }else{
            text.innerText = currHack.substring(0, currIndex) + "";
            
            var prevIndex = currIndex;
            
            currIndex += change;
            
            if(currHack != "Start Typing......" && (Math.floor(currIndex) > Math.floor(prevIndex))) {
                score += (Math.floor(currIndex) - Math.floor(prevIndex));
                
                /*
                var sc = document.getElementById("infoText");
                sc.style.transition = "text-shadow 0s ease";
                sc.style.textShadow = text.style.color + " 0 0 0px";
                
                
                setTimeout(function(){
                    sc.style.transition = "text-shadow 0.5s ease";
                    sc.style.textShadow = text.style.color + " 0 0 50px";
                    setTimeout(function(){
                        sc.style.textShadow = "rgba(0, 0, 1, 0) 0 0 50px";
                    }, 500);
                }, 500);
                */
                
            }
            window.scrollBy(0, 16);
            
        }
    }else if(Math.round(currIndex) + 1 > currHack.length){
        changeDoc();
    }
    
    if(currAutoIndex < currIndex) currAutoIndex = currIndex;
    
    //console.log(Math.round(currIndex) + "|" + Math.round(currAutoIndex) + " / " + index);
    
    //console.log(score);
    
    infoText.innerText = "Score: " + score + " H"/* + "\n\nScript Kiddies: " + kiddieCount + "\nTechnicians: " + techCount + "\nHacktivists: " + hackerCount + "\nInsiders: " + insiderCount*/;
            
    buyHackerL.innerText = "Hacktivist (" + hackerCount + ") (" + nextHackerBuy() + " H)";
    buyHackerL.style.color = (score >= nextHackerBuy()) ? enabledColor : disabledColor;
    buyHackerL.style.cursor = (score >= nextHackerBuy()) ? "pointer" : "default";
    
    buyKiddieL.innerText = "Script Kiddie (" + kiddieCount + ") (" + nextKiddieBuy() + " H)";
    buyKiddieL.style.color = (score >= nextKiddieBuy()) ? enabledColor : disabledColor;
    buyKiddieL.style.cursor = (score >= nextKiddieBuy()) ? "pointer" : "default";
    
    buyTechL.innerText = "Technichian (" + techCount + ") (" + nextTechBuy() + " H)";
    buyTechL.style.color = (score >= nextTechBuy()) ? enabledColor : disabledColor;
    buyTechL.style.cursor = (score >= nextTechBuy()) ? "pointer" : "default";
    
    buyInsiderL.innerText = "Insider (" + insiderCount + ") (" + nextInsiderBuy() + " H)";
    buyInsiderL.style.color = (score >= nextInsiderBuy()) ? enabledColor : disabledColor;
    buyInsiderL.style.cursor = (score >= nextInsiderBuy()) ? "pointer" : "default";
    
    buyCryptL.innerText = "Cryptographer (" + cryptCount + ") (" + nextCryptBuy() + " H)";
    buyCryptL.style.color = (score >= nextCryptBuy()) ? enabledColor : disabledColor;
    buyCryptL.style.cursor = (score >= nextCryptBuy()) ? "pointer" : "default";
    
    if(upTypeIndex < 5){
        upTypeSpeedL.innerText = "Typing Speed (" + upTypeIndex + "/5) (" + nextUpTypeSpeed() + " H)";
        upTypeSpeedL.style.color = (score >= nextUpTypeSpeed()) ? enabledColor : disabledColor;
        upTypeSpeedL.style.cursor = (score >= nextUpTypeSpeed()) ? "pointer" : "default";
    }else{
        upTypeSpeedL.innerText = "Typing Speed (5/5)"
        upTypeSpeedL.style.cursor = "default";
        upTypeSpeedL.style.color = maxUpgradeColor;
    }
    
    if(upWorkIndex < 5){
        upWorkSpeedL.innerText = "Worker Speed (" + upWorkIndex + "/5) (" + nextUpWorkSpeed() + " H)";
        upWorkSpeedL.style.color = (score >= nextUpWorkSpeed()) ? enabledColor : disabledColor;
        upWorkSpeedL.style.cursor = (score >= nextUpWorkSpeed()) ? "pointer" : "default";
    }else{
        upWorkSpeedL.innerText = "Worker Speed (5/5)";
        upWorkSpeedL.style.cursor = "default";
        upWorkSpeedL.style.color = maxUpgradeColor;
    }
    
    if(upBufferIndex < 5){
        upBufferL.innerText = "Buffer Size (" + upBufferIndex + "/5) (" + nextUpBuffer() + " H)";
        upBufferL.style.color = (score >= nextUpBuffer()) ? enabledColor : disabledColor;
        upBufferL.style.cursor = (score >= nextUpBuffer()) ? "pointer" : "default";
    }else{
        upBufferL.innerText = "Buffer Size (5/5)";
        upBufferL.style.cursor = "default";
        upBufferL.style.color = maxUpgradeColor;
    }
    
    document.getElementById("optGlow").style.color = glow ? enabledColor : disabledColor;
    
    if(theme == "Hacker") document.getElementById("optSFX").style.color = doBits ? enabledColor : disabledColor;
    
    //console.log(currIndex + " " + index);
    
    if(Math.round(currIndex) == index){
        cursor.innerText = timer % 60 >= 30 ? "|\n\n\n\n" : " \n\n\n\n";
    }else{
        cursor.innerText = "|\n\n\n\n";
    }
    
    timer++;
}

function nextWord(auto){
   
    var inSpace = currHack.substring(index).search(/\s/) + 1;
    var inSpaceAfter = index + inSpace;
   // text.innerText = text.innerText.replaceAt(index + inSpace + 1, "X");
    
    //console.log("a = " + inSpace);
    //console.log("b = " + inSpaceAfter);
    
    if(currHack.charCodeAt(inSpaceAfter) == 160){
        inSpace = inSpace + currHack.substring(inSpaceAfter).search(/\S/) + 1;
    }
    //sleep(500);
    
    
    if(inSpace < 0) inSpace = -1;
    //var inBreak = 9999999;
    var inSemi = currHack.indexOf(";", index) - index + 2;
    
    if(inSemi < 0) inSemi = -1;
    
    var inDot = currHack.indexOf(".", index) - index + 2;
    
    if(inDot < 0) inDot = -1;
    
    var inPar = currHack.indexOf("(", index) - index + 2;
    
    if(inPar < 0) inPar = -1;
    if(currHack.charAt(currHack.indexOf("(", index) + 1) == ")"){
        inPar = -1;
    }
    
    //console.log("space = " + inSpace);
    //console.log("semi = " + inSemi);
    //console.log("dot = " + inDot);
    //console.log("par = " + inPar);
    
    var st = positiveMin(inSpace, inSemi, inDot, inPar);
    
    if(st <= 0){
        st = currHack.length - index;
    }else if(st == 9999999){
        st = currHack.length - index;
    }
    //console.log(st);
    
    index = index + st;
    if(auto) currAutoIndex = index;
    
    if(auto){
        dinkBit(0.3);
    }
}

var bg0 = document.getElementById("bg0");
var bg1 = document.getElementById("bg1");
var bg2 = document.getElementById("bg2");
var bg3 = document.getElementById("bg3");

var bit = 0;
var bits = [bg0, bg1, bg2, bg3];

var doBits = true;

function dinkBit(alpha){

    if(theme == "Hacker" && doBits){
        var bitt;
        bitt = bits[bit];
        bit = (bit + 1) % bits.length;
        
        bitt.style.left = Math.random() * (x - 100 - 260);
        bitt.style.top = Math.random() * (y - 100);
        
        bitt.style.transition = "opacity 0s ease, margin-top 0s ease";
        bitt.style.opacity = alpha;
        bitt.style.marginTop = 0;
        
        setTimeout(function(){
            bitt.style.transition = "opacity 0.3s ease, margin-top 0.3s ease";
            bitt.style.opacity = 0;
            bitt.style.marginTop = 10;
        }, 100);
    }
}

function positiveMin(){
    var args = Array.prototype.slice.call(arguments);
    args.sort(function(a, b){
        if(a === null || isNaN(a) || a <= 0) return 1;
        if(b === null || isNaN(b) || b <= 0) return -1
        return a-b;
    });
    return args[0];
}

function nextUpTypeSpeed(){ //36,816 for max
    return Math.floor(500 * (Math.pow(2.6, upTypeIndex)));
    //return Math.floor(((upTypeIndex+1) * 22.361) * ((upTypeIndex+1) * 22.361));
}

function nextUpWorkSpeed(){ //103,100 for max
    return Math.floor(1600 * (Math.pow(2.5, upWorkIndex)));
    //return Math.floor(((upWorkIndex+1) * 40) * ((upWorkIndex+1) * 40));
}

function nextUpBuffer(){ //103,100 for max
    return Math.floor(800 * (Math.pow(1.8, upBufferIndex)));
    //return Math.floor(((upWorkIndex+1) * 40) * ((upWorkIndex+1) * 40));
}

function upTypeSpeed(){
    
    if(upTypeIndex >= 5) return;
    //console.log(score + " " + nextUpTypeSpeed());

    if(score >= nextUpTypeSpeed()){
        score -= nextUpTypeSpeed();
        upTypeIndex++;
        typeSpeed *= (3/4);
    }
}

function upWorkSpeed(){
    if(upWorkIndex >= 5) return;

    if(score >= nextUpWorkSpeed()){
        score -= nextUpWorkSpeed();
        upWorkIndex++;
        workerSpeedMod += 0.25;
    }
}

function upBuffer(){
    if(upBufferIndex >= 5) return;

    if(score >= nextUpBuffer()){
        score -= nextUpBuffer();
        upBufferIndex++;
        bufferSizeMod += 0.5;
    }
}

function nextInsiderBuy(){
    return (Math.pow(((insiderCount + 2)/2), 2) * 20000);
}

function nextCryptBuy(){
    return (Math.pow(((insiderCount + 2)/2), 2) * 55000);
}

function nextTechBuy(){
    return (Math.pow(((techCount + 2)/2), 2) * 2500);
}

function nextHackerBuy(){
    return (Math.pow(((hackerCount + 2)/2), 2) * 8000);
}

function nextKiddieBuy(){
    return (Math.pow(((kiddieCount + 2)/2), 2) * 500);
}

function buyInsider(){
    if(score >= nextInsiderBuy()){
        score -= nextInsiderBuy();
        insiderCount++;
    }
}

function buyCrypt(){
    if(score >= nextCryptBuy()){
        score -= nextCryptBuy();
        cryptCount++;
    }
}

function buyHacker(){
    if(score >= nextHackerBuy()){
        score -= nextHackerBuy();
        hackerCount++;
    }
}

function buyTech(){
    if(score >= nextTechBuy()){
        score -= nextTechBuy();
        techCount++;
    }
}

function buyKiddie(){
    if(score >= nextKiddieBuy()){
        score -= nextKiddieBuy();
        kiddieCount++;
    }
}

var theme;

document.onkeyup = function (e) {
    e = e || window.event;
    // use e.keyCode
    if(document.activeElement != document.getElementById("loadBox")){
        dinkBit(0.8);
        if(index - Math.round(currAutoIndex) <= ((100 - typeSpeed)/4) * bufferSizeMod){
            nextWord(false);
        }
    }
};

function changeDoc(){

    var h = hacks[Math.floor(Math.random()*hacks.length)];
    setFile("./hacks/" + h);
}

function setFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                
                var tabStr = '\xa0\xa0\xa0\xa0';
                
                currHack = allText.replace(/\t/g, tabStr);
                currHack = currHack.replace(/ /g, '\xa0');
                text.innerText = "";
                index = 0;
                currIndex = 0;
                currAutoIndex = 0;
            }
        }
    }
    rawFile.send(null);
}

var lightL = document.getElementById("themeLight");
var creamL = document.getElementById("themeCream");
var darkL = document.getElementById("themeDark");
var hackerL = document.getElementById("themeHacker");
var ubg100L = document.getElementById("themeUBG100");

var glow = true;
var glowCol = "";

function setTheme(name){
    theme = name;

    lightL.style.border = "1px solid red";
    lightL.style.marginLeft = "0px";
    
    creamL.style.border = "1px solid red";
    creamL.style.marginLeft = "0px";
    
    darkL.style.border = "1px solid red";
    darkL.style.marginLeft = "0px";

    ubg100L.style.border = "1px solid red";
    ubg100L.style.marginLeft = "0px";
    
    hackerL.style.border = "1px solid red";
    hackerL.style.marginLeft = "0px";
    
    
    switch(name){
        case "Light": 
            lightL.style.border = "2px solid green";
            lightL.style.marginLeft = "-1px";
            
            
            text.style.color = "#555";
            if(glow) text.style.textShadow = "#B0B0B0 0 0 10px";
            cursor.style.color = "#555";
            infoText.style.color = "#555";
            if(glow) infoText.style.textShadow = "#555 0 0 10px";
            document.getElementById("saveBox").style.color = "#555";
            document.getElementById("loadBox").style.color = "#555";
            
            enabledColor = "#00CC00";
            disabledColor = "#DD0000";
            maxUpgradeColor = "#9E7900";
            
            document.body.style.backgroundColor = "#F0F0F0";
            document.getElementById("saveBox").style.backgroundColor = "#F0F0F0";
            document.getElementById("saveBox").style.borderColor = "#D6D6D6";
            document.getElementById("loadBox").style.backgroundColor = "#F0F0F0";
            document.getElementById("loadBox").style.borderColor = "#D6D6D6";
            document.getElementById("info").style.backgroundColor = "#E2E2E2";
            document.getElementById("optSFX").style.color = "222";
        break;
        case "Cream": 
            creamL.style.border = "2px solid green";
            creamL.style.marginLeft = "-1px";
            
            
            text.style.color = "#7e6142";
            if(glow) text.style.textShadow = "#7e6142 0 0 10px";
            cursor.style.color = "#7e6142";
            infoText.style.color = "#7e6142";
            if(glow) infoText.style.textShadow = "#7e6142 0 0 10px";
            document.getElementById("saveBox").style.color = "#7e6142";
            document.getElementById("loadBox").style.color = "#7e6142";
            
            enabledColor = "#00CC00";
            disabledColor = "#CC0000";
            maxUpgradeColor = "#9E7900";
            
            document.body.style.backgroundColor = "#F3E5AB";
            document.getElementById("saveBox").style.backgroundColor = "#F3E5AB";
            document.getElementById("saveBox").style.borderColor = "#F0E0A5";
            document.getElementById("loadBox").style.backgroundColor = "#F3E5AB";
            document.getElementById("loadBox").style.borderColor = "#F0E0A5";
            document.getElementById("info").style.backgroundColor = "#D8CB99";
            document.getElementById("optSFX").style.color = "222";
        break;
        case "Dark": 
            darkL.style.border = "2px solid green";
            darkL.style.marginLeft = "-1px";
            
            text.style.color = "#CCC";
            if(glow) text.style.textShadow = "#CCC 0 0 10px";
            cursor.style.color = "#CCC";
            infoText.style.color = "#CCC";
            if(glow) infoText.style.textShadow = "#CCC 0 0 10px";
            document.getElementById("saveBox").style.color = "#CCC";
            document.getElementById("loadBox").style.color = "#CCC";
            
            enabledColor = "#00FF00";
            disabledColor = "#FF0000";
            maxUpgradeColor = "#E6A817";
            
            document.body.style.backgroundColor = "#222222";
            document.getElementById("saveBox").style.backgroundColor = "#666666";
            document.getElementById("saveBox").style.borderColor = "#888888";
            document.getElementById("loadBox").style.backgroundColor = "#666666";
            document.getElementById("loadBox").style.borderColor = "#888888";
            document.getElementById("info").style.backgroundColor = "#1B1B1B";
            document.getElementById("optSFX").style.color = "ccc";
        break;
        case "UBG100": 
            ubg100L.style.border = "2px solid #E77E7E";
            ubg100L.style.marginLeft = "-1px";
            
            text.style.color = "#E77E7E";
            if(glow) text.style.textShadow = "#E77E7E 0 0 10px";
            cursor.style.color = "#FFFFFF";
            infoText.style.color = "#E77E7E";
            if(glow) infoText.style.textShadow = "#FFFFFF 0 0 10px";
            document.getElementById("saveBox").style.color = "#FFFFFF";
            document.getElementById("loadBox").style.color = "#FFFFFF";
            
            enabledColor = "#00FF00";
            disabledColor = "#FF0000";
            maxUpgradeColor = "#E77E7E";
            
            document.body.style.backgroundColor = "#1F2029";
            document.getElementById("saveBox").style.backgroundColor = "#E77E7E";
            document.getElementById("saveBox").style.borderColor = "#888888";
            document.getElementById("loadBox").style.backgroundColor = "#E77E7E";
            document.getElementById("loadBox").style.borderColor = "#888888";
            document.getElementById("info").style.backgroundColor = "#1F2029";
            document.getElementById("optSFX").style.color = "FFFFFF";
        break;
        case "Hacker": 
            hackerL.style.border = "2px solid green";
            hackerL.style.marginLeft = "-1px";
            
            text.style.color = "#00FF00";
            if(glow) text.style.textShadow = "#00FF00 0 0 10px";
            cursor.style.color = "#00FF00";
            infoText.style.color = "#00FF00";
            if(glow) infoText.style.textShadow = "#00FF00 0 0 10px";
            document.getElementById("saveBox").style.color = "#00FF00";
            document.getElementById("loadBox").style.color = "#00FF00";
            
            enabledColor = "#00FF00";
            disabledColor = "#FF0000";
            maxUpgradeColor = "#E6A817";
            
            document.body.style.backgroundColor = "black";
            document.getElementById("saveBox").style.backgroundColor = "#666666";
            document.getElementById("saveBox").style.borderColor = "#888888";
            document.getElementById("loadBox").style.backgroundColor = "#666666";
            document.getElementById("loadBox").style.borderColor = "#888888";
            document.getElementById("info").style.backgroundColor = "black";
            
            document.getElementById("optSFX").style.color = doBits ? enabledColor : disabledColor;
        break;
    }
    
    var ar = document.getElementsByClassName("header");
    
    for(var i = 0; i < ar.length; i++){
        ar[i].style.color = enabledColor;
    }
    
}

setTheme("Hacker");

function toggleOption(opt){
    switch(opt){
        case 'SFX':
            if(theme == "Hacker"){
                doBits = !doBits;
                document.getElementById("optSFX").style.color = doBits ? enabledColor : disabledColor;
            }
            //alert(doBits);
        break;
        case 'Glow':
            glow = !glow;
           
            if(!glow){
                text.style.textShadow = "rgba(0, 0, 0, 0) 0 0 10px";
                infoText.style.textShadow = "rgba(0, 0, 0, 0) 0 0 10px";
            }else{
                setTheme(theme);
            }
            
            document.getElementById("optGlow").style.color = glow ? enabledColor : disabledColor;
            
        break;
    }
}