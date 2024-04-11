document.addEventListener("DOMContentLoaded", function () {
    const colorPalette = document.querySelector(".color-palette");
    const selectedColorsContainer = document.querySelector(".selected-colors");
    const downloadButton = document.querySelector("#download");

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
        if (event.target.classList.contains("color")) {
            const changeColor = prompt("Enter the hex value of the new color:");

            if (changeColor) {
                event.target.style.backgroundColor = changeColor;
                updateLocalStorage();
            }
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
        newColorDiv.innerHTML = `
            <div class="color" style="background-color: ${color};"></div>
            <i class="far fa-trash-alt"></i>
        `;
        colorPalette.appendChild(newColorDiv);
        addColorEventListener(newColorDiv);
        updateLocalStorage();
    }

    // Function to add event listener to a color element
    function addColorEventListener(colorContainer) {
        colorContainer.querySelector(".color").addEventListener("click", function () {
            const changeColor = prompt("Enter the hex value of the new color:");

            if (changeColor) {
                this.style.backgroundColor = changeColor;
                updateLocalStorage();
            }
        });

        colorContainer.querySelector("i").addEventListener("click", function () {
            colorContainer.remove();
            updateLocalStorage();
        });
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

        // If no colors are saved, generate two random colors
        console.log(savedColors.length);
        console.log(savedColors);

        savedColors.forEach(color => {
            addNewPalette(color);
        });
    }

    // Function to download color palette as a text file
    downloadButton.addEventListener("click", function () {
        downloadColorPalette();
    });

    // Function to download color palette as a text file
    function downloadColorPalette() {
        const savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];
        const content = savedColors.join("\n");

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "color_palette.txt";
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to generate a random hex color
    function generateRandomHex() {
        const randHexColor = Math.floor(Math.random() * 16777215).toString(16);
        return '#' + randHexColor;
    }
});
