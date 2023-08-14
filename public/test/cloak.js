function cloak() {
    if (localStorage.getItem('cloaker')) {
      function favicon(src) {
        let link = document.createElement('link')
        let oldLink = document.getElementById('dynamic-fav');
      
        link.id = 'dynamic-fav';
        link.rel = 'shortcut icon';
        link.href = src;
        if (oldLink) document.head.removeChild(oldLink);
        document.head.appendChild(link);
      };
    
      let cloaker = JSON.parse(localStorage.getItem('cloaker'));
      if (cloaker.title) document.title = cloaker.title;
      if (cloaker.icon) favicon(cloaker.icon);
    } else localStorage.setItem('cloaker', JSON.stringify({}));
  };
  
  cloak();