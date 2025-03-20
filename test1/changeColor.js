const sellInput = document.getElementById("sellValue");
const buyInput = document.getElementById("buyValue");
const stockInput = document.getElementById("stockCount");
const outputElement = document.getElementById("resultOutput");
prevOutput = parseFloat(outputElement.value);

function updateResult() {
    setTimeout(() => {
        let result = parseFloat(outputElement.value);

        if (result > 0) {
            const saturation = Math.max(25, Math.min(result * 0.3, 100));
            outputElement.style.backgroundColor = `hsl(120, ${saturation}%, 60%)`;
        } else if (result < 0) {
            const saturation = Math.max(
                25,
                Math.min(Math.abs(result) * 0.3, 100)
            );
            outputElement.style.backgroundColor = `hsl(0, ${saturation}%, 60%)`;
        } else {
            outputElement.style.backgroundColor = "hsl(0, 0%, 100%)";
        }
    }, 100);
}

sellInput.addEventListener("input", updateResult);
buyInput.addEventListener("input", updateResult);
stockInput.addEventListener("input", updateResult);