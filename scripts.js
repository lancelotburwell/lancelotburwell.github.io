// scripts.js


function setRandomPosition(element) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imgWidth = element.offsetWidth;
    const imgHeight = element.offsetHeight;

    // Calculate random position
    const randomX = Math.random() * (viewportWidth - imgWidth);
    const randomY = Math.random() * (1.5 * viewportHeight - imgHeight);

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

        // Change to full opacity when dragging starts
        element.style.opacity = "1";

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

        // Revert to 60% transparency when dragging stops
        element.style.opacity = "0.6";
    }
}

function toggleFullscreen(event) {
    const element = event.target;
    const isFullscreen = element.classList.toggle('fullscreen');

    // Set full opacity if entering fullscreen, else set it back to 60%
    if (isFullscreen) {
        element.style.opacity = "1";
    } else {
        element.style.opacity = "0.6";
    }
}

// Apply random positions, make elements draggable, and handle opacity
window.onload = function () {
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach(el => {
        setRandomPosition(el);
        makeElementDraggable(el);
        el.ondblclick = toggleFullscreen; // Add double-click event listener

        // Set default opacity to 60%
        el.style.opacity = "0.6";
    });
};
