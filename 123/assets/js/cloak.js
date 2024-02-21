// Check if there is a saved tab data in localStorage
var tab = localStorage.getItem("tab");

if (tab) {
  // If there is saved data, try to parse it
  try {
    var tabData = JSON.parse(tab);
    // Apply saved favicon and title
    if (tabData.title) {
      document.title = tabData.title;
    }
    if (tabData.icon) {
      document.querySelector("link[rel='icon']").href = tabData.icon;
    }
  } catch {
    // If there's a parsing error, you can handle or ignore it
  }
}
