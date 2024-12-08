function setRandomPosition(element) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imgWidth = element.offsetWidth;
    const imgHeight = element.offsetHeight;

    // Calculate random position within viewport bounds
    const randomX = Math.random() * (viewportWidth - imgWidth);
    const randomY = Math.random() * (2 * viewportHeight - imgHeight);

    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;
}

function initializeRandomPositions() {
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach(el => {
        // Ensure visibility during randomization
        el.style.position = 'absolute';
        setRandomPosition(el);
    });
}

// Initialize positions as soon as DOM is ready
document.addEventListener("DOMContentLoaded", initializeRandomPositions);

function makeElementDraggable(element) {
    let posX = 0, posY = 0, startX = 0, startY = 0;

    element.onmousedown = startDragging;
    element.ontouchstart = startDragging;

    function startDragging(e) {
        e.preventDefault();

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

        // Increase opacity when dragging starts
        element.style.opacity = "1";
        element.style.zIndex = 999; // Bring to front while dragging
    }

    function dragElement(e) {
        e.preventDefault();

        let currentX, currentY;
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

        // Calculate new position
        let newTop = element.offsetTop - posY;
        let newLeft = element.offsetLeft - posX;

        // Constrain within viewport
        const maxLeft = window.innerWidth - element.offsetWidth;
        const maxTop = document.documentElement.scrollHeight - element.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function stopDragging() {
        document.onmousemove = null;
        document.onmouseup = null;
        document.ontouchmove = null;
        document.ontouchend = null;

        // If not fullscreen, revert to 70%
        if (!element.classList.contains('fullscreen')) {
            element.style.opacity = "0.7";
        }

        // Reset z-index after dragging
        element.style.zIndex = 1;
    }
}

function toggleFullscreen(event) {
    const element = event.target;

    if (!element.classList.contains('fullscreen')) {
        // Save the current position before going fullscreen
        element.dataset.originalTop = element.style.top;
        element.dataset.originalLeft = element.style.left;
    }
    const isFullscreen = element.classList.toggle('fullscreen');

    if (isFullscreen) {
        // Clear inline positioning so the fullscreen class can center it
        element.style.top = '';
        element.style.left = '';
        element.style.position = 'fixed';
        element.style.zIndex = 9999; // Bring to front when fullscreen
        element.style.opacity = "1";
        showOverlay();
    } else {
        exitFullscreen();
    }
}

function showOverlay() {
    // Create a fullscreen overlay if it doesn’t exist
    let overlay = document.querySelector('.fullscreen-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.addEventListener('click', exitFullscreen);
        document.body.appendChild(overlay);
    }
}

function hideOverlay() {
    const overlay = document.querySelector('.fullscreen-overlay');
    if (overlay) {
        overlay.removeEventListener('click', exitFullscreen);
        overlay.remove();
    }
}

function exitFullscreen() {
    const fullscreenElement = document.querySelector('.draggable.fullscreen');
    if (fullscreenElement) {
        fullscreenElement.classList.remove('fullscreen');
        
        // Restore the original position
        fullscreenElement.style.top = fullscreenElement.dataset.originalTop || '0px';
        fullscreenElement.style.left = fullscreenElement.dataset.originalLeft || '0px';

        fullscreenElement.style.opacity = "0.7"; // Reset opacity to 0.7 after exiting fullscreen
        fullscreenElement.style.zIndex = 1; // Reset z-index after exiting fullscreen
    }
    hideOverlay();
}

// Allow exiting fullscreen with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        exitFullscreen();
    }
});

// On load, set random positions and make draggable
window.onload = function () {
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach(el => {
        setRandomPosition(el);
        makeElementDraggable(el);
        el.ondblclick = toggleFullscreen;
    });
};

