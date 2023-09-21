function openNewTab() {
    const currentURL = window.location.href;
    const newTab = window.open('about:blank', '_blank');
    newTab.document.write('<html lang="en"><body style="margin: 0; padding: 0;"><embed src="' + currentURL + '" style="width: 100%; height: 100%;"></embed></body></html>');
    newTab.document.close();
  }
  
  function openNewWindow() {
    const currentURL = window.location.href;
    const newWindow = window.open('about:blank', '_blank', 'width=800,height=600');
    newWindow.document.write('<html lang="en"><body style="margin: 0; padding: 0;"><embed src="' + currentURL + '" style="width: 100%; height: 100%;"></embed></body></html>');
    newWindow.document.close();
  }
  