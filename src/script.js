document.addEventListener("DOMContentLoaded", function () {
    const colorPalette = document.querySelector(".color-palette");
    const selectedColorsContainer = document.querySelector(".selected-colors");
    const downloadButton = document.querySelector("#download");
    const updateButton = document.querySelector("#update");

    colorPalette.innerHTML = ""; // Clear the palette
    generateRandomColors(2); // Generate two random colors
    // Load saved colors from local storage or generate random colors
    loadSavedColors();

    // Add event listener to the "Add Palette" button
    const addBtn = document.getElementById("add-button");
    addBtn.onclick = (event) => {
        event.preventDefault();
        if (colorPalette.children.length >= 10) {
            // alert("Maximum number of colors reached (10).");
            return;
        }
        const newColor = prompt("Enter the hex value of the new palette:");

        if (newColor) {
            addNewPalette(newColor);
        }
    };

    // Add event listeners to existing color divs
    colorPalette.addEventListener("click", function (event) {
        const target = event.target;

        // If the click target is the delete icon, delete the color container
        if (target.classList.contains("fa-trash-alt")) {
            const colorContainer = target.closest(".color-container");
            if (colorContainer) {
                colorContainer.remove();
                updateLocalStorage();
            }
        }
        // Determine text color and icon color based on background color brightness
        const colorDiv = target.closest(".color");
        if (colorDiv) {
            var rgb = bgColor.match(/\d+/g);

            const colorStyle = getComputedStyle(colorDiv);
            const bgColor = colorStyle.backgroundColor;
            const iconColor = getTextColorForRGB(rgb[0], rbg[1], rgb[2]);
            const textColor = iconColor;

            // Set the color of the icons
            const icons = colorDiv.querySelectorAll("i");
            icons.forEach(icon => {
                icon.style.color = iconColor;
            });
        }
    }); 

    /// Listen for input event on color inputs to change color
    colorPalette.addEventListener("input", function (event) {
        const target = event.target;
        if (target.classList.contains("color-input")) {
            const newColor = target.value;
            target.closest(".color-container").querySelector(".color").style.backgroundColor = newColor;
            updateLocalStorage();
        }
    });

    // Function to make color containers draggable
    colorPalette.addEventListener("dragstart", function (event) {
        const target = event.target.closest(".color-container");
        if (target) {
            event.dataTransfer.setData("text/plain", target.id);
        }
    });

    colorPalette.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    colorPalette.addEventListener("drop", function (event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        const draggableElement = document.getElementById(data);
        const dropzone = event.target.closest(".color-container");

        // Check if dropzone exists and is not the draggable element itself
        // if (dropzone && draggableElement && draggableElement !== dropzone) {
        //     // Swap positions if draggableElement is being dropped onto another color container
        //     const draggableNextSibling = draggableElement.nextElementSibling;
        //     const dropzoneNextSibling = dropzone.nextElementSibling;

        //     if (dropzoneNextSibling === draggableElement) {
        //         // If the draggable element is the next sibling of the dropzone,
        //         // insert the draggable element before the dropzone and the dropzone before the draggable element
        //         colorPalette.insertBefore(draggableElement, dropzone);
        //         colorPalette.insertBefore(dropzone, draggableNextSibling);
        //     } else {
        //         // Otherwise, swap the positions of the draggable element and the dropzone
        //         colorPalette.insertBefore(dropzone, draggableElement);
        //         if (draggableNextSibling) {
        //             colorPalette.insertBefore(draggableElement, draggableNextSibling);
        //         } else {
        //             colorPalette.appendChild(draggableElement);
        //         }
        //     }
        //     updateLocalStorage();
        // }
    });

    // Event listener for the update button
    updateButton.addEventListener("click", function () {
        updateSelectedColors();
    });

    function updateSelectedColors() {
        selectedColorsContainer.innerHTML = ""; // Clear the selected colors div
        const colorContainers = document.querySelectorAll(".color-container");
        colorContainers.forEach(container => {
            const color = container.querySelector(".color").style.backgroundColor;
            const selectedColorDiv = document.createElement("div");
            selectedColorDiv.classList.add("selected-color");
            selectedColorDiv.style.backgroundColor = color;
            selectedColorsContainer.appendChild(selectedColorDiv);
        });
    }

    // Listen for input event on color inputs to change color
    colorPalette.addEventListener("input", function (event) {
        const target = event.target;
        if (target.classList.contains("color-input")) {
            const newColor = target.value;
            target.closest(".color-container").querySelector(".color").style.backgroundColor = newColor;
            updateLocalStorage();
        }
    });

    // Function to generate random hex colors
    function generateRandomColors(numColors) {
        for (let i = 0; i < numColors; i++) {
            const newColor = generateRandomHex();
            addNewPalette(newColor);
        }
    }

    // Function to add a new color palette
    function addNewPalette(color) {
        if (colorPalette.children.length >= 10) {
            // alert("Maximum number of colors reached (10).");
            return;
        }
        const newColorDiv = document.createElement("div");
        newColorDiv.classList.add("color-container"); // Container for color and icon
        newColorDiv.setAttribute('draggable', true);
        newColorDiv.setAttribute('color', true);
        newColorDiv.innerHTML = `
            <div class="color" style="background-color: ${color};">
                <i class="far fa-trash-alt"></i>
                <i class="fa-regular fa-arrows-left-right"></i>
                <i class="fa-regular fa-circle-half-stroke"></i>
                <i class="fa-regular fa-border-all"></i>
                <span class="color-code"><input type="color" class="color-input" value="${color}" />${color}</span>
            </div>
        `;
        colorPalette.appendChild(newColorDiv);
        updateLocalStorage();
    }

    // Function to save the color palette to local storage
    function updateLocalStorage() {
        const colorContainers = document.querySelectorAll(".color-container");
        const savedColors = Array.from(colorContainers).map(container => container.querySelector(".color").style.backgroundColor);
        localStorage.setItem("savedColors", JSON.stringify(savedColors));
    }

    // Function to load saved colors from local storage or generate random colors
    function loadSavedColors() {
        let savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];

        // // If no colors are saved, generate two random colors
        // savedColors.forEach(color => {
        //     addNewPalette(color);
        // });
    }

    // Function to download color palette as a text file
    downloadButton.addEventListener("click", function () {
        downloadColorPalette();
    });

    /// Function to download color palette as a PNG image
    function downloadColorPalette() {
        const savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];

        // Create a canvas element
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions
        const paletteWidth = 1600;
        const paletteHeight = 1200;
        canvas.width = paletteWidth;
        canvas.height = paletteHeight;

        // Draw each color on the canvas
        const numColors = savedColors.length;
        const colorBoxHeight = paletteHeight / numColors;
        const labelOffsetX = 20;
        const labelOffsetY = colorBoxHeight / 2;
        const fontSize = 24;

        savedColors.forEach((color, index) => {
            // Draw color box
            context.fillStyle = color;
            context.fillRect(0, index * colorBoxHeight, paletteWidth, colorBoxHeight);

            var rgb = color.match(/\d+/g);
            // Determine text color based on color brightness
            const textColor = getTextColorForRGB(rgb[0], rgb[1], rgb[2]);

            context.fillStyle = textColor;

            // Draw hex color label
            context.font = `${fontSize}px Arial`;
            context.fillText(color, labelOffsetX, index * colorBoxHeight + labelOffsetY);
        });

        // Convert canvas to PNG image
        const dataURL = canvas.toDataURL("image/png");

        // Create a link element to download the image
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "color_palette.png";
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
    }

    // Function to determine text color based on RGB values
    function getTextColorForRGB(r, g, b) {
        // Calculate brightness using luminance formula
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

        console.log(brightness);
        // Return black or white text color based on brightness
        return brightness > 128 ? "black" : "white";
    }


    // Function to generate a random hex color
    function generateRandomHex() {
        const randHexColor = Math.floor(Math.random() * 16777215).toString(16);
        return '#' + randHexColor;
    }
});
