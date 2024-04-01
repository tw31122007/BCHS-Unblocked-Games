document.addEventListener("DOMContentLoaded", function() {
    var allowedDomains = [
      'alegithomeworksite.com.au', 'alegithomeworksite.eu.org', 'alegithomeworksite.online',
      'bchsubl0ckedgxmes.co.uk', 'bchsubl0ckedgxmes.uk', 'defnotgxmes.ink',
      'desmoscalc.me', 'elephantmunchingcontest.com.au', 'elephantmunchingcontest.site',
      'elephantmunchingcontest.tech', 'geologyrocks.com.au', 'imrunningoutofideas.com.au',
      'imrunningoutofideas.online', 'notapr0xy.com.au', 'notapr0xy.online',
      'pizzafuneral.com.au', 'pizzafuneral.online', 'pizzafuneral.site', 'pizzafuneral.store',
      'pizzafuneral.xyz', 'probnotschoolwork.ink', 'thefastestturtle.online',
      'the-toaster-is-a.ninja', 'thisisatotallylegithomeworkwebsite.com.au',
      'thisisatotallylegithomeworkwebsite.online', 'tylerisawesome.co.uk', 'tylerisawesome.uk',
      'uc5ntb10ckm3.com.au', 'uc5ntb10ckm3.online', 'thefastestlearner.com.au',
      'thefastestlearner.online', 'thefastestlearner.store', 'thefastestlearner.xyz',
      'schoolisawesome.online'
    ];

    var link = document.getElementById("movieWebLink");
    var currentDomain = window.location.hostname;
    var newDomain = allowedDomains.includes(currentDomain) ? currentDomain : "notapr0xy.com.au";
    var newHref = link.href.replace("notapr0xy.com.au", newDomain);
    link.href = newHref;
  });
  document.getElementById("image").style="background-image: url('" + localStorage.getItem('app-image') + "')";
        document.getElementById("appname").innerHTML = localStorage.getItem('app-name')

        var appImage = localStorage.getItem('app-image');
        var appName = localStorage.getItem('app-name');
        var recentActivityElement = document.querySelector(".recent .activity");
    
        if (appImage && appName && storedURL) {
            imageElement.style.backgroundImage = "url('" + appImage + "')";
            appNameElement.innerHTML = appName;
            recentActivityElement.onclick = openlastpage;
            recentActivityElement.parentNode.style.display = 'block';
        } else {
            recentActivityElement.parentNode.style.display = 'none';
        }