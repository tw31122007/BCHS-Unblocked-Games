function redirectToWebsite() {
    const keyInput = document.getElementById('key-input');
    const websiteInput = document.getElementById('website-input');
  
    // Retrieve stored values from local storage
    const storedKey = localStorage.getItem('panicKey');
    const storedWebsite = localStorage.getItem('panicWebsite');
  
    // Set default values if no stored values found
    const defaultKey = storedKey || ']';
    const defaultWebsite = storedWebsite || 'https://classroom.google.com';
  
    // Set input values to stored values or defaults
    keyInput.value = defaultKey;
    websiteInput.value = defaultWebsite;
  
    // Save input values to local storage on input change
    keyInput.addEventListener('input', function() {
      localStorage.setItem('panicKey', keyInput.value);
    });
  
    websiteInput.addEventListener('input', function() {
      localStorage.setItem('panicWebsite', websiteInput.value);
    });
  
    document.addEventListener('keyup', function(event) {
      if (event.key === keyInput.value) {
        let url = websiteInput.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'http://' + url;
        }
        window.location.href = url;
      }
    });
  }
  
  redirectToWebsite();
  