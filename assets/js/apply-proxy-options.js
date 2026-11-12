(function () {
  if (typeof proxyEnabled === "undefined" || proxyEnabled !== false) return;

  var search = document.getElementById("uv-form");
  if (search) search.style.display = "none";

  var apps = document.querySelector(".box-container");
  if (apps) apps.style.display = "none";

  var proxied = document.querySelectorAll('a[href*="games/proxied/"]');
  for (var i = 0; i < proxied.length; i++) {
    proxied[i].style.display = "none";
  }

  var fallbacks = document.querySelectorAll(".proxy-fallback");
  for (var j = 0; j < fallbacks.length; j++) {
    fallbacks[j].style.display = "";
  }
})();
