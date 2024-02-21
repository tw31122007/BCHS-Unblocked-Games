document.addEventListener('DOMContentLoaded', function() {
    loadBoxesFromLocalStorage();
    updateAddBoxVisibility();
    
    // Assuming you have some mechanism to add more boxes, call updateAddBoxVisibility() after adding
});

function loadBoxesFromLocalStorage() {
    let userBoxes = JSON.parse(localStorage.getItem('userBoxes') || "[]");
    userBoxes.forEach(box => {
        let div = document.createElement('div');
        div.classList.add('box', 'website');
        div.setAttribute('data-url', box.url);

        let img = document.createElement('img');
        img.src = box.imageUrl;
        img.alt = box.name + ' logo';
        div.appendChild(img);

        div.appendChild(document.createTextNode(box.name));
        document.querySelector('.box-container').insertBefore(div, document.getElementById('addBox'));
    });
}

function updateAddBoxVisibility() {
    const boxContainer = document.querySelector('.box-container');
    const totalBoxes = boxContainer.querySelectorAll('.box.website').length;

    if (totalBoxes >= 8) {
        document.getElementById('addBox').style.display = 'none';
    } else {
        document.getElementById('addBox').style.display = 'flex';
    }
}
function saveBoxesToLocalStorage() {
    const boxes = [...document.querySelectorAll('.box.website')];
    const userBoxes = boxes.map(box => ({
        url: box.getAttribute('data-url'),
        name: box.textContent,
        imageUrl: box.querySelector('img').src
    }));
    localStorage.setItem('userBoxes', JSON.stringify(userBoxes));
}

