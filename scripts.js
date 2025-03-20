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

        // Reset z-index after dragging
        element.style.zIndex = '';
        element.style.opacity = '';

    }
}

function enableFloatingEffect() {
    const draggableElements = document.querySelectorAll('.draggable');

    draggableElements.forEach(el => {
        el.style.position = 'absolute'; // Ensure the elements are positioned absolutely

        // Set random initial positions
        const documentWidth = document.documentElement.scrollWidth;
        const documentHeight = document.documentElement.scrollHeight;
        const randomX = Math.random() * (documentWidth - el.offsetWidth);
        const randomY = Math.random() * (documentHeight - el.offsetHeight);
        el.style.left = `${randomX}px`;
        el.style.top = `${randomY}px`;

        // Set random velocities for each element (slower movement)
        const velocity = {
            x: (Math.random() - 0.5) * 0.5, // Slower speed
            y: (Math.random() - 0.5) * 0.5
        };

        // Function to move the element
        function moveElement() {
            const currentLeft = parseFloat(el.style.left);
            const currentTop = parseFloat(el.style.top);

            // Calculate new position
            let newLeft = currentLeft + velocity.x;
            let newTop = currentTop + velocity.y;

            // Bounce off the edges of the scrollable document
            if (newLeft <= 0 || newLeft >= documentWidth - el.offsetWidth) {
                velocity.x *= -1; // Reverse X direction
                newLeft = Math.max(0, Math.min(newLeft, documentWidth - el.offsetWidth));
            }
            if (newTop <= 0 || newTop >= documentHeight - el.offsetHeight) {
                velocity.y *= -1; // Reverse Y direction
                newTop = Math.max(0, Math.min(newTop, documentHeight - el.offsetHeight));
            }

            // Apply new position
            el.style.left = `${newLeft}px`;
            el.style.top = `${newTop}px`;

            // Repeat the movement
            requestAnimationFrame(moveElement);
        }

        // Start the movement
        moveElement();
    });
}

// Call the function after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", enableFloatingEffect);

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
        element.style.zIndex = '';
        element.style.opacity = '';
        element.style.position = '';
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

        fullscreenElement.style.opacity = ''; 
        fullscreenElement.style.zIndex = '';
        fullscreenElement.style.position = 'absolute';

    }
    hideOverlay();
}

function getDominantColor(image) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image onto the canvas
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Get pixel data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        let r = 0, g = 0, b = 0, totalPixels = 0;

        // Loop through pixels and average their RGB values
        for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];     // Red
            g += imageData[i + 1]; // Green
            b += imageData[i + 2]; // Blue
            totalPixels++;
        }

        // Average the RGB values
        r = Math.floor(r / totalPixels);
        g = Math.floor(g / totalPixels);
        b = Math.floor(b / totalPixels);

        resolve({ r, g, b });
    });
}

// sort by color, light to dark
function sortImagesByBrightness() {
    const container = document.querySelector('.draggable-container');
    const elements = Array.from(container.querySelectorAll('.draggable'));

    // Separate images and videos
    const images = elements.filter(el => el.tagName === 'IMG');
    const videos = elements.filter(el => el.tagName !== 'IMG'); // Non-image elements

    // Extract dominant colors and sort images
    Promise.all(
        images.map((img) =>
            getDominantColor(img).then((color) => ({
                img,
                brightness: 0.299 * color.r + 0.587 * color.g + 0.114 * color.b, // Brightness formula
            }))
        )
    ).then((results) => {
        // Sort images from light to dark based on brightness
        results.sort((a, b) => a.brightness - b.brightness);

        // Rearrange images and preserve videos
        container.innerHTML = ''; // Clear the container
        results.forEach(({ img }) => container.appendChild(img)); // Append sorted images
        videos.forEach(video => container.appendChild(video)); // Append videos back
    });
}

function rgbToHue({ r, g, b }) {
    r /= 255; g /= 255; b /= 255; // Normalize RGB values to 0–1
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue;

    if (max === min) {
        hue = 0; // No color
    } else if (max === r) {
        hue = ((g - b) / (max - min) + 6) % 6;
    } else if (max === g) {
        hue = ((b - r) / (max - min) + 2) % 6;
    } else {
        hue = ((r - g) / (max - min) + 4) % 6;
    }

    return Math.round(hue * 60); // Convert to degrees (0–360)
}

function sortImagesByHue() {
    const container = document.querySelector('.draggable-container');
    const elements = Array.from(container.querySelectorAll('.draggable'));

    // Separate images and videos
    const images = elements.filter(el => el.tagName === 'IMG');
    const videos = elements.filter(el => el.tagName !== 'IMG'); // Non-image elements

    // Extract dominant colors and sort images
    Promise.all(
        images.map((img) =>
            getDominantColor(img).then((color) => ({
                img,
                hue: rgbToHue(color), // Convert dominant color to hue
            }))
        )
    ).then((results) => {
        // Sort images by hue (red to violet)
        results.sort((a, b) => a.hue - b.hue);

        // Rearrange images and preserve videos
        container.innerHTML = ''; // Clear the container
        results.forEach(({ img }) => container.appendChild(img)); // Append sorted images
        videos.forEach(video => container.appendChild(video)); // Append videos back
    });
}


function sortImagesBySize() {
    const container = document.querySelector('.draggable-container');
    const images = Array.from(container.querySelectorAll('.draggable')).filter(el => el.tagName === 'IMG');

    // Extract image sizes and sort images
    const results = images.map(img => ({
        img,
        area: img.naturalWidth * img.naturalHeight, // Calculate area (width * height)
    }));

    // Sort images by size (ascending or descending)
    results.sort((a, b) => a.area - b.area); // Ascending order

    // Debugging: Log sorted areas
    console.log('Sorted by size (small to large):', results);

    // Rearrange images in the container
    container.innerHTML = ''; // Clear the container
    results.forEach(({ img }) => container.appendChild(img)); // Append images in sorted order
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

document.getElementById('gridButton').addEventListener('click', () => {
    const container = document.querySelector('.draggable-container');


    // Reset inline styles for all images
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach(el => {
        el.style.position = 'static';
        //el.style.top = ''; // Clear any inline top
        //el.style.left = ''; // Clear any inline left
    });

        // Show the "Sort by Color" button
        document.getElementById('sortByColorButton').style.display = 'block';
    });


document.getElementById('sortByColorButton').addEventListener('click', sortImagesByBrightness);

