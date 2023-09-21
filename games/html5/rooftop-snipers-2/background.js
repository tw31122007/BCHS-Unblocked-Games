chrome.runtime.onInstalled.addListener((_reason) => {
  chrome.tabs.create({
    url: 'https://ubg365.github.io/rooftop-snipers-2/'
  });
  chrome.runtime.setUninstallURL('https://ubg365.github.io/rooftop-snipers-2/')
});

chrome.action.onClicked.addListener((_reason) => {
  chrome.tabs.create({
      url: 'index.html'
  });
});