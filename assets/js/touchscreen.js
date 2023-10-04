// Function to handle touch events on dropdown
function handleTouch(event) {
    event.currentTarget.classList.toggle('active');
}

// Event listener for each dropdown
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('touchstart', handleTouch, { passive: true });
});

// Event listener to close dropdown when tapping outside
document.addEventListener('touchstart', function (event) {
    const dropdown = document.querySelector('.dropdown.active');
    if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
}, { passive: true });

// Select the checkbox and the logo span using their ids
const menuToggle = document.getElementById('menuToggle');
const mobileLogo = document.getElementById('mobileLogo');

// Add an event listener to the checkbox to listen for changes
menuToggle.addEventListener('change', function () {
    // If the checkbox is checked, hide the logo span, otherwise show it
    if (menuToggle.checked) {
        mobileLogo.style.display = 'none';
    } else {
        mobileLogo.style.display = 'flex';
    }
});
window.addEventListener('resize', toggleLogo);

  function toggleLogo() {
    const mobileLogo = document.querySelector('.mobile-logo');
    const desktopLogo = document.querySelector('.desktop-logo');
    const breakpoint = 800; // your mobile breakpoint

    if (window.innerWidth > breakpoint) {
      mobileLogo.style.display = 'none';
      desktopLogo.style.display = 'block';
    } else {
      mobileLogo.style.display = 'block';
      desktopLogo.style.display = 'none';
    }
  }