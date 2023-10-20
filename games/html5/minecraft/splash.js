var splashCacheAll;
var splashCache;

async function randomSay() {

  if (splashCache) {

    if (!splashCache.length) {
      splashCache = splashCacheAll;
    }

    var says = splashCache;
  } else {

    var say = await fetch("./splashes.json");
    var says = await say.json();

    splashCacheAll = says;
    splashCache = says;
  }


  var getRandomSay = says[Math.floor(Math.random() * says.length)];


  splashCache = splashCache.filter((splash) => splash !== getRandomSay);


  return getRandomSay;
}


async function setRandomSay() {
 
  var randomSplash = await randomSay();


  if (randomSplash == "%REAL_IP%") {
    var ips = await getIPs();
    if (ips[0]) {
      randomSplash = "Your real IP is " + ips[0];
    } else {
      randomSplash = "Cannot get your real IP :(";
    }
  }

  else if (randomSplash == "%SPLASH_NUMBER%") {
    randomSplash = "There are " + splashCacheAll.length + " of these messages!";
  }


  document.querySelector(".splash").innerText = randomSplash;
	if(randomSplash.length > 20){
		$(".splash").addClass("bigtext");
	}else if (randomSplash.length < 7){
		$(".splash").addClass("smalltext");
	}
}


if (document.querySelector(".splash")) {
  setRandomSay();
}