"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  const url = search(address.value, searchEngine.value);
  const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
  localStorage.setItem('storedURL', encodedUrl);
  localStorage.setItem('shownameandimg', 'false')
  setIframeType('index')
  location.href="/iframe.html"
});

async function launchURL(openURL) {
  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  const url = search(openURL, searchEngine.value);
  const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
  localStorage.setItem('storedURL', encodedUrl);
  window.location.href="/iframe.html"
}

// Makes the back button on the iframe page go back to the previous page correctly
function setIframeType(type) {
  localStorage.setItem('iframe-type', type);
}

// Makes the blinking cursor appear when the searchbar is hovered over
document.getElementById('uv-address').addEventListener('mouseover', function() {
  this.focus();
});

// JavaScript to handle the popup and add new boxes
document.getElementById('addBox').onclick = function() {
  document.getElementById('addWebsitePopup').style.display = 'block';
}

function closePopup() {
  document.getElementById('addWebsitePopup').style.display = 'none';
}
function addNewBox() {
  var imageUrl = document.getElementById('imageUrl').value;
  var websiteUrl = document.getElementById('websiteUrl').value;

  // Get the current index for the custom box
  var index = localStorage.getItem('customBoxIndex') || 0;
  index = parseInt(index, 10) + 1; // Increment the index

  // Create new anchor element
  var newBox = document.createElement('a');
  newBox.href = websiteUrl;
  newBox.className = 'box custom';
  newBox.style.backgroundImage = 'url(' + imageUrl + ')';
  newBox.setAttribute('data-index', index); // Set a data attribute to keep track of the box

  // Add the new box to the container
  var container = document.querySelector('.box-container');
  container.insertBefore(newBox, document.getElementById('addBox')); // Insert before the plus box

  // Save the new box details to localStorage
  localStorage.setItem('customBoxIndex', index);
  localStorage.setItem('custombox' + index + 'websiteurl', websiteUrl);
  localStorage.setItem('custombox' + index + 'imageurl', imageUrl);

   // Attach the contextmenu event listener to the new box
   newBox.addEventListener('contextmenu', function(event) {
    showContextMenu(event, this);
  });
  // Attach the touchstart event listener for long press on touch devices
  newBox.addEventListener('touchstart', function(event) {
    let timer = setTimeout(function() {
        showContextMenu(event, newBox);
    }, 800); // Trigger after 800ms

    // Clear the timer if the touch ends
    newBox.addEventListener('touchend', function() {
        clearTimeout(timer);
    }, { once: true });
  }, false);

  // Close the popup
  closePopup();
}

// Optional: Close the popup when clicking outside of it
window.onclick = function(event) {
  var popup = document.getElementById('addWebsitePopup');
  if (event.target === popup) {
      closePopup();
  }
}
function loadCustomBoxes() {
  var index = localStorage.getItem('customBoxIndex') || 0;
  for (var i = 1; i <= index; i++) {
      var websiteUrl = localStorage.getItem('custombox' + i + 'websiteurl');
      var imageUrl = localStorage.getItem('custombox' + i + 'imageurl');

      if (websiteUrl && imageUrl) {
          // Create new anchor element
          var newBox = document.createElement('a');
          newBox.href = websiteUrl;
          newBox.className = 'box custom';
          newBox.style.backgroundImage = 'url(' + imageUrl + ')';
          newBox.setAttribute('data-index', i);

          // Add the new box to the container
          var container = document.querySelector('.box-container');
          container.insertBefore(newBox, document.getElementById('addBox'));
      }
  }
}
// Call loadCustomBoxes on page load
document.addEventListener('DOMContentLoaded', loadCustomBoxes);

let currentBox = null; // To hold the currently selected box
// Function to show the custom context menu
function showContextMenu(event, box) {
    event.preventDefault(); // Prevent the default context menu from showing
    currentBox = box; // Set the current box to the one that was right-clicked

    var contextMenu = document.getElementById('customContextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
}

// Function to hide the context menu
function hideContextMenu() {
    var contextMenu = document.getElementById('customContextMenu');
    contextMenu.style.display = 'none';
}

// Function to unpin a box
function unpinBox() {
  if (currentBox) {
      // Assuming that currentBox has a data attribute like 'data-index="1"'
      var index = currentBox.getAttribute('data-index');
      currentBox.remove(); // Removes the box from the DOM

      // Remove from localStorage
      localStorage.removeItem('custombox' + index + 'websiteurl');
      localStorage.removeItem('custombox' + index + 'imageurl');

      // Update the index for other boxes
      updateBoxIndices(index);
  }
  hideContextMenu();
}

// Function to initiate the reorder process
function startReorder() {
    // Logic for reordering the boxes
    hideContextMenu();
}

// Add event listener to hide the context menu on click
document.addEventListener('click', function(event) {
    hideContextMenu();
});

// Add contextmenu event listener to all boxes
document.querySelectorAll('.box').forEach(function(box) {
    box.addEventListener('contextmenu', function(event) {
        showContextMenu(event, this);
    });
});

// Add long press event listener to all boxes for touch devices
document.querySelectorAll('.box').forEach(function(box) {
    let timer;
    box.addEventListener('touchstart', function(event) {
        timer = setTimeout(function() {
            showContextMenu(event, box);
        }, 800); // Trigger after 800ms
    }, false);
    box.addEventListener('touchend', function(event) {
        clearTimeout(timer); // Clear the timer if touch ends
    }, false);
});

// Get the box container
var boxContainer = document.querySelector('.box-container');

// Delegate the contextmenu event for all .box elements
boxContainer.addEventListener('contextmenu', function(event) {
    // Check if the target is a .box or a child of a .box
    var target = event.target.closest('.box');
    if (target) {
        showContextMenu(event, target);
    }
});

// Delegate the touchstart event for all .box elements for touch devices
boxContainer.addEventListener('touchstart', function(event) {
    var target = event.target.closest('.box');
    if (target) {
        let timer = setTimeout(function() {
            showContextMenu(event, target);
        }, 800); // Trigger after 800ms

        // Clear the timer if the touch ends
        target.addEventListener('touchend', function() {
            clearTimeout(timer);
        }, { once: true });
    }
}, false);

function updateBoxIndices(removedIndex) {
  // Convert the removedIndex to an integer
  removedIndex = parseInt(removedIndex, 10);

  // Get the current highest index
  var highestIndex = parseInt(localStorage.getItem('customBoxIndex'), 10);

  // Loop through the remaining boxes and update their indices
  for (var i = removedIndex + 1; i <= highestIndex; i++) {
      var nextWebsiteUrl = localStorage.getItem('custombox' + i + 'websiteurl');
      var nextImageUrl = localStorage.getItem('custombox' + i + 'imageurl');

      // Move each item down in the index
      localStorage.setItem('custombox' + (i - 1) + 'websiteurl', nextWebsiteUrl);
      localStorage.setItem('custombox' + (i - 1) + 'imageurl', nextImageUrl);

      // Update the data-index attribute of the box elements
      var boxToUpdate = document.querySelector('.box[data-index="' + i + '"]');
      if (boxToUpdate) {
          boxToUpdate.setAttribute('data-index', i - 1);
      }

      // Remove the now-obsolete local storage entry
      localStorage.removeItem('custombox' + i + 'websiteurl');
      localStorage.removeItem('custombox' + i + 'imageurl');
  }

  // Update the customBoxIndex to reflect the removed box
  localStorage.setItem('customBoxIndex', highestIndex - 1);
}