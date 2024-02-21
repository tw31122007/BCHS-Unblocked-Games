document.getElementById('addBox').onclick = function() {
    document.getElementById('addWebsitePopup').style.display = 'block';
  }
  function closePopup() {
    document.getElementById('addWebsitePopup').style.display = 'none';
  }
  function addNewBox() {
    var imageUrl = document.getElementById('imageUrl').value;
    var websiteUrl = document.getElementById('websiteUrl').value;
  
    var index = parseInt(localStorage.getItem('customBoxIndex') || 0) + 1;
  
    var customBoxKey = 'custombox' + index;
    var customBoxData = {
      imageUrl: imageUrl,
      websiteUrl: websiteUrl
    };
    localStorage.setItem(customBoxKey, JSON.stringify(customBoxData));
    localStorage.setItem('customBoxIndex', index.toString());
    createBoxElement(imageUrl, websiteUrl, index);
  }
  function createBoxElement(imageUrl, websiteUrl, index) {
    var container = document.querySelector('.box-container');
    var newBox = document.createElement('a');
    newBox.href = websiteUrl;
    newBox.className = 'box custom';
    newBox.style.backgroundImage = 'url(' + imageUrl + ')';
    newBox.setAttribute('data-index', index);
    attachContextMenuEvents(newBox);
    container.insertBefore(newBox, document.getElementById('addBox'));
  }
  window.onclick = function(event) {
    var popup = document.getElementById('addWebsitePopup');
    if (event.target === popup) {
        closePopup();
    }
  }
  function loadCustomBoxes() {
    var unpinnedBoxes = JSON.parse(localStorage.getItem('unpinnedBoxes') || '[]');
    var highestIndex = parseInt(localStorage.getItem('customBoxIndex'), 10) || 0;
    for (var i = 1; i <= highestIndex; i++) {
      if (unpinnedBoxes.includes('' + i)) {
        continue;
      }
  
      var customBoxKey = 'custombox' + i;
      var boxDataJSON = localStorage.getItem(customBoxKey);
      if (boxDataJSON) {
        var boxData = JSON.parse(boxDataJSON);
        createBoxElement(boxData.imageUrl, boxData.websiteUrl, i);
      }
    }
  }
  document.addEventListener('DOMContentLoaded', loadCustomBoxes);
  
  let currentBox = null;
  function showContextMenu(event, box) {
      event.preventDefault();
      currentBox = box;
      var contextMenu = document.getElementById('customContextMenu');
      contextMenu.style.display = 'block';
      contextMenu.style.left = event.pageX + 'px';
      contextMenu.style.top = event.pageY + 'px';
  }
  function saveUnpinnedState(index) {
    var unpinnedBoxes = JSON.parse(localStorage.getItem('unpinnedBoxes') || '[]');
    unpinnedBoxes.push(index);
    localStorage.setItem('unpinnedBoxes', JSON.stringify(unpinnedBoxes));
  }
  function hideContextMenu() {
      var contextMenu = document.getElementById('customContextMenu');
      contextMenu.style.display = 'none';
  }
  function unpinBox() {
    if (currentBox) {
      var index = currentBox.getAttribute('data-index');
      currentBox.remove();
      saveUnpinnedState(index);
      if (currentBox.classList.contains('custom')) {
        updateBoxIndices(index);
      }
    }
    hideContextMenu();
  }
  function startReorder() {
      hideContextMenu();
  }
  document.addEventListener('click', function(event) {
      hideContextMenu();
  });
  
  document.querySelectorAll('.box').forEach(function(box) {
      box.addEventListener('contextmenu', function(event) {
          showContextMenu(event, this);
      });
  });
  document.querySelectorAll('.box').forEach(function(box) {
      let timer;
      box.addEventListener('touchstart', function(event) {
          timer = setTimeout(function() {
              showContextMenu(event, box);
          }, 800);
      }, false);
      box.addEventListener('touchend', function(event) {
          clearTimeout(timer);
      }, false);
  });
  
  var boxContainer = document.querySelector('.box-container');
  boxContainer.addEventListener('contextmenu', function(event) {
      var target = event.target.closest('.box');
      if (target) {
          showContextMenu(event, target);
      }
  });
  boxContainer.addEventListener('touchstart', function(event) {
      var target = event.target.closest('.box');
      if (target) {
          let timer = setTimeout(function() {
              showContextMenu(event, target);
          }, 800);
  
          target.addEventListener('touchend', function() {
              clearTimeout(timer);
          }, { once: true });
      }
  }, false);
  
  function updateBoxIndices(removedIndex) {
    removedIndex = parseInt(removedIndex, 10);
    var highestIndex = parseInt(localStorage.getItem('customBoxIndex'), 10);
  
    for (var i = removedIndex + 1; i <= highestIndex; i++) {
      var boxData = localStorage.getItem('custombox' + i);
      localStorage.setItem('custombox' + (i - 1), boxData);
      localStorage.removeItem('custombox' + i);
    }
  
    localStorage.setItem('customBoxIndex', highestIndex - 1);
  }
  function attachContextMenuEvents(boxElement) {
    boxElement.addEventListener('contextmenu', function(event) {
        showContextMenu(event, this);
    });
    boxElement.addEventListener('touchstart', function(event) {
        let timer = setTimeout(() => showContextMenu(event, boxElement), 800);
        function cancelTimer() {
            clearTimeout(timer);
            boxElement.removeEventListener('touchend', cancelTimer);
            boxElement.removeEventListener('touchmove', cancelTimer);
        }
        boxElement.addEventListener('touchend', cancelTimer, { once: true });
        boxElement.addEventListener('touchmove', cancelTimer, { once: true });
    });
  }
  