console.log('Made by Bigfoot9999')
function blank3(){
    let inFrame
    
    try {
        inFrame = window !== top
    } catch (e) {
        inFrame = true
    }
    
    if (!inFrame && !navigator.userAgent.includes("Firefox")) {
        const popup = open("about:blank", "_blank")
        if (!popup || popup.closed) {
            alert("Popups are disabled!")
        } else {
            const doc = popup.document
            const iframe = doc.createElement("iframe")
            const style = iframe.style
            const link = doc.createElement("link")
    
            doc.title = "bigfootshack.pages.dev"
            link.rel = "icon";
            link.href = "https://raw.githubusercontent.com/BigfootsGS/BigfootsGS.github.io/main/images/favicon.ico";
            iframe.src = location.href
            style.position = "fixed"
            style.top = style.bottom = style.left = style.right = 0
            style.border = style.outline = "none"
            style.width = style.height = "100%"
    
            doc.body.appendChild(iframe)
            //location.replace("https://google.com")
        }
    }
    //made by Bigfoot9999
    function clockTime(){
        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59
        var session = "AM";
        
        if(h == 0){
            h = 12;
        }
        
        if(h > 12){
            h = h - 12;
            session = "PM";
        }
        
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        
        var time = h + ":" + m + ":" + s + " " + session;
        document.getElementById("MyClock").innerText = time;
        document.getElementById("MyClock").textContent = time;
        
        setTimeout(clockTime, 1000);
        
    };
    
    
    clockTime();
    
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          const exploit = document.getElementById('exploit').value;
          const siteload = window.open('about:blank', '_blank');
          const doc1 = siteload.document;
          const iframe1 = doc1.createElement('iframe');
          const style1 = iframe1.style;
          const link1 = doc1.createElement('link');
          
          doc1.title = 'Google Drive';
          iframe1.src = exploit;
          style1.position = 'fixed';
          style1.border = style1.outline = 'none';
          style1.top = style1.bottom = style1.left = style1.right = 0;
          style1.width = style1.height = '100%';
    
          link1.rel = 'icon';
          link1.href = 'https://raw.githubusercontent.com/BigfootsGS/BigfootsGS.github.io/main/images/favicon.ico';
          
          doc1.body.appendChild(iframe1);
        }
    });
    }
function blank(){
let inFrame

try {
    inFrame = window !== top
} catch (e) {
    inFrame = true
}

if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    const popup = open("about:blank", "_blank")
    if (!popup || popup.closed) {
        alert("Popups are disabled!")
    } else {
        const doc = popup.document
        const iframe = doc.createElement("iframe")
        const style = iframe.style
        const link = doc.createElement("link")

        doc.title = "Bigfoot's Game Shack"
        link.rel = "icon";
        link.href = "https://raw.githubusercontent.com/BigfootsGS/BigfootsGS.github.io/main/images/favicon.ico";
        iframe.src = location.href
        style.position = "fixed"
        style.top = style.bottom = style.left = style.right = 0
        style.border = style.outline = "none"
        style.width = style.height = "100%"

        doc.body.appendChild(iframe)
        location.replace("https://google.com")
    }
}
//made by Bigfoot9999
function clockTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClock").innerText = time;
    document.getElementById("MyClock").textContent = time;
    
    setTimeout(clockTime, 1000);
    
};


clockTime();

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const exploit = document.getElementById('exploit').value;
      const siteload = window.open('about:blank', '_blank');
      const doc1 = siteload.document;
      const iframe1 = doc1.createElement('iframe');
      const style1 = iframe1.style;
      const link1 = doc1.createElement('link');
      
      doc1.title = 'Google Drive';
      iframe1.src = exploit;
      style1.position = 'fixed';
      style1.border = style1.outline = 'none';
      style1.top = style1.bottom = style1.left = style1.right = 0;
      style1.width = style1.height = '100%';

      link1.rel = 'icon';
      link1.href = 'https://raw.githubusercontent.com/BigfootsGS/BigfootsGS.github.io/main/images/favicon.ico';
      
      doc1.body.appendChild(iframe1);
    }
});
}

//detect iframe first
var txt;
if (window.frameElement) {
    //yes i frame SO DONT DO ANYTHING because we already asked
   
}
else {
    //no iframe we should ask them
    promptalert();
}



//alert
