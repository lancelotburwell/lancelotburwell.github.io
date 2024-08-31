function setRandomPosition(element) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imgWidth = element.offsetWidth;
    const imgHeight = element.offsetHeight;

    // Calculate random position
    const randomX = Math.random() * (viewportWidth - imgWidth);
    const randomY = Math.random() * (2 * viewportHeight - imgHeight);

    // Set position
    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;
}

function makeElementDraggable(element) {
    let posX = 0, posY = 0, startX = 0, startY = 0;

    // Event listeners for mouse events
    element.onmousedown = startDragging;
    element.ontouchstart = startDragging; // Added for mobile

    function startDragging(e) {
        e.preventDefault();

        // Check if it's a touch event or mouse event
        if (e.type === "touchstart") {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            document.ontouchmove = dragElement;
            document.ontouchend = stopDragging;
        } else {
            startX = e.clientX;
            startY = e.clientY;
            document.onmousemove = dragElement;
            document.onmouseup = stopDragging;
        }

        // Set full opacity when dragging starts
        element.style.opacity = "1";
    }

    function dragElement(e) {
        e.preventDefault();

        let currentX, currentY;

        // Check if it's a touch event or mouse event
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        } else {
            currentX = e.clientX;
            currentY = e.clientY;
        }

        posX = startX - currentX;
        posY = startY - currentY;
        startX = currentX;
        startY = currentY;

        element.style.top = (element.offsetTop - posY) + "px";
        element.style.left = (element.offsetLeft - posX) + "px";
    }

    function stopDragging() {
        // Reset event listeners
        document.onmousemove = null;
        document.onmouseup = null;
        document.ontouchmove = null;
        document.ontouchend = null;

        // Revert to 70% transparency when dragging stops
        element.style.opacity = "0.7";
    }
}

function toggleFullscreen(event) {
    const element = event.target;
    const isFullscreen = element.classList.toggle('fullscreen');

    // Set full opacity if entering fullscreen, else set it back to 70%
    if (isFullscreen) {
        element.style.opacity = "1";
    } else {
        element.style.opacity = "0.7";
    }
}

// Apply random positions, make elements draggable, and handle opacity
window.onload = function () {
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach(el => {
        setRandomPosition(el);
        makeElementDraggable(el);
        el.ondblclick = toggleFullscreen; // Add double-click event listener

        // Set default opacity to 70%
        el.style.opacity = "0.7";
    });
};
