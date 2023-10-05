let tabCount = 1; // Keeping track of the number of tabs

function openTab(tabId) {
    // Hide all tab content
    const content = document.getElementsByClassName('tab-content');
    for (let i = 0; i < content.length; i++) {
        content[i].style.display = 'none';
    }

    const iframeElem = document.querySelector(`#${tabId} iframe`);
    if (iframeElem.src === 'about:blank') {
        iframeElem.style.display = 'none';
        document.getElementById('newTabPage').style.display = 'block';
    } else {
        iframeElem.style.display = 'block';
        document.getElementById('newTabPage').style.display = 'none';
    }

    // Show the specific tab content
    document.getElementById(tabId).style.display = 'block';

    // Mark this tab as the active tab
    let allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => tab.classList.remove('active-tab'));
    let activeTab = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (activeTab) {
        activeTab.classList.add('active-tab');
    }
}
function loadURLInActiveTab(url) {
    const activeTabButton = document.querySelector('.tab.active-tab');
    const tabId = activeTabButton.getAttribute('data-tab-id');
    if(!tabId) {
        console.error("No tab ID found for active tab!");
        return;
    }

    const iframe = document.querySelector(`#${tabId} iframe`);
    iframe.parentElement.style.display = 'block';
    iframe.style.display = 'block';
    iframe.src = url; // This is the key change, moving src change here.
    iframe.focus();
    updateTabInfoFromIframe(tabId, iframe);
}

function updateTabInfoFromIframe(tabId, iframe) {
    const updateInfo = () => {
        const iframeDocument = iframe.contentDocument;
        const iframeTitle = iframeDocument.title;
        const truncatedTitle = truncateTitle(iframeTitle, 15);

        const associatedTab = document.querySelector(`[data-tab-id="${tabId}"]`);
        const titleSpan = associatedTab.querySelector('.tab-title');
        titleSpan.textContent = truncatedTitle || 'Home';

        const iconLink = iframeDocument.querySelector("link[rel~='icon']");
        const defaultFavicon = '/path/to/default/favicon.ico';
        const faviconURL = iconLink ? iconLink.href : defaultFavicon;
        const faviconSpan = associatedTab.querySelector('.favicon');
        const homeIcon = associatedTab.querySelector('.fa-solid.fa-house');

        if (iframeTitle) { // if there's a title, we hide the home icon
            homeIcon.style.display = 'none';
            faviconSpan.style.backgroundImage = `url(${faviconURL})`;
        } else { // if there isn't, we show the home icon and remove the favicon background
            homeIcon.style.display = 'inline-block';
            faviconSpan.style.backgroundImage = ''; // Remove the previous background image
        }
    };

    iframe.onload = updateInfo;  
    updateInfo();
}

function truncateTitle(title, maxLength) {
    if (title.length <= maxLength) return title;
    const words = title.split(' ');
    let truncated = '';
    for (let i = 0; i < words.length; i++) {
        if (truncated.length + words[i].length <= maxLength) {
            truncated += words[i] + ' ';
        } else {
            break;
        }
    }
    return truncated.trim();
}



function addTab() {
    tabCount++;
    console.log("Attempting to add a new tab. Current tab count:", tabCount);
    const newTab = document.createElement('button');
    newTab.className = 'tab';
    const faviconSpan = document.createElement('span');
    faviconSpan.className = 'favicon';
    newTab.appendChild(faviconSpan);
    const titleSpan = document.createElement('span');
    titleSpan.className = 'tab-title';
    titleSpan.textContent = 'Home'; 
    newTab.setAttribute('draggable', true);
    newTab.appendChild(titleSpan);
    const houseIcon = document.createElement('i');
    houseIcon.className = 'fa-solid fa-house';
    newTab.prepend(houseIcon);
    const closeButton = document.createElement('span');
    closeButton.className = 'close-tab-btn';
    closeButton.setAttribute('onclick', `event.stopPropagation(); closeTab('tab${tabCount}Content')`);
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-x';
    closeButton.appendChild(closeIcon);
    newTab.appendChild(closeButton);
    newTab.setAttribute('onclick', `openTab('tab${tabCount}Content')`);
    newTab.setAttribute('data-tab-id', `tab${tabCount}Content`);

    const tabsContainer = document.querySelector('.tabs');
    const plusButton = document.querySelector('.add-tab-btn');
    tabsContainer.insertBefore(newTab, plusButton);

    const newContent = document.createElement('div');
    newContent.className = 'tab-content';
    newContent.id = 'tab' + tabCount + 'Content';
    const newIframe = document.createElement('iframe');
    newIframe.setAttribute('src', 'about:blank');  
    newIframe.setAttribute('frameborder', '0');
    newContent.appendChild(newIframe);
    document.body.appendChild(newContent);
    
    document.getElementById('newTabPage').style.display = 'block';
    openTab('tab' + tabCount + 'Content');
    updateTabInfoFromIframe('tab' + tabCount + 'Content', newIframe);
}

function closeTab(tabId) {
    console.log("Attempting to close tab with ID:", tabId);
    const tabContent = document.getElementById(tabId);
    const tabButton = document.querySelector(`[data-tab-id="${tabId}"]`);
    const isActiveTab = tabButton.classList.contains('active-tab');
    const totalTabs = document.querySelectorAll('.tab').length;

    let nextTabId;

    if (isActiveTab) {
        // Decide which tab to switch to
        if (tabButton.previousElementSibling) { // Prioritize tab on the left
            nextTabId = tabButton.previousElementSibling.getAttribute('data-tab-id');
        } else if (tabButton.nextElementSibling) { // If no left tab, check right tab
            nextTabId = tabButton.nextElementSibling.getAttribute('data-tab-id');
        }
    }

    // Now, remove the tab
    tabContent.remove();
    tabButton.remove();

    if (totalTabs === 1) { // If it was the only tab, add a new one and make it active
        addTab();
    } else if (isActiveTab && nextTabId) {
        openTab(nextTabId);
    }
    reindexTabs();
}
function reindexTabs() {
    const allTabs = document.querySelectorAll('.tab');
    const allContents = document.querySelectorAll('.tab-content');

    allTabs.forEach((tab, index) => {
        const newTabId = "tab" + (index + 1) + "Content";
        const currentContentId = tab.getAttribute('data-tab-id');
        const currentContent = document.getElementById(currentContentId);
        
        // Update the tab's data-tab-id attribute
        tab.setAttribute('data-tab-id', newTabId);
        
        // Update the onclick and onclose functions
        tab.setAttribute('onclick', `openTab('${newTabId}')`);
        tab.querySelector('.close-tab-btn').setAttribute('onclick', `event.stopPropagation(); closeTab('${newTabId}')`);

        // Update the content's ID
        currentContent.id = newTabId;
    });

    // Update tabCount
    tabCount = allTabs.length;
}
function setFavicon(tabId, faviconURL) {
    const associatedTab = document.querySelector(`[data-tab-id="${tabId}"]`);
    const faviconSpan = associatedTab.querySelector('.favicon');
    if (faviconSpan) {
        faviconSpan.style.backgroundImage = `url(${faviconURL})`;
    }
}

function goBack() {
    window.history.back();
}

function goForward() {
    window.history.forward();
}

function reloadPage() {
    window.location.reload();
}
function goHome() {
    // 1. Identify the currently active tab's associated iframe.
    const activeTabButton = document.querySelector('.tab.active-tab');
    if(!activeTabButton) {
        console.error("No active tab found!");
        return;
    }

    const tabId = activeTabButton.getAttribute('data-tab-id');
    const iframe = document.querySelector(`#${tabId} iframe`);
    if(!iframe) {
        console.error(`No iframe found for tab ID: ${tabId}`);
        return;
    }

    // 2. Set the src of this iframe to "about:blank".
    iframe.src = "about:blank";

    // 3. Display the "new tab page" content in the active tab.
    iframe.style.display = 'none';
    document.getElementById('newTabPage').style.display = 'block';

    // Update the active tab's title to reflect "Home".
    const titleSpan = activeTabButton.querySelector('.tab-title');
    titleSpan.textContent = "Home";
}

document.addEventListener("DOMContentLoaded", function() {
    openTab('tab1Content');
});
let draggedTab = null;
let dropTarget = null;

document.addEventListener('dragstart', function(event) {
    draggedTab = event.target;

    // Suppress the drag image
    var img = new Image();
    event.dataTransfer.setDragImage(img, 0, 0);

    // Add a class to style the dragged tab if you wish (e.g., reduce opacity)
    draggedTab.classList.add('being-dragged');
}, false);

document.addEventListener('dragover', function(event) {
    event.preventDefault();

    // Detect the tab we're hovering over
    const currentTarget = event.target.closest('.tab');

    // If the tab exists and it's not the dragged tab
    if (currentTarget && draggedTab !== currentTarget) {
        const rect = currentTarget.getBoundingClientRect();
        const midpoint = rect.left + (rect.width / 2);  // Calculate midpoint of the target tab

        // Move the tab in real-time based on the cursor position relative to the midpoint
        if (event.clientX < midpoint) {
            currentTarget.parentNode.insertBefore(draggedTab, currentTarget);
        } else {
            currentTarget.parentNode.insertBefore(draggedTab, currentTarget.nextSibling);
        }
    }
}, false);

document.addEventListener('dragend', function(event) {
    draggedTab.classList.remove('being-dragged');
    draggedTab = null;
}, false);

// Example usage:
const title = "word1 word2 word3 word4";
const truncatedTitle = truncateTitle(title, 15); // "word1 word2 wor"

// Adds a loading screen
document.getElementById('uv-address').addEventListener('input', function() {
    let activeTabContent = getActiveTabContent();
    activeTabContent.classList.add('loading-bg');
});
document.getElementById('url-address').addEventListener('input', function() {
    let activeTabContent = getActiveTabContent();
    activeTabContent.classList.add('loading-bg');
});
function getActiveTabContent() {
    let activeTabId = document.querySelector('.active-tab').getAttribute('data-tab-id');
    return document.getElementById(activeTabId);
}
let iframes = document.querySelectorAll('iframe');

iframes.forEach(iframe => {
    iframe.addEventListener('load', function() {
        let parentTabContent = this.closest('.tab-content');
        parentTabContent.classList.remove('loading-bg');
    });
});
function updatebackground() {
    let activeTabContent = getActiveTabContent();
    console.log(activeTabContent); // Check if this logs the correct element
    activeTabContent.classList.add('loading-bg');
}
window.onerror = function (message, source, lineno, colno, error) {
    console.error("Error caught:", message, "Source:", source, "Line:", lineno, "Column:", colno, "Error object:", error);
};
