var width,height,sqSize=18,mines;
var boardInfo=[[9,9,10],[16,16,40],[30,16,99],[0,0,0]],sizeIndex=2,tmpIndex=2;
var boardData=[],bounds,boundsFull,id=null,started=false,playing=true;
genBoard();
var time=0,floatMines;

function setBounds(){
  return [-width-1,-width,-width+1,-1,1,width-1,width,width+1];
}

function setBoundsFull(){
  return [-width-1,-width,-width+1,-1,0,1,width-1,width,width+1];
}

document.body.addEventListener("mousedown",function(event){preSel(event);});
document.getElementById("backface").addEventListener("mousedown",function(event){selItem(event);});
document.body.addEventListener("mouseup",function(event){selBlock(event);});

function genBoard(){
  width=boardInfo[sizeIndex][0];
  height=boardInfo[sizeIndex][1];
  mines=boardInfo[sizeIndex][2];
  bounds=setBounds();
  boundsFull=setBoundsFull();
  var area=document.getElementById("innerwrapper");
  area.style.width=width*sqSize+"px";
  area.style.height=height*sqSize+"px";
  var inner="";
  for (var i=0;i<width*height;i++){
    inner+="<div class='block' id='"+i+"' state='blank'></div>";
  }
  area.innerHTML=inner;
  floatMines=mines;
  time=0;
  setPos();
  setDigits("left",mines);
  setDigits("time",0);
  flip(0);
}

window.onresize=function(){
  setPos();
};

function setPos(){
  var wrapper=document.getElementById("wrapper");
  var rect=wrapper.getBoundingClientRect();
  wrapper.style.marginLeft=(-rect.width/2)+"px";
  wrapper.style.marginTop=((rect.height/2+20<window.innerHeight/2)?(-rect.height/2):(-window.innerHeight/2+20))+"px";
}

function preSel(evt){
  if (!playing){return;}
  if (evt.which==3){
    toggleFlag(evt);
    return;
  }
  id=null;
  if (evt.target.className=="block"){
    if (evt.target.getAttribute("state")=="blank"){
      id=parseInt(evt.target.id);
      evt.target.setAttribute("state","visible");
    }
    document.getElementById("smilebtn").setAttribute("state","ooh");
  }
}

function selBlock(evt){
  if (!playing||evt.which==3){return;}
  var smiley=document.getElementById("smilebtn");
  smiley.setAttribute("state","smile");
  if (id!=null){
    var target=document.getElementsByClassName("block")[id];
    if (!started){
      setMines(id);
      started=true;
      time=new Date().getTime();
    }
    var type=boardData[id].type;
    if (type==0){
      uncoverTiles();
    }else if (type!=-1){
      target.innerHTML=type;
      target.setAttribute("state","visible_"+type);
    }else{
      target.style.backgroundColor="red";
      var blocks=document.getElementsByClassName("block");
      for (var i=0;i<blocks.length;i++){
        var type=blocks[i].getAttribute("state");
        if (boardData[i].type==-1){
          if (type!="flag"){blocks[i].setAttribute("state","mine");}
        }else if(type=="flag"&&boardData[i].type!=-1){
          blocks[i].setAttribute("state","wrong");
        }
      }
      smiley.setAttribute("state","dead");
      playing=false;
      time=0;
    }
    if (isSolved()){
      smiley.setAttribute("state","cool");
      playing=false;
      time=0;
    }
  }
}

function uncoverTiles(){
  var tiles=document.getElementsByClassName("block");
  var uncover=[id],uncoverNext=[];
  for (var i=0;i<10000;i++){    //prevent (unlikely) infinite loop
    for (var n=0;n<uncover.length;n++){
      for (var m=0;m<8;m++){
        id=uncover[n]+bounds[m];
        if (!outOfBounds(id,uncover[n])&&tiles[id].getAttribute("state")!="flag"){
          var bd=boardData[id];
          if (bd.covered){
            bd.covered=false;
            if (bd.type==0){
              uncoverNext.push(id);
            }
            if (bd.type!=-1){
              tiles[id].setAttribute("state","visible_"+bd.type);
              if (bd.type!=0){tiles[id].innerHTML=bd.type;}
            }
          }
        }
      }
    }
    if (uncoverNext.length!=0){
      uncover=[];
      for (var a=0;a<uncoverNext.length;a++){
        uncover.push(uncoverNext[a]);
      }
      uncoverNext=[];
    }else{
      return;
    }
  }
}

function toggleFlag(evt){
  if (!playing){return;}
  if (evt.target.className=="block"){
    var attr=evt.target.getAttribute("state");
    if (attr=="blank"){
      evt.target.setAttribute("state","flag");
      floatMines--;
    }else if (attr=="flag"){
      evt.target.setAttribute("state","blank");
      floatMines++;
    }
    setDigits("left",floatMines);
  }
  if (isSolved()){
    document.getElementById("smilebtn").setAttribute("state","cool");
    playing=false;
    time=0;
  }
}

function setMines(id){
  var possible=[];
  boardData=[];
  //generate a list of legal places to put mines
  for (var i=0;i<width*height;i++){
    possible.push(i);
    boardData.push({
      type: 0,
      covered: true
    });
  }
  //remove the blocks surrounding the clicked block
  for (var i=8;i>=0;i--){
    if (!outOfBounds(id+boundsFull[i],id)){
      possible.splice(id+boundsFull[i],1);
    }
  }
  var blocks=document.getElementsByClassName("block");
  //randomly place blocks
  for (var i=0;i<mines;i++){
    var pos=Math.floor(Math.random()*possible.length);
    boardData[possible[pos]].type=-1;
    possible.splice(pos,1);
  }
  //check how many mines surround each block
  for (var i=0;i<width*height;i++){
    var count=0;
    for (var n=0;n<8;n++){
      if (!outOfBounds(i+bounds[n],i)){
        if (boardData[i+bounds[n]].type==-1){count++;}
      }
    }
    if (boardData[i].type!=-1){
      boardData[i].type=count;
    }
  }
} 

function outOfBounds(coord,center){
  if (coord<0||coord>=width*height){
    return true;
  }else if(center%width==0&&(coord+1)%width==0||(center+1)%width==0&&coord%width==0){
    return true;
  }
  return false;
}

function createNew(){
  genBoard();
  started=false;
  playing=true;
  document.getElementById("smilebtn").setAttribute("state","smile");
}

function setDigits(idStr,no){
  var digits=document.getElementById(idStr).children;
  var num=""+no;
  for (var i=0;i<digits.length;i++){
    digits[i].setAttribute("value",0);
  }
  if (num.startsWith("-")){
    num=num.substring(1,num.length);
    digits[0].setAttribute("value","-");
  }
  num=num.substring(0,4);
  var diff=3-num.length;
  for (var i=diff;i<3;i++){
    digits[i].setAttribute("value",num[i-diff]);
  }
}

function setTime(){
  var diff=Math.ceil((new Date().getTime()-time)/1000);
  if (diff<1000){
    absTime=diff;
    setDigits("time",absTime);
  }
}

function isSolved(){
  if (floatMines==0){
    var blocks=document.getElementsByClassName("block");
    for (var i=0;i<blocks.length;i++){
      if (blocks[i].getAttribute("state")=="blank"){
        return false;
      }
    }
    return true;
  }
  return false;
}

function flip(id){
  document.getElementById("playarea").setAttribute("face",id==0?"front":"back");
  var sb=document.getElementById("setupbtn");
  sb.innerHTML=id==0?"Difficulty":"Go back";
  var ib=document.getElementById("infobtn");
  ib.innerHTML=id==0?"Controls":"Go back";
  ib.style.display=id==0?"block":"none";
}

function toggleSetup(oneWay){
  var pa=document.getElementById("playarea");
  if (pa.getAttribute("face")=="front"&&!oneWay){
    document.getElementById("backface").innerHTML=document.getElementById("settingsbuffer").innerHTML;
    flip(1);
    var ci=document.getElementsByClassName("custominp");
    for (var i=0;i<3;i++){
       ci[i].value=boardInfo[sizeIndex][i];
    }
    document.getElementsByTagName("tr")[sizeIndex+1].style.backgroundColor="#888";
  }else{
    flip(0);
  }
}

function toggleControls(){
  var pa=document.getElementById("playarea");
  if (pa.getAttribute("face")=="front"){
    document.getElementById("backface").innerHTML=document.getElementById("controlsbuffer").innerHTML;
    flip(1);
  }else{
    flip(0);
  }
}

function selItem(evt){
  var td=evt.target.tagName=="TD"?evt.target:evt.target.parentElement;
  if (td.tagName=="TD"){
    var trs=document.getElementsByTagName("tr");
    for (var i=0;i<5;i++){
      trs[i].style.backgroundColor="";
      if (td.parentElement==trs[i]){tmpIndex=i;}
    }
    trs[tmpIndex].style.backgroundColor="#888";
    tmpIndex--;
  }
}

function confirmBoard(){
  sizeIndex=tmpIndex;
  if (sizeIndex==3){
    var ci=document.getElementsByClassName("custominp");
    boardInfo[3][0]=Math.max(parseInt((isNaN(ci[0].value)||ci[0].value=="")?9:ci[0].value),9);
    boardInfo[3][1]=Math.max(parseInt((isNaN(ci[1].value)||ci[1].value=="")?9:ci[1].value),9);
    var len=boardInfo[3][0]*boardInfo[3][1],val=Math.min(parseInt(ci[2].value),len-9);
    boardInfo[3][2]=val>=0?val:Math.floor(len/3);
  }
  createNew();
}

setInterval(setTime,50);