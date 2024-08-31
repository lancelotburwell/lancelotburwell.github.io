// scripts.js


function setRandomPosition(element) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imgWidth = element.offsetWidth;
    const imgHeight = element.offsetHeight;

    // Calculate random position
    const randomX = Math.random() * (viewportWidth - imgWidth);
    const randomY = Math.random() * (1.5*viewportHeight - imgHeight);

    // Set position
    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;
}

function makeElementDraggable(element) {
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

    element.onmousedown = function (e) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.onmousemove = dragElement;
        document.onmouseup = stopDragging;
    };

    function dragElement(e) {
        e.preventDefault();
        posX = mouseX - e.clientX;
        posY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        element.style.top = (element.offsetTop - posY) + "px";
        element.style.left = (element.offsetLeft - posX) + "px";
    }

    function stopDragging() {
        document.onmousemove = null;
        document.onmouseup = null;
    }
}


function toggleFullscreen(event) {
    const element = event.target;
    element.classList.toggle('fullscreen');
}

// Apply random positions and make elements draggable
window.onload = function() {
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach(el => {
        setRandomPosition(el);
        makeElementDraggable(el);
        el.ondblclick = toggleFullscreen; // Add double-click event listener
    });
};
