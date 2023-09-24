

// Checks if a CDN is blocked by testing the README.md file
async function isBlocked(url) {
  try {
    var README = await fetch(url + '/README.md');
    var content = await README.text();
    if (content.startsWith('# 3kh0 Assets')) {
      // The CDN is not blocked
      return false;
    } else {
      // The CDN is not returning a valid response or is blocked
      return true;
    }
  } catch {
    return true;
  }
}

async function getCDN(cdns) {
  for (let cdn of cdns) {
    var blocked = await isBlocked(cdn);
    if (!blocked) {
      return cdn;
    }
  }
  return cdns[0];
}

// Define some varibles for later
const path = location.pathname;
const origin = localStorage.getItem('instance');
const cdn = localStorage.getItem('cdn');
const queryString = window.location.search;
window.history.pushState({}, '', path);
const urlParams = new URLSearchParams(queryString);
const onLoadData = urlParams.get('onload');

const base = document.createElement('base');
base.href = location.origin + path.replace(path.split('\\').pop().split('/').pop(), '');
document.head.appendChild(base);

// If we do not have the origin var, we make it
if (!origin) {
  localStorage.setItem('instance', base.href);
  location.reload();
}

// If we do not have the cdn var, we make it
if (!cdn) {
  fetch('./assets/json/cdns.json')
    .then((res) => res.json())
    .then(async (cdns) => {
      localStorage.setItem('cdn', await getCDN(cdns));
      location.reload();
    });
}

const instance = encodeURIComponent(origin.replace(location.origin, ''));

// If we have onLoadData, we run it now
window.onload = () => {
  if (onLoadData) {
    eval(onLoadData);
  }
};

// If we have any errors, we will log it
window.onerror = (e) => {
  throw new Error(e);
};

// Collect Tab Cloak data from local storage
var tab = localStorage.getItem('tab');
if (tab) {
  try {
    // Parse the data, it is in JSON
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

// Set the Tab title if the Tab cloak data is there
if (tabData.title) {
  document.title = tabData.title;
}

// Set the Tab icon if the Tab cloak data is there
if (tabData.icon) {
  document.querySelector('link[rel="icon"]').href = tabData.icon;
}


