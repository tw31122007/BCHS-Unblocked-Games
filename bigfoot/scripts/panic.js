

    console.warn(
        "%cREAD ME!",
        "color: black; font-weight: 600; background: yellow; padding: 0 5px; border-radius: 5px",
        "If you know html, css, js, or just know a ton of games, we might be able to add you to our dev team! We have tons of benefits, including custom graphics for your website/logos, etc. All the graphics are custom, except for the bigfoot in our logo. Im not that good at detials lol. We also need people to add thumbnails to our main page. As you can probably tell, we need some help. If you are just trying to steal my games, they are on github. Just give me credit if you use my code (like the array code). I can tell if you steal it btw. Anyway have a good day :)"
      );
      var win;
      var link= "../g/glanding.html";

  
       

       
      
//
const getCode = (e) => {
  e = e || window.event;
  return e.key;
};
const handleKeyPress = (e) => {
  const key = getCode(e);
  if (key == 5) {
    const btn = document.getElementById('iframe');

    const el = document.getElementById('maincode');
    

      if (el.style.display === 'none') {
        el.style.display = 'block';
        btn.style.display = 'none';
        applyUrl('https://bgs.pages.dev/images/logonew.png', "Bigfoot's Game Shack");

      } 
      
      else {
        applyUrl('https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico', 'Class notes - Google Docs');

        el.style.display = 'none';
        btn.style.display = 'block';

      }
    console.log(`Number ${key} was pressed!`);
  }
};
const handleKeyPress1 = (e) => {
  const key = getCode(e);
  if (key == 1) {
    const btn = document.getElementById('iframe1');

    const el = document.getElementById('maincode');
    

      if (el.style.display === 'none') {
        el.style.display = 'block';
        btn.style.display = 'none';
        applyUrl('https://bgs.pages.dev/images/logonew.png', "Bigfoot's Game Shack");

      } 
      
      else {
        applyUrl('https://storage.googleapis.com/operating-anagram-8280/favicon-32x32.png', 'Math Practice | Google Search');

        el.style.display = 'none';
        btn.style.display = 'block';

      }
    console.log(`Number ${key} was pressed!`);
  }
};
const handleKeyPress2 = (e) => {
  const key = getCode(e);
  if (key == 2) {
    blank3();
    console.log(`Number ${key} was pressed!`);
  }
};
const handleKeyPress3 = (e) => {
  const key = getCode(e);
  if (key == 3) {
    opensettings();
    console.log(`Number ${key} was pressed!`);
  }
};
const handleKeyPress4 = (e) => {
  const key = getCode(e);
  if (key == 4) {
    var url = prompt("about:blank tab cloaker! Enter URL Here (example: https://google.com)");if (url == null) {alert('No URL Entered!')} else {location.href="gfiles/gfiles/lanucher/index.html?url="+url;}
    console.log(`Number ${key} was pressed!`);
  }
};
document.addEventListener("keypress", handleKeyPress);
document.addEventListener("keypress", handleKeyPress3);
document.addEventListener("keypress", handleKeyPress1);
document.addEventListener("keypress", handleKeyPress2);
document.addEventListener("keypress", handleKeyPress4);


//opensettings()

