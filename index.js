particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 355,
      "density": {
        "enable": true,
        "value_area": 789.1476416322727
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.48927153781200905,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 0.2,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 2,
        "size_min": 0,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 0.2,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 83.91608391608392,
        "size": 1,
        "duration": 3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

window.goToUvPage = function(url, method) {
  window.navigator.serviceWorker.register('./sw.js', {
    scope: __uv$config.prefix
  }).then(() => {
    if (method == "iframe") {
      window.detectIframeChanges = true;
      var frame = document.querySelector("main iframe");
      vertbar.style.animation = "slideIn 2s backwards";
      vertbar.style.zIndex = "12";
      vertbar.style.left = "-900px";
      frame.focus();
      frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
      frame.style.width = "100%";
      frame.style.right = "0px";
      frame.style.left = "0px";
      frame.style.top = "50px";
      frame.style.bottom = "0px";
      frame.style.height = "calc(100% - 50px)";
    } else {
      window.location.assign(__uv$config.prefix + __uv$config.encodeUrl(url));
    }
  });
}

window.alert = (message, color, callback) => {
  if (!color) color = "#262626";
  var alertBox = document.createElement("div");

  alertBox.style = `
  animation-duration: 0.0001s;
  animation-name: show;
  animation-iteration-count: 1;
  animation-direction: alternate;`

  alertBox.style.backgroundColor = color;
  alertBox.innerHTML = `<p>${message}</p>`;
  alertBox.className = "alert";

  const dissapear = (e, t) => {
    
    var element = e.target;
    if (!e == "") {
      if (e.target.nodeName = "p") {
        element = e.target.parentElement;
      }
      element.style.animation = "0s 1 alternate slideOut";
      callback();
    } else {
      element = t;
      element.style.animation = `0s 1 alternate slideOut`;
    }

    setTimeout(() => { element.remove(); }, 3000);
  };

  setTimeout(() => { dissapear("", alertBox) }, 15000);

  alertBox.addEventListener("click", dissapear);

  document.querySelector(".alertBox").appendChild(alertBox);
};

function main() {
 /* var apps = document.querySelector(".navbar").childNodes;

  apps.forEach(app => {
    app.addEventListener("click", (e) => {
      var id = e.target.getAttribute("src").split("images/")[1].split(".")[0];
      var route = id + ".html";
      if (id == "index") route = "/";
      window.location.assign(route);
    });
  });*/

  if (window.self == window.top) {
    const openAb = () => {
      const win = window.open("about:blank", "_blank");
      const winDoc = win.document;
      var iframe = winDoc.createElement("iframe");
      iframe.src = location.origin;
      iframe.style = "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;";
      winDoc.body.appendChild(iframe);
      winDoc.close();
      
    }
    window.alert("Click this alert to go into about:blank", null, openAb);
  }

}

main();


const form = document.querySelector('form');
const input = document.querySelector('input');

form.addEventListener('submit', async event => {
  event.preventDefault();
  window.navigator.serviceWorker.register('./sw.js', {
    scope: __uv$config.prefix
  }).then(() => {
    let url = input.value.trim();
    if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
    else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;


    window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
  });
});

function isUrl(val = '') {
  if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
  return false;
};



