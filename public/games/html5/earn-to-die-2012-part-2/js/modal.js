document.getElementById('close').addEventListener('click', function () {
    chrome.storage.local.set({closed: '1'});
});

document.getElementsByTagName('button')[0].addEventListener('click', function () {
    chrome.tabs.create({url: chrome.runtime.getURL('/index.html')}, function () {
        chrome.storage.local.set({opened: Date.now()});
    });
});

foreach(document.getElementsByClassName('trans'), function (a) {
    a.innerText = chrome.i18n.getMessage(a.getAttribute('data-text'))
});

function foreach(theArray, callback) {
    for (let index = 0; index < theArray.length; ++index) {
        if (theArray.hasOwnProperty(index))
            callback(theArray[index])
    }
}