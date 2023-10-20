(function() {
  let onpageLoad = localStorage.getItem("theme") || "";
  let element = document.body;
  element.classList.add(onpageLoad);
  document.getElementById("theme").textContent =
    localStorage.getItem("theme") || "light";
})();

function darkmode_toggle() {
  let element = document.body;
  element.classList.toggle("dark-mode");

  let theme = localStorage.getItem("theme");
  if (theme && theme === "dark-mode") {
    localStorage.setItem("theme", "");
  } else {
    localStorage.setItem("theme", "dark-mode");
  }
}



function comment_control(){
	let theme = localStorage.getItem("theme");
	
	var cisrc=document.getElementsByClassName('giscus-frame')[0].src;
	console.log(cisrc);
	
	console.log(theme);
  if (theme && theme === "dark-mode") {
	  cisrc = cisrc.replace("preferred_color_scheme", "dark");
  } else {
	  cisrc = cisrc.replace("dark", "preferred_color_scheme");
  }
	
	console.log(cisrc);
	
	document.getElementsByClassName('giscus-frame')[0].src = cisrc;
	/*if (cisrc.includes("preferred_color_scheme")) {
	  cisrc = cisrc.replace("preferred_color_scheme", "dark");
	} else if (cisrc.includes("dark")) {
	  cisrc = cisrc.replace("dark", "preferred_color_scheme");
	}
	console.log(cisrc);
	document.getElementsByClassName('giscus-frame')[0].src = cisrc;
	*/
	
	
	document.getElementsByClassName('giscus-frame')[0].contentWindow.location.reload();
	var stop=true;

}