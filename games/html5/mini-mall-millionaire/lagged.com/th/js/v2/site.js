var pageIsReady=false;
var adBreak;
var returnFunct=false;
var isMobile=false;

var username="guest"+Math.floor(1e4*Math.random());
var useravatar="https://lagged.com/images/avatars/default-avatar.jpg";
var currentRating=0;
var userid_ds=0;

function pageIsReadyFunc(){
  pageIsReady=true;
  console.log("page is ready");

  try{
    (adsbygoogle = window.adsbygoogle || []);
    [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () {
    adsbygoogle.push({})
    });
  }catch(e){
    console.log(e);
  }
}

function findCampaign(channel){
  for(var i=0;i<adChannels.length;i++){
    if(adChannels[i].campaign==channel){
      return adChannels[i];
    }
  }
}

function findCreative(channel){
  for(var i=0;i<creativeChannels.length;i++){
    if(creativeChannels[i].creative==channel){
      return creativeChannels[i];
    }
  }
}

//
// get custom channel url
//
var useCustomChannel=false;
var customChannelUse="";
var customHostChannel="";

//
// to do new: 
//
var useCustomAdChannel=false;
var customCreativeChannelUse="";
//
// ^^^^
//

try{
var urlChannelCheck=new URL(location.href).searchParams.get('fromchanel');
if(urlChannelCheck&&urlChannelCheck.length>3){

  urlChannelCheck=parseInt(urlChannelCheck);

  try{
    var channelFind=findCampaign(urlChannelCheck);
  }catch(e){
    console.log(e);
  }

  if(channelFind&&channelFind.channel&&channelFind.host){
    useCustomChannel=true;
    customChannelUse=channelFind.channel;
    customHostChannel=channelFind.host;

    //set cookie
    setCookie('cpcustom',urlChannelCheck,30);
  }

  //
  // to do new:
  // check creativeChannels
  //
  var creativeId=new URL(location.href).searchParams.get('adid');
  if(creativeId&&creativeId.length>3){
    creativeId=parseInt(creativeId);

    try{
      var channelFindAdCreatuve=findCreative(creativeId);
    }catch(e){
      console.log(e);
    }

    if(channelFindAdCreatuve&&channelFindAdCreatuve.channel){
      useCustomAdChannel=true;
      customCreativeChannelUse=channelFindAdCreatuve.channel;
  
      //set cookie
      setCookie('createcustom',creativeId,30);
    }

  }else{
    setCookie('createcustom',0,30);
  }
  //
  // ^^^^^^^^^^
  //

}else{
  //
  //check if custom url cookie
  //
  var checkChannelCookie=getCookie('cpcustom');
  checkChannelCookie=parseInt(checkChannelCookie);

  if(checkChannelCookie>0){

    try{
      var channelFind=findCampaign(checkChannelCookie);
    }catch(e){
      console.log(e);
    }

    if(channelFind&&channelFind.channel&&channelFind.host){
      useCustomChannel=true;
      customChannelUse=channelFind.channel;
      customHostChannel=channelFind.host;
    }

    //
    // to do new: check cookie
    //
    var checkCreativeCookie=getCookie('createcustom');
    checkCreativeCookie=parseInt(checkCreativeCookie);

    if(checkCreativeCookie>0){

      try{
        var channelFindAdCreatuve=findCreative(checkCreativeCookie);
      }catch(e){
        console.log(e);
      }
  
      if(channelFindAdCreatuve&&channelFindAdCreatuve.channel){
        useCustomAdChannel=true;
        customCreativeChannelUse=channelFindAdCreatuve.channel;
      }
    }
    //
    // ^^^^
    //

  }
}
}catch(e){
  console.log(e);
}

var element = document.createElement('script');
var firstScript = document.getElementsByTagName('script')[0];
var url = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
element.src = url;
element.setAttribute('data-ad-client', 'ca-pub-6893876361346206');

// if(useCustomChannel){
//     console.log('customChannelUse: ', customChannelUse);
//     console.log('customHostChannel: ', customHostChannel);
//     element.setAttribute('data-ad-channel', customChannelUse);
// }

//
// to do new: replace
//
if(useCustomChannel&&useCustomAdChannel){
  console.log('customChannelUse: ', customChannelUse);
  console.log('custom ad yse: ', customCreativeChannelUse);
  var channels=customChannelUse+" "+customCreativeChannelUse;

  //var channels=[customChannelUse+","+customCreativeChannelUse];
  //var channels="["+customChannelUse+"+"+customCreativeChannelUse+"]";

  element.setAttribute('data-ad-channel', channels);
}else if(useCustomChannel){
console.log('customChannelUse: ', customChannelUse);
console.log('customHostChannel: ', customHostChannel);
element.setAttribute('data-ad-channel', customChannelUse);  
}
//
// ^^^^
//

element.setAttribute('data-ad-frequency-hint', '30s');
firstScript.parentNode.insertBefore(element, firstScript);

if(typeof iframesrc !== 'undefined'){
  try{
    window.adsbygoogle = window.adsbygoogle || [];
    adBreak = adConfig = function(o) {adsbygoogle.push(o);}
    adConfig({preloadAdBreaks: 'on', onReady: pageIsReadyFunc});
  }catch(e){
  console.log(e);
  }
}else{
  try{
    (adsbygoogle = window.adsbygoogle || []);
    [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () {
    adsbygoogle.push({})
    });
  }catch(e){
    console.log(e);
  }
}

function toggleSearch(){var sb=document.getElementById("search-headerbar");sb.style.display="none"===sb.style.display?"":"none",document.getElementById("search-bar").focus();}
function getUrlParam(e){}
var toggleAjaxSearch=function(){var sb=document.getElementById("ajaxsrwr");sb.classList.toggle("show");document.getElementById("ajaxbar").focus();}

var lastAjaxTerm;
var isLoading=false;
function capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

var ajaxSearchUp=function(val){
	if(window.innerHeight < 300){
		return;
	}

	var ajaxsrh=val.replace(/[^\x00-\x7F]/g, "");
	ajaxsrh=ajaxsrh.replace("games", '');
	ajaxsrh=ajaxsrh.replace("game", '');
	var ajaxSrhSpace=ajaxsrh.replace(/[^\x00-\x7F]/g, "");


	if(ajaxsrh.length===0){
		var ajaxList=document.getElementById('ajaxlistdiv');
		document.getElementById('ajaxform').className="";
		if(ajaxList){
			ajaxList.style.display="none";
			while (ajaxList.firstChild) {
			    ajaxList.removeChild(ajaxList.firstChild);
			}
		}
	}

	if(ajaxsrh.length>2&&ajaxSrhSpace!=lastAjaxTerm&&!isLoading){
		lastAjaxTerm=ajaxSrhSpace;

    sendAjax(ajaxsrh, 'search.php',  function(response){
      if(!response.errors){
				//make sure ajax list is visible
				var ajaxList=document.getElementById('ajaxlistdiv');
				document.getElementById('ajaxform').className="searchdrop";
				if(!ajaxList){
					var ajaxList=document.createElement('div');
					ajaxList.id="ajaxlistdiv";
					document.getElementById('ajaxsrwr').appendChild(ajaxList);
				}else{
					ajaxList.style.display="block";
					//if(response.cnt>0){
					while (ajaxList.firstChild) {
					    ajaxList.removeChild(ajaxList.firstChild);
					}
					//}
				}

				if(response.cnt>0){

					for(var i=0;i<response.tags.length;i++){
						var gameWrap=document.createElement('div');
						gameWrap.className="ajax-gamewr";
						var gameAWr=document.createElement('a');
						gameAWr.href="https://lagged.com/th/th/"+response.tags[i].name;
						gameAWr.title=response.tags[i].t_name;

						gameAWr.className="ajref";
						var gameIms=document.createElement('img');
						gameIms.src="https://imgs2.dab3games.com/"+response.tags[i].icon;
						gameIms.className="ajimgsr";
						gameIms.alt=response.tags[i].t_name;
						gameAWr.appendChild(gameIms);

						var gameName=document.createTextNode(capitalizeFirstLetter(response.tags[i].t_name.replace(/-/g, ' ')));
						gameAWr.appendChild(gameName);
						gameWrap.appendChild(gameAWr);
						ajaxList.appendChild(gameWrap);
					}

					for(var i=0;i<response.games.length;i++){
						var gameWrap=document.createElement('div');
						gameWrap.className="ajax-gamewr";

						var gameAWr=document.createElement('a');
						gameAWr.className="ajref";
						gameAWr.href="https://lagged.com/th/th/g/"+response.games[i].url_key;
						gameAWr.title=response.games[i].name;
						var gameIms=document.createElement('img');
						gameIms.src="https://imgs2.dab3games.com/"+response.games[i].thumb;
						gameIms.alt=response.games[i].name;
						gameIms.className="ajimgsr";
						gameAWr.appendChild(gameIms);

						var gameName=document.createTextNode(response.games[i].name);
						gameAWr.appendChild(gameName);
						gameWrap.appendChild(gameAWr);
						ajaxList.appendChild(gameWrap);
					}

				}else{
					//if no results "browse games" / "search users" buttons
					var gameWrap=document.createElement('span');
					gameWrap.className="span-noresults";
					var gameName=document.createTextNode("ไม่มีผลลัพธ์");
					gameWrap.appendChild(gameName);
					ajaxList.appendChild(gameWrap);

					var gameWrap=document.createElement('div');
					gameWrap.className="ajax-gamewr";
					var gameAWr=document.createElement('a');
					gameAWr.className="ajref";
					gameAWr.href="https://lagged.com/th/";
					gameAWr.title="เรียกดูเกม";
					var gameIms=document.createElement('img');
					gameIms.src="https://imgs2.dab3games.com/popular-games1.png";
					gameIms.alt="เรียกดูเกม";
					gameIms.className="noshadw ajimgsr";
					gameAWr.appendChild(gameIms);
					var gameName=document.createTextNode("เรียกดูเกม");
					gameAWr.appendChild(gameName);
					gameWrap.appendChild(gameAWr);
					ajaxList.appendChild(gameWrap);


					var gameWrap=document.createElement('div');
					gameWrap.className="ajax-gamewr";

					var gameAWr=document.createElement('a');
					gameAWr.className="ajref";
					gameAWr.href="https://lagged.com/th/user-search/";
					gameAWr.title="ค้นหาผู้ใช้";
					var gameIms=document.createElement('img');
					gameIms.src="https://imgs2.dab3games.com/search-users.png";
					gameIms.alt="ค้นหาผู้ใช้";
					gameIms.className="noshadw ajimgsr";
					gameAWr.appendChild(gameIms);
					var gameName=document.createTextNode("ค้นหาผู้ใช้");
					gameAWr.appendChild(gameName);
					gameWrap.appendChild(gameAWr);
					ajaxList.appendChild(gameWrap);

				}
			}else{
				console.log(response.error);
			}
    });

	}
}

var ajaxSearch=function(event){
	//check arrow keys, move down list of results if down/up key -> select if enter
	//event.preventDefault();
	//event.stopPropagation();

	if(event.keyCode===40){
		var selItem=document.getElementById("ajaxselected");
		if(selItem){
			var newItem=selItem.nextSibling;
			if(newItem){
			  newItem.id="ajaxselected";
			  selItem.id="";
			}
		}else{
			var newItem=document.getElementById("ajaxlistdiv").firstChild;
			if(newItem){
				newItem.id="ajaxselected";
			}
			if(newItem.className=="span-noresults"){
				newItem.id="";
				newItem=newItem.nextSibling
				if(newItem){
					newItem.id="ajaxselected";
				}
			}

		}
		return;
	}else if(event.keyCode===38){
		event.preventDefault();
		var selItem=document.getElementById("ajaxselected");
		if(selItem){
			var newItem=selItem.previousSibling;
			if(newItem){
				if(newItem.className=="span-noresults"){
					return;
				}
			  newItem.id="ajaxselected";
			  selItem.id="";
			}
		}

		var len = document.getElementById('ajaxbar').value.length;
		document.getElementById('ajaxbar').setSelectionRange(len, len);

		return;
	}else if(event.keyCode===13){
		var selItem=document.getElementById("ajaxselected");
		if(selItem&&selItem.firstChild.href){
		  window.open(selItem.firstChild.href,"_self");
		  return;
		}else{
			document.getElementById('ajaxform').submit();
		}
	}
}

var ajaxSubmit=function(event){
	event.preventDefault();
	if(!document.getElementById("ajaxselected")){
		document.getElementById('ajaxform').submit();
	}
}

function toggleLang(){var l=document.getElementById("togglelang");"block"===l.style.display?l.style.display="none":l.style.display="block"}

function closeOutAJax(event){
	try{
	if(event.target.className!="ajimgsr"&&event.target.className!="ajref"&&event.target.className!="ajax-gamewr"&&event.target.id!="ajaxlistdiv"&&event.target.id!="ajaxform"&&event.target.id!="searchbtn"&&event.target.id!="ajaxbar"&&event.target.id!="togglesearchr"&&event.target.id!="ajaxsrwr"){
	  //setTimeout(function(){

		var ajaxList=document.getElementById('ajaxlistdiv');
		if(document.getElementById('ajaxform')){
			document.getElementById('ajaxform').className="";
			document.getElementById("ajaxbar").blur();
		}
		if(ajaxList){
			document.getElementById("ajaxsrwr").className="ajax_search"
		}
		if(document.getElementById('ajaxsrwr').classList.contains("show")){
			document.getElementById('ajaxsrwr').className="ajax_search";
		}
	  //},50);
	}
	}catch(e){
		console.log(e);
	}
}

document.addEventListener('touchend', closeOutAJax, false);
document.addEventListener('click', closeOutAJax, false);

// function getParameterByName(name) {
//     var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
//     return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
// }

// try{
// window.addEventListener('load', function (){
//   var customChannel = getParameterByName('usecustom');
//
//   if(customChannel&&!isNaN(customChannel)){
//
//     setCookie('cpcustom',customChannel,30);
//
//   }
// });
// }catch(e){
// console.log(e);
// }

function setCookie(name,value,days) {
console.log('set cookie: ', value);
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return match ? match[1] : null;
}

function startLoading(){
  try{
    document.getElementById('clickytext').className="play_btn loading";
    document.getElementById('clickytext').innerHTML="";
  }catch(e){
    console.log(e);
  }
  if(pageIsReady){
    setTimeout(function(){
      startGame();
    },300);
  }else {
    var checkCount=0;
    var checkInt=setInterval(function(){
      if(pageIsReady){
        clearInterval(checkInt);
        startGame();
      }else{
        checkCount++;
        if(checkCount>10){
          clearInterval(checkInt);
          startGame();
        }
      }
    },200);
  }
}

var startGame=function(){

try{
// document.getElementById('playwrap').onclick=function(){console.log('no dc');}
var clicktoplay=document.getElementById('clickytext');
clicktoplay.innerHTML="";
clicktoplay.className="play_btn loading";
}catch(e){
  console.log(e);
}

if(pageIsReady){
loadAdsandGame();
}else{
var cntr=0;
var checkLoadStatus=setInterval(function(){
  cntr++;
  console.log("page ready ?? ", pageIsReady);
  if(pageIsReady){
    loadAdsandGame();
    clearInterval(checkLoadStatus);
  }else if(cntr>11){
    clearInterval(checkLoadStatus);
    showTheGame();
    enableButtons(false);
  }
},100);
}
}

var loadAdsandGame=function(){

  console.log('Load the game here');

  try{
    adBreak({
      type: 'start',
      name: 'start-game',
      beforeAd: function beforeAd() {
        disableButtons();
      },
      afterAd: function afterAd() {
        enableButtons(false);
      },
      adBreakDone: function adBreakDone(){
        showTheGame();
      }
    });
  }catch(e){
    console.log(e);
  }

}

function disableButtons(){
  try{
    console.log("send ad conversion");
    gtag('event', 'conversion', {'send_to': 'AW-1055364430/cX1uCOOx4LcBEM6qnvcD'});
  }catch(e){
    console.log(e);
  }
  if(document.getElementById('minividbtnnewl')){
    document.getElementById('minividbtnnewl').className="showittomob";
  }
  if(document.getElementById('mobilerightnew')){
    document.getElementById('mobilerightnew').className="";
  }
}

function enableButtons(returnF){
try{
  if(document.getElementById('minividbtnnewl')){
    document.getElementById('minividbtnnewl').className="showittomob showit";
  }
  if(document.getElementById('mobilerightnew')){
    document.getElementById('mobilerightnew').className="showmbtn";
  }
}catch(e){
  console.log(e);
}
try{
if(returnFunct){
  //if intersit. ad
}
}catch(e){
  console.log(e);
}
}

var loadedGameYet=false;
var showTheGame=function(){
  if(loadedGameYet){return;}
  loadedGameYet=true;

  try{
    if (typeof gameOrientation === 'undefined' || gameOrientation === null) {
      gameOrientation=1;
    }
  }catch(e){
    console.log(e);
  }

  var gameElement = document.createElement("object");
  gameElement.id="gamePlayer";
  gameElement.data=iframesrc;

  document.getElementById('game').appendChild(gameElement);
  document.getElementById('pregame').remove();

  try{
    var gameMiddle=document.getElementById('gameinmiddle');
    if(gameOrientation>1){
      gameMiddle.className="gamesmiddle gameisportrait";
    }else{
      gameMiddle.className="gamesmiddle";
    }

  }catch(e){
    console.log(e);
  }
  try{
    document.getElementById('game').className="gamearea";
  }catch(e){
    console.log(e);
  }

  if(document.getElementById('showafterplay')){
    document.getElementById('showafterplay').className="newgamesright showitafter";
  }

  if(window.innerWidth>800&&document.getElementById('pcad')){
    window.scroll(0,60);
    try{
      document.getElementById('pcad').innerHTML='<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6893876361346206" data-ad-slot="3306066442" data-ad-format="auto" data-full-width-responsive="true"></ins>';

      if(gameOrientation>1){
        var adLeftSide = document.createElement("div");
        adLeftSide.className="newgamesleft";
        adLeftSide.innerHTML='<div class="ad970 verticalad"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6893876361346206" data-ad-slot="3306066442" data-ad-format="auto" data-full-width-responsive="true"></ins></div>';
        gameMiddle.appendChild(adLeftSide);
      }


      try{
        (adsbygoogle = window.adsbygoogle || []);
        [].forEach.call(document.getElementsByClassName('adsbygoogle'), function () {
        adsbygoogle.push({})
        });
      }catch(e){
        console.log(e);
      }
    }catch(e){
      console.log(e);
    }
  }else if(window.innerWidth<801){
    document.body.className="fullscreenpage";
  }

//
// send ajax request, ping game +1, get user info
//
sendAjax(thisgamegid, 'gamejson.php',  function(userInfo){
  if(userInfo&&userInfo.user){
      showUserInfo(userInfo);
  }
});
}

var doitresize;
window.onresize = function(){
  if(!loadedGameYet){return;}
  clearTimeout(doitresize);
  doitresize = setTimeout(resizedw, 50);
};

function resizedw(){
  if(window.innerWidth>800){
    document.body.className="";
  }else{
    document.body.className="fullscreenpage";
  }
}

var viewPlaythrough=function(vid){
  var videourl="https://lagged.com/video-redirect.php?id="+vid;
  window.open(videourl,"_blank");
}

//
//show user info
//
var showUserInfo=function(userInfo){

  try{
    username=userInfo.user.username;
    userid_ds=userInfo.user.id;
    if(userInfo.user.avatar){
      useravatar="https://lagged.com/images/avatars/"+userInfo.user.avatar;
    }
  }catch(e){
    console.log(e);
  }
  try{
    if(userInfo.urate>0){
      currentRating=userInfo.urate;
     if(currentRating===1){
        var thumbdown = document.getElementsByClassName("dislikebtn");
        for (var i = 0; i < thumbdown.length; i++) {
          thumbdown[i].className='dislikebtn active';
        }
     }else if(currentRating===2){
        var thumbdown = document.getElementsByClassName("likebtn");
        for (var i = 0; i < thumbdown.length; i++) {
          thumbdown[i].className='likebtn active';
        }
     }
    }
  }catch(e){
    console.log(e);
  }
}


//
// all ajax use 1 format
//
var sendAjax=function(callData, page, callback){
  var xhttp = new XMLHttpRequest();
  try{
    xhttp.timeout = 2000;
  }catch(e){
    console.log(e);
  }
  xhttp.ontimeout = function (e) {
    console.log('error: ajax time out');
    callback(false);
  };
  xhttp.onreadystatechange = function() {

  if (this.readyState == 4 && this.status > 399) {
    console.log('error: ajax error');
    callback(false);
  }
    if (this.readyState == 4 && this.status == 200) {
     try{
      var response=this.responseText;
     response=response.replace(")]}',","");
     response=JSON.parse(response);

      callback(response);

    }catch(e){
      console.log(e);
      }
    }
  };
  xhttp.open("POST", "//lagged.com/th/api/v2/"+page, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("calldata="+callData);
}

var interShow=function(returnFunction){
  console.log("play inter ad");
try{
  adBreak({
    type: 'next',
    name: 'next-level',
    beforeAd: function beforeAd() {
      disableButtons();
    },
    afterAd: function afterAd() {
      enableButtons(false);
    },
    adBreakDone: function adBreakDone(){
      returnFunction();
    }
  });
}catch(e){
  console.log(e);
}
}

//
// Like / dislike the game
//
var submitRating=function(rating,fromlog){
if(fromlog&&currentRating===rating){
return;
}

var thumbup = document.getElementsByClassName("likebtn");
var thumbdown = document.getElementsByClassName("dislikebtn");
for (var i = 0; i < thumbup.length; i++) {
  thumbup[i].disabled=true;
}
for (var i = 0; i < thumbdown.length; i++) {
  thumbdown[i].disabled=true;
}

// thumbup.disabled=true;
// thumbdown.disabled=true;

var ajaxrating=rating;

if(thisgamegid<1||rating>2||rating<1){
return true;
}
if(rating===2){
if(currentRating===1){
//thumbdown.className="dislikebtn";
currentRating=2;
//thumbup.className="likebtn active";

for (var i = 0; i < thumbup.length; i++) {
  thumbup[i].className="likebtn active";
}
for (var i = 0; i < thumbdown.length; i++) {
  thumbdown[i].className="dislikebtn";
}

}else if(currentRating===2){
ajaxrating=4;
currentRating=0;
//thumbup.className="likebtn";
for (var i = 0; i < thumbup.length; i++) {
  thumbup[i].className="likebtn";
}
}else{
currentRating=2;
//thumbup.className="likebtn active";
for (var i = 0; i < thumbup.length; i++) {
  thumbup[i].className="likebtn active";
}
}
}else{
if(currentRating===2){
//thumbup.className="likebtn";
currentRating=1;
//thumbdown.className="dislikebtn active";

for (var i = 0; i < thumbup.length; i++) {
  thumbup[i].className="likebtn";
}
for (var i = 0; i < thumbdown.length; i++) {
  thumbdown[i].className="dislikebtn active";
}
}else if(currentRating===1){
ajaxrating=3;
currentRating=0;
//thumbdown.className="dislikebtn";
for (var i = 0; i < thumbdown.length; i++) {
  thumbdown[i].className="dislikebtn";
}
}else{
currentRating=1;
//thumbdown.className="dislikebtn active";
for (var i = 0; i < thumbdown.length; i++) {
  thumbdown[i].className="dislikebtn active";
}
}
}

var sendata={};
sendata.rating=ajaxrating;
sendata.gid=thisgamegid;

if(userid_ds<1){
  currentRating=0;
  sendata.type='rating';
  askLogin(sendata);

  for (var i = 0; i < thumbup.length; i++) {
    thumbup[i].disabled=false;
    thumbup[i].className="likebtn";
  }
  for (var i = 0; i < thumbdown.length; i++) {
    thumbdown[i].disabled=false;
    thumbdown[i].className="dislikebtn";
  }
  return;
}

sendAjax(JSON.stringify(sendata), 'ajax_rating.php',  function(response){

  if(ajaxrating===2){
  var addtolsc = document.createElement("div");
  addtolsc.id="addedtolikes";
  addtolsc.onclick=function(){openLikedRemove();};
  var addpara=document.createElement("p");
  addparab=document.createElement("b");
  addparabtxt=document.createTextNode("ชอบเกม");
  addparabtxt2=document.createTextNode("เพิ่มไปยังของคุณ ");
  addparab.appendChild(addparabtxt);
  addpara.appendChild(addparabtxt2);
  addpara.appendChild(addparab);
  addtolsc.appendChild(addpara);
  document.getElementById('gamecontrols').appendChild(addtolsc);

  setTimeout(function(){
  if(addtolsc){
  	fade(addtolsc);
    setTimeout(function(){
      if(addtolsc){
        addtolsc.remove();
      }
    },500);
  }
  }, 3000);
  }

  // thumbup.disabled=false;
  // thumbdown.disabled=false;
  for (var i = 0; i < thumbup.length; i++) {
    thumbup[i].disabled=false;
  }
  for (var i = 0; i < thumbdown.length; i++) {
    thumbdown[i].disabled=false;
  }

});
}

var openLikedRemove=function(){
window.open('https://lagged.com/th/liked','_blank');
fade(document.getElementById("addedtolikes"));
}

//
// open awards the game
//
var openAwards=function(){
startLoader();

sendAjax(thisgamegid, 'ajax_get_achs.php',  function(e){
  console.log(e);
  if(e&&e.success){
    var t="https://imgs2.dab3games.com/"+adThumb;

     buildWrapper();

     var awardWrap=document.createElement("div");
     awardWrap.id="achlistwrap";

     var s=document.createElement("h3");
     s.className="awardstitle";
     var m=document.createTextNode("ความสำเร็จ");
     s.appendChild(m);
     awardWrap.appendChild(s);

     var p=0,u="บันทึกไว้";e.uid&&0<e.uid&&(u="บันทึกไว้");for(var g=document.createElement("div"),h=0;e.content.length>h;h++){var v=document.createElement("div");e.content[h].saved&&0<e.content[h].saved?(v.className="awards_bit",p++):v.className="awards_bit notearned";var b=document.createElement("img");b.width="40",b.height="40",b.alt="Award",b.src=t;v.appendChild(b);var E=document.createElement("div"),C=document.createElement("span");C.className="title";var f=document.createTextNode(e.content[h].name);C.appendChild(f),E.appendChild(C);var w=document.createElement("span");w.className="desc";var y=document.createTextNode(e.content[h].textdesc);if(w.appendChild(y),E.appendChild(w),e.content[h].saved&&0<e.content[h].saved){var N=document.createElement("span");if(e.uid&&0<e.uid){N.className="checkedearn";var A=document.createTextNode("บันทึกไว้")}else N.className="checkedearn guestearnedach",A=document.createTextNode("บันทึกไว้");N.appendChild(A),E.appendChild(N)}v.appendChild(E);var T=document.createElement("div");T.className="pointstoearn";var x=document.createTextNode("+"+e.content[h].points);T.appendChild(x);var B=document.createElement("span"),k=document.createTextNode("xp");B.appendChild(k),T.appendChild(B),v.appendChild(T),g.appendChild(v)}var I=document.createElement("p"),_=document.createTextNode(p+" จาก "+e.content.length+" ความสำเร็จ "+u);if(I.appendChild(_),awardWrap.appendChild(I),awardWrap.appendChild(g),e.uid&&0<e.uid){(M=document.createElement("a")).setAttribute("href","https://lagged.com/th/awards"),M.setAttribute("target","_blank"),M.className="viewleaderguest",(D=document.createElement("img")).setAttribute("src","https://imgs2.dab3games.com/achievement-games.png"),D.setAttribute("alt","icon"),D.setAttribute("width","40"),D.setAttribute("height","40"),M.appendChild(D);var S=document.createTextNode("เกมแห่งความสำเร็จเพิ่มเติม");M.appendChild(S)}else{var M,D;(M=document.createElement("a")).onclick=function(){signup();},M.className="viewleaderguest",(D=document.createElement("img")).setAttribute("src","https://imgs2.dab3games.com/cautionsignin.png"),D.setAttribute("alt","icon"),D.setAttribute("width","40"),D.setAttribute("height","40"),M.appendChild(D),S=document.createTextNode("ลงทะเบียนเพื่อบันทึกความสำเร็จ"),M.appendChild(S)}
     awardWrap.appendChild(M);

     document.getElementById("leaderboard-wrapper").appendChild(awardWrap);

  }else{
    if(document.getElementById("leaderboard-wrapper")){
      document.getElementById("leaderboard-wrapper").remove()
    }
    if(document.getElementById("leaderboard-modal")){
      document.getElementById("leaderboard-modal").remove()
    }
    if(document.getElementById("leaderboard-loading")){
      document.getElementById("leaderboard-loading").remove();
    }
  }
});
}

//
// open high scores the game
//
var openLeaderboards=function(scoreData){
  startLoader();

  var boardId=0;
  var userTopScore=0;

  try{
    if(scoreData&&scoreData.data){
      console.log("board id: ", scoreData.data.gamedata.id);
      console.log("user best score, add to bottom of pop: ", scoreData.data.utop.score);

      boardId=scoreData.data.gamedata.id
      userTopScore=scoreData.data.utop.score;
    }
  }catch(e){
    console.log(e);
  }

  var hsIframeLink="https://lagged.com/th/hs-pop/"+thisgamegid+"/";
  if(boardId>0){
    hsIframeLink+=boardId;
  }

  buildWrapper();

  var hsIframe=document.createElement('iframe');
  hsIframe.className="hsiframesrc";
  hsIframe.scrolling="yes";
  hsIframe.src=hsIframeLink;
  document.getElementById("leaderboard-wrapper").appendChild(hsIframe);

if(userTopScore>0){
var topScoreDiv=document.createElement("div");
topScoreDiv.className="leaderboardUserRowWrap leaderboardBestScoreBottom";
topScoreDiv.innerHTML="<a href='https://lagged.com/th/profile/"+userid_ds+"' target='_blank'><img src='"+useravatar+"' width='100' height='100'><div>"+username+"</div></a><div class='leaderboardRowScore'>"+userTopScore+"</div></div>";
document.getElementById("leaderboard-wrapper").appendChild(topScoreDiv);
}else if(userid_ds<1){
var topScoreDiv=document.createElement("div");
topScoreDiv.className="leaderboardUserRowWrap leaderboardBestScoreBottom";
topScoreDiv.innerHTML="<a onclick='signup();' class='leadersignupwrap'><div>สร้างบัญชีฟรีเพื่อบันทึกคะแนนสูงสุดของคุณ</div></a></div>";
document.getElementById("leaderboard-wrapper").appendChild(topScoreDiv);
}

}

//
// build wrapper
//
var buildWrapper=function(){

  console.log("buid wrapper function");

if(document.getElementById("leaderboard-wrapper")){
  document.getElementById("leaderboard-wrapper").remove()
}
if(document.getElementById("leaderboard-modal")){
  document.getElementById("leaderboard-modal").remove()
}

  var mainWrapDiv = document.createElement("div");
  mainWrapDiv.id="leaderboard-wrapper";

  var backdropDiv = document.createElement("div");
  backdropDiv.id="leaderboard-modal";
  backdropDiv.onclick=function (event){event.preventDefault();event.stopPropagation();return false;};
  document.body.appendChild(backdropDiv);

  var mainWrapHeader = document.createElement("div");
  mainWrapHeader.id="leaderboard-wrapper-header";
  var mainWrapHeaderButton = document.createElement("button");
  mainWrapHeaderButton.onclick = function () {
    try{
      document.getElementById("leaderboard-wrapper").remove();
    }catch(e){
      console.log(e);
    }
    try{
      document.getElementById("leaderboard-modal").remove();
    }catch(e){
      console.log(e);
    }
  }
  mainWrapHeaderButton.id="leaderboard-header-button";
  var laggLink = document.createElement('a');
  laggLink.setAttribute('href', "https://lagged.com/th/");
  laggLink.setAttribute('target', "_blank");
  laggLink.id="headerlogolink";

  mainWrapHeader.appendChild(mainWrapHeaderButton);
  mainWrapHeader.appendChild(laggLink);
  mainWrapDiv.appendChild(mainWrapHeader);

  document.body.appendChild(mainWrapDiv);

  if(document.getElementById("leaderboard-loading")){
    document.getElementById("leaderboard-loading").remove();
  }
}


//
// start loader
//
var startLoader=function(){

  console.log("start loader for pop ups");

  if(document.getElementById('leaderboard-modal')){
    document.getElementById('leaderboard-modal').remove();
  }
  if(document.getElementById('leaderboard-loading')){
    document.getElementById('leaderboard-loading').remove();
  }
  if(document.getElementById('leaderboard-wrapper')){
    document.getElementById('leaderboard-wrapper').remove();
  }

  var backdropDiv = document.createElement("div");
  backdropDiv.id="leaderboard-modal";
  backdropDiv.onclick=function (event){event.preventDefault();event.stopPropagation();return false;};
  document.body.appendChild(backdropDiv);

  var a=document.createElement("div");
  a.id="leaderboard-loading";
  a.className="leaderboard-circle";
  document.body.appendChild(a);


}

//
// sign up function
//
var askLogin=function(callback){
buildWrapper();
guestAskLogin(1,callback);
}

var signup=function(callback){
buildWrapper();
guestSignUpForm(1,callback);
}


var guestSignUpForm=function(step,callback){
if(step!=1){
document.getElementById("signupFormWrap").remove();
}

var guestSignUpWrap = document.createElement("div");
guestSignUpWrap.id="signupFormWrap";

var signTabs=document.createElement("div");
signTabs.id="tabsButtonWraps";
signTabs.className="logintabs";

var tabBtnLogin = document.createElement("button");
tabBtnLogin.className="tabs_links";
tabBtnLogin.style.width="50%";
tabBtnLogin.onclick=function(){guestAskLogin(2,callback);};
var tabBtnText=document.createTextNode("เข้าสู่ระบบ");
tabBtnLogin.appendChild(tabBtnText);
signTabs.appendChild(tabBtnLogin);

var tabBtnLogin = document.createElement("button");
tabBtnLogin.className="tabs_links active";
tabBtnLogin.style.width="50%";
var tabBtnText=document.createTextNode("ลงทะเบียนฟรี");
tabBtnLogin.appendChild(tabBtnText);
signTabs.appendChild(tabBtnLogin);
guestSignUpWrap.appendChild(signTabs);

var signupForm = document.createElement("form");
signupForm.id="loginit";
signupForm.onsubmit=function(){return submitSignUpForm('signup',callback);};

var formGroup1 = document.createElement("div");
formGroup1.className="form-group";
var formGroupLabel1 = document.createElement("label");
formGroupLabel1.setAttribute('form',"inputEmail1");
var formGroupLabelText1=document.createTextNode("เลือกชื่อเล่น");
formGroupLabel1.appendChild(formGroupLabelText1);
formGroup1.appendChild(formGroupLabel1);
var formGroupInput1 = document.createElement("input");
formGroupInput1.setAttribute('type',"text");
formGroupInput1.setAttribute('name',"name");
formGroupInput1.id="inputEmail1";
formGroupInput1.className="form-control";
formGroupInput1.required=true;
formGroup1.appendChild(formGroupInput1);
signupForm.appendChild(formGroup1);

var formGroup2 = document.createElement("div");
formGroup2.className="form-group";
var formGroupLabel2 = document.createElement("label");
formGroupLabel2.setAttribute('form',"inputEmail2");
var formGroupLabelText2=document.createTextNode("ที่อยู่อีเมลของคุณ");
formGroupLabel2.appendChild(formGroupLabelText2);
formGroup2.appendChild(formGroupLabel2);
var formGroupInput2 = document.createElement("input");
formGroupInput2.setAttribute('type',"email");
formGroupInput2.setAttribute('name',"name");
formGroupInput2.id="inputEmail2";
formGroupInput2.className="form-control";
formGroupInput2.required=true;
formGroup2.appendChild(formGroupInput2);
signupForm.appendChild(formGroup2);

var formGroup3 = document.createElement("div");
formGroup3.className="form-group";
var formGroupLabel3 = document.createElement("label");
formGroupLabel3.setAttribute('form',"inputEmail3");
var formGroupLabelText3=document.createTextNode("สร้างรหัสผ่าน");
formGroupLabel3.appendChild(formGroupLabelText3);
formGroup3.appendChild(formGroupLabel3);
var formGroupInput3 = document.createElement("input");
formGroupInput3.setAttribute('type',"password");
formGroupInput3.setAttribute('name',"name");
formGroupInput3.setAttribute('placeholder',"อย่างน้อย 6 ตัวอักษร");
formGroupInput3.id="inputEmail3";
formGroupInput3.className="form-control";
formGroupInput3.required=true;
formGroup3.appendChild(formGroupInput3);
signupForm.appendChild(formGroup3);

var guestSignUpBtn = document.createElement("button");
guestSignUpBtn.onclick = function () {return submitSignUpForm('signup',callback);}
guestSignUpBtn.className="main_hs_btn viewranks";
guestSignUpBtn.id="createloginBtnMain";
var guestbtntxt=document.createTextNode("สร้างบัญชี");
guestSignUpBtn.appendChild(guestbtntxt);

signupForm.appendChild(guestSignUpBtn);
guestSignUpWrap.appendChild(signupForm);


//add form in
document.getElementById("leaderboard-wrapper").appendChild(guestSignUpWrap);
}

function guestAskLogin(step,callback){
if(step!=1){
document.getElementById("signupFormWrap").remove();
}

var guestSignUpWrap = document.createElement("div");
guestSignUpWrap.id="signupFormWrap";

var signTabs=document.createElement("div");
signTabs.id="tabsButtonWraps";
signTabs.className="logintabs";

var tabBtnLogin = document.createElement("button");
tabBtnLogin.className="tabs_links active";
tabBtnLogin.style.width="50%";
var tabBtnText=document.createTextNode("เข้าสู่ระบบ");
tabBtnLogin.appendChild(tabBtnText);
signTabs.appendChild(tabBtnLogin);

var tabBtnLogin = document.createElement("button");
tabBtnLogin.className="tabs_links";
tabBtnLogin.style.width="50%";
tabBtnLogin.onclick=function(){guestSignUpForm(2,callback);};
var tabBtnText=document.createTextNode("ลงทะเบียนฟรี");
tabBtnLogin.appendChild(tabBtnText);
signTabs.appendChild(tabBtnLogin);
guestSignUpWrap.appendChild(signTabs);

var signupForm = document.createElement("form");
signupForm.id="loginit";
signupForm.onsubmit=function(){return submitSignUpForm('login',callback);};

var formGroup2 = document.createElement("div");
formGroup2.className="form-group";
var formGroupLabel2 = document.createElement("label");
formGroupLabel2.setAttribute('form',"inputEmail2");
var formGroupLabelText2=document.createTextNode("ที่อยู่อีเมลของคุณ");
formGroupLabel2.appendChild(formGroupLabelText2);
formGroup2.appendChild(formGroupLabel2);
var formGroupInput2 = document.createElement("input");
formGroupInput2.setAttribute('type',"email");
formGroupInput2.setAttribute('name',"name");
formGroupInput2.id="inputEmail2";
formGroupInput2.className="form-control";
formGroupInput2.required=true;
formGroup2.appendChild(formGroupInput2);
signupForm.appendChild(formGroup2);

var formGroup3 = document.createElement("div");
formGroup3.className="form-group";
var formGroupLabel3 = document.createElement("label");
formGroupLabel3.setAttribute('form',"inputEmail3");
var formGroupLabelText3=document.createTextNode("รหัสผ่านของคุณ");
formGroupLabel3.appendChild(formGroupLabelText3);
formGroup3.appendChild(formGroupLabel3);
var formGroupInput3 = document.createElement("input");
formGroupInput3.setAttribute('type',"password");
formGroupInput3.setAttribute('name',"name");
formGroupInput3.id="inputEmail3";
formGroupInput3.className="form-control";
formGroupInput3.required=true;
formGroup3.appendChild(formGroupInput3);
signupForm.appendChild(formGroup3);

var guestSignUpBtn = document.createElement("button");
guestSignUpBtn.onclick = function () {return submitSignUpForm('login',callback);}
guestSignUpBtn.className="main_hs_btn viewranks";
guestSignUpBtn.id="createloginBtnMain";
var guestbtntxt=document.createTextNode("เข้าสู่ระบบ");
guestSignUpBtn.appendChild(guestbtntxt);

signupForm.appendChild(guestSignUpBtn);
guestSignUpWrap.appendChild(signupForm);

var loginLink2 = document.createElement('a');
var loginLinkTxt2=document.createTextNode("ลืมรหัสผ่าน?");
loginLink2.style.marginTop="15px";
loginLink2.setAttribute('href', "https://lagged.com/th/help/password/");
loginLink2.setAttribute('target', "_blank");
loginLink2.appendChild(loginLinkTxt2);

guestSignUpWrap.appendChild(loginLink2);

//add form in
document.getElementById("leaderboard-wrapper").appendChild(guestSignUpWrap)
}


function submitSignUpForm(type,responders){
//add "loading" to button
document.getElementById("createloginBtnMain").disabled = true;
var originalTxt=document.getElementById("createloginBtnMain").innerText;
document.getElementById("createloginBtnMain").innerText="กำลังโหลด...";
document.getElementById("createloginBtnMain").className+=" btnloading";
if(document.getElementById("errorsubmit")){
document.getElementById("errorsubmit").remove();
}

var nickname="";
var email="";
var password="";
var errors=false;
var errorMsg=[];

//if login, no need for nickname form
if(type!='login'){
//get nickname here
//check input inputEmail1
if(document.getElementById("inputEmail1")){
nickname=document.getElementById("inputEmail1").value;
}
if(nickname.length<2||nickname.length>30){
errors=true;
errorMsg.push("ชื่อเล่นต้องอยู่ระหว่าง 2-30 ตัวอักษร");
}
}

//get email+password, make sure meets requirements
email=document.getElementById("inputEmail2").value;
if(email.length<5){
errors=true;
errorMsg.push("กรุณาใส่อีเมล์ที่ถูกต้อง");
}
password=document.getElementById("inputEmail3").value;
if(password.length<6||password.length>30){
errors=true;
errorMsg.push("รหัสผ่านต้องมีความยาวระหว่าง 6-30 ตัวอักษร");
}

//ajax type == TYPE
if(!errors){
var sendata={};
sendata.ftype=type;
sendata.fnickname=null;
if(nickname){
sendata.fnickname=encodeURIComponent(nickname.replace(/\"/g,'&quot;'));
}
sendata.femail=encodeURIComponent(email.replace(/\"/g,'&quot;'));
sendata.fpass=encodeURIComponent(password.replace(/\"/g,'&quot;'));
sendata.gid=thisgamegid;

//
// send login / sign up
//
sendAjax(JSON.stringify(sendata), 'ajax.php',  function(response){

  if(response.success===true&&response.uid>0){
  document.getElementById("createloginBtnMain").innerText="ความสำเร็จ!";
  document.getElementById("createloginBtnMain").className+=" btnSuccessMsg";

  //get user profile from JSON
  showUserInfo(response);

  try{
  postMessage('login','*');
  }catch(e){
    console.log(e);
  }

  setTimeout(function(){
  document.getElementById("createloginBtnMain").className="main_hs_btn viewranks btnSuccessMsg";
  fade(document.getElementById("leaderboard-modal"));
  setTimeout(function(){
  	document.getElementById("leaderboard-wrapper").remove();
  	document.getElementById("leaderboard-modal").remove();

  	if(responders){
    try{
      if(responders.rating){
    	  submitRating(responders.rating,true);
    	}
    }catch(e){
      console.log(e);
    }
  	}
  }, 200);
  }, 600);
  }else{
  //if error message, show
  //if success, load high score board as user
  document.getElementById("createloginBtnMain").innerText=originalTxt;
  //document.getElementById("createloginBtnMain").classList.remove("btnloading");
  document.getElementById("createloginBtnMain").className="main_hs_btn viewranks";
  document.getElementById("createloginBtnMain").disabled = false;

  //add errors to form
  var errorMsgDiv = document.createElement("div");
  errorMsgDiv.id="errorsubmit";
  errorMsgDiv.className="error_msg";
  var errorMsgDivTxt=document.createTextNode(response.errors);
  errorMsgDiv.appendChild(errorMsgDivTxt);
  document.getElementById("signupFormWrap").insertBefore( errorMsgDiv,document.getElementById("loginit"));
  }
});
}else{
document.getElementById("createloginBtnMain").innerText=originalTxt;
document.getElementById("createloginBtnMain").classList.remove("btnloading");
document.getElementById("createloginBtnMain").disabled = false;

//add errors to form
var errorMsgDiv = document.createElement("div");
errorMsgDiv.id="errorsubmit";
errorMsgDiv.className="error_msg";
var errorMsgDivTxt=document.createTextNode(errorMsg[0]);
errorMsgDiv.appendChild(errorMsgDivTxt);
document.getElementById("signupFormWrap").insertBefore( errorMsgDiv,document.getElementById("loginit"));
}
return false;
}

//
// mobile menu
//
var mobileMenuOpen=false;
var mobileMenuToggle=function(){
  var menuBtn=document.getElementById('mobilerightnew');

  if(mobileMenuOpen){
    mobileMenuOpen=false;
    menuBtn.className="showmbtn";
    //
    // close menu
    //
    if(document.getElementById('mobilemenu')){
      document.getElementById('mobilemenu').remove();
    }
  }else{
    mobileMenuOpen=true;
    menuBtn.className="menuopen showmbtn";
    //
    // open menu, create div and fill
    //
    var mobileMenu=document.createElement('div');
    mobileMenu.id='mobilemenu';
    var insideHtml='<div class="wrapit"><a class="sitename" href="https://lagged.com/th/" title="Lagged">Lagged</a>'+document.getElementById('gamecontrols').cloneNode(true).innerHTML+'<div class="whitebitbarmob moregamersnt"><h4>เกมเพิ่มเติม</h4>'+document.getElementById('bottomgames').cloneNode(true).innerHTML+'</div></div>';
    mobileMenu.innerHTML=insideHtml;
    document.body.appendChild(mobileMenu);
  }
}

//
// fullscreen the game
//
var isFullscreen=false;
var isFullscreenNew=false;
var toggleFullscreen=function(){
if(!isFullscreenNew){
  isFullscreenNew=true;
  try{
   document.getElementById('game').className="gamearea fullscreen";
   document.getElementById('gamecontrols').className="controls fullscreen";
 }catch(e){
   console.log(e);
  }
    if(mobileMenuOpen){
      mobileMenuToggle();
      var exitFullBtn=document.createElement('div');
      exitFullBtn.id="exitfullscreen";
      exitFullBtn.innerText="Exit";
      exitFullBtn.onclick=function(){
        toggleFullscreen();
      }
      document.body.appendChild(exitFullBtn);
    }
}else{
  isFullscreenNew=false;
  try{
   document.getElementById('game').className="gamearea";
   document.getElementById('gamecontrols').className="controls";
 }catch(e){
   console.log(e);
  }
  if(document.getElementById('exitfullscreen')){
    document.getElementById('exitfullscreen').remove();
  }
}
}

function sendGtagEvent(){
  try{
    gtag('event', 'conversion', {'send_to': 'AW-1055364430/cX1uCOOx4LcBEM6qnvcD'});
  }catch(e){
    console.log(e);
  }
}

function showGameAfterAd(){
console.log("old: show game after ad");
}


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//adds st,nd,rd etc
function ordinal_suffix_of(i) {
if(i>999){
return numberWithCommas(i);
}else if(i>99){
return i;
}
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

function fade(e){var t=1,n=setInterval(function(){t<=.1&&(clearInterval(n),e.style.display="none"),e.style.opacity=t,e.style.filter="alpha(opacity="+100*t+")",t-=.1*t},13)}function htmlEntities(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
var showAward=function(e){
  if(!e.data.show){return;}
  var w=1;
  Q=document,4<++w&&(w=1);var a="achievement_pops_"+w,n=Q.createElement("div");n.id="achievementPopWrap",n.className=a,n.onclick=function(){Q.getElementsByClassName(a)[0].remove()};var r="บันทึกความสำเร็จแล้ว";1<e.data.achdata.acount&&(r=e.data.achdata.acount+" บันทึกแล้ว");
  var d=document.createElement("div");d.className="achievement_title";var i=document.createTextNode(r);d.appendChild(i),n.appendChild(d);var o=document.createElement("div");o.className="achievement_desc";var l=document.createTextNode(e.data.achdata.name);o.appendChild(l),n.appendChild(o);var s=document.createElement("div");s.className="achievement_xp";
  var c=document.createTextNode("+"+e.data.achdata.points+"xp");if(s.appendChild(c),n.appendChild(s),Q.body.appendChild(n))try{newLevel(e.data)}catch(e){console.log(e)}setTimeout(function(){Q.getElementsByClassName(a)[0]&&(p(Q.getElementsByClassName(a)[0]),w--,setTimeout(function(){Q.getElementsByClassName(a)[0]&&Q.getElementsByClassName(a)[0].remove()},200))},4e3);
  }
var showHighscore=function(e){

  if(document.getElementById("leaderboard-loading")){
    document.getElementById("leaderboard-loading").remove();
  }
//to do, show award pop up
  console.log('to do show high score board: ', e);
  var Q=document;
  var a={success:!0};e&&!0===e.success?(hsData=e,function(){Y=0,!(G=J=!1);var e=document.createElement("div");e.id="leaderboard-wrapper";var t=Math.max(document.documentElement.clientHeight,window.parent.innerHeight||0),a=window.parent.innerWidth;710<t?e.setAttribute("style","margin:calc(("+t+"px - 710px)/2) 0 0 calc((100vw - 688px)/2);"):e.setAttribute("style","height:"+t+"px;margin:0 0 0 calc((100vw - 688px)/2);"),599<a&&a<769&&719<t?e.setAttribute("style","margin:calc("+t+"px/2 - 355px) 0 0;"):a<601&&e.setAttribute("style","margin:0;height:100%"),a<1205&&t<501&&e.setAttribute("style","margin:0;height:100%");var n=document.createElement("div");n.id="leaderboard-wrapper-header";var r=document.createElement("button");r.onclick=function(){document.getElementById("leaderboard-wrapper")&&Q.getElementById("leaderboard-wrapper").remove(),Q.getElementById("leaderboard-modal")&&(Q.getElementById("leaderboard-modal").onclick="",Q.getElementById("leaderboard-modal").remove()),!1},r.id="leaderboard-header-button";var d=document.createElement("a");d.setAttribute("href","https://lagged.com/th"),d.setAttribute("target","_blank"),d.id="headerlogolink";var o=document.createElement("div");if(o.id="score-circle",o.className="leaderboard-circle",n.appendChild(r),n.appendChild(d),e.appendChild(n),hsData.data&&!hsData.data.login){(c=document.createElement("div")).className="yourscore_txtdiv",m=document.createTextNode("คะแนนสูงของคุณ"),c.appendChild(m),(p=document.createElement("div")).className="finalscore_divtxt",u=document.createTextNode(numberWithCommas(hsData.data.utop.score)),p.appendChild(u),o.appendChild(c),o.appendChild(p),e.appendChild(o);var l=document.createElement("div");l.className="signup_txti";(g=document.createElement("button")).onclick=function(){!function(){if(0<hsData.data.gamedata.id){showLeaderLoader();var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState&&200==this.status){S();var e=this.responseText;e=e.replace(")]}',",""),e=JSON.parse(e),hsData.data.scoredata=e.data.scoredata,function e(t,a){if("leader"===t&&a?(Q.getElementById("score-circle").remove(),Q.getElementsByClassName("signup_txti")[1].remove(),Q.getElementsByClassName("signup_txti")[0].remove(),Q.getElementsByClassName("moregames_wrapper")[0].remove(),Q.getElementsByClassName("main_hs_btn")[0].remove(),Q.getElementById("headerlogolink").remove()):Q.getElementById("leaderboardRankingWrap").remove(),a){var n=document.createElement("div");n.className="gameThumbTitleWrap";var r=document.createElement("a");r.setAttribute("href","https://lagged.com/th/th/g/"+hsData.data.gamedata.url_key),r.setAttribute("title",hsData.data.gamedata.name),r.setAttribute("target","_blank"),n.appendChild(r);var d=document.createElement("img");d.setAttribute("src","https://imgs2.dab3games.com/"+hsData.data.gamedata.thumb),d.setAttribute("alt",hsData.data.gamedata.name),d.setAttribute("width","200"),d.setAttribute("height","200"),r.appendChild(d);var o=document.createElement("div");r.appendChild(o),m=document.createTextNode(hsData.data.gamedata.name),o.appendChild(m),Q.getElementById("leaderboard-wrapper-header").appendChild(n)}var l=document.createElement("div");l.id="leaderboardRankingWrap";var s=document.createElement("div");s.id="tabsButtonWraps";var c=document.createElement("button");c.style.width="50%";c.onclick=function(){e("leader",!1)},c.className="leader"===t?"tabs_links active":"tabs_links";var m=document.createTextNode("ลีดเดอร์บอร์ด");c.appendChild(m);

  var g=document.createElement("button");g.style.width="50%";g.onclick=function(){e("share",!1)},g.className="share"===t?"tabs_links active":"tabs_links";var h=document.createTextNode("แบ่งปัน");if(g.appendChild(h),s.appendChild(c),s.appendChild(g),l.appendChild(s),"leader"===t||"friend"===t){X=V=0,K=-99999;var v=document.createElement("div");"friend"===t?v.className="leaderboardRankinsRrap friendWrap":(v.id="leaderboardScrollDiv",v.className="leaderboardRankinsRrap");var b=Math.max(document.documentElement.clientHeight,document.innerHeight||0),E=document.innerWidth;b<711&&v.setAttribute("style","height:calc("+b+"px - 214px);"),E<601&&v.setAttribute("style","height:calc("+b+"px - 214px);");var f=document.createElement("div");f.className="leaderboardTopTreWrap";var C=hsData.data.scoredata;for("friend"===t&&(C=hsData.data.frndboard),i=0;i<C.length;i++){X++,C[i].scores!=K&&(V=X,K=C[i].scores),k="default-avatar.jpg",C[i].avatar&&(k=C[i].avatar);var y=document.createElement("div");if(i<3){0===i?y.className="leaderboardTopTre leaderboardUserTop3First":1===i?y.className="leaderboardTopTre leaderboardUserTop3Second":y.className="leaderboardTopTre leaderboardUserTop3Third";var w=document.createElement("div");w.className="topThreeWrap",(B=document.createElement("div")).className="leaderboardRowRank",x=document.createTextNode(V),B.appendChild(x);

// var supscpt=document.createElement("sup");var supscptText=document.createTextNode("o");supscpt.appendChild(supscptText);B.appendChild(supscpt);

  w.appendChild(B),(L=document.createElement("a")).setAttribute("href","https://lagged.com/th/profile/"+C[i].uid),L.setAttribute("target","_blank"),(I=document.createElement("img")).setAttribute("src","https://lagged.com/images/avatars/"+k),I.setAttribute("width","100"),I.setAttribute("height","100"),L.appendChild(I),w.appendChild(L),y.appendChild(w),(A=document.createElement("div")).className="leaderRowUsernameTop";var N=document.createElement("a");N.setAttribute("href","https://lagged.com/th/profile/"+C[i].uid),N.setAttribute("target","_blank"),T=document.createTextNode(htmlEntities(C[i].username)),N.appendChild(T),A.appendChild(N),y.appendChild(A),(_=document.createElement("div")).className="leaderboardRowScore",S=document.createTextNode(numberWithCommas(C[i].scores)),_.appendChild(S),y.appendChild(_)}else{y.className="leaderboardUserRowWrap",(B=document.createElement("div")).className="leaderboardRowRank",x=document.createTextNode(V),B.appendChild(x);

// var supscpt=document.createElement("sup");var supscptText=document.createTextNode("o");supscpt.appendChild(supscptText);B.appendChild(supscpt);

  y.appendChild(B),(L=document.createElement("a")).setAttribute("href","https://lagged.com/th/profile/"+C[i].uid),L.setAttribute("target","_blank"),(I=document.createElement("img")).setAttribute("src","https://lagged.com/images/avatars/"+k),I.setAttribute("width","100"),I.setAttribute("height","100"),L.appendChild(I);var A=document.createElement("div"),T=document.createTextNode(htmlEntities(C[i].username));A.appendChild(T),L.appendChild(A),y.appendChild(L),(_=document.createElement("div")).className="leaderboardRowScore",S=document.createTextNode(numberWithCommas(C[i].scores)),_.appendChild(S),y.appendChild(_)}i<3?(f.appendChild(y),v.appendChild(f)):v.appendChild(y)}if("leader"===t&&(v.onscroll=function(){!function(e,u,g,h){var t=Q.getElementById("leaderboardScrollDiv");if(t.scrollTop+t.offsetHeight>=t.scrollHeight&&!G&&!J){if(G)return;var v=document.createElement("div");v.id="newScoresLoading",Q.getElementById("leaderboardScrollDiv").appendChild(v),Y++,G=!0;var a=new XMLHttpRequest;a.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var e=this.responseText;if(e=e.replace(")]}',",""),e=JSON.parse(e),V=u,X=g,K=h,e.success){e.isfinished&&(J=!0);var t=e.scoredata;for(hsData.data.scoredata=hsData.data.scoredata.concat(t),i=0;i<t.length;i++){X++,t[i].scores!=K&&(V=X,K=t[i].scores);var a="default-avatar.jpg";t[i].avatar&&(a=t[i].avatar);var n=document.createElement("div");n.className="leaderboardUserRowWrap";var r=document.createElement("div");r.className="leaderboardRowRank";var d=document.createTextNode(V);r.appendChild(d);

// var supscpt=document.createElement("sup");var supscptText=document.createTextNode("o");supscpt.appendChild(supscptText);r.appendChild(supscpt);

  n.appendChild(r);var o=document.createElement("a");o.setAttribute("href","https://lagged.com/th/profile/"+t[i].uid),o.setAttribute("target","_blank");var l=document.createElement("img");l.setAttribute("src","https://lagged.com/images/avatars/"+a),l.setAttribute("width","100"),l.setAttribute("height","100"),o.appendChild(l);var s=document.createElement("div"),c=document.createTextNode(htmlEntities(t[i].username));s.appendChild(c),o.appendChild(s),n.appendChild(o);var m=document.createElement("div");m.className="leaderboardRowScore";var p=document.createTextNode(numberWithCommas(t[i].scores));m.appendChild(p),n.appendChild(m),Q.getElementById("leaderboardScrollDiv").appendChild(n)}}else J=!0,console.log(e.errors);G=!1,v.remove()}};var n={ftype:"loadmorehs"};n.countr=Y,n.boardid=parseInt(e,10)||0,a.open("POST","//lagged.com/th/api/ajax.php",!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.send("ftype="+n.ftype+"&countr="+Y+"&boardid="+n.boardid),5===Y&&(J=!0)}}(hsData.data.gamedata.id,V,X,K)}),l.appendChild(v),"leader"===t){var k="default-avatar.jpg";hsData.data.gamedata.avatar&&(k=hsData.data.gamedata.avatar),(D=document.createElement("div")).className="leaderboardUserRowWrap leaderboardBestScoreBottom";(L=document.createElement("a")).setAttribute("href","https://lagged.com/th/profile/"+hsData.data.gamedata.uid),L.setAttribute("target","_blank");var I=document.createElement("img");I.setAttribute("src","https://lagged.com/images/avatars/"+k),I.setAttribute("width","100"),I.setAttribute("height","100"),L.appendChild(I),A=document.createElement("div"),T=document.createTextNode(htmlEntities(hsData.data.gamedata.username)),A.appendChild(T),L.appendChild(A),D.appendChild(L);var _=document.createElement("div");_.className="leaderboardRowScore";var S=document.createTextNode(numberWithCommas(hsData.data.utop.score));_.appendChild(S),D.appendChild(_),l.appendChild(D)}else if("friend"===t){var D=document.createElement("div");D.className="leaderboardUserRowWrap leaderboardBestScoreBottom friendsinvitebottom";var M=document.createElement("div");M.className="invitethefriends",R=document.createTextNode("สนุกกับการเล่นกับเพื่อนของคุณมากขึ้น!"),M.appendChild(R),D.appendChild(M);var L=document.createElement("a");L.setAttribute("href","https://lagged.com/th/invite"),L.setAttribute("target","_blank"),L.className="main_hs_btn inviteFriendsLink";var R=document.createTextNode("เชิญเพื่อนของคุณ");L.appendChild(R),D.appendChild(L),l.appendChild(D)}}else{var F=document.createElement("div");F.className="signup_txti headeronform";var W=document.createTextNode("คะแนนของคุณ: "+numberWithCommas(hsData.data.utop.score)+"!");F.appendChild(W),l.appendChild(F);var P=document.createElement("a"),H=document.createTextNode("แบ่งปันสิ่งนี้!");P.className="shareitlink facebook",P.setAttribute("href","https://www.facebook.com/dialog/share?app_id=614526822036983&display=popup&href=https%3A%2F%2Flagged.com/th%2Fth%2Fg%2F"+encodeURIComponent(hsData.data.gamedata.url_key)+"&quote=ได้คะแนน%20"+numberWithCommas(hsData.data.utop.score)+"%20ใน%20"+encodeURIComponent(hsData.data.gamedata.name)+"!&redirect_uri=https%3A%2F%2Flagged.com/th%2Fth%2Fg%2F"+encodeURIComponent(hsData.data.gamedata.url_key)),P.setAttribute("target","_blank"),P.appendChild(H);var O=document.createElement("a"),U=document.createTextNode("Tweet!");O.className="shareitlink twitter",O.setAttribute("href","https://twitter.com/intent/tweet?text=ได้คะแนน%20"+numberWithCommas(hsData.data.utop.score)+"%20ใน%20"+encodeURIComponent(hsData.data.gamedata.name)+"%20https%3A%2F%2Flagged.com/th%2Fes%2Fg%2F"+encodeURIComponent(hsData.data.gamedata.url_key)+"&source=webclient"),O.setAttribute("target","_blank"),O.appendChild(U),l.appendChild(P),l.appendChild(O)}Q.getElementById("leaderboard-wrapper").appendChild(l)}("leader",!0)}else 4==this.readyState&&(S(),alert("Error loading leaderboard"))};var t={};t.board=hsData.data.gamedata.id,t.sorder=hsData.data.gamedata.score_order,e.open("POST","//lagged.com/th/api/ajax_hs2_p2.php",!0),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.send("data="+JSON.stringify(t))}}()},g.className="main_hs_btn viewranks",h=document.createTextNode("ดูคะแนนสูง"),g.appendChild(h),e.appendChild(l),e.appendChild(g)}else{(o=document.createElement("div")).id="guestscorecircle";var c=document.createElement("div");c.className="yourscore_txtdiv";var m=document.createTextNode("บันทึกของคุณ");c.appendChild(m);var p=document.createElement("div");p.className="finalscore_divtxt";var u=document.createTextNode(numberWithCommas(hsData.data.topscore));p.appendChild(u),o.appendChild(c),o.appendChild(p),e.appendChild(o);var g=document.createElement("button");g.onclick=function(){askLogin();}

      g.className="main_hs_btn guestsubmitmainhs";var h=document.createTextNode("ส่งคะแนนสูง");g.appendChild(h),e.appendChild(g);var v=document.createElement("a");v.onclick=function(){try{openLeaderboards()}catch(e){console.log(e)}}

      v.className="viewleaderguest";var b=document.createElement("img");b.setAttribute("src","https://imgs2.dab3games.com/highscore-games-icon.jpg"),b.setAttribute("alt","icon"),b.setAttribute("width","40"),b.setAttribute("height","40"),v.appendChild(b);var E=document.createTextNode("คณะผู้นำ");v.appendChild(E),e.appendChild(v)}var f=document.createElement("div");hsData.data.login?f.className="popmoregameswrap":f.className="popmoregameswrap userrbpop";var C=document.createElement("div");C.className="signup_txti moregametxt guessmoregmtxt",hsData.data.login||(C.className="signup_txti moregametxt");var y=document.createTextNode("เกมอื่น ๆ");C.appendChild(y),f.appendChild(C);var w=jsMoreGames,N=document.createElement("div");N.className="moregames_wrapper guestmoregames";var A=10;for(hsData.data.login||(A=5,N.className="moregames_wrapper"),i=0;i<A;i++){var T=document.createElement("div");T.className="thumbWrapper";var k=document.createElement("div"),B=document.createElement("a");
  if(w[i].io==1){
  B.setAttribute("href","https://lagged.com/th/io/"+w[i].url_key);
  }else{
  B.setAttribute("href","https://lagged.com/th/th/g/"+w[i].url_key);
  }
  B.setAttribute("title",w[i].name),B.setAttribute("target","_blank");var x=document.createTextNode(w[i].name);B.appendChild(x);var I=document.createElement("img");I.setAttribute("src","https://imgs2.dab3games.com/"+w[i].thumb),I.setAttribute("alt",w[i].name),I.setAttribute("width","200"),I.setAttribute("height","200"),k.appendChild(B),k.appendChild(I),T.appendChild(k),N.appendChild(T)}f.appendChild(N),e.appendChild(f),document.body.appendChild(e),S(),hsData.data&&hsData.data.login?console.log('2'):console.log('1')}()):(S(),Q.getElementById("leaderboard-modal").remove(),alert("Error: Could not save high score!"),console.log(e),a.success=!1,a.errormsg="Error: Could not save high score!");
}

window.addEventListener("message", function(event) {
  if (event.origin !== 'https://lagged.com'&&event.origin !== 'http://lagged.com'&&event.origin !== 'http://lagged.com/th'&&event.origin !== 'https://lagged.com/th') {
    return;
  }
var messData = event.data.split('|');
var messageType=messData[0];
if(messageType==="apiAds"){


  var finishedAd=false;
  interShow(function(response) { if(!finishedAd){finishedAd=true;
  try{
   gtag('event', 'conversion', {'send_to': 'AW-1055364430/jAMRCPiygoACEM6qnvcD'});
  }catch(e){
    console.log(e);
  } }});


}else if(messageType==="apiShow"){
  try{
    if(document.getElementById('minividbtnnewl')){
      document.getElementById('minividbtnnewl').className="showittomob showit";
    }
    if(document.getElementById('mobilerightnew')){
      document.getElementById('mobilerightnew').className="showmbtn";
    }
    if(document.getElementById('gameplug')){
      document.getElementById('gameplug').style.display="block";
    }
    if(document.getElementById('exitfullscreen')){
      document.getElementById('exitfullscreen').style.display="block";
    }
  }catch(e){
    console.log(e);
  }
}else if(messageType==="apiHide"){
  try{
    if(document.getElementById('minividbtnnewl')){
      document.getElementById('minividbtnnewl').className="showittomob";
    }
    if(document.getElementById('mobilerightnew')){
      document.getElementById('mobilerightnew').className="";
    }
    if(document.getElementById('gameplug')){
      document.getElementById('gameplug').style.display="none";
    }
    if(document.getElementById('exitfullscreen')){
      document.getElementById('exitfullscreen').style.display="none";
    }
  }catch(e){
    console.log(e);
  }
}else if(messageType==="walkthrough"){
var messageData=messData[1];
try{
  viewPlaythrough(messageData);
}catch(e){
  console.log(e);
}
}else if(messageType==="awards"){
var messageData=messData[1];
var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==this.readyState&&200==this.status)e=(e=this.responseText).replace(")]}',",""),e=JSON.parse(e),showAward(e);else if(4==this.readyState){console.log('achievement save error');}};
var o="//lagged.com/th/api/ajax_award.php";i.open("POST",o,!0),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send("type=award&action=award&data="+messageData);
}else if(messageType==="openAwards"){
  try{
    openAwards();
  }catch(e){
    console.log(e);
  }
}else if(messageType==="savescore"){
var messageData=messData[1];
startLoader();
var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==this.readyState&&200==this.status)e=(e=this.responseText).replace(")]}',",""),e=JSON.parse(e),showHighscore(e);else if(4==this.readyState){console.log('high score save error');}};
var o="//lagged.com/th/api/ajax_hs2_p1.php";i.open("POST",o,!0),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send("type=highscore&action=save&data="+messageData);
}else if(messageType==="loadscores"){
try{
openLeaderboards();
}catch(e){
  console.log(e);
}
}
});

function fade(element) {
var op = 1;  // initial opacity
var timer = setInterval(function () {
   if (op <= 0.1){
       clearInterval(timer);
       element.style.display = 'none';
   }
   element.style.opacity = op;
   element.style.filter = 'alpha(opacity=' + op * 100 + ")";
   op -= op * 0.1;
}, 13);
}

function p(e){var t=1;a=setInterval(function(){if(t<=.1){clearInterval(a);try{e.style.display="none"}catch(e){console.log(e)}}try{e.style.opacity=t,e.style.filter="alpha(opacity="+100*t+")"}catch(e){console.log(e)}t-=.1*t},13)}
function z(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}

Element.prototype.remove=function(){this.parentElement.removeChild(this)},NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var e=this.length-1;e>=0;e--)this[e]&&this[e].parentElement&&this[e].parentElement.removeChild(this[e])};
