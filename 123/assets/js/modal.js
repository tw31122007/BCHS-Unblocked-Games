// Get the modal, settings button, and close button elements
var modal = document.getElementById('settingsModal');
var settingsBtn = document.querySelector('.iframe-settings');
var closeBtn = document.querySelector('.close-btn');

// When the settings button is clicked, show the modal
settingsBtn.onclick = function() {
    modal.style.display = 'block';
}

// When the close button is clicked, hide the modal
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// When the user clicks anywhere outside the modal, hide it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Function to set theme
function setTheme(theme) {
    const bodyElement = document.body;
    const modalContent = document.getElementById('myModal'); // Get the modal-content

    if (!modalContent) return; // If modal-content doesn't exist, exit function

    if (theme === 'dark') {
      bodyElement.classList.add('dark-theme');
      bodyElement.classList.remove('light-theme');

      modalContent.classList.add('dark-theme');  // Apply dark theme to modal-content
      modalContent.classList.remove('light-theme');

      modalContent.style.borderColor = 'white';  // set border color for dark theme
    } else {
      bodyElement.classList.add('light-theme');
      bodyElement.classList.remove('dark-theme');

      modalContent.classList.add('light-theme');  // Apply light theme to modal-content
      modalContent.classList.remove('dark-theme');

      modalContent.style.borderColor = 'black';  // set border color for light theme
    }
}

// Load theme from localStorage or set default theme when DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const themeSelector = document.getElementById('themeSelector'); // Move this up

    var currentTheme = localStorage.getItem('theme') || 'dark';
    themeSelector.value = currentTheme;
    setTheme(currentTheme);

    themeSelector.addEventListener('change', () => {
        const selectedTheme = themeSelector.value;
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    });
});

